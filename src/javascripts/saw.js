import p5 from "p5";
import { bosses, CEILING, COLUMNLORD, COLUMNSTAGE, DREVILSTAGE, FLOOR, goToward, heldPowerups, LEFTWALL, LIGHTNING, MOLASSES, player, RIGHTWALL, stage, TBOUNCE, TWIN, TWINSTAGE, gleeby, gleebySprites } from "./main";

export class Saw {
	constructor(x, y, isBlaster = false, ttl = -1) {
		this.x = x;
		this.y = y;
		this.w = 20 * 2;
		this.xSpeed = 4.5;
		this.ySpeed = 4.5;
		this.going = false;
		this.gotFar = false;
		this.return = false;
		this.isBlaster = isBlaster;
		this.ttl = ttl;
		this.hitOne = false;
		this.hitCount = 0;
		this.defaultSpeed = 13;
		this.animationTimer = 0;
		this.animationIndex = 0;
		this.animationDirection = 1;
	}
	update() {
		let hit = false;
		if (this.ttl > 0) {
			this.ttl--;
		}
		if (this.x >= RIGHTWALL - this.w / 2) {
			this.xSpeed *= -1;
			this.x = RIGHTWALL - this.w / 2;
			hit = true;
		}
		if (this.x <= LEFTWALL + this.w / 2) {
			this.xSpeed *= -1;
			this.x = LEFTWALL + this.w / 2;
			hit = true;
		}
		if (this.y >= FLOOR - this.w / 2) {
			this.ySpeed *= -1;
			this.y = FLOOR - this.w / 2;
			hit = true;
		}
		if (stage == COLUMNSTAGE) {
			if (this.y <= (100 * 1.375) + this.w * 1.5 && player.hasSaw == false) {
				this.ySpeed *= -1;
				this.y = (100 * 1.375) + this.w * 1.5;
				hit = true;
				if (bosses.length >= 1) {
					if (bosses[0].type == COLUMNLORD) {
						bosses[0].health -= 2;
					}
				}
			}
		} else {
			if (this.y <= CEILING + this.w / 2) {
				this.ySpeed *= -1;
				this.y = CEILING + this.w / 2;
				hit = true;
			}
		}
		if (stage == DREVILSTAGE && bosses.length > 0) {
			if (dist(this.x, this.y, bosses[0].x, bosses[0].y) < (150 / 2) + (this.w / 2)) {
				let bossPosition = createVector(bosses[0].x, bosses[0].y);
				let sawPosition = createVector(this.x, this.y);
				let sawVelocity = createVector(this.xSpeed, this.ySpeed);
				let line = p5.Vector.sub(sawPosition, bossPosition);
				line.setMag((150 / 2) + (this.w / 2));
				line.add(bossPosition);
				this.x = line.x;
				this.y = line.y;

				// Compute the normal vector from dome center to the ball
				let normalVector = p5.Vector.sub(sawPosition, bossPosition);
				normalVector.normalize();

				// Reflect the velocity over the normal vector
				let dot = sawVelocity.dot(normalVector);
				// @ts-ignore: p5.Vector.mult DOES return a vector, at least in p5@1.11.1
				let reflection = p5.Vector.sub(sawVelocity, p5.Vector.mult(normalVector, 2 * dot));
				reflection.div(2);
				// Set the new velocity
				this.setSpeed(reflection.x, reflection.y);
				bosses[0].health -= 2;
			}
			this.hit = true;
		}

		if (stage == TWINSTAGE && bosses.length > 0) {
			bosses.forEach(boss => {
				if (dist(this.x, this.y, boss.x, boss.y) < (75 / 2) + (this.w / 2)) {
					let bossPosition = createVector(boss.x, boss.y);
					let sawPosition = createVector(this.x, this.y);
					let sawVelocity = createVector(this.xSpeed, this.ySpeed);
					let bossVelocity = createVector(boss.xSpeed || 0, boss.ySpeed || 0); // Default to 0 if boss velocity is undefined

					// Adjust saw position to avoid overlap
					let line = p5.Vector.sub(sawPosition, bossPosition);
					line.setMag((75 / 2) + (this.w / 2));
					line.add(bossPosition);
					this.x = line.x;
					this.y = line.y;

					// Compute the relative velocity (saw velocity relative to the boss)
					let relativeVelocity = p5.Vector.sub(sawVelocity, bossVelocity);

					// Compute the normal vector from the boss center to the saw
					let normalVector = p5.Vector.sub(sawPosition, bossPosition).normalize();

					// Reflect the relative velocity over the normal vector
					let dot = relativeVelocity.dot(normalVector);
					let scaledNormal = normalVector.copy().mult(2 * dot);
					let reflection = createVector(
						relativeVelocity.x - scaledNormal.x,
						relativeVelocity.y - scaledNormal.y
					);

					// Add the boss's velocity back to the reflected velocity
					reflection.add(bossVelocity);

					// Reduce the speed of the reflection for balance
					reflection.mult(0.5);

					// Set the new velocity
					this.setSpeed(reflection.x, reflection.y);

					this.x += this.xSpeed;
					this.y += this.ySpeed;
					// Reduce the boss's health
					let speedVector = createVector(this.xSpeed, this.ySpeed);
					if(speedVector.mag() > 2) {
						boss.health -= 5;
					}
				}
				this.hit = true;
			});
		}

		bosses.forEach((boss) => {
			if (dist(this.x, this.y, boss.x, boss.y) <= (75 / 2) + this.w / 2) {
				let bossPos = createVector(boss.x, boss.y);
				let sawPos = createVector(this.x, this.y);

				let dir = p5.Vector.sub(sawPos, bossPos);
				dir.setMag((75 / 2) + 1 + this.w / 2);

				this.x = bossPos.x + dir.x;
				this.y = bossPos.y + dir.y;
			}
		});
		this.x += this.xSpeed;
		this.y += this.ySpeed;


		if (hit == true && !this.isBlaster) {
			this.ySpeed *= 0.60;
			this.xSpeed *= 0.60;
			// this.animationDirection *= -1;
			this.hitCount++;
		}
		if (dist(this.x, this.y, player.x, player.y) > 40 * 1.375) {
			this.gotFar = true;
		}
		if (dist(this.x, this.y, player.x, player.y) < 40 * 1.375 && this.gotFar) {
			this.going = true;
		} else {
			this.going = false;
		}

		if (this.going && !this.isBlaster) {
			let cringe = goToward(this.x, this.y, player.x, player.y);
			this.xSpeed = cringe.x * 4.5;
			this.ySpeed = cringe.y * 4.5;
		}

		this.going = false;

		if (this.return && !this.isBlaster) {
			let cringe = goToward(this.x, this.y, player.x, player.y);
			this.xSpeed = cringe.x * 7;
			this.ySpeed = cringe.y * 7;
			if ((dist(this.x, this.y, player.x, player.y) < 40 * 1.375 && this.gotFar) || player.hasSaw == true) {
				this.return = false;
				this.gotFar = false;
			}
		}

		if(player.hasSaw == true && !this.isBlaster){
			this.return = false;
		}

		if (this.hitCount == 4) {
			for (let i = 0; i < heldPowerups.length; i++) {
				if (heldPowerups[i].type == TBOUNCE) {
					heldPowerups[i].activate();
				}
				if (heldPowerups[i].type == LIGHTNING) {
					let distances = [
						{ wall: "RIGHT", dist: RIGHTWALL - this.x },
						{ wall: "LEFT", dist: this.x - LEFTWALL },
						{ wall: "FLOOR", dist: FLOOR - this.y },
						{ wall: "CEILING", dist: this.y - CEILING }
					];
					let closest = distances.reduce((a, b) => (a.dist < b.dist ? a : b));
					if (closest.wall == "RIGHT") this.x = RIGHTWALL - this.w / 2;
					if (closest.wall == "LEFT") this.x = LEFTWALL + this.w / 2;
					if (closest.wall == "FLOOR") this.y = FLOOR - this.w / 2;
					if (closest.wall == "CEILING") this.y = CEILING + this.w / 2;

					this.xSpeed = 0;
					this.ySpeed = 0;
				}
			}
			this.hitCount++;
		}
	}
	check(x, y) {
		if (dist(this.x, this.y, x, y) < 20 * 1.375) {
			return true;
		}
	}
	show() {
		if (heldPowerups.some(powerup => powerup.type == MOLASSES) && !this.isBlaster) {
			push();
			noStroke();
			fill(125, 20, 0, 50);
			ellipse(this.x, this.y, this.w * 3);
			pop();
		}
		if (this.isBlaster) {
			// push();
			// fill(200, 200, 255);
			// ellipse(this.x, this.y, 20 * 1.375, 20 * 1.375);
			// pop();
			push();
			// filter(POSTERIZE, 2);
			angleMode(RADIANS)
			// fill(200, 255, 200);
			// ellipse(this.x, this.y, 20 * 1.375, 20 * 1.375);
			imageMode(CENTER);
			translate(this.x, this.y);
			let angle = atan2(this.ySpeed, this.xSpeed);
			// console.log("Angle in radians:", angle);
			rotate(angle - PI / 2);
			// console.log(gleebySprites.imageArray[this.animationIndex]);
			image(gleebySprites.imageArray[this.animationIndex], 0, 0, this.w + 5, this.w + 5);
			pop();
		} else {
			push();
			angleMode(RADIANS)
			// fill(200, 255, 200);
			// ellipse(this.x, this.y, 20 * 1.375, 20 * 1.375);
			imageMode(CENTER);
			translate(this.x, this.y);
			let angle = atan2(this.ySpeed, this.xSpeed);
			// console.log("Angle in radians:", angle);
			// if(cos(angle) < 0){
			// 	angle += PI;
			// }
			rotate(angle - PI / 2);
			// console.log(gleebySprites.imageArray[this.animationIndex]);
			image(gleebySprites.imageArray[this.animationIndex], 0, 0, this.w, this.w);
			pop();
		}
		this.animationTimer++;
		this.frameRate = map(createVector(this.xSpeed, this.ySpeed).mag(), 0, 13, 20, 3) * 0.8;
		// console.log(createVector(this.xSpeed, this.ySpeed).mag());
		if (this.animationTimer >= this.frameRate) {
			this.animationTimer = 0;
			this.animationIndex += this.animationDirection;
			if (this.animationIndex < 0) {
				this.animationIndex = gleebySprites.imageArray.length - 1;
			}
			if (this.animationIndex >= gleebySprites.imageArray.length) {
				this.animationIndex = 0;
			}

		}
	}
	setSpeed(x, y) {
		this.xSpeed = x;
		this.ySpeed = y;
	}
}
