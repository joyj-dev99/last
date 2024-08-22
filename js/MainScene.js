import HeartIndicator from "./HeartIndicator.js";
import ProgressIndicator from "./ProgressIndicator.js";
import TextIndicator from "./TextIndicator.js";
import Item from "./Item.js";
import Tutorial from "./Tutorial.js";
import MeatCoin from "./MeatCoin.js";

import Player from "./Player.js";
import Monster from "./monsters/Monster.js";
import MonsterApple from "./monsters/MonsterApple.js";
import MonsterBossPumpkin from "./monsters/MonsterBossPumpkin.js";
import MonsterBossGoblin from "./monsters/MonsterBossGoblin.js";
import MonsterBossNecromancer from "./monsters/MonsterBossNecromancer.js";
import MonsterBossAlchemist from "./monsters/MonsterBossAlchemist.js";
import MonsterBossWolfgang from "./monsters/MonsterBossWolfgang.js";

import Milestone from "./objects/Milestone.js";
import Chord from "./character/Chord.js";

import Arrow from "./Arrow.js";
import Slash from "./Slash.js";
import Magic from "./Magic.js";

import Dialog from "./Dialog.js";
import StageManager from "./StageManager.js";
import {mapSlectionPreload, mapAttributes, attributeIcons, showMapSelectionUI } from './mapSelection.js';
import {mapCreatePreload, setMapSize, setupMap, } from './mapCreate.js';

import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY,
    SENSOR_CATEGORY,
    MONSTER_ATTACK_CATEGORY
} from "./constants.js";
import Thelma from "./character/Thelma.js";

const { type } = window.gameConfig;

export default class MainScene extends Phaser.Scene {

    constructor() {
        super("MainScene");
    }

    // 씬이 시작되기 전에 호출되는 메서드로 안전하게 데이터를 초기화할 수 있음.
    // data : 이전 씬에서 'this.scene.start('MainScene', data)와 같은 방식으로 전달된 데이터
    init(data) {
        this.stageNumber = data.stageNumber || 3;
        this.partNumber = data.partNumber || 1;
        this.mapNumber = data.mapNumber || 'boss';
        console.log('init mapNumber : ', this.mapNumber);
        this.mapAttribute = data.mapAttribute || 4;
        this.battleEnd = data.battleEnd || false;
        
        this.playerStatus = data.playerStatus || null;
        this.skipTutorial = data.skipTutorial || false;

        console.log(`스테이지 ${this.stageNumber} , 맵 : ${this.mapNumber}`);
        console.dir(this.playerStatus);
        // arrowCount: 13으로 잘 넘어옴

        // 현재 스테이지에 살아있는 몬스터 객체를 담은 배열
        this.monsterArr = [];
        // 현재 스테이지에 드랍된 아이템 객체를 담은 배열
        this.itemArr = [];

        // 현재 스테이지에서 전투중 코드의 위치(x,y)를 담은 객체
        this.chordBattle = {x: 0, y: 0};
        // 현재 스테이지에서 전투가 끝난 후 코드의 위치(x,y)를 담은 객체;
        this.chordEnd = {x: 0, y: 0};

        // 현재 대화창이 떠있는지 여부를 나타내는 상태변수
        this.isInDialogue = true;

        this.isMapSelectionActive = false; // UI 활성화 플래그
        setMapSize(this, this.stageNumber, this.mapNumber);
        
        this.input.addPointer(2); // 기본 포인터 외에 추가로 2개의 포인터를 허용
    }

