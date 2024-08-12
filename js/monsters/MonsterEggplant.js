import Monster from "./Monster.js";
import {MONSTER_CATEGORY, PLAYER_CATEGORY, TILE_CATEGORY, MONSTER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterEggplant extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;

        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'eggplant',
            frame: 'eggplant_idle_01',
            monsterType: 'eggplant',
            bodyWidth: 16,
            bodyHeight: 16,
            centreX: 0,
            centreY: -6,
            hp: 100,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 80,
            speed: 2,
            oneMove: 30,
            maxMove: 100,
            followDistance: 100,
            player: player
        });

        this.bullets = this.scene.add.group();
        this.isShoting = true;
        this.shotingRate = 3000; // 발사 간격 (밀리초)
        this.bulletSpeed = 2;
        this.bulletDuration = 2000;
        this.bulletDistance = 200;

    }
    
    update() {
        super.update();
        if (this.isFollowing) {
            const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
            if (distanceToPlayer < this.reach) {
                if (this.isShoting) {
                    this.isShoting = false;
                    this.actionAmin('attack');
                    this.shootBullet(this.player);
                }
            }
        }
        this.bullets.getChildren().forEach(bullet => {
            const bulletDistance = Phaser.Math.Distance.Between(bullet.startX, bullet.startY, bullet.x, bullet.y);
            const elapsedTime = this.scene.time.now - bullet.creationTime;
            if (bulletDistance > this.bulletDistance || elapsedTime > this.bulletDuration) {
                // this.bullets.remove(bullet, true, true);
                bullet.destroy();
            }
        });
    }

    shootBullet(player) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        let bullet = this.scene.matter.add.image(this.x, this.y, 'eggplant', 'eggplant_egg_move_01');
        bullet.setBody({
            type: 'circle',
            radius: 5, // 반지름을 작게 설정하여 충돌 범위 축소
        });
        bullet.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
        bullet.setCollidesWith([PLAYER_CATEGORY]);
        bullet.setFixedRotation();
        bullet.setFrictionAir(0);
        bullet.setAngle(Phaser.Math.RadToDeg(angle));
        bullet.setVelocity(Math.cos(angle) * this.bulletSpeed, Math.sin(angle) * this.bulletSpeed);
        bullet.startX = this.x;
        bullet.startY = this.y;
        bullet.damage = 0.5;
        bullet.creationTime = this.scene.time.now;
        this.bullets.add(bullet);
        this.scene.setCollisionOfMonsterAttack(bullet);
        // 몇초마다 한번씩 발사하도록 하는 변수
        this.scene.time.delayedCall(this.shotingRate, () => {
            this.isShoting = true;
        });

    }

    itemDrop() {
    }

}