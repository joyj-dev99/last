import Monster from "./Monster.js";
import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY, MONSTER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterGolem extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'golem',
            frame: 'arcane_golem_tileset_0',
            monsterType: 'golem',
            bodyWidth: 50,
            bodyHeight: 62,
            centreX: 0,
            centreY: -18,
            hp: 200,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove: 30,
            maxMove: 100,
            followDistance: 150,
            player: player
        });

        this.defaultHpX = 26;
        this.defaultHpY = 50;
        this.healthBarWidth = 52;

        this.scene.anims.create({
            key: 'beam',
            frames: [
                {key: 'golem_beam', frame: 'energy_beam_sprite_sheet_0'},
                {key: 'golem_beam', frame: 'energy_beam_sprite_sheet_1'},
                {key: 'golem_beam', frame: 'energy_beam_sprite_sheet_2'}
            ],
            frameRate: 10,
            repeat: 0
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
            this.setStatic(true)
            this.golemBeam = this.scene.matter.add.sprite(0, 0, 'beam')
            this.golemBeam.setBody({
                type: 'rectangle',
                width: this.golemBeam.width + 20,
                height: this.golemBeam.height + 30
            });
            let toTarget = new Phaser.Math.Vector2(this.player.x - this.x, this.player.y - this.y);
            toTarget.normalize();
            if (toTarget.x < 0) {
                this.golemBeam.setPosition(this.x - 30, this.y + 20);
                this.golemBeam.setFlipX(true);
            } else {
                this.golemBeam.setPosition(this.x + 30, this.y + 20);
                this.golemBeam.setFlipX(false);
            }
            this.golemBeam.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
            this.golemBeam.setCollidesWith( [PLAYER_CATEGORY]);
            this.golemBeam.setFixedRotation();
            this.golemBeam.setStatic(true)
            this.golemBeam.setFrictionAir(0);
            this.golemBeam.damage = 0.5;
            this.golemBeam.play('beam');
            this.scene.setCollisionOfMonsterShortAttack(this.golemBeam);

            this.scene.time.delayedCall(600, () => {
                this.golemBeam.destroy();
                this.setStatic(false)
            });
        }
    }

    destroy() {
        this.attackEvent.remove();
        this.golemBeam.destroy();
        super.destroy();
    }

}