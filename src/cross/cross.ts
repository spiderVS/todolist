import { node } from 'webpack';
import { Component } from './../component/Component';
import './cross.css';

export interface ICellCoords {
  x: number;
  y: number;
}

interface ICellData {
  x: number;
  y: number;
  sign: string;
}

let size = 3;

class Timer extends Component {
  private counter: number = 0;
  private count: number = 0;
  private time: number;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.element.textContent = this.count.toString();
  }
  start() {
    const start = Date.now();
    this.counter = window.setInterval(() => {
      this.time = Math.floor((Date.now() - start) / 1000);
      this.element.textContent = this.time.toString();
    }, 1000);
  }

  clear() {
    if (this.counter) {
      window.clearInterval(this.counter);
      this.counter = 0;
    }
  }

  countDown() {
    this.count = 10;
    const start = Date.now();
    this.counter = window.setInterval(() => {
      if (this.count - this.time === 0) {
        this.clear();
        this.start();
      } else {
        this.time = Math.floor((Date.now() - start) / 1000);
        this.element.textContent = (this.count - this.time).toString();
      }
    }, 1000);
  }
}

class CrossModel {
  currentPlayer: string = '';
  players: string[];
  signs: string[];
  cells: Array<ICellData> = [];
  winner: string = '';

  constructor() {
    this.players = [];
    this.signs = [ 'X', 'O' ];
  }

  getCurrentPlayer(): string {
    return this.currentPlayer;
  }

  setCurrentPlayer(player: string): void {
    this.currentPlayer = this.players.find((playerItem) => playerItem !== player);
  }

  getCurrentSign(): string {
    return this.signs[this.players.indexOf(this.currentPlayer)];
  }

  setInitialCellArray(arr: ICellCoords): void {
    this.cells.push({ ...arr, sign: '' });
  }

  updateCellArray(coords: ICellCoords, sign: string): void {
    const clickedCell = this.cells.find((cell) => cell.x === coords.x && cell.y === coords.y);
    if (clickedCell) {
      clickedCell.sign = sign;
    }
  }

  checkWinner(coords: ICellCoords, sign: string): void {
    let countHor = 1;
    let countVer = 1;
    let countDiagPrim = 1;
    let countDiagSec = 1;

    const { x: fromX, y: fromY } = coords;
    const moveHor = [ { x: -1, y: 0 }, { x: 1, y: 0 } ];
    const moveVer = [ { x: 0, y: 1 }, { x: 0, y: -1 } ];
    const moveDiagPrim = [ { x: -1, y: -1 }, { x: 1, y: 1 } ];

    const moveDiagSec = [ { x: -1, y: 1 }, { x: 1, y: -1 } ];

    moveHor.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          const checkCell = this.cells.find((cell) => cell.x === toX && cell.y === toY);
          if (checkCell.sign === sign) {
            countHor++;
          } else break;
        }
      }
    });

    moveVer.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          const checkCell = this.cells.find((cell) => cell.x === toX && cell.y === toY);
          if (checkCell.sign === sign) {
            countVer++;
          } else break;
        }
      }
    });

    moveDiagPrim.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          const checkCell = this.cells.find((cell) => cell.x === toX && cell.y === toY);
          if (checkCell.sign === sign) {
            countDiagPrim++;
          } else break;
        }
      }
    });

    moveDiagSec.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          const checkCell = this.cells.find((cell) => cell.x === toX && cell.y === toY);
          if (checkCell.sign === sign) {
            countDiagSec++;
          } else break;
        }
      }
    });

    if (countHor === size || countVer === size || countDiagPrim === size || countDiagSec === size) {
      this.winner = this.currentPlayer;
      console.log(`Win! The player ${this.currentPlayer} wins the game`);
    }
  }

  getWinner(): string {
    return this.winner;
  }

  getPlayers(): Array<string> {
    return this.players;
  }

  setPlayers(player: string): void {
    this.players.push(player);
    this.currentPlayer = this.players[0];
  }
}

class Cross extends Component {
  private cells: Array<Cell> = [];
  public onCellClick: (coords: ICellCoords) => void = () => {};
  model: CrossModel;
  timer: Timer;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'cross-board' ]);
    this.model = new CrossModel();
    this.timer = new Timer(parentNode);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cell = new Cell(this.element, i, j);
        cell.onCellClick = (coords: ICellCoords) => {
          if (this.model.getPlayers().length >= 2) {
            this.onCellClick(coords);
          }
        };
        this.cells.push(cell);
        this.model.setInitialCellArray({ x: j, y: i });
      }
    }
  }

  blockCell(coords: ICellCoords, player: string) {
    const clickedCell = this.cells.find(
      (cell) => cell.coords.x === coords.x && cell.coords.y === coords.y
    );

    if (clickedCell) {
      if (!this.model.getWinner()) {
        clickedCell.clickedCell(this.model.getCurrentSign());
        this.model.updateCellArray(coords, this.model.getCurrentSign());
        this.model.checkWinner(coords, this.model.getCurrentSign());
        if (this.model.getWinner()) {
          this.timer.clear();
        }

        this.model.setCurrentPlayer(player);
      }
    }
  }

  getCurrentPlayer(): string {
    return this.model.getCurrentPlayer();
  }

  getPlayers(): Array<string> {
    return this.model.getPlayers();
  }

  setPlayers(player: string) {
    return this.model.setPlayers(player);
  }

  startTimerCountDown() {
    this.timer.countDown();
  }
}

class Cell extends Component {
  public onCellClick: (coords: ICellCoords) => void = () => {};
  coords: { x: number; y: number };

  constructor(parentNode: HTMLElement, y: number, x: number) {
    super(parentNode, 'div', [ 'cross-cell' ]);
    this.coords = {
      x: x,
      y: y
    };
    this.element.onclick = () => {
      this.onCellClick({ x, y });
    };
  }

  clickedCell(sign: string) {
    this.element.classList.add('clicked');
    this.element.textContent = sign;
  }
}

export default Cross;
