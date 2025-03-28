import { 
  BOARD_WIDTH, 
  BOARD_HEIGHT, 
  POINTS, 
  LINES_PER_LEVEL, 
  SPEED_BY_LEVEL, 
  GameState 
} from './constants';
import { 
  Tetromino, 
  Position, 
  getRandomTetromino, 
  rotateTetromino, 
  rotateTetrominoCounterClockwise, 
  TetrominoType 
} from './tetrominos';

// Game board cell type
export interface Cell {
  filled: boolean;
  color: string;
}

// Game state interface
export interface GameStateInterface {
  board: Cell[][];
  activePiece: Tetromino | null;
  activePosition: Position;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  gameState: GameState;
  lastDropTime: number;
}

// Create an empty game board
export const createEmptyBoard = (): Cell[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' }))
  );
};

// Initialize a new game state
export const initializeGame = (): GameStateInterface => {
  const activePiece = getRandomTetromino();
  const nextPiece = getRandomTetromino();
  
  return {
    board: createEmptyBoard(),
    activePiece,
    activePosition: {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(activePiece.shape[0] / 2),
      y: 0
    },
    nextPiece,
    score: 0,
    level: 0,
    lines: 0,
    gameState: GameState.READY,
    lastDropTime: Date.now()
  };
};

// Check if current piece collides with something
export const checkCollision = (
  piece: Tetromino,
  position: Position,
  board: Cell[][]
): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      // Skip empty cells in the tetromino
      if (!piece.shape[y][x]) continue;
      
      const boardX = position.x + x;
      const boardY = position.y + y;
      
      // Check if out of boundaries
      if (
        boardX < 0 || 
        boardX >= BOARD_WIDTH || 
        boardY >= BOARD_HEIGHT
      ) {
        return true;
      }
      
      // Check if already filled in the board
      if (
        boardY >= 0 && 
        boardY < BOARD_HEIGHT && 
        boardX >= 0 && 
        boardX < BOARD_WIDTH && 
        board[boardY][boardX].filled
      ) {
        return true;
      }
    }
  }
  
  return false;
};

// Merge the active piece with the board
export const mergePieceWithBoard = (gameState: GameStateInterface): Cell[][] => {
  const { board, activePiece, activePosition } = gameState;
  
  if (!activePiece) return board;
  
  // Create a new board to avoid mutating the original
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < activePiece.shape.length; y++) {
    for (let x = 0; x < activePiece.shape[y].length; x++) {
      // Only merge filled cells
      if (activePiece.shape[y][x]) {
        const boardY = activePosition.y + y;
        const boardX = activePosition.x + x;
        
        if (
          boardY >= 0 && 
          boardY < BOARD_HEIGHT && 
          boardX >= 0 && 
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = {
            filled: true,
            color: activePiece.color
          };
        }
      }
    }
  }
  
  return newBoard;
};

// Check for and clear completed lines
export const clearCompletedLines = (board: Cell[][]): {
  newBoard: Cell[][],
  linesCleared: number
} => {
  // Find completed lines (rows where all cells are filled)
  const completedLines = board.reduce<number[]>((acc, row, index) => {
    if (row.every(cell => cell.filled)) {
      acc.push(index);
    }
    return acc;
  }, []);
  
  if (completedLines.length === 0) {
    return { newBoard: board, linesCleared: 0 };
  }
  
  // Create a new board without the completed lines
  const newBoard = board.filter((_, index) => !completedLines.includes(index));
  
  // Add empty lines at the top
  for (let i = 0; i < completedLines.length; i++) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' })));
  }
  
  return {
    newBoard,
    linesCleared: completedLines.length
  };
};

// Calculate score based on lines cleared and current level
export const calculateScore = (linesCleared: number, level: number): number => {
  switch (linesCleared) {
    case 1:
      return POINTS.SINGLE * (level + 1);
    case 2:
      return POINTS.DOUBLE * (level + 1);
    case 3:
      return POINTS.TRIPLE * (level + 1);
    case 4:
      return POINTS.TETRIS * (level + 1);
    default:
      return 0;
  }
};

// Move the active piece down by one row
export const moveDown = (gameState: GameStateInterface): GameStateInterface => {
  const { activePiece, activePosition, board, score } = gameState;
  
  if (!activePiece) return gameState;
  
  const newPosition = { ...activePosition, y: activePosition.y + 1 };
  
  // Check for collision
  if (checkCollision(activePiece, newPosition, board)) {
    // Piece has hit the bottom or another piece
    const newBoard = mergePieceWithBoard(gameState);
    const { newBoard: clearedBoard, linesCleared } = clearCompletedLines(newBoard);
    
    // Calculate new score and level
    const newScore = score + calculateScore(linesCleared, gameState.level);
    const newLines = gameState.lines + linesCleared;
    const newLevel = Math.floor(newLines / LINES_PER_LEVEL);
    
    // Check for game over (if collision happens at the top)
    const isGameOver = activePosition.y <= 0;
    
    // Generate a new active piece
    return {
      ...gameState,
      board: clearedBoard,
      activePiece: isGameOver ? null : gameState.nextPiece,
      activePosition: isGameOver ? activePosition : {
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(gameState.nextPiece.shape[0] / 2),
        y: 0
      },
      nextPiece: isGameOver ? gameState.nextPiece : getRandomTetromino(),
      score: newScore,
      level: newLevel,
      lines: newLines,
      gameState: isGameOver ? GameState.GAME_OVER : gameState.gameState,
      lastDropTime: Date.now()
    };
  }
  
  // Simply move the piece down
  return {
    ...gameState,
    activePosition: newPosition,
    lastDropTime: Date.now()
  };
};

