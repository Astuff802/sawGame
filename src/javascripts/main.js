
import { Boss } from "./boss";
import { Button } from "./button";
import { Enemy } from "./enemy";
import { Player } from "./player";
import { Powerup } from "./powerup";
import { Saw } from "./saw";

// Initialize the CrazyGames SDK

//barriers
export const LEFTWALL = 225;
export const RIGHTWALL = 775;
export const CEILING = 25;
export const FLOOR = 575;
export const RINGWIDTH = 550;
export const RINGHEIGHT = 550;

export let player = new Player();
export let saw = new Saw(200, 200);
export let enemies = [];
export function clearEnemies() {
	enemies = [];
}
export let score = 0;
export function setScore(value) {
	score = value;
}
let enemyIdle;
// scenes
export const MENU = 1;
export const TIMETRIAL = 2;
export const TTOVER = 3;
export const LEVELS = 4;
export const SURVIVE = 5;
export const SURVIVEOVER = 6;
export const PAUSE = 7;
//enemy types
export const CHASER = 0;
export const BULLET = 1;
export const STANDER = 2;
export const BULLETBARRIER = 3;
export const TRACER = 4;
export const FROG = 5;
//powerup types
export const RETURNER = 0;
export const FLASH = 1;
export const BLASTER = 2;
export const ONEUP = 3;
export const RAGE = 4;
export const allPowerUps = [RETURNER, FLASH, BLASTER, ONEUP, RAGE];
//perk types
export const PRICKLY = allPowerUps.length;
export const MOLASSES = allPowerUps.length + 1;
export const MATCHALATTE = allPowerUps.length + 2;
export const RICOCHET = allPowerUps.length + 3;
export const BREATHER = allPowerUps.length + 4;
export const TBOUNCE = allPowerUps.length + 5;
export const LIGHTNING = allPowerUps.length + 6;

let stageBreaks = [10, 25, 40, 55, 56, 70, 85, 100, 115, 116, 130, 145, 160, 175, 176, 190, 205, 220, 235, 236, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400];
// let stageBreaks = [0, 3, 40, 55, COLUMNSTAGE, 70, 85, 90, 105, 120, 135, 150, 165, 180];
// let stageBreaks = [0, BULLETSTAGE, 25, 40, 55, 70, 85, 90, 105, COLUMNSTAGE, 120, 135, 150, 165, 180];

