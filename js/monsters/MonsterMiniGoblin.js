import Monster from "./Monster.js";
import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY,
    MONSTER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterMiniGoblin extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'mini_goblin',
            frame: 'mini_goblin_sprite_sheet_0',
            monsterType: 'mini_goblin',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -6,
            hp: 120,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove: 30,
            maxMove: 100,
            followDistance: 80,
            player: player
        });
        this.attackEvent = this.scene.time.addEvent({
            delay: 5000,
            callback: this.monsterAttackPlayerBySkill,
            callbackScope: this,
            loop: true
        });

    }

    monsterAttackPlayerBySkill() {
        if (this.isBattleStared === true && this.hp > 0 && this.isFollowing === true) {
            // 충격파 생성
            this.anims.play(`${this.monsterType}_attack`)
            this.scene.time.delayedCall(500, () => {
                this.scene.cameras.main.shake(500, 0.01);  // (지속 시간(ms), 강도)
                this.shockwave = this.scene.matter.add.image(this.x, this.y, 'goblin_shockwave', null, {
                    shape: 'circle'
                });
                this.shockwave.setScale(0.001);
                this.shockwave.setAlpha(0.1);
                this.shockwave.damage = 0.5;
                // 충돌 카테고리 설정
                this.shockwave.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
                this.shockwave.setCollidesWith([PLAYER_CATEGORY]);
                // 충격파 확장 애니메이션
                this.scene.tweens.add({
                    targets: this.shockwave,
                    scaleX: 0.05,
                    scaleY: 0.05,
                    hold: 2000,
                    alpha: 1, // 점점 투명해짐
                    duration: 0,
                    onComplete: () => {
                        this.shockwave.destroy(); // 애니메이션이 끝나면 충격파 제거
                    }
                });
                this.scene.setCollisionOfMonsterShortAttack(this.shockwave);
            });
        }
    }

    destroy() {
        this.shockwave.destroy();
        this.attackEvent.remove();
        super.destroy();
    }
}