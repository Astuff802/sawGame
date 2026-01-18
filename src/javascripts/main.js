
import { Boss } from "./boss";
import { Button } from "./button";
import { Enemy } from "./enemy";
import { Player } from "./player";
import { Powerup } from "./powerup";
import { Saw } from "./saw";
import { TutorialScreen } from "./screen";

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
export const SURVIVETUTORIAL = 8;
//enemy types
export const CHASER = 0;
export const BULLET = 1;
export const STANDER = 2;
export const BULLETBARRIER = 3;
export const TRACER = 4;
export const FROG = 5;
export const CRASHZONE = 6;
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

export const COLUMNSTAGE = 4;
export const BULLETSTAGE = 9;
export const DREVILSTAGE = 14;
export const TWINSTAGE = 19;
const allStages = [COLUMNSTAGE, BULLETSTAGE, DREVILSTAGE, TWINSTAGE];
let stageBreaks = [10, 25, 40, 55, 56, 70, 85, 100, 115, 116, 130, 145, 160, 175, 176, 190, 205, 220, 235, 236, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400];
// let stageBreaks = [0, 3, 40, 55, COLUMNSTAGE, 70, 85, 90, 105, 120, 135, 150, 165, 180];
// let stageBreaks = [0, BULLETSTAGE, 25, 40, 55, 70, 85, 90, 105, COLUMNSTAGE, 120, 135, 150, 165, 180];
let latestStage = 0;

const allPerks = [PRICKLY, MOLASSES, MATCHALATTE, BREATHER, TBOUNCE, LIGHTNING];
//boss types
export const COLUMNLORD = 0;
export const BULLETSTORM = 1;
export const DREVIL = 2;
export const TWIN = 3;
export let scene = MENU;
let letChoose = false;
let menuButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, 300, 150, 25, "Time trial", () => {
	resetGameState({
		stageVal: 0,
		playerX: RINGWIDTH / 2 + LEFTWALL,
		playerY: RINGWIDTH / 2 + LEFTWALL
	});
	scene = TIMETRIAL;
	ttTimer = 0;
	clearEnemies();
	for (let i = 0; i < 3; i++) {
		enemies.push(new Enemy(random(LEFTWALL + 20, RIGHTWALL - 20), random(CEILING + 20, FLOOR - 20), i, CHASER));
	}
}), new Button(RINGWIDTH / 2 + LEFTWALL, 330, 150, 25, "Levels", () => scene = LEVELS), new Button(RINGWIDTH / 2 + LEFTWALL, 360, 150, 25, "Survival", () => {
	resetGameState({
		playerX: RINGWIDTH / 2 + LEFTWALL,
		playerY: FLOOR - RINGHEIGHT / 2,
		breathe: 0
	});
	scene = SURVIVETUTORIAL;
})];
let ttOverButtons = [
	new Button(RINGWIDTH / 2 + LEFTWALL, 300, 150, 25, "Try Again? (space)", () => {
		resetGameState({
			stageVal: 0,
			playerX: RINGWIDTH / 2 + LEFTWALL,
			playerY: RINGWIDTH / 2 + LEFTWALL
		});
		scene = TIMETRIAL;
		ttTimer = 0;
		clearEnemies();
		for (let i = 0; i < 3; i++) {
			enemies.push(new Enemy(random(LEFTWALL + 20, RIGHTWALL - 20), random(CEILING + 20, FLOOR - 20), i, CHASER));
		}
	}),
	new Button(RINGWIDTH / 2 + LEFTWALL, 350, 150, 25, "Menu", () => scene = MENU)
];
let pauseButtons = [
	new Button(RINGWIDTH / 2 + LEFTWALL, CEILING + 450, 150, 25, "Resume", () => scene = SURVIVE),
	new Button(RINGWIDTH / 2 + LEFTWALL, CEILING + 400, 150, 25, "Menu", () => scene = MENU)];
let levelButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, FLOOR - 50, 150, 25, "Menu", () => scene = MENU)];
[0].concat(stageBreaks).forEach((stageScore, index) => {
	const columns = 5;
	const row = Math.floor(index / columns);
	const column = index % columns;
	if (index > 0) {
		return;
	}
	levelButtons.push(new Button(LEFTWALL + column * 90 + 100, CEILING + 80 + row * 70 + 50, 80, 40, `Stage ${index + 1}`, () => {
		resetGameState({
			stageVal: max(index - 1, 0),
			playerX: RINGWIDTH / 2 + LEFTWALL,
			playerY: FLOOR - RINGHEIGHT / 2,
			breathe: -1,
			scoreVal: stageScore
		});
		scene = SURVIVE
	}))
});
let surviveOverButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, 300, 150, 25, "Try Again? (space)", () => {
	resetGameState({
		playerX: RINGWIDTH / 2 + LEFTWALL,
		playerY: FLOOR - RINGHEIGHT / 2,
		breathe: 0
	});
	scene = SURVIVE
}), new Button(RINGWIDTH / 2 + LEFTWALL, 335, 100, 25, "Menu", () => scene = MENU)]

