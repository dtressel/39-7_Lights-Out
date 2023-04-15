import { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    while (initialBoard.length < ncols) {
      const row = [];
      while (row.length < nrows) {
        row.push(!!Math.floor(Math.random() * 2));
      }
      initialBoard.push(row);
    }

    return initialBoard;
  }

  function hasWon() {
    for (const row of board) {
      for (const light of row) {
        if (light) return false;
      }
    }
    return true;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      // flips an individual cell
      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const boardCopy = [];
      for (const row of board) {
        boardCopy.push([...row]);
      }

      // In the copy, flip this cell and the cells around it
      const cellsToFlip = [[y, x], [y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]];
      for (const cell of cellsToFlip) {
        flipCell(cell[0], cell[1], boardCopy);
      }

      // Return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) return <h2>You Won!!!</h2>

  // make table board
  return board.map((row, y) => {
    const cellHtmlArray = row.map((cell, x) => {
      return <Cell flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)} isLit={cell} />
    });
    return <div class="Board-row">{cellHtmlArray}</div>;
  });
}

export default Board;