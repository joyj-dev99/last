import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY, MONSTER_ATTACK_CATEGORY
} from "../constants.js";

export default class MonsterAlchemist extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, player} = data;
        super(scene.matter.world, x, y, 'alchemist', 'alchemist_sprite_sheet_0');
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;
        this.monsterType = 'alchemist';
        this.bodyWidth = 16;
        this.bodyHeight = 16;
        this.centreX = 0;
        this.centreY = -6;
        this.initHp = 250;
        this.hp = 250;
        this.damage = 0.5;
        this.reach = 30;
        this.speed = 1;
        this.oneMove = 20;
        this.speed = 1;
        this.maxMove = 50;
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


        
        this.bullets = this.scene.add.group();
        this.isShoting = true;
        this.shotingRate = 3000; // 발사 간격 (밀리초)
        this.bulletSpeed = 2;
        this.bulletDuration = 2000;
        this.bulletDistance = 200;

        // //
        // this.bullets = this.scene.add.group();
        // this.isShoting = true;
        // this.shotingRate = 3000; // 발사 간격 (밀리초)
        // this.bulletSpeed = 3;
        // this.bulletDuration = 2000;
        // this.bulletDistance = 400;
        // this.totalBullets = 36;
        // this.angleStep = 360 / this.totalBullets;
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.healthBarBack = this.scene.add.graphics();
        this.healthBar = this.scene.add.graphics();
        // 초기 프레임 설정
        this.healthBar.setScrollFactor(0);
        this.healthBarBack.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBarBack.setDepth(1001);

        // this.flag = '대기';
        // this.count = 0;
        // // 변신 애니메이션 끝나고 호출되는 함수 설정
        this.on('animationcomplete', this.handleAnimationComplete2, this);

    }

    static preload(scene) {

        scene.load.atlas('minotaur', 'assets/monster/minotaur/minotaur.png', 'assets/monster/minotaur/minotaur_atlas.json');
        scene.load.animation('minotaurAnim', 'assets/monster/minotaur/minotaur_anim.json');

        scene.load.atlas('alchemist_transform', 'assets/monster/alchemist/tramsform/alchemist_transform.png', 'assets/monster/alchemist/tramsform/alchemist_transform_atlas.json');
        scene.load.animation('alchemist_transformAnim', 'assets/monster/alchemist/tramsform/alchemist_transform_anim.json');
     
        scene.load.atlas('alchemist', 'assets/monster/alchemist/alchemist.png', 'assets/monster/alchemist/alchemist_atlas.json');
        scene.load.animation('alchemistAnim', 'assets/monster/alchemist/alchemist_anim.json');

    }

    handleAnimationComplete2(animation) {

        this.flag = '완료';
        console.log('변신 완료');
        this.isBattleStared = true;
        this.isHurt = false;

        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.off('animationcomplete', this.handleAnimationComplete2, this);
    }

    변신(){
        console.log('변신');
        this.anims.play('transform__into__the__minotaur');
    }

    update() {

        if(this.monsterType == 'alchemist' && this.initHp / 2 >= this.hp){
            this.monsterType = 'minotaur';
            this.변신();
            return;
        }


        // 몬스터가 죽었으면 update 실행하지 않음
        if (!this.isAlive) return;
        this.healthBarBack.clear();
        this.healthBar.clear();
        this.healthBarBack.fillStyle(0x000000);
        this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, 240, 15);
        let healthWidth = (this.hp / this.initHp) * 240;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, healthWidth, 15);

        // this.bullets.getChildren().forEach(bullet => {
        //     const bulletDistance = Phaser.Math.Distance.Between(bullet.startX, bullet.startY, bullet.x, bullet.y);
        //     const elapsedTime = this.scene.time.now - bullet.creationTime;
        //     if (bulletDistance > this.bulletDistance || elapsedTime > this.bulletDuration) {
        //         // this.bullets.remove(bullet, true, true);
        //         bullet.destroy();
        //     }
        // });

        console.log('update 2 실행1')

        console.log('this.isBattleStared : '+this.isBattleStared)
        console.log('this.isHurt : '+this.isHurt)

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
        console.log('currentAnimKey : '+currentAnimKey);

        if(currentAnimKey == 'transform__into__the__minotaur'){
            return;
        }

        // isMoving 에 따른 move, idle 애니메이션 실행
        if (!this.isHurt && this.isMoving && !(currentAnimKey == `${this.monsterType}_move` || currentAnimKey ==`${this.monsterType}_throw_flask` || currentAnimKey ==`${this.monsterType}_attack1`)) {
            // this.anims.play(`${this.monsterType}_move`);
            const randomValue = Math.random();
                if(randomValue <= 0.1){
                    // this.setStatic(true);
                    if('alchemist'){
                        this.anims.play(`${this.monsterType}_throw_flask`);
                    }
                    else{
                        this.anims.play(`${this.monsterType}_attack1`);
                    }
                }
                else{
                    this.anims.play(`${this.monsterType}_move`);
                }

        } else if (!this.isHurt && !this.isMoving && currentAnimKey !== `${this.monsterType}_idle`) {
            this.anims.play(`${this.monsterType}_idle`);
        }
        else if (!this.isHurt && this.isMoving && (currentAnimKey == `${this.monsterType}_move`)){
            const randomValue = Math.random();
                if(randomValue <= 0.01){
                    // this.setStatic(true);
                    // 물약 던지는 모션 추가
                    this.shootBullet(this.player);
                    this.anims.play(`${this.monsterType}_throw_flask`);
                }
                else{
                    // this.anims.play(`${this.monsterType}_move`);
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
        let bullet = this.scene.matter.add.image(this.x, this.y, 'alchemist', 'alchemist_sprite_sheet_56');
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

        // // 몇초마다 한번씩 발사하도록 하는 변수
        // this.scene.time.delayedCall(this.shotingRate, () => {
        //     this.isShoting = true;
        // });

    }

    startBattle() {
        this.attackEvent = this.scene.time.addEvent({
            delay: 4000,
            callback: this.prepareMove,
            callbackScope: this,
            loop: true
        });
        this.isBattleStared = true;
    }

    actionAmin(state) {

        console.log('actionAmin');
        this.state = state;
 
        if (state === 'attack') {                                                                             
         
            if(this.monsterType == 'minotaur'){
                // 몬스터를 일시적으로 정적으로 설정하여 충돌 순간에 제자리에 있도록 함
                this.anims.play(`${this.monsterType}_attack1`, true);
            }
      
        }
        // if (state === 'damage') {
        //     this.anims.play(`${this.monsterType}_damage`, true);
        // }

    }

    handleAnimationComplete(animation) {


        if (animation.key === 'transform__into__the__minotaur') {
            this.isHurt = false;
            // this.anims.play(`${this.monsterType}_idle`, true);
        }
        if (animation.key === `${this.monsterType}_damage`) {
            this.isHurt = false;
            this.anims.play(`${this.monsterType}_idle`, true);
        }
        if (animation.key === `${this.monsterType}_damage1`) {
            this.isHurt = false;
            this.anims.play(`${this.monsterType}_idle`, true);
        }
        // else if (animation.key === `${this.monsterType}_move`) {
        //     this.scene.time.delayedCall(100, () => {
        //         // this.shootShockwave();
        //         this.anims.play(`${this.monsterType}_idle`, true);
        //     });
        // } 
        else if (animation.key === `${this.monsterType}_attack`) {
            this.scene.time.delayedCall(100, () => {
                // this.shootShockwave();
                this.anims.play(`${this.monsterType}_idle`, true);
            });
        } else if (animation.key === `${this.monsterType}_throw_flask`) {
            this.scene.time.delayedCall(100, () => {
                // this.shootBullet();
                this.anims.play(`${this.monsterType}_idle`, true);
            });
        } else if (animation.key === `${this.monsterType}_death`) {
            this.destroy();
        }


        
    }


    prepareMove() {
        // this.setStatic(false);
          // this.scene.time.delayedCall(1500, () => {
            //     this.setStatic(false);
            // });
        //몬스터가 플레이어를 따라다니고 있을 때, 원래 위치로 돌아가고 있을 때는 좌표 계산 안함
        if (this.isFollowing && this.isReturning) return;
        // 만약 초기 위치에서 너무 많이 떨어진 경우 다시 초기 위치로 돌아가야 함
        if (Phaser.Math.Distance.Between(this.initialX, this.initialY, this.x, this.y) > this.maxMove) {
            // console.log("돌아가야해 : ", this.x, this.y)
            this.target.x = this.initialX;
            this.target.y = this.initialY;
            this.isReturning = true;
        } else {
            this.isReturning = false;
            const directions = [
                {x: -1, y: 0},  // left
                {x: 1, y: 0},   // right
                {x: 0, y: -1},  // up
                {x: 0, y: 1},   // down
                {x: -1, y: -1}, // up-left
                {x: 1, y: -1},  // up-right
                {x: -1, y: 1},  // down-left
                {x: 1, y: 1}    // down-right
            ];

            const direction = Phaser.Math.RND.pick(directions);
            let newX = this.target.x + direction.x * this.oneMove;
            let newY = this.target.y + direction.y * this.oneMove;

            if (Phaser.Math.Distance.Between(this.initialX, this.initialY, newX, newY) < this.maxMove) {
                this.target.x = newX;
                this.target.y = newY;
            }
        }
        // console.log('몬스터 타겟 위치 설정 : ', this.target.x, this.target.y);
    }


    takeDamage(amount) {
        console.log('takeDamage 실행됨', this.monsterType, amount);
        this.isHurt = true;
        this.hp -= amount;
        console.log('monster HP', this.hp)

        if (this.hp > 0) {
            this.anims.play(`${this.monsterType}_damage`, true);
            // this.applyKnockback(gameObject);
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


}