const allPerks = [PRICKLY, MOLASSES, MATCHALATTE, BREATHER, TBOUNCE, LIGHTNING];
//boss types
export const COLUMNLORD = 0;
export const BULLETSTORM = 1;
export const DREVIL = 2;
export const TWIN = 3;
export let scene = MENU;
let letChoose = false;
let menuButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, 200, 150, 25, "Time trial", () => {
	scene = TIMETRIAL;
	ttTimer = 0;
	score = 0;
	player.hasSaw = true;
	player.x = RINGWIDTH / 2 + LEFTWALL;
	player.y = RINGWIDTH / 2 + LEFTWALL;
	for (let i = 0; i < 3; i++) {
		enemies.push(new Enemy(random(20, 380), random(20, 380), i, CHASER));
	}
}), new Button(RINGWIDTH / 2 + LEFTWALL, 230, 150, 25, "Levels", () => scene = LEVELS), new Button(RINGWIDTH / 2 + LEFTWALL, 260, 150, 25, "Survival", () => {
	scene = SURVIVE
	scene = SURVIVE
	score = 0;
	player.hasSaw = true;
	player.x = RINGWIDTH / 2 + LEFTWALL;
	player.y = FLOOR - RINGHEIGHT / 2;
	spawnTime = 50;
	breatheTimer = -1;
	enemies = [];
	fieldUpgrades = [];
	// heldPowerups = [new Powerup(0,0,MOLASSES, true)];
	heldPowerups = [];

	blasters = [];
	stage = 0;
	player.lives = 1;
	hurtTimer = 0;
	bosses = [];
})];
let ttOverButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, 300, 150, 25, "Try Again? (space)", () => scene = TIMETRIAL), new Button(200, 335, 100, 25, "Menu", () => scene = MENU)];
let levelButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, FLOOR - 50, 150, 25, "Menu", () => scene = MENU)];
[0].concat(stageBreaks).forEach((stageScore, index) => {
	const columns = 5;
	const row = Math.floor(index / columns);
	const column = index % columns;

	levelButtons.push(new Button(LEFTWALL + column * 90 + 100, CEILING + row * 100 + 50, 80, 80, `Stage ${index + 1}`, () => {
		scene = SURVIVE
		score = stageScore;
		player.hasSaw = true;
		player.x = RINGWIDTH / 2 + LEFTWALL;
		player.y = FLOOR - RINGHEIGHT / 2;
		spawnTime = 50;
		breatheTimer = -1;
		enemies = [];
		fieldUpgrades = [];
		// heldPowerups = [new Powerup(0,0,MOLASSES, true)];
		heldPowerups = [];
		blasters = [];
		stage = max(index - 1, 0);
		player.lives = 5;
		hurtTimer = 0;
		bosses = [];
		// Reset to default speed
		player.setMaxSpeed = player.defaultSpeed;
		player.maxSpeed = player.defaultSpeed;
	}))
});
let surviveOverButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, 300, 150, 25, "Try Again? (space)", () => {
	scene = SURVIVE
	score = 0;
	player.hasSaw = true;
	player.x = RINGWIDTH / 2 + LEFTWALL;
	player.y = FLOOR - RINGHEIGHT / 2;
	spawnTime = 50;
	breatheTimer = -1;
	enemies = [];
	fieldUpgrades = [];
	// heldPowerups = [new Powerup(0,0,MOLASSES, true)];
	heldPowerups = [];
	blasters = [];
	stage = 0;
	player.lives = 5;
	hurtTimer = 0;
	bosses = [];
	// Reset to default speed
	player.setMaxSpeed = player.defaultSpeed;
	player.maxSpeed = player.defaultSpeed;
}), new Button(RINGWIDTH / 2 + LEFTWALL, 335, 100, 25, "Menu", () => scene = MENU)]
export const COLUMNSTAGE = 4;
export const BULLETSTAGE = 9;
export const DREVILSTAGE = 14;
export const TWINSTAGE = 19;
let ttTimer = 0;
let spawnTime = 50;
let breatheTimer = 0;
const callbacks = {
	adFinished: () => console.log("End midgame ad"),
	adError: (error) => console.log("Error midgame ad", error),
	adStarted: () => console.log("Start midgame ad"),
};
export let stage = 5;
export let heldPowerups = [new Powerup(200, 200, BLASTER)];
let fieldUpgrades = [];
let powerUpTimer;
export let blasters = [];
let hurtTimer = 0;
export function setHurtTimer(value) {
	hurtTimer = value;
}
export let bosses = [];
export let img;
export let gleeby;
// let testBoss = new Boss(COLUMNLORD);
export let gleebySprites = {
	"spriteSheetFilePath" : "src/images/ColoredTransparentGleebyv1.png",
	"spriteCount" : 8,
	"spriteWidth" : 200,
	"spriteHeight" : 200,
	"imageArray" : [],
	"spriteSheet" : null,
	"spritesPerRow" : 4,
	"load" : function() {
		this.spriteSheet = loadImage(this.spriteSheetFilePath, () => {
			console.log("Sprite sheet loaded successfully");
			this.loadSpriteArray();
		}, () => {
			console.error("Failed to load sprite sheet");
		});
	},
	"loadSpriteArray" : function() {
		for(let j = 0; j < (this.spriteCount / 5); j++){
			for (let i = 0; i < this.spritesPerRow; i++){
				if(this.imageArray.length >= this.spriteCount){
					return;
				}
				this.imageArray.push(this.spriteSheet.get(i * this.spriteWidth, j * this.spriteHeight,this.spriteWidth,this.spriteHeight));
			}
		}
	}
}

export function preload() {
	img = loadImage('src/images/cowboyTest.png');
	gleeby = loadImage('src/images/AlienGuy.png');
	gleebySprites.load();
}



export async function setup() {
	const myCanvas = createCanvas(1000, 600);
	powerUpTimer = random(300, 500);
	// await window.CrazyGames.SDK.init();
	noSmooth();
	// 	for(let i = 0; i < 3; i ++){
	// 		enemies.push(new Enemy(random(20,380), random(20,380),i));
	// 	}
	// await example
	// try {
	// 	const user = await window.CrazyGames.SDK.user.getUser();
	// 	console.log(user);
	// } catch (e) {
	// 	console.log("Get user error: ", e);
	// }

	

	
	// try {
	// 	// await is not mandatory when requesting banners,
	// 	// but it will allow you to catch errors
	// 	await window.CrazyGames.SDK.banner.requestBanner({
	// 		id: "banner-container",
	// 		width: 970,
	// 		height: 90,
	// 	});
	// } catch (e) {
	// 	console.log("Banner request error", e);
	// }
}
let dinkle = 0;

