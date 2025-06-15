#!/bin/bash

# Make this script executable with: chmod +x docker-scripts.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
  echo -e "${YELLOW}PixelVault - Modern Photo Gallery Docker Helper${NC}"
  echo ""
  echo "Usage: ./docker-scripts.sh [command]"
  echo ""
  echo "Commands:"
  echo "  dev       - Start development environment"
  echo "  prod      - Start production environment"
  echo "  build     - Build Docker images"
  echo "  stop      - Stop all containers"
  echo "  clean     - Remove all containers and images related to this project"
  echo "  help      - Show this help message"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
  exit 1
fi

# Process commands
case "$1" in
  dev)
    echo -e "${GREEN}Starting development environment...${NC}"
    docker-compose up app-dev
    ;;
  prod)
    echo -e "${GREEN}Starting production environment...${NC}"
    docker-compose up -d app-prod
    echo -e "${GREEN}Application is running at http://localhost${NC}"
    ;;
  build)
    echo -e "${GREEN}Building Docker images...${NC}"
    docker-compose build
    ;;
  stop)
    echo -e "${GREEN}Stopping all containers...${NC}"
    docker-compose down
    ;;
  clean)
    echo -e "${GREEN}Removing all containers and images related to this project...${NC}"
    docker-compose down --rmi all
    ;;
  help|*)
    show_help
    ;;
esac