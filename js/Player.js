const PLAYER_CATEGORY = 0x0001;
const MONSTER_CATEGORY = 0x0002;
const TILE_CATEGORY = 0x0004;
const OBJECT_CATEGORY = 0x0005;

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

        // Phaser.Physics.Matter.Matter에서 Body와 Bodies 객체를 가져옴
        // Bodies는 간단한 물리 바디를 생성할 때 사용되고, Body는 이러한 바디를 조작할 때 사용
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;     
        
        // 플레이어 충돌체 생성
        this.playerCollider = Bodies.rectangle(this.x, this.y, 18, 20,{ 
            isSensor: false, // 실제 물리적 충돌을 일으킴
            label: 'playerCollider' 
        });
        // 복합 바디 생성 (여러 파트를 합쳐서 하나의 복합 바디)
        const compoundBody = Body.create({
            parts: [this.playerCollider],
            frictionAir: 0.35, // 값이 높을수록 공기 저항이 커져 바디가 느리게 이동
        });
        // compoundBody를 현재 게임 객체의 물리적 바디로 설정
        this.setExistingBody(compoundBody);
        //충돌로 인한 회전을 방지
        this.setFixedRotation();
        // 충돌체 중심점 아래로 이동
        Body.setCentre(this.body, {x: this.x, y: this.y - 5}, false);

        // 키보드 방향키 입력 설정
        this.cursors = scene.input.keyboard.createCursorKeys();
        // Z 키 입력 설정
        this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // Q 키 입력 설정
        this.qKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        // shift 키 입력 설정
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // 칼 휘두르기 콤보 단계 추적 변수
        this.comboState = 0; 
        // 현재 칼 휘두르기 상태 변수
        this.isSwinging = false;
        
        // 초기 방향 설정
        this.isLookingRight = true;
        this.anims.play('player_idle');

        // 초기 상태 설정
        this.isMoving = false;
        this.isRolling = false;
        this.hitByMonster = false;

        // 애니메이션 완료 이벤트 리스너 추가
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

        // 충돌 카테고리 설정
        this.setCollisionCategory(PLAYER_CATEGORY); //현재 객체의 충돌 카테고리를 설정
        this.setCollidesWith([MONSTER_CATEGORY, TILE_CATEGORY]); // 이 객체가 충돌할 대상 카테고리를 설정

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

        // 제자리
        // 플레이어가 움직이지 않고, 칼 휘두르기도 없으며, 구르는 상태도 아니고, 몬스터에 의해 맞지 않는
        // 수명이 0보다 커야함
        // 완료된 애니메이션이 idle 이 아닌 경우에 실행됨
        if (!this.isMoving && !this.isSwinging && !this.isRolling && !this.hitByMonster && this.anims.currentAnim.key !== 'player_idle'
            && this.status.nowHeart > 0
        ) {
            this.anims.play('player_idle', true);
        }

       // 칼 휘두르기
        // q키를 눌렀을때, 콤보 상태를 확인하고 칼 휘두르기 시작 (각, 1단계, 2단계, 3단계)
        if (Phaser.Input.Keyboard.JustDown(this.qKey)) {

            //첫 번째 단계는 다른 스윙이 없을 때만 실행 가능
            if(this.comboState === 0 && !this.isSwinging){ 
                this.swingSword(1);

            //두 번째와 세 번째 단계는 스윙이 진행 중일 때 입력 허용
            }else if(this.isSwinging){  
                switch (this.comboState) {
                    case 1:
                this.swingSword(2);
                    break;
                    case 2:
                this.swingSword(3);
                    break;
                }
                }
            }


        // 8방향 이동과 구르기
        // 몬스터와 부딪힌 상태가 아니고, 구르는 상태가 아닐때
        if (!this.hitByMonster && !this.isRolling) {

            // 8방향 이동 입력 처리
            this.handleArrowKeyInput(playerVelocity, speed);

            // Shift 키를 눌렀을 때 구르기 시작
            if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
                this.startRoll(playerVelocity);
            }
        }
    }

    handleArrowKeyInput(playerVelocity, speed) {
        // 이동 상태 초기화 (방향키를 누르지 않은 경우에는)
        this.isMoving = false;
    
        // 플레이어의 현재 위치를 가져옵니다.
        const playerX = this.x;
        const playerY = this.y;
    
        // 입력 상태 확인 및 플레이어 속도와 방향 설정
        if (this.cursors.right.isDown && this.cursors.up.isDown) {
            if (playerX < this.scene.maxX && playerY > this.scene.minY) {
                playerVelocity.set(1, -1);
                this.isLookingRight = true;
                this.isMoving = true;
            }
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
            if (playerX < this.scene.maxX && playerY < this.scene.maxY) {
                playerVelocity.set(1, 1);
                this.isLookingRight = true;
                this.isMoving = true;
            }
        } else if (this.cursors.left.isDown && this.cursors.up.isDown) {
            if (playerX > this.scene.minX && playerY > this.scene.minY) {
                playerVelocity.set(-1, -1);
                this.isLookingRight = false;
                this.isMoving = true;
            }
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
            if (playerX > this.scene.minX && playerY < this.scene.maxY) {
                playerVelocity.set(-1, 1);
                this.isLookingRight = false;
                this.isMoving = true;
            }
        } else if (this.cursors.right.isDown) {
            if (playerX < this.scene.maxX) {
                playerVelocity.set(1, 0);
                this.isLookingRight = true;
                this.isMoving = true;
            }
        } else if (this.cursors.left.isDown) {
            if (playerX > this.scene.minX) {
                playerVelocity.set(-1, 0);
                this.isLookingRight = false;
                this.isMoving = true;
            }
        } else if (this.cursors.down.isDown) {
            if (playerY < this.scene.maxY) {
                playerVelocity.set(0, 1);
                this.isMoving = true;
            }
        } else if (this.cursors.up.isDown) {
            if (playerY > this.scene.minY) {
                playerVelocity.set(0, -1);
                this.isMoving = true;
            }
        }
    
        // 플레이어 방향 설정
        this.setFlipX(!this.isLookingRight);
    
        // 이동 상태에 따른 속도 설정
        if (this.isMoving) {
            playerVelocity.normalize().scale(speed);
            this.setVelocity(playerVelocity.x, playerVelocity.y);
            if (this.anims.currentAnim.key !== 'player_run') {
                this.anims.play('player_run', true);
            }
        } else {
            this.setVelocity(0, 0); // 이동하지 않을 때 속도를 0으로 설정
        }
    }
    

    startRoll(playerVelocity) {

         // 이동중일때만, 구르기 시작가능
        if (this.isMoving) {
            this.isRolling = true;

            // 구르기 애니메이션 재생
            this.anims.play('player_roll', true);

            // 구르기 중 타일 충돌 비활성화
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
                    // Power2는 중간 속도가 빠르고 끝에서는 느리게 감속하는 방식
                },
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: this,
                        props: {
                            velocityX: { value: 0, duration: 50, ease: 'Power1' },
                            velocityY: { value: 0, duration: 50, ease: 'Power1' }
                            // Power1은 부드러운 가속과 감속을 제공
                        }
                    });

                    // 구르기 후 충돌 재활성화
                    this.setCollidesWith([MONSTER_CATEGORY, TILE_CATEGORY]);
                }
            });
        }
    }
    swingSword(stage) {
        switch (stage) {
            case 1:
                this.anims.play('player_sword_1', true);
                console.log("칼 휘두르기 1단계");
                this.scene.sound.play('sound_player_sword_1');
                this.comboState = 1;
                break;
            case 2:
                this.anims.play('player_sword_2', true);
                console.log("칼 휘두르기 2단계");
                this.scene.sound.play('sound_player_sword_1');
                this.comboState = 2;
                break;
            case 3:
                this.anims.play('player_sword_3', true);
                console.log("칼 휘두르기 3단계");
                this.scene.sound.play('sound_player_sword_1');   
                this.comboState = 0;
                break;
        }
        this.isSwinging = true;

    }

    takeDamage(amount) {
        if (this.isRolling) return;
        this.hitByMonster = true;
        this.status.nowHeart -= amount;

        if(this.status.nowHeart === 0){
            console.log("플레이어 죽음");
            this.anims.play('player_death');

        }else if(this.status.nowHeart > 0){
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

    // 상단 coin 갯수 표시되는 텍스트 박스의 text 변수를 player 객체가 받기
    setCoinIndicatorText(coinIndicatorText){
        this.coinIndicatorText = coinIndicatorText;
    }

    // 코인 획득 (코인 추가)
    addCoin(amount){
        console.log('addCoin');
        this.status.coin += amount;
        // 상단 coin 누적 갯수 화면에 반영
        this.coinIndicatorText.setText(`Coins: ${this.status.coin}`);
        console.log(' this.status.coin : '+ this.status.coin);
    }

    // 애니메이션이 완료되었을 때 실행될 로직을 중앙화
    handleAnimationComplete(animation, frame) {
        if( animation.key == 'player_roll'){
            this.isRolling = false;
            this.anims.play('player_idle', true);

            // 충돌 다시 활성화
            this.setCollidesWith([MONSTER_CATEGORY, TILE_CATEGORY]);

        }
        else if( animation.key === 'player_sword_1' ||
            animation.key === 'player_sword_2' ||
            animation.key === 'player_sword_3'){

            this.isSwinging = false; // 칼 휘두르는 상태 리셋
            console.log("칼 휘두르는 상태 리셋");

            // 일정 시간 내에 입력 없으면 콤보 초기화
            this.scene.time.delayedCall(500, () => {
                    if (!this.isSwinging && this.comboState !== 0) {
                        this.comboState = 0;
                        console.log('0.5초 내에 콤보 초기화');
                    }
            });

            this.anims.play('player_idle', true);

        }
    }
    
}