import { bosses, BULLETBARRIER, BULLETSTORM, CEILING, clearEnemies, COLUMNLORD, DREVIL, enemies, kill, LEFTWALL, RIGHTWALL, RINGHEIGHT, RINGWIDTH, spawn, TRACER, TWIN, goToward, FLOOR, player, CHASER } from "./main";

export class Boss {
    constructor(type, x = -1, y = -1) {
        this.type = type;
        this.toggle = false;
        this.health = 60;
        this.x = x == -1 ? 0 : x;
        this.y = y == -1 ? 0 : y;
        this.targetX = (this.x <= (RINGWIDTH / 2 + LEFTWALL) ? LEFTWALL + 200 : RIGHTWALL - 200);
        this.targetY = CEILING + 200;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.moveTimer = 0;
        this.attackTimer = 450;
        this.currentAttack = Math.floor(Math.random() * 4);;
        if (this.type == BULLETSTORM) {
            this.health = 130;
        }
        if (this.type == DREVIL) {
            this.health = 100;
            this.x = RINGWIDTH / 2 + LEFTWALL;
            this.y = 0;
        }
        if (this.type == TWIN) {
            this.health = 60;
        }
        this.radiateOffset = 0;
        this.radiateBreak = 50;
    }
    show() {
        if (this.type == COLUMNLORD) {
            push();
            rect(LEFTWALL, CEILING, RINGWIDTH, 100 * 1.375);
            fill(255, 50, 50);
            rect(LEFTWALL, CEILING, (RINGWIDTH / 60) * this.health, 100 * 1.375);
            pop();
        }
        if (this.type == BULLETSTORM) {
            if (this.health >= 120) {
                text("Survive!", RINGWIDTH / 2 + LEFTWALL, RINGHEIGHT / 2 + CEILING);
            }
        }
        if (this.type == DREVIL) {
            push();
            fill(255);
            ellipse(this.x, this.y, 150, 150);
            rectMode(CENTER);
            rect(this.x, this.y + 85, 120, 10);
            fill(255, 0, 0);
            rect(this.x, this.y + 85, this.health, 10);
            pop();
        }
        if (this.type == TWIN) {
            push();
            fill(255);
            ellipse(this.x, this.y, 75, 75);
            rectMode(CENTER);
            rect(this.x, this.y + 50, 60, 10);
            fill(255, 0, 0);
            rect(this.x, this.y + 50, this.health, 10);
            pop();
        }
    }

    update() {
        if (this.type == TWIN) {
            if (this.moveTimer <= 0) {
                if (dist(this.x, this.y, this.targetX, this.targetY) >= 20) {
                    let v2 = goToward(this.x, this.y, this.targetX, this.targetY);
                    this.xSpeed = v2.x;
                    this.ySpeed = v2.y;
                } else {
                    let randomDirection = random(0, TWO_PI);
                    this.targetX = constrain(this.x + cos(randomDirection) * 400, LEFTWALL + 100, RIGHTWALL - 100);
                    this.targetY = constrain(this.y + sin(randomDirection) * 400, CEILING + 100, FLOOR - 100);
                    if (bosses.length < 2) {
                        this.moveTimer = 200;
                    } else {
                        this.moveTimer = 100;
                    }
                    // while(this.targetX < LEFTWALL + 75 || this.targetX > RIGHTWALL - 75 || this.targetY < CEILING + 75 || this.targetY > FLOOR - 75){
                    //     randomDirection = random(0, TWO_PI);
                    //     this.targetX = this.x + cos(randomDirection) * 400;
                    //     this.targetY = this.y + sin(randomDirection) * 400;
                    //     console.log("Stuck :(")
                    // }
                }
                this.x += this.xSpeed;
                this.y += this.ySpeed;
            }
            this.moveTimer--;



            if (this.currentAttack == 0 && this.attackTimer % 10 == 0 && this.attackTimer <= 150) {
                this.twinStreamAttack();
            }
            if (this.currentAttack == 1 && this.attackTimer <= 150) {
                this.twinRadiateAttack();
                this.attackTimer = 0;
            }
            if (this.currentAttack == 2 && this.attackTimer <= 150) {
                this.chaserStorm();
                this.attackTimer = 0;
            }
            if (this.currentAttack == 3 && this.attackTimer % 50 == 0 && this.attackTimer <= 150) {
                this.twinShotGun();
            }
            if (this.attackTimer <= 0) {
                this.currentAttack = Math.floor(Math.random() * 4);
                if (bosses.length < 2) {
                    this.attackTimer = 200;
                } else {
                    this.attackTimer = 300;
                }
            }

            this.attackTimer--;
        }


    }

    chaserStorm() {
        push();
        angleMode(DEGREES);
        let amountOfProngs = 6;
        if (bosses.length > 0) {
            if (this.radiateOffset <= this.radiateBreak || this.radiateOffset >= this.radiateBreak + 50) {
                for (let i = 0; i < 360; i += 360 / amountOfProngs) {
                    let targetX = bosses[0].x + (20 * cos(i + (sin(this.radiateOffset) * 50)));
                    let targetY = bosses[0].y + (20 * sin(i + (sin(this.radiateOffset) * 50)));
                    // console.log("TargetX: " + targetX);
                    // console.log("TargetY: " + targetY);
                    spawn(targetX, targetY, CHASER);
                }
            }
        }
        pop();
    }


    twinShotGun() {
        angleMode(RADIANS);
        let angle = atan2(player.y - this.y, player.x - this.x);
        let offsets = [0, 0.2, -0.2];
        offsets.forEach(offset => {
            let targetX = this.x + (800 * cos(angle + offset));
            let targetY = this.y + (800 * sin(angle + offset));
            spawn(this.x, this.y, BULLETBARRIER, targetX, targetY);
        });
    }


