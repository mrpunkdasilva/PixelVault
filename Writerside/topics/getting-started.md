# Getting Started

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## 🔧 Installation

### Option 1: Standard Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mrpunkdasilva/pixelvault.git
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
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

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

4. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

## 🔥 Firebase Setup

This application requires a Firebase project with Storage enabled:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firebase Storage
4. Navigate to Project Settings > General > Your Apps
5. Create a new Web App or select an existing one
6. Copy the Firebase configuration values to your `.env` file