export function draw() {
	background(0);
    // if (gleebySprites.imageArray.length > 0) {
    //     image(gleebySprites.imageArray[Math.floor(dinkle/20) % gleebySprites.spriteCount], 100, 100, 50, 50); // Draw the first sprite
    // } else {
    //     console.error("Sprite array is empty");
    // }
	// dinkle++;
	background(0);
	rect(225, 25, 550, 550);
	if (scene == MENU) {
		menuDraw();
	} else if (scene == TIMETRIAL) {
		timeTrialDraw();
	} else if (scene == TTOVER) {
		ttOverDraw();
	} else if (scene == LEVELS) {
		levelsDraw();
	} else if (scene == SURVIVE) {
		surviveDraw();
	} else if (scene == SURVIVEOVER) {
		surviveOverDraw();
	} else if (scene == PAUSE) {
		pauseDraw();
	}
}

function ttOverDraw() {
	textAlign(CENTER);
	push();
	fill(255, 255, 255);
	strokeWeight(2);
	rectMode(CENTER);
	rect(RINGWIDTH / 2 + LEFTWALL, 260, 80, 20);
	fill(0);
	text("Score: " + score, RINGWIDTH / 2 + LEFTWALL, 264)
	pop();
	for (let i = 0; i < ttOverButtons.length; i++) {
		ttOverButtons[i].show();
	}
}

function levelsDraw() {
	for (let i = 0; i < levelButtons.length; i++) {
		levelButtons[i].show();
	}
}

function menuDraw() {
	textAlign(CENTER);
	score = 0;
	text("Saw Game :D", RINGWIDTH / 2 + LEFTWALL, 100);
	for (let i = 0; i < menuButtons.length; i++) {
		menuButtons[i].show();
	}
}

function timeTrialDraw() {
	if (ttTimer == 0) {
		ttTimer = 1141
		score = 0;
	}
	saw.show();
	saw.update();
	player.show();
	player.update();

	for (let i = 0; i < enemies.length; i++) {
		enemies[i].show();
		if (!player.hasSaw) {
			enemies[i].check(saw.x, saw.y);
		}
	}

	push();
	noFill();
	rect(10, 10, 100, 20);
	fill(255, 0, 0)
	// rect(10,10,Math.round(ttTimer / 60.0) * (100 / Math.round(1141 / 60.0)),20);
	rect(10, 10, ttTimer * (100 / 1141), 20);
	fill(255, 255, 255);
	strokeWeight(2);
	rect(322, 10, 80, 20);
	fill(0);
	text("Score: " + score, 350, 25)
	pop();

	if (saw.check(player.x, player.y)) {
		saw.xSpeed = 0;
		saw.ySpeed = 0;
		saw.gotFar = false;
		player.hasSaw = true;
	}
	if (player.hasSaw) {
		saw.x = player.x;
		saw.y = player.y;
	}
	ttTimer--;
	if (ttTimer == 1) {
		ttTimer = 0;
		player.x = 200;
		player.y = 200;
		saw.x = 200;
		saw.y = 200;
		scene = TTOVER;
	}

}


