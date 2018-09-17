var canvas = document.getElementById("drawCanvas");
var ctx = canvas.getContext("2d");

var btn = document.getElementById("clearBtn");

var prevX = null;
var prevY = null;

var mouseID = -1;

function getMousePos(canvas) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: window.mouseX - rect.left,
      y: window.mouseY - rect.top
    };
}

function mouseDown(e) {
  e = e || window.event;

  if (mouseID == -1) {
    mouseID = setInterval(function() {
      var pos = getMousePos(canvas);

      if (prevX!==null) {
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      prevX = pos.x;
      prevY = pos.y;
      console.log(pos.x, pos.y);
    }, 10);
  }
}

function mouseUp(e) {
  prevX = null;
  prevY = null;
  if (mouseID != -1) {
    clearInterval(mouseID);
    mouseID = -1;
  }
}

// event handler function
function handler(e) {
    e = e || window.event;
}


document.onmousemove = function(e) {
  var event = e || window.event;
  window.mouseX = event.clientX;
  window.mouseY = event.clientY;
}

btn.onclick = function() {
  prevX = null;
  prevY = null;
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.beginPath();
}

// attach handler to the click event of the document
document.addEventListener('click', handler);

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mouseout", mouseUp);
