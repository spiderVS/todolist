import Button from './components/button';
import Control from './components/control';
import Signal from './components/signal';
import './chess.css';
import Vector from './components/vector';



const initialField = [
  'lneqkenl',
  'pppppppp',
  '        ',
  '        ',
  '        ',
  '        ',
  'PPPPPPPP',
  'LNEQKENL',
];

class CellModel {
  public figure:FigureModel;
  constructor(figureType:string) {
    let color = figureType.toLowerCase() == figureType? 0 : 1;
    this.figure = createFigure(figureType.toLowerCase(), color);
  }
}

function createFigure(type:string, color:number){
  const figures:Map<string, typeof FigureModel> = new Map([
    ['p', Pawn],
    ['l', Rook],
    ['n', Knight],
    ['e', Bishop],
    ['q', Queen],
    ['k', King],
  ]);
  let FigureClass = figures.get(type);

  return FigureClass ? new FigureClass(color) : null;
}

class FigureModel {
  public type:string='';
  public color:number;
  constructor(color:number){
    this.color = color;
  }

  isChecked(field:FieldState):boolean{
    
    return false;
  }

  checkMove(field:FieldState, fromX:number, fromY:number, toX:number, toY:number):boolean{
    let allowed = this.getMoves(field, fromX, fromY);
    let isAllowed = allowed.findIndex(ax=>ax.x === toX && ax.y === toY) === -1 ? false:true;
    return isAllowed;
  }

  getMoves(field:FieldState, fromX:number, fromY:number):Array<{x:number, y:number}>{
    let res: Array<{x:number, y:number}> = [];
    return res;
  }
}

class Pawn extends FigureModel {
  constructor(color:number){
    super(color);
    this.type = 'p';
  }

  getMoves(field:FieldState, fromX:number, fromY:number):Array<{x:number, y:number}>{
    let res: Array<{x:number, y:number}> = [];
    let direction = (this.color === 0 ? 1: -1);
    let posX = fromX + direction;
    let posY = fromY;
    if (field[posX] && field[posX][posY] &&(field[posX][posY].figure === null) && posY>=0 && posY<8 && posX>=0 && posX<8){
      res.push({x:posX, y:posY});
    }

    if ((fromX === 6 && this.color === 1) || (fromX === 1 && this.color === 0)){
      posX = fromX + direction;
      posY = fromY;
      if (field[posX] && field[posX][posY] &&(field[posX][posY].figure === null) && posY>=0 && posY<8 && posX>=0 && posX<8){
        posX = fromX + direction*2;
        posY = fromY;
        if (field[posX] && field[posX][posY] &&(field[posX][posY].figure === null) && posY>=0 && posY<8 && posX>=0 && posX<8){
          res.push({x:posX, y:posY});
        }
        //res.push({x:posX, y:posY});
      }
    }

    posX = fromX + direction;
    posY = fromY +1;
    if (field[posX] && field[posX][posY] &&(field[posX][posY].figure !== null && field[posX][posY].figure.color !== this.color) && posY>=0 && posY<8 && posX>=0 && posX<8){
      res.push({x:posX, y:posY});
    }
    posX = fromX + direction;
    posY = fromY -1;
    if (field[posX] && field[posX][posY] &&(field[posX][posY].figure !== null && field[posX][posY].figure.color !== this.color) && posY>=0 && posY<8 && posX>=0 && posX<8){
      res.push({x:posX, y:posY});
    }
    return res;
  }
}

class Rook extends FigureModel {
  constructor(color:number){
    super(color);
    this.type = 'l';
  }

  getMoves(field:FieldState, fromX:number, fromY:number):Array<{x:number, y:number}>{
    let res: Array<{x:number, y:number}> = [];
    let moves = [{x:1, y:0}, {x:0, y:1}, {x:-1, y:0}, {x:0, y:-1}];

    moves.forEach(move=>{
      let posX = fromX;
      let posY = fromY;
      for(let i=0;i<10;i++){
        posX += move.x;
        posY += move.y;
        if (field[posX] && field[posX][posY] &&(field[posX][posY].figure === null || field[posX][posY].figure.color!== this.color) && posY>=0 && posY<8 && posX>=0 && posX<8){
          if (field[posX][posY].figure!== null){
            res.push({x:posX, y:posY});
            break;
          } else {
            res.push({x:posX, y:posY});
          }
        } else {
          break;
        }
      }
    });
    return res;
  }
}

