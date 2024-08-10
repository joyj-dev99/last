const PLAYER_CATEGORY = 0x0001;
const MONSTER_CATEGORY = 0x0002;
const TILE_CATEGORY = 0x0004;

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
            label: `${this.monsterType}Collider` // 아직 라벨을 사용하지 않음
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
        this.setCollidesWith([PLAYER_CATEGORY, TILE_CATEGORY]);

        this.isMoving = false;
        this.isFollowing = false;
        this.hurt = false;
        this.isReturning = false;

        this.isAlive = true;

        this.state = 'alive'; // 현재 상태

        // 위치 설정
        this.initialX = x;
        this.initialY = y;
        this.target = new Phaser.Math.Vector2(this.x, this.y);


        this.moveEvent = this.scene.time.addEvent({
            delay: 2000, // 1초마다
            callback: this.prepareMove,
            callbackScope: this,
            loop: true
        });
    }

    static preload(scene) {
        scene.load.atlas('tomato', 'assets/monster/tomato/tomato.png', 'assets/monster/tomato/tomato_atlas.json');
        scene.load.animation('tomatoAnim', 'assets/monster/tomato/tomato_anim.json');
        scene.load.atlas('eggplant', 'assets/monster/eggplant/eggplant.png', 'assets/monster/eggplant/eggplant_atlas.json');
        scene.load.animation('eggplantoAnim', 'assets/monster/eggplant/eggplant_anim.json');
    }

    update() {
        if (!this.isAlive) {
            this.moveEvent.destroy();
        } else {
            //플레이어와 몬스터 사이의 거리 계산
            const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
            if (distanceToPlayer < this.followDistance) {
                this.target.x = this.player.x;
                this.target.y = this.player.y;
                this.isFollowing = true;
            } else {
                this.isFollowing = false;
                this.isMoving = false;
            }

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
            } else {
                this.isMoving = false;
                this.setVelocity(0, 0);
            }

            const currentAnimKey = this.anims.currentAnim.key;
            // 상태 변화 감지 및 애니메이션 재생
            if (this.isMoving && currentAnimKey !== `${this.monsterType}_move`
                && this.state === 'alive') {
                this.anims.play(`${this.monsterType}_move`);
            }
            // if (!this.isMoving && !this.isDamaged  && currentAnimKey !== `${this.monsterType}_idle`) {
            //     this.anims.play(`${this.monsterType}_idle`);
            // }
            // console.log("현재 상태 : " + this.isMoving, this.isFollowing, this.isDamaged);
        }
    }

    getMonsterCollider() {
        return this.monsterCollider;
    }

    actionAmin(state) {
        this.state = state;
        if (state === 'attack') {
            // 몬스터를 일시적으로 정적으로 설정하여 충돌 순간에 제자리에 있도록 함
            this.setStatic(true);
            this.anims.play(`${this.monsterType}_attack`, true);
            // 일정 시간 후 몬스터를 다시 움직일 수 있도록 설정
            this.scene.time.delayedCall(500, () => {
                this.setStatic(false);
            });
        }
        if (state === 'damage') {
            this.setStatic(true);
            this.anims.play(`${this.monsterType}_damage`, true);
            this.scene.time.delayedCall(500, () => {
                this.setStatic(false);
            });

        }

        if (this.hp <= 0) {
            // this.isAction = true;
        }
    }

    prepareMove() {
        //몬스터가 플레이어를 따라다니고 있을 때는 좌표 계산 안함
        if (this.isFollowing && this.isReturning) return;
        // 만약 초기 위치에서 너무 많이 떨어진 경우 다시 초기 위치로 돌아가야 함
        if (Phaser.Math.Distance.Between(this.initialX, this.initialY, this.x, this.y) > this.maxMove) {
            console.log("돌아가야해 : ", this.x, this.y)
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
        this.isMoving = true;
        this.state = 'alive';
        console.log('몬스터 타겟 위치 설정 : ', this.target.x, this.target.y);
    }

    // 자식 몬스터 클래스에서 필수로 오버라이드 해야 하는 함수들
    itemDrop() {
        throw new Error('Method "itemDrop()" must be implemented.');
    }

    takeDamage() {
        throw new Error('Method "takeDamage()" must be implemented.');
    }


}
