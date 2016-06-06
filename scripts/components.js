var GameArea = React.createClass({
	render: function() {
		return (
			<div>
				<h3 className="main-header">Game of Life (built with ReactJS and Sass)</h3>
				<Controls />
				<Board />
			</div>
		);
	}
})

var Controls = React.createClass({
	render: function() {
		return (
			<div className="controls">
				<button className="control">Run</button>
				<button className="control">Pause</button>
				<button className="control">Clear</button>
				<div className="generations">Generation: 0</div>
			</div>
		);
	}
})

var Board = React.createClass({
	getInitialState: function() {
		var initialCells = [];
		for (var i = 0; i < 3500; i++) {
			initialCells.push(<div key={i} className="cell"></div>);
		}
		return ({cells: initialCells});
	},
	render: function() {
		return (
			<div className="board">
				{this.state.cells}
			</div>
		);
	}
})

ReactDOM.render(<GameArea />, document.getElementById("game"));