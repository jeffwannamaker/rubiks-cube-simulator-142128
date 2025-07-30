/**
 * Rubik's Cube State Validator and Debug Utilities
 */

// PUBLIC_INTERFACE
export class CubeValidator {
    constructor(cubeSize = 3) {
        this.cubeSize = cubeSize;
        this.expectedColors = ['white', 'yellow', 'red', 'orange', 'green', 'blue'];
    }
    
    // PUBLIC_INTERFACE
    validateCubeState(cubelets) {
        /**
         * Validate the current state of the cube
         * @param {Array} cubelets - Array of cubelet objects
         * @returns {object} Validation result
         */
        const result = {
            isValid: true,
            errors: [],
            warnings: [],
            statistics: {}
        };
        
        if (!cubelets || cubelets.length === 0) {
            result.isValid = false;
            result.errors.push('No cubelets provided');
            return result;
        }
        
        // Check total number of cubelets
        const expectedCount = this.cubeSize ** 3;
        if (cubelets.length !== expectedCount) {
            result.isValid = false;
            result.errors.push(`Expected ${expectedCount} cubelets, found ${cubelets.length}`);
        }
        
        // Check for duplicate positions
        const positions = new Set();
        const duplicates = [];
        
        cubelets.forEach((cubelet, index) => {
            const posKey = `${cubelet.x},${cubelet.y},${cubelet.z}`;
            if (positions.has(posKey)) {
                duplicates.push(`Position ${posKey} used by multiple cubelets`);
            }
            positions.add(posKey);
        });
        
        if (duplicates.length > 0) {
            result.isValid = false;
            result.errors.push(...duplicates);
        }
        
        // Validate position ranges
        cubelets.forEach((cubelet, index) => {
            if (cubelet.x < 0 || cubelet.x >= this.cubeSize ||
                cubelet.y < 0 || cubelet.y >= this.cubeSize ||
                cubelet.z < 0 || cubelet.z >= this.cubeSize) {
                result.errors.push(`Cubelet ${index} has invalid position: (${cubelet.x}, ${cubelet.y}, ${cubelet.z})`);
                result.isValid = false;
            }
        });
        
        // Calculate statistics
        result.statistics = this.calculateStatistics(cubelets);
        
        return result;
    }
    
    calculateStatistics(cubelets) {
        const stats = {
            totalCubelets: cubelets.length,
            cornerPieces: 0,
            edgePieces: 0,
            centerPieces: 0,
            interiorPieces: 0,
            byLayer: {}
        };
        
        const center = (this.cubeSize - 1) / 2;
        
        cubelets.forEach(cubelet => {
            const { x, y, z } = cubelet;
            
            // Count faces on exterior
            let exteriorFaces = 0;
            if (x === 0 || x === this.cubeSize - 1) exteriorFaces++;
            if (y === 0 || y === this.cubeSize - 1) exteriorFaces++;
            if (z === 0 || z === this.cubeSize - 1) exteriorFaces++;
            
            // Classify piece type
            if (exteriorFaces === 3) {
                stats.cornerPieces++;
            } else if (exteriorFaces === 2) {
                stats.edgePieces++;
            } else if (exteriorFaces === 1) {
                stats.centerPieces++;
            } else {
                stats.interiorPieces++;
            }
            
            // Count by layer (Y-axis)
            if (!stats.byLayer[y]) stats.byLayer[y] = 0;
            stats.byLayer[y]++;
        });
        
        return stats;
    }
    
    // PUBLIC_INTERFACE
    checkSolvedState(cubelets) {
        /**
         * Check if the cube is in a solved state
         * @param {Array} cubelets - Array of cubelet objects
         * @returns {object} Result indicating if cube is solved
         */
        const result = {
            isSolved: false,
            completedFaces: [],
            incompleteFaces: [],
            progress: 0
        };
        
        // For a simplified check, we'll verify that cubelets are in their original positions
        let correctPositions = 0;
        
        cubelets.forEach(cubelet => {
            // Check if cubelet is in its original position (simplified)
            const originalPos = cubelet.originalPosition;
            const currentPos = cubelet.mesh.position;
            
            const threshold = 0.1; // Tolerance for floating point comparison
            if (originalPos && 
                Math.abs(currentPos.x - originalPos.x) < threshold &&
                Math.abs(currentPos.y - originalPos.y) < threshold &&
                Math.abs(currentPos.z - originalPos.z) < threshold) {
                correctPositions++;
            }
        });
        
        result.progress = (correctPositions / cubelets.length) * 100;
        result.isSolved = result.progress >= 99; // Allow for small floating point errors
        
        return result;
    }
    
