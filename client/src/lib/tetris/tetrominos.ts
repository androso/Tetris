// Define tetromino shapes and their rotations
export interface Tetromino {
  shape: number[][];
  color: string;
  name: string;
}

export interface Position {
  x: number;
  y: number;
}

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

// Define tetromino shapes (0 for empty, 1 for filled)
// Each shape is defined with all its possible rotations
export const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: {
    name: 'I',
    color: '#00FFFF', // Cyan
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  J: {
    name: 'J',
    color: '#0000FF', // Blue
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  L: {
    name: 'L',
    color: '#FFA500', // Orange
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  O: {
    name: 'O',
    color: '#FFFF00', // Yellow
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  S: {
    name: 'S',
    color: '#00FF00', // Green
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  T: {
    name: 'T',
    color: '#FF00FF', // Magenta
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  Z: {
    name: 'Z',
    color: '#FF0000', // Red
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  }
};

// Array of tetromino types for random selection
export const TETROMINO_TYPES: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

// Function to get a random tetromino
export const getRandomTetromino = (): Tetromino => {
  const randomType = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  return { ...TETROMINOS[randomType] };
};

// Function to rotate a tetromino (clockwise)
export const rotateTetromino = (matrix: number[][]): number[][] => {
  const size = matrix.length;
  const rotatedMatrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
  
  // Perform clockwise rotation
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotatedMatrix[x][size - 1 - y] = matrix[y][x];
    }
  }
  
  return rotatedMatrix;
};

// Function to rotate a tetromino counterclockwise
export const rotateTetrominoCounterClockwise = (matrix: number[][]): number[][] => {
  const size = matrix.length;
  const rotatedMatrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
  
  // Perform counterclockwise rotation
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotatedMatrix[size - 1 - x][y] = matrix[y][x];
    }
  }
  
  return rotatedMatrix;
};
