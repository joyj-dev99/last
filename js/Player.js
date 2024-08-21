import Arrow from "./Arrow.js";
import Magic from "./Magic.js";
import Slash from "./Slash.js";

import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, MONSTER_ATTACK_CATEGORY, SENSOR_CATEGORY, BOUNDARY_CATEGORY, ITEM_CATEGORY} from "./constants.js";

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
            coin : 0,
            // 이동 속도 초기화
            speed: 3.5,
            // 공격 스킬 쿨타임 초기화 (초 단위)
            swordCooldown: 5,  // 검 공격 쿨타임 5초
            bowCooldown: 7,    // 활 공격 쿨타임 7초
            magicCooldown: 10  // 마법 공격 쿨타임 10초
        };

        this.scene = scene;
        scene.add.existing(this);
        // Phaser.Physics.Matter.Matter에서 Body와 Bodies 객체를 가져옴
        // Bodies는 간단한 물리 바디를 생성할 때 사용되고, Body는 이러한 바디를 조작할 때 사용
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;     
        
        // 플레이어 충돌체 생성
        this.playerCollider = Bodies.rectangle(this.x, this.y, 18, 20,{ 
            isSensor: false, // 실제 물리적 충돌을 일으킴
            label: 'playerCollider',
            collisionFilter: {
                category: PLAYER_CATEGORY, // 현재 객체 카테고리
                mask: MONSTER_CATEGORY | OBJECT_CATEGORY | TILE_CATEGORY | MONSTER_ATTACK_CATEGORY | SENSOR_CATEGORY 
                | BOUNDARY_CATEGORY | ITEM_CATEGORY//충돌할 대상 카테고리
            }
        });

        // this.playerCollider 를 현재 게임 객체의 물리적 바디로 설정
        this.setExistingBody(this.playerCollider);

        //충돌로 인한 회전을 방지
        this.setFixedRotation();
        // 충돌체 중심점 아래로 이동
        Body.setCentre(this.body, {x: this.x, y: this.y - 5}, false);

        // 키보드 방향키 입력 설정
        this.cursors = scene.input.keyboard.createCursorKeys();
        // Z 키 입력 설정
        this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // X 키 입력 설정
        this.xKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        // C 키 입력 설정
        this.cKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        // shift 키 입력 설정
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // 칼 휘두르기 콤보 단계 추적 변수
        this.comboState = 0; 
        
        // 초기 방향 설정
        this.isLookingRight = true;
        this.anims.play('player_idle');

        // 마지막 공격 방향을 확인하기 위한 변수
        this.lastDirection = new Phaser.Math.Vector2(1, 0); // 기본 방향 오른쪽

        // 초기 상태 설정
        this.isMoving = false;
        this.isRolling = false;
        this.hitByMonster = false;

        this.isAlive = true;
        this.slash = null;
        this.isShootingBow = false;
        this.isCastingSpell = false;
        this.isInvincible = false; // 무적 상태를 나타내는 변수
        this.canRoll = true; // 구르기 가능 여부를 관리하는 변수 추가


        // 애니메이션 완료 이벤트 리스너 추가
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.soundSword = this.scene.sound.add(`sound_player_hit`, {
            volume: 0.3 // Set the volume (0 to 1)
        });
        this.soundMove = this.scene.sound.add(`sound_player_move`, {
            volume: 0.5 // Set the volume (0 to 1)
        });
        this.soundDeath = this.scene.sound.add(`sound_player_death`, {
            volume: 0.5 // Set the volume (0 to 1)
        });
        this.soundDamage = this.scene.sound.add(`sound_player_damage`, {
            volume: 0.5 // Set the volume (0 to 1)
        });
        this.soundBow = this.scene.sound.add(`sound_player_bow`, {
            volume: 0.4 // Set the volume (0 to 1)
        });
        this.soundSpell = this.scene.sound.add(`sound_player_spell`, {
            volume: 0.5 // Set the volume (0 to 1)
        });
        this.soundRoll = this.scene.sound.add(`sound_player_roll`, {
            volume: 0.5 // Set the volume (0 to 1)
        });


    }

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        scene.load.atlas('player', 'assets/player/player.png', 'assets/player/player_atlas.json');
        scene.load.animation('playerAnim', 'assets/player/player_anim.json');
        scene.load.image('player_stun', 'assets/player/player_stun.png');

        // Preload the sound effect for sword action
        scene.load.audio('sound_player_hit', 'assets/audio/sound_player_hit.mp3');
        scene.load.audio('sound_player_move', 'assets/audio/sound_player_move.mp3');
        scene.load.audio('sound_player_death', 'assets/audio/sound_player_death.mp3');
        scene.load.audio('sound_player_damage', 'assets/audio/sound_player_damage.mp3');

        scene.load.audio('sound_player_bow', 'assets/audio/sound_player_bow.mp3');
        scene.load.audio('sound_player_spell', 'assets/audio/sound_player_spell.mp3');
        scene.load.audio('sound_player_roll', 'assets/audio/sound_player_roll.wav');

        Slash.preload(scene);
        Arrow.preload(scene);
        Magic.preload(scene);
    }

    update() {
        if (!this.isAlive) return;

        let playerVelocity = new Phaser.Math.Vector2();

        // 제자리
        // 플레이어가 움직이지 않고, 칼 휘두르기(슬래쉬)가 null이며, 활을 쏘거나 마법을 부리는 상태가 아닐때
        // 구르는 상태도 아니고, 몬스터에 의해 맞지 않는
        // 완료된 애니메이션이 idle 이 아닌 경우에 실행됨
        if (this.isAlive && !this.isMoving && this.slash === null && !this.isShootingBow && !this.isCastingSpell
            && !this.isRolling && !this.hitByMonster && this.anims.currentAnim.key !== 'player_idle'
        ) {
            this.anims.play('player_idle', true);
        }

       // 칼 휘두르기
        // z키를 눌렀을때, 콤보 상태를 확인하고 칼 휘두르기 시작 (각, 1단계, 2단계, 3단계)
        if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
            
            this.handleSlash(); // 슬래쉬 동작 처리
        
        }

        // x키 누르면 해당 방향으로 활 쏘기
        if (Phaser.Input.Keyboard.JustDown(this.xKey)) {

            this.handleBow(); //활쏘기 동작 처리
        }

        //c키 누르면 마법 생성.
        if (Phaser.Input.Keyboard.JustDown(this.cKey)) {

            this.handleSpell(); //마법 부리기
        }


        // 8방향 이동과 구르기
        // 몬스터와 부딪힌 상태가 아니고, 구르는 상태가 아닐때
        if (!this.hitByMonster && !this.isRolling) {

            // 8방향 이동 입력 처리
            this.handleArrowKeyInput(playerVelocity, this.status.speed );
            
            if(this.slash){ // 이 지점에서 this.slash가 여전히 존재하는지 확인
                const offsetX = this.isLookingRight ? 10 : -10; // 플레이어 방향에 따른 오프셋 설정
                // 플레이어 위치에 slash 객체 동기화
                this.slash.setPosition(this.x + offsetX, this.y);
            }
        
            // Shift 키를 눌렀을 때 구르기 시작
            if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {

                this.handleRoll(playerVelocity); // 구르기
            }
        }
    }

    handleSlash(){
        if(this.isRolling){
            this.cancelRoll(); // 구르기를 즉시 중단
        }
        this.isShootingBow = false; //활쏘기 중단
        this.isCastingSpell = false; // 마법 부리기 종료

        //첫 번째 단계는 다른 스윙이 없을 때만 실행 가능
        if(this.comboState === 0){ 
            this.swingSword(1);
            this.scene.setCollisionOfPlayerAttack(this.slash);

        //두 번째와 세 번째 단계는 스윙이 진행 중일 때 입력 허용
        }else{  
            switch (this.comboState) {
                case 1:
            this.swingSword(2);
            this.scene.setCollisionOfPlayerAttack(this.slash);
                break;
                case 2:
            this.swingSword(3);
            this.scene.setCollisionOfPlayerAttack(this.slash);
                break;
            }
        }
    }

    handleBow(){
        if(this.isRolling){
            this.cancelRoll(); // 구르기를 즉시 중단
        }

        //검 공격 콤보 상태 초기화
        this.resetComboState();
        // 슬래쉬 객체 제거
        this.removeSlash();
        this.isCastingSpell = false; // 마법 부리기 종료

        this.isShootingBow = true;
        this.anims.play('player_bow');

       // 활 쏘기 애니메이션이 완료된 후 화살을 발사
        this.once('animationcomplete-player_bow', () => {
            this.fireArrow();
            this.soundBow.play();
        });
    }

    // 화살을 발사하는 함수
    fireArrow() {
        let arrow = new Arrow({
            scene: this.scene,
            x: this.x + 2,
            y: this.y
        });
        this.scene.setCollisionOfPlayerAttack(arrow);
    }


    handleSpell(){
        if(this.isRolling){
            this.cancelRoll(); // 구르기를 즉시 중단
        }

        //검 공격 콤보 상태 초기화
        this.resetComboState();
        // 슬래쉬 객체 제거
        this.removeSlash();
        this.isShootingBow = false; //활쏘기 중단

        this.isCastingSpell = true; 
        this.anims.play('player_spell');
        this.soundSpell.play();

        let magic = new Magic({
            scene : this.scene
        });
        this.scene.setCollisionOfPlayerAttack(magic);
    }

    // 공격력 조절 메서드
    adjustAttackPower(multiplier) {
        this.status.swordATK *= multiplier;
        this.status.bowATK *= multiplier;
        this.status.magicATK *= multiplier;

        console.log(`Attack power adjusted by a factor of ${multiplier}.`);
        console.log('New sword ATK: ' + this.status.swordATK);
        console.log('New bow ATK: ' + this.status.bowATK);
        console.log('New magic ATK: ' + this.status.magicATK);
    }

    // 공격 스킬 쿨타임 조절 메서드
    adjustCooldown(amount) {
        this.status.swordCooldown = Math.max(this.status.swordCooldown + amount, 0);
        this.status.bowCooldown = Math.max(this.status.bowCooldown + amount, 0);
        this.status.magicCooldown = Math.max(this.status.magicCooldown + amount, 0);

        console.log(`Cooldowns adjusted by ${amount} seconds.`);
        console.log('New sword cooldown: ' + this.status.swordCooldown);
        console.log('New bow cooldown: ' + this.status.bowCooldown);
        console.log('New magic cooldown: ' + this.status.magicCooldown);
    }

    handleRoll(playerVelocity){

        if (!this.canRoll) {
            console.log("Rolling is currently disabled.");
            return;  // 구르기 금지 상태일 때는 아무 동작도 하지 않음
        }

        // 슬래쉬 객체 제거
        this.removeSlash();
        this.isShootingBow = false; //활쏘기 중단
        this.isCastingSpell = false; // 마법 부리기 종료

        this.startRoll(playerVelocity);
    }

    handleArrowKeyInput(playerVelocity, speed) {
        // 이동 상태 초기화 (방향키를 누르지 않은 경우에는)
        this.isMoving = false;
        this.isMovingUpward = false;
    
        // 플레이어의 현재 위치를 가져옵니다.
        const playerX = this.x;
        const playerY = this.y;
    
        // 입력 상태 확인 및 플레이어 속도와 방향 설정
        if (this.cursors.right.isDown && this.cursors.up.isDown) {
            if (playerX < this.scene.maxX && playerY > this.scene.minY) {
                playerVelocity.set(1, -1);
                this.isLookingRight = true;
                this.isMoving = true;
                // 위로 달리는 플래그
                this.isMovingUpward = true;
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
                // 위로 달리는 플래그
                this.isMovingUpward = true;
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
                // 위로 달리는 플래그
                this.isMovingUpward = true;
            }
        }
    
        // 플레이어 방향 설정
        this.setFlipX(!this.isLookingRight);
    
        // 이동 상태에 따른 속도 설정
        if(this.isMoving) {
            console.log("this.isMoving이 true");
            console.log("this.anims.currentAnim.key "+ this.anims.currentAnim.key);
            console.log("this.slash " + this.slash );
            console.log("this.isMovingUpward" + this.isMovingUpward);
 
            //슬래쉬 값이 존재하지 않고, 활을 쏘지 않을때만, 마법을 부리지 않을때만 달리기 애니메이션을 실행한다
            if (this.slash === null && !this.isShootingBow && !this.isCastingSpell) {

                if(this.isMovingUpward){
                    this.anims.play('player_run_upward', true);
                    console.log('위로 달리기 애니메이션 실행');

                }else{
                    this.anims.play('player_run', true);
                    console.log('달리기 애니메이션 실행');
                }
            }

            //데미지 애니메이션이 재생중일때도 이동가능
            if(this.anims.currentAnim.key === 'player_damage'){
                this.anims.stop();
            }

            // 플레이어 마지막으로 눌렀던 방향 저장
            this.lastDirection = playerVelocity;

            playerVelocity.normalize().scale(speed);
            this.setVelocity(playerVelocity.x, playerVelocity.y);
            
        } else {
            console.log("this.isMoving이 false");
            console.log("this.isShootingBow "+ this.isShootingBow );
            console.log("this.isCastingSpell "+ this.isCastingSpell );
            this.setVelocity(0, 0); // 이동하지 않을 때 속도를 0으로 설정
        }
    }
    
    // 이동 속도를 조절하는 함수
    adjustSpeed(multiplier) {
        this.status.speed *= multiplier;
    }

    resetComboState(){
        // 다른 동작이 시작될때는, 콤보 상태를 초기화
        this.comboState = 0;
    }

    startRoll(playerVelocity) {

        // 구르기가 시작될 때 콤보 상태를 초기화
        this.resetComboState();

        // 이동중일때만, 구르기 시작가능
        if (this.isMoving) {
            this.isRolling = true;

            // 구르기 애니메이션 재생
            this.anims.play('player_roll', true);
            this.soundRoll.play();

            // 구르기 중 충돌 비활성화
            this.setCollidesWith([TILE_CATEGORY, SENSOR_CATEGORY]);

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
                    this.setCollidesWith([MONSTER_CATEGORY, OBJECT_CATEGORY, TILE_CATEGORY, MONSTER_ATTACK_CATEGORY, SENSOR_CATEGORY]); 
                }
            });
        }
    }

    cancelRoll() {
        this.isRolling = false;
        this.anims.stop('player_roll'); // 구르기 애니메이션을 중단
        this.setVelocity(0, 0); // 구르기 속도를 중단
        this.setCollidesWith([MONSTER_CATEGORY, TILE_CATEGORY]); // 충돌 재설정
    }

    swingSword(stage) {
        const offsetX = this.isLookingRight ? 10 : -10; // 플레이어 방향에 따른 오프셋 설정

        // 기존에 슬래쉬가 있다면 제거
        this.removeSlash();
        this.slash = new Slash(this.scene, this.x + offsetX, this.y); // 플레이어에 상대적인 위치
        this.slash.setFlipX(!this.isLookingRight);

        // 단계에 따른 애니메이션 재생
        const swordAnimKey = `player_sword_${stage}`;
        this.anims.play(swordAnimKey, true);

        this.comboState = stage;
        console.log(`칼 휘두르기 ${stage}단계`);
        this.soundSword.play();
    }

    removeSlash() {
        if (this.slash) {
            this.slash.destroy();  // 객체를 제거
            this.slash = null;     // 참조를 명시적으로 null로 설정
        }
    }

    setInvincible(isInvincible) {
        this.isInvincible = isInvincible;
    }

    takeDamage(amount) {
        this.removeSlash();
        this.isShootingBow = false; //활쏘기 중단
        this.isCastingSpell = false; // 마법 부리기 종료

        if (this.isRolling) return;
        if (this.isInvincible) return;

        this.hitByMonster = true;
        this.status.nowHeart -= amount;
        this.status.nowHeart = this.status.nowHeart < 0 ? 0 : this.status.nowHeart;
        console.log('player takeDamage, hp : ', this.status.nowHeart);
        
        if(this.status.nowHeart === 0){
            this.isAlive = false;
            this.scene.time.removeAllEvents();
            console.log("플레이어 죽음");
            this.anims.play('player_death');
            this.soundDeath.play();
            this.handlePlayerDeath();
            return 'death';
        } else{
            this.anims.play('player_damage');
            this.soundDamage.play();
        }
        

    }

    /** 
     * @param {Phaser.GameObjects.GameObject} source 
     */ 
    applyKnockback(source) {
        // 충돌 방향 계산
        const impactDirection = new Phaser.Math.Vector2(this.x - source.x, this.y - source.y);
    
        // 밀려나는 방향으로 힘과 속도를 동시에 적용
        impactDirection.normalize().scale(1);
        const force = { x: impactDirection.x * 0.1, y: impactDirection.y * 0.1 };
        this.setVelocity(impactDirection.x, impactDirection.y);

        // Phaser에서 Matter 객체를 올바르게 참조합니다.
        const Matter = Phaser.Physics.Matter.Matter;
        Matter.Body.applyForce(this.body, this.body.position, force);
        
        // 일정 시간 후 속도를 0으로 설정하여 멈춤
        this.scene.time.delayedCall(200, () => {
            this.setVelocity(0, 0);
            this.hitByMonster = false;
            if (this.isAlive) {
                this.anims.chain('player_idle'); // Automatically transition to idle after damage animation
            }
        });
    }

    // 코인 획득 (코인 추가)
    addCoin(amount){
        console.log('addCoin');
        this.status.coin += amount;
        console.log(' this.status.coin : '+ this.status.coin);
    }


    // 체력 amount만큼 증가
    increaseHeart(amount){
        console.log('increaseHeart');
        this.status.nowHeart = this.status.nowHeart + amount > this.status.maxHeart ? this.status.maxHeart : this.status.nowHeart + amount;
        console.log('this.status.nowHeart : '+ this.status.nowHeart);
    }

    // maxHeart와 nowHeart를 amount만큼 증가
    increaseMaxHeart(amount) {
        console.log('increaseMaxHeart');
        
        this.status.maxHeart += amount;
        this.status.nowHeart += amount;
        
        console.log('this.status.maxHeart : ' + this.status.maxHeart);
        console.log('this.status.nowHeart : ' + this.status.nowHeart);
    }


    // 힘 amount만큼 증가
    increaseATK(amount){
        console.log('increaseATK');
        this.status.swordATK += amount;
        this.status.bowATK += amount;
        this.status.magicATK += amount;
        console.log('this.status.swordATK : '+ this.status.swordATK);
        console.log('this.status.bowATK : '+ this.status.bowATK);
        console.log('this.status.magicATK : '+ this.status.magicATK);
    }

    // 애니메이션이 완료되었을 때 실행될 로직을 중앙화
    handleAnimationComplete(animation, frame) {
        if( animation.key === 'player_roll'){
            this.isRolling = false;
            this.anims.play('player_idle', true);
        }
        else if( animation.key === 'player_sword_1' ||
            animation.key === 'player_sword_2' ||
            animation.key === 'player_sword_3'){

            // 슬래쉬 객체 제거 (검 휘두르기 종료)
            this.removeSlash();

            // 일정 시간 내에 입력 없으면, 콤보 초기화
            this.scene.time.delayedCall(500, () => {
                // 콤보 초기화
                this.comboState = 0;
            });

        } else if (animation.key === 'player_bow') {
            this.isShootingBow = false; // 활 쏘기 종료
        } else if (animation.key === 'player_spell') {
            this.isCastingSpell = false; // 마법 부리기 종료
        }
    }

    handlePlayerDeath() {
        this.scene.cameras.main.fadeOut(3000, 0, 0, 0); // 2초 동안 까맣게 페이드 아웃
        this.scene.backgroundMusic.stop();
        this.scene.cameras.main.once('camerafadeoutcomplete', () => {
            const result = 'death';
            this.scene.scene.start('BattleResultScene', {result});
        });
    }

    stopMove() {
        this.isMoving = false;
        this.setVelocity(0, 0);

    }
}