    // PUBLIC_INTERFACE
    generateDebugInfo(cubelets, moveHistory = []) {
        /**
         * Generate comprehensive debug information
         * @param {Array} cubelets - Array of cubelet objects
         * @param {Array} moveHistory - History of moves performed
         * @returns {object} Debug information
         */
        const validation = this.validateCubeState(cubelets);
        const solvedState = this.checkSolvedState(cubelets);
        
        return {
            timestamp: new Date().toISOString(),
            cubeSize: this.cubeSize,
            validation,
            solvedState,
            moveHistory: {
                totalMoves: moveHistory.length,
                lastMoves: moveHistory.slice(-10),
                moveFrequency: this.analyzeMoveFrequency(moveHistory)
            },
            performance: {
                cubeletsCount: cubelets.length,
                expectedCount: this.cubeSize ** 3,
                memoryEstimate: this.estimateMemoryUsage(cubelets)
            }
        };
    }
    
    analyzeMoveFrequency(moveHistory) {
        const frequency = {};
        moveHistory.forEach(move => {
            frequency[move] = (frequency[move] || 0) + 1;
        });
        
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .reduce((obj, [move, count]) => {
                obj[move] = count;
                return obj;
            }, {});
    }
    
    estimateMemoryUsage(cubelets) {
        // Rough estimate of memory usage
        const bytesPerCubelet = 200; // Estimated bytes per cubelet object
        return {
            cubelets: cubelets.length * bytesPerCubelet,
            total: cubelets.length * bytesPerCubelet + 1024 // Add overhead
        };
    }
    
    // PUBLIC_INTERFACE
    exportCubeState(cubelets) {
        /**
         * Export cube state for debugging or saving
         * @param {Array} cubelets - Array of cubelet objects
         * @returns {object} Serializable cube state
         */
        return {
            version: '1.0',
            cubeSize: this.cubeSize,
            timestamp: new Date().toISOString(),
            cubelets: cubelets.map(cubelet => ({
                x: cubelet.x,
                y: cubelet.y,
                z: cubelet.z,
                position: {
                    x: cubelet.mesh.position.x,
                    y: cubelet.mesh.position.y,
                    z: cubelet.mesh.position.z
                },
                rotation: {
                    x: cubelet.mesh.rotation.x,
                    y: cubelet.mesh.rotation.y,
                    z: cubelet.mesh.rotation.z
                }
            }))
        };
    }
    
    // PUBLIC_INTERFACE
    importCubeState(stateData, cubelets) {
        /**
         * Import and apply a saved cube state
         * @param {object} stateData - Saved cube state data
         * @param {Array} cubelets - Current cubelet objects to update
         * @returns {boolean} Success status
         */
        if (!stateData || !stateData.cubelets || stateData.cubeSize !== this.cubeSize) {
            return false;
        }
        
        try {
            stateData.cubelets.forEach((savedCubelet, index) => {
                if (index < cubelets.length) {
                    const cubelet = cubelets[index];
                    cubelet.mesh.position.set(
                        savedCubelet.position.x,
                        savedCubelet.position.y,
                        savedCubelet.position.z
                    );
                    cubelet.mesh.rotation.set(
                        savedCubelet.rotation.x,
                        savedCubelet.rotation.y,
                        savedCubelet.rotation.z
                    );
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to import cube state:', error);
            return false;
        }
    }
}

// PUBLIC_INTERFACE
export const createValidator = (cubeSize = 3) => {
    return new CubeValidator(cubeSize);
};

export default CubeValidator;
