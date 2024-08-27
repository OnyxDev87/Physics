//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE
//THIS IS AN EXTRA FILE FOR TESTING, PLEASE IGNORE

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const balls = []
const g = 0.5
const damping = 0.5


class Ball {
  constructor(position, velocity, radius, color, mass, relativeVelocity={u: undefined, v: undefined}, relativePosition = {u: undefined, v: undefined}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.mass = mass;
    this.relativeVelocity = relativeVelocity;
    this.relativePosition = relativePosition;
    balls.push(this)
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();

  }

  update() {
    this.ballCollision()
    this.borderCollision()
    // this.applyGravity();
    this.applyVelocity();
    this.draw() 
  }

  bounce(otherBall) {
    this.relativeVelocity = xy_to_uv(this, otherBall, this.velocity);
    this.relativePosition = xy_to_uv(this, otherBall, this.position);
    console.log("logging uv velocities pre-collision: ");
    console.log(this.relativeVelocity, this.relativePosition);

    this.relativeVelocity.v = ((this.mass - otherBall.mass) * this.velocity + 2 * otherBall.mass * otherBall.velocity) 
/ this.mass + otherBall.mass;

    this.position = uv_to_xy(this, otherBall, this.relativePosition);
    this.velocity = uv_to_xy(this, otherBall, this.relativeVelocity);

    //console.log(this.velocity)

    this.relativePosition = {u: undefined, v: undefined};

    this.relativeVelocity = {u: undefined, v: undefined};


  }

  applyGravity() {
    this.velocity.y += g;
  }

  applyVelocity() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

  borderCollision() {
    if (this.position.y + this.velocity.y + this.radius >= canvas.height || this.position.y + this.velocity.y + this.radius <= 0 || this.position.x + this.velocity.x - this.radius <= 0 || this.position.x + this.velocity.x + this.radius >= canvas.width) {

      //this.bounce();
      //console.log('bounced with border');
      this.velocity.x = 0;
      this.velocity.y = 0;
    }
    return;
  }

  ballCollision() {
    for (let ball of balls) {
      //console.log(balls)
      if (Math.sqrt((this.position.x-ball.position.x)**2+(this.position.y-ball.position.y)**2) <= this.radius+ball.radius && ball != this) {
        console.log('bounce')
        //this.color = "red"
        this.bounce(ball);
      }
    }

  }
}

function xy_to_uv(ball1, ball2, xy) {
  const Rx  = ball2.position.x - ball1.position.x;
  const Ry = ball2.position.y - ball1.position.y;

  const u = xy.x * (Ry/Math.sqrt(Rx**2+Ry**2)) - xy.y * (Rx/Math.sqrt(Rx**2+Ry**2));

  const v = xy.x * (Rx/Math.sqrt(Rx**2+Ry**2)) + xy.y * (Ry/Math.sqrt(Rx**2+Ry**2));
  console.log(v)
  return {u: u, v: v};
}

function uv_to_xy(ball1, ball2, uv) {
  const Rx  = ball2.position.x - ball1.position.x;
  const Ry = ball2.position.y - ball1.position.y;

  const x = uv.u * (Ry/Math.sqrt(Rx**2+Ry**2)) + uv.v * (Rx/Math.sqrt(Rx**2+Ry**2));

  const y = -uv.u * (Rx/Math.sqrt(Rx**2+Ry**2)) + uv.v * (Ry/Math.sqrt(Rx**2+Ry**2));

  return {x: x, y: y};
}

const ball1 = new Ball({x: 100, y: 100}, {x: 0, y: 0}, 50, "blue", 100);

const ball2 = new Ball({x: 150, y: 300}, {x: 0, y: -5}, 30, "green", 100);

function animate() {
  window.requestAnimationFrame(animate)  
  c.fillStyle = '#1e1e1e'
  c.fillRect(0, 0, canvas.width, canvas.height)

  ball1.update()
  ball2.update()
}

animate()