    preload() {
        mapCreatePreload(this);
        mapSlectionPreload(this);

        // 배경음악 로드
        this.load.audio("get_item", "assets/audio/get_item.wav");
        this.load.audio("coin_drop", "assets/audio/coin_drop.wav");
        this.load.audio("potion_drop", "assets/audio/potion_drop.wav");
        this.load.audio("monster_damage1", "assets/audio/monster_damage1.wav");
        this.load.audio("monster_death1", "assets/audio/monster_death1.wav");
        this.load.audio("monster_death2", "assets/audio/monster_death2.wav");
        this.load.audio("small_shot", "assets/audio/small_shot.wav");
        
        // 설정
        this.load.spritesheet('setting', 'assets/ui/Blue_Buttons_Pixel2.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('status', 'assets/ui/on_off.png', { frameWidth: 32, frameHeight: 16 });

        // // 버튼에 사용할 이미지 로드
        // this.load.spritesheet('Skills and Spells', 'assets/item/Skills and Spells.png', {
        //     frameWidth: 32, // 각 프레임의 너비
        //     frameHeight: 32, // 각 프레임의 높이
        // });

        // this.load.spritesheet('Weapons and Equipment', 'assets/item/Weapons and Equipment.png', {
        //     frameWidth: 32, // 각 프레임의 너비
        //     frameHeight: 32, // 각 프레임의 높이
        // });

        // this.load.spritesheet('Sword And Arrow', 'assets/item/Sword And Arrow.png', {
        //     frameWidth: 32, // 각 프레임의 너비
        //     frameHeight: 32, // 각 프레임의 높이
        // });

        Player.preload(this);
        Monster.preload(this);
        MonsterBossPumpkin.preload(this);
        MonsterBossGoblin.preload(this);
        MonsterBossNecromancer.preload(this);
        MonsterBossAlchemist.preload(this);
        MonsterBossWolfgang.preload(this);
        MonsterApple.preload(this);
        Chord.preload(this);
        Thelma.preload(this);
        Item.preload(this);
        Tutorial.preload(this);
        MeatCoin.preload(this);

        ProgressIndicator.preload(this);
        HeartIndicator.preload(this);
        StageManager.preload(this);

        Milestone.preload(this);
        Dialog.preload(this);

        this.load.spritesheet('mapButton', 'assets/ui/mapButton.png', {
            frameWidth: 34, // 각 프레임의 너비
            frameHeight: 10, // 각 프레임의 높이
            spacing: 4         // 각 프레임 사이의 간격
        });
    }

    create() {
        setupMap(this, this.stageNumber, this.mapNumber);
        this.setupWorld();

        //필요한 객체 생성
        this.meatcoin = new MeatCoin();
        this.dialog = new Dialog(this, this.cameras.main.width, this.cameras.main.height * 0.3, this.stageNumber, this.mapNumber);
        this.stageManager = new StageManager(this, this.player, this.chord, this.dialog, this.skipTutorial);

        // 씬이 시작될때 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.getItemSound = this.sound.add(`get_item`, {
            volume: 0.7 // Set the volume (0 to 1)
        });
        this.coinDropSound = this.sound.add(`coin_drop`, {
            volume: 0.2 // Set the volume (0 to 1)
        });
        this.potionDropSound = this.sound.add(`potion_drop`, {
            volume: 0.5 // Set the volume (0 to 1)
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
        this.smallShotSound = this.sound.add(`small_shot`, {
            volume: 0.5 // Set the volume (0 to 1)
        });

        if (this.partNumber < 4) {
            // 스테이지 진행률 UI
            this.progressIndicator = new ProgressIndicator(this, 'progressSheet', this.stageNumber, this.partNumber);
        }
        // 하트(체력) UI
        this.heartIndicator = new HeartIndicator(this, 'heartSheet', this.player.status.nowHeart);
        // 화살 갯수 UI 업데이트
        this.player.arrowCountText.setText(this.player.status.arrowCount);
        
        //페이드인 완료 후 게임 실행   
        this.cameras.main.once('camerafadeincomplete', (camera) => {
            this.time.delayedCall(1000, () => {
                console.log('camerafadeincomplete');

                this.stageManager.setStageStart(this.stageNumber, this.mapNumber,type);
            }, [], this);
        });


        // 플레이어와 몬스터 충돌 이벤트 설정
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.monsterArr,
            callback: eventData => {
                // 플레이어가 A, 충돌이 발생한 몬스터가 B
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어와 몬스터 충돌");
                // console.dir(gameObjectB);

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

        // 다음 맵으로 이동하는 이벤트 핸들러
        const goToNextHandler = (event) => {
            console.log('Selecting the next map...');
            this.input.keyboard.off('keydown-E', goToNextHandler);
            // UI가 이미 활성화된 경우 이중 실행 방지
            if (this.isMapSelectionActive) return;
        
            this.isMapSelectionActive = true; // UI 활성화 플래그 설정

            // 10개의 맵 중에서 랜덤하게 3개의 맵을 선택
            const maps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const selectedMaps = Phaser.Utils.Array.Shuffle(maps).slice(0, 3);

            const mapSelections = selectedMaps.map(mapNumber=> {
                // 해당 맵의 속성 가져오기
                const attributes = mapAttributes[mapNumber];
                const attributeNumber = Phaser.Utils.Array.GetRandom(attributes);  // 속성 랜덤 선택
                const iconKey = attributeIcons[attributeNumber];  // 속성에 해당하는 아이콘 가져오기

                return { mapNumber, attributeNumber, iconKey };
            });

            // showMapSelectionUI 함수 호출
            showMapSelectionUI.call(this, this, mapSelections, (selectedMapNumber, selectedAttribute) => {
                console.log(`Moving to map number ${selectedMapNumber}...mapAttribute : `, selectedAttribute);

                this.isMapSelectionActive = false; // UI 비활성화
                this.scene.start('MainScene', { 
                    stageNumber : this.stageNumber, 
                    partNumber: this.partNumber + 1,
                    mapNumber: selectedMapNumber,
                    mapAttribute: selectedAttribute, 
                    playerStatus : this.player.status 
                });
                this.backgroundMusic.stop();
                this.dialog.hideDialogModal();  // 선택 후 대화창 숨기기
            }, () => {
                console.log('Map selection cancelled');
                this.isMapSelectionActive = false; // UI 비활성화
                this.input.keyboard.on('keydown-E', goToNextHandler);
                this.dialog.hideDialogModal();  // 취소 후 대화창 숨기기
            });
        }
        if (this.milestone) {
            // 플레이어와 표지판 충돌 이벤트 설정
            this.matterCollision.addOnCollideStart({
                objectA: this.player,
                objectB: this.milestone,
                callback: eventData => {
                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    console.log("플레이어와 표지판 충돌");
                    // 상호작용 가능 키 표시
                    gameObjectB.showInteractPrompt();
                    // 키보드 입력 이벤트 설정
                    this.input.keyboard.on('keydown-E', goToNextHandler);
                }
            });


            this.matterCollision.addOnCollideEnd({
                objectA: this.player,
                objectB: this.milestone,
                callback: eventData => {
                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    console.log("플레이어와 표지판 떨어짐");
                    // 상호작용 가능 키 숨기기
                    gameObjectB.hideInteractPrompt();
                    // 키보드 입력 이벤트 해제
                    this.input.keyboard.off('keydown-E', goToNextHandler);
                }
            });
        }

        if(type === 'mobile'){

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
            const buttonTextStyle = { font: "8px Arial", fill: "#000000" };
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
            this.button = this.add.image(this.cameras.main.width - 79, this.cameras.main.height - 40,'Sword And Arrow' , 0)
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
            this.graphics1.fillRect(this.cameras.main.width - 50, this.cameras.main.height - 60,  42, 50);
            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics1.lineStyle(2, 0x000000); // 두께 2, 흰색 테두리
            // 사각형 테두리 그리기
            this.graphics1.strokeRect(this.cameras.main.width - 50, this.cameras.main.height - 60, 42, 50);
            // 카메라에 고정시키기
            this.graphics2.setScrollFactor(0);
            this.graphics2.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width - 50, this.cameras.main.height - 60, 42, 50), Phaser.Geom.Rectangle.Contains);

            this.graphics2.setDepth(99);


            // 버튼 생성 구르기
            this.button2 = this.add.image(this.cameras.main.width - 28, this.cameras.main.height - 40, 'Skills and Spells' , 138)       
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
            this.button3 = this.add.image(this.cameras.main.width - 79, this.cameras.main.height - 100,'Sword And Arrow' , 11)
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
            
    }


    updateJoystickState(){

        var cursorKeys = this.joystick.createCursorKeys();
        let playerKeys = this.player.cursors;
        
        playerKeys.right.isDown = cursorKeys.right.isDown;
        playerKeys.left.isDown = cursorKeys.left.isDown;
        playerKeys.up.isDown = cursorKeys.up.isDown;
        playerKeys.down.isDown = cursorKeys.down.isDown;

    }


    update(time,delta) {
        this.heartIndicator.setHeart(this.player.status.nowHeart, this.player.status.maxHeart);
        if (this.isInDialogue || this.isMapSelectionActive || !this.player.isAlive) return;
        this.player.update(time,delta);
        this.monsterArr.forEach((monster) => {
            monster.update();
        });
    }

    setupWorld() {
        // 플레이어 움직임에 따라 카메라 이동
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHigth);
        this.matter.world.setBounds(0, 0, this.mapWidth, this.mapHigth);
        this.cameras.main.startFollow(this.player);

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

        this.menuBtn = this.add.sprite(435, 16, 'setting', 22).setScale(1.3).setScrollFactor(0);//, 52
        this.menuBtn.setInteractive({ useHandCursor: true });

        this.menuBtn.on('pointerdown', () => {
            console.log('menuBtn  pointerdown');
                

            if(this.container == undefined){

           
                // 컨테이너 및 UI 요소 설정
                const panel = this.add
                    .rectangle(353, 30, 90, 45, '#FFFFFF', 0.8)
                    .setOrigin(0)
                    .setStrokeStyle(8,'#FFFFFF', 1);

                console.log('Panel:', panel);

                this.container = this.add.container(0, 0, [panel]);
                // 모든 요소에 setScrollFactor(0) 적용
                panel.setScrollFactor(0);

                // this.#width-25, 62
                // 사운드
                this.soundIcon = this.add.image(420, 43, 'status', 0).setScale(1).setVisible(true).setScrollFactor(0);
                this.container.add(this.soundIcon);
                // this.soundIcon.setPosition(10, 10);

                // 배경음악
                this.bgSoundIcon = this.add.image(420, 60, 'status', 1).setScale(1).setVisible(true).setScrollFactor(0);
                this.container.add(this.bgSoundIcon);
                // this.nextBtnImage.setPosition(20, 20);

                this.container.setScrollFactor(0); // 컨테이너 자체에도 적용


                /** @type {Phaser.Types.GameObjects.Text.TextStyle} */
                const UI_TEXT_STYLE = Object.freeze({
                    // fontFamily: KENNEY_FUTURE_NARROW_FONT_NAME,
                    color: 'white',
                    fontSize: '216px',
                    wordWrap: { width: 0 },
                });


                // 대화 텍스트 객체 추가
                this.uiText = this.add.text(360, 38, '사운드', {
                    ...UI_TEXT_STYLE,
                    ...{ fontSize: '10px' },
                }).setScrollFactor(0);
                this.container.add(this.uiText);

                // 대화 텍스트 객체 추가
                this.uiText2 = this.add.text(360, 56, '배경음악', {
                    ...UI_TEXT_STYLE,
                    ...{ fontSize: '10px' },
                }).setScrollFactor(0);
                this.container.add(this.uiText2);

                this.bgSoundIcon.setInteractive({ useHandCursor: true });

                this.bgSoundIcon.on('pointerdown', () => {
                    console.log('bgSoundIcon  pointerdown');

                    if(window.gameConfig.bgVolume === 0){
                        this.bgSoundIcon.setTexture('status', 0);
                        window.gameConfig.bgVolume = 0.2;
                        this.backgroundMusic.setVolume(0.2);
                    }
                    else{
                        this.bgSoundIcon.setTexture('status', 1);
                        window.gameConfig.bgVolume = 0;
                        this.backgroundMusic.setVolume(0);
                    }

                });


                this.soundIcon.setInteractive({ useHandCursor: true });

                this.soundIcon.on('pointerdown', () => {
                    console.log('soundIcon  pointerdown');

                    if(window.gameConfig.soundVolume === 0){
                        this.soundIcon.setTexture('status', 0);
                        window.gameConfig.soundVolume = 1;

                        this.getItemSound.setVolume(0.7);
                        this.coinDropSound.setVolume(0.4);
                        this.potionDropSound.setVolume(0.5);
                        this.monsterDamage1Sound.setVolume(0.5);
                        this.monsterDeath1Sound.setVolume(0.5);
                        this.monsterDeath2Sound.setVolume(0.5);
                        this.smallShotSound.setVolume(0.5);

                        this.player.soundSword.setVolume(0.3);
                        this.player.soundMove.setVolume(0.5);
                        this.player.soundDeath.setVolume(0.5);
                        this.player.soundDamage.setVolume(0.5);
                        this.player.soundBow.setVolume(0.4);
                        this.player.soundSpell.setVolume(0.5);
                        this.player.soundRoll.setVolume(0.5);

                        // this.backgroundMusic.setVolume(0.2);
                    }
                    else{
                        this.soundIcon.setTexture('status', 1);
                        window.gameConfig.soundVolume = 0;

                        this.getItemSound.setVolume(0);
                        this.coinDropSound.setVolume(0);
                        this.potionDropSound.setVolume(0.);
                        this.monsterDamage1Sound.setVolume(0);
                        this.monsterDeath1Sound.setVolume(0);
                        this.monsterDeath2Sound.setVolume(0);
                        this.smallShotSound.setVolume(0);

                        this.player.soundSword.setVolume(0);
                        this.player.soundMove.setVolume(0);
                        this.player.soundDeath.setVolume(0);
                        this.player.soundDamage.setVolume(0);
                        this.player.soundBow.setVolume(0);
                        this.player.soundSpell.setVolume(0);
                        this.player.soundRoll.setVolume(0);

                        // this.backgroundMusic.setVolume(0);
                    }


                    let bossPumpkins = this.monsterArr.filter(monster => monster instanceof MonsterBossPumpkin);


                    if (bossPumpkins.length > 0) {  // 배열이 비어있지 않은지 확인
                        bossPumpkins.forEach(bossPumpkin => {
                            if (window.gameConfig.soundVolume === 0) {
                                console.log('bossPumpkin : ' + bossPumpkin);
                                console.dir(bossPumpkin);
                                bossPumpkin.soundOff();
                            } else {
                                console.log('bossPumpkin : ' + bossPumpkin);
                                console.dir(bossPumpkin);
                                bossPumpkin.soundOn();
                            }
                        });
                    }

                });


                // 네모박스
                this.handler = (pointer) => {
                    console.log('pointerdown');
                    // this.container.setVisible(false);
                    // this.input.off('pointerdown', this.handler, this);

                    const bounds = this.container.getBounds();
                    const bounds2 = this.menuBtn.getBounds();

                    // 포인터가 설정 창 바깥을 클릭했는지 확인
                    if (!Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y) 
                            && !Phaser.Geom.Rectangle.Contains(bounds2, pointer.x, pointer.y)) {
                        this.container.visible = false;
                        this.isInDialogue = false;
                        // this.soundToggle.visible = false;
                    }


                };

                this.input.on('pointerdown', this.handler, this);

                if(window.gameConfig.bgVolume === 0){
                    this.bgSoundIcon.setTexture('status', 1);
                }
                else{
                    this.bgSoundIcon.setTexture('status', 0);
                }

                if(window.gameConfig.soundVolume === 0){
                    this.soundIcon.setTexture('status', 1);
                }
                else{
                    this.soundIcon.setTexture('status', 0);
                }
                // this.soundIcon.setTexture('status', 1);

            }

            this.container.setVisible(true);
            this.isInDialogue = true;

        });


    }

    removeMonsterFromArr(monster) {
        this.monsterDeath2Sound.play();

        const index = this.monsterArr.indexOf(monster);
        if (index > -1) {
            this.monsterArr.splice(index, 1);
        }
        // 배열이 비었으면 전투 종료 메서드 실행
        if (this.monsterArr.length === 0) {
            this.time.delayedCall(1000, () => {
                this.stageManager.setStageEnd(this.stageNumber, this.mapNumber, this.mapAttribute);
            }, [], this);
        }
    }

    // 동적으로 생성된 플레이어 공격에 충돌 이벤트 추가
    setCollisionOfPlayerAttack(attack) {
        this.matterCollision.addOnCollideStart({
            objectA: this.monsterArr, // 몬스터 배열
            objectB: attack, // 공격 객체
            callback: eventData => {
                this.monsterDamage1Sound.play();
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                if (gameObjectB instanceof Arrow) {
                    console.log("몬스터가 화살에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.bowATK, gameObjectB);
                    if (result === 'death') {
                        this.meatcoin.coinDrop(this, 5, 10, gameObjectA.x, gameObjectA.y);
                        // 몬스터 배열에서 해당 몬스터 제거
                        this.removeMonsterFromArr(gameObjectA);
                    }
                    gameObjectB.destroy(); // 화살 제거

                } else if (gameObjectB instanceof Slash) {
                    console.log("몬스터가 칼날에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.swordATK, gameObjectB);
                    if (result === 'death') {
                        this.meatcoin.coinDrop(this, 5, 10, gameObjectA.x, gameObjectA.y);
                        // 몬스터 배열에서 해당 몬스터 제거
                        this.removeMonsterFromArr(gameObjectA);
                    }
                } else if (gameObjectB instanceof Magic) {
                    console.log("몬스터가 마법에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.magicATK, gameObjectB);
                    if (result === 'death') {
                        this.meatcoin.coinDrop(this, 5, 10, gameObjectA.x, gameObjectA.y);
                        // 몬스터 배열에서 해당 몬스터 제거

                        this.removeMonsterFromArr(gameObjectA);
                    }
                }
            }
        });


    }

    setArrowBtnStatus(arrowCount){

        if(type == 'mobile'){
            if(this.arrowCounttext){
                this.arrowCounttext.destroy();
            }
            // 버튼 스타일 (폰트 크기 조절)
            const buttonTextStyle = { font: "18px Arial", fill: "#FFFFFF" };
            console.log("setArrowBtnStatus arrowCount : "+arrowCount);
            // this.graphics3.
            this.arrowCounttext = this.add.text(this.cameras.main.width - 80, this.cameras.main.height - 95, arrowCount, buttonTextStyle)
                .setOrigin(0.5).setScrollFactor(0);
    
            if(arrowCount <= 0 && this.graphics3){
                this.graphics3.removeAllListeners('pointerdown');
                this.graphics3.removeAllListeners('pointerup');
                this.graphics3.removeAllListeners('pointerout');
                this.graphics3.setDepth(2);
                this.button3.setDepth(0);
            }
        }
       
        
    }


    setArrowListener(){
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

    }

    addArrows(arrowCount){
    if (type === 'mobile') {

        if(this.arrowCounttext){
            this.arrowCounttext.destroy();
        }
        // 버튼 스타일 (폰트 크기 조절)
        const buttonTextStyle = { font: "18px Arial", fill: "#FFFFFF" };
        console.log("setArrowBtnStatus arrowCount : "+arrowCount);
        this.arrowCounttext = this.add.text(this.cameras.main.width - 80, this.cameras.main.height - 95, arrowCount, buttonTextStyle)
            .setOrigin(0.5).setScrollFactor(0);

            if (arrowCount > 0) {
                // 모바일 환경에서만 실행

                    if (this.graphics3 && this.button3) {
                        this.graphics3.setDepth(100);
                        this.button3.setDepth(100);
                    }
                }
            }
        
    }

    setCollisionOfMonsterShortAttack(attack) {
        this.matterCollision.addOnCollideStart({
            objectA: this.player, // 플레이어
            objectB: attack, // 공격 객체 쇼크웨이브
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어가 몬스터 공격에 맞음");
                // 몬스터가 살아있을때만 넉백도 하고 데미지도 받음
                this.player.takeDamage(gameObjectB.damage);
                this.player.applyKnockback(gameObjectB);
                if (gameObjectB.texture.key === 'spider') {
                    let initSpeed = this.player.speed;
                    this.player.speed = 0.5;
                    this.time.delayedCall(1000, () => {
                        this.player.speed = initSpeed;
                    });
                }
            }
        });

    }

    // 동적으로 생성된 몬스터 원거리 공격에 대한 충돌 이벤트 추가, 몸통박치기의 경우 이 메서드 사용하면 안됨
    setCollisionOfMonsterLongAttack(attack) {
        this.matterCollision.addOnCollideStart({
            objectA: this.player, // 플레이어
            objectB: attack, // 공격 객체(총알 그 자체)
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어가 몬스터 공격에 맞음");

                let x = gameObjectB.x;
                let y = gameObjectB.y;
                // 몬스터가 살아있을때만 넉백도 하고 데미지도 받음
                this.player.takeDamage(gameObjectB.damage);
                this.player.applyKnockback(gameObjectB);

                // 네크로맨서의 레이저빔은 사라지지 않고 유지되게 만드려고
                if (gameObjectB.texture.key === 'necromancer_beam') {
                    //     pass
                } else if (gameObjectB.texture.key === 'alchemist') {
                    gameObjectB.destroy();
                    // 충돌 후 애니메이션 재생 하고 소멸
                    const flask_hit_anim = this.matter.add.sprite(x, y, 'alchemist_flask_hit');
                    flask_hit_anim.setBody({width: 1, height: 1})
                    flask_hit_anim.setSensor(true)
                    flask_hit_anim.play('alchemist_flask_hit');
                    this.time.delayedCall(600, () => {
                        flask_hit_anim.destroy();
                    });
                } else if (gameObjectB.texture.key === 'wolfgang_missile') {
                    gameObjectB.destroy();
                    const missile_hit = this.add.image(x, y, 'wolfgang_missile_hit');
                    missile_hit.setScale(0.03);
                    this.time.delayedCall(600, () => {
                        missile_hit.destroy();
                    });
                } else if (gameObjectB.texture.key === 'lemon') {
                    gameObjectB.destroy();
                    // 충돌 후 애니메이션 재생 하고 소멸
                    const lemon_bubble_pop = this.matter.add.sprite(x, y, 'lemon_bubble_pop');
                    lemon_bubble_pop.setBody({width: 1, height: 1})
                    lemon_bubble_pop.setSensor(true)
                    lemon_bubble_pop.play('lemon_bubble_pop');
                    this.time.delayedCall(600, () => {
                        lemon_bubble_pop.destroy();
                    });
                } else if (gameObjectB.texture.key === 'spider') {
                    gameObjectB.destroy();
                    let initSpeed = this.player.speed;
                    this.player.speed = 0.5;
                    this.time.delayedCall(1000, () => {
                        this.player.speed = initSpeed;
                    });
                } else {
                    gameObjectB.destroy();
                    // 충돌 후 애니메이션 재생 하고 소멸
                    const egg_hit_anim = this.matter.add.sprite(x, y, 'eggplant_egg_hit');
                    egg_hit_anim.setBody({width: 1, height: 1})
                    egg_hit_anim.setSensor(true)
                    egg_hit_anim.play('eggplant_egg_hit');
                    this.time.delayedCall(600, () => {
                        egg_hit_anim.destroy();
                    });
                }
            }
        });
    }

    playerDebuff(attack) {
        if (attack === 'speed') {
            this.player.speed = this.player.speed - 2;
            this.time.delayedCall(5000, () => {
                this.player.speed = this.player.speed + 2;
            });
        } else if (attack === 'sight') {
            // 카메라에 반투명한 검은색 레이어 추가
            this.darkOverlay = this.add.graphics();
            this.darkOverlay.fillStyle(0x00000, 1.0);
            this.darkOverlay.fillRect(0, 0, 800, 600);
            this.darkOverlay.setScrollFactor(0);
            this.darkOverlay.setDepth(1000);
            this.tweens.add({
                targets: this.darkOverlay,
                alpha: {from: 0, to: 1},
                duration: 4000,
                onComplete: () => {
                    this.time.delayedCall(1000, () => {
                        this.darkOverlay.destroy();

                    });
                }
            });
        }
    }

    setMinotaurShockWave() {
        let playerInitSpeed = this.player.speed;
        this.player.speed = 0;
        const player_stun = this.add.image(this.player.x, this.player.y - 20, 'player_stun');
        player_stun.setScale(0.1);
        // 일정 시간 후 스턴 해제
        this.time.delayedCall(2000, () => {
            this.player.speed = playerInitSpeed;
            player_stun.destroy();
        });
    }

    doMakeBoss(bossMonster) {
        let m = null;
        const type = this.monsterArr.find(t => t.monsterType === bossMonster);
        if (type === undefined) {
            if (bossMonster === 'pumpkin') {
                m = new MonsterBossPumpkin({
                    scene: this,
                    x: 240,
                    y: 240,
                    player: this.player // 플레이어 객체 전달
                });
                m.topInfoY = 17;
                m.healthBarHeight = 8;
                m.monsterName.y = 54;
            } else if (bossMonster === 'goblin') {
                m = new MonsterBossGoblin({
                    scene: this,
                    x: 240,
                    y: 240,
                    player: this.player // 플레이어 객체 전달
                });
                m.topInfoY = 11;
                m.healthBarHeight = 8;
                m.monsterName.y = 30;
            } else if (bossMonster === 'necromancer') {
                m = new MonsterBossNecromancer({
                    scene: this,
                    x: 240,
                    y: 240,
                    player: this.player // 플레이어 객체 전달
                });
                m.topInfoY = 11;
                m.healthBarHeight = 8;
                m.monsterName.y = 30;
            } else {
                return;
            }
            m.setCollisionCategory(MONSTER_CATEGORY);
            m.setCollidesWith([PLAYER_CATEGORY, PLAYER_ATTACK_CATEGORY, TILE_CATEGORY]);
            this.monsterArr.push(m);
            m.startBattle();
        }

    }

}
