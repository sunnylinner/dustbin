const xLength = 10;
const yLength = 10;
const boxesNum = xLength * yLength;
const boxes = [];
const boxesMap = {};
const size = 40;
const gap = 5;
const pos = [];
const speed = 400;
let emptyBoxIndex = boxesNum - 1;
let pIndex = -1;

for (let x = 0; x < boxesNum - 1; x++) {
  const div = document.createElement('div');
  document.querySelector('main').appendChild(div);
  boxes.push(div);
  boxesMap[x] = x;
  pos.push([0, 0]);
}

boxesMap[boxesNum] = null;
pos.push([0, 0]);

const move = (index, pos) => {
  boxes[index].style.transform = `translateX(${
    pos[0] * (size + gap)
  }px) translateY(${
    pos[1] * (size + gap)
  }px)`;
}

let start;
let accumulator = 0;

const walk = (timestamp) => {
  if (start === undefined) start = timestamp;
  accumulator += timestamp - start;
  if (accumulator > speed) {
    accumulator = 0;
    start = timestamp;

    const adjacent = [];

    if (emptyBoxIndex - xLength >  - 1 && emptyBoxIndex - xLength !== pIndex) {
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

    const m = Math.floor(Math.random() * adjacent.length);
    const boxesMapIndexToMove = adjacent[m];

    pIndex = emptyBoxIndex;
    const pTile = boxesMap[boxesMapIndexToMove];
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
}

window.requestAnimationFrame(walk);