class Knight extends FigureModel {
  constructor(color:number){
    super(color);
    this.type = 'n';
  }

  getMoves(field:FieldState, fromX:number, fromY:number):Array<{x:number, y:number}>{
    let res: Array<{x:number, y:number}> = [];
    let moves = [
      {x:2, y:1}, 
      {x:2, y:-1},
      {x:-2, y:1},
      {x:-2, y:-1},
      {x:1, y:2}, 
      {x:1, y:-2}, 
      {x:-1, y:2}, 
      {x:-1, y:-2}
    ];

    moves.forEach(move=>{
      let posX = fromX + move.x;
      let posY = fromY + move.y;
      if (field[posX] && field[posX][posY] &&(field[posX][posY].figure === null || field[posX][posY].figure.color!== this.color) && posY>=0 && posY<8 && posX>=0 && posX<8){
        res.push({x:posX, y:posY});
      }
    });
    return res;
  }
}

class Bishop extends FigureModel {
  constructor(color:number){
    super(color);
    this.type = 'e';
  }

  getMoves(field:FieldState, fromX:number, fromY:number):Array<{x:number, y:number}>{
    let res: Array<{x:number, y:number}> = [];
    let moves = [{x:1, y:1}, {x:-1, y:-1}, {x:-1, y:1}, {x:1, y:-1}];

    moves.forEach(move=>{
      let posX = fromX;
      let posY = fromY;
      for(let i=0;i<10;i++){
        posX += move.x;
        posY += move.y;
        if (field[posX] && field[posX][posY] && (field[posX][posY].figure === null || field[posX][posY].figure.color!== this.color) && posY>=0 && posY<8 && posX>=0 && posX<8){
          if (field[posX][posY].figure!== null){
            res.push({x:posX, y:posY});
            break;
          } else {
            res.push({x:posX, y:posY});
          }
        } else {
          break;
        }
      }
    });
    return res;
  }
}

class Queen extends FigureModel {
  constructor(color:number){
    super(color);
    this.type = 'q';
  }

  getMoves(field:FieldState, fromX:number, fromY:number):Array<{x:number, y:number}>{
    let res: Array<{x:number, y:number}> = [];
    let moves = [{x:1, y:1}, {x:-1, y:-1}, {x:-1, y:1}, {x:1, y:-1},
      {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}, {x:0, y:-1}];

    moves.forEach(move=>{
      let posX = fromX;
      let posY = fromY;
      for(let i=0;i<10;i++){
        posX += move.x;
        posY += move.y;
        if (field[posX] && field[posX][posY] &&(field[posX][posY].figure === null || field[posX][posY].figure.color!== this.color) && posY>=0 && posY<8 && posX>=0 && posX<8){
          if (field[posX][posY].figure!== null){
            res.push({x:posX, y:posY});
            break;
          } else {
            res.push({x:posX, y:posY});
          }
        } else {
          break;
        }
      }
    });
    return res;
  }
}

class King extends FigureModel {
  constructor(color:number){
    super(color);
    this.type = 'k';
  }

  getMoves(field:FieldState, fromX:number, fromY:number):Array<{x:number, y:number}>{
    let res: Array<{x:number, y:number}> = [];
    let moves = [{x:1, y:1}, {x:-1, y:-1}, {x:-1, y:1}, {x:1, y:-1},
      {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}, {x:0, y:-1}];

    moves.forEach(move=>{
      let posX = fromX + move.x;
      let posY = fromY + move.y;
      if (field[posX] && field[posX][posY] &&(field[posX][posY].figure === null || field[posX][posY].figure.color!== this.color) && posY>=0 && posY<8 && posX>=0 && posX<8){
        res.push({x:posX, y:posY});
      }
    });
    return res;
  }
}

type FieldState = Array<Array<CellModel>>;

class FieldModel {
  public state: FieldState;
  public allowedMoves: Array<Vector>;
  public currentColor:number = 1;
  public onChange: Signal<FieldState> = new Signal();
  constructor() {

  }  

