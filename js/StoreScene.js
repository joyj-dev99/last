import HeartIndicator from "./HeartIndicator.js";
import ProgressIndicator from "./ProgressIndicator.js";
import TextIndicator from "./TextIndicator.js";

import Player from "./Player.js";
import Chord from "./character/Chord.js";
import Thelma from "./character/Thelma.js";
import Milestone from "./objects/Milestone.js";
import StoreItem from "./StoreItem.js";
import Dialog from "./Dialog.js";

import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY,
    SENSOR_CATEGORY,
    MONSTER_ATTACK_CATEGORY
} from "./constants.js";

const {type} = window.gameConfig;

export default class StoreScene extends Phaser.Scene {
    constructor() {
        super("StoreScene");
    }

    // 씬이 시작되기 전에 호출되는 메서드로 안전하게 데이터를 초기화할 수 있음.
    // data : 이전 씬에서 'this.scene.start('MainScene', data)와 같은 방식으로 전달된 데이터
    init(data) {
        this.stageNumber = data.stageNumber || 1;
        this.partNumber = data.partNumber || 1;
        this.mapNumber = data.mapNumber || 5;
        this.playerStatus = data.playerStatus || null;

        // 현재 대화창이 떠있는지 여부를 나타내는 상태변수
        this.isInDialogue = true;

        this.itemArr = [];

        this.mapWidth = 480;
        this.mapHigth = 320;
        this.minX = 74;
        this.maxX = 406;
        this.minY = 74;
        this.maxY = 278;
    }

    preload() {
        this.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
        this.load.image("dungeonTileset", "assets/map/Royal Dungeon Tileset.png");
        this.load.image("officeTileset", "assets/map/Modern_Office_32x32.png");
        this.load.image("roomBuilderTileset", "assets/map/Room_Builder_Office_32x32.png");

        this.load.tilemapTiledJSON("stage_01_store", "assets/map/stage_01/stage_01_store.json");
        this.load.tilemapTiledJSON("stage_02_store", "assets/map/stage_02/stage_02_store.json");
        this.load.tilemapTiledJSON("stage_03_store", "assets/map/stage_03/stage_03_store.json");

        Player.preload(this);
        Chord.preload(this);
        Thelma.preload(this);
        Milestone.preload(this);
        StoreItem.preload(this);
        Dialog.preload(this);
        ProgressIndicator.preload(this);
        HeartIndicator.preload(this);
        this.load.audio("get_item", "assets/audio/get_item.wav");
    }

