const divs = [...document.querySelectorAll('div')];

class myElement {
  dom;
  hasTransitions;
  rect;
  state = {
    hidden: false,
    offsetX: 0,
    offsetY: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  }

  constructor(dom, hasTransitions = false) {
    this.dom = dom;
    this.hasTransitions = hasTransitions;
    this.updateRect();
  }

  updateRect() {
    let {dom , rect, state} = this;
    rect = dom.getBoundingClientRect();
    state.offsetX = rect.width / 2;
    state.offsetY = rect.height / 2;
    state.x = rect.left + state.offsetX;
    state.y = rect.top + state.offsetY;
  }

  setStateNum(key, value: Number) {
    let { state } = this;
    state[key] = typeof value === 'number' ? value : state[key];
  }

  get isMyElement() {
    return true;
  }

  get hidden() {
    let { state } = this;
    return state.hidden;
  }

  set hidden(h: Boolean) {
    let { state, dom, hasTransitions } = this;
    const bh = Boolean(h);
    if (state.hidden === bh)
      return;

    state.hidden = bh;
    if (state.hidden) {
      dom.style.opacity = 0;
      if (hasTransitions) {
        dom.style.transition = '.2s ease-out';
        dom.style.transform = 'scale3d(1.1, 1.1, 1)';
      }
    } else {
      dom.style.opacity = 1;
      if (hasTransitions) {
        dom.style.transition = 'none';
        dom.style.transform = null;
      }
    }
  }

  get height() {
    let { rect } = this;
    return rect && rect.height || 0;
  }

  get width() {
    let { rect } = this;
    return rect && rect.width || 0; 
  }

  get x() {
    return this.state.x;
  }

  set x(x) {
    this.setStateNum('x', x);
  }

  get y() {
    return this.state.y;
  }

  set y(y) {
    this.setStateNum('y', y);
  }

  get vx() {
    return this.state.vx;
  }

  set vx(vx) {
    this.setStateNum('vx', vx);
  }

  get vy() {
    return this.state.vy;
  }

  set vy(vy) {
    this.setStateNum('vy', vy);
  }

  get offsetX() {
    return this.state.offsetX;
  }

  get offsetY() {
    return this.state.offsetY;
  }
  copyPosition(elem) {
    if (elem.constructor !== myElement) return;
    this.state.x = elem.x;
    this.state.y = elem.y;
  }
  update() {
    let { state, dom } = this;
    state.x += state.vx;
    state.y += state.vy;

    const tx = state.x - state.offsetX;
    const ty = state.y - state.offsetY;
    dom.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  }
}

const TOUCH_EVENTS = new Set(['touchstart', 'touchmove', 'touchend']);
const mouseOrTouch = e => {
  const a = TOUCH_EVENTS.has(e.type) && typeof e.touches[0] === 'object'
  ? e.touches[0]
  : e;

  return [a.clientX || 0, a.clinetY || 0];
}

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const collide = (cir, box) => {
  const dx = cir.x - clamp(cir.x, box.x - box.offsetX, box.x + box.offsetX);
  const dy = cir.y - clamp(cir.y, box.y - box.offsetY, box.y + box.offsetY);

  return {
    contact: dx**2 + dy**2 < cir.offsetX**2,
    dx,
    dy,
  };
}

const GLOBAL = {
  W: window.innerWidth,
  H: window.innerHeight,
  playerX: window.innerWidth / 2,
  win: false,
}

const player = new myElement(divs[3]);
const ball = new myElement(divs[0]);
const trail1 = new myElement(divs[1]);
const trail2 = new myElement(divs[2]);
const blocks = divs.slice(4).map(d => new myElement(d, true));

player.y = GLOBAL.H - 16;

function resetBall() {
  ball.y = trail1.y = trail2.y = GLOBAL.H - 32;
  ball.x = trail1.x = trail2.x = .5 * GLOBAL.W;
  ball.vx = 3;
  ball.vy = -3;
}

function reset() {
  GLOBAL.win = false;
  document.body.className = '';
  document.body.setAttribute('data-lives', '2');

  resetBall();
  player.hidden = false;
  ball.hidden = false;
  trail1.hidden = false;
  trail2.hidden = false;
  blocks.forEach(b => b.hidden = false);
}

reset();

function handleMove(e) {
  GLOBAL.playerX = mouseOrTouch(e)[0];
}
window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove);

function handleResize() {
  GLOBAL.W = window.innerWidth;
  GLOBAL.H = window.innerHeight;
  player.y = GLOBAL.H - 16;
  blocks.forEach(b => b.updateRect());
}

function play() {
  requestAnimationFrame(play);
  const { W, H, playerX, win } = GLOBAL;

  if (win) {
    player.hidden = true;
    ball.hidden = true;
    trail1.hidden = true;
    trail2.hidden = true;
    document.body.className = 'win';
    
    return;
  }

  player.x = Math.min(Math.max(playerX, player.offsetX), W - player.offsetX);

  let count = 0;
  blocks.forEach(b => {
    if (b.hidden) {
      count += 1;
      if (count === blocks.length) {
        GLOBAL.win = true;
      }
      return;
    }
    const { contact, dx, dy } = collide(ball, b);
    if (contact) {
      if (Math.abs(dx) < Math.abs(dy)) {
        ball.vy *= -1;
      } else {
        ball.vx *= -1;
      }
      b.hidden = true;
    }
  })

  if (ball.x + ball.vx > W - ball.offsetX) {
    ball.vx = -Math.abs(ball.vx);
  } else if (ball.x + ball.vx < ball.width / 2) {
    ball.vx = Math.abs(ball.vx);
  }

  if (ball.y + ball.vy < ball.offsetY) {
    ball.vy = Math.abs(ball.vy);
  } else if (collide(ball, player).contact) {
    ball.vy = -Math.abs(ball.vy);
    ball.vx = 8 * ((ball.x - player.x) / player.offsetX);
  } else if (ball.y + ball.vy > H - ball.offsetY) {
    let lives = Number(document.body.getAttribute('data-lives'));
    lives -= 1;
    if (lives < 0) {
      reset();
    } else {
      resetBall();
      document.body.setAttribute('data-lives', String(lives));
    }
  }

  trail2.copyPosition(trail1);
  trail1.copyPosition(ball);

  player.update();
  ball.update();
  trail1.update();
  trail2.update();
}

play();