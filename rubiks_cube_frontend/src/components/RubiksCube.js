import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

/**
 * Individual cubelet (small cube) component that makes up the Rubik's cube
 */
class Cubelet {
    constructor(x, y, z, cubeSize) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.cubeSize = cubeSize;
        
        // Create geometry and material
        const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        
        // Create materials for each face with authentic Rubik's cube colors
        const colors = [
            0xff4500, // Right - Orange
            0xff0000, // Left - Red  
            0xffffff, // Top - White
            0xffff00, // Bottom - Yellow
            0x00ff00, // Front - Green
            0x0000ff  // Back - Blue
        ];
        
        const materials = colors.map(color => new THREE.MeshLambertMaterial({ color }));
        this.mesh = new THREE.Mesh(geometry, materials);
        
        // Position the cubelet
        const offset = (cubeSize - 1) / 2;
        this.mesh.position.set(
            (x - offset) * 1.02,
            (y - offset) * 1.02,
            (z - offset) * 1.02
        );
        
        // Store original position for reset
        this.originalPosition = this.mesh.position.clone();
        this.originalRotation = this.mesh.rotation.clone();
    }
    
    reset() {
        this.mesh.position.copy(this.originalPosition);
        this.mesh.rotation.copy(this.originalRotation);
    }
}

/**
 * Main Rubik's Cube logic and state management
 */
class RubiksCubeLogic {
    constructor(size = 3) {
        this.size = size;
        this.cubelets = [];
        this.moveHistory = [];
        this.redoStack = [];
        this.isAnimating = false;
        this.animationQueue = [];
        
        this.initializeCube();
    }
    
