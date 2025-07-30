/**
 * Rubik's Cube AI Solver - Beginner's Method Implementation
 * This is a simplified version of the layer-by-layer method
 */

// PUBLIC_INTERFACE
export class CubeSolver {
    constructor(cubeSize = 3) {
        this.cubeSize = cubeSize;
        this.algorithms = this.initializeAlgorithms();
    }
    
    initializeAlgorithms() {
        return {
            // White cross algorithms
            whiteCross: [
                "F D R F' D' R'",
                "R D' F R' D F'",
                "F R U R' F'",
                "R U R' F R F'"
            ],
            
            // White corners (First layer)
            whiteCorners: [
                "R U R' U'",
                "F U F' U'", 
                "R U2 R' U' R U R'",
                "R U' R' F R F'"
            ],
            
            // Middle layer edges
            middleLayer: [
                "U R U' R' U' F U F'",
                "U' L U L' U F' U' F",
                "R U R' F R F' U F R F'",
                "L U L' F' L F U' F' L F"
            ],
            
            // Yellow cross (OLL)
            yellowCross: [
                "F R U R' U' F'",
                "F U R U' R' F'",
                "R U R' U R U2 R'",
                "F R U R' U' R U R' U' F'"
            ],
            
            // Yellow face (OLL)
            yellowFace: [
                "R U R' U R U2 R'",
                "R U2 R' U' R U' R'",
                "F R U R' U' F' U F R U R' U' F'",
                "R U R' F' R U R' U' R' F R2 U' R'"
            ],
            
            // Permute last layer (PLL)
            pll: [
                "R U R' F' R U R' U' R' F R2 U' R'", // T-perm
                "R U R' U' R' F R2 U' R' U' R U R' F'", // J-perm
                "F R U' R' U' R U R' F' R U R' U' R' F R F'", // Y-perm
                "R' U R' U' R' U' R' U R U R2", // A-perm
                "R2 F R U R U' R' F' R U2 R' U2 R" // V-perm
            ]
        };
    }
    
    // PUBLIC_INTERFACE
    generateScramble(length = 20) {
        /**
         * Generate a random scramble sequence
         * @param {number} length - Number of moves in scramble
         * @returns {string[]} Array of move notations
         */
        const moves = ['R', "R'", 'R2', 'L', "L'", 'L2', 'U', "U'", 'U2', 
                      'D', "D'", 'D2', 'F', "F'", 'F2', 'B', "B'", 'B2'];
        
        const scramble = [];
        let lastMove = '';
        let lastAxis = '';
        
        for (let i = 0; i < length; i++) {
            let validMoves = moves.filter(move => {
                const axis = this.getMoveAxis(move);
                const face = move.charAt(0);
                
                // Don't repeat the same move
                if (face === lastMove) return false;
                
                // Don't do moves on same axis consecutively (more than 2)
                if (axis === lastAxis && i > 1) return false;
                
                return true;
            });
            
            if (validMoves.length === 0) validMoves = moves;
            
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            scramble.push(randomMove);
            
            lastMove = randomMove.charAt(0);
            lastAxis = this.getMoveAxis(randomMove);
        }
        
        return scramble;
    }
    
    getMoveAxis(move) {
        const face = move.charAt(0);
        switch (face) {
            case 'R': case 'L': case 'M': return 'x';
            case 'U': case 'D': case 'E': return 'y';
            case 'F': case 'B': case 'S': return 'z';
            default: return 'unknown';
        }
    }
    
