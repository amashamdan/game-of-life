var GameArea = React.createClass({
	getInitialState: function() {
		var initialCells = [];
		var randomSelector;
		for (var i = 0; i < 3500; i++) {
			randomSelector = Math.random();
			if (randomSelector > 0.8) {
				initialCells.push(<div key={i} className="cell alive"></div>);
			} else {
				initialCells.push(<div key={i} className="cell"></div>);
			}
		}
		return ({cells: initialCells});
	},
	getAliveNeighbours: function(cells, cell) {
		var counter = 0;
		if (cells[cell - 1].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + 1].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell - 70].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + 70].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell - 69].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell - 71].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + 69].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + 71].props.className == "cell alive") {
			counter++;
		}
		return counter;
	},
	getGeneration: function() {
		var cells = this.state.cells;
		for (var cell = 71; cell < 3429; cell++) {
			var counter = 0;
			if (cells[cell].props.className == "cell") {
				counter = this.getAliveNeighbours(cells, cell);
				if (counter == 3) {
					cells.splice(cell, 1, <div key={cell} className="cell alive"></div>);
				}
			} else {
				counter = this.getAliveNeighbours(cells, cell);
				if (counter == 2 || counter == 3) {
					cells.splice(cell, 1, <div key={cell} className="cell"></div>);
				}	
			}
		}
		this.setState({cells: cells});
	},
	runClick: function() {
		/* NOTICE: this.try wasn't used directly inside setInterval because of scoping, this won't be referring to GameArea anymore. setting goforit to this.getGeneration passes the function definition only to goforit, inside the timer adding the brackets will run the function. If gorforit is set to this.getGeneration() it will run only once directly after run is clicked. */
		var goforit = this.getGeneration;
		setInterval(function() {
			goforit();
		}, 500)
	},
	render: function() {
		return (
			<div>
				<h3 className="main-header">Game of Life (built with ReactJS and Sass)</h3>
				<Controls runClick={this.runClick}/>
				<Board cells={this.state.cells}/>
			</div>
		);
	}
})

var Controls = React.createClass({
	render: function() {
		return (
			<div className="controls">
				<button className="control" onClick={this.props.runClick}>Run</button>
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