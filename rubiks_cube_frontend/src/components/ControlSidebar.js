import React, { useState } from 'react';

// PUBLIC_INTERFACE
const ControlSidebar = ({ 
    cubeSize, 
    onCubeSizeChange, 
    onExecuteMove, 
    onScramble, 
    onSolve, 
    onReset, 
    onUndo, 
    onRedo,
    moveHistory = [],
    debugMode,
    onDebugModeChange,
    animationSpeed,
    onAnimationSpeedChange,
    isCollapsed,
    onToggleCollapse
}) => {
    const [customMove, setCustomMove] = useState('');
    const [selectedMoveSet, setSelectedMoveSet] = useState('basic');

    // Move notation sets
    const moveSets = {
        basic: ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"],
        advanced: ['R', "R'", 'R2', 'L', "L'", 'L2', 'U', "U'", 'U2', 'D', "D'", 'D2', 'F', "F'", 'F2', 'B', "B'", 'B2'],
        wide: ['Rw', "Rw'", 'Lw', "Lw'", 'Uw', "Uw'", 'Dw', "Dw'", 'Fw', "Fw'", 'Bw', "Bw'"],
        middle: ['M', "M'", 'E', "E'", 'S', "S'"]
    };

    const currentMoves = moveSets[selectedMoveSet];

    // PUBLIC_INTERFACE
    const handleExecuteCustomMove = () => {
        if (customMove.trim()) {
            const moves = customMove.trim().split(/\s+/);
            moves.forEach(move => {
                if (move) onExecuteMove(move);
            });
            setCustomMove('');
        }
    };

    // PUBLIC_INTERFACE
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleExecuteCustomMove();
        }
    };

    return (
        <div className={`control-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Collapse toggle button */}
            <button 
                className="collapse-toggle"
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isCollapsed ? '→' : '←'}
            </button>

            {!isCollapsed && (
                <div className="sidebar-content">
                    {/* Header */}
                    <div className="sidebar-section">
                        <h2>Rubik's Cube Controls</h2>
                    </div>

                    {/* Cube Configuration */}
                    <div className="sidebar-section">
                        <h3>Cube Configuration</h3>
                        <div className="form-group">
                            <label htmlFor="cube-size">Cube Size:</label>
                            <select 
                                id="cube-size"
                                value={cubeSize} 
                                onChange={(e) => onCubeSizeChange(parseInt(e.target.value))}
                                className="form-control"
                            >
                                {[3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                                    <option key={size} value={size}>{size}×{size}×{size}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="animation-speed">Animation Speed:</label>
                            <input
                                id="animation-speed"
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.1"
                                value={animationSpeed}
                                onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
                                className="form-control slider"
                            />
                            <span className="slider-value">{animationSpeed}x</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-section">
                        <h3>Quick Actions</h3>
                        <div className="button-group">
                            <button onClick={onScramble} className="btn btn-primary">
                                🎲 Scramble
                            </button>
                            <button onClick={onSolve} className="btn btn-success">
                                🤖 AI Solve
                            </button>
                            <button onClick={onReset} className="btn btn-warning">
                                🔄 Reset
                            </button>
                        </div>
                        
                        <div className="button-group">
                            <button onClick={onUndo} className="btn btn-secondary">
                                ↶ Undo
                            </button>
                            <button onClick={onRedo} className="btn btn-secondary">
                                ↷ Redo
                            </button>
                        </div>
                    </div>

                    {/* Move Input */}
                    <div className="sidebar-section">
                        <h3>Move Input</h3>
                        
                        {/* Custom move input */}
                        <div className="form-group">
                            <label htmlFor="custom-move">Custom Notation:</label>
                            <div className="input-group">
                                <input
                                    id="custom-move"
                                    type="text"
                                    value={customMove}
                                    onChange={(e) => setCustomMove(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="e.g., R U R' U'"
                                    className="form-control"
                                />
                                <button 
                                    onClick={handleExecuteCustomMove}
                                    className="btn btn-primary"
                                >
                                    Execute
                                </button>
                            </div>
                        </div>

                        {/* Move set selector */}
                        <div className="form-group">
                            <label htmlFor="move-set">Move Set:</label>
                            <select 
                                id="move-set"
                                value={selectedMoveSet} 
                                onChange={(e) => setSelectedMoveSet(e.target.value)}
                                className="form-control"
                            >
                                <option value="basic">Basic Moves</option>
                                <option value="advanced">Advanced (with 2)</option>
                                <option value="wide">Wide Moves</option>
                                <option value="middle">Middle Layer</option>
                            </select>
                        </div>

                        {/* Move buttons */}
                        <div className="move-buttons">
                            {currentMoves.map(move => (
                                <button
                                    key={move}
                                    onClick={() => onExecuteMove(move)}
                                    className="btn btn-move"
                                    title={`Execute ${move} move`}
                                >
                                    {move}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Move History */}
                    <div className="sidebar-section">
                        <h3>Move History ({moveHistory.length})</h3>
                        <div className="move-history">
                            {moveHistory.length === 0 ? (
                                <p className="text-muted">No moves yet</p>
                            ) : (
                                <div className="history-list">
                                    {moveHistory.slice(-20).map((move, index) => (
                                        <span key={index} className="history-move">
                                            {move}
                                        </span>
                                    ))}
                                    {moveHistory.length > 20 && (
                                        <span className="text-muted">
                                            ... and {moveHistory.length - 20} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {moveHistory.length > 0 && (
                            <div className="history-actions">
                                <button 
                                    onClick={() => navigator.clipboard.writeText(moveHistory.join(' '))}
                                    className="btn btn-small"
                                >
                                    📋 Copy All
                                </button>
                                <button 
                                    onClick={onReset}
                                    className="btn btn-small btn-warning"
                                >
                                    🗑️ Clear
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Debug Tools */}
                    <div className="sidebar-section">
                        <h3>Debug Tools</h3>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={debugMode}
                                    onChange={(e) => onDebugModeChange(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Show Debug Info
                            </label>
                        </div>
                        
                        {debugMode && (
                            <div className="debug-info">
                                <p><strong>Cube Size:</strong> {cubeSize}×{cubeSize}×{cubeSize}</p>
                                <p><strong>Total Cubelets:</strong> {cubeSize ** 3}</p>
                                <p><strong>Move Count:</strong> {moveHistory.length}</p>
                                <p><strong>Animation Speed:</strong> {animationSpeed}x</p>
                            </div>
                        )}
                    </div>

                    {/* Help Section */}
                    <div className="sidebar-section">
                        <h3>Notation Help</h3>
                        <div className="help-content">
                            <div className="notation-help">
                                <p><strong>Basic Moves:</strong></p>
                                <ul>
                                    <li><code>R, L, U, D, F, B</code> - Face turns</li>
                                    <li><code>'</code> - Counter-clockwise (e.g., R')</li>
                                    <li><code>2</code> - Double turn (e.g., R2)</li>
                                </ul>
                                
                                <p><strong>Advanced:</strong></p>
                                <ul>
                                    <li><code>w</code> - Wide turn (e.g., Rw)</li>
                                    <li><code>M, E, S</code> - Middle layer slices</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControlSidebar;
