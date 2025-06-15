# PixelVault - Modern Photo Gallery

[![React](https://img.shields.io/badge/React-18.1.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.8.1-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-5.3.5-DB7093?logo=styled-components&logoColor=white)](https://styled-components.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

PixelVault is a sleek, modern photo gallery application built with React, TypeScript, and Firebase Storage. This powerful yet intuitive application allows users to securely upload, organize, view, and manage their photos in a responsive gallery interface. With real-time updates and cloud storage, your memories are always accessible and protected.

[//]: # (![Gallery Screenshot]&#40;https://via.placeholder.com/800x400?text=Gallery+Screenshot&#41;)

## 🚀 Features

- **Photo Upload**: Easily upload photos to your gallery
- **Real-time Updates**: Gallery updates instantly when new photos are added
- **Responsive Design**: Works on desktop and mobile devices
- **Firebase Integration**: Secure cloud storage for your images
- **TypeScript**: Full type safety throughout the application
- **Docker Support**: Easy deployment with Docker

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## 🔧 Installation

### Option 1: Standard Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pixelvault.git
   cd pixelvault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template and fill in your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Option 2: Docker Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pixelvault.git
   cd pixelvault
   ```

2. Create a `.env` file based on the `.env.example` template and fill in your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

3. Build and run the Docker container:
   ```bash
   docker compose up -d
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🔥 Firebase Setup

This application requires a Firebase project with Storage enabled:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firebase Storage
4. Navigate to Project Settings > General > Your Apps
5. Create a new Web App or select an existing one
6. Copy the Firebase configuration values to your `.env` file

## 📦 Project Structure

```
pixelvault/
├── public/                  # Static files
├── src/                     # Source code
│   ├── components/          # React components
│   ├── libs/                # Utility libraries
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Application entry point
├── .env.example             # Environment variables template
├── Dockerfile               # Docker configuration
├── Dockerfile.dev           # Development Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── nginx.conf               # Nginx configuration for production
├── docker-scripts.sh        # Helper scripts for Docker operations
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🧪 Running Tests

```bash
npm test
```

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🐳 Docker Commands

Build the Docker image:
```bash
docker build -t pixelvault .
```

Run the Docker container:
```bash
docker run -p 3000:3000 pixelvault
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
