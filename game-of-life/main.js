// TODO
var Npx = require('npx');
var Life = require('alive');

var width = 8, height = 8;
var initialLifeProbability = 0.5;
var npx = new Npx(width*height);
var aniFrame = npx.newAnimation(1);
var life = new Life(width);
var turn = 0;
var oldBoard;
var olderBoard;
var palette = [];
palette[0] = [0,0,0];
palette[1] = [50,50,0];
function initBoard() {
    aniFrame = npx.newAnimation(1);
//randomize initial board population
    for(var ey = 0; ey < height; ey++) {
        for (var ex = 0; ex < width; ex++) {
            if(Math.random() < initialLifeProbability) {
                life.setCell(ey, ex, 1);
            }
        }
    }
    renderTurn()
}
function renderTurn(){
//draw current board
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            aniFrame.setPixel((y*8+x), palette[life.grid[y][x]], 0);
            //console.log('pos: '+(y*8+x)+'col: '+palette[life.grid[y][x]]);
        }
    }
//safe state and do a tick
    olderBoard = oldBoard;
    oldBoard = life.grid;

    //console.log(oldBoard);
    life.tick();
    //console.log(life.grid);
    if(turn > 30) {
        console.log('finished');
        turn = 0;
        palette[1]=[Math.random()*100,Math.random()*100,0];
        setTimeout(function(){initBoard()},2000); //reset after five seconds
    } else {
        //npx.play(aniFrame, function(){setTimeout(function(){renderTurn();},20)});
        npx.play(aniFrame, function(){renderTurn()});

        //console.log('new tick: '+turn);
        turn++;
        //console.log(life.grid);
    }
}
initBoard();