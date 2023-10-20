// class Square
// {
//   constructor(x, y, w, h)
//   {
//     this.x = x;
//     this.y = y;
//     this.w = w;
//     this.h = h;
//   }

//   overlap(pointerX, pointerY)
//   {
//     return pointerX >= this.x && pointerX <= this.x + this.w && pointerY >= this.y && pointerY <= this.y + this.h;
//   }
// }

// const cursor = document.querySelector('#cursor');

// const sq0 = new Square(500, 107, 150, 150);

// const moveCursor = (e)=> {
//   const mouseY = e.clientY - 50;
//   const mouseX = e.clientX - 25;

//   console.log(sq0.overlap(mouseX, mouseY));

//   cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

// }

// const s0 = document.querySelector('#square_0');
// console.log({s0})

// window.addEventListener('mousemove', moveCursor)

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

const state = {
	view: {
		squares: document.querySelectorAll(".square"),
		enemy: document.querySelector(".enemy"),
		timeLeft: document.querySelector("#time-left"),
		score: document.querySelector("#score"),
		live: document.querySelector("#live"),
    modalGo: document.querySelector("#modal_go"),
    scoreGo: document.querySelector(".go-score"),
    timerGo: document.querySelector(".go-timer"),
	},
	values: {
		gameVelocity: 500,
		hitPosition: 0,
    score: 0,
    currentTime: 90,
    lives: 3,
    gameover: false,
	},
  actions: {
		timerId: null,
    countDownTimerId: setInterval(countDown, 1000),
  }
};


function playSound(audioName, background=false)
{
  let audio = new Audio(`./src/sounds/${audioName}.m4a`);
  window.addEventListener('blur', () => audio.pause())
  window.addEventListener('focus', () => audio.play())

  if (background)
  {
    audio.loop = true;
    audio.volume = 0.2;
    audio.play();
  } else 
  {
    audio.play();
  }
  return audio;
}

function resetGame()
{
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  state.values.score = 0;
  state.values.lives = 3;
  state.values.currentTime = 90;
  state.values.hitPosition = 0;
  state.actions.countDownTimerId = setInterval(countDown, 1000);
  state.values.gameover = false;

  startHUD()
  state.view.modalGo.classList.remove("show")
}

function gameOver()
{
  state.view.scoreGo.textContent = `Score: ${state.values.score}`;
  state.view.timerGo.textContent = `Timer ${getTimeFormat(state.values.currentTime)}`;
  state.values.gameover = true;
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  state.view.modalGo.classList.add("show")
}

function getTimeFormat(time)
{ 
  let total = time;
  let minutes = Math.floor(total / 60);
  let seconds = total - minutes * 60;
  return `${minutes.pad(2)}:${seconds.pad(2)}`;
}

function countDown()
{
  state.values.currentTime--;
  state.view.timeLeft.textContent = getTimeFormat(state.values.currentTime);

  if (state.values.currentTime <= 0)
  {
    gameOver();
  }
}

function clearEnemySquare() {
	state.view.squares.forEach((square) => square.classList.remove("enemy"));
}

function randomSquare() {

  if (state.values.gameover) return;

	clearEnemySquare();

	let salt = Math.floor(Math.random() * 9);
	let square = state.view.squares[salt];
	square.classList.add("enemy");

	state.values.hitPosition = square.id;
}

function moveEnemy() {
	state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitBox() {
	state.view.squares.forEach((square) => {
		square.addEventListener("mousedown", (e) => {
			if (square.id === state.values.hitPosition) {
        state.values.score += 10;
        state.view.score.textContent = state.values.score.pad(7);
        state.values.hitPosition = null;

        playSound("hit");
			} else 
      {
        state.values.lives--;
        if (state.values.lives < 0)
        {
          gameOver();
          return;
        }
        state.view.live.textContent = `x${state.values.lives}`;
      }
		});
	});
}

function startHUD()
{
  state.view.live.textContent = `x${state.values.lives}`;
  state.view.score.textContent = state.values.score.pad(7);
}

playSound("background", true);

function start() {
  startHUD();
	moveEnemy();
	addListenerHitBox();
}

start();
