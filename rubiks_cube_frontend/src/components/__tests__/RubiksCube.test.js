import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RubiksCube, { RubiksCubeLogic } from '../RubiksCube';
import { parseNotation, validateNotation } from '../CubeNotation';

// Mock Three.js
jest.mock('three', () => ({
    Scene: jest.fn(() => ({
        add: jest.fn(),
        remove: jest.fn(),
        children: []
    })),
    PerspectiveCamera: jest.fn(() => ({
        position: { set: jest.fn() },
        lookAt: jest.fn(),
        updateProjectionMatrix: jest.fn()
    })),
    WebGLRenderer: jest.fn(() => ({
        setSize: jest.fn(),
        render: jest.fn(),
        domElement: {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        },
        dispose: jest.fn(),
        shadowMap: { enabled: false, type: null }
    })),
    BoxGeometry: jest.fn(),
    MeshLambertMaterial: jest.fn(),
    Mesh: jest.fn(() => ({
        position: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn(), applyQuaternion: jest.fn() },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn() },
        quaternion: { multiplyQuaternions: jest.fn() }
    })),
    AmbientLight: jest.fn(),
    DirectionalLight: jest.fn(() => ({
        position: { set: jest.fn() },
        castShadow: false
    })),
    Vector3: jest.fn((x, y, z) => ({ x, y, z })),
    Quaternion: jest.fn(() => ({
        setFromAxisAngle: jest.fn(() => ({}))
    })),
    Euler: jest.fn(),
    Color: jest.fn(),
    AxesHelper: jest.fn(() => ({ userData: {} })),
    GridHelper: jest.fn(() => ({ userData: {} })),
    PCFSoftShadowMap: 'PCFSoftShadowMap'
}));

describe('RubiksCube Component', () => {
    beforeEach(() => {
        // Mock requestAnimationFrame
        global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
        global.cancelAnimationFrame = jest.fn();
        
        // Mock DOM methods
        HTMLElement.prototype.appendChild = jest.fn();
        HTMLElement.prototype.removeChild = jest.fn();
        HTMLElement.prototype.contains = jest.fn(() => true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(<RubiksCube cubeSize={3} />);
        expect(document.querySelector('div')).toBeInTheDocument();
    });

    test('displays debug info when debug mode is enabled', () => {
        render(<RubiksCube cubeSize={3} debugMode={true} />);
        expect(screen.getByText(/Cube Size: 3×3×3/)).toBeInTheDocument();
        expect(screen.getByText(/Cubelets: 27/)).toBeInTheDocument();
    });

    test('handles cube size changes', () => {
        const { rerender } = render(<RubiksCube cubeSize={3} />);
        rerender(<RubiksCube cubeSize={4} />);
        // Component should re-render without errors
        expect(document.querySelector('div')).toBeInTheDocument();
    });
});

describe('RubiksCubeLogic', () => {
    let cubeLogic;

    beforeEach(() => {
        cubeLogic = new RubiksCubeLogic(3);
    });

    test('initializes with correct number of cubelets', () => {
        expect(cubeLogic.getCubelets()).toHaveLength(27);
    });

    test('executes moves and updates history', () => {
        cubeLogic.executeMove('R', false);
        expect(cubeLogic.moveHistory).toContain('R');
    });

    test('undo functionality works', () => {
        cubeLogic.executeMove('R', false);
        cubeLogic.executeMove('U', false);
        
        const initialHistoryLength = cubeLogic.moveHistory.length;
        cubeLogic.undo();
        
        expect(cubeLogic.moveHistory).toHaveLength(initialHistoryLength - 1);
        expect(cubeLogic.redoStack).toHaveLength(1);
    });

    test('redo functionality works', () => {
        cubeLogic.executeMove('R', false);
        cubeLogic.undo();
        
        const historyLength = cubeLogic.moveHistory.length;
        cubeLogic.redo();
        
        expect(cubeLogic.moveHistory).toHaveLength(historyLength + 1);
        expect(cubeLogic.redoStack).toHaveLength(0);
    });

    test('reset clears history and positions', () => {
        cubeLogic.executeMove('R', false);
        cubeLogic.executeMove('U', false);
        
        cubeLogic.reset();
        
        expect(cubeLogic.moveHistory).toHaveLength(0);
        expect(cubeLogic.redoStack).toHaveLength(0);
    });

    test('scramble generates moves', () => {
        cubeLogic.scramble();
        expect(cubeLogic.moveHistory.length).toBeGreaterThan(0);
    });

    test('resize changes cube size', () => {
        cubeLogic.resize(4);
        expect(cubeLogic.size).toBe(4);
        expect(cubeLogic.getCubelets()).toHaveLength(64);
    });
});

describe('Cube Notation', () => {
    test('parses basic notation correctly', () => {
        const parsed = parseNotation('R');
        expect(parsed.face).toBe('r');
        expect(parsed.isCounterClockwise).toBe(false);
        expect(parsed.isDouble).toBe(false);
    });

    test('parses counter-clockwise notation', () => {
        const parsed = parseNotation("R'");
        expect(parsed.face).toBe('r');
        expect(parsed.isCounterClockwise).toBe(true);
    });

    test('parses double turn notation', () => {
        const parsed = parseNotation('R2');
        expect(parsed.face).toBe('r');
        expect(parsed.isDouble).toBe(true);
    });

    test('validates correct notation', () => {
        expect(validateNotation('R')).toBe(true);
        expect(validateNotation("R'")).toBe(true);
        expect(validateNotation('R2')).toBe(true);
        expect(validateNotation('Rw')).toBe(true);
    });

    test('rejects invalid notation', () => {
        expect(validateNotation('X')).toBe(false);
        expect(validateNotation('R3')).toBe(false);
        expect(validateNotation('')).toBe(false);
        expect(validateNotation('RR')).toBe(false);
    });
});