  setAllowed(){
    
  }

  logicMove(func:(currentState:FieldState, nextState:FieldState)=>number){
    let froms = this.getAllowedFromsE(this.state, this.currentColor);
    if (!froms.length){
      console.log("END");
      return;
    }

    let max = 0;
    let maxFrom:Vector;
    let maxTo:Vector;
    froms.forEach((fig)=>{
      let avals = this.getAllowed(this.state, fig.x, fig.y); 
      avals.forEach(mov =>{
        let newState = this.getStateAfterMove(this.state, fig.x, fig.y, mov.x, mov.y);
        let val = func(this.state, newState);
        if (max<val){
          max = val;
          maxFrom = new Vector(fig.x, fig.y);
          maxTo = new Vector(mov.x, mov.y)
        };
      })
    });
    this.move(maxFrom.x, maxFrom.y, maxTo.x, maxTo.y);
  }

  randomMove(){
    let froms = this.getAllowedFromsE(this.state, this.currentColor);
    if (!froms.length){
      console.log("END");
    }
    let from = froms[Math.floor(Math.random()*froms.length)];
    if (from){
      let avals = this.getAllowed(this.state, from.x, from.y);//this.state[from.x][from.y].figure.getMoves(this.state, from.x, from.y);
      let aval = avals[Math.floor(Math.random()*avals.length)];
      if (aval){
        this.move(from.x, from.y, aval.x, aval.y);
      }
    }
  }

  logic(cur:FieldState, next:FieldState){
    let curBotFigCount = 0;
    this.forEachPlayerFigure(cur, this.currentColor, (cell)=>{
      curBotFigCount++;
    })
    let nextBotFigCount = 0;
    this.forEachPlayerFigure(next, this.currentColor, (cell)=>{
      nextBotFigCount++;
    })

    let curPlayerFigCount = 0;
    this.forEachPlayerFigure(cur, (this.currentColor+1)%2, (cell)=>{
      curPlayerFigCount++;
    })
    let nextPlayerFigCount = 0;
    this.forEachPlayerFigure(next, (this.currentColor+1)%2, (cell)=>{
      nextPlayerFigCount++;
    })
    /*if (curBotFigCount== nextBotFigCount){
      return 2;
    }*/
    if (curPlayerFigCount> nextPlayerFigCount){
      return Math.random()*5 + 6;
    }
    return Math.random()*5+1;
  }

  move(fromX:number, fromY:number, toX:number, toY:number){
    let allowed = (this.getAllowed(this.state, fromX, fromY));
    let isAllowed = allowed.findIndex(it=>{
      return (it.x == toX && it.y == toY);
    });
    if (isAllowed ==-1){
      return;
    }
    if (this.state[fromX][fromY].figure && this.state[fromX][fromY].figure.color === this.currentColor && this.state[fromX][fromY].figure.checkMove(this.state, fromX, fromY, toX, toY)){
      //console.log('moved')
      this.state[toX][toY].figure = this.state[fromX][fromY].figure;
      this.state[fromX][fromY].figure = null;
      this.setState(this.state);
      this.currentColor = (this.currentColor + 1)%2;
      //console.log(this.currentColor, this.getCheckedKing(this.state));
      if (this.currentColor===0){
        //this.randomMove();
        this.logicMove((cur, next)=>{
          return this.logic(cur, next);  
        });
      }
    }
  }

  getStateAfterMove(state_:FieldState, fromX:number, fromY:number, toX:number, toY:number){
    let state = this.cloneState(state_);
    this.exchangePositions(state, new Vector(fromX, fromY), new Vector(toX, toY));
    return state;
  }

  getAllowedFroms(state:FieldState, color:number, type?:string){
    let res:Array<{x:number, y:number}> = [];
    this.forEachPlayerFigure(state, color, (cell, pos)=>{
      if (cell.figure.getMoves(state, pos.x, pos.y).length){
        if (type){
          if(type == cell.figure.type.toLowerCase()){
            res.push(pos);
          }
        } else {
          res.push(pos);
        }
      };     
    })
    return res;
  }

  exchangePositions(state:FieldState, from:Vector, to:Vector){
    this.getCellAt(state, to).figure = this.getCellAt(state, from).figure;
    this.getCellAt(state, from).figure = null;  
  }