//Screens and stuff
let survivalTutorialScreen = new TutorialScreen(`
	Fight your way through all 40 rounds and
	beat all the bosses to win the title belt!
	Click to launch your partner at enemies, 
	and press space to use powerups you collect
	at the end of each round. Some powerups are 
	special perks that affect the gameplay
	permanently until you die. You only have so 
	many lives, so be careful! When you game over,
	you can select any stage you've already visited
	from the menu. Press E to pause.
	Good luck!! 
	Only the best can achieve Glory in the Ring!`, SURVIVE);



let ttTimer = 0;
let spawnTime = 50;
let breatheTimer = 0;
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
	"spriteSheetFilePath": "src/images/Characters/Gleebylines_SS.png",
	"spriteCount": 8,
	"spriteWidth": 200,
	"spriteHeight": 200,
	"imageArray": [],
	"spriteSheet": null,
	"spritesPerRow": 4,
	"load": function () {
		this.spriteSheet = loadImage(this.spriteSheetFilePath, () => {
			this.loadSpriteArray();
		}, () => {
			console.error("Gleeby sprite not loaded")
		});
	},
	"loadSpriteArray": function () {
		for (let j = 0; j < (this.spriteCount / this.spritesPerRow); j++) {
			for (let i = 0; i < this.spritesPerRow; i++) {
				if (this.imageArray.length >= this.spriteCount) {
					return;
				}
				this.imageArray.push(this.spriteSheet.get(i * this.spriteWidth, j * this.spriteHeight, this.spriteWidth, this.spriteHeight));
			}
		}
	}
}
// asset stuff
export let slimeWalks, slimeWalk1, slimeWalk2, spikeBalls, spikeBall1, spikeBall2, titleFont, menuBackground, grayPanel, greyButton, normalFont, blueRobot, greenRobot, redRobot, yellowRobot, allRobots;

export function preload() {
	gleebySprites.load();
	titleFont = loadFont('src/fonts/MetalMania-Regular.ttf');
	menuBackground = loadImage('src/images/BackgroundImages/GloryInTheRingGameBackground.png');
	grayPanel = loadImage('src/images/UI/grey_panel.png');
	greyButton = loadImage('src/images/UI/grey_button02.png');
	normalFont = loadFont('src/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf');
	blueRobot = loadImage('src/images/Enemies/Robots/robot_blue.png');
	greenRobot = loadImage('src/images/Enemies/Robots/robot_green.png');
	redRobot = loadImage('src/images/Enemies/Robots/robot_red.png');
	yellowRobot = loadImage('src/images/Enemies/Robots/robot_yellow.png');
	allRobots = [blueRobot, greenRobot, redRobot, yellowRobot];
	spikeBall1 = loadImage('src/images/Enemies/SpikeBall/spikeBall1.png');
	spikeBall2 = loadImage('src/images/Enemies/SpikeBall/spikeBall_2.png');
	spikeBalls = [spikeBall1, spikeBall2];
	slimeWalk1 = loadImage('src/images/Enemies/Slime/slimeWalk1.png');
	slimeWalk2 = loadImage('src/images/Enemies/Slime/slimeWalk2.png');
	slimeWalks = [slimeWalk1, slimeWalk2];
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
	textFont(normalFont);
}
let dinkle = 0;

export function draw() {
	background(0);
	push();
	fill(200)
	rect(225, 25, 550, 550);
	pop();
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
	} else if (scene == SURVIVETUTORIAL) {
		survivalTutorialScreen.draw();
	}
}

function ttOverDraw() {
	drawScore();
	drawButtons(ttOverButtons);
}

function levelsDraw() {
	image(menuBackground, LEFTWALL, CEILING, RINGWIDTH, RINGHEIGHT);
	drawButtons(levelButtons);
}

function menuDraw() {
	push();
	image(menuBackground, LEFTWALL, CEILING, RINGWIDTH, RINGHEIGHT);
	textAlign(CENTER);
	textFont(titleFont);
	textSize(64);
	imageMode(CENTER);
	image(greyButton, RINGWIDTH / 2 + LEFTWALL, 180, 500, 100);
	text("Glory in the Ring", RINGWIDTH / 2 + LEFTWALL, 200);
	pop();
	score = 0;
	drawButtons(menuButtons);
}