    create() {
        // 씬이 시작될때 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.matter.world.setBounds();
        const map = this.make.tilemap({key: `stage_0${this.stageNumber}_store`});

        if (this.stageNumber === 1) {
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
        } else if (this.stageNumber === 2) {

            const dungeonTileset = map.addTilesetImage("Royal Dungeon Tileset", "dungeonTileset");
            const forestTileset = map.addTilesetImage("Forest-Prairie Tileset v1", "forestTileset");

            const floor = map.createLayer("floor", dungeonTileset, 0, 0);
            const wall = map.createLayer("cliff", dungeonTileset, 0, 0);
            map.createLayer("decor1", dungeonTileset, 0, 0);
            map.createLayer("decor2", forestTileset, 0, 0);

            // 충돌이 필요한 타일 설정
            floor.setCollisionByProperty({collides: true});
            wall.setCollisionByProperty({collides: true});
            // 타일맵 레이어를 물리적으로 변환
            this.matter.world.convertTilemapLayer(floor);
            this.matter.world.convertTilemapLayer(wall);
            // 충돌 카테고리 설정
            floor.forEachTile(tile => {
                if (tile.physics.matterBody) {
                    tile.physics.matterBody.body.collisionFilter.category = TILE_CATEGORY;
                    tile.physics.matterBody.body.collisionFilter.mask = PLAYER_CATEGORY | MONSTER_CATEGORY;
                }
            });
            wall.forEachTile(tile => {
                if (tile.physics.matterBody) {
                    tile.physics.matterBody.body.collisionFilter.category = TILE_CATEGORY;
                    tile.physics.matterBody.body.collisionFilter.mask = PLAYER_CATEGORY | MONSTER_CATEGORY;
                }
            });

        } else if (this.stageNumber === 3) {
            const Tileset = map.addTilesetImage("Modern_Office_32x32", "officeTileset");
            const Tileset2 = map.addTilesetImage("Room_Builder_Office_32x32", "roomBuilderTileset");

            const floor = map.createLayer("floor", Tileset2, 0, 0);
            const wall = map.createLayer("cliff", Tileset2, 0, 0);
            map.createLayer("decor1", Tileset, 0, 0);
            map.createLayer("decor2", Tileset, 0, 0);

            // 충돌이 필요한 타일 설정
            floor.setCollisionByProperty({collides: true});
            wall.setCollisionByProperty({collides: true});
            // 타일맵 레이어를 물리적으로 변환
            this.matter.world.convertTilemapLayer(floor);
            this.matter.world.convertTilemapLayer(wall);
            // 충돌 카테고리 설정
            floor.forEachTile(tile => {
                if (tile.physics.matterBody) {
                    tile.physics.matterBody.body.collisionFilter.category = TILE_CATEGORY;
                    tile.physics.matterBody.body.collisionFilter.mask = PLAYER_CATEGORY | MONSTER_CATEGORY;
                }
            });
            wall.forEachTile(tile => {
                if (tile.physics.matterBody) {
                    tile.physics.matterBody.body.collisionFilter.category = TILE_CATEGORY;
                    tile.physics.matterBody.body.collisionFilter.mask = PLAYER_CATEGORY | MONSTER_CATEGORY;
                }
            });

        }

        //오브젝트 레이어 관련 코드
        const objectLayer = map.getObjectLayer('object');
        objectLayer.objects.forEach(object => {
            // 각 오브젝트의 속성에 접근
            const {x, y, width, height, name, type, properties} = object;
            console.log(`Object: ${name}, Type: ${type}, X: ${x}, Y: ${y}`);

            // 코드 생성 위치 설정
            if (name === 'chord') {
                this.chord = new Chord({
                    scene: this,
                    x: x,
                    y: y
                });
            }

            // 델마
            if (name === 'thelma') {
                this.bonfire = new Thelma({
                    scene: this,
                    x: x,
                    y: y
                });
            }

            if (name === 'milestone') {
                this.milestone = new Milestone({
                    scene: this,
                    x: x,
                    y: y
                });
            }

            if (type === 'item') {
                let itemKey;
                if (name === 'item1') {
                    itemKey = 11;
                } else {
                    itemKey = Math.floor(Math.random() * 10) + 1;
                }
                let item = new StoreItem({
                    scene: this,
                    x: x,
                    y: y - 10,
                    itemKey: itemKey
                });
                this.itemArr.push(item);
            }

            // 플레이어 시작 위치 설정
            if (name === 'playerStart') {
                this.player = new Player({
                    scene: this,
                    x: x,
                    y: y
                });
                this.player.status = this.playerStatus;
                this.player.arrowCountText.setText(this.player.status.arrowCount)
                this.player.arrowCountText.setText(this.player.status.arrowCount)
                if (this.player.status.arrowCount === 0) {
                    this.player.overLayArrowCoolTime.setVisible(true);
                }else {
                    this.player.overLayArrowCoolTime.setVisible(false);
                }
            }
        });

        // F키 입력 감지 및 구매 처리
        const handleFKeyPress = () => {
            if (this.selectedItem && this.selectedItem.canBuy) {
                this.selectedItem.buyItem();
                this.selectedItem = null; // 구매 후 선택된 아이템 해제
            } else if (this.selectedItem) {
                console.log('코인이 부족합니다.');
            }
        };

        // 키보드 입력 이벤트 리스너를 한번만 등록
        this.input.keyboard.on('keydown-F', handleFKeyPress);

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.itemArr,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                gameObjectB.showItemInfo();
                this.selectedItem = gameObjectB;
            }
        });

        this.matterCollision.addOnCollideEnd({
            objectA: this.player,
            objectB: this.itemArr,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                gameObjectB.hideItemInfo();
                // 충돌이 종료된 아이템이 현재 선택된 아이템인 경우 해제
                if (this.selectedItem === gameObjectB) {
                    this.selectedItem = null;
                }
            }
        });

        // 이전 맵으로 돌아가는 이벤트 핸들러
        const goBackToMap = (event) => {
            console.log(`Moving to map number ${this.mapNumber}`);

            this.isMapSelectionActive = false; // UI 비활성화

            let mainScene = this.scene.get('MainScene');
            mainScene.returnStoreStatus = this.player.status;
            this.scene.stop('StoreScene');
            // this.scene.start('MainScene', {
            //     stageNumber : this.stageNumber,
            //     partNumber: this.partNumber,
            //     mapNumber: this.mapNumber,
            //     mapAttribute: 0,
            //     battleEnd : true,
            //     playerStatus : this.player.status
            // });

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
                    this.input.keyboard.on('keydown-E', goBackToMap);
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
                    this.input.keyboard.off('keydown-E', goBackToMap);
                }
            });
        }


        //  // Play background music
        // this.backgroundMusic = this.sound.add('night_default', {
        //     volume: 0.3, // Set the volume (0 to 1)
        //     loop: true // Enable looping if desired
        // });

        //페이드인 완료 후 게임 실행
        this.cameras.main.once('camerafadeincomplete', (camera) => {
            this.chord.startPlayLute();
            // this.backgroundMusic.play();

        });

        // 플레이어 움직임에 따라 카메라 이동
        this.cameras.main.setBounds(0, 0, 480, 320);
        this.matter.world.setBounds(0, 0, 480, 320);
        this.cameras.main.startFollow(this.player);


        if (type === 'mobile') {
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
                forceMin: 1,
            }).on('update', this.updateJoystickState, this);
        }

        // 스테이지 진행률 UI
        this.progressIndicator = new ProgressIndicator(this, 'progressSheet', this.stageNumber, this.partNumber, 'store');
        // 하트(체력) UI
        this.heartIndicator = new HeartIndicator(this);
        this.heartIndicator.setHeart(this.player.status.nowHeart, this.player.status.maxHeart);

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

        this.getItemSound = this.sound.add(`get_item`, {
            volume: 0.7 // Set the volume (0 to 1)
        });

    }

    update() {
        this.player.update();
        if (this.player.status.arrowCount === 0) {
            this.player.overLayArrowCoolTime.setVisible(true);
        }else {
            this.player.overLayArrowCoolTime.setVisible(false);
        }
        this.itemArr.forEach(item => {
            item.updatePurchaseAvailability(this.player.status.coin);
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

}