    initializeCube() {
        this.cubelets = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                for (let z = 0; z < this.size; z++) {
                    this.cubelets.push(new Cubelet(x, y, z, this.size));
                }
            }
        }
    }
    
    // PUBLIC_INTERFACE
    getCubelets() {
        return this.cubelets;
    }
    
    // PUBLIC_INTERFACE
    executeMove(notation, animated = true) {
        if (this.isAnimating && animated) {
            this.animationQueue.push({ notation, animated });
            return;
        }
        
        this.moveHistory.push(notation);
        this.redoStack = []; // Clear redo stack when new move is made
        
        if (animated) {
            this.isAnimating = true;
        }
        
        this._performMove(notation, animated);
    }
    
    _performMove(notation, animated) {
        // Parse move notation (R, R', R2, Rw, M, etc.)
        const face = notation.charAt(0);
        const modifier = notation.slice(1);
        
        let angle = Math.PI / 2;
        if (modifier.includes("'")) angle = -Math.PI / 2;
        if (modifier.includes('2')) angle = Math.PI;
        
        const axis = this._getRotationAxis(face);
        const layer = this._getAffectedLayer(face, modifier);
        
        if (animated) {
            this._animateRotation(axis, angle, layer, () => {
                this.isAnimating = false;
                this._processQueue();
            });
        } else {
            this._rotateLayer(axis, angle, layer);
        }
    }
    
    _getRotationAxis(face) {
        switch (face.toLowerCase()) {
            case 'r': case 'l': case 'm': return new THREE.Vector3(1, 0, 0);
            case 'u': case 'd': case 'e': return new THREE.Vector3(0, 1, 0);
            case 'f': case 'b': case 's': return new THREE.Vector3(0, 0, 1);
            default: 
                console.warn(`Unknown face notation: ${face}`);
                return new THREE.Vector3(1, 0, 0);
        }
    }
    
    _getAffectedLayer(face, modifier) {
        const center = (this.size - 1) / 2;
        const layers = [];
        
        switch (face.toLowerCase()) {
            case 'r':
                layers.push(this.size - 1);
                if (modifier.includes('w')) {
                    for (let i = this.size - 2; i >= Math.max(0, this.size - 2); i--) {
                        layers.push(i);
                    }
                }
                break;
            case 'l':
                layers.push(0);
                if (modifier.includes('w')) {
                    for (let i = 1; i <= Math.min(this.size - 1, 1); i++) {
                        layers.push(i);
                    }
                }
                break;
            case 'u':
                layers.push(this.size - 1);
                break;
            case 'd':
                layers.push(0);
                break;
            case 'f':
                layers.push(this.size - 1);
                break;
            case 'b':
                layers.push(0);
                break;
            case 'm':
                layers.push(Math.floor(center));
                break;
            case 'e':
                layers.push(Math.floor(center));
                break;
            case 's':
                layers.push(Math.floor(center));
                break;
            default:
                console.warn(`Unknown face for layer calculation: ${face}`);
                layers.push(0);
                break;
        }
        
        return layers;
    }
    
    _animateRotation(axis, angle, layers, callback) {
        const duration = 300; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentAngle = angle * this._easeInOutCubic(progress);
            
            this._rotateLayerToAngle(axis, currentAngle, layers);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        };
        
        animate();
    }
    
    _easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    _rotateLayer(axis, angle, layers) {
        const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        
        this.cubelets.forEach(cubelet => {
            const pos = cubelet.mesh.position;
            let shouldRotate = false;
            
            layers.forEach(layer => {
                if (axis.x && Math.abs(pos.x - (layer - (this.size - 1) / 2) * 1.02) < 0.01) shouldRotate = true;
                if (axis.y && Math.abs(pos.y - (layer - (this.size - 1) / 2) * 1.02) < 0.01) shouldRotate = true;
                if (axis.z && Math.abs(pos.z - (layer - (this.size - 1) / 2) * 1.02) < 0.01) shouldRotate = true;
            });
            
            if (shouldRotate) {
                pos.applyQuaternion(quaternion);
                cubelet.mesh.quaternion.multiplyQuaternions(quaternion, cubelet.mesh.quaternion);
            }
        });
    }
    
    _rotateLayerToAngle(axis, angle, layers) {
        // Reset positions first
        this.cubelets.forEach(cubelet => {
            cubelet.mesh.position.copy(cubelet.originalPosition);
            cubelet.mesh.rotation.copy(cubelet.originalRotation);
        });
        
        // Apply rotation
        this._rotateLayer(axis, angle, layers);
    }
    
    _processQueue() {
        if (this.animationQueue.length > 0) {
            const nextMove = this.animationQueue.shift();
            this.executeMove(nextMove.notation, nextMove.animated);
        }
    }
    
    // PUBLIC_INTERFACE
    undo() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        this.redoStack.push(lastMove);
        
        // Execute inverse move
        const inverseMove = this._getInverseMove(lastMove);
        this._performMove(inverseMove, false);
    }
    
    // PUBLIC_INTERFACE
    redo() {
        if (this.redoStack.length === 0) return;
        
        const move = this.redoStack.pop();
        this.moveHistory.push(move);
        this._performMove(move, false);
    }
    
    _getInverseMove(move) {
        if (move.includes("'")) {
            return move.replace("'", "");
        } else if (move.includes('2')) {
            return move; // 180° moves are their own inverse
        } else {
            return move + "'";
        }
    }
    
    // PUBLIC_INTERFACE
    scramble() {
        const moves = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"];
        const scrambleLength = 20;
        
        for (let i = 0; i < scrambleLength; i++) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            this.executeMove(randomMove, true);
        }
    }
    
    // PUBLIC_INTERFACE
    solve() {
        // Simple beginner's method solver (basic implementation)
        // This is a simplified version - a full solver would be much more complex
        const solveMoves = this._generateSolveMoves();
        solveMoves.forEach(move => this.executeMove(move, true));
    }
    
    _generateSolveMoves() {
        // Simplified solve sequence - in reality this would analyze the cube state
        return ['R', 'U', "R'", "U'", 'F', "R'", "F'", 'R'];
    }
    
    // PUBLIC_INTERFACE
    reset() {
        this.cubelets.forEach(cubelet => cubelet.reset());
        this.moveHistory = [];
        this.redoStack = [];
        this.animationQueue = [];
        this.isAnimating = false;
    }
    
    // PUBLIC_INTERFACE
    resize(newSize) {
        this.size = newSize;
        this.initializeCube();
        this.reset();
    }
}

