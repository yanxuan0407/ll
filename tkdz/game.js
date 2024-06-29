const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('mainMenu');
const gameOverMenu = document.getElementById('gameOverMenu');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tankWidth = 40;
const tankHeight = 40;
const bulletWidth = 5;
const bulletHeight = 10;
const tankSpeed = 5; // Increased speed
const bulletSpeed = 8; // Increased speed
const bombRadius = 100;

let gameOver = false;
let isSinglePlayer = true;

class Tank {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = tankWidth;
        this.height = tankHeight;
        this.color = color;
        this.direction = 'up';
        this.bullets = [];
        this.isAlive = true;
        this.changeDirectionCounter = 0;
        this.controls = controls; // controls: { up, down, left, right, shoot, bomb }
        this.shootCooldown = 0; // 用于控制射速
    }

    draw() {
        if (!this.isAlive) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'black';
        switch (this.direction) {
            case 'up':
                ctx.fillRect(this.x + this.width / 2 - 2.5, this.y - 10, 5, 10);
                break;
            case 'down':
                ctx.fillRect(this.x + this.width / 2 - 2.5, this.y + this.height, 5, 10);
                break;
            case 'left':
                ctx.fillRect(this.x - 10, this.y + this.height / 2 - 2.5, 10, 5);
                break;
            case 'right':
                ctx.fillRect(this.x + this.width, this.y + this.height / 2 - 2.5, 10, 5);
                break;
        }

        this.bullets.forEach(bullet => bullet.draw());
    }

    move(direction) {
        if (!this.isAlive) return;
        this.direction = direction;
        let oldX = this.x;
        let oldY = this.y;
        switch (direction) {
            case 'up':
                this.y -= tankSpeed;
                break;
            case 'down':
                this.y += tankSpeed;
                break;
            case 'left':
                this.x -= tankSpeed;
                break;
            case 'right':
                this.x += tankSpeed;
                break;
        }
        if (this.checkCollisionWithObstacles() || this.checkCollisionWithTanks()) {
            this.x = oldX;
            this.y = oldY;
        }
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }

    shoot() {
        if (!this.isAlive || this.shootCooldown > 0) return;
        const bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, this.direction, this.color);
        this.bullets.push(bullet);
        this.shootCooldown = 30; // 射速控制，30帧冷却时间
    }

    updateBullets() {
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.isOffScreen() || bullet.checkCollisionWithObstacles()) {
                this.bullets.splice(index, 1);
            }
        });
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }

    checkCollisionWithObstacles() {
        return obstacles.some(obstacle => {
            return this.x < obstacle.x + obstacle.width &&
                   this.x + this.width > obstacle.x &&
                   this.y < obstacle.y + obstacle.height &&
                   this.y + this.height > obstacle.y;
        });
    }

    checkCollisionWithTanks() {
        let tanks = [playerTank];
        if (secondPlayerTank) tanks.push(secondPlayerTank);
        tanks = tanks.concat(enemyTanks);
        return tanks.some(tank => {
            if (tank === this || !tank.isAlive) return false;
            return this.x < tank.x + tank.width &&
                   this.x + this.width > tank.x &&
                   this.y < tank.y + tank.height &&
                   this.y + this.height > tank.y;
        });
    }

    avoidBullets(bullets) {
        bullets.forEach(bullet => {
            if (bullet.color !== this.color && this.isCloseTo(bullet)) {
                const directions = ['up', 'down', 'left', 'right'];
                const oppositeDirection = {
                    'up': 'down',
                    'down': 'up',
                    'left': 'right',
                    'right': 'left'
                };
                this.move(oppositeDirection[bullet.direction]);
            }
        });
    }

    isCloseTo(bullet) {
        const distance = Math.sqrt(Math.pow(bullet.x - this.x, 2) + Math.pow(bullet.y - this.y, 2));
        return distance < 100;
    }

    randomMove() {
        if (this.changeDirectionCounter <= 0) {
            const directions = ['up', 'down', 'left', 'right'];
            this.move(directions[Math.floor(Math.random() * directions.length)]);
            this.changeDirectionCounter = 15; // 改变方向的帧数减少
        }
        this.changeDirectionCounter--;
    }
}

