import { slimeWalks, spikeBalls, allRobots, BULLET, BULLETBARRIER, CEILING, CHASER, DREVILSTAGE, equilateral, FROG, goToward, heldPowerups, kill, LEFTWALL, MOLASSES, player, RINGHEIGHT, RINGWIDTH, getScene, setScene, stage, STANDER, SURVIVE, TRACER, CRASHZONE, menuBackground, greyButton } from "./main";
import { Button } from "./button.js";


export class TutorialScreen {
    constructor(text, nextScene) {
        this.text = text;
        this.nextScene = nextScene; 
        this.width = RINGWIDTH;
        this.height = RINGHEIGHT;
        this.button = new Button(LEFTWALL + (RINGWIDTH / 2), CEILING + (RINGHEIGHT - 100), 200, 50, "Continue", () => {
            console.log('Changing');
            setScene(this.nextScene);
        });
    }

    draw(){
        push();
            image(menuBackground, LEFTWALL, CEILING, RINGWIDTH, RINGHEIGHT);
            image(greyButton, LEFTWALL + (RINGWIDTH / 2) - 200, CEILING + 160, 400, 250);
            textAlign(CENTER, CENTER);
            text(this.text, this.width / 2 + LEFTWALL, this.height / 2 + CEILING);
            this.button.show();
        pop();
    }
}
