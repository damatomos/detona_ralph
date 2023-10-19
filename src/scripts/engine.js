class Square
{
  constructor(x, y, w, h)
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  overlap(pointerX, pointerY)
  {
    return pointerX >= this.x && pointerX <= this.x + this.w && pointerY >= this.y && pointerY <= this.y + this.h;
  }
}

const cursor = document.querySelector('#cursor');

const sq0 = new Square(500, 107, 150, 150);

const moveCursor = (e)=> {
  const mouseY = e.clientY - 50;
  const mouseX = e.clientX - 25;

  console.log(sq0.overlap(mouseX, mouseY));
   
  cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
 
}

const s0 = document.querySelector('#square_0');
console.log({s0})

window.addEventListener('mousemove', moveCursor)