// Move the active piece left or right
export const moveHorizontal = (
  gameState: GameStateInterface,
  direction: 'left' | 'right'
): GameStateInterface => {
  const { activePiece, activePosition, board } = gameState;
  
  if (!activePiece) return gameState;
  
  const offset = direction === 'left' ? -1 : 1;
  const newPosition = { ...activePosition, x: activePosition.x + offset };
  
  // Check for collision
  if (!checkCollision(activePiece, newPosition, board)) {
    return {
      ...gameState,
      activePosition: newPosition
    };
  }
  
  return gameState;
};

// Rotate the active piece
export const rotatePiece = (
  gameState: GameStateInterface,
  direction: 'clockwise' | 'counterClockwise' = 'clockwise'
): GameStateInterface => {
  const { activePiece, activePosition, board } = gameState;
  
  if (!activePiece) return gameState;
  
  // Create a new rotated piece
  const rotatedShape = direction === 'clockwise'
    ? rotateTetromino(activePiece.shape)
    : rotateTetrominoCounterClockwise(activePiece.shape);
  
  const rotatedPiece = {
    ...activePiece,
    shape: rotatedShape
  };
  
  // Check if the rotation is valid
  if (!checkCollision(rotatedPiece, activePosition, board)) {
    return {
      ...gameState,
      activePiece: rotatedPiece
    };
  }
  
  // Try wall kicks - attempt to shift the piece if rotation at the current position fails
  const kickOffsets = [
    { x: 1, y: 0 },   // try right
    { x: -1, y: 0 },  // try left
    { x: 0, y: -1 },  // try up
    { x: 2, y: 0 },   // try 2 right
    { x: -2, y: 0 }   // try 2 left
  ];
  
  for (const offset of kickOffsets) {
    const kickPosition = {
      x: activePosition.x + offset.x,
      y: activePosition.y + offset.y
    };
    
    if (!checkCollision(rotatedPiece, kickPosition, board)) {
      return {
        ...gameState,
        activePiece: rotatedPiece,
        activePosition: kickPosition
      };
    }
  }
  
  // If all kick attempts fail, return the original state
  return gameState;
};

// Drop the piece all the way down
export const hardDrop = (gameState: GameStateInterface): GameStateInterface => {
  let { activePiece, activePosition, board } = gameState;
  
  if (!activePiece) return gameState;
  
  let dropDistance = 0;
  let newPosition = { ...activePosition };
  
  // Find the furthest position the piece can drop to
  while (!checkCollision(activePiece, { ...newPosition, y: newPosition.y + 1 }, board)) {
    newPosition.y += 1;
    dropDistance += 1;
  }
  
  // Add points for hard drop
  const hardDropPoints = dropDistance * POINTS.HARD_DROP;
  
  // Update the game state with the dropped piece position
  const droppedState = {
    ...gameState,
    activePosition: newPosition,
    score: gameState.score + hardDropPoints
  };
  
  // Then process the drop as a normal collision
  return moveDown(droppedState);
};

// Get the shadow position (ghost piece) for the current active piece
export const getShadowPosition = (gameState: GameStateInterface): Position | null => {
  const { activePiece, activePosition, board } = gameState;
  
  if (!activePiece) return null;
  
  let shadowPosition = { ...activePosition };
  
  // Move down until a collision
  while (!checkCollision(activePiece, { ...shadowPosition, y: shadowPosition.y + 1 }, board)) {
    shadowPosition.y += 1;
  }
  
  return shadowPosition;
};

// Get the drop speed based on the current level
export const getDropSpeed = (level: number): number => {
  return level >= SPEED_BY_LEVEL.length 
    ? SPEED_BY_LEVEL[SPEED_BY_LEVEL.length - 1] 
    : SPEED_BY_LEVEL[level];
};

// Check if it's time to drop the piece based on level
export const shouldDropPiece = (lastDropTime: number, level: number): boolean => {
  const currentTime = Date.now();
  const dropSpeed = getDropSpeed(level);
  return currentTime - lastDropTime > dropSpeed;
};

// Reset the game to its initial state
export const resetGame = (): GameStateInterface => {
  return initializeGame();
};

// Toggle pause state
export const togglePause = (gameState: GameStateInterface): GameStateInterface => {
  if (gameState.gameState === GameState.PLAYING) {
    return { ...gameState, gameState: GameState.PAUSED };
  } else if (gameState.gameState === GameState.PAUSED) {
    return { ...gameState, gameState: GameState.PLAYING };
  }
  return gameState;
};
