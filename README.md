# React Tetris Game

A modern implementation of the classic Tetris game built with React, Canvas, and TypeScript. This web-based game features classic gameplay mechanics, vibrant block colors, and responsive controls for both desktop and mobile devices.

![Tetris Game Screenshot](docs/tetris-screenshot.png)

## Features

- **Classic Tetris Gameplay**: Arrange falling blocks to create complete lines
- **Responsive Design**: Play on desktop or mobile devices with tailored controls
- **Smooth Graphics**: Canvas-based rendering for smooth, pixel-perfect graphics
- **Complete Game Mechanics**:
  - Score tracking with traditional Tetris scoring system
  - Level progression that increases game speed
  - Next piece preview
  - Ghost piece to help with placement
  - Wall kicks for rotation near boundaries
- **Customized Controls**:
  - Keyboard controls for desktop users
  - Touch controls optimized for mobile devices
- **Game States**: Start, pause, resume, and game over states
- **Sound Effects**: Background music and gameplay sound effects

## Controls

### Desktop (Keyboard)

- **Arrow Left/Right**: Move piece horizontally
- **Arrow Down**: Soft drop (move down faster)
- **Arrow Up** or **X**: Rotate clockwise
- **Z**: Rotate counter-clockwise
- **Space**: Hard drop (instant placement)
- **P**: Pause/resume game
- **Enter**: Start/restart game

### Mobile (Touch)

- **Swipe Left/Right**: Move piece horizontally
- **Swipe Down**: Soft drop
- **Tap**: Rotate piece
- **Long Press**: Hard drop
- **On-screen Buttons**: Pause, resume, restart, and mute

## Technical Implementation

- **React**: Component-based architecture for UI elements
- **TypeScript**: For type safety and better developer experience
- **Canvas API**: For efficient game rendering
- **Zustand**: State management for game logic
- **TailwindCSS**: Responsive styling
- **CSS Animations**: For visual effects
- **Web Audio API**: For sound effects and music

## Game Mechanics

The game follows standard Tetris rules:

1. Seven different tetrominoes (shapes) fall from the top of the playing field
2. Player can move, rotate, and drop pieces
3. When a horizontal line is filled with blocks, it clears and awards points
4. The game ends when the stack of tetrominoes reaches the top of the playing field
5. The game speed increases as the player clears more lines and advances through levels

## Score System

- **1 Line**: 100 × Level
- **2 Lines**: 300 × Level
- **3 Lines**: 500 × Level
- **4 Lines** (Tetris): 800 × Level
- **Soft Drop**: 1 point per cell dropped
- **Hard Drop**: 2 points per cell dropped

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/react-tetris.git
cd react-tetris

# Install dependencies
npm install
# or
yarn install
```

### Running Locally

```bash
# Start the development server
npm run dev
# or
yarn dev
```

Visit `http://localhost:5000` to play the game.

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build
```

## License

MIT

## Acknowledgments

- Original Tetris game created by Alexey Pajitnov
- Inspired by various web-based Tetris implementations
- Built with React and modern web technologies