import Player from "./Player.js";
import Chord from "./character/Chord.js";
import Dialog from "./Dialog.js";
import MonsterTomato from "./monsters/MonsterTomato.js";
import Monster from "./monsters/Monster.js";

import Tutorial from "./Tutorial.js";
import MeatCoin from "./MeatCoin.js";

import TextIndicator from "./TextIndicator.js";
import HeartIndicator from "./HeartIndicator.js";


import Arrow from "./Arrow.js";
import Slash from "./Slash.js";
import Magic from "./Magic.js";

import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY,
    MONSTER_ATTACK_CATEGORY
} from "./constants.js";

const {type} = window.gameConfig;

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({key: 'IntroScene'});
    }

    init(data) {
        this.mapWidth = 960;
        this.mapHigth = 320;
        this.minX = 10;
        this.maxX = 950;
        this.minY = 96;
        this.maxY = 240;

        // 튜토리얼을 시작했는지 여부 
        this.beforeTutorial = true;
        this.isStartBattle = false;
        this.isInDialogue = true;
    }

    preload() {
        this.load.video('letter_video', 'assets/intro/letter.mp4');
        this.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
        this.load.tilemapTiledJSON("stage_01_tutorial", "assets/map/stage_01/stage_01_tutorial.json");

        this.load.audio('song_letter', 'assets/suno/song_letter.wav');
        this.load.audio("monster_damage1", "assets/audio/monster_damage1.wav");
        this.load.audio("monster_death1", "assets/audio/monster_death1.wav");
        this.load.audio("monster_death2", "assets/audio/monster_death2.wav");
        this.load.audio("coin_drop", "assets/audio/coin_drop.wav");
        
        Player.preload(this);
        Chord.preload(this);
        Dialog.preload(this);
        Monster.preload(this);
        HeartIndicator.preload(this);
        Tutorial.preload(this);
        MeatCoin.preload(this);
    }

    create() {
        this.dialog = new Dialog(this, this.cameras.main.width, this.cameras.main.height * 0.3);
        this.cameras.main.fadeIn(500, 0, 0, 0); 
        // 페이드인 완료 후 실행
        this.cameras.main.once('camerafadeincomplete', () => {
            // 동영상 객체 생성
            this.letterVideo = this.add.video(this.cameras.main.width / 2, this.cameras.main.height / 2, 'letter_video');
            this.letterVideo.setOrigin(0.5, 0.5);

            // 비디오의 원본 크기 (1280x720)을 기준으로 스케일 계산
            const originalWidth = 1280;
            const originalHeight = 720;
            const scaleX = this.cameras.main.width / originalWidth;
            const scaleY = this.cameras.main.height / originalHeight;
            const scale = Math.max(scaleX, scaleY);
            this.letterVideo.setScale(scale);

            // 동영상 재생
            this.letterVideo.play();

            // Skip 버튼 생성
            this.skipButton = this.add.text(this.cameras.main.width - 20, 30, '>>Skip', {
                fontSize: '16px',
                fill: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }).setOrigin(1, 0) // 오른쪽 위에 배치
            .setInteractive()
            .on('pointerdown', () => this.skipIntro())
            .on('pointerover', () => this.onHover(this.skipButton))
            .on('pointerout', () => this.onOut(this.skipButton));

            this.skipButton.setDepth(1000);

            // 동영상이 끝나면 실행할 콜백 설정
            this.letterVideo.on('complete', () => {
                this.setupWorld();
            });
        });
    }

    // 인트로 스킵 함수
    skipIntro() {
        if (this.letterVideo) {
            this.letterVideo.stop();  // 동영상 정지
        }
        this.startNextScene();    // 다음 씬으로 이동
    }

    // 다음 씬으로 이동 함수
    startNextScene() {
        const stageNumber = 1;
        const mapNumber = 1;
        const playerStatus = null;
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainScene',{stageNumber, mapNumber, playerStatus, skipTutorial: true});  // 다음 씬으로 이동 (NextScene을 원하는 씬 키로 교체)
        });
    }

    // 버튼에 마우스 오버 시 호출되는 함수
    onHover(button) {
        this.tweens.add({
            targets: button,
            scale: 1.2,
            duration: 100,
            ease: 'Power1'
        });
    }

    // 버튼에서 마우스가 나갈 때 호출되는 함수
    onOut(button) {
        this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: 'Power1'
        });
    }

    setupWorld() {
        // 동영상이 끝나면 플레이어 로드 및 화면에 표시
        this.letterVideo.destroy(); // 동영상 객체 제거
        this.beforeTutorial = false;
        this.meatcoin = new MeatCoin();

        this.coinDropSound = this.sound.add(`coin_drop`, {
            volume: 0.2 // Set the volume (0 to 1)
        });
        this.monsterDamage1Sound = this.sound.add(`monster_damage1`, {
            volume: 0.5 // Set the volume (0 to 1)
        });
        this.monsterDeath1Sound = this.sound.add(`monster_death1`, {
            volume: 0.5 // Set the volume (0 to 1)
        });
        this.monsterDeath2Sound = this.sound.add(`monster_death2`, {
            volume: 0.5 // Set the volume (0 to 1)
        });
        this.backgroundMusic = this.sound.add('song_letter', {
            volume: 0.1, // 볼륨 설정 (0.0 ~ 1.0)
            loop: true   // 반복 재생 여부 설정
        });

        const map = this.make.tilemap({ key: 'stage_01_tutorial' });
        const forestTileset = map.addTilesetImage("Forest-Prairie Tileset v1", "forestTileset");

        const floor = map.createLayer("floor", forestTileset, 0, 0);
        map.createLayer("cliff", forestTileset, 0, 0);
        map.createLayer("decor1", forestTileset, 0, 0);
        map.createLayer("decor2", forestTileset, 0, 0);

        // 충돌이 필요한 타일 설정
        floor.setCollisionByProperty({collides: true});
        // 타일맵 레이어를 물리적으로 변환
        this.matter.world.convertTilemapLayer(floor);
        // 충돌 카테고리 설정
        floor.forEachTile(tile => {
            if (tile.physics.matterBody) {
                tile.physics.matterBody.body.collisionFilter.category = TILE_CATEGORY;
                tile.physics.matterBody.body.collisionFilter.mask = PLAYER_CATEGORY | MONSTER_CATEGORY;
            }
        });

        //오브젝트 레이어 관련 코드
        const objectLayer = map.getObjectLayer('object');

        objectLayer.objects.forEach(object => {
            const {x, y, name, type} = object;
    
            if (name === 'playerStart') {
                this.player = new Player({
                    scene: this,
                    x: x,
                    y: y
                });
                this.player.setDepth(100);
            }

            if (name === 'chordStart') {
                this.chordStart = {x : x, y: y};
            }
        });

        objectLayer.objects.forEach(object => {
            const {x, y, name, type} = object;
            if (type === 'monster') {
                this.monster = new MonsterTomato({
                    scene: this,
                    x: x,
                    y: y,
                    player: this.player, // 플레이어 객체 전달
                });
            }
        });

        // 플레이어 움직임에 따라 카메라 이동
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHigth);
        this.matter.world.setBounds(0, 0, this.mapWidth, this.mapHigth);
        this.cameras.main.startFollow(this.player);

        // 하트(체력) UI
        this.heartIndicator = new HeartIndicator(this, 'heartSheet', this.player.status.nowHeart);
        // 화살 갯수 UI 업데이트
        this.player.arrowCountText.setText(this.player.status.arrowCount);
        if (type == 'mobile') {
            this.setMobileUI();
        }
        this.skipButton.setScrollFactor(0);

        let messages = [
            {name : '맥스', portrait : 'MaxPotrait', message : '어쩌다보니 에덴 근처까지 와버렸군.'},
            {name : '맥스', portrait : 'MaxPotrait', message : '그립지만... 꿈을 이루기 전에는 돌아갈 수 없지.'},
        ];
        this.dialog.showDialogModal(messages, () => {
            this.setCollisions();
            this.startTutorial(type);
        });
        if(type == 'pc'){
            this.dialog.addInstructions('space');
        }
        else if(type == 'mobile'){
            this.dialog.addInstructions('next');
        }

        // X, Y 위치를 화면의 상단 우측으로 설정
        const x = 15;/// 2
        const y = 6;

        // 상단 coins:{누적갯수} 텍스트 박스 표시
        this.coinIndicatorText = TextIndicator.createText(this, x, y, `Coins: ${this.player.status.coin}`, {
            fontFamily: 'Galmuri11, sans-serif',
            fontSize: '12px',
            fill: '#000', // 글씨 색상 검은색
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // 배경 투명한 흰색
            padding: {
                x: 4, // 좌우 패딩
                y: 0  // 상하 패딩
            }
        });
        // 계속 상단에 고정되도록 UI 레이어 설정
        TextIndicator.setScrollFactorText(this.coinIndicatorText);
    }

    setMobileUI() {
        // 가상 조이스틱 생성
        // 조이스틱 조작 시 player 에서 update를 실행할 때 신호를 준다.
        // or player 함수를 사용한다
        this.joystick = this.plugins.get('rexVirtualJoystick').add(this, {
            x: 80,
            y: 200,
            radius: 100,
            base: this.add.circle(0, 0, 30, 0x888888),
            thumb: this.add.circle(0, 0, 15, 0xcccccc),
            dir: '8dir',
            forceMin: 16,
        }).on('update', this.updateJoystickState, this);

        // this.joystick.setEnable(false); // 조이스틱 컨테이너를 비활성화
        // this.joystick.setVisible(false); // 조이스틱 컨테이너를 숨김


        // 버튼 스타일 (폰트 크기 조절)
        const buttonTextStyle = {font: "8px Arial", fill: "#000000"};
        // 검 공격의 grapics1에 depth 설정하니까 다 플레이어 아래로 감..? 왜지?
        const dialogDepth = 101;

        // 검 공격 버튼
        const text1 = this.add.text(this.cameras.main.width - 79, this.cameras.main.height - 20, '검 공격', buttonTextStyle)
            // .setDepth(dialogDepth)
            .setOrigin(0.5).setScrollFactor(0);

        // 새로운 그래픽스 객체 생성
        this.graphics1 = this.add.graphics();
        // 바탕 투명한 흰색 설정 (투명도 0.5)
        this.graphics1.fillStyle(0x000000, 0.5);
        // 사각형 채우기 (x, y, width, height)
        this.graphics1.fillRect(this.cameras.main.width - 101, this.cameras.main.height - 60, 42, 50);
        // 선의 스타일 설정 (두께, 색상 등)
        this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
        // 사각형 테두리 그리기
        this.graphics1.strokeRect(this.cameras.main.width - 101, this.cameras.main.height - 60, 42, 50);
        // 카메라에 고정시키기
        this.graphics1.setScrollFactor(0);//.setDepth(dialogDepth)
        this.graphics1.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width - 101, this.cameras.main.height - 60, 42, 50), Phaser.Geom.Rectangle.Contains);

        // 버튼 생성 검
        this.button = this.add.image(this.cameras.main.width - 79, this.cameras.main.height - 40, 'Sword And Arrow', 0)
            .setScale(0.75)
            // .setDepth(dialogDepth)
            .setScrollFactor(0);


        // 구르기 버튼
        const text2 = this.add.text(this.cameras.main.width - 28, this.cameras.main.height - 20, '구르기', buttonTextStyle)
            .setOrigin(0.5).setScrollFactor(0);
        text2.setDepth(100);


        // 새로운 그래픽스 객체 생성
        this.graphics2 = this.add.graphics();
        // 바탕 투명한 흰색 설정 (투명도 0.5)
        this.graphics2.fillStyle(0x000000, 0.5);
        // 사각형 채우기 (x, y, width, height)
        this.graphics1.fillRect(this.cameras.main.width - 50, this.cameras.main.height - 60, 42, 50);
        // 선의 스타일 설정 (두께, 색상 등)
        this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
        // 사각형 테두리 그리기
        this.graphics1.strokeRect(this.cameras.main.width - 50, this.cameras.main.height - 60, 42, 50);
        // 카메라에 고정시키기
        this.graphics2.setScrollFactor(0);
        this.graphics2.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width - 50, this.cameras.main.height - 60, 42, 50), Phaser.Geom.Rectangle.Contains);

        this.graphics2.setDepth(99);


        // 버튼 생성 구르기
        this.button2 = this.add.image(this.cameras.main.width - 28, this.cameras.main.height - 40, 'Skills and Spells', 138)
            .setScale(0.75)
            .setScrollFactor(0);

        this.button2.setDepth(100);


        // 활 공격 버튼
        const text3 = this.add.text(this.cameras.main.width - 79, this.cameras.main.height - 80, '활 공격', buttonTextStyle)
            .setOrigin(0.5).setScrollFactor(0);

        // 새로운 그래픽스 객체 생성
        this.graphics3 = this.add.graphics();
        // 바탕 투명한 흰색 설정 (투명도 0.5)
        this.graphics3.fillStyle(0x000000, 0.5);
        // 사각형 채우기 (x, y, width, height)
        this.graphics3.fillRect(this.cameras.main.width - 101, this.cameras.main.height - 120, 42, 50);
        // 선의 스타일 설정 (두께, 색상 등)
        this.graphics3.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
        // 사각형 테두리 그리기
        this.graphics3.strokeRect(this.cameras.main.width - 101, this.cameras.main.height - 120, 42, 50);
        // 카메라에 고정시키기
        this.graphics3.setScrollFactor(0);
        // this.graphics3.setInteractive({ useHandCursor: true });
        this.graphics3.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width - 101, this.cameras.main.height - 120, 42, 50), Phaser.Geom.Rectangle.Contains);

        // 버튼 생성 화살
        this.button3 = this.add.image(this.cameras.main.width - 79, this.cameras.main.height - 100, 'Sword And Arrow', 11)
            .setScale(0.75)
            .setScrollFactor(0);

        this.setArrowBtnStatus(this.player.status.arrowCount);


        // 마법 공격 버튼
        const text4 = this.add.text(this.cameras.main.width - 28, this.cameras.main.height - 80, '마법 공격', buttonTextStyle)
            .setOrigin(0.5).setScrollFactor(0);

        // 새로운 그래픽스 객체 생성
        this.graphics4 = this.add.graphics();
        // 바탕 투명한 흰색 설정 (투명도 0.5)
        this.graphics4.fillStyle(0x000000, 0.5);
        // 사각형 채우기 (x, y, width, height)
        this.graphics1.fillRect(this.cameras.main.width - 50, this.cameras.main.height - 120, 42, 50);
        // 선의 스타일 설정 (두께, 색상 등)
        this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
        // 사각형 테두리 그리기
        this.graphics1.strokeRect(this.cameras.main.width - 50, this.cameras.main.height - 120, 42, 50);
        // 카메라에 고정시키기
        this.graphics4.setScrollFactor(0);
        this.graphics4.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width - 50, this.cameras.main.height - 120, 42, 50), Phaser.Geom.Rectangle.Contains);

        // 버튼 생성 마법
        this.button4 = this.add.image(this.cameras.main.width - 28, this.cameras.main.height - 100, 'Skills and Spells', 1056)
            .setScale(0.75)
            .setScrollFactor(0);


        // 버튼을 눌렀을 때 (pointerdown)
        this.graphics1.on('pointerdown', () => {
            console.log('Button pressed down!');
            this.button.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

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
        this.graphics1.on('pointerup', () => {
            console.log('Button released!');
            this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
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
        this.graphics1.on('pointerout', () => {
            console.log('Pointer out of button!');
            this.button.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
        });


        // 버튼을 눌렀을 때 (pointerdown)
        this.graphics2.on('pointerdown', () => {
            console.log('Button pressed down!');
            this.button2.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

            // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
            const shiftKeyDownEvent = new KeyboardEvent('keydown', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(shiftKeyDownEvent);

        });

        // 버튼에서 손가락 또는 마우스를 뗐을 때 (pointerup)
        this.graphics2.on('pointerup', () => {
            console.log('Button released!');
            this.button2.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
            // 여기서 버튼이 떼어졌을 때의 추가 동작을 수행할 수 있습니다.

            // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
            const shiftKeyUpEvent = new KeyboardEvent('keyup', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(shiftKeyUpEvent);

        });

        // 버튼을 눌렀다가 버튼 바깥으로 나갔을 때 (pointerout)
        this.graphics2.on('pointerout', () => {
            console.log('Pointer out of button!');
            this.button2.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
        });
        // 3
        // 버튼을 눌렀을 때 (pointerdown)
        this.graphics3.on('pointerdown', () => {
            console.log('graphics3 pressed down!');
            this.button3.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

            // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
            const shiftKeyDownEvent = new KeyboardEvent('keydown', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: Phaser.Input.Keyboard.KeyCodes.X,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(shiftKeyDownEvent);

        });

        // 버튼에서 손가락 또는 마우스를 뗐을 때 (pointerup)
        this.graphics3.on('pointerup', () => {
            console.log('Button released!');
            this.button3.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
            // 여기서 버튼이 떼어졌을 때의 추가 동작을 수행할 수 있습니다.

            // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
            const shiftKeyUpEvent = new KeyboardEvent('keyup', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: Phaser.Input.Keyboard.KeyCodes.X,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(shiftKeyUpEvent);

        });

        // 버튼을 눌렀다가 버튼 바깥으로 나갔을 때 (pointerout)
        this.graphics3.on('pointerout', () => {
            console.log('Pointer out of button!');
            this.button3.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
        });

        // 버튼을 눌렀을 때 (pointerdown)
        this.graphics4.on('pointerdown', () => {
            console.log('Button pressed down!');
            this.button4.setScale(0.65);  // 버튼 크기를 작게 하여 눌린 것처럼 보이게 함

            // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
            const shiftKeyDownEvent = new KeyboardEvent('keydown', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: Phaser.Input.Keyboard.KeyCodes.C,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(shiftKeyDownEvent);

        });

        // 버튼에서 손가락 또는 마우스를 뗐을 때 (pointerup)
        this.graphics4.on('pointerup', () => {
            console.log('Button released!');
            this.button4.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
            // 여기서 버튼이 떼어졌을 때의 추가 동작을 수행할 수 있습니다.

            // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
            const shiftKeyUpEvent = new KeyboardEvent('keyup', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: Phaser.Input.Keyboard.KeyCodes.C,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(shiftKeyUpEvent);

        });

        // 버튼을 눌렀다가 버튼 바깥으로 나갔을 때 (pointerout)
        this.graphics4.on('pointerout', () => {
            console.log('Pointer out of button!');
            this.button4.setScale(0.75);  // 버튼 크기를 원래대로 되돌림
        });
    }


    updateJoystickState() {

        var cursorKeys = this.joystick.createCursorKeys();
        let playerKeys = this.player.cursors;

        playerKeys.right.isDown = cursorKeys.right.isDown;
        playerKeys.left.isDown = cursorKeys.left.isDown;
        playerKeys.up.isDown = cursorKeys.up.isDown;
        playerKeys.down.isDown = cursorKeys.down.isDown;

    }

    update(time, delta) {
        if (this.beforeTutorial) return; 
        this.heartIndicator.setHeart(this.player.status.nowHeart, this.player.status.maxHeart);

        if (this.isInDialogue || !this.player.isAlive) return;
        this.player.update(time, delta);
        if (this.monster) {
            this.monster.update();
        }
    }

    setCollisions() {
        // 플레이어와 몬스터 충돌 이벤트 설정
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.monster,
            callback: eventData => {
                // 플레이어가 A, 충돌이 발생한 몬스터가 B
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어와 몬스터 충돌");
                // 슬래쉬 제거
                this.player.removeSlash();
                // 콤보 초기화
                this.player.comboState = 0;
                // 몬스터가 살아있을때만 넉백도 하고 데미지도 받음
                if (gameObjectB.isAlive && this.player.isAlive) {
                    gameObjectB.monsterAttackPlayer();
                    this.player.takeDamage(gameObjectB.damage);
                    if (this.player.isAlive) {
                        this.player.applyKnockback(gameObjectB);
                    }
                }
            }
        });
    }

    startTutorial(type){
        let tutorial = new Tutorial(this.player, this, this.dialog , type);
        // 첫번째는 센서 없이 바로 시작
        this.isInDialogue = true;
        let dialog_msg = '';

        if(type === 'pc'){
            dialog_msg = '방향키를 눌러서 8방향으로 움직여보자!';
        }
        else if(type === 'mobile'){
            dialog_msg = '이동 조작기를 사용해서 8방향으로 움직여보자!';
        }

        const dialogueMessages = [
            {name : '맥스', portrait : 'MaxPotrait', message : '언제나 기본적인 것을 잊지 않는게 중요하지.'},
            {name : '맥스', portrait : 'MaxPotrait', message : dialog_msg},
        ];

        // 메시지 표시가 끝난 후 콜백 처리
            this.dialog.showDialogModal(dialogueMessages, () => {
            this.isInDialogue = false;
            // pc 튜토리얼
            tutorial.startDirectionControlExplanation(this, 250, this.player.y - 160, this.player);
        });
        if(type == 'pc'){
            this.dialog.addInstructions('space');
        }
        else if(type == 'mobile'){
            this.dialog.addInstructions('next');
        }

        let sensor2 = tutorial.createSensor(this, 280, this.player.y - 160, 10, 500);
        // 충돌시 이동키 설명관련 데이터 삭제
        // shift, z 한번, z 세번

        // shift를 눌러보세요!
        // z key를 눌러보세요!
        // z key를 연속 3번 눌러보세요!
        const unsubscribe2 = this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: sensor2,
            callback: eventData => {
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                console.log("플레이어와 센서2 충돌");
                this.isInDialogue = true;
                this.player.stopMove();
                // 센서 제거
                tutorial.onSensorHit(this, bodyB);
                // 오른쪽 사인 제거
                tutorial.removeRightSign();
                // 이동키 조작 설명 끝
                tutorial.endDirectionControlExplanation();

                if(type === 'pc'){
                    dialog_msg = 'z 키를 눌러서 검을 휘둘러보자!';
                }
                else if(type === 'mobile'){
                    dialog_msg = '공격 버튼을 눌러서 검을 휘둘러보자!';
                    // 공격 버튼을 연속으로 눌러 빠르게 검을 최대 3번까지 휘둘러 보세요. 3번의 연속 공격이 가능합니다!
                }
    
                const dialogueMessages = [
                    {name : '맥스', portrait : 'MaxPotrait', message : dialog_msg},
                ];
                this.dialog.showDialogModal(dialogueMessages, () => {
                    this.isInDialogue = false;
                    // 공격키 설명 시작
                    tutorial.startATKKeyControlExplanation(this, this.player.x +50, this.player.y - 160);
                });

                // 충돌 이벤트 제거
                unsubscribe2();
            }
        });


        let sensor3 = tutorial.createSensor(this, 380, this.player.y - 160, 10, 500);
        // 충돌시 이동키 설명관련 데이터 삭제
        const unsubscribe3 = this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: sensor3,
            callback: eventData => {
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                console.log("플레이어와 센서3 충돌");
                this.isInDialogue = true;
                this.player.stopMove();
                // 센서 제거
                tutorial.onSensorHit(this, bodyB);
                // 오른쪽 사인 제거
                tutorial.removeRightSign();
                // z키 조작 설명 끝
                tutorial.endATKKeyControlExplanation();

                if(type === 'pc'){
                    dialog_msg = '방향키와 함께 shift 키를 누르면 구를 수 있어!';
                }
                else if(type === 'mobile'){
                    dialog_msg = '이동조작기와 함께 구르기 버튼을 누르면 구를 수 있어!';
                }
    

                const dialogueMessages = [
                    {name : '맥스', portrait : 'MaxPotrait', message : dialog_msg},
                    {name : '맥스', portrait : 'MaxPotrait', message : '공격을 피해야 할 때, 구르기를 사용해보자.'},
                ];
                // 메시지 표시가 끝난 후 콜백 처리
                this.dialog.showDialogModal(dialogueMessages, () => {
                    this.isInDialogue = false;
                    // shift 키 설명 시작
                    tutorial.startshiftKeyControlExplanation(this, this.player.x +50, this.player.y - 160);
                });
                // 충돌 이벤트 제거
                unsubscribe3();
            }
        });

        
        let sensor4 = tutorial.createSensor(this, 600, this.player.y - 160, 10, 500);
        // 충돌시 이동키 설명관련 데이터 삭제
        const unsubscribe4 = this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: sensor4,
            callback: eventData => {
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                console.log("플레이어와 센서4 충돌");
                this.isInDialogue = true;
                this.player.stopMove();
                // 센서 제거
                tutorial.onSensorHit(this, bodyB);
                // 오른쪽 사인 제거
                tutorial.removeRightSign();
                tutorial.endshiftKeyControlExplanation();
                tutorial.finish(this);

                const dialogueMessages = [
                    {name : '맥스', portrait : 'MaxPotrait', message : '토마토? 아니 몬스터인가.'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '저런 건 처음보는데…'},
                ];
                // 메시지 표시가 끝난 후 콜백 처리
                this.dialog.showDialogModal(dialogueMessages, () => {
                    this.isInDialogue = false;
                    this.isStartBattle = true;                               
                    this.monster.startBattle();
                });

                if(type == 'pc'){
                    this.dialog.addInstructions('space');
                }
                else if(type == 'mobile'){
                    this.dialog.addInstructions('next');
                }
                // 충돌 이벤트 제거
                unsubscribe4();
            }
        });
    }

    battleEnd() {
        this.fadeOutBGM();
        
        this.time.delayedCall(1000, () => {
            this.isInDialogue = true;
            let messages = [
                {name : '맥스', portrait : 'MaxPotrait', message : '이건 미트코인이잖아?'},
                {name : '맥스', portrait : 'MaxPotrait', message : '소유자의 영혼을 인식하는 기술 때문에 죽어도 소유권이 이전되지 않는다고 유행했었지'},
                {name : '맥스', portrait : 'MaxPotrait', message : '사기라고 알려진 뒤로는 쓰는 사람이 거의 없다고 알고 있는데...'},
                {name : '맥스', portrait : 'MaxPotrait', message : '우선 가까운 마을로 돌아가서 이야기를 들어봐야겠어.'},
            ];
            this.dialog.showDialogModal(messages, () => {
                this.chord = new Chord({
                    scene: this,
                    x: this.player.x - 50,
                    y: this.player.y
                });
                this.player.setFlipX(true);
                messages = [
                    {name : '코드', portrait : 'ChordPotrait', message : '맥스님!'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '코드? 네가 어떻게 여기에...'},
                    {name : '코드', portrait : 'ChordPotrait', message : '맥스님을 여기서 봤다는 소문을 듣고 찾아왔어요.'},
                    {name : '코드', portrait : 'ChordPotrait', message : '맥스님, 에덴에 큰일이 생겼습니다. 긴히 드릴 말씀이 있어요.'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '뭐? 무슨일이야?'},
                    {name : '코드', portrait : 'ChordPotrait', message : '몇 년 전에 볼프강이라는 과학자가 에덴에 찾아왔습니다.'},
                    {name : '코드', portrait : 'ChordPotrait', message : '그 사람이 나타난 이후로 에덴 주민들이 점점 행방불명이 되기 시작했어요.'},
                    {name : '코드', portrait : 'ChordPotrait', message : '처음에는 단순한 실종이라고 생각했는데...'},
                    {name : '코드', portrait : 'ChordPotrait', message : '결국에는 남작님 내외와 일가 사람들까지 모두 사라져 버렸습니다.'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '뭐라고? 아버지, 어머니께서?'},
                    {name : '코드', portrait : 'ChordPotrait', message : '그 뒤로 주인을 잃은 남작성은 볼프강의 손에 넘어갔습니다.'},
                    {name : '코드', portrait : 'ChordPotrait', message : '볼프강은 성 인근에 연구소를 차리고 알수 없는 실험을 하고 있어요.'},
                    {name : '코드', portrait : 'ChordPotrait', message : '그 이후로 에덴에는 정체를 알 수 없는 몬스터들이 넘쳐나기 시작했습니다.'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '아까 마주쳤던 토마토 같은 몬스터를 말하는건가...'},
                    {name : '코드', portrait : 'ChordPotrait', message : '맥스님 아직 모험이 끝나지 않은 건 알고 있습니다...'},
                    {name : '코드', portrait : 'ChordPotrait', message : '하지만 제발 에덴으로 돌아와주세요'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '그래... 무슨 일이 벌어지고 있는지 확인해야겠어.'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '함께 에덴으로 가자, 코드.'},
                ];
                this.dialog.showDialogModal(messages, () => {
                    this.cameras.main.fadeOut(2000, 0, 0, 0);
                    this.fadeOutBGM();

                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('MainScene');  // 메인 씬으로 이동
                    });
                });
            });

        }, [], this);
    }

    fadeOutBGM() {
        if (this.backgroundMusic) {
            // 1초 동안 볼륨을 서서히 줄임 (1000ms)
            this.tweens.add({
                targets: this.backgroundMusic,
                volume: 0,
                duration: 2000,
                onComplete: () => {
                    this.backgroundMusic.stop();
                }
            });
        }
    }


    // 동적으로 생성된 플레이어 공격에 충돌 이벤트 추가
    setCollisionOfPlayerAttack(attack) {
        if (!this.isStartBattle) return; // 튜토리얼 끝나기 전에 몬스터가 죽는 것 방지
        this.matterCollision.addOnCollideStart({
            objectA: this.monster, // 몬스터 배열
            objectB: attack, // 공격 객체
            callback: eventData => {
                this.monsterDamage1Sound.play();
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                if (gameObjectB instanceof Arrow) {
                    console.log("몬스터가 화살에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.bowATK, gameObjectB);
                    if (result === 'death') {
                        this.meatcoin.coinDrop(this, 5, 10, gameObjectA.x, gameObjectA.y);
                        this.monsterDeath2Sound.play();                    
                        this.battleEnd();
                    }
                    gameObjectB.destroy(); // 화살 제거

                } else if (gameObjectB instanceof Slash) {
                    console.log("몬스터가 칼날에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.swordATK, gameObjectB);
                    if (result === 'death') {
                        this.meatcoin.coinDrop(this, 5, 10, gameObjectA.x, gameObjectA.y);
                        this.monsterDeath2Sound.play();                    
                        this.battleEnd();
                    }
                } else if (gameObjectB instanceof Magic) {
                    console.log("몬스터가 마법에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.magicATK, gameObjectB);
                    if (result === 'death') {
                        this.meatcoin.coinDrop(this, 5, 10, gameObjectA.x, gameObjectA.y);
                        this.monsterDeath2Sound.play();                    
                        this.battleEnd();
                    }
                }
            }
        });
    }
}