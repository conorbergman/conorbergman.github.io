var GAME_WIDTH = 800;
var GAME_HEIGHT = 800;
var MAP_WIDTH = 2400;
var MAP_HEIGHT = 2400;

var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.canvas.style = "border:1px solid #000000";
    this.context = this.canvas.getContext("2d");
    document.getElementById('game-canvas').insertBefore(this.canvas, document.getElementById('game-canvas').childNodes[0]);
    this.interval = setInterval(updateGame, 20);
  },
  clear : function() {
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
  }
}

function gameObj(x, y, s) {
  this.x = x;
  this.y = y;
  this.targX = x;
  this.targY = y;
  this.theta = 0;
  this.speed = s;
  this.health = 100;
  this.r = 10;
  this.color = "#105099";
  this.setSpeed = function(s) {
    this.speed = s;
  }
  this.setPos= function(x,y) {
    this.x = x;
    this.y = y;
  }
  this.moveTo = function(x,y) {
    this.targX = x;
    this.targY = y;
  }
  this.move = function() {
    dx = this.targX - this.x;
    dy = this.targY - this.y;
    this.theta = Math.atan2(dy, dx);
    s = this.speed;
    as = Math.pow(Math.pow(dx,2)+Math.pow(dy,2), 0.5);
    if (as < s) {
      s=as;
    }
    this.x += s*Math.cos(this.theta);
    this.y += s*Math.sin(this.theta);

    if (this.y > MAP_HEIGHT) {
      this.y = MAP_HEIGHT;
    }
    if (this.x > MAP_WIDTH) {
      this.x = MAP_WIDTH;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x < 0) {
      this.x = 0;
    }
  }
  this.draw = function(camera) {
    // draw player
    ctx = gameArea.context;
    ctx.beginPath();
    ctx.arc(this.x + camera.getX(), this.y + camera.getY(), this.r, 0, 2*Math.PI);
    ctx.fillStyle=this.color;
    ctx.fill();
    // draw health
    // green bar
    ctx.beginPath();
    ctx.rect(this.x-45 + camera.getX(), this.y-20 + camera.getY(), this.health, 5);
    ctx.fillStyle = "#10aa01";
    ctx.fill();
    // red bar
    ctx.beginPath();
    ctx.rect(this.x-45+this.health + camera.getX(), this.y-20 + camera.getY(), 100-this.health, 5);
    ctx.fillStyle = "#aa1010";
    ctx.fill();
  }
  this.mouseCollide = function(mx, my) {
    dx = this.x - mx;
    dy = this.y - my;
    as = Math.pow(Math.pow(dx,2)+Math.pow(dy,2), 0.5);
    if (as <= this.r*2) {
      if (this.color == "#105099") {
        this.color = "#738282";
      } else {
        this.color = "#105099";
      }
      return true;
    }
    return false;
  }
  this.attack = function(atk, mouseX, mouseY) {
    dx = mouseX - this.x;
    dy = mouseY - this.y;
    theta = Math.atan2(dy, dx);

    if (atk === "q") {
      console.log(mouseX);
      projectiles.push(new projectile(this.x, this.y, theta));
    }
  }
}

function projectile(x, y, theta) {
  this.x = x;
  this.y = y;
  this.theta = theta;
  this.speed = 10;
  this.color = "#ad2213";
  this.r = 4;

  this.update = function() {
    this.x += this.speed*Math.cos(this.theta);
    this.y += this.speed*Math.sin(this.theta);

    if (this.x<0 || this.y<0 || this.x>MAP_WIDTH || this.y>MAP_HEIGHT) {
      ind = projectiles.indexOf(this);
      projectiles.splice(ind, 1);
    }
  }
  this.draw = function(camera) {
    ctx = gameArea.context;
    ctx.beginPath();
    ctx.arc(this.x + camera.getX(), this.y + camera.getY(), this.r, 0, 2*Math.PI);
    ctx.fillStyle=this.color;
    ctx.fill();
  }
}

