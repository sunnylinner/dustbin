var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var divs = __spreadArrays(document.querySelectorAll('div'));
var myElement = /** @class */ (function () {
    function myElement(dom, hasTransitions) {
        if (hasTransitions === void 0) { hasTransitions = false; }
        this.state = {
            hidden: false,
            offsetX: 0,
            offsetY: 0,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0
        };
        this.dom = dom;
        this.hasTransitions = hasTransitions;
        this.updateRect();
    }
    myElement.prototype.updateRect = function () {
        var _a = this, dom = _a.dom, rect = _a.rect, state = _a.state;
        rect = dom.getBoundingClientRect();
        state.offsetX = rect.width / 2;
        state.offsetY = rect.height / 2;
        state.x = rect.left + state.offsetX;
        state.y = rect.top + state.offsetY;
    };
    myElement.prototype.setStateNum = function (key, value) {
        var state = this.state;
        state[key] = typeof value === 'number' ? value : state[key];
    };
    Object.defineProperty(myElement.prototype, "isMyElement", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "hidden", {
        get: function () {
            var state = this.state;
            return state.hidden;
        },
        set: function (h) {
            var _a = this, state = _a.state, dom = _a.dom, hasTransitions = _a.hasTransitions;
            var bh = Boolean(h);
            if (state.hidden === bh)
                return;
            state.hidden = bh;
            if (state.hidden) {
                dom.style.opacity = 0;
                if (hasTransitions) {
                    dom.style.transition = '.2s ease-out';
                    dom.style.transform = 'scale3d(1.1, 1.1, 1)';
                }
            }
            else {
                dom.style.opacity = 1;
                if (hasTransitions) {
                    dom.style.transition = 'none';
                    dom.style.transform = null;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "height", {
        get: function () {
            var rect = this.rect;
            return rect && rect.height || 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "width", {
        get: function () {
            var rect = this.rect;
            return rect && rect.width || 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "x", {
        get: function () {
            return this.state.x;
        },
        set: function (x) {
            this.setStateNum('x', x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "y", {
        get: function () {
            return this.state.y;
        },
        set: function (y) {
            this.setStateNum('y', y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "vx", {
        get: function () {
            return this.state.vx;
        },
        set: function (vx) {
            this.setStateNum('vx', vx);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "vy", {
        get: function () {
            return this.state.vy;
        },
        set: function (vy) {
            this.setStateNum('vy', vy);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "offsetX", {
        get: function () {
            return this.state.offsetX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(myElement.prototype, "offsetY", {
        get: function () {
            return this.state.offsetY;
        },
        enumerable: false,
        configurable: true
    });
    myElement.prototype.copyPosition = function (elem) {
        if (elem.constructor !== myElement)
            return;
        this.state.x = elem.x;
        this.state.y = elem.y;
    };
    myElement.prototype.update = function () {
        var _a = this, state = _a.state, dom = _a.dom;
        state.x += state.vx;
        state.y += state.vy;
        var tx = state.x - state.offsetX;
        var ty = state.y - state.offsetY;
        dom.style.transform = "translate3d(" + tx + "px, " + ty + "px, 0)";
    };
    return myElement;
}());
var TOUCH_EVENTS = new Set(['touchstart', 'touchmove', 'touchend']);
var mouseOrTouch = function (e) {
    var a = TOUCH_EVENTS.has(e.type) && typeof e.touches[0] === 'object'
        ? e.touches[0]
        : e;
    return [a.clientX || 0, a.clinetY || 0];
};
var clamp = function (val, min, max) { return Math.min(Math.max(val, min), max); };
var collide = function (cir, box) {
    var dx = cir.x - clamp(cir.x, box.x - box.offsetX, box.x + box.offsetX);
    var dy = cir.y - clamp(cir.y, box.y - box.offsetY, box.y + box.offsetY);
    return {
        contact: Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(cir.offsetX, 2),
        dx: dx,
        dy: dy
    };
};
var GLOBAL = {
    W: window.innerWidth,
    H: window.innerHeight,
    playerX: window.innerWidth / 2,
    win: false
};
var player = new myElement(divs[3]);
var ball = new myElement(divs[0]);
var trail1 = new myElement(divs[1]);
var trail2 = new myElement(divs[2]);
var blocks = divs.slice(4).map(function (d) { return new myElement(d, true); });
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
    blocks.forEach(function (b) { return b.hidden = false; });
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
    blocks.forEach(function (b) { return b.updateRect(); });
}
function play() {
    requestAnimationFrame(play);
    var W = GLOBAL.W, H = GLOBAL.H, playerX = GLOBAL.playerX, win = GLOBAL.win;
    if (win) {
        player.hidden = true;
        ball.hidden = true;
        trail1.hidden = true;
        trail2.hidden = true;
        document.body.className = 'win';
        return;
    }
    player.x = Math.min(Math.max(playerX, player.offsetX), W - player.offsetX);
    var count = 0;
    blocks.forEach(function (b) {
        if (b.hidden) {
            count += 1;
            if (count === blocks.length) {
                GLOBAL.win = true;
            }
            return;
        }
        var _a = collide(ball, b), contact = _a.contact, dx = _a.dx, dy = _a.dy;
        if (contact) {
            if (Math.abs(dx) < Math.abs(dy)) {
                ball.vy *= -1;
            }
            else {
                ball.vx *= -1;
            }
            b.hidden = true;
        }
    });
    if (ball.x + ball.vx > W - ball.offsetX) {
        ball.vx = -Math.abs(ball.vx);
    }
    else if (ball.x + ball.vx < ball.width / 2) {
        ball.vx = Math.abs(ball.vx);
    }
    if (ball.y + ball.vy < ball.offsetY) {
        ball.vy = Math.abs(ball.vy);
    }
    else if (collide(ball, player).contact) {
        ball.vy = -Math.abs(ball.vy);
        ball.vx = 8 * ((ball.x - player.x) / player.offsetX);
    }
    else if (ball.y + ball.vy > H - ball.offsetY) {
        var lives = Number(document.body.getAttribute('data-lives'));
        lives -= 1;
        if (lives < 0) {
            reset();
        }
        else {
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
