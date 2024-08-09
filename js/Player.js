const PLAYER_CATEGORY = 0x0001;
const MONSTER_CATEGORY = 0x0002;
const TILE_CATEGORY = 0x0004;

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y} = data;
        super(scene.matter.world, x, y, 'player', 'player_idle_01');

        // 플레이어 상태 정보 초기화
        this.status = {
            name: '맥스',
            maxHeart : 3,
            nowHeart : 3,
            //검 공격력
            swordATK : 20,
            //활 공격력
            bowATK : 10,
            //마법 공격력
            magicATK : 10,
            // 가지고 있는 coin
            coin : 0
        };

        this.scene = scene;
        scene.add.existing(this);

        // 플레이어의 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;     
        
        this.playerCollider = Bodies.rectangle(this.x, this.y, 18, 20,{ 
            isSensor: false,
            label: 'playerCollider' 
        });
        const compoundBody = Body.create({
            parts: [this.playerCollider],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        //충돌로 인한 회전을 방지
        this.setFixedRotation();
        // 충돌체 중심점 아래로 이동
        Body.setCentre(this.body, {x: this.x, y: this.y - 5}, false);

        // 키보드 방향키 입력 설정
        this.cursors = scene.input.keyboard.createCursorKeys();
        // Z 키 입력 설정
        this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // shift 키 입력 설정
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        
        // 초기 방향 설정
        this.isLookingRight = true;
        this.anims.play('player_idle');

        // 초기 상태 설정
        this.isMoving = false;
        this.isRolling = false;
        this.hitByMonster = false;


        // 충돌 카테고리 설정
        this.setCollisionCategory(PLAYER_CATEGORY);
        this.setCollidesWith([MONSTER_CATEGORY, TILE_CATEGORY]);
    }

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        scene.load.atlas('player', 'assets/player/player.png', 'assets/player/player_atlas.json');
        scene.load.animation('playerAnim', 'assets/player/player_anim.json');
        
        // Preload the sound effect for sword action
        scene.load.audio('sound_player_sword_1', 'assets/audio/sound_player_sword_1.wav');
        scene.load.audio('sound_player_hit', 'assets/audio/sound_player_hit.wav');
        scene.load.audio('sound_male_hurt', 'assets/audio/sound_male_hurt.wav');
        scene.load.audio('sound_player_bow', 'assets/audio/sound_player_bow.wav');
        scene.load.audio('sound_player_spell', 'assets/audio/sound_player_spell.wav');
        scene.load.audio('sound_player_teleport', 'assets/audio/sound_player_teleport.wav');
        scene.load.audio('sound_player_roll', 'assets/audio/sound_player_roll.wav');
    }

    update() {
        const speed = 3.5;
        let playerVelocity = new Phaser.Math.Vector2();

        // 몬스터와 부딪힌 상태일 때, 뒤로 밀려남
        if (!this.hitByMonster && !this.isRolling) {
            // 키보드 입력 처리
            this.handleKeyboardInput(playerVelocity, speed);

            // Shift 키를 눌렀을 때 구르기 시작
            if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
                this.startRoll(playerVelocity);
            }
        }
    }

    handleKeyboardInput(playerVelocity, speed) {
        // 이동 상태 초기화
        this.isMoving = false;

        // 플레이어의 현재 위치를 가져옵니다.
        const playerX = this.x;
        const playerY = this.y;

        if (this.cursors.right.isDown && this.cursors.up.isDown) {
            if (playerX < this.scene.maxX && playerY > this.scene.minY) { // 경계 확인
                playerVelocity.x = 1;
                playerVelocity.y = -1;
                this.isLookingRight = true;
                this.isMoving = true;
            }
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
            if (playerX < this.scene.maxX && playerY < this.scene.maxY) { // 경계 확인
                playerVelocity.x = 1;
                playerVelocity.y = 1;
                this.isLookingRight = true;
                this.isMoving = true;
            }
        } else if (this.cursors.left.isDown && this.cursors.up.isDown) {
            if (playerX > this.scene.minX && playerY > this.scene.minY) { // 경계 확인
                playerVelocity.x = -1;
                playerVelocity.y = -1;
                this.isLookingRight = false;
                this.isMoving = true;
            }
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
            if (playerX > this.scene.minX && playerY < this.scene.maxY) { // 경계 확인
                playerVelocity.x = -1;
                playerVelocity.y = 1;
                this.isLookingRight = false;
                this.isMoving = true;
            }
        } else if (this.cursors.right.isDown) {
            if (playerX < this.scene.maxX) { // 경계 확인
                playerVelocity.x = 1;
                playerVelocity.y = 0;
                this.isLookingRight = true;
                this.isMoving = true;
            }
        } else if (this.cursors.left.isDown) {
            if (playerX > this.scene.minX) { // 경계 확인
                playerVelocity.x = -1;
                playerVelocity.y = 0;
                this.isLookingRight = false;
                this.isMoving = true;
            }
        } else if (this.cursors.down.isDown) {
            if (playerY < this.scene.maxY) { // 경계 확인
                playerVelocity.x = 0;
                playerVelocity.y = 1;
                this.isMoving = true;
            }
        } else if (this.cursors.up.isDown) {
            if (playerY > this.scene.minY) { // 경계 확인
                playerVelocity.x = 0;
                playerVelocity.y = -1;
                this.isMoving = true;
            }
        }

        // 플레이어 방향 설정
        this.setFlipX(!this.isLookingRight);

        // 이동 상태에 따른 속도 설정
        if (this.isMoving) {
            playerVelocity.normalize();
            playerVelocity.scale(speed);
            this.setVelocity(playerVelocity.x, playerVelocity.y);
            this.anims.play('player_run', true);
        } else {
            this.setVelocity(0, 0);
            this.anims.play('player_idle', true);
        }
    }

    startRoll(playerVelocity) {
        if (!this.isRolling && this.isMoving) {
            this.isRolling = true;

            // 구르기 애니메이션 재생
            this.anims.play('player_roll', true);

            // 구르기 중 충돌 비활성화
            this.setCollidesWith([TILE_CATEGORY]);

            // 계산된 목표 좌표 (구르기 방향에 따른 위치)
            let targetX = this.x + playerVelocity.x * 30;
            let targetY = this.y + playerVelocity.y * 30;

            // 목표 좌표가 경계를 넘어가지 않도록 제한
            targetX = Phaser.Math.Clamp(targetX, this.scene.minX, this.scene.maxX);
            targetY = Phaser.Math.Clamp(targetY, this.scene.minY, this.scene.maxY);

            // 부드럽게 이동하도록 tween 사용
            this.scene.tweens.add({
                targets: this,
                props: {
                    x: { value: targetX, duration: 550, ease: 'Power2' },
                    y: { value: targetY, duration: 550, ease: 'Power2' }
                },
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: this,
                        props: {
                            velocityX: { value: 0, duration: 50, ease: 'Power1' },
                            velocityY: { value: 0, duration: 50, ease: 'Power1' }
                        },
                        onComplete: () => {
                            this.isRolling = false;
                            this.anims.play('player_idle', true);
                        }
                    });

                    // 구르기 후 충돌 재활성화
                    this.setCollidesWith([MONSTER_CATEGORY, TILE_CATEGORY]);
                }
            });
        }
    }

    takeDamage(amount) {
        if (this.isRolling) return;
        this.hitByMonster = true;
        this.status.nowHeart -= amount;
        if (this.status.nowHeart < 0) {
            this.status.nowHeart = 0;
            this.anims.play('player_death');
        } else {
            this.anims.play('player_damage');
        }
        
        console.log('player takeDamage, hp : ', this.status.nowHeart);
    }

    /** 
     * @param {Phaser.GameObjects.GameObject} source 
     */ 
    applyKnockback(source) {
        // 충돌 방향 계산
        const impactDirection = new Phaser.Math.Vector2(this.x - source.x, this.y - source.y);
    
        // 밀려나는 방향으로 힘과 속도를 동시에 적용
        impactDirection.normalize();
        const force = { x: impactDirection.x * 0.1, y: impactDirection.y * 0.1 };
        this.setVelocity(impactDirection.x * 20, impactDirection.y * 20);

        // Phaser에서 Matter 객체를 올바르게 참조합니다.
        const Matter = Phaser.Physics.Matter.Matter;
        Matter.Body.applyForce(this.body, this.body.position, force);
    
        // 일정 시간 후 속도를 0으로 설정하여 멈춤
        this.scene.time.delayedCall(200, () => {
            this.setVelocity(0, 0);
            this.hitByMonster = false;
        });
    }




}