function surviveDraw() {
	// HURT TIMER STUFF
	let hurtColor = color(255, 0, 0);
	hurtColor.setAlpha(hurtTimer);
	background(hurtColor);
	hurtTimer -= 10;
	////////////////////
	//How to get to the next stage
	if (score >= stageBreaks[stage] && breatheTimer < 0) {
		if (stage != COLUMNSTAGE && stage != BULLETSTAGE && stage != DREVILSTAGE && stage != TWINSTAGE) {
			breatheTimer = 80;
		}
	}

	////////////////
	//Rules for spawning
	if (ttTimer <= 0) {
		if (score <= stageBreaks[0]) {
			ttTimer += 50;
		} else {
			ttTimer += spawnTime;
		}
		const spawnRadius = 410; // Adjust as needed
		angleMode(RADIANS);
		// Random angle for spawn position
		let angle = random(0, TWO_PI);

		// Calculate spawn position outside the ring
		let spawnX = ((RINGWIDTH / 2) + LEFTWALL) + cos(angle) * spawnRadius;
		let spawnY = ((RINGHEIGHT / 2) + CEILING) + sin(angle) * spawnRadius;

		// Ensure enemies don’t spawn too close to the player
		while (dist(player.x, player.y, spawnX, spawnY) <= 275) {
			angle = random(0, TWO_PI);
			spawnX = ((RINGWIDTH / 2) + LEFTWALL) + cos(angle) * spawnRadius;
			spawnY = ((RINGHEIGHT / 2) + CEILING) + sin(angle) * spawnRadius;
		}

		let potentialPointCount = 0;
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].killable) {
				potentialPointCount++;
			}
		}
		if (breatheTimer <= 0 && letChoose == false && (potentialPointCount + score < stageBreaks[stage] || stage == COLUMNSTAGE || stage == BULLETSTAGE || stage == DREVILSTAGE || stage == TWINSTAGE)) {
			if (bosses.length <= 0) {
				if (Math.random() > 0.5 && score >= stageBreaks[0]) {
					spawn(spawnX, spawnY, BULLET);
				} else {
					if (stage > COLUMNSTAGE) {
						if (Math.random() > 0.5) {
							spawn(spawnX, spawnY, TRACER);
						} else {
							spawn(spawnX, spawnY, CHASER);
						}
					} else {
						spawn(spawnX, spawnY, CHASER);
					}
				}
			} else {
				if (bosses[0].type == COLUMNLORD) {
					if (bosses[0].health >= 40) {
						bosses[0].barsAttack();
						ttTimer = 80;
					} else if (bosses[0].health < 40 && bosses[0].health > 20) {
						bosses[0].columnAttack();
						ttTimer = 130;
					} else {
						bosses[0].zigZagAttack();
						ttTimer = 50;
					}
				} else if (bosses[0].type == BULLETSTORM) {
					spawn(spawnX, spawnY, BULLET);
					ttTimer = 18;
					bosses[0].health -= 1;
				} else if (bosses[0].type == DREVIL) {
					if (bosses[0].health >= 80) {
						console.log("bash attack");
						bosses[0].bashSlam();
						ttTimer = 45;
					} else if (bosses[0].health < 80 && bosses[0].health >= 40) {
						console.log("criss attack");
						bosses[0].theOldCrissCross();
						ttTimer = 325;
					} else if (bosses[0].health < 40) {
						bosses[0].radiateAttack();
						ttTimer = 15;
					}
				}
			}
			// testBoss.attack();
			breatheTimer -= 1;
		}
	}
	////////////////////
	//Updates and shows
	//saw
	if (!player.hasSaw) {
		saw.show();
		saw.update();
	}
	for (let i = 0; i < fieldUpgrades.length; i++) {
		fieldUpgrades[i].show(fieldUpgrades[i].x, fieldUpgrades[i].y);
		fieldUpgrades[i].showDescription();
		if (fieldUpgrades[i].check(player.x, player.y, player.w)) {
			if (fieldUpgrades[i].type == MATCHALATTE || fieldUpgrades[i].type == LIGHTNING) {
				fieldUpgrades[i].activate();
			}
			heldPowerups.push(fieldUpgrades[i]);
			fieldUpgrades = [];
			i = 0;
		}
	}
	// saw checks
	if (saw.check(player.x, player.y)) {
		saw.xSpeed = 0;
		saw.ySpeed = 0;
		saw.gotFar = false;
		player.hasSaw = true;
		saw.hitOne = false;
		saw.hitCount = 0;
	}
	if (player.hasSaw) {
		saw.x = player.x;
		saw.y = player.y;
	}

	//BLASTER
	for (let i = 0; i < blasters.length; i++) {
		blasters[i].show();
		blasters[i].update();
		if (blasters[i].ttl == 0) {
			blasters.splice(i, 1);
			i = 0;
		}
	}
	//ENEMIES
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].show();
		enemies[i].update(player.x, player.y);
		if (player.checkDead(enemies[i].x, enemies[i].y, enemies[i].w)) {
			if (player.rageTimer > 0) {
				kill(i);
				continue;
			} else {
				if (player.lives <= 0) {
					player.lifeTimer = 0;
					scene = SURVIVEOVER;
					// window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);

				}
				for (let i = 0; i < heldPowerups.length; i++) {
					if (heldPowerups[i].type == PRICKLY) {
						let shoot = new Powerup(-50, -50, BLASTER);
						shoot.activate();
					}
				}
				hurtTimer = 170;
			}
		}
		if (!player.hasSaw || enemies[i].type == BULLET) {
			if (enemies[i].check(saw.x, saw.y)) {
				for (let i = 0; i < heldPowerups.length; i++) {
					if (heldPowerups[i].type == RICOCHET && saw.hitOne == false && enemies.length >= 1) {
						saw.hitOne = true;
						let closestDist = 500;
						let closestI = 0;
						for (let i = 0; i < enemies.length; i++) {
							if (dist(saw.x, saw.y, enemies[i].x, enemies[i].y) < closestDist && enemies[i].killable) {
								if (enemies[i].x >= LEFTWALL && enemies[i].x <= RIGHTWALL && enemies[i].y >= CEILING && enemies[i].y <= FLOOR) {
									closestDist = dist(saw.x, saw.y, enemies[i].x, enemies[i].y);
									closestI = i;
								}
							}
						}
						if (closestDist <= 200) {
							let target = createVector(enemies[closestI].x, enemies[closestI].y);
							target.sub(createVector(saw.x, saw.y));
							target.normalize();
							saw.setSpeed(target.x * saw.defaultSpeed, target.y * saw.defaultSpeed);
						}
					}
				}
			}
		}

	}
	//seperate for blasters to avoid bugs
	for (let i = 0; i < enemies.length; i++) {
		for (let j = 0; j < blasters.length; j++) {
			if (enemies[i].check(blasters[j].x, blasters[j].y)) {
				break;
			}
		}
	}
	//BOSS:
	if (bosses.length > 0) {
		bosses.forEach(boss => {
			boss.show();
			if (boss.type == TWIN) {
				boss.update();
			}
		});
		if (bosses[0].type == DREVIL) {
			for (let i = 0; i < enemies.length; i++) {
				if (dist(enemies[i].x, enemies[i].y, enemies[i].thisPattern[enemies[i].thisPattern.length - 1].x, enemies[i].thisPattern[enemies[i].thisPattern.length - 1].y) <= 20 && enemies[i].type == TRACER) {
					kill(enemies[i].id);
				}
			}
		}
	}
	//PLAYER
	player.show();
	player.update();

	//Check the bosses health:
	if (bosses.length > 0) {
		for (let i = bosses.length - 1; i >= 0; i--) { // Iterate backward to avoid index shifting
			if (bosses[i].health <= 0) {
				bosses.splice(i, 1); // Remove the boss at index `i`
			}
		}
		if (bosses.length == 0) { // Check if all bosses are defeated
			console.log("bosses cleared");
			breatheTimer = 80;
			enemies = [];
		}
	}
	//////////////
	//Powerup draws
	for (let i = 0; i < fieldUpgrades.length; i++) {
		fieldUpgrades[i].show(fieldUpgrades[i].x, fieldUpgrades[i].y);
		fieldUpgrades[i].showDescription();
		if (fieldUpgrades[i].check(player.x, player.y, player.w)) {
			if (fieldUpgrades[i].type == MATCHALATTE || fieldUpgrades[i].type == LIGHTNING) {
				fieldUpgrades[i].activate();
			}
			heldPowerups.push(fieldUpgrades[i]);
			fieldUpgrades = [];
			i = 0;
			//////////NEW STAGE////////////////
			if (letChoose) {
				letChoose = false;
				stage++;
				breatheTimer = -1;
				if (stage == COLUMNSTAGE) {
					bosses.push(new Boss(COLUMNLORD));
				} else if (stage == BULLETSTAGE) {
					bosses.push(new Boss(BULLETSTORM));
				} else if (stage == DREVILSTAGE) {
					bosses.push(new Boss(DREVIL));
				} else if (stage == TWINSTAGE) {
					bosses.push(new Boss(TWIN, LEFTWALL + 200, CEILING - 110));
					bosses.push(new Boss(TWIN, RIGHTWALL - 200, CEILING - 110));
				}
				else {
					spawnTime -= 2;
				}
			}
		}
	}
	let modifier = 0;
	for (let i = 0; i < heldPowerups.length; i++) {
		if (heldPowerups[i].isPerk) {
			modifier += heldPowerups[i].w + 10;
		}
		heldPowerups[i].show(i * (heldPowerups[i].w + 5) + 15 + LEFTWALL - modifier, CEILING + 20);
		if (heldPowerups[i].type == ONEUP) {
			heldPowerups[i].activate();
			heldPowerups.splice(i, 1);
			i = 0;
		}
	}



	let nextPowerUpFlash = false;
	for (let i = 0; i < heldPowerups.length; i++) {
		if (!heldPowerups[i].isPerk) {
			if (heldPowerups[i].type == FLASH) {
				nextPowerUpFlash = true;
			}
			break;
		}
	}

	if (nextPowerUpFlash) {
		push();
		noFill();
		ellipse(player.x, player.y, 250, 250);
		pop();
	}
	///////////////////
	//////////////////
	//Score draw: 
	push();
	fill(255, 255, 255);
	strokeWeight(2);
	rect(RIGHTWALL - 100, CEILING + 20, 80, 20);
	fill(0);
	text("Score: " + score, RIGHTWALL - 70, CEILING + 35);
	pop();
	////////////
	//When do i show the breathe timer text
	if (breatheTimer > 0 && enemies.length == 0 && (score >= stageBreaks[stage] || stage == COLUMNSTAGE || stage == BULLETSTAGE || stage == DREVILSTAGE || stage == TWINSTAGE)) {
		push();
		text("BREATHE", RINGWIDTH / 2 + LEFTWALL, 200);
		pop();
		breatheTimer--;
		letChoose = true;
	}
	//When do i show powerups?
	if (letChoose && breatheTimer == 0) {
		if (fieldUpgrades.length == 0) {

			let availablePowerUps = allPowerUps.filter(powerup => {
				return powerup != ONEUP;
			}
			);
			//Always spawn a health powerup
			fieldUpgrades.push(new Powerup(RINGWIDTH / 2 + LEFTWALL + 205, 250, ONEUP));
			// Filter out perks the player already holds

			// Add a random power-up as well
			let randomPowerup = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
			fieldUpgrades.push(new Powerup(RINGWIDTH / 2 + LEFTWALL - 75, 200, randomPowerup));

			if (Math.random() > 0.3) {
				let availablePerks = allPerks.filter(perk => {
					return !heldPowerups.some(held => held.isPerk && held.type === perk);
				});
				// If there are available perks, randomly select one
				if (availablePerks.length > 0) {
					let randomPerk = availablePerks[Math.floor(Math.random() * availablePerks.length)];
					//randomPerk = allPowerUps.length + 6;

					fieldUpgrades.push(new Powerup(RINGWIDTH / 2 + LEFTWALL + 75, 200, randomPerk, true));
				} else {
					// If no perks are available, add a random power-up
					randomPowerup = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
					fieldUpgrades.push(new Powerup(RINGWIDTH / 2 + LEFTWALL + 75, 200, randomPowerup));
				}
			} else {
				randomPowerup = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
				fieldUpgrades.push(new Powerup(RINGWIDTH / 2 + LEFTWALL + 75, 200, randomPowerup));
			}
			player.x = RINGWIDTH / 2 + LEFTWALL;
			player.y = 350;
			player.xSpeed = 0;
			player.ySpeed = 0;
			player.hasSaw = true;

		}
		text("Choose: ", 200, 200);
	}
	///////////////


	//get the timer going for spawn
	ttTimer--;
	///////////



	// powerUpTimer--;
	// if(powerUpTimer <= 0){
	// 	powerUpTimer = random(300, 700);
	// 	fieldUpgrades.push(new Powerup(random(20,380), random(20,380), RETURNER));
	// }

	// if (dist(player.x, player.y, saw.x, saw.y) >= 70) {
	// 	saw.return = true;
	// }
	// console.log(breatheTimer);

	//Rectangles for pretty :)
	push();
	fill(0);
	rect(0, 0, (1000 - 550) / 2, 600);
	rect(LEFTWALL, FLOOR, RINGWIDTH, 25);
	rect(LEFTWALL, 0, RINGWIDTH, 25);
	rect(RIGHTWALL, 0, (1000 - 550) / 2, 600);
	pop();

}

