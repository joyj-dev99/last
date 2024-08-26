import Arrow from "./Arrow.js";
import Magic from "./Magic.js";
import Slash from "./Slash.js";

import {saveCoinsToLocalStorage, loadCoinsFromLocalStorage} from './localStorage.js';

const {type} = window.gameConfig;

import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    MONSTER_ATTACK_CATEGORY,
    SENSOR_CATEGORY,
    BOUNDARY_CATEGORY,
    ITEM_CATEGORY
} from "./constants.js";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, hiddenFlag} = data;
        super(scene.matter.world, x, y, 'player', 'player_idle_01');

        // 플레이어 상태 정보 초기화
        this.status = {
            name: '맥스',
            maxHeart: 5,
            nowHeart: 5,
            //검 공격력
            swordATK: 100,
            //활 공격력
            bowATK: 50,
            //마법 공격력
            magicATK: 150,
            // 가지고 있는 coin
            coin: loadCoinsFromLocalStorage(),
            // 이동 속도 초기화
            speed: 3.5,
            rollingCoolTime: 500,
            swordCoolTime: 1000,
            magicCoolTime: 2000,
            arrowCount: 3,//화살의 갯수
            // 무적 상태
            isInvincible: false,
            // 구르기 가능 여부 상태
            canRoll: true

        };

        this.hiddenFlag = hiddenFlag;

        this.isRolling = true;
        this.isRollingOverLayCoolingDown = false;
        this.rollingCooldownElapsed = 0;

        this.isSlash = true;
        this.isSlashOverLayCoolingDown = false;
        this.slashCooldownElapsed = 0;

        this.isMagic = true;
        this.isMagicOverLayCoolingDown = false;
        this.magicCooldownElapsed = 0;


        this.scene = scene;
        scene.add.existing(this);

        // Phaser.Physics.Matter.Matter에서 Body와 Bodies 객체를 가져옴
        // Bodies는 간단한 물리 바디를 생성할 때 사용되고, Body는 이러한 바디를 조작할 때 사용
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;

        // 플레이어 충돌체 생성
        this.playerCollider = Bodies.rectangle(this.x, this.y, 18, 20, {
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


        // 애니메이션 완료 이벤트 리스너 추가
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.soundSword = this.scene.sound.add(`sound_player_hit`, {
            volume: 0.3 * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });
        this.soundDeath = this.scene.sound.add(`sound_player_death`, {
            volume: 0.5 * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });
        this.soundDamage = this.scene.sound.add(`sound_player_damage`, {
            volume: 0.5 * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });
        this.soundBow = this.scene.sound.add(`sound_player_bow`, {
            volume: 0.4 * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });
        this.soundSpell = this.scene.sound.add(`sound_player_spell`, {
            volume: 0.5 * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });
        this.soundRoll = this.scene.sound.add(`sound_player_roll`, {
            volume: 0.5 * window.gameConfig.soundVolume // Set the volume (0 to 1)
        });

        if (this.hiddenFlag) return;

        let rollImgName, slashImgName, magicImgName, arrowImgName, buttonScale;
        let roll_x, roll_y, slash_X, slash_y, magic_x, magic_y, arrow_x, arrow_y;
        // 'Weapons and Equipment 16', 68, spriteScale);
        if (type == 'mobile') {
            rollImgName = 'roll_32';
            slashImgName = 'sword_32';
            magicImgName = 'magic_32';
            arrowImgName = 'arrow_32';
            buttonScale = 0.1;

            let width = scene.sys.game.config.width;
            let height = scene.sys.game.config.height;

            roll_x = width - 30;
            roll_y = height - 35;//95
            slash_X = width - 85;
            slash_y = height - 35;//35
            arrow_x = width - 85;
            arrow_y = height - 95;
            magic_x = width - 30;
            magic_y = height - 95;
        } else if (type == 'pc') {
            rollImgName = 'roll_16';
            slashImgName = 'sword_16';
            arrowImgName = 'arrow_16';
            magicImgName = 'magic_16';
            buttonScale = 0.05;

            roll_x = 20;
            roll_y = 200;
            slash_X = 20;
            slash_y = 230;
            arrow_x = 50;
            arrow_y = 230;
            magic_x = 80;
            magic_y = 230;
        }

        // 구르기 버튼과 그 오버레이
        const {
            button: btnRolling,
            skillImage: rollingSkill,
            overlay: overlayRolling,
            container: containerRolling
        } = this.createButtonWithOverlay(scene, roll_x, roll_y, rollImgName, buttonScale);
        this.btnRollingCoolTime = btnRolling;
        this.rollingSkillSprite = rollingSkill;
        this.overLayRollingCoolTime = overlayRolling;
        this.containerRollingCoolTime = containerRolling;

        // 슬래시 버튼과 그 오버레이
        const {
            button: btnSlash,
            skillImage: slashSkill,
            overlay: overlaySlash,
            container: containerSlash
        } = this.createButtonWithOverlay(scene, slash_X, slash_y, slashImgName, buttonScale);
        this.btnSlashCoolTime = btnSlash;
        this.slashSkillSprite = slashSkill;
        this.overLaySlashCoolTime = overlaySlash;
        this.containerSlashCoolTime = containerSlash;

        // 애로우 버튼과 그 오버레이
        const {
            button: btnArrow,
            skillImage: arrowSkill,
            overlay: overlayArrow,
            container: containerArrow
        } = this.createButtonWithOverlay(scene, arrow_x, arrow_y, arrowImgName, buttonScale);
        this.btnArrowCoolTime = btnArrow;
        this.arrowSkillSprite = arrowSkill;
        this.overLayArrowCoolTime = overlayArrow;
        this.containerArrowCoolTime = containerArrow;


        // 마법 버튼과 그 오버레이
        const {
            button: btnMagic,
            skillImage: magicSkill,
            overlay: overlayMagic,
            container: containerMagic
        } = this.createButtonWithOverlay(scene, magic_x, magic_y, magicImgName, buttonScale);
        this.btnMagicCoolTime = btnMagic;
        this.magicSkillSprite = magicSkill;
        this.overLayMagicCoolTime = overlayMagic;
        this.containerMagicCoolTime = containerMagic;

        if (type == 'mobile') {
            // 버튼 클릭 이벤트 리스너 설정

            // 화살 남은 갯수 text
            // 텍스트 스타일 (폰트 크기 조절)
            const buttonTextStyle = {font: "30px Arial", fill: "#000000"};
            this.arrowCountText = this.scene.add.text(arrow_x,arrow_y, this.status.arrowCount, buttonTextStyle).setOrigin(0.5).setScrollFactor(0);
            this.arrowCountText.setDepth(101);

            // 새로운 그래픽스 객체 생성
            this.graphics1 = scene.add.graphics();
            // 바탕 투명한 흰색 설정 (투명도 0.5)
            // this.graphics1.fillStyle(0x000000, 0.5);
            // 사각형 채우기 (x, y, width, height)
            this.graphics1.fillRect(arrow_x - 26, arrow_y - 26, this.btnArrowCoolTime.width * buttonScale, this.btnArrowCoolTime.height * buttonScale);//spriteScale
            // 선의 스타일 설정 (두께, 색상 등)
            // this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
            // 사각형 테두리 그리기
            this.graphics1.strokeRect(arrow_x - 26, arrow_y - 26, this.btnArrowCoolTime.width * buttonScale, this.btnArrowCoolTime.height * buttonScale);
            // 카메라에 고정시키기
            this.graphics1.setScrollFactor(0);//.setDepth(dialogDepth)
            this.graphics1.setInteractive(new Phaser.Geom.Rectangle(arrow_x - 26, arrow_y - 26, this.btnArrowCoolTime.width * buttonScale, this.btnArrowCoolTime.height * buttonScale), Phaser.Geom.Rectangle.Contains);


            // 버튼을 눌렀을 때 (pointerdown)
            this.graphics1.on('pointerdown', () => {
                console.log('Button pressed down!');
                // this.button.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyDownEvent = new KeyboardEvent('keydown', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.X,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyDownEvent);

            });

            // 버튼에서 손가락 또는 마우스를 뗐을 때 (pointerup)
            this.graphics1.on('pointerup', () => {
                console.log('Button released!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
                // 여기서 버튼이 떼어졌을 때의 추가 동작을 수행할 수 있습니다.

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyUpEvent = new KeyboardEvent('keyup', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.X,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyUpEvent);

            });

            // 버튼을 눌렀다가 버튼 바깥으로 나갔을 때 (pointerout)
            this.graphics1.on('pointerout', () => {
                console.log('Pointer out of button!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
            });

            // 새로운 그래픽스 객체 생성
            this.graphics2 = scene.add.graphics();
            // 바탕 투명한 흰색 설정 (투명도 0.5)
            // this.graphics1.fillStyle(0x000000, 0.5);
            // 사각형 채우기 (x, y, width, height)
            this.graphics2.fillRect(magic_x - 26, magic_y - 26, this.btnMagicCoolTime.width * buttonScale, this.btnMagicCoolTime.height * buttonScale);//spriteScale
            // 선의 스타일 설정 (두께, 색상 등)
            // this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
            // 사각형 테두리 그리기
            this.graphics2.strokeRect(magic_x - 26, magic_y - 26, this.btnMagicCoolTime.width * buttonScale, this.btnMagicCoolTime.height * buttonScale);
            // 카메라에 고정시키기
            this.graphics2.setScrollFactor(0);//.setDepth(dialogDepth)
            this.graphics2.setInteractive(new Phaser.Geom.Rectangle(magic_x - 26, magic_y - 26, this.btnMagicCoolTime.width * buttonScale, this.btnMagicCoolTime.height * buttonScale), Phaser.Geom.Rectangle.Contains);


            // 버튼을 눌렀을 때 (pointerdown)
            this.graphics2.on('pointerdown', () => {
                console.log('Button pressed down!');
                // this.button.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyDownEvent = new KeyboardEvent('keydown', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.C,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyDownEvent);

            });

            // 버튼에서 손가락 또는 마우스를 뗐을 때 (pointerup)
            this.graphics2.on('pointerup', () => {
                console.log('Button released!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
                // 여기서 버튼이 떼어졌을 때의 추가 동작을 수행할 수 있습니다.

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyUpEvent = new KeyboardEvent('keyup', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.C,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyUpEvent);

            });

            // 버튼을 눌렀다가 버튼 바깥으로 나갔을 때 (pointerout)
            this.graphics2.on('pointerout', () => {
                console.log('Pointer out of button!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
            });


            // 새로운 그래픽스 객체 생성
            this.graphics3 = scene.add.graphics();
            // 바탕 투명한 흰색 설정 (투명도 0.5)
            // this.graphics1.fillStyle(0x000000, 0.5);
            // 사각형 채우기 (x, y, width, height)
            this.graphics3.fillRect(slash_X - 26, slash_y - 26, this.btnSlashCoolTime.width * buttonScale, this.btnSlashCoolTime.height * buttonScale);//spriteScale
            // 선의 스타일 설정 (두께, 색상 등)
            // this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
            // 사각형 테두리 그리기
            this.graphics3.strokeRect(slash_X - 26, slash_y - 26, this.btnSlashCoolTime.width * buttonScale, this.btnSlashCoolTime.height * buttonScale);
            // 카메라에 고정시키기
            this.graphics3.setScrollFactor(0);//.setDepth(dialogDepth)
            this.graphics3.setInteractive(new Phaser.Geom.Rectangle(slash_X - 26, slash_y - 26, this.btnSlashCoolTime.width * buttonScale, this.btnSlashCoolTime.height * buttonScale), Phaser.Geom.Rectangle.Contains);


            // 버튼을 눌렀을 때 (pointerdown)
            this.graphics3.on('pointerdown', () => {
                console.log('Button pressed down!');
                // this.button.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyDownEvent = new KeyboardEvent('keydown', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.Z,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyDownEvent);

            });

            // 버튼에서 손가락 또는 마우스를 뗐을 때 (pointerup)
            this.graphics3.on('pointerup', () => {
                console.log('Button released!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
                // 여기서 버튼이 떼어졌을 때의 추가 동작을 수행할 수 있습니다.

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyUpEvent = new KeyboardEvent('keyup', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.Z,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyUpEvent);

            });

            // 버튼을 눌렀다가 버튼 바깥으로 나갔을 때 (pointerout)
            this.graphics3.on('pointerout', () => {
                console.log('Pointer out of button!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
            });


            // 새로운 그래픽스 객체 생성
            this.graphics4 = scene.add.graphics();
            // 바탕 투명한 흰색 설정 (투명도 0.5)
            // this.graphics1.fillStyle(0x000000, 0.5);
            // 사각형 채우기 (x, y, width, height)
            this.graphics4.fillRect(roll_x - 26, roll_y - 26, this.btnRollingCoolTime.width * buttonScale, this.btnRollingCoolTime.height * buttonScale);//spriteScale
            // 선의 스타일 설정 (두께, 색상 등)
            // this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
            // 사각형 테두리 그리기
            this.graphics4.strokeRect(roll_x - 26, roll_y - 26, this.btnRollingCoolTime.width * buttonScale, this.btnRollingCoolTime.height * buttonScale);
            // 카메라에 고정시키기
            this.graphics4.setScrollFactor(0);//.setDepth(dialogDepth)
            this.graphics4.setInteractive(new Phaser.Geom.Rectangle(roll_x - 26, roll_y - 26, this.btnRollingCoolTime.width * buttonScale, this.btnRollingCoolTime.height * buttonScale), Phaser.Geom.Rectangle.Contains);


            // 버튼을 눌렀을 때 (pointerdown)
            this.graphics4.on('pointerdown', () => {
                console.log('Button pressed down!');
                // this.button.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyDownEvent = new KeyboardEvent('keydown', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyDownEvent);

            });

            // 버튼에서 손가락 또는 마우스를 뗐을 때 (pointerup)
            this.graphics4.on('pointerup', () => {
                console.log('Button released!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
                // 여기서 버튼이 떼어졌을 때의 추가 동작을 수행할 수 있습니다.

                // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                const zKeyUpEvent = new KeyboardEvent('keyup', {
                    key: 'z',
                    code: 'KeyZ',
                    keyCode: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(zKeyUpEvent);

            });

            // 버튼을 눌렀다가 버튼 바깥으로 나갔을 때 (pointerout)
            this.graphics4.on('pointerout', () => {
                console.log('Pointer out of button!');
                // this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
            });


        } else if (type == 'pc') {

            // 화살 남은 갯수 text
            // 텍스트 스타일 (폰트 크기 조절)
            const buttonTextStyle = {font: "18px Arial", fill: "#000000"};
            this.arrowCountText = this.scene.add.text(arrow_x, arrow_y, this.status.arrowCount, buttonTextStyle).setOrigin(0.5).setScrollFactor(0);

        }

    }

    createButtonWithOverlay(scene, x, y, imageKey, buttonScale) {
        // 버튼 이미지 생성
        const button = scene.add.image(0, 0, 'button_indicator');
        button.setScale(buttonScale);

        const skillImage = scene.add.image(0, 0, imageKey).setOrigin(0.5, 0.5);

        // 오버레이 생성 (반투명한 검은색 사각형)
        const overlay = scene.add.graphics();
        overlay.fillStyle(0x000000, 0.5);
        overlay.fillRect(-13, -13, button.width * button.scaleX, button.height * button.scaleY);
        overlay.setVisible(false);

        // 컨테이너 생성, 버튼과 오버레이를 추가
        const container = scene.add.container(x, y, [button, skillImage, overlay]);
        container.setScrollFactor(0);

        // 플레이어 depth 100. 항상 플레이어보다 위에 있음.
        container.setDepth(101);

        return {button, skillImage, overlay, container};
    }

    update(time, delta) {
        if (!this.isAlive) return;
        // this.coolTimeIndicator(delta);
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
            if(this.scene.scene.isActive('StoreScene') === true)return;
            if(this.scene.scene.isActive('NightScene') === true)return;

            // 슬래시 쿨타임
            if (this.isSlash === true) {
                this.isSlash = false;
                this.scene.time.delayedCall(this.status.swordCoolTime, () => {
                    this.isSlash = true;
                });
                if (!this.isSlashOverLayCoolingDown) {
                    this.isSlashOverLayCoolingDown = true;
                    this.slashCooldownElapsed = 0;
                    this.overLaySlashCoolTime.setVisible(true);
                }
            } else if (this.isSlash === false && this.comboState === 0) {
                return;
            }
            this.handleSlash(); // 슬래쉬 동작 처리
        }

        // x키 누르면 해당 방향으로 활 쏘기
        if (Phaser.Input.Keyboard.JustDown(this.xKey)) {
            if(this.scene.scene.isActive('StoreScene') === true)return;
            if(this.scene.scene.isActive('NightScene') === true)return;
            if (this.status.arrowCount > 0)
                this.handleBow(); //활쏘기 동작 처리
        }

        //c키 누르면 마법 생성.
        if (Phaser.Input.Keyboard.JustDown(this.cKey)) {
            if(this.scene.scene.isActive('StoreScene') === true)return;
            if(this.scene.scene.isActive('NightScene') === true)return;
            this.handleSpell(); //마법 부리기
        }

        // 8방향 이동과 구르기
        // 몬스터와 부딪힌 상태가 아니고, 구르는 상태가 아닐때
        if (!this.hitByMonster && !this.isRolling) {

            // 8방향 이동 입력 처리
            this.handleArrowKeyInput(playerVelocity, this.status.speed);

            if (this.slash) { // 이 지점에서 this.slash가 여전히 존재하는지 확인
                const offsetX = this.isLookingRight ? 20 : -20; // 플레이어 방향에 따른 오프셋 설정
                // 플레이어 위치에 slash 객체 동기화
                this.slash.setPosition(this.x + offsetX, this.y);
            }

            // Shift 키를 눌렀을 때 구르기 시작
            if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
                if(this.scene.scene.isActive('StoreScene') === true)return;
                if(this.scene.scene.isActive('NightScene') === true)return;

                this.handleRoll(playerVelocity); // 구르기
            }
        }

        this.rollingCoolTimeIndicator(delta);
        this.slashCoolTimeIndicator(delta);
        this.magicCoolTimeIndicator(delta);
    }

    handleSlash() {

        if (this.isRolling) {
            this.cancelRoll(); // 구르기를 즉시 중단
        }
        this.isShootingBow = false; //활쏘기 중단
        this.isCastingSpell = false; // 마법 부리기 종료

        //첫 번째 단계는 다른 스윙이 없을 때만 실행 가능
        if (this.comboState === 0) {
            this.swingSword(1);
            this.scene.setCollisionOfPlayerAttack(this.slash);

            //두 번째와 세 번째 단계는 스윙이 진행 중일 때 입력 허용
        } else {
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

    handleBow() {
        if (this.isRolling) {
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

        console.log('this.status.arrowCount --');
        this.status.arrowCount--;
        console.log('this.status.arrowCount : ' + this.status.arrowCount);
        // this.scene.setArrowBtnStatus(this.status.arrowCount);
        if (this.status.arrowCount == 0) {
            this.overLayArrowCoolTime.setVisible(true);
            this.overLayArrowCoolTime.clear();
            this.overLayArrowCoolTime.fillStyle(0x808080, 0.5); // 회색(0x808080) 색상 사용
            this.overLayArrowCoolTime.fillRect(
                this.btnArrowCoolTime.x - this.btnArrowCoolTime.width * this.btnArrowCoolTime.scaleX / 2,
                this.btnArrowCoolTime.y - this.btnArrowCoolTime.height * this.btnArrowCoolTime.scaleY / 2,
                this.btnArrowCoolTime.width * this.btnArrowCoolTime.scaleX,
                this.btnArrowCoolTime.height * this.btnArrowCoolTime.scaleY
            );
            this.overLayArrowCoolTime.setVisible(true);

        }

        this.arrowCountText.setText(this.status.arrowCount);

    }

    // 화살의 갯수를 증가시키는 함수
    addArrows(amount) {

        // 모바일 화살 비활성화 풀기
        // if(this.status.arrowCount <= 0){
        //     this.scene.addArrows();
        // }
        this.status.arrowCount += amount;
        console.log(`현재 화살의 갯수: ${this.status.arrowCount}`);

        //화면 ui에 화살갯수 표시
        this.arrowCountText.setText(this.status.arrowCount);
    }

    handleSpell() {
        if (this.isRolling) {
            this.cancelRoll(); // 구르기를 즉시 중단
        }
        if (this.magicCooldownElapsed !== 0) {
            return;
        }
        if (!this.isMagicOverLayCoolingDown) {
            this.isMagicOverLayCoolingDown = true;
            this.magicCooldownElapsed = 0;
            this.overLayMagicCoolTime.setVisible(true);
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
            scene: this.scene
        });
        this.scene.setCollisionOfPlayerAttack(magic);
    }

    // 공격력 조절 메서드
    adjustAttackPower(multiplier) {
        this.status.swordATK *= multiplier;
        this.status.bowATK *= multiplier;
        this.status.magicATK *= multiplier;

    }

    // 공격 스킬 쿨타임 조절 메서드
    adjustCooldown(amount) {
        this.status.swordCoolTime = Math.max(this.status.swordCoolTime + amount, 0);
        this.status.magicCoolTime = Math.max(this.status.magicCoolTime + amount, 0);

    }

    handleRoll(playerVelocity) {

        if (!this.status.canRoll) {
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
        if (this.isMoving) {
            // console.log("this.isMoving이 true");
            // console.log("this.anims.currentAnim.key " + this.anims.currentAnim.key);
            // console.log("this.slash " + this.slash);
            // console.log("this.isMovingUpward" + this.isMovingUpward);


            //슬래쉬 값이 존재하지 않고, 활을 쏘지 않을때만, 마법을 부리지 않을때만 달리기 애니메이션을 실행한다
            if (this.slash === null && !this.isShootingBow && !this.isCastingSpell) {
                if (this.isMovingUpward) {
                    this.anims.play('player_run_upward', true);
                    // console.log('위로 달리기 애니메이션 실행');

                } else {
                    this.anims.play('player_run', true);
                    // console.log('달리기 애니메이션 실행');
                }
            }

            //데미지 애니메이션이 재생중일때도 이동가능
            if (this.anims.currentAnim.key === 'player_damage') {
                this.anims.stop();
            }

            // 플레이어 마지막으로 눌렀던 방향 저장
            this.lastDirection = playerVelocity;

            playerVelocity.normalize().scale(speed);
            this.setVelocity(playerVelocity.x, playerVelocity.y);

        } else {
            // console.log("this.isMoving이 false");
            // console.log("this.isShootingBow " + this.isShootingBow);
            // console.log("this.isCastingSpell " + this.isCastingSpell);
            this.setVelocity(0, 0); // 이동하지 않을 때 속도를 0으로 설정
        }
    }

    // 이동 속도를 조절하는 함수
    adjustSpeed(multiplier) {
        this.status.speed *= multiplier;
    }

    resetComboState() {
        // 다른 동작이 시작될때는, 콤보 상태를 초기화
        this.comboState = 0;
    }

    startRoll(playerVelocity) {
        if (this.rollingCooldownElapsed !== 0) {
            return;
        }
        if (!this.isRollingOverLayCoolingDown) {
            this.isRollingOverLayCoolingDown = true;
            this.rollingCooldownElapsed = 0;
            this.overLayRollingCoolTime.setVisible(true);
        }
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
                    x: {value: targetX, duration: 550, ease: 'Power2'},
                    y: {value: targetY, duration: 550, ease: 'Power2'}
                    // Power2는 중간 속도가 빠르고 끝에서는 느리게 감속하는 방식
                },
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: this,
                        props: {
                            velocityX: {value: 0, duration: 50, ease: 'Power1'},
                            velocityY: {value: 0, duration: 50, ease: 'Power1'}
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
        // 슬래쉬 애니메이션 재생
        this.slash.play(`slash_${stage}`);

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

    setInvincible(boolean) {
        this.status.isInvincible = boolean;
    }

    takeDamage(amount) {
        this.removeSlash();
        this.isShootingBow = false; //활쏘기 중단
        this.isCastingSpell = false; // 마법 부리기 종료

        console.log("isInvincible" + this.status.isInvincible);

        if (this.isRolling) return;
        if (this.status.isInvincible) return;

        this.hitByMonster = true;
        this.status.nowHeart -= amount;
        this.status.nowHeart = this.status.nowHeart < 0 ? 0 : this.status.nowHeart;
        console.log('player takeDamage, hp : ', this.status.nowHeart);

        if (this.status.nowHeart === 0) {
            this.isAlive = false;
            this.scene.time.removeAllEvents();
            console.log("플레이어 죽음");
            this.anims.play('player_death');
            this.soundDeath.play();
            this.handlePlayerDeath();
            return 'death';
        } else {
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
        const force = {x: impactDirection.x * 0.1, y: impactDirection.y * 0.1};
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
    addCoins(amount) {
        this.status.coin += amount;
        saveCoinsToLocalStorage(this.status.coin);
        this.scene.coinIndicatorText.setText(`Coins : ${this.status.coin}`);
        console.log('addCoins - this.status.coin : ' + this.status.coin);
    }

    subtractCoins(amount) {
        if (this.status.coin >= amount) {
            this.status.coin -= amount;
            saveCoinsToLocalStorage(this.status.coin);
            this.scene.coinIndicatorText.setText(`Coins : ${this.status.coin}`);
            console.log('subtractCoins - this.status.coin : ' + this.status.coin);
        } else {
            console.log('코인이 부족합니다.');
        }
    }


    // 체력 amount만큼 증가
    increaseHeart(amount) {
        console.log('increaseHeart');
        this.status.nowHeart = this.status.nowHeart + amount > this.status.maxHeart ? this.status.maxHeart : this.status.nowHeart + amount;
        console.log('this.status.nowHeart : ' + this.status.nowHeart);
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
    increaseATK(amount) {
        console.log('increaseATK');
        this.status.swordATK += amount;
        this.status.bowATK += amount;
        this.status.magicATK += amount;
        console.log('this.status.swordATK : ' + this.status.swordATK);
        console.log('this.status.bowATK : ' + this.status.bowATK);
        console.log('this.status.magicATK : ' + this.status.magicATK);
    }

    // 애니메이션이 완료되었을 때 실행될 로직을 중앙화
    handleAnimationComplete(animation, frame) {
        if (animation.key === 'player_roll') {
            this.isRolling = false;
            this.anims.play('player_idle', true);
        } else if (animation.key === 'player_sword_1' ||
            animation.key === 'player_sword_2' ||
            animation.key === 'player_sword_3') {

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
        this.setVelocity(0, 0)
        this.anims.play('player_idle', true);

    }

    coolTimeIndicator(delta, isCoolingDown, cooldownElapsed, coolTime, overlay, button, isEnabled = true) {

        // 약초먹었을떄, 구르기 비활성화
        if (!isEnabled) {
            // 만약 isEnabled가 false라면 쿨타임 오버레이를 회색으로 채우고, 비활성화된 상태로 유지
            overlay.clear();
            overlay.fillStyle(0x808080, 0.5); // 회색(0x808080) 색상 사용
            overlay.fillRect(
                button.x - button.width * button.scaleX / 2,
                button.y - button.height * button.scaleY / 2,
                button.width * button.scaleX,
                button.height * button.scaleY
            );
            overlay.setVisible(true);
            return {isCoolingDown: true, cooldownElapsed: 0}; // 쿨타임 중으로 유지
        }


        if (isCoolingDown) {
            // 쿨타임이 진행 중이면 경과 시간 갱신
            cooldownElapsed += delta;

            // 쿨타임 게이지의 남은 시간 비율 계산 (0에서 1 사이 값)
            let remainingTimeRatio = 1 - (cooldownElapsed / coolTime);

            // 오버레이 초기화
            overlay.clear();
            overlay.fillStyle(0x000000, 0.5);

            // 남은 시간 비율에 따라 오버레이 크기 조정
            const overlayHeight = button.height * button.scaleY * remainingTimeRatio;
            const overlayY = button.y - button.height * button.scaleY / 2 + (button.height * button.scaleY - overlayHeight);

            overlay.fillRect(
                button.x - button.width * button.scaleX / 2,
                overlayY,
                button.width * button.scaleX,
                overlayHeight
            );

            if (cooldownElapsed >= coolTime) {
                // 쿨타임이 완료되면 초기화
                isCoolingDown = false;
                cooldownElapsed = 0;
                overlay.setVisible(false);
            } else {
                overlay.setVisible(true);
            }
        }

        return {isCoolingDown, cooldownElapsed};
    }


    rollingCoolTimeIndicator(delta) {
        const isEnabled = this.status.canRoll;  // 구르기 가능 여부를 기반으로 활성화 여부 결정
        const result = this.coolTimeIndicator(
            delta,
            this.isRollingOverLayCoolingDown,
            this.rollingCooldownElapsed,
            this.status.rollingCoolTime,
            this.overLayRollingCoolTime,
            this.btnRollingCoolTime,
            isEnabled // 활성화 여부 전달
        );

        this.isRollingOverLayCoolingDown = result.isCoolingDown;
        this.rollingCooldownElapsed = result.cooldownElapsed;
    }

    slashCoolTimeIndicator(delta) {
        const result = this.coolTimeIndicator(
            delta,
            this.isSlashOverLayCoolingDown,
            this.slashCooldownElapsed,
            this.status.swordCoolTime,
            this.overLaySlashCoolTime,
            this.btnSlashCoolTime
        );

        this.isSlashOverLayCoolingDown = result.isCoolingDown;
        this.slashCooldownElapsed = result.cooldownElapsed;
    }

    magicCoolTimeIndicator(delta) {
        const result = this.coolTimeIndicator(
            delta,
            this.isMagicOverLayCoolingDown,
            this.magicCooldownElapsed,
            this.status.magicCoolTime,
            this.overLayMagicCoolTime,
            this.btnMagicCoolTime
        );

        this.isMagicOverLayCoolingDown = result.isCoolingDown;
        this.magicCooldownElapsed = result.cooldownElapsed;
    }

}