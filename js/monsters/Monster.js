import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";
import Arrow from "../Arrow.js";

export default class Monster extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {
            scene, x, y, texture, frame, monsterType, bodyWidth, bodyHeight, centreX, centreY,
            hp, damage, reach, speed, oneMove, maxMove, followDistance, player
        } = data;

        super(scene.matter.world, x, y, texture, frame);
        this.scene = scene;
        this.scene.add.existing(this);

        // 최초 생성시 왼쪽을 바라보도록.
        this.setFlipX(true);

        // 초기화
        this.monsterType = monsterType;
        this.hp = hp; // 체력
        this.damage = damage; // 한번에 플레이어의 체력을 얼마나 깍는지. 기본은 0.5
        this.reach = reach; // 공격을 시도하는 최대 거리 (픽셀)
        this.speed = speed; // 이동속도
        this.oneMove = oneMove; // 한번에 이동하는 거리 (픽셀)
        this.maxMove = maxMove; // 초기 위치에서 최대로 이동할 수 있는 거리 (픽셀)
        this.followDistance = followDistance; // 플레이어와 몬스터 사이 거리가 해당 수치보다 작으면 몬스터가 플레이어를 따라다님 (픽셀)

        // 플레이어 객체 참조
        this.player = player;

        // 충돌체 생성
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        this.monsterCollider = Bodies.rectangle(this.x, this.y, bodyWidth, bodyHeight, {
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
        Body.setCentre(this.body, {x: centreX, y: centreY}, true);

        // 애니메이션 재생
        this.anims.play(`${this.monsterType}_idle`);
        console.log("몬스터 생성: ", monsterType, x, y);

        this.setCollisionCategory(MONSTER_CATEGORY);
        this.setCollidesWith([PLAYER_CATEGORY, TILE_CATEGORY, PLAYER_ATTACK_CATEGORY]);

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


        this.moveEvent = this.scene.time.addEvent({
            delay: 2000, // 2초마다
            callback: this.prepareMove,
            callbackScope: this,
            loop: true
        });

        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);
    }

    static preload(scene) {
        scene.load.atlas('tomato', 'assets/monster/tomato/tomato.png', 'assets/monster/tomato/tomato_atlas.json');
        scene.load.animation('tomatoAnim', 'assets/monster/tomato/tomato_anim.json');
        scene.load.atlas('eggplant', 'assets/monster/eggplant/eggplant.png', 'assets/monster/eggplant/eggplant_atlas.json');
        scene.load.animation('eggplantoAnim', 'assets/monster/eggplant/eggplant_anim.json');
        scene.load.atlas('apple', 'assets/monster/apple/apple.png', 'assets/monster/apple/apple_atlas.json');
        scene.load.animation('appleAnim', 'assets/monster/apple/apple_anim.json');
        scene.load.atlas('lemon', 'assets/monster/lemon/lemon.png', 'assets/monster/lemon/lemon_atlas.json');
        scene.load.animation('lemonAnim', 'assets/monster/lemon/lemon_anim.json');
    }

    update() {
        // 몬스터가 죽었으면 update 실행하지 않음
        if (!this.isAlive && this.isHurt) return;
        // 플레이어와 몬스터 사이의 거리 계산
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        if (distanceToPlayer < this.followDistance) {
            this.target.x = this.player.x;
            this.target.y = this.player.y;
            this.isFollowing = true;
        } else {
            this.isFollowing = false;
        }

        // taget까지 거리 및 속도 계산
        const speed = this.speed;
        let monsterVelocity = new Phaser.Math.Vector2();
        let toTarget = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        let distanceToTarget = toTarget.length();

        if (distanceToTarget > 5) {
            toTarget.normalize(); // 벡터를 단위 벡터로 정규화
            monsterVelocity = toTarget.scale(speed); // 고정된 speed 값을 곱하여 속도를 설정
            this.isMoving = true;
            if (toTarget.x < 0) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }
            this.setVelocity(monsterVelocity.x, monsterVelocity.y);
        } else { // taget까지 거리가 너무 짧으면 이동하지 않음.
            this.isMoving = false;
            this.setVelocity(0, 0);
        }

        
        const currentAnimKey = this.anims.currentAnim.key;
        // isMoving 에 따른 move, idle 애니메이션 실행
        if (!this.isHurt && this.isMoving && currentAnimKey !== `${this.monsterType}_move`) {
            this.anims.play(`${this.monsterType}_move`);
        } else if (!this.isHurt && !this.isMoving && currentAnimKey !== `${this.monsterType}_idle`) {
            this.anims.play(`${this.monsterType}_idle`);
        }
    }

    actionAmin(state) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        this.state = state;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        if (state === 'attack') {                                                                             
            // 몬스터를 일시적으로 정적으로 설정하여 충돌 순간에 제자리에 있도록 함
            this.anims.play(`${this.monsterType}_attack`, true);
            this.setStatic(true);
            // 일정 시간 후 몬스터를 다시 움직일 수 있도록 설정
            this.scene.time.delayedCall(500, () => {
                this.setStatic(false);
            });
        }
        if (state === 'damage') {
            this.anims.play(`${this.monsterType}_damage`, true);
        }
    }

    handleAnimationComplete(animation) {
        if (animation.key === `${this.monsterType}_damage`) {
            this.isHurt = false;
            this.anims.play(`${this.monsterType}_idle`, true);
        } else if (animation.key === `${this.monsterType}_attack`)  {
            this.anims.play(`${this.monsterType}_idle`, true);
        } else if (animation.key === `${this.monsterType}_death`) {
            this.destroy();
        }
    }

    prepareMove() {
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

    // 자식 몬스터 클래스에서 필수로 오버라이드 해야 하는 함수들

    attack() {
        throw new Error('Method "takeDamage()" must be implemented.');
    }

    takeDamage(amount, gameObject) {
        console.log('takeDamage 실행됨', this.monsterType, amount);
        this.isHurt = true;
        this.hp -= amount;
        console.log('monster HP', this.hp)

        if (this.hp > 0) {
            this.anims.play(`${this.monsterType}_damage`, true);
            this.applyKnockback(gameObject);
        } else {
            this.setCollidesWith([TILE_CATEGORY]);
            this.isAlive = false;
            this.moveEvent.destroy();
            this.hp = 0;
            this.anims.play(`${this.monsterType}_death`);
            return 'death';
        }
    }

    /** 
     * @param {Phaser.GameObjects.GameObject} source 
     */ 
    applyKnockback(source) {
        console.log("몬스터 넉백 시작");
        console.dir(source);
        // 충돌 방향 계산
        const impactDirection = new Phaser.Math.Vector2(this.x - source.x, this.y - source.y);
    
        // 밀려나는 방향으로 힘과 속도를 동시에 적용
        impactDirection.normalize().scale(10);
        const force = { x: impactDirection.x * 0.5, y: impactDirection.y * 0.5 };
        this.setVelocity(impactDirection.x, impactDirection.y);

        // Phaser에서 Matter 객체를 올바르게 참조합니다.
        const Matter = Phaser.Physics.Matter.Matter;
        Matter.Body.applyForce(this.body, this.body.position, force);
        
        // 일정 시간 후 속도를 0으로 설정하여 멈춤
        this.scene.time.delayedCall(200, () => {
            this.setVelocity(0, 0);
        });
    }

}
