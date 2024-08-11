import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterTomato extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'tomato',
            frame: 'tomato_idle_01',
            monsterType: 'tomato',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -6,
            hp: 60,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove : 30,
            maxMove : 100,
            followDistance : 70,
            player: player
        });
    }

    takeDamage(amount) {
        console.log('takeDamage 실행됨');
        if (!this.isHurt) {
            this.isHurt = true;
            this.hp -= amount;
            console.log('monster HP', this.hp)
            if (this.hp > 0) {
                this.actionAmin('damage');
                this.scene.time.delayedCall(1000, () => {
                    this.isHurt = false;
                });
            } else {
                this.isAlive = false;
                this.moveEvent.destroy();
                this.hp = 0;
                this.setCollidesWith([TILE_CATEGORY]);
                this.anims.play('tomato_death');
                this.scene.time.delayedCall(1000, () => {
                    this.destroy();
                });
                return 'destroy';
            }
        }
    }
}