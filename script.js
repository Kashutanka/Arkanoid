const arkanoid = document.getElementById('arkanoid');
const ctx = arkanoid.getContext('2d');

const ballRadius = 10;

ctx.fillStyle = '#fe7787';
ctx.font = '16px Arial';

const padlleW = 75, padlleH = 10;

const brickRowCount = 5,
    brickColumnCount = 3,
    brickW = 75,
    brickH = 20,
    brickPadding = 10,
    brickOffset = 30;

let ballX = arkanoid.width / 2,
    ballY = arkanoid.height - 30,
    dx = 2,
    dy = -2;

let paddleX = (arkanoid.width - padlleW) / 2,
    paddleY = arkanoid.height - padlleH;

let score = 0,
    lives = 3;

const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];

    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    };
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
};

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, padlleW, padlleH);
    ctx.fill();
    ctx.closePath();
};

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (r * (brickW + brickPadding)) + brickOffset,
                    brickY = (c * (brickH + brickPadding)) + brickOffset;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickW, brickH);
                ctx.fill();
                ctx.closePath();
            };
        };
    };
};

function drawScore() {
    ctx.fillText('Счёт: ' + score, 8, 20);
};

function drawLives() {
    ctx.fillText('Жизней: ' + lives, arkanoid.width - 85, 20);
};

function detectCollision() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                const isCollisionTrue = (
                    ballX > b.x && ballX < b.x + brickW &&
                    ballY > b.y && ballY < b.y + brickH
                );

                if (isCollisionTrue) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert('Вы победили! Нажмите если хотите сыграть еще раз.');
                        document.location.reload();
                    };
                };
            }
        }
    }
};

function draw() {
    ctx.clearRect(0, 0, arkanoid.width, arkanoid.height);

    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    detectCollision();

    ballX += dx;
    ballY += dy;

    requestAnimationFrame(draw);
};

draw();