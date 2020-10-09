"use strict";

var xLength = 10;
var yLength = 10;
var boxesNum = xLength * yLength;
var boxes = [];
var boxesMap = {};
var size = 40;
var gap = 5;
var pos = [];
var speed = 400;
var emptyBoxIndex = boxesNum - 1;
var pIndex = -1;

for (var x = 0; x < boxesNum - 1; x++) {
  var div = document.createElement('div');
  document.querySelector('main').appendChild(div);
  boxes.push(div);
  boxesMap[x] = x;
  pos.push([0, 0]);
}

boxesMap[boxesNum] = null;
pos.push([0, 0]);

var move = function move(index, pos) {
  boxes[index].style.transform = "translateX(".concat(pos[0] * (size + gap), "px) translateY(").concat(pos[1] * (size + gap), "px)");
};

var start;
var accumulator = 0;

var walk = function walk(timestamp) {
  if (start === undefined) start = timestamp;
  accumulator += timestamp - start;

  if (accumulator > speed) {
    accumulator = 0;
    start = timestamp;
    var adjacent = [];

    if (emptyBoxIndex - xLength > -1 && emptyBoxIndex - xLength !== pIndex) {
      // top
      adjacent.push(emptyBoxIndex - xLength);
    }

    if (emptyBoxIndex + xLength < boxesNum && emptyBoxIndex + xLength !== pIndex) {
      // bottom
      adjacent.push(emptyBoxIndex + xLength);
    }

    if (emptyBoxIndex % xLength !== 0 && emptyBoxIndex - 1 !== pIndex) {
      // Left
      adjacent.push(emptyBoxIndex - 1);
    }

    if (emptyBoxIndex % xLength !== xLength - 1 && emptyBoxIndex + 1 !== pIndex) {
      // right
      adjacent.push(emptyBoxIndex + 1);
    }

    var m = Math.floor(Math.random() * adjacent.length);
    var boxesMapIndexToMove = adjacent[m];
    pIndex = emptyBoxIndex;
    var pTile = boxesMap[boxesMapIndexToMove];
    boxesMap[boxesMapIndexToMove] = boxesMap[emptyBoxIndex];
    boxesMap[emptyBoxIndex] = pTile;

    switch (emptyBoxIndex - boxesMapIndexToMove) {
      case 1:
        pos[boxesMap[emptyBoxIndex]][0] += 1;
        break;

      case xLength:
        pos[boxesMap[emptyBoxIndex]][1] += 1;
        break;

      case -xLength:
        pos[boxesMap[emptyBoxIndex]][1] -= 1;
        break;

      case -1:
        pos[boxesMap[emptyBoxIndex]][0] -= 1;
        break;
    }

    move(boxesMap[emptyBoxIndex], pos[boxesMap[emptyBoxIndex]]);
    emptyBoxIndex = boxesMapIndexToMove;
  }

  window.requestAnimationFrame(walk);
};

window.requestAnimationFrame(walk);