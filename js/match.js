let tokens = [];
let dragged = [];
let distances = [];
let rowIndex;
let columnIndex;
let t;
let tokenNumber = 0;


function setup() {
  createCanvas(400, 400);
  createMatrix(tokens, 8);
  for(let i = 0; i < tokens.length; i++) {
    for(let j = 0; j < tokens.length; j++) {
      tokens[i][j] = new Token(25 + i*50, 25 + j*50);
    }
  }
}

function draw() {
  
  background(220);
  strokeWeight(1);
  for (let x = 50; x < 400; x += 50) {
    line(x, 0, x, 500);
  }
  for (let y = 50; y < 400; y += 50) {
    line(0, y, 500, y);
  }
  for(let i = 0; i < tokens.length; i++) {
    for(let j = 0; j < tokens.length; j++) {
      tokens[i][j].show();
    }
  }
  if(mouseIsPressed) {   
  for(let i = 0; i < tokens.length; i++) {
      for(let j = 0; j < tokens.length; j++) {
        tokens[i][j].clicked(mouseX, mouseY);
      }
    }
    if (t) {
      dragged[0].show();
    }
  }
}







function mouseReleased() {
  console.log(rowIndex + ' ' + columnIndex);
  //tokens[rowIndex][columnIndex].match();
  dragged = [];
  distances = [];
}


class Token {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type || random(1);
    tokenNumber++;
    this.tNumber = tokenNumber;
  }
  
  show() {
    if(this.type > 0.8) {
       fill(200, 0, 0);
       } else if(this.type > 0.6) {
           fill(0, 200, 0);
       } else if(this.type > 0.4) {
           fill(200, 200, 50);
       } else if(this.type > 0.2) {
           fill(155, 0, 250);
       } else {
           fill(0, 150, 200);
       }
    ellipse(this.x, this.y, 40);
  }
  
  clicked(px, py) {
    let d = dist(px, py, this.x, this.y)
    distances.push(d);
    t = false;
    if(d < 25) {
      let pos = [];
      dragged.push(new Token(this.x, this.y, this.type));
      rowIndex = (this.x - 25)/50;
      columnIndex = (this.y - 25)/50;
    }
    if(min(distances) < 25) {
      t = true;
      dragged[0].x = mouseX;
      dragged[0].y = mouseY;
    }
  }
  
  match() {
    if() {
         
    }
  }
  
  tokenNum() {
    return this.tNumber;
  }
}


function createMatrix(A, a) {
  for(let i = 0; i < a; i++) {
    A[i] = [];
    for(let j = 0; j < a; j++) {
      A[i][j] = 0;
    }
  }
}