class Bullet {
    constructor(x, y, direction, color) {
        this.x = x;
        this.y = y;
        this.width = bulletWidth;
        this.height = bulletHeight;
        this.direction = direction;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        switch (this.direction) {
            case 'up':
                this.y -= bulletSpeed;
                break;
            case 'down':
                this.y += bulletSpeed;
                break;
            case 'left':
                this.x -= bulletSpeed;
                break;
            case 'right':
                this.x += bulletSpeed;
                break;
        }
    }

    isOffScreen() {
        return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
    }

    hits(tank) {
        return this.color !== tank.color && // Players can't hit each other
               this.x < tank.x + tank.width &&
               this.x + this.width > tank.x &&
               this.y < tank.y + tank.height &&
               this.y + this.height > tank.y;
    }

    checkCollisionWithObstacles() {
        return obstacles.some(obstacle => {
            return this.x < obstacle.x + obstacle.width &&
                   this.x + this.width > obstacle.x &&
                   this.y < obstacle.y + obstacle.height &&
                   this.y + this.height > obstacle.y;
        });
    }
}

class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'grey';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = bombRadius;
        this.exploded = false;
        this.explodeTime = Date.now() + 5000; // Explode after 5 seconds
    }

    draw() {
        if (!this.exploded) {
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    explode() {
        if (!this.exploded && Date.now() > this.explodeTime) {
            this.exploded = true;
            enemyTanks.forEach(enemy => {
                const distance = Math.sqrt(Math.pow(enemy.x + enemy.width / 2 - this.x, 2) + Math.pow(enemy.y + enemy.height / 2 - this.y, 2));
                if (distance < this.radius) {
                    enemy.isAlive = false;
                }
            });
            // 显示炸弹爆炸伤害
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

let playerTank;
let secondPlayerTank;
let enemyTanks = [];
let obstacles = [];
const bombs = [];
const keys = {};

// Define controls for player tanks
const player1Controls = {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
    shoot: 'j',
    bomb: 'k'
};

const player2Controls = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    shoot: '1',
    bomb: '2'
};

function startSinglePlayer() {
    mainMenu.style.display = 'none';
    gameOverMenu.style.display = 'none';
    canvas.style.display = 'block';
    isSinglePlayer = true;
    resetGame();
    playerTank = new Tank(canvas.width / 2, canvas.height / 2, 'blue', player1Controls);
    spawnEnemies();
    spawnObstacles();
    gameLoop();
}

function startMultiPlayer() {
    mainMenu.style.display = 'none';
    gameOverMenu.style.display = 'none';
    canvas.style.display = 'block';
    isSinglePlayer = false;
    resetGame();
    playerTank = new Tank(canvas.width / 2 - 50, canvas.height / 2, 'blue', player1Controls);
    secondPlayerTank = new Tank(canvas.width / 2 + 50, canvas.height / 2, 'green', player2Controls);
    spawnEnemies();
    spawnObstacles();
    gameLoop();
}

function resetGame() {
    playerTank = null;
    secondPlayerTank = null;
    enemyTanks = [];
    obstacles.length = 0;
    bombs.length = 0;
    gameOver = false;
}

function spawnEnemies() {
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * (canvas.width - tankWidth);
        const y = Math.random() * (canvas.height - tankHeight);
        const enemy = new Tank(x, y, 'red', null);
        enemyTanks.push(enemy);
    }
}

function spawnObstacles() {
    const obstacleCount = Math.floor((canvas.width * canvas.height) / 50000); // 根据窗口大小调整障碍物数量
    for (let i = 0; i < obstacleCount; i++) {
        const width = Math.random() * 50 + 20; // Random width between 20 and 70
        const height = Math.random() * 50 + 20; // Random height between 20 and 70
        const x = Math.random() * (canvas.width - width);
        const y = Math.random() * (canvas.height - height);
        const obstacle = new Obstacle(x, y, width, height);
        obstacles.push(obstacle);
    }
}

function checkCollision() {
    playerTank.bullets.forEach(bullet => {
        enemyTanks.forEach(enemy => {
            if (bullet.hits(enemy)) {
                enemy.isAlive = false;
            }
        });
    });
    enemyTanks.forEach(enemy => {
        enemy.bullets.forEach(bullet => {
            if (bullet.hits(playerTank)) {
                playerTank.isAlive = false;
            }
            if (secondPlayerTank && bullet.hits(secondPlayerTank)) {
                secondPlayerTank.isAlive = false;
            }
        });
    });

    if (secondPlayerTank) {
        secondPlayerTank.bullets.forEach(bullet => {
            enemyTanks.forEach(enemy => {
                if (bullet.hits(enemy)) {
                    enemy.isAlive = false;
                }
            });
        });
    }
}

function placeBomb(tank) {
    const bombX = tank.x + tank.width / 2;
    const bombY = tank.y + tank.height / 2;
    const bomb = new Bomb(bombX, bombY);
    bombs.push(bomb);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px sans-serif';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        gameOverMenu.style.display = 'flex';
        canvas.style.display = 'none';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys[player1Controls.up]) playerTank.move('up');
    if (keys[player1Controls.down]) playerTank.move('down');
    if (keys[player1Controls.left]) playerTank.move('left');
    if (keys[player1Controls.right]) playerTank.move('right');
    if (keys[player1Controls.shoot]) playerTank.shoot();
    if (keys[player1Controls.bomb]) {
        placeBomb(playerTank);
        keys[player1Controls.bomb] = false; // Prevent continuous bomb placement
    }

    if (secondPlayerTank) {
        if (keys[player2Controls.up]) secondPlayerTank.move('up');
        if (keys[player2Controls.down]) secondPlayerTank.move('down');
        if (keys[player2Controls.left]) secondPlayerTank.move('left');
        if (keys[player2Controls.right]) secondPlayerTank.move('right');
        if (keys[player2Controls.shoot]) secondPlayerTank.shoot();
        if (keys[player2Controls.bomb]) {
            placeBomb(secondPlayerTank);
            keys[player2Controls.bomb] = false; // Prevent continuous bomb placement
        }
    }

    playerTank.updateBullets();
    if (secondPlayerTank) {
        secondPlayerTank.updateBullets();
    }

    enemyTanks.forEach(enemy => {
        if (Math.random() < 0.02) {
            enemy.shoot();
        }
        enemy.updateBullets();
        enemy.avoidBullets(playerTank.bullets.concat(secondPlayerTank ? secondPlayerTank.bullets : [], enemyTanks.flatMap(e => e.bullets)));
        enemy.randomMove();
    });

    obstacles.forEach(obstacle => obstacle.draw());

    bombs.forEach(bomb => {
        bomb.draw();
        bomb.explode();
    });

    playerTank.draw();
    if (secondPlayerTank) {
        secondPlayerTank.draw();
    }
    enemyTanks.forEach(enemy => enemy.draw());

    checkCollision();

    enemyTanks = enemyTanks.filter(enemy => enemy.isAlive);

    if (!playerTank.isAlive || (secondPlayerTank && !secondPlayerTank.isAlive) || enemyTanks.length === 0) {
        gameOver = true;
    }

    requestAnimationFrame(gameLoop);
}

function restartGame() {
    gameOverMenu.style.display = 'none';
    canvas.style.display = 'block';
    if (isSinglePlayer) {
        startSinglePlayer();
    } else {
        startMultiPlayer();
    }
}

function goToMainMenu() {
    gameOverMenu.style.display = 'none';
    mainMenu.style.display = 'flex';
    canvas.style.display = 'none';
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'r') restartGame(); // 按 "r" 键重新开始游戏
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Initialize with main menu
mainMenu.style.display = 'flex';
canvas.style.display = 'none';
gameOverMenu.style.display = 'none';