function surviveOverDraw() {
	enemies = [];
	push();
	fill(255, 255, 255);
	strokeWeight(2);
	rectMode(CENTER);
	rect(RINGWIDTH / 2 + LEFTWALL, 200, 80, 20);
	fill(0);
	text("Score: " + score, RINGWIDTH / 2 + LEFTWALL, 206)
	pop();
	for (let i = 0; i < surviveOverButtons.length; i++) {
		surviveOverButtons[i].show();
	}
}

function pauseDraw() {
	text("PAUSED", 200, 200);
}

export function mousePressed() {
	if (player.hasSaw && (scene == TIMETRIAL || scene == SURVIVE)) {
		player.hasSaw = false;
		let mouse = createVector(mouseX, mouseY);
		mouse.sub(createVector(player.x, player.y));
		mouse.normalize();
		saw.setSpeed(mouse.x * saw.defaultSpeed, mouse.y * saw.defaultSpeed);
		saw.x += mouse.x * 22;
		saw.y += mouse.y * 22;
	}
	if (scene == MENU) {
		for (let i = 0; i < menuButtons.length; i++) {
			menuButtons[i].check(mouseX, mouseY);
		}
	} else if (scene == TTOVER) {
		for (let i = 0; i < ttOverButtons.length; i++) {
			ttOverButtons[i].check(mouseX, mouseY);
		}
	} else if (scene == LEVELS) {
		for (let i = 0; i < levelButtons.length; i++) {
			levelButtons[i].check(mouseX, mouseY);
		}
	} else if (scene == SURVIVEOVER) {
		for (let i = 0; i < surviveOverButtons.length; i++) {
			surviveOverButtons[i].check(mouseX, mouseY);
		}
	}

}

