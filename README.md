# Rubik's Cube Simulator

A responsive, interactive, and realistic Rubik's Cube simulator built in React JS with 3D rendering using Three.js. This project supports cubes from 3×3×3 up to 10×10×10, full notational move input, robust animation and logical queueing, AI scramble and solve logic, move history tracking, and comprehensive debug tools.

## 🎯 Overview

This Rubik's Cube simulator provides a complete 3D interactive experience with professional-grade features:

- **3D Visualization**: Realistic cube rendering with authentic colors and lighting
- **Multiple Cube Sizes**: Support for 3×3×3 through 10×10×10 cubes
- **Full Notation Support**: Standard and advanced Rubik's Cube notation
- **AI Solver**: Implements beginner's method with layer-by-layer approach
- **Interactive Controls**: Mouse/touch controls with responsive design
- **Move History**: Complete undo/redo functionality with move analysis
- **Debug Tools**: Comprehensive state validation and performance monitoring

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd rubiks-cube-simulator-142128

# Build and run with Docker Compose
docker-compose up -d

# Access the application
open http://localhost:3000
```

### Local Development

```bash
# Navigate to frontend directory
cd rubiks_cube_frontend

# Install dependencies
npm install

# Start development server
npm start

# Open browser
open http://localhost:3000
```

### Using Deployment Script

```bash
# Make script executable
chmod +x deploy.sh

# Production deployment
./deploy.sh production

# Development server
./deploy.sh development

# Run tests only
./deploy.sh test
```

## 📁 Project Structure

```
rubiks-cube-simulator-142128/
├── rubiks_cube_frontend/           # React frontend application
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── RubiksCube.js      # Main 3D cube component
│   │   │   ├── ControlSidebar.js  # Control panel UI
│   │   │   ├── CubeNotation.js    # Notation utilities
│   │   │   └── __tests__/         # Component tests
│   │   ├── utils/                 # Utility modules
│   │   │   ├── CubeSolver.js      # AI solving algorithms
│   │   │   ├── CubeValidator.js   # State validation
│   │   │   └── AnimationManager.js # Animation control
│   │   ├── assets/                # Static assets
│   │   └── App.js                 # Main application
│   ├── public/                    # Public assets
│   ├── Dockerfile                 # Production container
│   ├── Dockerfile.dev             # Development container
│   ├── nginx.conf                 # Production web server config
│   └── package.json               # Dependencies and scripts
├── docker-compose.yml             # Container orchestration
├── deploy.sh                      # Deployment automation
└── README.md                      # This file
```

## 🎮 Features

### Interactive 3D Cube
- **WebGL Rendering**: High-performance 3D graphics using Three.js
- **Realistic Design**: Authentic Rubik's Cube colors with proper lighting
- **Mouse Controls**: Orbit, zoom, and pan around the cube
- **Touch Support**: Mobile-friendly touch gestures
- **Responsive Layout**: Adapts to different screen sizes

### Move System
- **Standard Notation**: R, L, U, D, F, B moves with modifiers
- **Advanced Moves**: Wide turns (Rw), middle slices (M, E, S), double turns (R2)
- **Input Methods**: UI buttons, text input, and keyboard shortcuts
- **Animation Queue**: Smooth animations with no overlapping rotations
- **Speed Control**: Adjustable animation speed from 0.5x to 3x

### AI Features
- **Smart Scramble**: Generates realistic scramble sequences
- **Beginner's Method Solver**: Layer-by-layer solving approach
- **Algorithm Library**: Pre-built patterns (Sune, T-perm, J-perm, etc.)
- **Move Optimization**: Automatically optimizes move sequences

### Analysis Tools
- **Move History**: Complete tracking with undo/redo
- **State Validation**: Comprehensive cube state verification
- **Performance Monitoring**: Memory usage and frame rate tracking
- **Debug Mode**: Visual debugging with coordinate axes and statistics

## 🛠️ Development

### Prerequisites
- Node.js 14+
- npm 6+
- Docker (optional, for containerized deployment)

### Development Setup

```bash
# Install dependencies
cd rubiks_cube_frontend
npm install

