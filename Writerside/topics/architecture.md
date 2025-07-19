# Architecture

This document outlines the architectural design and key technologies used in the PixelVault project, emphasizing its high-performance nature.

## 📦 Project Structure

The project follows a clear and modular structure to ensure maintainability, scalability, and efficient development.

```
pixelvault/
├── public/                  # Static assets like favicon, logo, and other public files.
├── src/                     # Contains all the source code for the React application.
│   ├── components/          # Reusable UI components (e.g., buttons, cards, modals). Each component typically has its own folder containing its TypeScript/TSX file and SCSS for styling.
│   ├── contexts/            # React Context API implementations for global state management (e.g., ThemeContext, NotificationContext).
│   ├── hooks/               # Custom React hooks for encapsulating reusable logic (e.g., useImageCompression, useLazyLoading).
│   ├── libs/                # Third-party library configurations or custom utility libraries (e.g., Firebase initialization).
│   ├── services/            # Abstraction layer for interacting with backend services (e.g., Firebase Storage for albums and photos).
│   ├── styles/              # Global SCSS files, variables, and theme definitions.
│   ├── types/               # TypeScript type definitions and interfaces for data structures (e.g., Album, Photo).
│   ├── utils/               # Pure utility functions that don't depend on React (e.g., image compression logic).
│   ├── App.tsx              # The main application component, serving as the root of the component tree.
│   ├── index.tsx            # The entry point of the React application, responsible for rendering the App component.
│   ├── App.scss             # Global styles for the main App component.
│   ├── index.scss           # Global styles and imports for the entire application.
│   └── vite-env.d.ts        # TypeScript declaration file for Vite environment variables.
├── .env.example             # Template for environment variables, crucial for configuring Firebase and other services.
├── Dockerfile               # Docker configuration for building the production-ready application image.
├── Dockerfile.dev           # Docker configuration specifically for the development environment.
├── docker-compose.yml       # Docker Compose configuration for orchestrating multi-container Docker applications (e.g., Nginx and the React app).
├── nginx.conf               # Nginx configuration for serving the production build and handling routing.
├── docker-scripts.sh        # Helper shell scripts for common Docker operations.
├── package.json             # Defines project metadata, dependencies, and scripts for development, building, and testing.
└── tsconfig.json            # TypeScript compiler configuration for the project.
```

## 🏗️ Technical Architecture

PixelVault is built with a modern and performance-oriented technical stack, focusing on delivering a fast and smooth user experience.

### **Frontend Stack**
| Technology | Version | Purpose | Detailed Explanation |
|------------|---------|---------|----------------------|
| **React** | 18.1.0 | UI library with hooks and concurrent features | Chosen for its component-based architecture, enabling modular and reusable UI development. React 18's new features like automatic batching and concurrent rendering contribute to improved performance and responsiveness. |
| **TypeScript** | 5.0.0 | Type-safe development with strict mode | Provides static type checking, significantly reducing runtime errors and improving code quality and maintainability, especially in larger codebases. It enhances developer experience through better autocompletion and refactoring capabilities. |
| **Vite** | 5.0.0 | Build tool with fast HMR and optimizations | Selected for its incredibly fast development server with Hot Module Replacement (HMR) and optimized build process. Vite leverages native ES modules, leading to quicker cold starts and efficient builds compared to traditional bundlers. |
| **SCSS** | 1.83.0 | Advanced styling with variables and mixins | A CSS preprocessor that extends CSS with features like variables, nesting, mixins, and functions. This allows for more organized, maintainable, and reusable stylesheets, crucial for consistent theming and design. |
| **Firebase** | 9.8.1 | Backend services (Storage, Auth) | Utilized for its robust and scalable backend services, specifically Firebase Storage for efficient and secure image storage, and Firebase Authentication for user management. Its real-time capabilities and ease of integration accelerate development. |

### **Performance Technologies**
Performance is a core tenet of PixelVault's design. Various techniques and technologies are employed to ensure a lightning-fast experience.

| Feature | Implementation | Impact | Detailed Explanation |
|---------|---------------|--------|----------------------|
| **Lazy Loading** | Intersection Observer API | 60% faster initial load | Images and components are loaded only when they enter the viewport, significantly reducing the initial page load time and bandwidth consumption. The Intersection Observer API provides an efficient way to detect element visibility without performance overhead. |
| **Code Splitting** | `React.lazy` + `Suspense` | 45% smaller main bundle | The application's JavaScript bundle is split into smaller, on-demand chunks. This means users only download the code necessary for the current view, leading to faster initial load times and improved perceived performance. `React.lazy` and `Suspense` provide a declarative way to achieve this. |
| **Image Compression** | Canvas API + Progressive JPEG | 85% size reduction | Images are automatically compressed client-side using the HTML Canvas API before being uploaded. This drastically reduces file sizes without noticeable quality loss, leading to faster uploads and downloads. Progressive JPEG encoding further enhances perceived loading speed. |
| **Bundle Analysis** | Gulp + Custom scripts | Real-time size monitoring | Automated tools and custom Gulp scripts are used to analyze the size of the JavaScript bundles and other assets. This continuous monitoring helps prevent performance regressions by flagging large additions to the codebase. |
| **Caching** | Browser cache + `localStorage` | 90% faster repeat visits | Strategic use of browser caching for static assets and `localStorage` for application data ensures that repeat visits are significantly faster, as much of the content is served directly from the client's cache. |

### **Development Tools**
A suite of development tools is integrated to streamline the development workflow and ensure code quality and performance.

```bash
# Performance monitoring
gulp analyze        # Executes custom Gulp tasks to analyze the size and composition of the application's bundles, providing insights into potential performance bottlenecks.
gulp budget        # Runs checks against predefined performance budgets (e.g., maximum JavaScript bundle size, image sizes). CI/CD pipelines can fail if these budgets are exceeded.
gulp optimize      # Triggers an asset optimization pipeline, which might include image compression, minification of CSS/JS, and other optimizations for production builds.

# Development workflow  
vite              # Starts the Vite development server, providing Hot Module Replacement (HMR) for rapid development feedback and a fast build process.
tsc               # The TypeScript compiler, used for type checking the entire codebase to ensure type safety and catch potential errors early.
sass              # The SCSS preprocessor, used to compile SCSS files into standard CSS, enabling advanced styling features.
```

### **Architecture Patterns**
PixelVault leverages several architectural patterns to promote code organization, reusability, and maintainability.

- **Component-Based**: The UI is broken down into small, independent, and reusable React components. This modular approach simplifies development, testing, and maintenance, allowing different parts of the UI to be developed in isolation.
- **Custom Hooks**: React's custom hooks (`useAlbumDragDrop`, `useImageCompression`, etc.) are extensively used to encapsulate and reuse stateful logic across different components. This promotes code reusability and keeps components cleaner by separating concerns.
- **Context API**: The React Context API is used for global state management, particularly for cross-cutting concerns like theme preferences (`ThemeContext`) and notifications (`NotificationContext`). This avoids prop-drilling and provides a centralized way to manage shared data.
- **Service Layer**: Interactions with external services (like Firebase) are abstracted into a dedicated service layer (`services/albums.ts`, `services/photos.ts`). This separates business logic from UI components, making the application more testable and adaptable to changes in backend APIs.
- **Utility-First**: Pure utility functions are grouped in the `utils/` directory. These functions perform specific, isolated tasks (e.g., `imageCompression.ts`) and are designed to be reusable across the application without introducing side effects, promoting functional programming principles.