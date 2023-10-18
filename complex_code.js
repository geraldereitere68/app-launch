// complex_code.js

// This is a complex JavaScript code example that generates a maze using a randomized Prim's algorithm.
// It creates a 2D grid of cells, carves passages using the algorithm, and visualizes the maze using HTML canvas.

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 20;
const mazeWidth = Math.floor(canvas.width / cellSize);
const mazeHeight = Math.floor(canvas.height / cellSize);

let maze = createEmptyMaze();
const startCell = { x: 0, y: 0 };
const endCell = { x: mazeWidth - 1, y: mazeHeight - 1 };
let visitedCells = [];
let stack = [];

function createEmptyMaze() {
  const maze = [];
  for (let row = 0; row < mazeHeight; row++) {
    maze[row] = [];
    for (let col = 0; col < mazeWidth; col++) {
      maze[row][col] = { visited: false, topWall: true, rightWall: true, bottomWall: true, leftWall: true };
    }
  }
  return maze;
}

function carvePassage(currentCell, nextCell) {
  const colDiff = nextCell.x - currentCell.x;
  const rowDiff = nextCell.y - currentCell.y;

  if (colDiff === 1) {
    currentCell.rightWall = false;
    nextCell.leftWall = false;
  } else if (colDiff === -1) {
    currentCell.leftWall = false;
    nextCell.rightWall = false;
  } else if (rowDiff === 1) {
    currentCell.bottomWall = false;
    nextCell.topWall = false;
  } else if (rowDiff === -1) {
    currentCell.topWall = false;
    nextCell.bottomWall = false;
  }
}

function getRandomNeighbour(cell) {
  const neighbours = [];

  const top = maze[cell.y - 1]?.[cell.x];
  const right = maze[cell.y]?.[cell.x + 1];
  const bottom = maze[cell.y + 1]?.[cell.x];
  const left = maze[cell.y]?.[cell.x - 1];

  if (top && !top.visited) neighbours.push(top);
  if (right && !right.visited) neighbours.push(right);
  if (bottom && !bottom.visited) neighbours.push(bottom);
  if (left && !left.visited) neighbours.push(left);

  if (neighbours.length > 0) {
    const randIndex = Math.floor(Math.random() * neighbours.length);
    return neighbours[randIndex];
  } else {
    return null;
  }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  for (let row = 0; row < mazeHeight; row++) {
    for (let col = 0; col < mazeWidth; col++) {
      const cell = maze[row][col];

      if (cell.topWall) drawWall(col * cellSize, row * cellSize, col * cellSize + cellSize, row * cellSize);
      if (cell.rightWall) drawWall(col * cellSize + cellSize, row * cellSize, col * cellSize + cellSize, row * cellSize + cellSize);
      if (cell.bottomWall) drawWall(col * cellSize, row * cellSize + cellSize, col * cellSize + cellSize, row * cellSize + cellSize);
      if (cell.leftWall) drawWall(col * cellSize, row * cellSize, col * cellSize, row * cellSize + cellSize);
    }
  }

  ctx.fillStyle = "#00ff00";
  ctx.fillRect(startCell.x * cellSize, startCell.y * cellSize, cellSize, cellSize);
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(endCell.x * cellSize, endCell.y * cellSize, cellSize, cellSize);
}

function drawWall(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function generateMaze() {
  const start = maze[startCell.y][startCell.x];
  start.visited = true;
  visitedCells.push(start);
  stack.push(start);

  while (stack.length > 0) {
    const currentCell = stack.pop();
    const randomNeighbour = getRandomNeighbour(currentCell);

    if (randomNeighbour) {
      randomNeighbour.visited = true;
      visitedCells.push(randomNeighbour);
      stack.push(randomNeighbour);

      carvePassage(currentCell, randomNeighbour);
    }
  }

  drawMaze();
}

generateMaze();
