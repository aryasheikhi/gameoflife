import React, { useState, useRef, useCallback } from "react";
import "./GameOfLife.css";

const createEmptyGrid = (gridRows, gridCols) => {
    const grid = [];
    for (let i = 0; i < gridRows; i++) grid.push(Array.from(Array(gridCols), () => 0));
    return grid;
};

const createRandomGrid = (gridRows, gridCols) => {
    const grid = [];
    for (let i = 0; i < gridRows; i++) grid.push(Array.from(Array(gridCols), () => Math.random() > .25 ? 0 : 1));
    return grid;
};

const operations = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

function GameOfLife() {
    const [gridRows, setGridRows] = useState(30);
    const [gridCols, setGridCols] = useState(30);
    const [grid, setGrid] = useState(createEmptyGrid(gridRows, gridCols));
    const [gameStatus, setGameStatus] = useState(false);
    const gameStatusRef = useRef(false);

    const handleClick = (i, j) => {
        const newGrid = JSON.parse(JSON.stringify(grid));
        newGrid[i][j] = grid[i][j] ? 0 : 1;
        setGrid(newGrid);
    };

    const runGame = useCallback(() => {
        if (!gameStatusRef.current) return;

        setGrid(prevGrid => {
            const newGrid = JSON.parse(JSON.stringify(prevGrid));
            for (let i = 0; i < gridRows; i++) {
                for (let j = 0; j < gridCols; j++) {
                    let liveNeighbors = 0;
                    operations.forEach(([x, y]) => {
                        const newI = i + x;
                        const newJ = j + y;
                        if (newI >= 0 && newI < gridRows && newJ >= 0 && newJ < gridCols) {
                            liveNeighbors += prevGrid[newI][newJ];
                        }
                    });
                    if (newGrid[i][j] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
                        newGrid[i][j] = 0;
                    } else if (liveNeighbors === 3 && grid[i][j] === 0) {
                        newGrid[i][j] = 1;
                    } 
                }
            }  
            return newGrid;         
        });
        
        setTimeout(runGame, 700);
    }, []);

    const startStop = () => {
        setGameStatus(!gameStatus);
        gameStatusRef.current = !gameStatusRef.current;
        if (!gameStatus) runGame();
    };

    const clear = () => setGrid(createEmptyGrid(gridRows, gridCols));

    const random = () => setGrid(createRandomGrid(gridRows, gridCols));

    return (
        <div className="Game">
            <h1>Conways's Game of Life</h1>
            <div className="Universe" style={{ gridTemplateColumns: `repeat(${gridCols}, 20px)` }}>
                {grid.map((col, i) =>
                    col.map((cell, j) => (
                        <div
                            key={i + "-" + j}
                            className="Cell"
                            style={{ backgroundColor: grid[i][j] ? "black" : "white" }}
                            onClick={() => handleClick(i, j)}
                        />
                    ))
                )}
            </div>
            <br />
            <div>
                <button onClick={startStop}>{gameStatus ? "Stop" : "Start"}</button>
                <button onClick={random}>Random</button>
                <button onClick={clear}>Clear</button>
            </div>
        </div>
    );
}

export default GameOfLife;
