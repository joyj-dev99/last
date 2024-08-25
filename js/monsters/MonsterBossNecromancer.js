import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY, MONSTER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterBossNecromancer extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, player} = data;
        super(scene.matter.world, x, y, 'necromancer', 'necromancer_sprite_sheet_0');
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;
        this.monsterType = 'necromancer';
        this.bodyWidth = 30;
        this.bodyHeight = 20;
        this.centreX = 0;
        this.centreY = -6;
        this.initHp = 500;
        this.hp = 500;
        this.damage = 0;
        this.speed = 1.5;
        this.followDistance = 500;
        this.scene.add.existing(this);

        this.topInfoY = 5;
        // 이 변수 가져오는거 모름 ㅠㅠㅠ
        this.mapSize = 480;
        // 최초 생성시 왼쪽을 바라보도록.
        this.setFlipX(true);
        this.setDepth(10);
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
        this.setCollidesWith([PLAYER_CATEGORY, PLAYER_ATTACK_CATEGORY, TILE_CATEGORY]);


        this.isAlive = true;
        // 위치 설정
        this.initialX = x;
        this.initialY = y;
        this.target = new Phaser.Math.Vector2(this.x, this.y);
        //
        this.bullets = this.scene.add.group();
        this.bulletDuration = 2000;

        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.monsterName = this.scene.add.text(this.scene.sys.game.config.width / 4 + 120, this.topInfoY, `네크로맨서`, {
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

        this.delayedCallEvent = null;
        this.attackType = 0;
        //
        //     지금 안쓰는 변수들은 아래
        this.isMoving = false;
        this.isFollowing = false;
        this.isReturning = false;
        this.state = 'idle'; // 현재 상태
        this.isBattleStared = false;
        this.isKnockBack = false;

    }

    update() {
        //몬스터가 죽었으면 update 실행하지 않음
        if (!this.isAlive) return;
        this.updateHpState();
        this.timeOutBullets();
        // 전투 시작 전이거나, 다쳤으면 이동 계산 안함
        // if (!this.isBattleStared || this.isHurt) return;
        console.log('update 2 실행')
        this.monsterDistanceControlPlayer();
    }

    updateHpState() {
        this.healthBarBack.clear();
        this.healthBar.clear();
        this.healthBarBack.fillStyle(0x000000);
        this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 + this.healthBarWidth, this.topInfoY*4, this.healthBarWidth, this.healthBarHeight);
        let healthWidth = (this.hp / this.initHp) * this.healthBarWidth;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(this.scene.sys.game.config.width / 4 + this.healthBarWidth, this.topInfoY*4, healthWidth, this.healthBarHeight);
    }

    monsterDistanceControlPlayer() {
        this.target.x = this.player.x;
        this.target.y = this.player.y;

        // taget까지 거리 및 속도 계산
        const speed = this.speed;
        let monsterVelocity = new Phaser.Math.Vector2();
        let toTarget = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        let distanceToTarget = toTarget.length();
        if (distanceToTarget > 120) {
            toTarget.normalize(); // 벡터를 단위 벡터로 정규화
            monsterVelocity = toTarget.scale(speed); // 고정된 speed 값을 곱하여 속도를 설정
            if (toTarget.x < 0 && this.anims.currentAnim.key !== `${this.monsterType}_attack2`) {
                this.setFlipX(true);
            } else if (toTarget.x >= 0 && this.anims.currentAnim.key !== `${this.monsterType}_attack2`) {
                this.setFlipX(false);
            }
            this.setVelocity(monsterVelocity.x, monsterVelocity.y);
        } else if (0 <= distanceToTarget && distanceToTarget < 110) {
            const dx = this.x - this.player.x;
            const dy = this.y - this.player.y;
            if (dx > 0) {
                this.setVelocityX(speed *2);
            } else {
                this.setVelocityX(-speed * 2);
            }
            if (dy > 0) {
                this.setVelocityY(speed *2);
            } else {
                this.setVelocityY(-speed * 2);
            }
        }
    }

    startBattle() {
        this.attackEvent = this.scene.time.addEvent({
            delay: 5000,
            callback: this.monsterAttackPlayerBySkill,
            callbackScope: this,
            loop: true
        });
        this.isBattleStared = true;
        this.anims.play(`${this.monsterType}_move`, true);
    }

    monsterAttackPlayer() {
        //     네크로맨서는 부딪혀도 뭐 데미지 주고 말고 할게 없다 생각해서.
        //     나보다 약한데 내가 어깨빵 한건데 내 체력이 감소하는건 이상함.
    }

    handleAnimationComplete(animation) {
        if (animation.key === `${this.monsterType}_attack2`) {
            this.scene.time.delayedCall(600, () => {
                this.anims.play(`${this.monsterType}_move`, true);
            });
        } else if (animation.key === `${this.monsterType}_attack1`) {
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_damage`) {
            this.anims.play(`${this.monsterType}_move`, true);
        } else if (animation.key === `${this.monsterType}_death`) {
            this.destroy();
        }
    }

    monsterAttackPlayerBySkill() {
        this.attackType = this.attackType + 1;
        if (this.attackType === 2) {
            this.magic_circle = this.scene.add.image(this.mapSize / 2, this.mapSize / 2 + 40, 'necromancer_magic_circle');
            this.scene.tweens.add({
                targets: this.magic_circle,
                scaleX: 0.35,
                scaleY: 0.35,
                hold: 5000,
                alpha: 1,
                duration: 0,
                onComplete: () => {
                    this.magic_circle.destroy();
                }
            });
            this.scene.playerDebuff('speed');
        } else if (this.attackType === 4) {
            this.magic_circle2 = this.scene.add.image(this.mapSize / 2, this.mapSize / 2 + 40, 'necromancer_magic_circle2');
            this.scene.tweens.add({
                targets: this.magic_circle2,
                scaleX: 0.35,
                scaleY: 0.35,
                hold: 5000,
                alpha: 1,
                duration: 0,
                onComplete: () => {
                    this.magic_circle2.destroy();
                }
            });
            this.magic_circle2.setBlendMode(Phaser.BlendModes.ADD);
            this.magic_circle2.setDepth(8);
            this.scene.playerDebuff('sight');
            this.attackType = 0
        } else {
            this.anims.play(`${this.monsterType}_attack2`);
            this.necromancerShootingBeam();
        }


    }

    takeDamage(amount) {
        console.log('takeDamage 실행됨', this.monsterType, amount);
        this.isHurt = true;
        this.hp -= amount;
        console.log('monster HP', this.hp)

        if (this.hp > 0 && this.anims.currentAnim.key === `${this.monsterType}_movement`) {
            this.anims.play(`${this.monsterType}_damage`, true);
        } else if (this.hp <= 0) {
            if (this.delayedCallEvent) {
                this.delayedCallEvent.remove();
            }
            this.destroyBullets()
            this.setCollidesWith([TILE_CATEGORY]);
            // this.magic_circle.destroy();
            // this.magic_circle2.destroy();
            this.isAlive = false;
            this.attackEvent.destroy();
            this.hp = 0;
            this.anims.play(`${this.monsterType}_death`);
            this.healthBar.destroy();
            this.healthBarBack.destroy();
            return 'death';
        }
    }

    necromancerShootingBeam() {
        this.setStatic(true);
        let bullet = this.scene.matter.add.image(0, 0, 'necromancer_beam');
        bullet.setStatic(true);
        bullet.setSensor(true);
        bullet.setCollisionCategory(MONSTER_ATTACK_CATEGORY);
        bullet.setCollidesWith([PLAYER_CATEGORY]);
        bullet.setFixedRotation();
        bullet.setFrictionAir(0);
        let toTarget = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        toTarget.normalize(); // 벡터를 단위 벡터로 정규화
        if (toTarget.x < 0) {
            bullet.setPosition((this.body.bounds.min.x + this.body.bounds.max.x) / 2 - 80, this.y);
        } else {
            bullet.setPosition((this.body.bounds.min.x + this.body.bounds.max.x) / 2 + 80, this.y);
        }
        bullet.damage = 0.5;
        bullet.creationTime = this.scene.time.now;
        this.bullets.add(bullet);
        this.scene.setCollisionOfMonsterLongAttack(bullet);
        this.delayedCallEvent = this.scene.time.delayedCall(2300, () => {
            this.setStatic(false);
        });
    }

    timeOutBullets() {
        this.bullets.getChildren().forEach(bullet => {
            const elapsedTime = this.scene.time.now - bullet.creationTime;
            if (elapsedTime > this.bulletDuration) {
                bullet.destroy();
            }
        });
    }

    destroyBullets() {
        this.bullets.children.each(bullet => {
            bullet.destroy();
        }, this);
    }
}
