# Photos Grid

A responsive, optimized, and virtualized masonry grid layout for displaying photos from Pexels API.

## Features

- Virtualized masonry grid layout
- Detailed photo view
- Responsive design
- TypeScript implementation
- Performance optimized

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Pexels API key:
   ```
   VITE_PEXELS_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Project Structure

src/
├── components/ # Reusable components
├── hooks/ # Custom React hooks
├── services/ # API and other services
├── types/ # TypeScript type definitions
├── utils/ # Utility functions
├── pages/ # Page components
└── styles/ # Global styles and themes


## Design Decisions

- Using Vite for faster development and build times
- Styled-components for CSS-in-JS styling
- Custom virtualization implementation for better control and optimization
- TypeScript for type safety and better developer experience