import Monster from "./Monster.js";
import {MONSTER_CATEGORY, PLAYER_CATEGORY, TILE_CATEGORY, MONSTER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterSpider extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'spider',
            frame: 'spider_sprite_sheet_0',
            monsterType: 'spider',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -10,
            hp: 60,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 80,
            speed: 1,
            oneMove: 30,
            maxMove: 100,
            followDistance: 120,
            player: player
        });
        this.setScale(-1, 1);
        this.bullets = this.scene.add.group();
        this.isShoting = true;
        this.shotingRate = 3000; // 발사 간격 (밀리초)
        this.bulletSpeed = 2;
        this.bulletDuration = 1000;
        this.bulletDistance = 100;
    }

    update() {
        super.update();
        if (this.isFollowing) {
            const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
            if (distanceToPlayer < this.reach) {
                if (this.isShoting) {
                    this.isShoting = false;
                    this.monsterAttackPlayer();
                    this.shootBullet(this.player);
                }
            }
        }

        this.timeOutBullets()
    }

    timeOutBullets() {
        this.bullets.getChildren().forEach(bullet => {
            const bulletDistance = Phaser.Math.Distance.Between(bullet.startX, bullet.startY, bullet.x, bullet.y);
            const elapsedTime = this.scene.time.now - bullet.creationTime;
            if (bulletDistance > this.bulletDistance || elapsedTime > this.bulletDuration) {
                const web = this.scene.matter.add.image(bullet.x, bullet.y, 'spider', 'spider_sprite_sheet_68', {
                    shape: 'circle'
                });
                web.setStatic(true);
                web.setAlpha(1);
                web.damage = 0;
                // 충돌 카테고리 설정
                web.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
                web.setCollidesWith([PLAYER_CATEGORY]);
                // 충격파 확장 애니메이션
                this.scene.tweens.add({
                    targets: web,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    alpha: 0.2, // 점점 투명해짐
                    duration: 3000,
                    onComplete: () => {
                        web.destroy();
                    }
                });
                this.scene.setCollisionOfMonsterShortAttack(web);
                bullet.destroy();
            }
        });
    }

    shootBullet(player) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        let bullet = this.scene.matter.add.sprite(this.x, this.y, 'spider', 'spider_sprite_sheet_63');
        bullet.play('web', true);
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
        bullet.damage = 0;
        bullet.creationTime = this.scene.time.now;
        this.bullets.add(bullet);
        this.scene.setCollisionOfMonsterLongAttack(bullet);
        // 몇초마다 한번씩 발사하도록 하는 변수
        this.scene.time.delayedCall(this.shotingRate, () => {
            this.isShoting = true;
        });
    }

    destroy() {
        super.destroy();
        this.destroyBullets();
    }

    destroyBullets() {
        this.bullets.children.each(bullet => {
            bullet.destroy();
        }, this);
    }

}