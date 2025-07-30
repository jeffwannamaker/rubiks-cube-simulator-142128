import React from 'react';

/**
 * Utility functions and components for Rubik's Cube notation
 */

// PUBLIC_INTERFACE
export const parseNotation = (notation) => {
    /**
     * Parse a move notation string into its components
     * @param {string} notation - The move notation (e.g., "R", "R'", "R2", "Rw")
     * @returns {object} Parsed notation object
     */
    const face = notation.charAt(0);
    const modifier = notation.slice(1);
    
    return {
        face: face.toLowerCase(),
        isCounterClockwise: modifier.includes("'"),
        isDouble: modifier.includes('2'),
        isWide: modifier.includes('w'),
        original: notation
    };
};

// PUBLIC_INTERFACE
export const getInverseNotation = (notation) => {
    /**
     * Get the inverse of a move notation
     * @param {string} notation - The original move notation
     * @returns {string} The inverse notation
     */
    if (notation.includes("'")) {
        return notation.replace("'", "");
    } else if (notation.includes('2')) {
        return notation; // 180° moves are their own inverse
    } else {
        return notation + "'";
    }
};

// PUBLIC_INTERFACE
export const validateNotation = (notation) => {
    /**
     * Validate if a notation string is valid
     * @param {string} notation - The notation to validate
     * @returns {boolean} True if valid, false otherwise
     */
    const validFaces = ['R', 'L', 'U', 'D', 'F', 'B', 'M', 'E', 'S', 'r', 'l', 'u', 'd', 'f', 'b'];
    const validModifiers = ['', "'", '2', 'w', "w'", 'w2'];
    
    if (!notation || notation.length === 0) return false;
    
    const face = notation.charAt(0);
    const modifier = notation.slice(1);
    
    return validFaces.includes(face) && validModifiers.includes(modifier);
};

// PUBLIC_INTERFACE
export const NotationDisplay = ({ notation, className = '' }) => {
    /**
     * Component to display notation with proper formatting
     */
    const isValid = validateNotation(notation);
    
    return (
        <span 
            className={`notation-display ${className} ${isValid ? 'valid' : 'invalid'}`}
            title={isValid ? `Move: ${notation}` : `Invalid notation: ${notation}`}
        >
            {notation}
        </span>
    );
};

// PUBLIC_INTERFACE
export const NotationHelper = () => {
    /**
     * Component showing notation help information
     */
    return (
        <div className="notation-helper">
            <h4>Notation Reference</h4>
            <div className="notation-section">
                <h5>Basic Moves</h5>
                <ul>
                    <li><strong>R</strong> - Right face clockwise</li>
                    <li><strong>L</strong> - Left face clockwise</li>
                    <li><strong>U</strong> - Up face clockwise</li>
                    <li><strong>D</strong> - Down face clockwise</li>
                    <li><strong>F</strong> - Front face clockwise</li>
                    <li><strong>B</strong> - Back face clockwise</li>
                </ul>
            </div>
            
            <div className="notation-section">
                <h5>Modifiers</h5>
                <ul>
                    <li><strong>'</strong> - Counter-clockwise (e.g., R')</li>
                    <li><strong>2</strong> - 180° turn (e.g., R2)</li>
                    <li><strong>w</strong> - Wide turn, includes adjacent layer (e.g., Rw)</li>
                </ul>
            </div>
            
            <div className="notation-section">
                <h5>Middle Layer Slices</h5>
                <ul>
                    <li><strong>M</strong> - Middle layer (between L and R)</li>
                    <li><strong>E</strong> - Equatorial layer (between U and D)</li>
                    <li><strong>S</strong> - Standing layer (between F and B)</li>
                </ul>
            </div>
            
            <div className="notation-section">
                <h5>Examples</h5>
                <ul>
                    <li><strong>R U R' U'</strong> - Right, Up, Right inverse, Up inverse</li>
                    <li><strong>F R U' R' F'</strong> - F sexy move</li>
                    <li><strong>M2 E2 S2</strong> - All middle layers 180°</li>
                </ul>
            </div>
        </div>
    );
};

export default {
    parseNotation,
    getInverseNotation,
    validateNotation,
    NotationDisplay,
    NotationHelper
};
