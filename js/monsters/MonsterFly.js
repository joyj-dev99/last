import Monster from "./Monster.js";
import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterFly extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'fly',
            frame: 'giant_fly_sprite_sheet_0',//fly_idle_01
            monsterType: 'fly',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -2,
            hp: 40,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 2.5,
            oneMove: 30,
            maxMove: 100,
            followDistance: 150,
            player: player
        });
        this.attackEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.monsterAttackPlayerBySkill,
            callbackScope: this,
            loop: true
        });
    }

    monsterAttackPlayerBySkill() {
        if (this.isBattleStared === true && this.isFollowing === true && this.hp > 0) {
            // 목표물까지의 각도 계산
            let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x - 5, this.player.y);
            let speed = 50;
            // 속도 계산
            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;
            // 몬스터에 속도 적용
            this.setVelocity(velocityX, velocityY);
        }
    }

    destroy() {
        this.attackEvent.remove();
        super.destroy();
    }
}