var scl = 25;
var cost;
var box1, box2;
var traps = new Array();
var paths = new Array();
var usedPaths = new Array();
var goto = new Array();
var start = false;
var statusLbl;

// --- Main Functions --- //

function setup() {
  createCanvas(550, 550);
  strokeWeight(2);
  frameRate(12);
  box1 = new Box1();
  box2 = new Box2();
  cost = getG(box1.x, box1.y, box2.x, box2.y);
  usedPaths.push([box1.x, box1.y]);
  statusLbl = document.getElementsByTagName("P")[0];
}

function draw() {
  background(220);
  box2.show();
  box1.show();
  for (var i=0;i<traps.length;i++) {
    traps[i].show();
  }
  if (box1.x == box2.x && box1.y == box2.y) {
    statusLbl.innerHTML = "<font color=\"red\"><b>Hedefe ulaşıldı!</b></font>";
    noLoop();
  }
  if (start) {
    paths = neighbors(box1.x, box1.y);
    paths = cleanFromTraps(paths);
    paths = ignoreUsedPaths(paths);
    goto = getCost(paths, cost);
    box1.move(goto[0], goto[1]);
    usedPaths.push([goto[0], goto[1]]);
  }
}

// --- Main Functions --- // 

function keyPressed() {
  if (keyCode === ENTER) {
    start = true;
    statusLbl.innerHTML = "<b>Yol hesaplanıyor...</b>";
  }
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    var tX = mouseX - mouseX%scl;
    var tY = mouseY - mouseY%scl;
    if ((tX == box1.x && tY == box1.y) || (tX == box2.x && tY == box2.y)) {
      console.log("lütfen başka bir yer seçin!");
    }
    else traps.push(new Trap(tX, tY));
  }
}

function neighbors(box1_x, box1_y) {
  var pths = new Array();
  for (var i=-1;i<2;i++) {
    var colScl = scl * i; 
    for (var j=-1;j<2;j++) {
      var rowScl = scl * j;
      if (colScl == 0 && rowScl == 0) continue;
      pths.push([colScl+box1_x, rowScl+box1_y]);
    }
  }
  return pths;
}

function cleanFromTraps(p) {
  for (var i=0;i<traps.length;i++) {
    for (var j=0;j<p.length;j++) {
    if (p[j][0] == traps[i].x && p[j][1] == traps[i].y) {
      p.splice(j, 1);
      break;
    }
    }
  }
  return p;
}

function ignoreUsedPaths(p) {
  for (var i=0;i<usedPaths.length;i++) {
    for (var j=0;j<p.length;j++) {
      if (usedPaths[i][0] == p[j][0] && usedPaths[i][1] == p[j][1]) {
        p.splice(j, 1);
      }
    }
  }
  if (p.length == 0) {
    usedPaths = new Array([box1.x, box1.y]);
    p = neighbors(box1.x, box1.y);
    p = cleanFromTraps(p);
  }
  return p;
}

function getG(b1x, b1y, b2x, b2y) {
  return round(sqrt(pow(b2x-b1x,2) + pow(b2y-b1y,2)));
}

function getH(b1x, b1y, stepx, stepy) {
  return round(sqrt(pow(stepx-b1x,2) + pow(stepy-b1y,2)));
}

function getCost(_p, _f) { // Bütün iş bu fonksiyonda bitiyor!!!
  var optf, minf;
  var g, h;
  for (var i=0;i<_p.length;i++) {
    g = getG(_p[i][0], _p[i][1], box2.x, box2.y);
    h = getH(box1.x, box1.y, _p[i][0], _p[i][1]);
    optf = g + h;
    if (i==0) {
      minf = optf;
      var dir = new Array();
      dir.push(_p[i][0], _p[i][1]);
    }
    else {
      if (minf > optf) {
        minf = optf;
        var dir = new Array();
        dir.push(_p[i][0], _p[i][1])
      }
    }
  }
  cost = minf;
  return dir;
}

function Box1() { // start point
  this.x = scl;
  this.y = scl;

  this.move = function(xSpeed, ySpeed) {
    this.x = xSpeed;
    this.y = ySpeed;
  }
  
  this.show = function() {
    fill(255,0,0);
    rect(this.x, this.y, scl, scl);
  }
}

function Box2() { // end point
  this.x = width-scl*2;
  this.y = height-scl*2;
  
  this.show = function() {
    fill(0,0,255);
    rect(this.x, this.y, scl, scl);
  }
}

function Trap(_x, _y) {
  this.x = _x;
  this.y = _y;
  
  this.show = function() {
    fill(0);
    rect(this.x, this.y, scl, scl);
  }
}
