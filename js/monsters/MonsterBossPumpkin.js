import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY, MONSTER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterBossPumpkin extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, player} = data;
        super(scene.matter.world, x, y, 'pumpkin', 'giant_pumpkin_sprite_sheet_0');
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;
        this.monsterType = 'pumpkin';
        this.bodyWidth = 48;
        this.bodyHeight = 42;
        this.centreX = 0;
        this.centreY = -26;
        this.initHp = 250;
        this.hp = 250;
        this.damage = 0.5;
        this.reach = 30;
        this.speed = 1;
        this.oneMove = 10;
        this.speed = 1;
        this.maxMove = 10;
        this.followDistance = 400;
        this.scene.add.existing(this);

        // 최초 생성시 왼쪽을 바라보도록.
        this.setFlipX(true);

        // 충돌체 생성
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
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
        this.setCollidesWith([PLAYER_CATEGORY, PLAYER_ATTACK_CATEGORY]);

        this.isBattleStared = false;

        this.isMoving = false;
        this.isFollowing = false;
        this.isHurt = false;
        this.isReturning = false;
        this.isAlive = true;
        this.state = 'idle'; // 현재 상태
        // 위치 설정
        this.initialX = x;
        this.initialY = y;
        this.target = new Phaser.Math.Vector2(this.x, this.y);
        //
        this.bullets = this.scene.add.group();
        this.isShoting = true;
        this.shotingRate = 3000; // 발사 간격 (밀리초)
        this.bulletSpeed = 3;
        this.bulletDuration = 2000;
        this.bulletDistance = 400;
        this.totalBullets = 36;
        this.angleStep = 360 / this.totalBullets;
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.healthBarBack = this.scene.add.graphics();
        this.healthBar = this.scene.add.graphics();
        // 초기 프레임 설정
        this.healthBar.setScrollFactor(0);
        this.healthBarBack.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBarBack.setDepth(1001);

        this.pumpkinShockwaveSound = this.scene.sound.add(`pumpkin_shockwave`, {
            volume: 0.3 // Set the volume (0 to 1)
        });
        this.pumpkinSeedSound = this.scene.sound.add(`pumpkin_seed`, {
            volume: 0.3 // Set the volume (0 to 1)
        });

    }

    static preload(scene) {
        scene.load.atlas('pumpkin', 'assets/monster/pumpkin/pumpkin.png', 'assets/monster/pumpkin/pumpkin_atlas.json');
        scene.load.animation('pumpkinAnim', 'assets/monster/pumpkin/pumpkin_anim.json');

        scene.load.atlas('seed', 'assets/monster/pumpkin/seed/seed.png', 'assets/monster/pumpkin/seed/seed_atlas.json');
        scene.load.animation('seedAnim', 'assets/monster/pumpkin/seed/seed_anim.json');

        scene.load.image('pumpkin_shockwave', 'assets/monster/pumpkin/shockwave.png');

        scene.load.audio("pumpkin_shockwave", "assets/audio/pumpkin_shockwave.wav");
        scene.load.audio("pumpkin_seed", "assets/audio/pumpkin_seed.wav");
    }

    update() {
        //몬스터가 죽었으면 update 실행하지 않음
        if (!this.isAlive) return;
        this.healthBarBack.clear();
        this.healthBar.clear();
        this.healthBarBack.fillStyle(0x000000);
        this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, 240, 15);
        let healthWidth = (this.hp / this.initHp) * 240;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, healthWidth, 15);

        this.bullets.getChildren().forEach(bullet => {
            const bulletDistance = Phaser.Math.Distance.Between(bullet.startX, bullet.startY, bullet.x, bullet.y);
            const elapsedTime = this.scene.time.now - bullet.creationTime;
            if (bulletDistance > this.bulletDistance || elapsedTime > this.bulletDuration) {
                // this.bullets.remove(bullet, true, true);
                bullet.destroy();

            }
        });

        // 전투 시작 전이거나, 다쳤으면 이동 계산 안함
        if (!this.isBattleStared || this.isHurt) return;
        console.log('update 2 실행')
        this.target.x = this.player.x;
        this.target.y = this.player.y;

        // taget까지 거리 및 속도 계산
        const speed = this.speed;
        let monsterVelocity = new Phaser.Math.Vector2();
        let toTarget = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        let distanceToTarget = toTarget.length();
        if (distanceToTarget > 5) {
            this.isMoving = true;
            toTarget.normalize(); // 벡터를 단위 벡터로 정규화
            monsterVelocity = toTarget.scale(speed); // 고정된 speed 값을 곱하여 속도를 설정
            if (toTarget.x < 0) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }
            this.setVelocity(monsterVelocity.x, monsterVelocity.y);
        } else {
            this.isMoving = false;
            this.setVelocity(0, 0);
        }


        // 공격 애니메이션 처리 안됨
        const currentAnimKey = this.anims.currentAnim.key;
        // 상태 변화 감지 및 애니메이션 재생
        // if (!this.isHurt && this.isMoving && currentAnimKey !== `${this.monsterType}_movement`) {
        //     this.anims.play(`${this.monsterType}_movement`);
        // }

    }

    startBattle() {
        this.attackEvent = this.scene.time.addEvent({
            delay: 4000,
            callback: this.attack,
            callbackScope: this,
            loop: true
        });
        this.isBattleStared = true;
        this.anims.play(`${this.monsterType}_movement`);
    }

    actionAmin(state) {
        this.state = state;
        if (state === 'attack') {
            // 몬스터를 일시적으로 정적으로 설정하여 충돌 순간에 제자리에 있도록 함
            this.anims.play(`${this.monsterType}_attack`, true);
            // 일정 시간 후 몬스터를 다시 움직일 수 있도록 설정
            // this.scene.time.delayedCall(1500, () => {
            //     this.setStatic(false);
            // });
        }
        if (state === 'damage') {
            this.anims.play(`${this.monsterType}_damage`, true);
        }
    }

    handleAnimationComplete(animation) {
        if (animation.key === `${this.monsterType}_damage`) {
            this.isHurt = false;
            this.anims.play(`${this.monsterType}_movement`, true);
        } else if (animation.key === `${this.monsterType}_attack`) {
            this.scene.time.delayedCall(100, () => {
                this.shootShockwave();
                this.anims.play(`${this.monsterType}_movement`, true);
            });
        } else if (animation.key === `${this.monsterType}_spit_seed`) {
            this.scene.time.delayedCall(100, () => {
                this.shootBullet();
                this.anims.play(`${this.monsterType}_movement`, true);
            });
        } else if (animation.key === `${this.monsterType}_death`) {
            this.destroy();
        }
    }

    attack() {
        this.setStatic(true);
        if (this.initHp / 2 >= this.hp) {
            this.anims.play(`${this.monsterType}_spit_seed`);
        } else {
            this.anims.play(`${this.monsterType}_attack`);
        }
    }

    takeDamage(amount) {
        console.log('takeDamage 실행됨', this.monsterType, amount);
        this.isHurt = true;
        this.hp -= amount;
        console.log('monster HP', this.hp)

        if (this.hp > 0) {
            this.anims.play(`${this.monsterType}_damage`, true);
        } else {
            this.setCollidesWith([TILE_CATEGORY]);
            this.isAlive = false;
            this.attackEvent.destroy();
            this.hp = 0;
            this.anims.play(`${this.monsterType}_death`);
            this.healthBar.destroy();
            this.healthBarBack.destroy();
            return 'death';
        }


    }

    /**
     * @param {Phaser.GameObjects.GameObject} source
     */
    applyKnockback(source) {
        console.log("몬스터 넉백 시작");
        // 충돌 방향 계산
        const impactDirection = new Phaser.Math.Vector2(this.x - source.x, this.y - source.y);

        // 밀려나는 방향으로 힘과 속도를 동시에 적용
        impactDirection.normalize().scale(50);
        const force = {x: impactDirection.x * 0.1, y: impactDirection.y * 0.1};
        this.setVelocity(impactDirection.x, impactDirection.y);

        // Phaser에서 Matter 객체를 올바르게 참조합니다.
        const Matter = Phaser.Physics.Matter.Matter;
        Matter.Body.applyForce(this.body, this.body.position, force);

        // 일정 시간 후 속도를 0으로 설정하여 멈춤
        this.scene.time.delayedCall(200, () => {
            this.setVelocity(0, 0);
            this.isHurt = false;
        });
    }

    shootShockwave() {
        // 충격파 생성
        const shockwave = this.scene.matter.add.image(this.x, this.y, 'pumpkin_shockwave', null, {
            shape: 'circle'
        });
        shockwave.setStatic(true);
        shockwave.setScale(0.001);
        shockwave.setAlpha(1);
        shockwave.damage = 0.5;
        // 충돌 카테고리 설정
        shockwave.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
        shockwave.setCollidesWith([PLAYER_CATEGORY]);
        // 충격파 확장 애니메이션
        this.pumpkinShockwaveSound.play();
        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0, // 점점 투명해짐
            duration: 500,
            onComplete: () => {
                shockwave.destroy(); // 애니메이션이 끝나면 충격파 제거
                this.setStatic(false);
            }
        });
        this.scene.setCollisionOfMonsterShockwave(shockwave);

    }

    shootBullet() {
        this.setStatic(true);
        for (let i = 0; i < this.totalBullets; i++) {
            // const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            const angle = Phaser.Math.DegToRad(i * this.angleStep);
            let bullet = this.scene.matter.add.image(this.x, this.y, 'seed', 'seed_sprite_sheet_0');
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
            this.pumpkinSeedSound.play();
            this.scene.setCollisionOfMonsterAttack(bullet);
        }
        // 몇초마다 한번씩 발사하도록 하는 변수
        this.scene.time.delayedCall(1000, () => {
            this.setStatic(false);

        });
    }


}
