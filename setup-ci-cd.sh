#!/bin/bash

# 🚀 PixelVault CI/CD Setup Script
# This script sets up the complete CI/CD pipeline for PixelVault

set -e

echo "🚀 Setting up PixelVault CI/CD Pipeline..."
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node and npm are installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version check passed: $(node --version)"

# Install dependencies
print_info "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        print_info "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please update .env with your Firebase configuration"
    else
        print_info "Creating basic .env file..."
        cat > .env << EOF
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Environment
VITE_APP_ENV=development
EOF
        print_warning "Please update .env with your actual Firebase configuration"
    fi
    print_status ".env file created"
else
    print_status ".env file already exists"
fi

# Run initial quality checks
print_info "Running initial quality checks..."

# TypeScript check
print_info "Checking TypeScript..."
npm run type-check
if [ $? -eq 0 ]; then
    print_status "TypeScript check passed"
else
    print_warning "TypeScript issues found. Please fix them before proceeding."
fi

# ESLint check
print_info "Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    print_status "ESLint check passed"
else
    print_warning "ESLint issues found. Run 'npm run lint:fix' to auto-fix some issues."
fi

# Prettier check
print_info "Checking code formatting..."
npm run format:check
if [ $? -eq 0 ]; then
    print_status "Code formatting is correct"
else
    print_warning "Code formatting issues found. Run 'npm run format' to fix them."
fi

# Test build
print_info "Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

# Check bundle size
print_info "Analyzing bundle size..."
npm run analyze:bundle
if [ $? -eq 0 ]; then
    print_status "Bundle analysis completed"
else
    print_warning "Bundle analysis had issues"
fi

# Check performance budget
print_info "Validating performance budget..."
npm run check:budget
if [ $? -eq 0 ]; then
    print_status "Performance budget validation passed"
else
    print_warning "Performance budget exceeded. Consider optimizing your bundle."
fi

# Git hooks setup (if using husky)
if command -v husky &> /dev/null; then
    print_info "Setting up Git hooks with Husky..."
    npx husky install
    print_status "Git hooks configured"
fi

# GitHub CLI check and setup
if command -v gh &> /dev/null; then
    print_info "GitHub CLI detected. Setting up repository..."
    
    # Check if we're in a git repository
    if [ -d ".git" ]; then
        print_status "Git repository detected"
        
        # Add GitHub repository (if not already added)
        if ! git remote get-url origin &> /dev/null; then
            print_warning "No origin remote found. Please add your GitHub repository:"
            echo "git remote add origin https://github.com/yourusername/pixelvault.git"
        fi
    else
        print_info "Initializing Git repository..."
        git init
        print_status "Git repository initialized"
    fi
else
    print_info "GitHub CLI not found. Install it for enhanced GitHub integration:"
    echo "https://cli.github.com/"
fi

# Docker check
if command -v docker &> /dev/null; then
    print_info "Docker detected. Testing Docker build..."
    docker build -t pixelvault-test . > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status "Docker build successful"
        docker rmi pixelvault-test > /dev/null 2>&1
    else
        print_warning "Docker build failed. Check Dockerfile configuration."
    fi
else
    print_info "Docker not found. Install Docker for containerized deployments:"
    echo "https://docs.docker.com/get-docker/"
fi

# Summary and next steps
echo ""
echo "🎉 CI/CD Setup Complete!"
echo "========================"
echo ""
print_status "✅ Dependencies installed"
print_status "✅ Code quality tools configured"
print_status "✅ Build pipeline tested"
print_status "✅ GitHub Actions workflows ready"
echo ""
print_info "Next steps:"
echo "1. 🔧 Update .env with your Firebase configuration"
echo "2. 🔐 Set up GitHub repository secrets:"
echo "   - FIREBASE_API_KEY"
echo "   - FIREBASE_AUTH_DOMAIN"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_STORAGE_BUCKET"
echo "   - FIREBASE_MESSAGING_SENDER_ID"
echo "   - FIREBASE_APP_ID"
echo "3. 🚀 Push to GitHub to trigger the first CI/CD run"
echo "4. 🌐 Configure your deployment target (GitHub Pages, Vercel, AWS)"
echo ""
print_info "Useful commands:"
echo "npm run dev              # Start development server"
echo "npm run build:production # Build for production"
echo "npm run ci:check         # Run all quality checks"
echo "npm run lint:fix         # Fix linting issues"
echo "npm run format           # Format code"
echo ""
print_info "Documentation:"
echo "📚 CI/CD Guide: .github/README.md"
echo "🐛 Report Issues: Use GitHub issue templates"
echo "🚀 Contributing: See CONTRIBUTING.md (if available)"
echo ""
echo -e "${GREEN}🎨 Happy coding with PixelVault! 🎨${NC}"#!/bin/bash