    twinRadiateAttack() {
        push();
        angleMode(DEGREES);
        let amountOfProngs = 12
        if (bosses.length > 0) {
            if (this.radiateOffset <= this.radiateBreak || this.radiateOffset >= this.radiateBreak + 50) {
                for (let i = 0; i < 360; i += 360 / amountOfProngs) {
                    let targetX = this.x + (800 * cos(i + (sin(this.radiateOffset) * 50)));
                    let targetY = this.y + (800 * sin(i + (sin(this.radiateOffset) * 50)));

                    spawn(this.x, this.y, BULLETBARRIER, targetX, targetY);
                }
            }
            if (this.radiateOffset >= this.radiateBreak + 50) {
                this.radiateBreak += 100;
            }

            this.radiateOffset += 5;
        }
        pop();
    }

    twinStreamAttack() {
        for (let i = 0; i < 1000; i++) {
            if (i % 10 == 0) {
                let targetX = player.x;
                let targetY = player.y;
                spawn(this.x, this.y, BULLETBARRIER, targetX, targetY);
            }
        }
    }

    attack() {
        if (this.type === COLUMNLORD) {
            this.zigZagAttack();
        }
    }

    barsAttack() {
        if (this.toggle) {
            for (let i = 0; i < 8; i++) {
                let xTarget = (i * 25 * 1.375) + 20 + LEFTWALL;
                spawn(xTarget, 10, BULLETBARRIER, xTarget, 450);
            }
            this.toggle = false;
        } else {
            for (let i = 0; i < 8; i++) {
                let xTarget = (i * 25 * 1.375) + RINGWIDTH / 2 + LEFTWALL;
                spawn(xTarget, 10, BULLETBARRIER, xTarget, 450);
            }
            this.toggle = true;
        }
    }

    columnAttack() {
        let hole = Math.floor(Math.random() * 12);
        for (let j = -3; j < 2; j++) {
            for (let i = 0; i < 12; i++) {
                let xTarget = (i * 45) + 25 + LEFTWALL;
                if (i != hole) {
                    spawn(xTarget, j * 35, BULLETBARRIER, xTarget, 450);
                }
            }
        }
    }

    zigZagAttack() {
        let dist = 75;

        if (this.toggle) {
            for (let i = 0; i < 8; i++) {
                let xTarget = (i * dist) + 75 / 2 + LEFTWALL;
                spawn(xTarget, 10, BULLETBARRIER, xTarget, 450);
            }
            this.toggle = false;

        } else {
            for (let i = 0; i < 8; i++) {
                let xTarget = (i * dist) + LEFTWALL;
                spawn(xTarget, 10, BULLETBARRIER, xTarget, 450);
            }
            this.toggle = true;

        }
    }

    radiateAttack() {
        push();
        angleMode(DEGREES);
        let amountOfProngs = 12
        if (bosses.length > 0) {
            if (this.radiateOffset <= this.radiateBreak || this.radiateOffset >= this.radiateBreak + 50) {
                for (let i = 0; i < 360; i += 360 / amountOfProngs) {
                    let targetX = bosses[0].x + (800 * cos(i + (sin(this.radiateOffset) * 50)));
                    let targetY = bosses[0].y + (800 * sin(i + (sin(this.radiateOffset) * 50)));

                    spawn(bosses[0].x, bosses[0].y, BULLETBARRIER, targetX, targetY);
                }
            }
            if (this.radiateOffset >= this.radiateBreak + 50) {
                this.radiateBreak += 100;
            }

            this.radiateOffset += 5;
        }
        pop();
    }


    theOldCrissCross() {
        clearEnemies();
        let amountOfenemies = 7;
        for (let i = 0; i < amountOfenemies; i++) {
            spawn(0, 0, TRACER, 550, 550);
        }
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].thisPattern = [createVector(RIGHTWALL - 20, (i * 80) + 100), createVector(LEFTWALL - 20, (i * 80) + 100)];
            enemies[i].x = RIGHTWALL - 20;
            enemies[i].y = CEILING - 50;
            enemies[i].killable = false;

        }
        for (let i = 0; i < amountOfenemies; i++) {
            spawn(0, 0, TRACER, 550, 550);
        }
        for (let i = amountOfenemies; i < enemies.length; i++) {
            enemies[i].thisPattern = [createVector(LEFTWALL + 20, ((i - amountOfenemies) * 80) + 120), createVector(RIGHTWALL + 20, ((i - amountOfenemies) * 80) + 120)];
            enemies[i].x = LEFTWALL + 20;
            enemies[i].y = CEILING - 50;
            enemies[i].killable = false;

        }
        for (let i = 0; i < enemies.length; i++) {
            if (dist(LEFTWALL + RINGWIDTH / 2, CEILING + RINGHEIGHT / 2, enemies[i].x, enemies[i].y) >= 800) {
                kill(enemies[i].id);
            }
        }
    }

    bashSlam() {
        let amountOfProngs = 24;
        if (this.toggle) {
            for (let i = 0; i < 360; i += 360 / amountOfProngs) {
                let targetX = bosses[0].x + (800 * cos(i + random(0, 10)));
                let targetY = bosses[0].y + (800 * sin(i + random(0, 10)));

                spawn(LEFTWALL, CEILING, BULLETBARRIER, targetX, targetY);
            }
            this.toggle = false;
        } else {
            for (let i = 0; i < 360; i += 360 / amountOfProngs) {
                let targetX = bosses[0].x + (800 * cos(i + random(0, 10)));
                let targetY = bosses[0].y + (800 * sin(i + random(0, 10)));

                spawn(RIGHTWALL, CEILING, BULLETBARRIER, targetX, targetY);
            }
            this.toggle = true;
        }

    }
}
