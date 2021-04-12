import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Axios from 'axios'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  
 /* movimen(){
    let c=0;
    let mensagem;
    
    const history = this.state.history;
    let last = history[this.state.stepNumber-1];
    let current = history[this.state.stepNumber];

    //
    
    console.log(current.squares);
    while(current.squares[c]!==last.squares[c]){
      console.log(current.squares[c]);
      c++;
    }
    switch(c){
      case 0:
        mensagem = "Movimentação Linha 1 - Coluna 1"
      break;
      case 1:
        mensagem = "Movimentação Linha 1 - Coluna 2"
      break;
      case 2:
        mensagem = "Movimentação Linha 1 - Coluna 3"
      break;
      case 3:
        mensagem = "Movimentação Linha 2 - Coluna 1"
      break;
      case 4:
        mensagem = "Movimentação Linha 2 - Coluna 2"
      break;
      case 5:
        mensagem = "Movimentação Linha 2 - Coluna 3"
      break;
      case 6:
        mensagem = "Movimentação Linha 3 - Coluna 1"
      break;
      case 7:
        mensagem = "Movimentação Linha 3 - Coluna 2"
      break;
      case 8:
        mensagem = "Movimentação Linha 1 - Coluna 3"
      break;
      default:
      break;
    }

    return mensagem;
  }*/
  sequencia(){
     const history = this.state.history;
     let i=0;
     let c=0;
     
     let seq =[];
     while(i<history.length){
       while(c<history.squares.length){
         if((history[i].squares[c] === 'X' || history[i].squares[c] === 'C')){
           
          if(seq.indexOf(c)!==-1){
            seq.push(c);
          }
         }
       }
     }
     return seq;
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    
    const moves = history.map((step, move) => {
      /*let mo;
      
      mo = this.movimen(current);*/
      const desc = move ?
        'Movmentação #' + move :
        'Iniciar jogo';
      return (
        <li key={move}>
          <button className="buttonmove" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(this.state.stepNumber===9){
      status = "Empate";
    }else{
      if (winner) {
        let seq = this.sequencia();
        Axios.post('localhost:8000/gravar', {
          jogadas: seq
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        status = "Vencedor: " + winner;
      } else {
        status = "Próximo Jogador: " + (this.state.xIsNext ? "X" : "O");
        
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);


