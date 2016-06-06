var GameArea = React.createClass({
	getInitialState: function() {
		var initialCells = [];
		var randomSelector;
		for (var i = 0; i < 3500; i++) {
			randomSelector = Math.random();
			if (randomSelector > 0.7) {
				initialCells.push(<div key={i} className="cell-alive"></div>);
			} else {
				initialCells.push(<div key={i} className="cell-dead"></div>);
			}
		}
		return ({cells: initialCells});
	},
	render: function() {
		return (
			<div>
				<h3 className="main-header">Game of Life (built with ReactJS and Sass)</h3>
				<Controls />
				<Board cells={this.state.cells}/>
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
	render: function() {
		return (
			<div className="board">
				{this.props.cells}
			</div>
		);
	}
})

ReactDOM.render(<GameArea />, document.getElementById("game"));