export function kill(j) {
	if ((enemies[j].type == CHASER || enemies[j].type == STANDER || enemies[j].type == TRACER || enemies[j].type == FROG) && enemies[j].killable && stage != TWINSTAGE) {
		score++;
	}
	enemies.splice(j, 1);
	if (scene == TIMETRIAL) {
		spawn(random(20, 380), random(20, 380), STANDER);
	}
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].id = i;
	}
}

export function spawn(x, y, type, tx = -1, ty = -1) {
	if (type == CHASER) {
		enemies.push(new Enemy(x, y, 0, CHASER));
	} else if (type == BULLET) {
		// let v2 = goToward(player.x, player.y,x,y);
		// //v2.mult(300);
		// v2.x += 200;
		// v2.y += 200;
		enemies.push(new Enemy(x, y, 0, BULLET, player.x, player.y));
	} else if (type == BULLETBARRIER) {
		enemies.push(new Enemy(x, y, 0, BULLETBARRIER, tx, ty));
	} else if (type == TRACER) {
		enemies.push(new Enemy(x, y, 0, TRACER));
	} else if (type == FROG) {
		enemies.push(new Enemy(x, y, 0, FROG));
	} else {
		enemies.push(new Enemy(x, y, 0, STANDER));
	}
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].id = i;
	}
}


