let grid = [];
let cols = 28;
let rows = 31;
let pointsRemaining = 0; 

let cellSize;

let pacman;
let ghosts = [];

let ghostImgs = [];
let theShader;

/*let position = {
    baseSize: 0,
    xSize: 28,
    ySize: 31,
    getX: function() {
        return this.disp
    }
};*/


function arrayEquals(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function pathByRow(row, col, l, mirror = true) {
    if (i == 10 && j == 11) {
        debugger;
    }
    if (col > cols / 2 || l + col > cols / 2) {
        mirror = false;
    }
    for (var i = col; i < l + col; i++) {
        grid[row][i].setPathPoint();
    }
    if (mirror) {
        let offset = cols / 2 + (cols / 2 - 1 - col);
        for (var i = offset; i > offset - l; i--) {
            grid[row][i].setPathPoint();
        }
    }
}

function pathByCol(row, col, l, mirror = true) {
    if (col > cols / 2) {
        mirror = false;
    }
    for (var i = row; i < l + row; i++) {
        grid[i][col].setPathPoint();
    }
    if (mirror) {
        let offset = cols / 2 + (cols / 2 - 1 - col);
        for (var i = row; i < l + row; i++) {
            grid[i][offset].setPathPoint();
        }
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = true;
        this.ghost = false;
        this.pacman = false;
        this.point = false;
        this.powerup = false;
    }
    getSolid() {
        return this.solid;
    }
    //setSolid() {
    //    this.solid = true;
    //    this.point = false;
    //}
    setPath() {
        this.solid = false;
    }
    setPoint(point = true) {
        if(point && !this.point) {
            pointsRemaining++;
        } else if (!point && this.point) {
            pointsRemaining--;
        }
        this.point = point;
    }
    getPoint() {
        return this.point;
    }
    setPathPoint() {
        this.setPoint();
        this.setPath();
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getPosition() {
        return [this.getX(), this.getY()];
    }
    draw() {
        //noStroke();
        if (this.solid) {
            //noStroke();
            stroke(51);
            fill(55, 0, 0);
        } else {
            stroke(51);
            fill(150);
        }
        rectMode(CORNER);
        rect(...this.getPosition(), cellSize, cellSize);
        if (this.point) {
            fill(255, 255, 0);
            circle(
                this.getX() + cellSize * 0.5,
                this.getY() + cellSize * 0.5,
                cellSize / 4
            );
        }
    }
}

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.power = 0;
    }
    getPower() {
        return this.power > 0;
    }
    getPos() {
        return [this.x, this.y];
    }
    getXCoords() {
        return floor(this.x / cellSize);
    }
    getYCoords() {
        return floor(this.y / cellSize);
    }
    getCoords() {
        return [this.getXCoords(), this.getYCoords()];
    }
    toInitialPos() {
        this.x = this.initialX;
        this.y = this.initialY;
    }
    changePos(xChange, yChange, speed = 1) {
        for (var i = 0; i < speed; i++) {
            if (this.getXCoords() == 0) {
                this.x = floor(cols * cellSize - cellSize * 1.5);
            }
            if (this.getXCoords() == (cols - 1)) {
                this.x = floor(cellSize * 1.5);
            }
            if (
                xChange < 0 &&
                !(
                    grid[this.getYCoords()][this.getXCoords() - 1].getSolid() &&
                    this.getPos()[0] % cellSize == floor(cellSize / 2)
                )
            ) {
                this.y = floor(this.getYCoords() * cellSize + cellSize * 0.5);
                this.x--;
                //            return true;
            } else if (
                xChange > 0 &&
                !(
                    grid[this.getYCoords()][this.getXCoords() + 1].getSolid() &&
                    this.getPos()[0] % cellSize == floor(cellSize / 2)
                )
            ) {
                this.y = floor(this.getYCoords() * cellSize + cellSize * 0.5);
                this.x++;
                //            return true;
            } else if (
                yChange > 0 &&
                !(
                    grid[this.getYCoords() - 1][this.getXCoords()].getSolid() &&
                    this.getPos()[1] % cellSize == floor(cellSize / 2)
                )
            ) {
                this.x = floor(this.getXCoords() * cellSize + cellSize * 0.5);
                this.y--;
                //            return true;
            } else if (
                yChange < 0 &&
                !(
                    grid[this.getYCoords() + 1][this.getXCoords()].getSolid() &&
                    this.getPos()[1] % cellSize == floor(cellSize / 2)
                )
            ) {
                this.x = floor(this.getXCoords() * cellSize + cellSize * 0.5);
                this.y++;
                //            return true;
            } else {
                return false;
            }
        }
        return true;
    }
}

class Ghost extends Entity {
    constructor(x, y) {
        super(floor(x + cellSize * 0.5), floor(y + cellSize * 0.5));
        this.dir;
        this.canContinue;
        this.baseSpeed = 2;
    }
    move() {
        if (
            floor(random() * 25) == 0 ||
            this.dir === undefined ||
            !this.canContinue
        ) {
            this.dir = floor(random() * 4);
        }
        switch (this.dir) {
            case 0:
                this.canContinue = this.changePos(-1, 0, this.getSpeed());
                break;
            case 1:
                this.canContinue = this.changePos(1, 0, this.getSpeed());
                break;
            case 2:
                this.canContinue = this.changePos(0, -1, this.getSpeed());
                break;
            case 3:
                this.canContinue = this.changePos(0, 1, this.getSpeed());
                break;
            default:
                this.canContinue = false;
                break;
        }
    }
    getSpeed() {
        if(!this.getPower()) {
            return this.baseSpeed;
        } else {
            return 0.5 * this.baseSpeed;
        }
    }
    draw() {
        this.move();
        fill(99, 99, 0);
        rectMode(CENTER);
        rect(this.x, this.y, cellSize * 0.8, cellSize * 0.8);
    }
}