  forEachCell(state:FieldState, callback:(cell:CellModel, pos:Vector)=>void){
    state.forEach((it, i)=>{
      it.forEach((jt, j)=>{
        callback(jt, new Vector(i, j));
      });
    });  
  }

  forEachPlayerFigure(state:FieldState, playerColor:number, callback:(cell:CellModel, pos:Vector)=>void){
    this.forEachCell(state, (cell, pos)=>{
      if (cell.figure && cell.figure.color === playerColor){
        callback(cell, pos);
      }
    });
  }

  getCellAt(state:FieldState, pos:Vector):CellModel{
    return state[pos.x][pos.y];
  }

  cloneState(state:FieldState):FieldState{
    let newState = state.map(it=>{ 
      return it.map(jt=>{
        let newCell = new CellModel(jt.figure ? jt.figure.type:' ');
        if (newCell.figure){
          newCell.figure.color = jt.figure.color;
        }
        return newCell;
      });
    }); 
    return newState; 
  }

  getAllowedFromsE(state:FieldState, color:number, type?:string){
    let res:Array<{x:number, y:number}> = [];
    state.forEach((it, i)=>{
      it.forEach((jt, j)=>{
        if (jt.figure && jt.figure.color == color){
          //if (jt.figure.getMoves(state, i, j).length){
          if (this.getAllowed(state, i, j).length){
            if (type){
              //console.log(i, j)
              if(type == jt.figure.type.toLowerCase()){
                res.push({x:i, y:j});
              }
            } else {
              res.push({x:i, y:j});
            }
          };     
        }
      })
    })
    return res;
  }

  getKingPos(state:FieldState, color:number){
    let res:Vector = null;
    this.forEachPlayerFigure(state, color, (cell, pos)=>{
      if (cell.figure.type == 'k'){
        res = pos;
      }
    });
    return res;
  }

  getCheckedKing(state:FieldState){
    //console.log(this.getAllowedFroms(this.currentColor));
    let kingPos = this.getKingPos(state, this.currentColor);
    return this.getCheckedStatus(state, kingPos.x, kingPos.y);
  }

  
  getCheckedStatus(state:FieldState, posX:number, posY:number){
    let res = false;
    let enemies = this.getAllowedFroms(state, (this.currentColor+1) %2);
    enemies.forEach(enemy=>{
      let allowed = this.getAllowedE(state, enemy.x, enemy.y);
      allowed.forEach(al=>{
        //console.log(al);
        if (al.x === posX && al.y === posY){
          res = true;
        }
      })
    })
    return res;
  }

  getAllowed(state:FieldState, fromX:number, fromY:number){
    if (state[fromX][fromY].figure && state[fromX][fromY].figure.color === this.currentColor){
      
      let moves = state[fromX][fromY].figure.getMoves(state, fromX, fromY);
      moves = moves.filter(it=>{
        let nextState = this.getStateAfterMove(state,fromX, fromY, it.x, it.y);
        return !this.getCheckedKing(nextState);
      })
      return moves;
    } else {
      return [];
    }
  }

  getAllowedE(state:FieldState, fromX:number, fromY:number){
    if (state[fromX][fromY].figure && state[fromX][fromY].figure.color !== this.currentColor){
      
      return state[fromX][fromY].figure.getMoves(state, fromX, fromY);
    } else {
      return [];
    }
  }

  setFromStrings(stringState:Array<string>){
    let newState = [];
    for (let i=0; i<8; i++){
      let row = [];
      for (let j=0; j<8; j++){
        row.push(new CellModel(stringState[i][j]));  
      }
      newState.push(row);
    }
    this.setState(newState);
  }

  setState(newState:FieldState){
    this.state = newState;
    this.onChange.emit(newState);
  }
}

class CellView extends Control{
  public onClick: ()=>void;
  private fig:Control;
  constructor(parentNode: HTMLElement, className:string) {
    super(parentNode, 'div', className);
    this.fig = new Control(this.node);
    this.node.onclick = ()=>{
      this.onClick();
    }
  }

  select(state:boolean){
    if (state){
      this.node.classList.add('cell__selected');
    } else {
      this.node.classList.remove('cell__selected');
    }
  }

