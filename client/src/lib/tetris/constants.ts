// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

// Game speeds (milliseconds per drop)
export const SPEED_BY_LEVEL = [
  800,  // Level 0
  720,  // Level 1
  630,  // Level 2
  550,  // Level 3
  470,  // Level 4
  380,  // Level 5
  300,  // Level 6
  220,  // Level 7
  130,  // Level 8
  100,  // Level 9
  80    // Level 10+
];

// Scoring system
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
};

// Level up threshold (lines cleared)
export const LINES_PER_LEVEL = 10;

// Game states
export enum GameState {
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver'
}

// Tetromino colors
export const TETROMINO_COLORS = {
  I: '#00FFFF', // Cyan
  J: '#0000FF', // Blue
  L: '#FFA500', // Orange
  O: '#FFFF00', // Yellow
  S: '#00FF00', // Green
  T: '#FF00FF', // Magenta
  Z: '#FF0000'  // Red
};

// Touch control area sizes
export const TOUCH_CONTROLS = {
  BUTTON_SIZE: 60,
  SWIPE_THRESHOLD: 40,
};
