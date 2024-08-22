import Monster from "./Monster.js";
import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY, MONSTER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterBossWolfgang extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, player} = data;
        super(scene.matter.world, x, y, 'wolfgang', 'wolfgang_sprite_sheet_0');
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;
        this.monsterType = 'wolfgang';
        this.bodyWidth = 16;
        this.bodyHeight = 22;
        this.centreX = 0;
        this.centreY = -2;
        this.initHp = 500;
        this.hp = 500;
        this.damage = 0;
        this.speed = 0.5;
        this.followDistance = 150;

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
        this.bulletSpeed = 0.05;
        this.bulletDuration = 6000;
        this.bulletDistance = 1000;
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.makeMonster = null;

        this.healthBarWidth = 120;
        this.healthBarHeight = 8;
        this.healthBarBack = this.scene.add.graphics();
        this.healthBar = this.scene.add.graphics();
        // 초기 프레임 설정
        this.healthBar.setScrollFactor(0);
        this.healthBarBack.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBarBack.setDepth(1001);

        this.scene.add.text(this.scene.sys.game.config.width / 4 - 10, 5, `울프강`, {
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
        scene.load.atlas('wolfgang', 'assets/monster/Wolfgang/wolfgang.png', 'assets/monster/Wolfgang/wolfgang_atlas.json');
        scene.load.animation('wolfgangAnim', 'assets/monster/Wolfgang/wolfgang_anim.json');

        scene.load.atlas('explode_flask', 'assets/monster/Wolfgang/explode_flask/explode_flask.png', 'assets/monster/Wolfgang/explode_flask/explode_flask_atlas.json');
        scene.load.animation('explodeFlaskAnim', 'assets/monster/Wolfgang/explode_flask/explode_flask_anim.json');

        scene.load.atlas('acid_flask', 'assets/monster/Wolfgang/acid_flask/acid_flask.png', 'assets/monster/Wolfgang/acid_flask/acid_flask_atlas.json');
        scene.load.animation('acidFlaskAnim', 'assets/monster/Wolfgang/acid_flask/acid_flask_anim.json');

        scene.load.atlas('poison_cloud', 'assets/monster/Wolfgang/poison_cloud__flask/poison_cloud.png', 'assets/monster/Wolfgang/poison_cloud__flask/poison_cloud_atlas.json');
        scene.load.animation('poisonCloudFlaskAnim', 'assets/monster/Wolfgang/poison_cloud__flask/poison_cloud_anim.json');

        scene.load.image('wolfgang_missile', 'assets/monster/Wolfgang/wolfgang_missile.png')
        scene.load.image('wolfgang_missile_hit', 'assets/monster/Wolfgang/wolfgang_missile_hit.png')
    }

    update() {
        if (!this.isAlive) return;
        this.updateHpState()
        this.guideMissile();

        this.timeOutBullets()
        this.monsterDistanceControlPlayer();
    }

    updateHpState() {
        this.healthBarBack.clear();
        this.healthBar.clear();
        this.healthBarBack.fillStyle(0x000000);
        this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, this.healthBarWidth, this.healthBarHeight);
        let healthWidth = (this.hp / this.initHp) * this.healthBarWidth;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, healthWidth, this.healthBarHeight);
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
        } else if (0 <= distanceToTarget && distanceToTarget < 130) {
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
        this.anims.play(`${this.monsterType}_laugh`, true);
    }

    handleAnimationComplete(animation) {
        if (animation.key === `${this.monsterType}_button_press`) {
            this.wolfgangShootBullet();
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_throw_red_flask`) {
            this.anims.play(`explode_flask`, true);
        } else if (animation.key === `${this.monsterType}_throw_green_flask`) {
            this.anims.play(`acid_flask`, true);
        } else if (animation.key === `${this.monsterType}_throw_purple_flask`) {
            this.anims.play(`poison_cloud__flask`, true);
        } else if (animation.key === `explode_flask`) {
            this.makeMonster = 'pumpkin';
            this.scene.doMakeBoss(this.makeMonster);
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `acid_flask`) {
            this.makeMonster = 'goblin';
            this.scene.doMakeBoss(this.makeMonster);
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `poison_cloud__flask`) {
            this.makeMonster = 'necromancer';
            this.scene.doMakeBoss(this.makeMonster);
            this.attackEvent.delay = 2000;
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_laugh`) {
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_damage`) {
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_death`) {
            this.destroy();
        }

    }

    monsterAttackPlayerBySkill() {
        this.anims.play(`${this.monsterType}_button_press`, true);
        if (this.hp <= this.initHp / 2) {
            if (this.makeMonster === null) {
                this.anims.play(`${this.monsterType}_throw_red_flask`, true);
            } else if (this.makeMonster === 'pumpkin') {
                this.anims.play(`${this.monsterType}_throw_green_flask`, true);
            } else if (this.makeMonster === 'goblin') {
                this.anims.play(`${this.monsterType}_throw_purple_flask`, true);
            }
        }
    }

    minotaurShockWave() {
        // this.scene.setMinotaurShockWave();
    }

    wolfgangShootBullet() {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
        let bullet = this.scene.matter.add.image(this.x, this.y, 'wolfgang_missile');
        bullet.setBody({
            radius: 5, // 반지름을 작게 설정하여 충돌 범위 축소
        });
        bullet.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
        bullet.setCollidesWith([PLAYER_CATEGORY, OBJECT_CATEGORY]);
        bullet.setFixedRotation();
        bullet.setFrictionAir(0);
        bullet.setMass(1);
        bullet.setScale(0.02);
        bullet.setFriction(0.1);
        bullet.setAngle(Phaser.Math.RadToDeg(angle));
        bullet.setVelocity(Math.cos(angle) * this.bulletSpeed, Math.sin(angle) * this.bulletSpeed);
        bullet.startX = this.x;
        bullet.startY = this.y;
        bullet.damage = 0.5;
        bullet.creationTime = this.scene.time.now;
        this.bullets.add(bullet);
        this.scene.setCollisionOfMonsterLongAttack(bullet);

    }

    guideMissile() {
        let turnSpeed = 0.05;
        // 목표물까지의 각도 계산
        this.bullets.children.each(bullet => {
            let angleToTarget = Phaser.Math.Angle.Between(bullet.x, bullet.y, this.player.x, this.player.y);
            let missileAngle = bullet.rotation;
            let angleDiff = Phaser.Math.Angle.Wrap(angleToTarget - missileAngle);
            if (Math.abs(angleDiff) > turnSpeed) {
                bullet.setAngularVelocity(turnSpeed * Math.sign(angleDiff));
            } else {
                bullet.setAngularVelocity(0);
                bullet.rotation = angleToTarget;
            }
            let velocityX = Math.cos(bullet.rotation) * 2;
            let velocityY = Math.sin(bullet.rotation) * 2;
            bullet.setVelocity(velocityX, velocityY);
        }, this);


        // 미사일의 현재 각도 계산


        // 미사일이 목표를 향해 회전하도록 조정

    }

    takeDamage(amount) {
        console.log('takeDamage 실행됨', this.monsterType, amount);
        this.hp -= amount;
        console.log('monster HP', this.hp)

        if (this.hp > 0 && this.anims.currentAnim.key === `${this.monsterType}_move`) {
            this.anims.play(`${this.monsterType}_damage`, true);
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
        if (this.bullets) {
            this.bullets.children.each(bullet => {
                const bulletDistance = Phaser.Math.Distance.Between(bullet.startX, bullet.startY, bullet.x, bullet.y);
                const elapsedTime = this.scene.time.now - bullet.creationTime;
                if (bulletDistance > this.bulletDistance || elapsedTime > this.bulletDuration || bullet.x > this.mapSize - 10 || bullet.x <= 10 || bullet.y > this.mapSize - 10 || bullet.y <= 10) {
                    bullet.destroy();
                }
            }, this);
        }
    }

    destroyBullets() {
        if (this.bullets) {
            this.bullets.children.each(bullet => {
                bullet.destroy();
            }, this);
        }
    }
}