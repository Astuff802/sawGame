import { grayPanel, BLASTER, blasters, BREATHER, enemies, FLASH, goToward, kill, LIGHTNING, MATCHALATTE, MOLASSES, ONEUP, player, PRICKLY, RAGE, RETURNER, RICOCHET, saw, score, setScore, TBOUNCE } from "./main";
import { Saw } from "./saw";

export class Powerup {
    constructor(x, y, type, isPerk = false) {
        this.x = x;
        this.y = y;
        this.w = 15;
        this.type = type;
        this.isPerk = isPerk;
        this.description;
        if (this.type == ONEUP) {
            this.description = "One more sell!";
        }
        if (this.type == BLASTER) {
            this.description = "Unleashes phsycic blasts in all directions.";
        }
        if (this.type == RETURNER) {
            this.description = "Call your partner back to you.";
        }
        if (this.type == FLASH) {
            this.description = "Destroy all enemies in a radius around you.";
        }
        if (this.type == PRICKLY) {
            this.description = "Launches projectiles on damage.";
        }
        if (this.type == MOLASSES) {
            this.description = "Covers partner in sticky molases that slows enemies down";
        }
        if (this.type == MATCHALATTE) {
            this.description = "Energizes you to move faster in the ring.";
        }
        if (this.type == RICOCHET) {
            this.description = "Partner will lock on to a nearby enemy after hit.";
        }
        if (this.type == BREATHER) {
            this.description = "Extra time to recover after hit.";
        }
        if (this.type == RAGE) {
            this.description = "Gives extra speed and destroys enemies on touch!";
        }
        if (this.type == TBOUNCE) {
            this.description = "On the partner's fourth bounce they will let out a phsycic blast";
        }
        if(this.type == LIGHTNING){
            this.description = "Will make partner lightning fast, but will stick to walls on 4th bounce.";
        }
    }

    activate() {
        if (this.type == RETURNER) {
            if(saw.gotFar == true){
                saw.return = true;
            }
        }
        if (this.type == FLASH) {
            for (let i = 0; i < enemies.length; i++) {
                if (dist(player.x, player.y, enemies[i].x, enemies[i].y) <= 250 / 2) {
                    kill(i);
                    if (enemies[i].killable) {
                        setScore(score + 1);
                    }
                    i = -1;
                }
            }
        }
        if (this.type == BLASTER) {
            let oldBlasters = blasters.length;
            for (let i = 0; i < 8; i++) {
                blasters.push(new Saw(player.x, player.y, true, 200));
            }
            let targets = [
                createVector(player.x, player.y + 50),
                createVector(player.x + 50, player.y + 50),
                createVector(player.x + 50, player.y),
                createVector(player.x + 50, player.y - 50),
                createVector(player.x, player.y - 50),
                createVector(player.x - 50, player.y - 50),
                createVector(player.x - 50, player.y),
                createVector(player.x - 50, player.y + 50),
            ];
            for (let i = oldBlasters; i < blasters.length; i++) {
                let cringe = goToward(
                    player.x,
                    player.y,
                    targets[i % 8].x + random(-10, 10),
                    targets[i % 8].y + random(-10, 10)
                );
                blasters[i].xSpeed = cringe.x * 4.5;
                blasters[i].ySpeed = cringe.y * 4.5;
            }
        }
        if (this.type == ONEUP) {
            player.lives++;
        }
        if (this.type == PRICKLY) {
            console.log("WRONG");
        }
        if (this.type == MATCHALATTE) {
            player.setMaxSpeed += 0.75; // Increase default speed
            player.maxSpeed = player.setMaxSpeed; // Update current speed
        }
        if (this.type == LIGHTNING) {
            saw.defaultSpeed = 50;
        }
        if (this.type == RAGE) {
            player.rageTimer += 300;
        }

        if (this.type == TBOUNCE) {
            let oldBlasters = blasters.length;
            for (let i = 0; i < 8; i++) {
                blasters.push(new Saw(saw.x, saw.y, true, 200));
            }
            let targets = [
                createVector(player.x, player.y + 50),
                createVector(player.x + 50, player.y + 50),
                createVector(player.x + 50, player.y),
                createVector(player.x + 50, player.y - 50),
                createVector(player.x, player.y - 50),
                createVector(player.x - 50, player.y - 50),
                createVector(player.x - 50, player.y),
                createVector(player.x - 50, player.y + 50),
            ];
            for (let i = oldBlasters; i < blasters.length; i++) {
                let cringe = goToward(
                    player.x,
                    player.y,
                    targets[i % 8].x + random(-10, 10),
                    targets[i % 8].y + random(-10, 10)
                );
                blasters[i].xSpeed = cringe.x * 4.5;
                blasters[i].ySpeed = cringe.y * 4.5;
            }
        }
    }

    check(x, y, w) {
        if (dist(this.x, this.y, x, y) <= this.w / 2 + w / 2) {
            return true;
        }
    }

    show(x, y) {
        if (this.type == RETURNER) {
            push();
            fill(0, 255, 0);
            ellipse(x, y, this.w, this.w);
            pop();
        } else if (this.type == FLASH) {
            push();
            fill(0, 0, 255);
            rectMode(CENTER);
            rect(x, y, this.w, this.w);
            pop();
        } else if (this.type == BLASTER) {
            push();
            fill(255, 0, 0);
            rectMode(CENTER);
            rect(x, y, this.w, this.w);
            pop();
        } else if (this.type == ONEUP) {
            push();
            fill(255, 0, 0);
            ellipse(x, y, this.w / 1.2, this.w / 1.2);
            pop();
        } else if (this.type == RAGE) {
            push();
            rectMode(CENTER);
            fill(255, 0, 0);
            rect(x, y, this.w, this.w / 2);
            pop();
        }
    }

    showDescription() {
        push();
        imageMode(CENTER);
        image(grayPanel, this.x, this.y - 75, 125, 100);
        textAlign(CENTER);
        text(this.description, this.x - 55, this.y - 105, 110);
        pop();

        if (this.isPerk) {
            push();
            rectMode(CENTER);
            rect(this.x, this.y, 20, 20);
            pop();
        }
    }
}
