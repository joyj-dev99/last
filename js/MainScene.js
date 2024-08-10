import HeartIndicator from "./HeartIndicator.js";
import ProgressIndicator from "./ProgressIndicator.js";
import TextIndicator from "./TextIndicator.js";
import Item from "./Item.js";

import Player from "./Player.js";
import Monster from "./monsters/Monster.js";
import MonsterTomato from "./monsters/MonsterTomato.js";
import MonsterEggplant from "./monsters/MonsterEggplant.js";

import Milestone from "./objects/Milestone.js";
import Chord from "./character/Chord.js";

const PLAYER_CATEGORY = 0x0001;
const MONSTER_CATEGORY = 0x0002;
const TILE_CATEGORY = 0x0004;

export default class MainSceneTest extends Phaser.Scene {
    
    constructor() {
        super("MainScene");
    }

    // 씬이 시작되기 전에 호출되는 메서드로 안전하게 데이터를 초기화할 수 있음.
    // data : 이전 씬에서 'this.scene.start('MainScene', data)와 같은 방식으로 전달된 데이터
    init(data) {
        this.stageNumber = data.stageNumber || 1;
        this.mapNumber = data.mapNumber || 1;
        this.playerStatus = data.playerStatus || null;
        console.log(`스테이지 ${this.stageNumber} , 맵 : ${this.mapNumber}`);
        console.dir(this.playerStatus);
        
        // 현재 스테이지에 살아있는 몬스터 객체를 담은 배열
        this.monsterArr = [];
        // 현재 스테이지에 드랍된 아이템 객체를 담은 배열
        this.itemArr = [];

        // 현재 스테이지에서 전투중 코드의 위치(x,y)를 담은 객체
        this.chordBattle = {x: 0, y: 0};
        // 현재 스테이지에서 전투가 끝난 후 코드의 위치(x,y)를 담은 객체;
        this.chordEnd = {x: 0, y: 0};

    }

    preload() {
        this.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
        this.load.tilemapTiledJSON("stage_01_01_map", "assets/map/stage_01_01.json");
        this.load.tilemapTiledJSON("stage_01_02_map", "assets/map/stage_01_02.json");
        this.load.tilemapTiledJSON("stage_01_03_map", "assets/map/stage_01_03.json");
        this.load.tilemapTiledJSON("stage_01_04_map", "assets/map/stage_01_04.json");

        // 배경음악 로드
        this.load.audio("backgroundMusic", "assets/audio/field_theme_1.wav");

        Player.preload(this);
        Monster.preload(this);
        Chord.preload(this);
        Item.preload(this);

        ProgressIndicator.preload(this);
        HeartIndicator.preload(this);

        Milestone.preload(this);
    }