    // PUBLIC_INTERFACE
    solveCube(cubeState = null) {
        /**
         * Generate a solve sequence using beginner's method
         * Note: This is a simplified version that doesn't analyze actual cube state
         * @param {object} cubeState - Current state of the cube (optional)
         * @returns {string[]} Array of solution moves
         */
        
        // For now, return a sample solve sequence
        // In a real implementation, this would analyze the cube state
        const solutionSteps = [];
        
        // Step 1: White cross
        solutionSteps.push(...this.getRandomAlgorithm('whiteCross'));
        
        // Step 2: White corners
        solutionSteps.push(...this.getRandomAlgorithm('whiteCorners'));
        
        // Step 3: Middle layer
        solutionSteps.push(...this.getRandomAlgorithm('middleLayer'));
        
        // Step 4: Yellow cross
        solutionSteps.push(...this.getRandomAlgorithm('yellowCross'));
        
        // Step 5: Yellow face
        solutionSteps.push(...this.getRandomAlgorithm('yellowFace'));
        
        // Step 6: Permute last layer
        solutionSteps.push(...this.getRandomAlgorithm('pll'));
        
        return this.optimizeMoveSequence(solutionSteps);
    }
    
    getRandomAlgorithm(step) {
        const algorithms = this.algorithms[step] || [];
        if (algorithms.length === 0) return [];
        
        const randomAlg = algorithms[Math.floor(Math.random() * algorithms.length)];
        return randomAlg.split(' ').filter(move => move.trim() !== '');
    }
    
    // PUBLIC_INTERFACE
    optimizeMoveSequence(moves) {
        /**
         * Optimize a sequence of moves by removing redundant moves
         * @param {string[]} moves - Array of move notations
         * @returns {string[]} Optimized move sequence
         */
        if (!moves || moves.length === 0) return [];
        
        const optimized = [];
        
        for (let i = 0; i < moves.length; i++) {
            const currentMove = moves[i];
            if (!currentMove || currentMove.trim() === '') continue;
            
            const face = currentMove.charAt(0);
            let count = 1;
            
            // Count consecutive moves on the same face
            while (i + count < moves.length && moves[i + count].charAt(0) === face) {
                count++;
            }
            
            // Calculate net rotation
            let netRotation = 0;
            for (let j = 0; j < count; j++) {
                const move = moves[i + j];
                if (move.includes("'")) {
                    netRotation -= 1;
                } else if (move.includes('2')) {
                    netRotation += 2;
                } else {
                    netRotation += 1;
                }
            }
            
            // Normalize rotation (0, 1, 2, 3 -> 0, 1, 2, -1)
            netRotation = ((netRotation % 4) + 4) % 4;
            if (netRotation === 3) netRotation = -1;
            
            // Add optimized move
            if (netRotation === 1) {
                optimized.push(face);
            } else if (netRotation === 2) {
                optimized.push(face + '2');
            } else if (netRotation === -1) {
                optimized.push(face + "'");
            }
            // netRotation === 0 means no move needed
            
            i += count - 1; // Skip processed moves
        }
        
        return optimized;
    }
    
    // PUBLIC_INTERFACE
    getAlgorithmByName(name) {
        /**
         * Get a specific algorithm by name
         * @param {string} name - Algorithm name
         * @returns {string[]} Array of moves
         */
        const allAlgorithms = {
            // Popular algorithms
            'sexy-move': ['R', 'U', "R'", "U'"],
            'sledgehammer': ['R', "F'", 'R', "F'", "R'", 'F', "R'"],
            'sune': ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
            'anti-sune': ["R'", "U'", 'R', "U'", "R'", "U2", 'R'],
            't-perm': ['R', 'U', "R'", "F'", 'R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'"],
            'j-perm': ['R', 'U', "R'", "F'", 'R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'"],
            ...this.algorithms
        };
        
        const algorithm = allAlgorithms[name];
        return algorithm ? (Array.isArray(algorithm) ? algorithm : algorithm.split(' ')) : [];
    }
    
    // PUBLIC_INTERFACE
    listAvailableAlgorithms() {
        /**
         * Get list of all available algorithms
         * @returns {string[]} Array of algorithm names
         */
        return [
            'sexy-move',
            'sledgehammer', 
            'sune',
            'anti-sune',
            't-perm',
            'j-perm',
            ...Object.keys(this.algorithms)
        ];
    }
}

// PUBLIC_INTERFACE
export const createSolver = (cubeSize = 3) => {
    return new CubeSolver(cubeSize);
};

export default CubeSolver;