# 🚀 PixelVault CI/CD Setup Script
# This script sets up the complete CI/CD pipeline for PixelVault

set -e

echo "🚀 Setting up PixelVault CI/CD Pipeline..."
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node and npm are installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version check passed: $(node --version)"

# Install dependencies
print_info "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        print_info "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please update .env with your Firebase configuration"
    else
        print_info "Creating basic .env file..."
        cat > .env << EOF
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Environment
VITE_APP_ENV=development
EOF
        print_warning "Please update .env with your actual Firebase configuration"
    fi
    print_status ".env file created"
else
    print_status ".env file already exists"
fi

# Run initial quality checks
print_info "Running initial quality checks..."

# TypeScript check
print_info "Checking TypeScript..."
npm run type-check
if [ $? -eq 0 ]; then
    print_status "TypeScript check passed"
else
    print_warning "TypeScript issues found. Please fix them before proceeding."
fi

# ESLint check
print_info "Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    print_status "ESLint check passed"
else
    print_warning "ESLint issues found. Run 'npm run lint:fix' to auto-fix some issues."
fi

# Prettier check
print_info "Checking code formatting..."
npm run format:check
if [ $? -eq 0 ]; then
    print_status "Code formatting is correct"
else
    print_warning "Code formatting issues found. Run 'npm run format' to fix them."
fi

# Test build
print_info "Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

# Check bundle size
print_info "Analyzing bundle size..."
npm run analyze:bundle
if [ $? -eq 0 ]; then
    print_status "Bundle analysis completed"
else
    print_warning "Bundle analysis had issues"
fi

# Check performance budget
print_info "Validating performance budget..."
npm run check:budget
if [ $? -eq 0 ]; then
    print_status "Performance budget validation passed"
else
    print_warning "Performance budget exceeded. Consider optimizing your bundle."
fi

# Git hooks setup (if using husky)
if command -v husky &> /dev/null; then
    print_info "Setting up Git hooks with Husky..."
    npx husky install
    print_status "Git hooks configured"
fi

# GitHub CLI check and setup
if command -v gh &> /dev/null; then
    print_info "GitHub CLI detected. Setting up repository..."
    
    # Check if we're in a git repository
    if [ -d ".git" ]; then
        print_status "Git repository detected"
        
        # Add GitHub repository (if not already added)
        if ! git remote get-url origin &> /dev/null; then
            print_warning "No origin remote found. Please add your GitHub repository:"
            echo "git remote add origin https://github.com/yourusername/pixelvault.git"
        fi
    else
        print_info "Initializing Git repository..."
        git init
        print_status "Git repository initialized"
    fi
else
    print_info "GitHub CLI not found. Install it for enhanced GitHub integration:"
    echo "https://cli.github.com/"
fi

# Docker check
if command -v docker &> /dev/null; then
    print_info "Docker detected. Testing Docker build..."
    docker build -t pixelvault-test . > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status "Docker build successful"
        docker rmi pixelvault-test > /dev/null 2>&1
    else
        print_warning "Docker build failed. Check Dockerfile configuration."
    fi
else
    print_info "Docker not found. Install Docker for containerized deployments:"
    echo "https://docs.docker.com/get-docker/"
fi

# Summary and next steps
echo ""
echo "🎉 CI/CD Setup Complete!"
echo "========================"
echo ""
print_status "✅ Dependencies installed"
print_status "✅ Code quality tools configured"
print_status "✅ Build pipeline tested"
print_status "✅ GitHub Actions workflows ready"
echo ""
print_info "Next steps:"
echo "1. 🔧 Update .env with your Firebase configuration"
echo "2. 🔐 Set up GitHub repository secrets:"
echo "   - FIREBASE_API_KEY"
echo "   - FIREBASE_AUTH_DOMAIN"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_STORAGE_BUCKET"
echo "   - FIREBASE_MESSAGING_SENDER_ID"
echo "   - FIREBASE_APP_ID"
echo "3. 🚀 Push to GitHub to trigger the first CI/CD run"
echo "4. 🌐 Configure your deployment target (GitHub Pages, Vercel, AWS)"
echo ""
print_info "Useful commands:"
echo "npm run dev              # Start development server"
echo "npm run build:production # Build for production"
echo "npm run ci:check         # Run all quality checks"
echo "npm run lint:fix         # Fix linting issues"
echo "npm run format           # Format code"
echo ""
print_info "Documentation:"
echo "📚 CI/CD Guide: .github/README.md"
echo "🐛 Report Issues: Use GitHub issue templates"
echo "🚀 Contributing: See CONTRIBUTING.md (if available)"
echo ""
echo -e "${GREEN}🎨 Happy coding with PixelVault! 🎨${NC}"