function tower(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.health = 100;
  this.width = 50;
  this.height = 100;
  this.drawX = this.x - this.width/2;
  this.drawY = this.y - this.height/2;
  this.draw = function(camera) {
    ctx = gameArea.context;
    // draw turret
    ctx.beginPath();
    ctx.rect(this.drawX + camera.getX(), this.drawY + camera.getY(), this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    // draw health
    // green bar
    ctx.beginPath();
    ctx.rect(this.drawX-25 + camera.getX(), this.drawY-20 + camera.getY(), this.health, 10);
    ctx.fillStyle = "#10aa01";
    ctx.fill();
    // red bar
    ctx.beginPath();
    ctx.rect(this.drawX-25+this.health + camera.getX(), this.drawY-20 + camera.getY(), 100-this.health, 10);
    ctx.fillStyle = "#aa1010";
    ctx.fill();
  }
  this.update = function(p) {
    dx = Math.pow(p.x-this.x,2);
    dy = Math.pow(p.y-this.y,2);
    if (Math.pow(dx+dy,0.5)<100) {
      p.health -=1;
      if (p.health < 0) {
        p.health = 0;
      }
    }
  }
}

function enemy(x, y, s) {
  this.x = x;
  this.y = y;
  this.speed = s;
  this.color = "#cc5555";
  this.health = 100;
  this.ar = 40;

  this.move = function(p) {
    dx = p.x - this.x;
    dy = p.y - this.y;
    theta = Math.atan2(dy, dx) + (Math.random()-0.5)*2;
    s = this.speed;
    as = Math.pow(Math.pow(dx,2)+Math.pow(dy,2), 0.5);
    if (as <= 2*p.r) {
      s=0;
    }
    if (as <= this.ar) {
      p.health-=1;
      if (p.health < 0) {
          p.health = 0;
      }
    }
    this.x += s*Math.cos(theta);
    this.y += s*Math.sin(theta);
  }
  this.draw = function(camera) {
    // draw enemy
    ctx = gameArea.context;
    ctx.beginPath();
    ctx.arc(this.x + camera.getX(), this.y + camera.getY(), 10, 0, 2*Math.PI);
    ctx.fillStyle=this.color;
    ctx.fill();
    // draw health
    // green bar
    ctx.beginPath();
    ctx.rect(this.x-45 + camera.getX(), this.y-20 + camera.getY(), this.health, 5);
    ctx.fillStyle = "#10aa01";
    ctx.fill();
    // red bar
    ctx.beginPath();
    ctx.rect(this.x-45+this.health + camera.getX(), this.y-20 + camera.getY(), 100-this.health, 5);
    ctx.fillStyle = "#aa1010";
    ctx.fill();
  }
  this.mouseCollide = function(mx, my) {
    dx = this.x - mx;
    dy = this.y - my;
    as = Math.pow(Math.pow(dx,2)+Math.pow(dy,2), 0.5);
    if (as <= this.ar) {
      this.health -= 3;
      if (this.health < 0) {
        this.health = 0;
      }
      return true;
    }
    return false;
  }
}

function miniMap(x, y, scale) {
  this.x = x;
  this.y = y;
  this.scale = scale;

  this.draw = function(objs) {
    // draw background
    ctx = gameArea.context;
    ctx.beginPath();
    ctx.rect(this.x, this.y, GAME_WIDTH-this.x, GAME_HEIGHT-this.y);
    ctx.fillStyle = "#aaaaaaaa";
    ctx.fill();
    // draw objects
    for (var o of objs) {
      ctx.beginPath();
      ctx.arc(this.x+(o.x*this.scale), this.y+(o.y*this.scale), 4, 0, 2*Math.PI);
      ctx.fillStyle=o.color;
      ctx.fill();
    }
  }
}

function camera() {
  this.x = 0;
  this.y = 0;
  this.movx = 0;
  this.movy = 0;
  this.speed = 5;

  this.getX = function() {
    return this.x;
  }

  this.getY = function() {
    return this.y;
  }

  this.move = function(x, y) {
    this.movx += x;
    this.movy += y;
    if (this.movy > 1) {
      this.movy = 1;
    }
    if (this.movx > 1) {
      this.movx = 1;
    }
    if (this.movy < -1) {
      this.movy = -1;
    }
    if (this.movx < -1) {
      this.movx = -1;
    }
  }

  this.update = function() {
    this.x += this.movx * this.speed;
    this.y += this.movy * this.speed;

    if (this.y-GAME_HEIGHT < -MAP_HEIGHT) {
      this.y = -(MAP_HEIGHT-GAME_HEIGHT);
    }
    if (this.x-GAME_WIDTH < -MAP_WIDTH) {
      this.x = -(MAP_WIDTH-GAME_WIDTH);
    }
    if (this.y > 0) {
      this.y = 0;
    }
    if (this.x > 0) {
      this.x = 0;
    }
  }
}

var p1;
var enemies = [];
var numEnemies = 5;
var gameObjs = [];
var projectiles = [];
var mousePosition = {
  x:0,
  y:0
};

function startGame() {
  gameArea.start();
  p1 = new gameObj(400, 400, 5);
  t1 = new tower(100, 700, "#5520aa");
  t2 = new tower(700, 100, "#aa20aa");
  mm = new miniMap(600, 600, 0.25*(1/3));
  c1 = new camera();
  gameObjs.push(p1);
  for (i=0; i<numEnemies; i++) {
    enemies.push(new enemy(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800), 3));
    gameObjs.push(enemies[i]);
  }

  document.addEventListener('mousemove', function(mouseMoveEvent){
    mousePosition.x = mouseMoveEvent.pageX;
    mousePosition.y = mouseMoveEvent.pageY;
  });

  gameArea.canvas.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    p1.moveTo(e.clientX-c1.getX(), e.clientY-c1.getY());
  });
  gameArea.canvas.addEventListener("click", function(e) {
    e.preventDefault();
    p1.mouseCollide(e.clientX, e.clientY);
    for (i=0; i<numEnemies; i++) {
      enemies[i].mouseCollide(e.clientX, e.clientY);
    }
  });
  document.addEventListener("keydown", function(e) {
    // handle camera
    if (e.key === "a") {
      c1.move(1,0);
    }
    if (e.key === "d") {
      c1.move(-1,0);
    }
    if (e.key === "w") {
      c1.move(0,1);
    }
    if (e.key === "s") {
      c1.move(0,-1);
    }
    if (e.key === "q") {
      p1.attack("q", mousePosition.x, mousePosition.y);
    }
  });
  document.addEventListener("keyup", function(e) {
    // handle camera
    if (e.key === "a") {
      c1.move(-1,0);
    }
    if (e.key === "d") {
      c1.move(1,0);
    }
    if (e.key === "w") {
      c1.move(0,-1);
    }
    if (e.key === "s") {
      c1.move(0,1);
    }
  });
}

function updateGame() {
  gameArea.clear();
  p1.move();
  t1.update(p1);
  t2.update(p1);
  c1.update();
  p1.draw(c1);
  t1.draw(c1);
  t2.draw(c1);
  for (i=0; i<numEnemies; i++) {
    enemies[i].move(p1);
    enemies[i].draw(c1);
  }
  for(i=0; i<projectiles.length; i++) {
    projectiles[i].draw(c1);
    projectiles[i].update();
  }
  mm.draw(gameObjs);
}


startGame();