// PUBLIC_INTERFACE
const RubiksCube = ({ cubeSize = 3, onMoveHistoryChange, debugMode = false, animationSpeed = 1.0, onControlsReady }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const cubeLogicRef = useRef(null);

    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize Three.js scene
    useEffect(() => {
        // Early return if already initialized or no mount point
        if (!mountRef.current || isInitialized) return;

        let animationId = null;
        const currentMount = mountRef.current;
        
        setIsLoading(true);
        setError(null);

        // Scene initialization function
        const initScene = () => {
            // Validate mount point
            if (!currentMount.parentElement) {
                console.warn('Mount element not in DOM, retrying...');
                setTimeout(initScene, 100);
                return;
            };

            const rect = currentMount.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                console.warn('Mount element has no dimensions, retrying...', rect);
                setTimeout(initScene, 100);
                return;
            };

                const rect = currentMount.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) {
                    console.warn('Mount element has no dimensions, retrying...', rect);
                    setTimeout(setupScene, 100);
                    return;
                }

                console.log('Initializing Three.js scene with dimensions:', rect.width, 'x', rect.height);

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        );
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: false
        });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Cube logic
        cubeLogicRef.current = new RubiksCubeLogic(cubeSize);
        
        // Add cubelets to scene
        const cubelets = cubeLogicRef.current.getCubelets();
        console.log(`Adding ${cubelets.length} cubelets to scene`);
        cubelets.forEach(cubelet => {
            scene.add(cubelet.mesh);
        });

        // Controls (basic mouse interaction)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (event) => {
            event.preventDefault();
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseMove = (event) => {
            if (!isDragging) return;
            event.preventDefault();

            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRadians(deltaMove.y * 1),
                    toRadians(deltaMove.x * 1),
                    0,
                    'XYZ'
                ));

            camera.position.applyQuaternion(deltaRotationQuaternion);
            camera.lookAt(scene.position);

            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseUp = (event) => {
            event.preventDefault();
            isDragging = false;
        };

        const onWheel = (event) => {
            event.preventDefault();
            const delta = event.deltaY;
            const scaleFactor = 1 + delta * 0.001;
            camera.position.multiplyScalar(scaleFactor);
        };

        const toRadians = (angle) => angle * (Math.PI / 180);

        // Add event listeners with proper options
        renderer.domElement.addEventListener('mousedown', onMouseDown, { passive: false });
        renderer.domElement.addEventListener('mousemove', onMouseMove, { passive: false });
        renderer.domElement.addEventListener('mouseup', onMouseUp, { passive: false });
        renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

        // Prevent context menu on right click
        renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

        // Mount renderer
        currentMount.appendChild(renderer.domElement);

                // Animation loop
                const animate = () => {
                    animationId = requestAnimationFrame(animate);
                    if (rendererRef.current && cameraRef.current && sceneRef.current) {
                        rendererRef.current.render(sceneRef.current, cameraRef.current);
                    }
                };
                animate();

                // Handle window resize
                const handleResize = () => {
                    if (!currentMount || !rendererRef.current || !cameraRef.current) return;
                    const width = currentMount.clientWidth;
                    const height = currentMount.clientHeight;
                    cameraRef.current.aspect = width / height;
                    cameraRef.current.updateProjectionMatrix();
                    rendererRef.current.setSize(width, height);
                };

                window.addEventListener('resize', handleResize);
                
                // Return true to indicate successful initialization
                return true;

            console.log('Three.js scene initialized successfully');
            setIsInitialized(true);
            setIsLoading(false);

        } catch (err) {
            console.error('Failed to initialize Three.js scene:', err);
            setError(err.message);
            setIsLoading(false);
        }

        // Define cleanup function
        const cleanup = () => {
            // Stop animation
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            // Remove event listeners
            window.removeEventListener('resize', handleResize);

            // Get current refs for cleanup
            const renderer = rendererRef.current;
            const scene = sceneRef.current;

            // Clean up renderer and event listeners
            if (renderer) {
                const domElement = renderer.domElement;
                if (domElement) {
                    domElement.removeEventListener('mousedown', onMouseDown);
                    domElement.removeEventListener('mousemove', onMouseMove);
                    domElement.removeEventListener('mouseup', onMouseUp);
                    domElement.removeEventListener('wheel', onWheel);
                    domElement.removeEventListener('contextmenu', (e) => e.preventDefault());

                    // Remove from DOM
                    if (currentMount.contains(domElement)) {
                        currentMount.removeChild(domElement);
                    }
                }
                renderer.dispose();
            }

            // Clean up scene resources
            if (scene) {
                scene.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            // Clear all refs
            sceneRef.current = null;
            rendererRef.current = null;
            cameraRef.current = null;
            cubeLogicRef.current = null;
        };

        // Initialize scene
        initScene();

        // Return cleanup function
        return cleanup;
    }, [cubeSize, isInitialized]);

    // PUBLIC_INTERFACE - Define control functions first
    const executeMove = useCallback((notation) => {
        if (cubeLogicRef.current) {
            cubeLogicRef.current.executeMove(notation);
            if (onMoveHistoryChange) {
                onMoveHistoryChange(cubeLogicRef.current.moveHistory);
            }
        }
    }, [onMoveHistoryChange]);

    // PUBLIC_INTERFACE
    const scramble = useCallback(() => {
        if (cubeLogicRef.current) {
            cubeLogicRef.current.scramble();
            if (onMoveHistoryChange) {
                onMoveHistoryChange(cubeLogicRef.current.moveHistory);
            }
        }
    }, [onMoveHistoryChange]);

    // PUBLIC_INTERFACE
    const solve = useCallback(() => {
        if (cubeLogicRef.current) {
            cubeLogicRef.current.solve();
            if (onMoveHistoryChange) {
                onMoveHistoryChange(cubeLogicRef.current.moveHistory);
            }
        }
    }, [onMoveHistoryChange]);

    // PUBLIC_INTERFACE
    const reset = useCallback(() => {
        if (cubeLogicRef.current) {
            cubeLogicRef.current.reset();
            if (onMoveHistoryChange) {
                onMoveHistoryChange([]);
            }
        }
    }, [onMoveHistoryChange]);

    // PUBLIC_INTERFACE
    const undo = useCallback(() => {
        if (cubeLogicRef.current) {
            cubeLogicRef.current.undo();
            if (onMoveHistoryChange) {
                onMoveHistoryChange(cubeLogicRef.current.moveHistory);
            }
        }
    }, [onMoveHistoryChange]);

    // PUBLIC_INTERFACE
    const redo = useCallback(() => {
        if (cubeLogicRef.current) {
            cubeLogicRef.current.redo();
            if (onMoveHistoryChange) {
                onMoveHistoryChange(cubeLogicRef.current.moveHistory);
            }
        }
    }, [onMoveHistoryChange]);

    // Expose controls to parent component
    useEffect(() => {
        if (cubeLogicRef.current && onControlsReady) {
            onControlsReady({
                executeMove: executeMove,
                scramble: scramble,
                solve: solve,
                reset: reset,
                undo: undo,
                redo: redo
            });
        }
    }, [executeMove, scramble, solve, reset, undo, redo, onControlsReady]);

    // Update cube size
    useEffect(() => {
        if (cubeLogicRef.current && isInitialized && sceneRef.current) {
            console.log(`Updating cube size to ${cubeSize}x${cubeSize}x${cubeSize}`);
            
            // Remove existing cubelets from scene
            const cubeletsToRemove = sceneRef.current.children.filter(child => 
                child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry
            );
            
            cubeletsToRemove.forEach(cubelet => {
                sceneRef.current.remove(cubelet);
                if (cubelet.geometry) cubelet.geometry.dispose();
                if (cubelet.material) {
                    if (Array.isArray(cubelet.material)) {
                        cubelet.material.forEach(mat => mat.dispose());
                    } else {
                        cubelet.material.dispose();
                    }
                }
            });
            
            // Resize cube logic
            cubeLogicRef.current.resize(cubeSize);
            
            // Add new cubelets to scene
            const newCubelets = cubeLogicRef.current.getCubelets();
            console.log(`Adding ${newCubelets.length} new cubelets`);
            newCubelets.forEach(cubelet => {
                sceneRef.current.add(cubelet.mesh);
            });
        }
    }, [cubeSize, isInitialized]);

    // Add debug helpers when debug mode is enabled
    useEffect(() => {
        if (!sceneRef.current || !cubeLogicRef.current) return;

        // Remove existing debug helpers
        const debugHelpers = sceneRef.current.children.filter(child => child.userData.isDebugHelper);
        debugHelpers.forEach(helper => sceneRef.current.remove(helper));

        if (debugMode) {
            // Add coordinate axes
            const axesHelper = new THREE.AxesHelper(5);
            axesHelper.userData.isDebugHelper = true;
            sceneRef.current.add(axesHelper);

            // Add grid
            const gridHelper = new THREE.GridHelper(10, 10);
            gridHelper.userData.isDebugHelper = true;
            sceneRef.current.add(gridHelper);
        }
    }, [debugMode, isInitialized]);

    return (
        <div 
            ref={mountRef} 
            style={{ 
                width: '100%', 
                height: '100%', 
                minHeight: '500px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {isLoading && (
                <div className="cube-loading">
                    <div className="spinner"></div>
                    <div>Loading Rubik's Cube...</div>
                </div>
            )}
            
            {error && (
                <div style={{
                    color: '#ff6b6b',
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid #ff6b6b'
                }}>
                    <h3>Error Loading Cube</h3>
                    <p>{error}</p>
                    <button 
                        onClick={() => {
                            setError(null);
                            setIsInitialized(false);
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}
            
            {debugMode && isInitialized && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    zIndex: 1000
                }}>
                    <div>Cube Size: {cubeSize}×{cubeSize}×{cubeSize}</div>
                    <div>Cubelets: {cubeSize ** 3}</div>
                    <div>Animation Speed: {animationSpeed}x</div>
                    <div>Move History: {onMoveHistoryChange ? 'Enabled' : 'Disabled'}</div>
                    <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
                </div>
            )}
        </div>
    );
};

export default RubiksCube;
export { RubiksCubeLogic };