  allow(state:boolean){
    if (state){
      this.node.classList.add('cell__allowed');
    } else {
      this.node.classList.remove('cell__allowed');
    }
  }

  refresh(state:CellModel){
    this.styleFigure(state);
    if (!state.figure){ 
      //this.node.textContent = '';
      return; 
    }
    //this.node.textContent = state.figure.type;
    if (state.figure.color == 0){
      this.node.classList.add('cell__figureBlack');
      this.node.classList.remove('cell__figureWhite');
    } else {
      this.node.classList.add('cell__figureWhite');
      this.node.classList.remove('cell__figureBlack');
    }
    

  }

  styleFigure(state:CellModel){
    if (state.figure && state.figure.type && state.figure.type !==' '){
      this.fig.node.className = (`chess_fig chess__${state.figure.color?'b':'w'}${state.figure.type}`);  
    } else {
      this.fig.node.className = '';
    }
  }
}

class FieldController{
  private model:FieldModel;
  constructor(model:FieldModel){
    this.model = model;
  }

  cellClickHandler(cells:Array<CellView>, cell:CellView, pos:Vector){

  }
}

class FieldView extends Control{
  private cells:Array<CellView> = [];
  private model: FieldModel = new FieldModel();
  private controller: FieldController = new FieldController(this.model);
  //private selectedX:number=null;
  //private selectedY:number=null;
  private selectedCell:CellModel = null;

  constructor(parentNode: HTMLElement, initialState:Array<string>) {
    super(parentNode);
    for (let i=0; i<8; i++){
      let row = new Control(this.node, 'div', 'row');
      for (let j=0; j<8; j++){
        let cell = new CellView(row.node, (j%2 && i%2) || (!(j%2) && !(i%2)) ? 'cell cell__light': 'cell cell__dark');
        cell.onClick=()=>{
          let cellPos = this.getCellPosition(this.selectedCell);
          if (cellPos && cellPos.x === i && cellPos.y===j){  
            this.selectedCell = null;
            this.setSelection(null);
            this.setAllows([]);
          } else {
            if (this.selectedCell){
              let cellPos = this.getCellPosition(this.selectedCell);
              this.model.move(cellPos.x, cellPos.y, i, j);
            }
            this.setSelection(cell);
            this.selectedCell = this.model.state[i][j];
          }

          if (this.selectedCell && this.selectedCell.figure){
            let cellPos = this.getCellPosition(this.selectedCell);
            let allowed = this.model.getAllowed(this.model.state, cellPos.x, cellPos.y);
            this.setAllows(allowed.map(it=>new Vector(it.x, it.y)));
          } else {
            this.setAllows([]);
          }
          
        }
        this.cells.push(cell);
      }
    }
    this.model.onChange.add((state)=>this.refresh(state));
    this.model.setFromStrings(initialState);
  }

  cellClickHandler(){

  }

  refresh(state:FieldState){
    this.forEachCell((cell, pos)=>{
      cell.refresh(state[pos.x][pos.y]);
    });
  }

  setSelection(selection:CellView){
    this.forEachCell((cell)=>{
      if (selection && selection === cell){
        cell.select(true);
      } else {
        cell.select(false);
      }
    })
  }

  setAllows(selection:Array<Vector>){
    this.forEachCell((cell, pos)=>{
      let isAllowed = selection.findIndex(ax=>ax.x === pos.x && ax.y === pos.y) === -1 ? false: true;
      if (isAllowed){
        cell.allow(true);
      } else {
        cell.allow(false);
      }
    })
  }

  forEachCell(callback:(cell:CellView, position:Vector)=>void){
    this.cells.forEach((it, i)=>{
      let x = Math.floor(i / 8);
      let y = i % 8;
      callback(it, new Vector(x, y));
    });    
  }

  getCellPosition(cell:CellModel):Vector{
    let res = null;
    if (cell === null) {
      return null;
    }
    this.forEachCell((currentCell, pos)=>{
      if (this.model.getCellAt(this.model.state, pos) == cell){
        res = pos;
      }
    });
    return res;
  }
}

class Chess {
  constructor(parentNode:HTMLElement) {
    new FieldView(parentNode, initialField);  
  }
}

export default Chess;