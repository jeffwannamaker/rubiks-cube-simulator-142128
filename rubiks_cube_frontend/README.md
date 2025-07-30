# Rubik's Cube Simulator

A responsive, interactive, and realistic Rubik's Cube simulator built in React JS with 3D rendering using Three.js. The app supports cubes from 3×3×3 up to 10×10×10, full notational move input, robust animation, AI scramble and solve capabilities, move history tracking, and comprehensive debug tools.

## Features

### 🎮 Interactive 3D Cube
- **3D Rendering**: High-quality 3D rendering using Three.js
- **Configurable Sizes**: Support for cube sizes from 3×3×3 to 10×10×10
- **Realistic Design**: Authentic Rubik's Cube colors with bevels, lighting, and shadows
- **Mouse Controls**: Intuitive camera interaction (orbit, zoom, pan)
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

### 🔄 Move System
- **Standard Notation**: Full support for Rubik's Cube notation (R, L, U, D, F, B)
- **Advanced Moves**: Wide turns (Rw), middle layer slices (M, E, S), and double turns (R2)
- **Multiple Input Methods**: UI buttons, gesture controls, and text input
- **Animation Queue**: Smooth animations with no overlapping rotations
- **Customizable Speed**: Adjustable animation speed from 0.5x to 3x

### 🤖 AI Features
- **Smart Scramble**: Generates realistic scramble sequences
- **AI Solver**: Implements beginner's method with layer-by-layer approach
- **Algorithm Library**: Pre-built algorithms for common patterns (Sune, T-perm, etc.)
- **Move Optimization**: Automatically optimizes move sequences

### 📊 History & Analysis
- **Move History**: Complete tracking of all moves performed
- **Undo/Redo**: Full undo and redo functionality
- **Move Statistics**: Analysis of move frequency and patterns
- **Export/Import**: Save and load cube states

### 🛠️ Debug Tools
- **State Validation**: Comprehensive cube state verification
- **Visual Debugging**: Toggle coordinate axes and grid helpers
- **Performance Monitoring**: Memory usage and performance metrics
- **Debug Overlays**: Real-time information display

## Getting Started

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rubiks-cube-simulator/rubiks_cube_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## Usage

### Basic Controls

#### Camera Controls
- **Left Click + Drag**: Rotate camera around cube
- **Mouse Wheel**: Zoom in/out
- **Right Click + Drag**: Pan camera (if implemented)

#### Move Input
1. **Button Interface**: Click move buttons in the sidebar
2. **Text Input**: Type notation sequences (e.g., "R U R' U'")
3. **Keyboard Shortcuts**: Use keyboard for quick moves (if implemented)

#### Quick Actions
- **Scramble**: Randomize the cube with a realistic scramble
- **AI Solve**: Let the AI solve the cube using beginner's method
- **Reset**: Return cube to solved state
- **Undo/Redo**: Step backward and forward through move history

### Notation Guide

#### Basic Moves
- **R**: Right face clockwise
- **L**: Left face clockwise  
- **U**: Up face clockwise
- **D**: Down face clockwise
- **F**: Front face clockwise
- **B**: Back face clockwise

#### Modifiers
- **'** (prime): Counter-clockwise turn (e.g., R')
- **2**: 180° turn (e.g., R2)
- **w**: Wide turn, includes adjacent layer (e.g., Rw)

#### Middle Layer Slices
- **M**: Middle layer (between L and R)
- **E**: Equatorial layer (between U and D)
- **S**: Standing layer (between F and B)

#### Example Sequences
```
R U R' U'          # Sexy move
F R U' R' F'       # Basic trigger
R U R' U R U2 R'   # Sune algorithm
```

### Advanced Features

#### Cube Sizes
Switch between different cube sizes in the control panel:
- 3×3×3 (Classic)
- 4×4×4 (Revenge)
- 5×5×5 (Professor)
- Up to 10×10×10

#### Debug Mode
Enable debug mode to see:
- Coordinate axes
- Grid helper
- Real-time cube statistics
- Performance metrics
- Move analysis

#### Animation Settings
- Adjust animation speed from 0.5x to 3.0x
- Queue multiple moves for smooth playback
- Pause/resume animations

## Architecture

