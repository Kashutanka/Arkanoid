const arkanoid = document.getElementById('arkanoid');
const ctx = arkanoid.getContext('2d');
const gameOver = document.getElementById('gameOver');
const gameWin = document.getElementById('gameWin');

const ballRadius = 10;

ctx.fillStyle = '#a8c9ed';
ctx.font = '16px Arial';

const paddleW = 75, paddleH = 10;

const brickRowCount = 5,
    brickColumnCount = 3,
    brickW = 75,
    brickH = 20,
    brickPadding = 10,
    brickOffset = 30;

let ballX = arkanoid.width / 2,
    ballY = arkanoid.height - 30,
    dx = 4,
    dy = -4;

let paddleX = (arkanoid.width - paddleW) / 2,
    paddleY = arkanoid.height - paddleH;

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

let animationId;

function draw() {
    ctx.clearRect(0, 0, arkanoid.width, arkanoid.height);

    //Score
    ctx.fillText('Счёт: ' + score, 8, 20);

    //Lives
    ctx.fillText('Жизней: ' + lives, arkanoid.width - 85, 20);

    //Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    //Padlle
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleW, paddleH);
    ctx.fill();
    ctx.closePath();

    //Bricks
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

    //Ball hit the brick
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                const isCollisionTrue = ballX > b.x && ballX < b.x + brickW &&
                    ballY > b.y && ballY < b.y + brickH;

                if (isCollisionTrue) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        gameWin.style.display = 'block';
                        cancelAnimationFrame(animationId);
                        return
                    };
                };
            }
        }
    }

    document.addEventListener('mousemove', (e) => {
        const relativeX = e.clientX - arkanoid.offsetLeft;
        if (relativeX > 0 && relativeX < arkanoid.width) {
            paddleX = relativeX - paddleW / 2;
        }
    });

    if (ballX + dx < ballRadius || ballX + dx > arkanoid.width - ballRadius) {
        dx = -dx;
    };
    if (ballY + dy < ballRadius) {
        dy = -dy;
    };
    if (ballY + dy > arkanoid.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleW) {
            dy = -dy;
        } else {
            lives--
            if (lives === 0) {
                gameOver.style.display = 'block';
                cancelAnimationFrame(animationId);
                return
            } else {
                ballX = arkanoid.width / 2;
                ballY = arkanoid.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (arkanoid.width - paddleW) / 2;
            }
        }
    };

    //Ball moving
    ballX += dx;
    ballY += dy;

    animationId = requestAnimationFrame(draw);
};

const handleKeydown = (event) => {
    if (event.code === 'Space') {
        draw();
    }
};

document.addEventListener('keydown', handleKeydown);
