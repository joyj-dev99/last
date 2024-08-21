import Monster from "./Monster.js";
import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterBugbear extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'bugbear',
            frame: 'bugbear_sprite_sheet_0',
            monsterType: 'bugbear',
            bodyWidth: 40,
            bodyHeight: 46,
            centreX: 0,
            centreY: -10,
            hp: 300,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove: 30,
            maxMove: 100,
            followDistance: 200,
            player: player
        });
        this.defaultHpX = 20;
        this.defaultHpY = 30;
        this.healthBarWidth = 40;
        this.isArmor = true;
        this.attackEvent = this.scene.time.addEvent({
            delay: 5000,
            callback: this.monsterAttackPlayerBySkill,
            callbackScope: this,
            loop: true
        });
    }

    monsterAttackPlayerBySkill() {
        if (this.isBattleStared === true && this.isArmor === true && this.isFollowing === true) {
            this.isArmor = false;
            this.setStatic(true)
            this.anims.play(`${this.monsterType}_block2`, true);
            this.scene.time.delayedCall(7000, () => {
                this.anims.play(`${this.monsterType}_move`, true);
                this.setStatic(false)
                this.isArmor = true;
            });
        }
    }
}