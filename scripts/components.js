/* GameArea component, it's the parent component and where most of the magic happens. It has children components Controls, Board, GridControls and Information. */
var GameArea = React.createClass({
	/* Sets the initial stte of the component. */
	getInitialState: function() {
		/* This array will hold all intial cells. */
		var initialCells = [];
		/* Variable which helps in randomly generate an initial pattern. It decides whether a cell is dead or alive. */
		var randomSelector;
		/* This global variable indicates whether the game is running or paused. false stands for paused. */
		window.timerStatus = false;
		/* The default width and height are set to 70 and 50 respectively. */
		var width = 70;
		var height = 50;
		/* This for loop randomly generates an initial grid, it creates cells equal in number to width*height. If randomSelector is higher than 0.5, the cell is alive and its div is pushed into initialCells. Otherwise it's a dead cell and its div is pushed into intialCells. */
		/* class name "cell" represents a dead cell, class name "cell alive" represents and alive cell) */
		for (var i = 0; i < width * height; i++) {
			randomSelector = Math.random();
			if (randomSelector > 0.5) {
				initialCells.push(<div key={i} onClick={this.cellClick.bind(null, i)} className="cell alive"></div>);
			} else {
				initialCells.push(<div key={i} onClick={this.cellClick.bind(null, i)} className="cell"></div>);
			}
		}
		/* This method is called to start the timer and the game. */
		this.runClick();
		/* cells, width, height and generations are set as state. genrations holds the number of generation and is 0 at the beginning of the game. */
		return ({cells: initialCells, generations: 0, width: width, height: height});
	},
	/* This method counts the alive neigbours of a cell and return the result. The method takes in two parameters, all cells and the cell we need to count its neighbours. */
	getAliveNeighbours: function(cells, cell) {
		/* counter is set to zero intially/ */
		var counter = 0;
		/* Since grid size can change and to avoid using magic numbers, the width and height values are retreived and saved into height and width variables. */
		var height = this.state.height;
		var width = this.state.width;
		/* This object has the default values of the shift in index to be applied to find the neighbouring cells. default values are valid for internal cells only, for boundary and corner cells, some of the values must be changed. An example for below: belowLeft cell is the cell located at an index equal to the index of the cell plus (width - 1). Remember this opbject holds the shift not cell index. This combination is obtained by drawing a certain grid and figuring out the realtion between central cell and its neighours.  */
		var positions = {aboveLeft: -(width + 1), above: -width, aboveRight: -(width - 1), left: -1, right: 1, belowLeft: width - 1, below: width, belowRight: width + 1};
		/* The following if statements check for boundary and corner cells and apply modifications to some neighbours which otherwise wouldn't be valid neighours. */
		if (cell == 0) {
			positions.aboveLeft = width * height - 1;
			positions.above = width * height - width;
			positions.aboveRight = positions.above + 1;
			positions.left = width - 1;
			positions.belowLeft = width * 2 - 1;
		/* top right corner */
		} else if (cell == width - 1) { 
			positions.aboveLeft = width * height - (width + 1);
			positions.above = positions.aboveLeft + 1;
			positions.aboveRight = width * height - width * 2 + 1;
			positions.right = -(width - 1);
			positions.belowRight = 1;
		/* bottom left */
		} else if (cell == width * height - width) { 
			positions.aboveLeft = -1;
			positions.left = width - 1;
			positions.belowLeft = -(width * height - width * 2 + 1);
			positions.below = -(width * height - width);
			positions.belowRight = -(width * height - width - 1);
		/* bottom right */
		} else if (cell == width * height - 1) { 
			positions.aboveRight = -(width * 2 - 1);
			positions.right = -(width - 1);
			positions.belowRight = -(width * height - 1);
			positions.below = -(width * height - width);
			positions.belowLeft = -(width * height - width + 1);
		/* top row */
		} else if (cell > 0 && cell < width - 1) { 
			positions.above = width * height - width;
			positions.aboveLeft = width * height - width - 1;
			positions.aboveRight = width * height - width + 1;
		} else if (cell > width * height - width && cell < width * height - 1) { /* bottom row */
			positions.belowLeft = -(width * height - width + 1);
			positions.below = -(width * height - width);
			positions.belowRight = -(width * height - width - 1);
		/* left colomn */
		} else if (cell % width == 0) { 
			positions.aboveLeft = -1;
			positions.left = width - 1;
			positions.belowLeft = width * 2 - 1;
		/* right colomn */
		} else if (cell % width == width - 1) { 
			positions.aboveRight = -(width * 2 - 1);
			positions.right = -(width - 1);
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
		/* Return the number of the alive cells. */
		return counter;
	},
	/* This method specifies what the next state should be. */
	getGeneration: function() {
		/* Cells are copied into cells array since they will be modified. */
		var cells = this.state.cells;
		/* nextState is an array whose each element is an array, each array holds the a cell number and true or false, true means it will be alive in the next generation, false means it will be dead in the next generation. */
		var nextState = [];
		/* Loop through each cell */
		for (var cell in cells) {
			var counter = 0;
			/* If the cell is dead (class name "cell" represents a dead cell, class name "cell alive" represents and alive cell), its alive neighbours are counted, if the result is three, the cell will alive in the next generation, otherwise, it will stay dead. */
			if (cells[cell].props.className == "cell") {
				counter = this.getAliveNeighbours(cells, cell);
				if (counter == 3) {
					nextState.push([cell, true]);
				} else {
					nextState.push([cell, false]);
				}
			/* Same is done for the cell if its alive, if the alive neighbours are 2 or 3 it stays alive, otherwise it days. */
			} else {
				counter = this.getAliveNeighbours(cells, cell);
				if (counter == 2 || counter == 3) {
					nextState.push([cell, true]);	
				} else {
					nextState.push([cell, false]);
				}	
			}
		}
		/* The for loop loops through all cells and checks if it has a true ot false value. The cells array is spliced at each index, the cell is removed and replaced by a new alive cell or dead cell depending on its next state. */
		/* (Remember bind(null, parameter) sets this to null, the code doesn't work otherwise. */
		/* Bind returns a function with a body same as the function it's bound to. this is resolved to the first argument.
		So when you call it with onfilechange.bind(null, playsound), it creates and returns a new function, always receiving playsound as first argument and using global context (Because null is used as context), just like all regular functions use global context */
		for (cell in nextState) {
			if (nextState[cell][1]) {
				cells.splice(nextState[cell][0], 1, <div onClick={this.cellClick.bind(null, nextState[cell][0])} key={nextState[cell][0]} className="cell alive"></div>);
			} else {
				cells.splice(nextState[cell][0], 1, <div onClick={this.cellClick.bind(null, nextState[cell][0])} key={nextState[cell][0]} className="cell"></div>);
			}
		}
		/* The commented out loop below doesn't work to change the cells. All if statements get executed after the for loop is done, in other words all indices for splice will shifted by the final value of state. The above working code is similar, except it uses the actual cell number to be replaced instead of referencing it using state.
		for (var state in nextState) {
			if (nextState[state]) {
				console.log(state);
				cells.splice(state + 71, 1, <div className="cell alive"></div>);
			}
		}*/
		/* The state is updated, generations is incremented. */
		this.setState({cells: cells, generations: this.state.generations + 1});
	},
	/* The way this function os written guarantess that no more than one timer will be running. It's a handler for clicking the Run/Pause button. */
	runClick: function() {
		/* The status of the timer is checked, if true it means it's running and the click was to pause the game (else will be executed.) If false, the time should start and the furst part of if is executed. */
		if (!timerStatus) {
			/* NOTICE: this.getGeneration wasn't used directly inside setInterval because of scoping, this won't be referring to GameArea anymore. setting getGeneration to this.getGeneration passes the function definition only to getGeneration, inside the timer adding the brackets will run the function. If getGeneration is set to this.getGeneration() it will run only once directly after run is clicked. */
			var getGeneration = this.getGeneration;
			/* Timer is started, delcared as global variable becuase we need to access it from other methods (setting it in the state didn't work.) */
			window.timer = setInterval(function() {
				/* getGeneration method is called each 0.1 seconds. */
				getGeneration();
			}, 100);
			/* timerStatus is set to true to indicate a running game. */
			timerStatus = true;
		} else {
			/* If the click was to pause the game, the timer is reset, timerStatus is set to false. */
			clearInterval(timer);
			timerStatus = false;
		}
	},
	/* Clear button click handler. It accept two arguments: width and height. This method is called by three buttons: Clear, and the grid buttons: Small 30x50, Large 50x70. */
	clearClick: function(height, width) {
		/* An array which will hold the new cells. */
		var cells = [];
		/* If the timer is running it will be stopped and timerStatus set to false. */
		if (timerStatus) {
			clearInterval(timer);
			timerStatus = false;
		}
		/* The width of the board div is changed according to the width. Each cell is 12px wide, so for a width of 50, 600px will be needed. */
		if (width == 50) {
			$(".board").css("width", "600px");
		} else { /* 840px for a 70 cells wide grid */
			$(".board").css("width", "840px");
		}
		/* The new cells array will only hold dead cells, the number of cells equals width * height. */
		for (var i = 0; i < width * height; i++) {
				cells.push(<div onClick={this.cellClick.bind(null, i)} key={i} className="cell"></div>);
		}
		/* The new state is set. */
		this.setState({cells: cells, generations: 0, width: width, height: height});
	},
	/* This is a handler for clicking a cell. Clicking a cell inverts its state: alive becomes dead, and dead becomes alive. The clicked cell is detected by its key which passed an argument whenever this method is called. */
	cellClick: function(key) {
		var cells = this.state.cells;
		if (cells[key].props.className == "cell alive") {
			cells.splice(key, 1, <div onClick={this.cellClick.bind(null, key)} key={key} className="cell"></div>);
		} else {
			cells.splice(key, 1, <div onClick={this.cellClick.bind(null, key)} key={key} className="cell alive"></div>);
		}
		this.setState({cells: cells});
	},
	/* render method. Notice the method which are passed as props to the children. */
	render: function() {
		return (
			<div>
				<h3 className="main-header">Game of Life (built with ReactJS and Sass)</h3>
				<Controls runClick={this.runClick} generations={this.state.generations} clearClick={this.clearClick} width={this.state.width} height={this.state.height}/>
				<Board cells={this.state.cells}/>
				<GridControls click={this.clearClick} />
				<Information />
			</div>
		);
	}
})

/* Controls component, it includes the Run/Pause button, Clear button and Generation number. */
var Controls = React.createClass({
	render: function() {
		/* width and height are needed because they are passed back as arguments when the clear button is clicked. Each button has a handler passed as props from the parent GameArea. */
		var height = this.props.height;
		var width = this.props.width;
		return (
			<div className="controls">
				<button className="control" onClick={this.props.runClick}>Run/Pause</button>
				<button className="control" onClick={this.props.clearClick.bind(null, height, width)}>Clear</button>
				<div className="generations">Generation: {this.props.generations}</div>
			</div>
		);
	}
})

/* This component has all the cells (it's the grid). the cells are passed as props and iterated through and then rendered. */
var Board = React.createClass({
	render: function() {
		return (
			<div className="board">
				{this.props.cells}
			</div>
		);
	}
})

/* Grid controls component, it has the Small and Large buttons which control the grid size. */
var GridControls = React.createClass({
	render: function() {
		/* bind here is used again and width and height are passed as arguments. */ 
		return (
			<div className="grid-controls">
				<button className="control" onClick={this.props.click.bind(null, 30, 50)}>Small 30x50</button>
				<button className="control" onClick={this.props.click.bind(null, 50, 70)}>Large 50x70</button>
			</div>
		);
	}
})

/* Information component. Has two items, first providing a link a wikipedia page tp explain the game, the second a link to this page's repo on github. */
var Information = React.createClass({
	render: function() {
		return (
			<ul className="information">
				<li>John Conway's Game of Life, visit this <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="blank">link</a> to read about how the game works.</li>
				<li>To view this page's guide, please visit this <a href="https://amashamdan.github.io/game-of-life" target="blank">link</a></li>
			</ul>
		);
	}
})

ReactDOM.render(<GameArea />, document.getElementById("game"));