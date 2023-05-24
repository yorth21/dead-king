import { useState, useEffect } from "react";
import { buscarCamino } from "./logic/buscarCamino";

function App() {
  const [board, setBoard] = useState([]);
  const [horsePositions, setHorsePositions] = useState([]);
  const [kingPosition, setKingPosition] = useState({ x: 0, y: 0 });
  const [countMovimientos, setCountMovimientos] = useState(0);

  function generateBoard() {
    const newBoard = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = {
          x: col + 1,
          y: 8 - row,
          isBorder: row === 0 || row === 7 || col === 0 || col === 7,
        };
        newBoard.push(square);
      }
    }

    setBoard(newBoard);
  }

  function moveHorses(posiciones) {
    setHorsePositions(posiciones);
  }

  useEffect(() => {
    generateBoard();
  }, []);

  function handleClick(square) {
    // Validar que el caballo no este superpuesto
    if (
      horsePositions.find(
        (horse) => horse.x === square.x && horse.y === square.y
      ) ||
      (kingPosition.x === square.x && kingPosition.y === square.y)
    ) {
      console.log("No pongas una ficha encima de otra");
      return;
    }
    if (horsePositions.length < 4) {
      const newHorses = [...horsePositions];
      newHorses.push(square);
      setHorsePositions(newHorses);
    } else {
      if (square.isBorder === true) {
        setKingPosition(square);
      } else {
        console.log("Solo puede estar ubicado en los bordes");
      }
    }
  }

  function playGame() {
    // Validar que los datos ya esten llenos
    if (
      horsePositions.length === 4 &&
      kingPosition.x !== 0 &&
      kingPosition.y !== 0
    ) {
      console.log("datos llenos");
      const camino = buscarCamino(horsePositions, kingPosition);
      const posicionesCaballos = camino.map((posiciones) => {
        return posiciones.caballos;
      });
      let counter = 0;
      const interval = setInterval(() => {
        moveHorses(posicionesCaballos[counter]);
        setCountMovimientos(counter);
        counter++;
        if (counter === posicionesCaballos.length) {
          clearInterval(interval);
        }
      }, 1500);
    } else {
      console.log("No has llenado los datos");
      return;
    }
  }

  function resetGame() {
    setHorsePositions([]);
    setKingPosition({ x: 0, y: 0 });
    setCountMovimientos(0);
    console.log("reset game");
  }

  return (
    <main className="board">
      <h1>Dead King</h1>
      <h2>🐴x4 VS 👑x1</h2>
      <p>Movimientos: {countMovimientos}</p>
      <div className="container-game">
        <div className="game">
          {board.map((square, index) => (
            <div
              key={index}
              className={`square ${square.isBorder ? "border-cell" : ""}`}
              onClick={() => handleClick(square)}
            >
              {horsePositions.map((position, horseIndex) =>
                position.x === square.x && position.y === square.y ? (
                  <span
                    className="icon"
                    key={horseIndex}
                    role="img"
                    aria-label="horse"
                  >
                    🐴
                  </span>
                ) : null
              )}
              {kingPosition.x === square.x && kingPosition.y === square.y ? (
                <span className="icon" role="img" aria-label="king">
                  👑
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="buttons">
        <button onClick={resetGame}>Reset game</button>
        <button onClick={playGame} className="play">
          Play game
        </button>
      </div>
    </main>
  );
}

export default App;