function timeTrialDraw() {

	if (ttTimer == 0) {
		// ttTimer = 1141
		ttTimer = 100;
		score = 0;
	}
	if (!player.hasSaw) {
		saw.show();
		saw.update();
	}
	player.show();
	player.update();

	for (let i = 0; i < enemies.length; i++) {
		enemies[i].show();
		if (!player.hasSaw) {
			if (enemies[i].check(saw.x, saw.y)) {
				enemies.push(new Enemy(random(LEFTWALL + 20, RIGHTWALL - 20), random(CEILING + 20, FLOOR - 20), i, CHASER));
				for (let j = 0; j < enemies.length; j++) {
					enemies[j].id = j;
				}
				i = 0;
			}
		}
	}

	push();
	noFill();
	rect(LEFTWALL + 10, CEILING + 10, 100, 20);
	fill(255, 0, 0)
	rect(LEFTWALL + 10, CEILING + 10, ttTimer * (100 / 1141), 20);
	pop();
	drawScore();


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
			breatheTimer = 180;
			latestStage = stage + 1;
			resetLevelButtons();
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
				// ...existing code...
				if(stage === 0){
					spawn(spawnX, spawnY, CHASER);
				} else if (stage < COLUMNSTAGE) {
					if (Math.random() < 0.5) {
						spawn(spawnX, spawnY, CHASER);
					} else {
						spawn(spawnX, spawnY, BULLET);
					}
				} else if (stage < BULLETSTAGE) {
					// Column lord to bullet hell: 60% chaser/bullet, 40% tracer
					let r = Math.random();
					if (r < 0.3) {
						spawn(spawnX, spawnY, CHASER);
					} else if (r < 0.6) {
						spawn(spawnX, spawnY, BULLET);
					} else {
						spawn(spawnX, spawnY, TRACER);
					}
				} else if (stage < DREVILSTAGE) {
					// Bullet hell to dr evil: 50% chaser/bullet, 25% tracer, 25% crash zone
					let r = Math.random();
					if (r < 0.25) {
						spawn(spawnX, spawnY, CHASER);
					} else if (r < 0.5) {
						spawn(spawnX, spawnY, BULLET);
					} else if (r < 0.75) {
						spawn(spawnX, spawnY, TRACER);
					} else {
						spawn(random(LEFTWALL + 20, RIGHTWALL - 20), random(CEILING + 20, FLOOR - 20), CRASHZONE);
					}
				} else if (stage < TWINSTAGE) {
					// Dr Evil to Twin: 40% chaser/bullet, 60% split between frog, tracer, crash zone
					let r = Math.random();
					if (r < 0.2) {
						spawn(spawnX, spawnY, CHASER);
					} else if (r < 0.4) {
						spawn(spawnX, spawnY, BULLET);
					} else if (r < 0.6) {
						spawn(spawnX, spawnY, FROG);
					} else if (r < 0.8) {
						spawn(spawnX, spawnY, TRACER);
					} else {
						spawn(random(LEFTWALL + 20, RIGHTWALL - 20), random(CEILING + 20, FLOOR - 20), CRASHZONE);
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
						bosses[0].bashSlam();
						ttTimer = 60;
					} else if (bosses[0].health < 80 && bosses[0].health >= 40) {
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
	for (let i = blasters.length - 1; i >= 0; i--) {
		blasters[i].show();
		blasters[i].update();
		if (blasters[i].ttl == 0) {
			blasters.splice(i, 1);
		}
	}
	//ENEMIES
	for (let i = enemies.length - 1; i >= 0; i--) {
		enemies[i].show();
		enemies[i].update(player.x, player.y);
		if (enemies[i]?.crashTimer < 5 || enemies[i].type !== CRASHZONE) {
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
		}
		if (!player.hasSaw || enemies[i].type == BULLET || enemies[i].type === CRASHZONE) {
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
			for (let i = enemies.length - 1; i >= 0; i--) {
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
			breatheTimer = 180;
			enemies = [];
		}
	}
	//////////////
	//Powerup draws
	for (let i = 0; i < fieldUpgrades.length; i++) {
		fieldUpgrades[i].show(fieldUpgrades[i].x, fieldUpgrades[i].y);
		fieldUpgrades[i].showDescription();
		if (fieldUpgrades[i].check(player.x, player.y, player.w) || fieldUpgrades[i].check(saw.x, saw.y, saw.w)) {
			if (fieldUpgrades[i].type == MATCHALATTE || fieldUpgrades[i].type == LIGHTNING) {
				fieldUpgrades[i].activate();
			}
			heldPowerups.push(fieldUpgrades[i]);
			fieldUpgrades = [];
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
				} else if (stage <= BULLETSTAGE) {
					spawnTime -= 2;
				}
			}
			break;
		}
	}
	let modifier = 0;
	for (let i = heldPowerups.length - 1; i >= 0; i--) {
		if (heldPowerups[i].isPerk) {
			continue;
		}
		heldPowerups[i].show(i * (heldPowerups[i].w + 5) + 15 + LEFTWALL - modifier, CEILING + 20);
		if (heldPowerups[i].type == ONEUP) {
			heldPowerups[i].activate();
			heldPowerups.splice(i, 1);
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
	drawScore();

	//When do i show the breathe timer text
	if (breatheTimer > 0 && (score >= stageBreaks[stage] || stage == COLUMNSTAGE || stage == BULLETSTAGE || stage == DREVILSTAGE || stage == TWINSTAGE)) {
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
	drawScore();
	drawButtons(surviveOverButtons);
}

function pauseDraw() {
	push();
	image(menuBackground, LEFTWALL, CEILING, RINGWIDTH, RINGHEIGHT);
	image(grayPanel, RINGWIDTH / 2 + LEFTWALL - 100, RINGHEIGHT / 2 + CEILING - 50, 200, 65);
	textFont(titleFont);
	textAlign(CENTER);
	textSize(32);
	text("Paused", RINGWIDTH / 2 + LEFTWALL, RINGHEIGHT / 2 + CEILING - 10);
	textSize(16);
	textFont(normalFont);
	drawButtons(pauseButtons);
	pop();
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
		checkButtons(menuButtons, mouseX, mouseY);
	} else if (scene == TTOVER) {
		checkButtons(ttOverButtons, mouseX, mouseY);
	} else if (scene == LEVELS) {
		checkButtons(levelButtons, mouseX, mouseY);
	} else if (scene == SURVIVEOVER) {
		checkButtons(surviveOverButtons, mouseX, mouseY);
	} else if (scene == PAUSE) {
		checkButtons(pauseButtons, mouseX, mouseY);
	} else if (scene == SURVIVETUTORIAL) {
		survivalTutorialScreen.button.check(mouseX, mouseY);
	}

}

export function kill(j) {
	if ((enemies[j].type == CHASER || enemies[j].type == STANDER || enemies[j].type == TRACER || enemies[j].type == FROG) && enemies[j].killable && stage != TWINSTAGE) {
		score++;
	}	
	enemies.splice(j, 1);
	// if (scene == TIMETRIAL) {
	// 	spawn(random(LEFTWALL+20, RIGHTWALL-20), random(CEILING+20, FLOOR-20), STANDER);
	// }
	updateEnemyIDs();
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
	} else if (type === CRASHZONE) {
		enemies.push(new Enemy(x, y, 0, CRASHZONE));
	} else {
		enemies.push(new Enemy(x, y, 0, STANDER));
	}
	updateEnemyIDs();
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

function resetLevelButtons() {
	levelButtons = [new Button(RINGWIDTH / 2 + LEFTWALL, FLOOR - 50, 150, 25, "Menu", () => scene = MENU)];
	[0].concat(stageBreaks).forEach((stageScore, index) => {
		const columns = 5;
		const row = Math.floor(index / columns);
		const column = index % columns;
		if (index > latestStage) {
			return;
		}
		levelButtons.push(new Button(LEFTWALL + column * 90 + 100, CEILING + 80 + row * 70 + 50, 80, 40, `Stage ${index + 1}`, () => {
			scene = SURVIVE
			score = stageScore;
			player.hasSaw = true;
			player.x = RINGWIDTH / 2 + LEFTWALL;
			player.y = FLOOR - RINGHEIGHT / 2;
			spawnTime = 50;
			breatheTimer = 1;
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
}

function drawScore() {
	push();
	image(greyButton, RIGHTWALL - 100, CEILING + 20, 80, 20);
	fill(0);
	textAlign(LEFT); // or CENTER if you prefer, but be consistent
	textFont(normalFont);
	strokeWeight(2);
	text("Score: " + score, RIGHTWALL - 95, CEILING + 35);
	pop();
}

function drawButtons(buttonArray) {
	for (let i = 0; i < buttonArray.length; i++) {
		buttonArray[i].show();
	}
}

function checkButtons(buttonArray, mx, my) {
	for (let i = 0; i < buttonArray.length; i++) {
		buttonArray[i].check(mx, my);
	}
}

function resetGameState({ scoreVal = 0, stageVal = 0, playerX, playerY, breathe = -1 }) {
	score = scoreVal;
	player.hasSaw = true;
	player.x = playerX;
	player.y = playerY;
	spawnTime = 50;
	breatheTimer = breathe;
	enemies = [];
	fieldUpgrades = [];
	heldPowerups = [];
	blasters = [];
	stage = stageVal;
	player.lives = 5;
	hurtTimer = 0;
	bosses = [];
	player.setMaxSpeed = player.defaultSpeed;
	player.maxSpeed = player.defaultSpeed;
}

function updateEnemyIDs() {
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].id = i;
	}
}

export function getScene() {
	return scene;
}

export function setScene(newScene) {
	scene = newScene;
}