# Start development server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests once (for CI)
npm run test:ci
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and run production container
docker-compose up -d rubiks-cube-frontend

# View logs
docker-compose logs -f rubiks-cube-frontend

# Stop container
docker-compose down
```

### Development with Docker

```bash
# Start development container with hot-reload
docker-compose --profile dev up rubiks-cube-dev

# Rebuild development image
docker-compose --profile dev build rubiks-cube-dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# Site configuration
REACT_APP_SITE_URL=http://localhost:3000

# Feature toggles
REACT_APP_ENABLE_DEBUG_MODE=true
REACT_APP_ENABLE_AI_SOLVER=true
REACT_APP_MAX_CUBE_SIZE=10

# Performance settings
REACT_APP_DEFAULT_ANIMATION_SPEED=1.0
REACT_APP_MAX_HISTORY_SIZE=1000
```

### Customization

The application can be customized through:
- **CSS Variables**: Theme colors and layout
- **Environment Variables**: Feature flags and limits
- **Algorithm Configuration**: Custom solving methods
- **Animation Settings**: Speed and easing functions

## 📊 Performance

### Recommended Settings
- **Cube Size**: 3×3×3 for optimal performance
- **Animation Speed**: 1.0x for smooth animations
- **Debug Mode**: Disabled in production

### Browser Requirements
- **WebGL Support**: Required for 3D rendering
- **Modern JavaScript**: ES6+ features
- **Memory**: Minimum 512MB available RAM

### Tested Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Component interactions
- **Algorithm Tests**: Cube solving validation
- **Performance Tests**: Animation and rendering benchmarks

Coverage targets:
- **Lines**: 70%+
- **Functions**: 70%+
- **Branches**: 70%+
- **Statements**: 70%+

## 🚀 Deployment Options

### 1. Static Hosting
Deploy the built files to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### 2. Container Deployment
Use the provided Docker configuration:
- Docker Swarm
- Kubernetes
- AWS ECS
- Google Cloud Run

### 3. Traditional Web Server
Deploy with nginx, Apache, or similar:
- Copy build files to web root
- Configure routing for SPA
- Enable gzip compression

## 🔒 Security

Security measures implemented:
- **Content Security Policy**: Prevents XSS attacks
- **HTTPS Enforcement**: Secure data transmission
- **Input Validation**: Sanitizes user inputs
- **Dependency Scanning**: Regular security updates

## 🐛 Troubleshooting

### Common Issues

**Cube not rendering:**
- Check WebGL support in browser
- Verify Three.js installation
- Check browser console for errors

**Performance issues:**
- Reduce cube size
- Disable debug mode
- Close other browser tabs
- Check available system memory

**Build failures:**
- Clear node_modules and reinstall
- Check Node.js version (14+ required)
- Verify all dependencies are installed

### Debug Information

Enable debug mode to access:
- Current cube state
- Performance metrics
- Memory usage statistics
- Move validation results

## 📈 Roadmap

### Upcoming Features
- [ ] Touch gesture controls
- [ ] Advanced solving methods (CFOP, Roux)
- [ ] Multiplayer competitions
- [ ] Custom color schemes
- [ ] VR/AR support
- [ ] Sound effects

### Performance Improvements
- [ ] WebGL2 optimizations
- [ ] Web Workers for calculations
- [ ] Progressive loading
- [ ] Adaptive quality settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines
- Follow ESLint configuration
- Write comprehensive tests
- Document public APIs
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Three.js Community**: 3D graphics library and examples
- **React Team**: UI framework and best practices
- **Speedcubing Community**: Notation standards and algorithms
- **Open Source Contributors**: Libraries and tools used

## 📞 Support

For questions, issues, or contributions:
- **Issues**: GitHub Issues tracker
- **Discussions**: GitHub Discussions
- **Documentation**: `/docs` directory
- **API Reference**: `/docs/api.md`

---

**Happy Cubing!** 🎲