class Pacman extends Entity {
    constructor(x, y) {
        super(floor(x + cellSize * 0.5), floor(y + cellSize * 0.5));
        this.dir = [];
        this.oldDir = [];
    }
    move() {
        let dir = [];
        let xChange = 0;
        let yChange = 0;
        if (keyIsDown(LEFT_ARROW)) {
            xChange--;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            xChange++;
        }
        if (keyIsDown(UP_ARROW)) {
            yChange++;
        }
        if (keyIsDown(DOWN_ARROW)) {
            yChange--;
        }
        dir = [xChange, yChange];
        if (dir.length != 0 && dir != [0, 0]) {
            this.dir = dir;
        }
        if (this.dir.length != 0) {
            if (this.changePos(...this.dir, 10)) {
                this.oldDir = this.dir;
            } else if (this.oldDir.length != 0) {
                this.dir = this.oldDir;
                this.changePos(...this.dir, 10);
            }
        }
    }
    getDir() {
        if(this.dir[0] == 1) {
            return 0;
        } else if(this.dir[1] == -1) {
            return 1;
        } else if(this.dir[0] == -1) {
            return 2;
        } else if (this.dir[1] == 1) {
            return 3;
        } else {
            return 0;
        }
    }
    draw() {
        this.move();
        grid[this.getYCoords()][this.getXCoords()].setPoint(false);
        fill(255, 255, 0);
        noStroke();
        //rectMode(CENTER);
        let mouthSize = (abs(sin(frameCount / 5)) / 2) + 0.25;
        let rotation = this.getDir() * HALF_PI;
        arc(this.x, this.y, cellSize * 0.8, cellSize * 0.8, rotation + mouthSize, rotation + TWO_PI - mouthSize, PIE);

    }
}

function lose() {

}

function draw() {
    translate(-(cols / 2) * cellSize, -height / 2);
    background(220);
    /*    for (var x = 0; x < width; x += width / 31) {
        for (var y = 0; y < height; y += height / 31) {
            stroke(0);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
*/
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].draw();
        }
    }
    //test.draw();
    pacman.draw();
    for(var i = 0; i <ghosts.length; i++) {
        ghosts[i].draw();
        if(arrayEquals(ghosts[i].getCoords(), pacman.getCoords())) {
            noLoop();
        }
    }
}
function windowResized() {
    if(document.fullscreenElement) {
        resizeCanvas(windowWidth, windowHeight);
    } else {
        resizeCanvas(cols * cellSize, rows * cellSize);
    }
}

function setup() {
    cellSize = floor(min(displayHeight, displayWidth) / 40);
    //canvas = createCanvas(cols * cellSize, rows * cellSize, WEBGL);
    canvas = createCanvas(cols * cellSize, rows * cellSize, WEBGL);
    console.log(displayWidth);
    for (var i = 0; i < rows; i++) {
        grid[i] = [];
        for (var j = 0; j < cols; j++) {
            grid[i][j] = new Cell(j * cellSize, i * cellSize);
        }
    }
    //test = new Ghost(cellSize * 2, cellSize);

    pacman = new Pacman(cellSize * 13, cellSize * 23);
    for(var i = 0; i < 4; i++) {
        ghosts[i] = new Ghost(cellSize * (12 + i), cellSize * 11);
    }
    /*    for(var i = 0; i < cols; i++) {
            grid[0][i].setSolid();
        }
        */
    pathByRow(1, 1, 12);
    //    pathByRow(1, 15, 12);
    pathByCol(1, 1, 8);
    pathByCol(1, 6, 26);
    pathByCol(1, 12, 5);

    pathByRow(5, 1, 26);

    pathByRow(8, 1, 5);

    pathByRow(8, 3, 4);
    pathByRow(8, 9, 4);

    pathByRow(14, 0, 10);
    //    pathByRow(8, 15, 4);
    //    pathByRow(8, 21, 5);

    pathByCol(5, 9, 4);

    pathByCol(11, 9, 10);
    pathByRow(20, 1, 12);

    pathByCol(20, 1, 4);
    pathByCol(20, 12, 4);

    pathByRow(23, 1, 3);
    pathByRow(23, 6, 8);

    pathByRow(26, 1, 6);
    pathByRow(26, 9, 4);

    pathByCol(23, 3, 4);
    pathByCol(23, 9, 4);

    pathByCol(8, 12, 4);

    pathByRow(29, 1, 26);

    pathByCol(26, 1, 4);

    pathByCol(26, 12, 4);

    pathByRow(11, 9, 10);
    pathByRow(17, 9, 10);

    //pathByCol(1, 15, 5);
    //pathByCol(1, 21, 26);
    //pathByCol(1, 26, 8);
    for (var i = 9; i < 18; i++) {
        for (var j = 0; j < cols; j++) {
            if (j != 6 && j != 21) {
                grid[i][j].setPoint(false);
            }
        }
    }
}
function preload() {
    ghostImgs[0] = loadImage('img/red.png');
}