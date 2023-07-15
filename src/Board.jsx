import React, { useCallback, useMemo, useState } from "react";

const Board = ({ snakes, ladders, rows = 10, cols = 10 }) => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [diceVal, setDiceVal] = useState(0);
  const [won, setWon] = useState(false);

  const handleRollDice = (reset = false) => {
    setLastPosition(playerPosition);
    if (reset) {
      setPlayerPosition(0);
      return;
    }
    // Generate a random number between 1 and 6 (inclusive)
    const diceValue = Math.floor(Math.random() * 6) + 1;
    setDiceVal(diceValue);
    // Calculate the new player position
    let newPosition = playerPosition + diceValue;
    // Check if the new position has a snake or ladder
    if (snakes[newPosition]) {
      newPosition = snakes[newPosition];
    } else if (ladders[newPosition]) {
      newPosition = ladders[newPosition];
    }

    if (newPosition <= rows * cols) {
      // Update the player position
      setPlayerPosition(newPosition);
      setWon(newPosition === rows * cols);
    }
  };

  const getTileClass = useCallback(
    (tileNumber) => {
      let tileClass = "";
      if (playerPosition === tileNumber) {
        tileClass += "player";
      } else if (snakes[tileNumber]) {
        tileClass += "snake";
      } else if (ladders[tileNumber]) {
        tileClass += "ladder";
      }
      return tileClass;
    },
    [ladders, snakes, playerPosition]
  );

  const tilesValue = useMemo(() => {
    const tiles = [];
    let tileNumber = rows * cols;
    let isEvenRow = false;
    for (let row = 1; row <= 10; row++) {
      const currentRow = [];
      for (let col = 1; col <= 10; col++) {
        const tileClass = getTileClass(tileNumber);
        const tile = {
          index: tileNumber,
          snake: !!snakes[tileNumber],
          ladder: !!ladders[tileNumber],
          cls: tileClass,
          next: snakes[tileNumber] || ladders[tileNumber] || tileNumber + 1
        };
        currentRow.push(tile);
        tileNumber--;
      }
      if (isEvenRow) {
        currentRow.reverse();
      }
      tiles.push(currentRow);
      isEvenRow = !isEvenRow;
    }
    return tiles;
  }, [cols, rows, ladders, snakes, getTileClass]);

  return (
    <>
      <h4>Snake & Ladder Game</h4>
      <p>
        [last: {lastPosition}] + [dice: {diceVal}] = [current: {playerPosition}]
      </p>
      {won ? <h2>User won</h2> : null}
      <button onClick={() => handleRollDice(playerPosition === rows * cols)}>
        {playerPosition === rows * cols ? `Reset` : `Roll Dice`}
      </button>
      <div className="board">
        {tilesValue?.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((tile) => (
              <div key={tile.index} className={`tile ${tile.cls}`}>
                {tile.index === playerPosition ? (
                  <div className="player-circle">{tile.index}</div>
                ) : (
                  tile.index
                )}
                {tile.snake || tile.ladder ? (
                  <span className="next">{tile.next}</span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* <p>Player Position: {playerPosition}</p> */}
    </>
  );
};

export default Board;
