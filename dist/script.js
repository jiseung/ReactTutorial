function Square(props) {
  if (props.highlight) {
    return (
      React.createElement("button", { className: "square highlight", onClick: props.onClick },
      props.value));


  }
  return (
    React.createElement("button", { className: "square", onClick: props.onClick },
    props.value));


}

class Board extends React.Component {
  renderSquare(i) {
    const wonSquare = this.props.win ? this.props.win.winSquares : [];
    const highlight = wonSquare.includes(i);
    return (
      React.createElement(Square, {
        value: this.props.squares[i],
        onClick: () => this.props.onClick(i),
        key: i,
        highlight: highlight }));


  }

  render() {
    return (
      React.createElement("div", null, " ",
      [0, 1, 2].map(i => {
        return (
          React.createElement("div", { className: "board-row", key: i }, " ",
          [0, 1, 2].map(j => {
            return this.renderSquare(i * 3 + j);
          })));



      })));



  }}



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
      {
        squares: Array(9).fill(null),
        newMove: null }],


      stepNumber: 0,
      xIsNext: true,
      movesAsc: true };

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
        squares: squares,
        newMove: i }]),


      stepNumber: history.length,
      xIsNext: !this.state.xIsNext });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0 });

  }

  sortMoves() {
    this.setState({
      movesAsc: !this.state.movesAsc });

  }

  render() {
    const history = this.state.movesAsc ? this.state.history : this.state.history.slice(0).reverse();
    const stepNumber = this.state.movesAsc ? this.state.stepNumber : history.length - this.state.stepNumber - 1;
    const current = history[stepNumber];
    const win = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const moveNumber = this.state.movesAsc ? move : this.state.stepNumber - move;
      const currentStep = this.state.movesAsc ? move == this.state.stepNumber : move == 0;
      const desc = moveNumber ?
      'Go to move #' + moveNumber + ' (' + Math.ceil((step.newMove + 1) / 3) + ', ' + (step.newMove % 3 + 1) + ')' :
      'Go to game start';
      if (currentStep) {
        return (
          React.createElement("li", { key: move },
          React.createElement("button", { onClick: () => this.jumpTo(moveNumber) }, React.createElement("b", null, desc))));


      } else {
        return (
          React.createElement("li", { key: move },
          React.createElement("button", { onClick: () => this.jumpTo(moveNumber) }, desc)));


      }
    });

    let status;
    if (win) {
      status = "Winner: " + win.winner;
    } else if (!current.squares.includes(null)) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let toggle = this.state.movesAsc ? "Sorted by asc" : "Sorted by desc";

    return (
      React.createElement("div", { className: "game" },
      React.createElement("div", { className: "game-board" },
      React.createElement(Board, {
        squares: current.squares,
        onClick: i => this.handleClick(i),
        win: win })),


      React.createElement("div", { className: "game-info" },
      React.createElement("div", null, status),
      React.createElement("ol", null, moves)),

      React.createElement("div", { className: "game-control" },
      React.createElement("div", null,
      React.createElement("button", { className: "toggle", onClick: () => this.sortMoves() },
      toggle)))));





  }}


// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winSquares: lines[i] };

    }
  }
  return null;
}