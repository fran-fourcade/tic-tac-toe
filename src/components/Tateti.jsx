import { useState } from 'react';
import './Tateti.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button 
      className={`square ${isWinningSquare ? 'highlight' : ''}`} 
      onClick={onSquareClick}
    > 
      {value}
    </button>
  );  
}

function Board( {xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    } 
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerData = calculateWinner(squares);
  const winner = winnerData ? winnerData.winner : null;
  const winningSquares = winnerData ? winnerData.winningSquares : [];
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(square => square !== null)) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className='tateti'>
    <div className='status'>{status}</div>
    {Array(3).fill(null).map((_, row) => (
      <div key={row} className='board-row'>
        {Array(3).fill(null).map((_, col) => {
          const index = row * 3 + col;
          return (
            <Square 
              key={index} 
              value={squares[index]} 
              onSquareClick={() => handleClick(index)}
              isWinningSquare={winningSquares.includes(index)}
            />
          );
        })}
      </div>
    ))}
  </div>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sortAscending, setSortAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleOrder() {
    setSortAscending(!sortAscending); 
  }

  const moves = history.map((squares, move) => {
    let description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    )
  });

  if (!sortAscending) {
    moves.reverse(); 
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className='game-info'>
        <button onClick={toggleOrder}>{sortAscending ? 'Sort Descending' : 'Sort Ascending'}</button>
        <ul>{moves}</ul>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]  // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}