    create() {

        // 씬이 시작될때 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.setupWorld(this.stageNumber, this.mapNumber);

        // Play background music
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            volume: 0.3, // Set the volume (0 to 1)
            loop: true // Enable looping if desired
        });

        // 스테이지 진행률 UI
        this.progressIndicator = new ProgressIndicator(this,'progressSheet', this.stageNumber , this.mapNumber - 1);
        // 하트(체력) UI
        this.heartIndicator = new HeartIndicator(this, 'heartSheet', this.player.status.nowHeart);

        //페이드인 완료 후 게임 실행
        this.cameras.main.once('camerafadeincomplete', (camera) => {
            this.chord.startPlayLute();
            this.backgroundMusic.play();
        });

        // 플레이어와 몬스터 충돌 이벤트 설정
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.monsterArr,
            callback: eventData => {
                
                // 플레이어가 A, 충돌이 발생한 몬스터가 B
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                console.log("플레이어와 몬스터 충돌");
                // console.dir(gameObjectB);
                // 몬스터를 일시적으로 정적으로 설정하여 충돌 순간에 제자리에 있도록 함
                gameObjectB.setStatic(true);

                // 일정 시간 후 몬스터를 다시 움직일 수 있도록 설정
                this.time.delayedCall(100, () => {
                    gameObjectB.setStatic(false);
                });
                this.player.takeDamage(gameObjectB.damage);
                this.player.applyKnockback(gameObjectB);

                // 몬스터와 충돌 시 아이템 드랍하기
                // 아이템 종류 정하기 (토마토는 토마토시체 또는 코인 / 가지는 가지 시체 또는 코인)
                const itemType = Item.createItemType(gameObjectB);
             
                // 몬스터의 위치에 객체 생성 
                let item = new Item({
                    scene : this,
                    x : gameObjectB.x,
                    y : gameObjectB.y,
                    itemType : itemType
                });

                // 플레이어와 아이템 충돌 이벤트 설정
                const unsubscribe = this.matterCollision.addOnCollideStart({
                    objectA: this.player,
                    objectB: item,
                    callback: eventData => {

                        const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                        console.log("플레이어와 아이템 충돌");
                        // 아이템 효과 적용하기 및 화면에 반영하기
                        gameObjectB.applyItem(gameObjectA,this.coinIndicatorText,this.heartIndicator);
                        unsubscribe();
                    }
                });
                
            }
        });

        // 다음 맵으로 이동하는 이벤트 핸들러
        const goToNextHandler = (event) => {
            console.log('Moving to the next map...');
            const stageNumber = this.stageNumber;
            const mapNumber = this.mapNumber + 1;
            const playerStatus = this.player.status;
            if (mapNumber < 5) {
                this.scene.start('MainScene', {stageNumber, mapNumber, playerStatus});
                this.backgroundMusic.stop();
            } else {
                this.scene.start('NightScene', {stageNumber, mapNumber, playerStatus});
                this.backgroundMusic.stop();
            }
        }

        // 플레이어와 표지판 충돌 이벤트 설정
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.milestone,
            callback: eventData => {
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
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
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                console.log("플레이어와 표지판 떨어짐");
                // 상호작용 가능 키 숨기기
                gameObjectB.hideInteractPrompt();
                // 키보드 입력 이벤트 해제
                this.input.keyboard.off('keydown-E', goToNextHandler);
            }
        });

    }

    update() {
        this.player.update();
        this.heartIndicator.setHeart(this.player.status.nowHeart);
        this.monsterArr.forEach((monster) =>{
            monster.update();
        });
    }

    setupWorld(stageNumber, mapNumber) {

        const map = this.make.tilemap({key: `stage_0${stageNumber}_0${mapNumber}_map`});
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

        if (mapNumber < 5) { // 낮일 때
            this.minX = 10;
            this.maxX = 950;
            this.minY = 96;
            this.maxY = 240;
        } else { // 밤일때
            this.minX = 10;
            this.maxX = 950;
            this.minY = 96;
            this.maxY = 240;
        }

        //오브젝트 레이어 관련 코드
        const objectLayer = map.getObjectLayer('object');
        objectLayer.objects.forEach(object => {
            // 각 오브젝트의 속성에 접근
            const { x, y, name, type} = object;
            console.log(`Object: ${name}, Type: ${type}, X: ${x}, Y: ${y}`);
    
            // 코드 생성 위치 설정
            if (type === 'chord') {
                if (name === 'chordStart') {
                    this.chord = new Chord({
                        scene: this,
                        x: x,
                        y: y
                    });
                } else if (name === 'chordBattle') {
                    this.chordBattle = {x: x, y: y};
                    console.log(`chordBattle = {x: ${this.chordBattle.x}, y: ${this.chordBattle.y}`);
                    
                } else if (name === 'chordEnd') {
                    this.chordEnd = {x: x, y: y};
                    console.log(`chordEnd = {x: ${this.chordEnd.x}, y: ${this.chordEnd.y}`);
                }
            }

            // 표지판
            if (name === 'milestone') {
                this.milestone = new Milestone({
                    scene: this,
                    x: x,
                    y: y
                });
            }

            // 플레이어 시작 위치 설정
            if (name === 'playerStart') {
                this.player = new Player({
                    scene: this,
                    x: x,
                    y: y
                });
                this.player.setDepth(100);
                if (this.playerStatus != null) {
                    this.player.status = this.playerStatus;
                }
            }
        });

        // 몬스터 생성 - 플레이어가 생성된 이후에 생성되어야 함.
        objectLayer.objects.forEach(object => {
            const { x, y, name, type } = object;
            if (type === 'monster') {
                let m;
                //몬스터 종류에 따라 다르게 생성 -> 추후 구현
                switch (name) {
                    case 'tomato':
                        m = new MonsterTomato({
                            scene: this, 
                            x: x, 
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'eggplant':
                        m = new MonsterEggplant({
                            scene: this, 
                            x: x, 
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    default:
                        // console.log("몬스터 생성 : " + name);
                }
                this.monsterArr.push(m);
            }
        });

        // 플레이어 움직임에 따라 카메라 이동
        this.cameras.main.setBounds(0, 0, 960, 320);
        this.matter.world.setBounds(0, 0, 960, 320);
        this.cameras.main.startFollow(this.player);

        // 상단 coins:{누적갯수} 텍스트 박스 표시
        this.coinIndicatorText = TextIndicator.createText(this, 10, 10,  `Coins: ${this.player.status.coin}`, {
            fontSize: '1vw',
            fill: '#000', // 글씨 색상 검은색
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // 배경 투명한 흰색
            padding: {
                x: 10, // 좌우 패딩
                y: 5  // 상하 패딩
            }
        });
        // 계속 상단에 고정되도록 UI 레이어 설정
        TextIndicator.setScrollFactorText(this.coinIndicatorText);

    }
}