export function keyPressed() {
	if (keyCode === 32) { //space
		if (scene == TTOVER) {
			scene = TIMETRIAL;
		}
		if (scene == SURVIVEOVER) {
			surviveOverButtons[0].f();
		}
		if (scene == SURVIVE) {
			for (let i = 0; i < heldPowerups.length; i++) {
				if (!heldPowerups[i].isPerk) {
					heldPowerups[i].activate();
					heldPowerups.splice(i, 1);
					break;
				}
			}
		}
	}
	if (keyCode === 69 && (scene == SURVIVE || scene == PAUSE)) {

		if (scene == SURVIVE) {
			scene = PAUSE;
		} else {
			scene = SURVIVE;
		}
	}
	if (keyCode === 70) {
		stage = DREVILSTAGE - 1;
		score = stageBreaks[DREVILSTAGE] - 2;
	}
}

/**
 * 
 * @param {number} x1 - x1 position of the first point 
 * @param {number} y1 - y1 position of the first point
 * @param {number} x2 - x2 position of the second point
 * @param {number} y2 - y2 position of the second point
 * @returns 
 */
export function goToward(x1, y1, x2, y2) {
	let v1 = createVector(x1, y1);
	let v2 = createVector(x2, y2);
	v2.sub(v1);
	v2.normalize();
	v2.mult(1.25);
	return v2;
}

export function equilateral(x, y, theta, size) {
	triangle(
		x + cos(theta) * size,
		y + sin(theta) * size,
		x + cos(theta + TAU / 3) * size,
		y + sin(theta + TAU / 3) * size,
		x + cos(theta - TAU / 3) * size,
		y + sin(theta - TAU / 3) * size
	);
}