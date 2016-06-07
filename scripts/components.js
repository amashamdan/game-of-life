var GameArea = React.createClass({
	getInitialState: function() {
		var initialCells = [];
		var randomSelector;
		window.timerStatus = false;
		for (var i = 0; i < 3500; i++) {
			randomSelector = Math.random();
			if (randomSelector > 0.7) {
				initialCells.push(<div key={i} onClick={this.cellClick.bind(null, i)} className="cell alive"></div>);
			} else {
				initialCells.push(<div key={i} onClick={this.cellClick.bind(null, i)} className="cell"></div>);
			}
		}
		this.runClick();
		return ({cells: initialCells, generations: 0});
	},
	getAliveNeighbours: function(cells, cell) {
		var counter = 0;
		var positions = {aboveLeft: -71, above: -70, aboveRight: -69, left: -1, right: 1, belowLeft: 69, below: 70, belowRight: 71};
		/* top left corner */
		if (cell == 0) {
			positions.aboveLeft = 3499;
			positions.above = 3430;
			positions.aboveRight = 3431;
			positions.left = 69;
			positions.belowLeft = 139;
		} else if (cell == 69) { /* top right corner */
			positions.aboveLeft = 3429;
			positions.above = 3430;
			positions.aboveRight = 3361;
			positions.right = -69;
			positions.belowRight = 1;
		} else if (cell == 3430) { /* bottom left */
			positions.aboveLeft = -1;
			positions.left = 69;
			positions.belowLeft = -3361;
			positions.below = -3430;
			positions.belowRight = -3429;
		} else if (cell == 3499) { /* bottom right */
			positions.aboveRight = -139;
			positions.right = -69;
			positions.belowRight = -3499;
			positions.below = -3430;
			positions.belowLeft = -3431;
		} else if (cell > 0 && cell < 69) { /* top row */
			positions.above = 3430;
			positions.aboveLeft = 3429;
			positions.aboveRight = 3431;
		} else if (cell > 3430 && cell < 3499) { /* bottom row */
			positions.belowLeft = -3431;
			positions.below = -3430;
			positions.belowRight = -3429;
		} else if (cell % 70 == 0) { /* left colomn */
			positions.aboveLeft = -1;
			positions.left = 69;
			positions.belowLeft = 139;
		} else if (cell % 70 == 69) { /* right colomn */
			positions.aboveRight = -139;
			positions.right = -69;
			positions.belowRight = 1;
		}
		/* start counting alive neighbours */ 
		cell = Number(cell);
		if (cells[cell + positions.aboveLeft].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + positions.above].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + positions.aboveRight].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + positions.left].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + positions.right].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + positions.belowLeft].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + positions.below].props.className == "cell alive") {
			counter++;
		}
		if (cells[cell + positions.belowRight].props.className == "cell alive") {
			counter++;
		}
		return counter;
	},
	getGeneration: function() {
		var cells = this.state.cells;
		var nextState = [];
		//for (var cell = 71; cell < 3429; cell++) {
		for (var cell in cells) {
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
				cells.splice(nextState[cell][0], 1, <div onClick={this.cellClick.bind(null, nextState[cell][0])} key={nextState[cell][0]} className="cell alive"></div>);
			} else {
				cells.splice(nextState[cell][0], 1, <div onClick={this.cellClick.bind(null, nextState[cell][0])} key={nextState[cell][0]} className="cell"></div>);
			}
		}
		/*
		for (var state in nextState) {
			if (nextState[state]) {
				console.log(state);
				cells.splice(state + 71, 1, <div className="cell alive"></div>);
			}
		}*/
		this.setState({cells: cells, generations: this.state.generations + 1});
	},
	/* The way this function os written guarantess that no more than one timer will be running. */
	runClick: function() {
		if (!timerStatus) {
			/* NOTICE: this.try wasn't used directly inside setInterval because of scoping, this won't be referring to GameArea anymore. setting goforit to this.getGeneration passes the function definition only to goforit, inside the timer adding the brackets will run the function. If gorforit is set to this.getGeneration() it will run only once directly after run is clicked. */
			var getGeneration = this.getGeneration;
			window.timer = setInterval(function() {
				getGeneration();
			}, 100);
			timerStatus = true;
		} else {
			clearInterval(timer);
			timerStatus = false;
		}
	},
	clearClick: function() {
		var cells = [];
		if (timerStatus) {
			clearInterval(timer);
			timerStatus = false;
		}
		for (var i = 0; i < 3500; i++) {
				cells.push(<div onClick={this.cellClick.bind(null, i)} key={i} className="cell"></div>);
		}
		this.setState({cells: cells, generations: 0});
	},
	cellClick: function(key) {
		var cells = this.state.cells;
		if (cells[key].props.className == "cell alive") {
			cells.splice(key, 1, <div onClick={this.cellClick.bind(null, key)} key={key} className="cell"></div>);
		} else {
			cells.splice(key, 1, <div onClick={this.cellClick.bind(null, key)} key={key} className="cell alive"></div>);
		}
		this.setState({cells: cells});
	},
	render: function() {
		return (
			<div>
				<h3 className="main-header">Game of Life (built with ReactJS and Sass)</h3>
				<Controls runClick={this.runClick} generations={this.state.generations} clearClick={this.clearClick}/>
				<Board cells={this.state.cells}/>
			</div>
		);
	}
})

var Controls = React.createClass({
	render: function() {
		return (
			<div className="controls">
				<button className="control" onClick={this.props.runClick}>Run/Pause</button>
				<button className="control" onClick={this.props.clearClick}>Clear</button>
				<div className="generations">Generation: {this.props.generations}</div>
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