### Component Structure
```
src/
├── components/
│   ├── RubiksCube.js          # Main 3D cube component
│   ├── ControlSidebar.js      # UI controls and settings
│   ├── CubeNotation.js        # Notation parsing utilities
│   └── __tests__/             # Component tests
├── utils/
│   ├── CubeSolver.js          # AI solving algorithms
│   ├── CubeValidator.js       # State validation
│   └── AnimationManager.js    # Animation control
└── App.js                     # Main application
```

### Key Classes

#### RubiksCubeLogic
Core cube state management and move execution
- Cubelet positioning and rotation
- Move parsing and execution
- History management
- Animation queuing

#### CubeSolver
AI solving capabilities
- Beginner's method implementation
- Algorithm library
- Scramble generation
- Move sequence optimization

#### CubeValidator
State validation and debugging
- Cube state verification
- Performance monitoring
- Debug information generation
- Export/import functionality

## Customization

### Environment Variables
Configure the app using these environment variables:

```env
# Site configuration
REACT_APP_SITE_URL=http://localhost:3000

# API endpoints (for future features)
REACT_APP_API_URL=http://localhost:8000

# Feature toggles
REACT_APP_ENABLE_DEBUG_MODE=true
REACT_APP_ENABLE_AI_SOLVER=true
REACT_APP_MAX_CUBE_SIZE=10

# Performance settings
REACT_APP_DEFAULT_ANIMATION_SPEED=1.0
REACT_APP_MAX_HISTORY_SIZE=1000
```

### Styling
The app uses CSS custom properties for theming. Key variables:

```css
:root {
  --primary-color: #1976d2;
  --secondary-color: #64b5f6;
  --accent-color: #ffab00;
  --background-dark: #1a1a1a;
  --sidebar-bg: #2d2d2d;
}
```

### Adding Custom Algorithms
Extend the solver with custom algorithms:

```javascript
import { CubeSolver } from './utils/CubeSolver';

const solver = new CubeSolver();
solver.algorithms.myCustomAlg = ['R', 'U', 'R\'', 'U\''];
```

## Testing

Run the test suite:
```bash
npm test                 # Run tests in watch mode
npm run test:coverage    # Run with coverage report
npm run test:ci          # Run once for CI
```

### Test Categories
- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Component interactions
- **Algorithm Tests**: Cube solving validation
- **Performance Tests**: Animation and rendering

## Performance Optimization

### Recommended Settings
- **Cube Size**: 3×3×3 for best performance
- **Animation Speed**: 1.0x for smooth animations
- **Debug Mode**: Disable for production use

### Memory Management
- Cube state is optimized for minimal memory usage
- Animation queues are automatically cleared
- Unused resources are properly disposed

## Browser Support

### Minimum Requirements
- **WebGL**: Required for 3D rendering
- **ES6**: Modern JavaScript features
- **requestAnimationFrame**: Smooth animations

### Tested Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Write comprehensive tests
- Document public APIs
- Use semantic commit messages

## Troubleshooting

### Common Issues

#### Cube Not Rendering
- Check WebGL support in browser
- Verify Three.js installation
- Check browser console for errors

#### Performance Issues
- Reduce cube size
- Disable debug mode
- Lower animation speed
- Check available system memory

#### Move Input Not Working
- Verify notation syntax
- Check if animation is in progress
- Clear animation queue if stuck

### Debug Information
Enable debug mode to see:
- Current cube state
- Memory usage
- Performance metrics
- Move validation results

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Three.js**: 3D graphics library
- **React**: UI framework  
- **Rubik's Cube Community**: Notation standards and algorithms
- **Speedcubing Algorithms**: Reference implementations

## Roadmap

### Upcoming Features
- [ ] Touch gesture controls for mobile
- [ ] Advanced solving methods (CFOP, Roux, ZZ)
- [ ] Multiplayer competitions
- [ ] Custom color schemes
- [ ] VR/AR support
- [ ] Sound effects and haptic feedback

### Performance Improvements
- [ ] WebGL2 optimizations
- [ ] Web Workers for calculations
- [ ] Progressive loading for large cubes
- [ ] Adaptive quality settings

---

For more information, visit the [project documentation](./docs) or check the [API reference](./docs/api.md).
