import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY, MONSTER_ATTACK_CATEGORY, BOUNDARY_CATEGORY
} from "../constants.js";
const soundVolume = 0.7;
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
        this.initHp = 1000;
        this.hp = 1000;
        this.damage = 0.5;
        this.speed = 1;
        this.speed = 1;
        this.followDistance = 500;
        this.scene.add.existing(this);

        // 이 변수 가져오는거 모름 ㅠㅠㅠ
        this.mapSize = 480;
        this.topInfoY = 5;
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
        this.setCollidesWith([PLAYER_CATEGORY, PLAYER_ATTACK_CATEGORY,TILE_CATEGORY]);


        this.isAlive = true;
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

        this.monsterName = this.scene.add.text(this.scene.sys.game.config.width / 4 - 10, this.topInfoY, `호박`, {
            fontFamily: 'Galmuri11, sans-serif',
            fontSize: '12px',
            fill: '#000',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            padding: {x: 10}
        }).setScrollFactor(0).setDepth(1001);

        this.healthBarWidth = 120;
        this.healthBarHeight = 15;
        this.healthBarBack = this.scene.add.graphics();
        this.healthBar = this.scene.add.graphics();
        // 초기 프레임 설정
        this.healthBar.setScrollFactor(0);
        this.healthBarBack.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBarBack.setDepth(1001);

        this.pumpkinShockwaveSound = this.scene.sound.add(`pumpkin_shockwave`, {
            volume: soundVolume * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });
        this.pumpkinSeedSound = this.scene.sound.add(`pumpkin_seed`, {
            volume: soundVolume * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });

        //
        //
        //
        //     지금 안쓰는 변수들은 아래
        this.isMoving = false;
        this.isFollowing = false;
        this.isReturning = false;
        this.state = 'idle'; // 현재 상태
        this.isBattleStared = false;
        this.isKnockBack = false;
    }

    
   
    soundOn(){
        console.log('soundOn ');

        console.log('pumpkinShockwaveSound : '+this.pumpkinShockwaveSound);
        this.pumpkinShockwaveSound.setVolume(soundVolume);
        this.pumpkinSeedSound.setVolume(soundVolume);
    }

    soundOff(){
        this.pumpkinShockwaveSound.setVolume(0);
        this.pumpkinSeedSound.setVolume(0);
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
        this.updateHpState();
        this.timeOutBullets();
        // 전투 시작 전이거나, 맞을때 이동안함 그래서 넉백됨
        // if (!this.isBattleStared || this.isKnockBack) return;
        console.log('update 2 실행');
        this.monsterFollowPlayer();
    }

    updateHpState() {
        this.healthBarBack.clear();
        this.healthBar.clear();
        this.healthBarBack.fillStyle(0x000000);
        this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 - 10, this.topInfoY*4, this.healthBarWidth, this.healthBarHeight);
        let healthWidth = (this.hp / this.initHp) * this.healthBarWidth;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(this.scene.sys.game.config.width / 4 - 10, this.topInfoY*4, healthWidth, this.healthBarHeight);
    }

    monsterFollowPlayer() {
        this.target.x = this.player.x;
        this.target.y = this.player.y;
        // taget까지 거리 및 속도 계산
        const speed = this.speed;
        let monsterVelocity = new Phaser.Math.Vector2();
        let toTarget = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        let distanceToTarget = toTarget.length();
        if (distanceToTarget > 5) {
            toTarget.normalize();
            monsterVelocity = toTarget.scale(speed);
            if (toTarget.x < 0) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }
            this.setVelocity(monsterVelocity.x, monsterVelocity.y);
        } else {
            this.setVelocity(0, 0);
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
        this.anims.play(`${this.monsterType}_movement`);
    }

    monsterAttackPlayer() {
        if (this.anims.currentAnim.key !== `${this.monsterType}_float`) {
            this.anims.play(`${this.monsterType}_float`, true);
        }
    }

    monsterAttackPlayerBySkill() {
        if (this.hp >= this.initHp * (2 / 3)) {
            this.anims.play(`${this.monsterType}_float`);
        } else if (this.initHp * (1 / 3) < this.hp && this.hp < this.initHp * (2 / 3)) {
            this.setStatic(true);
            this.anims.play(`${this.monsterType}_attack`);
        } else {
            this.setStatic(true);
            this.anims.play(`${this.monsterType}_spit_seed`);
        }
    }


    handleAnimationComplete(animation) {
        if (animation.key === `${this.monsterType}_float`) {
            this.anims.play(`${this.monsterType}_movement`, true);
        } else if (animation.key === `${this.monsterType}_attack`) {
            this.scene.time.delayedCall(100, () => {
                this.pumpkinShockwave();
                this.anims.play(`${this.monsterType}_movement`, true);
            });
        } else if (animation.key === `${this.monsterType}_spit_seed`) {
            this.pumpkinShootBullet();

            this.scene.time.delayedCall(100, () => {
                this.anims.play(`${this.monsterType}_movement`, true);
            });
        } else if (animation.key === `${this.monsterType}_damage`) {
            this.anims.play(`${this.monsterType}_movement`, true);
        } else if (animation.key === `${this.monsterType}_death`) {
            this.destroy();
        }
    }


    takeDamage(amount) {
        console.log('takeDamage 실행됨', this.monsterType, amount);
        // this.isKnockBack = true;
        this.hp -= amount;
        console.log('monster HP', this.hp)
        if (this.hp > 0 && this.anims.currentAnim.key === `${this.monsterType}_movement`) {
            this.anims.play(`${this.monsterType}_damage`, true);
        } else if (this.hp <= 0) {
            this.destroyBullets();
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

    pumpkinShockwave() {
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
        this.scene.setCollisionOfMonsterShortAttack(shockwave);

    }

    pumpkinShootBullet() {
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
            this.scene.setCollisionOfMonsterLongAttack(bullet);
            this.setStatic(false);
        }

        // 몇초마다 한번씩 발사하도록 하는 변수
        // this.scene.time.delayedCall(1000, () => {
        //     this.setStatic(false);
        // });
    }

    timeOutBullets() {
        this.bullets.children.each(bullet => {
            const bulletDistance = Phaser.Math.Distance.Between(bullet.startX, bullet.startY, bullet.x, bullet.y);
            const elapsedTime = this.scene.time.now - bullet.creationTime;
            if (bulletDistance > this.bulletDistance || elapsedTime > this.bulletDuration
                || bullet.x > this.mapSize - 10 || bullet.x <= 10 || bullet.y > this.mapSize - 10 || bullet.y <= 10) {
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
