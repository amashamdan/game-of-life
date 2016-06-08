###Game of Life

Welcome to Game of Life, built with ReactJS and Sass.

###The Game

The game starts with a random pattern of alive and dead cells, a dead cell is black while an alive cell is green. The default grid size is 50x70.
The state of cells keep changing every 100 ms, each state is called generation. The state of a cell in the next generation is determined depending on its neighbours. Each cell has eight neighbours. The rules to deicde the next state of a cell are as follows:

* If the cell is alive, it remains alive in the next generation if it's surrounded by only two or three alive neighbours in the current state. Otherwise is dies.
* If the cell is dead, it comes to life in the next state only if it's surrounded by three alive neighbours in the current state. Otherwise it remains dead.

Eventually the grid should reach a "stable" or "repeating" pattern.

##Controls

* The game runs on its own once the page is loaded, the number of the current generation is displayed above the grid. *The user can click any cell to invert its state whether the game is running or paused*.
* To pause the game, click on Run/Pause button. Click on the button again to resume it.
* Clear button clears the grid and sets all cell as dead cells. The Clear button doesn't change the grid size.
* After clearing the board, the user can click on any cell to toggle its state. After the board is set to an initial pattern, click Run/Resume to start the game.
* The grid size can be changed by clicking the "Small 30x50" or "Large 50x70" buttons. *Be aware that changing the grid size clears the board and resets the game.*

For more inforamtion about the game, check this [page](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). Enjoy!