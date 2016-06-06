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
		// BELOW IS FOR TESTING PATTERNS
		/*for (var i = 0; i < 3500; i++) {
			initialCells.push(<div className="cell"></div>);
		}
		initialCells[1780 - 69] = <div className="cell alive"></div>;
		initialCells[1780] = <div className="cell alive"></div>;
		initialCells[1780 + 70] = <div className="cell alive"></div>;
		initialCells[1780 - 1] = <div className="cell alive"></div>;*/
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
		var nextState = [];
		for (var cell = 71; cell < 3429; cell++) {
			var counter = 0;
			if (cells[cell].props.className == "cell") {
				counter = this.getAliveNeighbours(cells, cell);
				if (counter == 3) {
					nextState.push([cell, true]);
				} else {
					nextState.push([cell, false]);
				}
			} else {
				counter = this.getAliveNeighbours(cells, cell);
				if (counter == 2 || counter == 3) {
					nextState.push([cell, true]);	
				} else {
					nextState.push([cell, false]);
				}	
			}
		}
		/* The commented out loop below doesn't work to change the cells. the if all if statements get executed after the for loop is done, in other words all indices for splice will shifted by the final value of state. The below working code is similar, except it uses the actual cell number to be replaced except of referencing it using the for counter. */
		for (cell in nextState) {
			if (nextState[cell][1]) {
				cells.splice(nextState[cell][0], 1, <div className="cell alive"></div>);
			} else {
				cells.splice(nextState[cell][0], 1, <div className="cell"></div>);
			}
		}
		/*
		for (var state in nextState) {
			if (nextState[state]) {
				console.log(state);
				cells.splice(state + 71, 1, <div className="cell alive"></div>);
			}
		}*/
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