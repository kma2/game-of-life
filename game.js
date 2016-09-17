var utils = {

  getCellStatus: function(cell){
    return cell.getAttribute('data-status');
  },

  setCellStatus: function(cell, status) {
    cell.setAttribute('data-status', status)
    cell.className = status;
  },

  //change the status of the cell
  toggleStatus: function(cell) {
    if(utils.getCellStatus(cell) === 'dead') {
      utils.setCellStatus(cell, 'alive');
    } else {
      utils.setCellStatus(cell, 'dead');
    }
  },

  getCell: function(col,row) {
    return document.getElementById(col + '-' + row);
  },
  
  getNeighbors : function(cell) {
 
    var splitId = cell.id.split('-').map(Number);
    var col = splitId[0];
    var row = splitId[1];
    var neighbors = [];

    //get left/right
    neighbors.push(utils.getCell(col-1, row));
    neighbors.push(utils.getCell(col+1, row));
    //get top row
    neighbors.push(utils.getCell(col-1, row-1));
    neighbors.push(utils.getCell(col, row-1));
    neighbors.push(utils.getCell(col+1, row-1));

    //get bottom row
    neighbors.push(utils.getCell(col-1, row+1));
    neighbors.push(utils.getCell(col, row+1));
    neighbors.push(utils.getCell(col + 1, row+1));

    return neighbors.filter(function(neighbor) {
      return neighbor !== null;
    });

  },

  countAlive : function(neighbors) {
    return neighbors.filter(function(neighbor) {
      return utils.getCellStatus(neighbor) === 'alive';
    }).length;
  }
}


var gameOfLife = {
  width: 100,
  height: 75,
  stepInterval: null,

  createAndShowBoard: function () {

    var goltable = document.createElement("tbody"); // creates a table element
    
    // builds Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    var board = document.getElementById('board');
    board.appendChild(goltable);

    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {

    // array containing all the cells on the boards
    var allCells = [].slice.call(document.getElementsByTagName('td'));

    // splits each cell by row and column
    allCells.forEach(function(cell) {
      var splitId = cell.id.split('-');
      iteratorFunc(cell, splitId[0], splitId[1]);
    });

  },
  
  setupBoardEvents: function() {

    this.forEachCell(function(cell) {
      cell.addEventListener('click', function() {
        utils.toggleStatus(this); // changes selected cells to "alive" 
      });
    });

    var stepBtn = document.getElementById('step_btn');
    var playBtn = document.getElementById('play_btn');
    var clearBtn = document.getElementById('clear_btn');
    var resetBtn = document.getElementById('reset_btn');

    // add event listeners to the four buttons
    stepBtn.addEventListener('click', gameOfLife.step.bind(this));
    playBtn.addEventListener('click', gameOfLife.enableAutoPlay.bind(this));
    clearBtn.addEventListener('click', gameOfLife.clear.bind(this));
    resetBtn.addEventListener('click', gameOfLife.reset.bind(this));
  },

  step: function () {

    var toToggle = [];

    //iterate over cells, and toggle status based on # of living neighbors
    this.forEachCell(function(cell) {
      var neighbors = utils.getNeighbors(cell);
      var numAlive = utils.countAlive(neighbors);

      if(utils.getCellStatus(cell) === 'dead') {
        if(numAlive === 3) {
          toToggle.push(cell)
        }
    
      } else { //cell is alive
        if(numAlive < 2 || numAlive > 3) {
          toToggle.push(cell);
        }
      }
    });

    toToggle.forEach(utils.toggleStatus);
  },

  enableAutoPlay: function () {
   if( this.stepInterval === null) {
    this.stepInterval = setInterval(this.step.bind(this), 200) 
   } else {
    this.stop();
   }
  },

  stop: function() {
    clearInterval(this.stepInterval);
    this.stepInterval = null;
  },

  clear: function() {
    this.stop();
    this.forEachCell(function(cell){
      utils.setCellStatus(cell, 'dead');
    })
  },

  reset: function() {
    this.stop();
    this.clear();
    this.forEachCell(function(cell){
      if(Math.random() > 0.5) {
        utils.setCellStatus(cell, 'alive')
      } else {
        utils.setCellStatus(cell, 'dead');
      }
    });
  }

};

  gameOfLife.createAndShowBoard();