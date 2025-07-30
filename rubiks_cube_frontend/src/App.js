import React, { useState, useCallback } from 'react';
import RubiksCube from './components/RubiksCube';
import ControlSidebar from './components/ControlSidebar';
import './components/RubiksCube.css';

// PUBLIC_INTERFACE
function App() {
    const [cubeSize, setCubeSize] = useState(3);
    const [moveHistory, setMoveHistory] = useState([]);
    const [debugMode, setDebugMode] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(1.0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    // Cube control references
    const [cubeControls, setCubeControls] = useState({
        executeMove: () => {},
        scramble: () => {},
        solve: () => {},
        reset: () => {},
        undo: () => {},
        redo: () => {}
    });

    // PUBLIC_INTERFACE
    const handleCubeSizeChange = useCallback((newSize) => {
        setCubeSize(newSize);
        setMoveHistory([]); // Reset history when changing size
    }, []);

    // PUBLIC_INTERFACE
    const handleMoveHistoryChange = useCallback((newHistory) => {
        setMoveHistory([...newHistory]);
    }, []);

    // PUBLIC_INTERFACE
    const handleExecuteMove = useCallback((notation) => {
        cubeControls.executeMove(notation);
    }, [cubeControls]);

    // PUBLIC_INTERFACE
    const handleScramble = useCallback(() => {
        cubeControls.scramble();
    }, [cubeControls]);

    // PUBLIC_INTERFACE
    const handleSolve = useCallback(() => {
        cubeControls.solve();
    }, [cubeControls]);

    // PUBLIC_INTERFACE
    const handleReset = useCallback(() => {
        cubeControls.reset();
        setMoveHistory([]);
    }, [cubeControls]);

    // PUBLIC_INTERFACE
    const handleUndo = useCallback(() => {
        cubeControls.undo();
    }, [cubeControls]);

    // PUBLIC_INTERFACE
    const handleRedo = useCallback(() => {
        cubeControls.redo();
    }, [cubeControls]);

    // PUBLIC_INTERFACE
    const handleDebugModeChange = useCallback((enabled) => {
        setDebugMode(enabled);
    }, []);

    // PUBLIC_INTERFACE
    const handleAnimationSpeedChange = useCallback((speed) => {
        setAnimationSpeed(speed);
    }, []);

    // PUBLIC_INTERFACE
    const handleToggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    return (
        <div className="rubiks-app">
            <div className="cube-container">
                <RubiksCube 
                    cubeSize={cubeSize}
                    onMoveHistoryChange={handleMoveHistoryChange}
                    debugMode={debugMode}
                    animationSpeed={animationSpeed}
                    onControlsReady={setCubeControls}
                />
            </div>
            
            <ControlSidebar
                cubeSize={cubeSize}
                onCubeSizeChange={handleCubeSizeChange}
                onExecuteMove={handleExecuteMove}
                onScramble={handleScramble}
                onSolve={handleSolve}
                onReset={handleReset}
                onUndo={handleUndo}
                onRedo={handleRedo}
                moveHistory={moveHistory}
                debugMode={debugMode}
                onDebugModeChange={handleDebugModeChange}
                animationSpeed={animationSpeed}
                onAnimationSpeedChange={handleAnimationSpeedChange}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={handleToggleSidebar}
            />
        </div>
    );
}

export default App;
