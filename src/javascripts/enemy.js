import { slimeWalks, spikeBalls, allRobots, BULLET, BULLETBARRIER, CEILING, CHASER, DREVILSTAGE, equilateral, FROG, goToward, heldPowerups, kill, LEFTWALL, MOLASSES, player, RINGHEIGHT, RINGWIDTH, scene, stage, STANDER, SURVIVE, TRACER, CRASHZONE } from "./main";

export class Enemy {
    constructor(x, y, i, type, targetX = -1, targetY = -1) {
        this.x = x;
        this.y = y;
        this.id = i;
        this.dx = 0;
        this.dy = 0;
        this.w = type !== CRASHZONE ? 20 * 1.375 : 95*2;

        this.type = type;
        this.targetX = targetX;
        this.targetY = targetY;
        this.killable = false;
        this.patternDelta = 1;
        this.crashTimer = 300;
        this.animationTimer = 0;
        let nextX;
        let nextY;
        this.xPattern = [createVector(30, 30), createVector(370, 370), createVector(30, 370), createVector(370, 30)];
        this.spiralPattern = [
            createVector(30, 370),
            createVector(30, 30),
            createVector(370, 30),
            createVector(370, 370),
            createVector(80, 370),
            createVector(80, 80),
            createVector(320, 80),
            createVector(320, 320),
            createVector(130, 320),
            createVector(130, 130),
            createVector(270, 130),
            createVector(270, 270),
            createVector(180, 270),
            createVector(180, 180),
            createVector(220, 180),
            createVector(220, 220),
        ];
        this.sweepPattern = [];
        this.rotatedSweepPattern = [];
        nextX = 30;
        nextY = 370;
        for (let i = 0; i < 24; i++) {
            this.sweepPattern.push(createVector(nextX, nextY));
            if (i % 2 != 0) {
                nextX += 30;
            }
            if (i % 2 == 0) {
                if (nextY == 370) {
                    nextY = 30;
                } else {
                    nextY = 370;
                }
            }
        }
        nextX = 30;
        nextY = 30;
        for (let i = 0; i < 24; i++) {
            this.rotatedSweepPattern.push(createVector(nextX, nextY));
            if (i % 2 != 0) {
                nextY += 30;
            }
            if (i % 2 == 0) {
                if (nextX == 370) {
                    nextX = 30;
                } else {
                    nextX = 370;
                }
            }
        }
        this.allPatterns = [this.xPattern, this.sweepPattern, this.rotatedSweepPattern, this.spiralPattern];
        for(let i = 0; i < this.allPatterns.length; i++){
			for(let j = 0; j < this.allPatterns[i].length; j++){
				this.allPatterns[i][j].x *= 1.375;
				this.allPatterns[i][j].y *= 1.375;
				this.allPatterns[i][j].x += LEFTWALL;
				this.allPatterns[i][j].y += CEILING;
			}
		}
        this.thisPatternIndex = Math.floor(Math.random() * this.allPatterns.length);
        this.thisPattern = this.allPatterns[this.thisPatternIndex];
        this.currentPatternSpot = 0;
        this.randomRobot = allRobots[Math.floor(Math.random() * allRobots.length)];

		// frog
		this.jumpTimer = 0;
		this.jumpCooldown = 100;
		this.jumpDistance = 80;
		this.isJumping = false;
		this.jumpTowardPlayer = true; // alternate random/direct hops
		this.facingAngle = 0;

        if (this.type == BULLET) {
            this.speed = 2.5;
            this.moveTowardBullet(this.targetX, this.targetY);
        }
        if (this.type == CHASER) {
            this.speed = 1.25;
            this.killable = true;
        }

        if (this.type == BULLETBARRIER) {
            this.speed = 2.5;
            this.moveTowardBullet(this.targetX, this.targetY);
        }

        if (this.type == TRACER) {
            this.speed = 3;
            this.killable = true;
            if (this.thisPatternIndex == 0) {
                this.x = -10;
                this.y = -10;
            } else if (this.thisPatternIndex == 1) {
                this.x = -10;
                this.y = 410;
            } else if (this.thisPatternIndex == 3) {
                this.x = -10;
                this.y = -10;
            } else {
                this.x = -10;
                this.y = 410;
            }
        }

		if (this.type == FROG) {
			this.speed = 3;
			this.killable = true;
		}

        this.sticky = false;
        for (let i = 0; i < heldPowerups.length; i++) {
            if (heldPowerups[i].type == MOLASSES) {
                // this.speed *= 0.8;
            }
        }
    }
    show() {
        if (this.type == CHASER) {
            if(this.animationTimer === 0){
                this.animationTimer = 100;
            }
            push();
            imageMode(CENTER);
            // Check if player is to the left or right
            if (player.x < this.x) {
                image(slimeWalks[(this.animationTimer) % 40 >= 20 ? 0 : 1], this.x, this.y, this.w + 10, this.w);
            } else {
                translate(this.x, this.y);
                scale(-1, 1); // Flip horizontally
                image(slimeWalks[(this.animationTimer) % 40 >= 20 ? 0 : 1], 0, 0, this.w + 10, this.w);
            }
            pop();
            this.animationTimer -= 1;
        }
        if(this.type === STANDER){
            if(this.animationTimer === 0){
                this.animationTimer = 100;
            }
            push();
            imageMode(CENTER);
            image(slimeWalks[(this.animationTimer) % 40 >= 20 ? 0 : 1], this.x, this.y, this.w + 10, this.w);
            pop();
            this.animationTimer -= 1;
        }
        if(this.type == TRACER){
            push();
            // Calculate direction to next pattern spot
            let target = this.thisPattern[this.currentPatternSpot];
            let angle = atan2(target.y - this.y, target.x - this.x);

            // Move origin to enemy position and rotate
            translate(this.x, this.y);
            rotate(angle);

            // Draw image centered
            imageMode(CENTER);
            image(this.randomRobot, 0, 0, this.w, this.w);

            pop();
        }
        if (this.type == BULLET || this.type == BULLETBARRIER) {
            if(this.animationTimer === 0){
                this.animationTimer = 100;
            }
            push();
            imageMode(CENTER);
            image(spikeBalls[(this.animationTimer) % 10 >= 5? 0 : 1], this.x, this.y, this.w + 10, this.w + 10);
            pop();
            this.animationTimer -= 1;
        }
		if (this.type == FROG) {
			push();
			let theta;
			if (this.isJumping) {
				theta = atan2(this.targetY - this.y, this.targetX - this.x);
			} else {
				theta = atan2(player.y - this.y, player.x - this.x);
			}
			push();
			stroke(230, 100, 100);
			strokeWeight(5);
			line(this.x, this.y, this.x + this.w * cos(theta), this.y + this.w * sin(theta));
			pop();
			fill(200, 230, 200);
			equilateral(this.x, this.y, theta, this.w * 0.875);

			pop();
		}

        if(this.type === CRASHZONE){
            push();
            let opacity = (this.crashTimer) % 25 <= 25/2 ? 180 : 80;
            if(this.crashTimer < 50){
                opacity = 80;
            }
            if(this.crashTimer < 5){
                opacity = 180;
            }
            // console.log(this.crashTimer);
            noStroke();
            fill(220, 110, 110, opacity);
            ellipse(this.x,this.y,200,200);
            pop();
        }
    }
    check(x, y) {
        switch (this.type) {
            case BULLET:
                if (dist(this.x, this.y, LEFTWALL + (RINGWIDTH / 2), CEILING + (RINGHEIGHT / 2)) >= 1000) {
                    kill(this.id);
                }
                return false;
            case BULLETBARRIER:
                if (dist(this.x, this.y, LEFTWALL + (RINGWIDTH / 2), CEILING + (RINGHEIGHT / 2)) >= 700) {
                    kill(this.id);
                }
                return false;
            case CRASHZONE:
                if(this.crashTimer <= 0){
                    kill(this.id);
                }
                return false;
            default:
                if (dist(this.x, this.y, x, y) < 20 * 1.375 && this.killable) {
                    kill(this.id);
                    return true;
                }
                for(let i = 0; i < heldPowerups.length; i++){
                    if(heldPowerups[i].type == MOLASSES && stage != DREVILSTAGE){
                        if (!this.sticky && dist(this.x, this.y, x, y) < 20 * 1.375 * 3) {
                            this.speed *= 0.6;
							this.jumpDistance *= 0.5;
                            this.sticky = true;
                        }
                        break;
                    }
                }
                if (dist(this.x, this.y, LEFTWALL + (RINGWIDTH / 2), CEILING + (RINGHEIGHT / 2)) >= 700) {
                    kill(this.id);
                }
                return false;
        }
    }
    /**
     * 
     * @param {number} x - x coordinate of player
     * @param {number} y - y coordinate of player
     */
    update(x, y) {
        if (this.type == CHASER) {
            this.moveToward(x, y);
        }
        if (this.type == BULLET || this.type == BULLETBARRIER) {
            this.x -= this.dx;
            this.y -= this.dy;
        }
        if (this.type == TRACER) {
            // console.log(this.xPattern[this.currentPatternSpot].x, this.xPattern[this.currentPatternSpot].y);
            // console.log(this.currentPatternSpot);
            if (
                dist(
                    this.x,
                    this.y,
                    this.thisPattern[this.currentPatternSpot].x,
                    this.thisPattern[this.currentPatternSpot].y
                ) <= 5
            ) {
                this.currentPatternSpot += this.patternDelta;
                if (
                    this.currentPatternSpot > this.thisPattern.length - 1 ||
                    this.currentPatternSpot < 0
                ) {
                    this.patternDelta *= -1;
                    this.currentPatternSpot += this.patternDelta;
                }
            }
            this.moveToward(
                this.thisPattern[this.currentPatternSpot].x,
                this.thisPattern[this.currentPatternSpot].y
            );
        }
		if (this.type == FROG) {
			this.jumpTimer = max(this.jumpTimer - 1, 0);
			if (this.jumpTimer == 0) {
				this.jumpTimer = this.jumpCooldown;

				this.jumpTowardPlayer = !this.jumpTowardPlayer;
				const v2 = goToward(this.x, this.y, x, y);
				if (!this.jumpTowardPlayer) {
					v2.rotate(QUARTER_PI * random() > 0.5 ? -1 : 1);
				}
				this.targetX = this.x + v2.x * this.jumpDistance;
				this.targetY = this.y + v2.y * this.jumpDistance;
			}
			if (dist(this.x, this.y, this.targetX, this.targetY) >= this.speed) {
				this.isJumping = true;
				this.moveToward(
					this.targetX,
					this.targetY,
				);
			} else {
				this.isJumping = false;
			}
		}
        if(this.type === CRASHZONE){
            if(this.crashTimer > 0){    
                this.crashTimer -= 1;
            }
        }
    }

    moveToward(x, y) {
        if (scene == SURVIVE) {
            let v2 = goToward(x, y, this.x, this.y);
            this.x -= v2.x * this.speed;
            this.y -= v2.y * this.speed;
        }
    }

    moveTowardBullet(x, y) {
        let v2 = goToward(x, y, this.x, this.y);
        this.dx = v2.x * this.speed;
        this.dy = v2.y * this.speed;
    }
}
