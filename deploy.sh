#!/bin/bash

# Rubik's Cube Simulator Deployment Script
# This script handles building and deploying the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="rubiks-cube-simulator"
FRONTEND_DIR="./rubiks_cube_frontend"
BUILD_DIR="$FRONTEND_DIR/build"
DOCKER_IMAGE="$PROJECT_NAME:latest"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 14+ to continue."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 14 ]; then
        log_error "Node.js version 14+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm to continue."
        exit 1
    fi
    
    # Check if Docker is available (optional)
    if command -v docker &> /dev/null; then
        log_info "Docker is available for containerized deployment"
        DOCKER_AVAILABLE=true
    else
        log_warning "Docker is not available. Containerized deployment will be skipped."
        DOCKER_AVAILABLE=false
    fi
    
    log_success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    cd "$FRONTEND_DIR"
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    cd ..
    log_success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    cd "$FRONTEND_DIR"
    
    # Run linting
    if npm run lint --if-present; then
        log_success "Linting passed"
    else
        log_warning "Linting issues found, but continuing..."
    fi
    
    # Run unit tests
    if npm run test:ci --if-present; then
        log_success "Tests passed"
    else
        log_error "Tests failed"
        exit 1
    fi
    
    cd ..
}

# Build application
build_application() {
    log_info "Building application..."
    
    cd "$FRONTEND_DIR"
    
    # Clean previous build
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Cleaned previous build"
    fi
    
    # Build the application
    npm run build
    
    if [ -d "build" ]; then
        log_success "Application built successfully"
        log_info "Build size: $(du -sh build | cut -f1)"
    else
        log_error "Build failed - no build directory found"
        exit 1
    fi
    
    cd ..
}

# Build Docker image
build_docker_image() {
    if [ "$DOCKER_AVAILABLE" = false ]; then
        log_warning "Skipping Docker build - Docker not available"
        return
    fi
    
    log_info "Building Docker image..."
    
    cd "$FRONTEND_DIR"
    
    if docker build -t "$DOCKER_IMAGE" .; then
        log_success "Docker image built successfully: $DOCKER_IMAGE"
        
        # Show image size
        IMAGE_SIZE=$(docker images "$DOCKER_IMAGE" --format "table {{.Size}}" | tail -n 1)
        log_info "Image size: $IMAGE_SIZE"
    else
        log_error "Docker build failed"
        exit 1
    fi
    
    cd ..
}

# Deploy using Docker Compose
deploy_docker_compose() {
    if [ "$DOCKER_AVAILABLE" = false ]; then
        log_warning "Skipping Docker Compose deployment - Docker not available"
        return
    fi
    
    log_info "Deploying with Docker Compose..."
    
    if docker-compose up -d rubiks-cube-frontend; then
        log_success "Application deployed successfully"
        log_info "Application is running at: http://localhost:3000"
        log_info "Health check: http://localhost:3000/health"
    else
        log_error "Docker Compose deployment failed"
        exit 1
    fi
}

# Start development server
start_dev_server() {
    log_info "Starting development server..."
    
    cd "$FRONTEND_DIR"
    
    log_info "Development server will start at: http://localhost:3000"
    log_info "Press Ctrl+C to stop the server"
    
    npm start
}

# Main deployment function
deploy() {
    local deployment_type="${1:-production}"
    
    log_info "Starting deployment process for: $deployment_type"
    
    check_prerequisites
    install_dependencies
    
    if [ "$deployment_type" = "production" ]; then
        run_tests
        build_application
        build_docker_image
        deploy_docker_compose
    elif [ "$deployment_type" = "development" ]; then
        start_dev_server
    else
        log_error "Unknown deployment type: $deployment_type"
        log_info "Available types: production, development"
        exit 1
    fi
    
    log_success "Deployment completed successfully!"
}

# Show help
show_help() {
    echo "Rubik's Cube Simulator Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  production    Build and deploy for production (default)"
    echo "  development   Start development server"
    echo "  test          Run tests only"
    echo "  build         Build application only"
    echo "  docker        Build Docker image only"
    echo "  clean         Clean build artifacts"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy for production"
    echo "  $0 development        # Start development server"
    echo "  $0 test              # Run tests"
    echo ""
}

# Clean build artifacts
clean() {
    log_info "Cleaning build artifacts..."
    
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Cleaned build directory"
    fi
    
    if [ -d "$FRONTEND_DIR/node_modules" ]; then
        rm -rf "$FRONTEND_DIR/node_modules"
        log_info "Cleaned node_modules"
    fi
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        if docker images "$DOCKER_IMAGE" -q | head -1 | grep -q .; then
            docker rmi "$DOCKER_IMAGE" || true
            log_info "Removed Docker image"
        fi
    fi
    
    log_success "Cleanup completed"
}

# Main script logic
case "${1:-production}" in
    "production")
        deploy "production"
        ;;
    "development"|"dev")
        deploy "development"
        ;;
    "test")
        check_prerequisites
        install_dependencies
        run_tests
        ;;
    "build")
        check_prerequisites
        install_dependencies
        build_application
        ;;
    "docker")
        check_prerequisites
        build_docker_image
        ;;
    "clean")
        clean
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
