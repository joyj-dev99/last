import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY, MONSTER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterBossAlchemist extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, player} = data;
        super(scene.matter.world, x, y, 'alchemist', 'alchemist_sprite_sheet_0');
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;
        this.monsterType = 'alchemist';
        this.bodyWidth = 16;
        this.bodyHeight = 22;
        this.centreX = 0;
        this.centreY = -2;
        this.initHp = 500;
        this.hp = 500;
        this.damage = 0;
        this.speed = 1.5;
        this.followDistance = 120;

        this.scene.add.existing(this);
        this.mapSize = 480;
        // 최초 생성시 왼쪽을 바라보도록.
        this.setFlipX(true);
        this.setDepth(10);
        // 충돌체 생성
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        this.Body = Body;
        this.monsterCollider = Bodies.rectangle(this.x, this.y, this.bodyWidth, this.bodyHeight, {
            isSensor: false,
            label: `${this.monsterType}Collider`
        });

        const compoundBody = Body.create({
            parts: [this.monsterCollider],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        // 충돌체 중심점 이동 (상대적 위치로 이동함)
        Body.setCentre(this.body, {x: this.centreX, y: this.centreY}, true);

        // 애니메이션 재생
        this.anims.play(`${this.monsterType}_idle`, true);
        console.log("몬스터 생성: ", this.monsterType, x, y);

        this.setCollisionCategory(MONSTER_CATEGORY);
        this.setCollidesWith([PLAYER_CATEGORY, PLAYER_ATTACK_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY]);

        this.isAlive = true;
        this.initialX = x;
        this.initialY = y;
        this.target = new Phaser.Math.Vector2(this.x, this.y);

        this.bullets = this.scene.add.group();
        this.isShoting = true;
        this.shotingRate = 3000; // 발사 간격 (밀리초)
        this.bulletSpeed = 2;
        this.bulletDuration = 1500;
        this.bulletDistance = 100;
        this.bulletAngles = [0, -30, 30];
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);


        this.healthBarWidth = 120;
        this.healthBarHeight = 8;
        this.healthBarBack = this.scene.add.graphics();
        this.healthBar = this.scene.add.graphics();
        // 초기 프레임 설정
        this.healthBar.setScrollFactor(0);
        this.healthBarBack.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBarBack.setDepth(1001);

        this.scene.add.text(this.scene.sys.game.config.width / 4 + this.healthBarWidth, 5, `알케미스트`, {
            fontFamily: 'Galmuri11, sans-serif',
            fontSize: '12px',
            fill: '#000',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            padding: {x: 10}
        }).setScrollFactor(0).setDepth(1001);

        //     지금 안쓰는 변수들은 아래
        this.isMoving = false;
        this.isFollowing = false;
        this.isReturning = false;
        this.state = 'idle'; // 현재 상태
        this.isBattleStared = false;
        this.isKnockBack = false;

    }

    static preload(scene) {
        scene.load.atlas('minotaur', 'assets/monster/minotaur/minotaur.png', 'assets/monster/minotaur/minotaur_atlas.json');
        scene.load.animation('minotaurAnim', 'assets/monster/minotaur/minotaur_anim.json');

        scene.load.atlas('alchemist_transform', 'assets/monster/alchemist/tramsform/alchemist_transform.png', 'assets/monster/alchemist/tramsform/alchemist_transform_atlas.json');
        scene.load.animation('alchemist_transformAnim', 'assets/monster/alchemist/tramsform/alchemist_transform_anim.json');

        scene.load.atlas('alchemist', 'assets/monster/alchemist/alchemist.png', 'assets/monster/alchemist/alchemist_atlas.json');
        scene.load.animation('alchemistAnim', 'assets/monster/alchemist/alchemist_anim.json');

        scene.load.image('alchemist_poison', 'assets/monster/alchemist/alchemist_poison.png');

    }


    update() {
        if (this.monsterType === 'alchemist' && this.initHp / 2 >= this.hp) {
            this.monsterType = 'minotaur';
            this.transformMinotaur();
            return;
        }

        // 몬스터가 죽었으면 update 실행하지 않음
        if (!this.isAlive) return;
        this.updateHpState()
        this.timeOutBullets()
        this.monsterDistanceControlPlayer();

    }

    transformMinotaur() {
        this.followDistance = 5;
        this.speed = 1;
        this.damage = 0.5;
        this.initHp = this.initHp * 5
        this.hp = this.initHp;
        this.Body.scale(this.monsterCollider, 2, 2);
        this.Body.setCentre(this.body, {x: this.centreX, y: 8}, true);
        this.attackEvent.delay = 8000;
        this.setStatic(true);
        this.anims.play('transform__into__the__minotaur');
    }

    updateHpState() {
        this.healthBarBack.clear();
        this.healthBar.clear();
        this.healthBarBack.fillStyle(0x000000);
        this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 + this.healthBarWidth, 20, this.healthBarWidth, this.healthBarHeight);
        let healthWidth = (this.hp / this.initHp) * this.healthBarWidth;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(this.scene.sys.game.config.width / 4 + this.healthBarWidth, 20, healthWidth, this.healthBarHeight);
    }

    monsterDistanceControlPlayer() {
        this.target.x = this.player.x;
        this.target.y = this.player.y;

        // taget까지 거리 및 속도 계산
        const speed = this.speed;
        let monsterVelocity = new Phaser.Math.Vector2();
        let toTarget = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        let distanceToTarget = toTarget.length();
        if (distanceToTarget > this.followDistance) {
            toTarget.normalize();
            monsterVelocity = toTarget.scale(speed);
            if (toTarget.x < 0) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }
            this.setVelocity(monsterVelocity.x, monsterVelocity.y);
        } else if (0 <= distanceToTarget && distanceToTarget < 110 && this.monsterType === 'alchemist') {
            const dx = this.x - this.player.x;
            const dy = this.y - this.player.y;
            if (dx > 0) {
                this.setVelocityX(speed * 2);
            } else {
                this.setVelocityX(-speed * 2);
            }
            if (dy > 0) {
                this.setVelocityY(speed * 2);
            } else {
                this.setVelocityY(-speed * 2);
            }
        }
    }


    startBattle() {
        this.attackEvent = this.scene.time.addEvent({
            delay: 4000,
            callback: this.monsterAttackPlayerBySkill,
            callbackScope: this,
            loop: true
        });
        this.isBattleStared = true;
        this.anims.play(`${this.monsterType}_move`, true);
    }

    monsterAttackPlayer() {
        // 네크로멘서랑 같은 어깨빵에서는 약한 사람일뿐.
        if (this.monsterType === 'minotaur') {
            if (this.anims.currentAnim.key !== `${this.monsterType}_attack4`) {
                this.anims.play(`${this.monsterType}_attack4`, true);
            }
        }
    }

    handleAnimationComplete(animation) {
        if (animation.key === `${this.monsterType}_throw_flask`) {
            this.scene.time.delayedCall(100, () => {
                this.setStatic(false);
                this.anims.play(`${this.monsterType}_move`, true);
            });
        } else if (animation.key === 'transform__into__the__minotaur') {
            this.scene.time.delayedCall(1000, () => {
                this.anims.play(`${this.monsterType}_move`, true);
                this.anims.play(`${this.monsterType}_attack3`);
            });
            this.scene.time.delayedCall(2000, () => {
                this.setStatic(false)
                this.anims.play(`${this.monsterType}_move`, true);
            });
        } else if (animation.key === `${this.monsterType}_attack1`) {
            this.scene.time.delayedCall(100, () => {
                this.setStatic(false);
                this.anims.play(`${this.monsterType}_move`, true);
            });
        } else if (animation.key === `${this.monsterType}_attack4`) {
            this.scene.time.delayedCall(100, () => {
                this.anims.play(`${this.monsterType}_move`, true);
            });
        } else if (animation.key === `${this.monsterType}_damage`) {
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_damage2`) {
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_death`) {
            this.destroy();
        }

    }

    monsterAttackPlayerBySkill() {
        if (this.monsterType == 'alchemist') {
            this.anims.play(`${this.monsterType}_throw_flask`);
            this.alchemistShootBullet();
        } else if (this.monsterType == 'minotaur') {
            this.setStatic(true);
            this.anims.play(`${this.monsterType}_attack1`);
            this.scene.time.delayedCall(2000, () => {
                this.minotaurShockWave();
                this.scene.cameras.main.shake(2000, 0.02);
            });

        }
    }

    minotaurShockWave() {
        this.scene.setMinotaurShockWave();
    }

    alchemistShootBullet() {
        this.setStatic(true);
        for (let i = 0; i < this.bulletAngles.length; i++) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y + this.bulletAngles[i]);
            let bullet = this.scene.matter.add.image(this.x, this.y, 'alchemist', 'alchemist_sprite_sheet_56');
            bullet.setBody({
                type: 'circle',
                radius: 5, // 반지름을 작게 설정하여 충돌 범위 축소
            });
            bullet.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
            bullet.setCollidesWith([PLAYER_CATEGORY]);
            bullet.setFixedRotation();
            bullet.setFrictionAir(0);
            bullet.setFriction(0.1);
            bullet.setAngle(Phaser.Math.RadToDeg(angle));
            bullet.setVelocity(Math.cos(angle) * this.bulletSpeed, Math.sin(angle) * this.bulletSpeed);
            bullet.startX = this.x;
            bullet.startY = this.y;
            bullet.damage = 0.5;
            bullet.creationTime = this.scene.time.now;
            this.bullets.add(bullet);
            this.scene.setCollisionOfMonsterLongAttack(bullet);
            this.setStatic(false);
        }
    }

    takeDamage(amount) {
        console.log('takeDamage 실행됨', this.monsterType, amount);
        this.hp -= amount;
        console.log('monster HP', this.hp)

        if (this.hp > 0 && this.anims.currentAnim.key === `${this.monsterType}_move`) {
            if (this.monsterType === 'minotaur') {
                this.anims.play(`${this.monsterType}_damage2`, true);
            } else {
                this.anims.play(`${this.monsterType}_damage`, true);
            }

        } else if (this.hp <= 0) {
            this.setCollidesWith([TILE_CATEGORY]);
            this.destroyBullets();
            this.isAlive = false;
            this.attackEvent.destroy();
            this.hp = 0;
            this.anims.play(`${this.monsterType}_death`);
            this.healthBar.destroy();
            this.healthBarBack.destroy();
            return 'death';
        }
    }

    timeOutBullets() {
        this.bullets.children.each(bullet => {
            const bulletDistance = Phaser.Math.Distance.Between(bullet.startX, bullet.startY, bullet.x, bullet.y);
            const elapsedTime = this.scene.time.now - bullet.creationTime;
            if (bulletDistance > this.bulletDistance || elapsedTime > this.bulletDuration) {
                const poison = this.scene.matter.add.image(bullet.x, bullet.y, 'alchemist_poison', null, {
                    shape: 'circle'
                });
                poison.setStatic(true);
                poison.setScale(0.001);
                poison.setAlpha(1);
                poison.damage = 0.5;
                // 충돌 카테고리 설정
                poison.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
                poison.setCollidesWith([PLAYER_CATEGORY]);
                // 충격파 확장 애니메이션
                this.scene.tweens.add({
                    targets: poison,
                    scaleX: 0.05,
                    scaleY: 0.05,
                    alpha: 0.2, // 점점 투명해짐
                    duration: 3000,
                    onComplete: () => {
                        poison.destroy();
                    }
                });
                this.scene.setCollisionOfMonsterShortAttack(poison);
                bullet.destroy();

            } else if (bullet.x > this.mapSize - 10 || bullet.x <= 10 || bullet.y > this.mapSize - 10 || bullet.y <= 10) {
                bullet.destroy();

            }
        }, this);
    }

    destroyBullets() {
        this.bullets.children.each(bullet => {
            bullet.destroy();
        }, this);
    }

}
