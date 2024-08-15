import HeartIndicator from "./HeartIndicator.js";
import ProgressIndicator from "./ProgressIndicator.js";
import TextIndicator from "./TextIndicator.js";
import Item from "./Item.js";
import Tutorial from "./Tutorial.js";

import Player from "./Player.js";
import Monster from "./monsters/Monster.js";
import MonsterTomato from "./monsters/MonsterTomato.js";
import MonsterEggplant from "./monsters/MonsterEggplant.js";
import MonsterLemon from "./monsters/MonsterLemon.js";
import MonsterBossPumpkin from "./monsters/MonsterBossPumpkin.js";
import MonsterFly from "./monsters/MonsterFly.js";
import MonsterSpider from "./monsters/MonsterSpider.js";
import MonsterMiniGoblin from "./monsters/MonsterMiniGoblin.js";
import MonsterRatfolk from "./monsters/MonsterRatfolk.js";
import MonsterBossGoblin from "./monsters/MonsterBossGoblin.js";
import MonsterBossNecromancer from "./monsters/MonsterBossNecromancer.js";
import MonsterBugbear from "./monsters/MonsterBugbear.js";
import MonsterAngel from "./monsters/MonsterAngel.js";
import MonsterGolem from "./monsters/MonsterGolem.js";

import Milestone from "./objects/Milestone.js";
import Chord from "./character/Chord.js";

import Arrow from "./Arrow.js";
import Slash from "./Slash.js";
import Magic from "./Magic.js";

import SpeechBubble from "./SpeechBubble.js";

import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY,
    SENSOR_CATEGORY
} from "./constants.js";

import MonsterApple from "./monsters/MonsterApple.js";
import StageManager from "./StageManager.js";

export default class MainSceneTest extends Phaser.Scene {

    constructor() {
        super("MainScene");
    }

    // 씬이 시작되기 전에 호출되는 메서드로 안전하게 데이터를 초기화할 수 있음.
    // data : 이전 씬에서 'this.scene.start('MainScene', data)와 같은 방식으로 전달된 데이터
    init(data) {
        this.stageNumber = data.stageNumber || 2;
        this.mapNumber = data.mapNumber || 4;
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

        // 현재 대화창이 떠있는지 여부를 나타내는 상태변수
        this.isInDialogue = true;

        if (this.stageNumber === 1 && this.mapNumber <= 3) { // 일반맵
            this.mapWidth = 960;
            this.mapHigth = 320;
            this.minX = 10;
            this.maxX = 950;
            this.minY = 96;
            this.maxY = 240;
        } else if (this.stageNumber === 1 && this.mapNumber == 4) { // 보스맵
            this.mapWidth = 480;
            this.mapHigth = 480;
            this.minX = 74;
            this.maxX = 406;
            this.minY = 106;
            this.maxY = 438;
        } else if (this.stageNumber === 2 && this.mapNumber <= 3) { // 일반맵
            this.mapWidth = 960;
            this.mapHigth = 320;
            this.minX = 10;
            this.maxX = 950;
            this.minY = 96;
            this.maxY = 240;
        } else if (this.stageNumber === 2 && this.mapNumber == 4) { // 보스맵
            this.mapWidth = 480;
            this.mapHigth = 480;
            this.minX = 74;
            this.maxX = 406;
            this.minY = 106;
            this.maxY = 438;
        }
        else if (this.stageNumber === 3 && this.mapNumber <= 3) { // 일반맵
            this.mapWidth = 960;
            this.mapHigth = 320;
            this.minX = 10;
            this.maxX = 950;
            this.minY = 96;
            this.maxY = 240;
        } else if (this.stageNumber === 3 && this.mapNumber == 4) { // 보스맵
            this.mapWidth = 480;
            this.mapHigth = 480;
            this.minX = 74;
            this.maxX = 406;
            this.minY = 106;
            this.maxY = 438;
        }
    }

    preload() {

        this.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
        this.load.tilemapTiledJSON("stage_01_01_map", "assets/map/stage_01_01.json");
        this.load.tilemapTiledJSON("stage_01_02_map", "assets/map/stage_01_02.json");
        this.load.tilemapTiledJSON("stage_01_03_map", "assets/map/stage_01_03.json");
        this.load.tilemapTiledJSON("stage_01_04_map", "assets/map/stage_01_04.json");

        this.load.image("dungeonTileset", "assets/map/Royal Dungeon Tileset.png");
        this.load.tilemapTiledJSON("stage_02_01_map", "assets/map/stage_02_01.json");
        this.load.tilemapTiledJSON("stage_02_02_map", "assets/map/stage_02_02.json");
        this.load.tilemapTiledJSON("stage_02_03_map", "assets/map/stage_02_03.json");
        this.load.tilemapTiledJSON("stage_02_04_map", "assets/map/stage_02_04.json");

        this.load.image("Tileset", "assets/map/Modern_Office_32x32.png");
        this.load.image("Tileset2", "assets/map/Room_Builder_Office_32x32.png");
        this.load.image("Tileset3", "assets/map/Lab Tileset.png");
         
        this.load.tilemapTiledJSON("stage_03_01_map", "assets/map/stage_03_01.json");
        this.load.tilemapTiledJSON("stage_03_02_map", "assets/map/stage_03_02.json");
        this.load.tilemapTiledJSON("stage_03_03_map", "assets/map/stage_03_03.json");
        this.load.tilemapTiledJSON("stage_03_04_map", "assets/map/stage_03_04.json");

        // 배경음악 로드
        this.load.audio("bgm_stage_1", "assets/audio/field_theme_1.wav");

        Player.preload(this);
        Monster.preload(this);
        MonsterBossPumpkin.preload(this);
        MonsterBossGoblin.preload(this);
        MonsterBossNecromancer.preload(this);
        Chord.preload(this);
        Item.preload(this);
        Tutorial.preload(this);

        ProgressIndicator.preload(this);
        HeartIndicator.preload(this);

        Milestone.preload(this);
        SpeechBubble.preload(this);
    }

    create() {
        // 씬이 시작될때 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.setupWorld(this.stageNumber, this.mapNumber);

        // Play background music
        this.backgroundMusic = this.sound.add(`bgm_stage_1`, {
            volume: 0.3, // Set the volume (0 to 1)
            loop: true // Enable looping if desired
        });

        // 스테이지 진행률 UI
        this.progressIndicator = new ProgressIndicator(this, 'progressSheet', this.stageNumber, this.mapNumber - 1);
        // 하트(체력) UI
        this.heartIndicator = new HeartIndicator(this, 'heartSheet', this.player.status.nowHeart);

        this.stageManager = new StageManager(this, this.player, this.chord);
        //페이드인 완료 후 게임 실행
        this.cameras.main.once('camerafadeincomplete', (camera) => {
            this.time.delayedCall(1000, () => {
                this.stageManager.setStageStart(this.stageNumber, this.mapNumber);
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
                if (gameObjectB.isAlive) {
                    gameObjectB.actionAmin('attack');
                    this.player.takeDamage(gameObjectB.damage);
                    this.player.applyKnockback(gameObjectB);
                }
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

    update() {
        if (this.isInDialogue) return;
        this.player.update();
        this.heartIndicator.setHeart(this.player.status.nowHeart);
        this.monsterArr.forEach((monster) => {
            monster.update();
        });
    }

    setupWorld(stageNumber, mapNumber) {
        const map = this.make.tilemap({key: `stage_0${stageNumber}_0${mapNumber}_map`});

        if (stageNumber === 1) {
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
        } else if (stageNumber === 2) {
            const dungeonTileset = map.addTilesetImage("Royal Dungeon Tileset", "dungeonTileset");

            const floor = map.createLayer("floor", dungeonTileset, 0, 0);
            const wall = map.createLayer("wall", dungeonTileset, 0, 0);
            map.createLayer("decor1", dungeonTileset, 0, 0);
            map.createLayer("decor2", dungeonTileset, 0, 0);

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
        else if (stageNumber === 3 && mapNumber <= 3) {
            const Tileset = map.addTilesetImage("Modern_Office_32x32", "Tileset");
            const Tileset2 = map.addTilesetImage("Room_Builder_Office_32x32", "Tileset2");
            const Tileset3 = map.addTilesetImage("Lab Tileset", "Tileset3");

            const floor = map.createLayer("floor", Tileset2, 0, 0);
            const wall = map.createLayer("wall", Tileset2, 0, 0);
            map.createLayer("decor1", Tileset2, 0, 0);
            map.createLayer("decor2", Tileset, 0, 0);
            // map.createLayer("decor2", Tileset3, 0, 0);

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

        } else if (stageNumber === 3 && mapNumber === 4) {

            const Tileset = map.addTilesetImage("Lab Tileset", "Tileset3");

            const floor = map.createLayer("floor", Tileset, 0, 0);
            const wall = map.createLayer("wall", Tileset, 0, 0);
            map.createLayer("decor1", Tileset, 0, 0);
            // map.createLayer("decor2", Tileset, 0, 0);

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
        console.log('map : '+map);
        console.dir(map);
        console.log('objectLayer : '+objectLayer);
        objectLayer.objects.forEach(object => {
            // 각 오브젝트의 속성에 접근
            const {x, y, name, type} = object;
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
            const {x, y, name, type} = object;
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
                    case 'apple':
                        m = new MonsterApple({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'lemon' :
                        m = new MonsterLemon({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'pumpkin' : 
                        m = new MonsterBossPumpkin({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'fly' : 
                        m = new MonsterFly({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'spider' : 
                        m = new MonsterSpider({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'mini goblin' : 
                        m = new MonsterMiniGoblin({//MonsterMiniGoblin
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'ratfolk' : 
                        m = new MonsterRatfolk({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break; 
                    case 'goblin' :
                        m = new MonsterBossGoblin({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'necromancer':
                        m = new MonsterBossNecromancer({
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break;
                    case 'bugbear' : 
                        m = new MonsterBugbear({ 
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break; 
                    case 'angle' : 
                        m = new MonsterAngel({ 
                            scene: this,
                            x: x,
                            y: y,
                            player: this.player // 플레이어 객체 전달
                        });
                        break; 
                    case 'golem' : 
                        m = new MonsterGolem({ 
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
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHigth);
        this.matter.world.setBounds(0, 0, this.mapWidth, this.mapHigth);
        this.cameras.main.startFollow(this.player);

        // 상단 coins:{누적갯수} 텍스트 박스 표시
        this.coinIndicatorText = TextIndicator.createText(this, 10, 10, `Coins: ${this.player.status.coin}`, {
            fontFamily: 'Galmuri11, sans-serif',
            fontSize: '12px',
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

    removeMonsterFromArr(monster) {
        const index = this.monsterArr.indexOf(monster);
        if (index > -1) {
            this.monsterArr.splice(index, 1);
        }
        // 배열이 비었으면 전투 종료 메서드 실행
        if (this.monsterArr.length === 0) {
            this.time.delayedCall(1000, () => {
                this.stageManager.setStageEnd(this.stageNumber, this.mapNumber);
            }, [], this);
        }
    }

    // 동적으로 생성된 플레이어 공격에 충돌 이벤트 추가
    setCollisionOfPlayerAttack(attack) {
        this.matterCollision.addOnCollideStart({
            objectA: this.monsterArr, // 몬스터 배열
            objectB: attack, // 공격 객체
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                if (gameObjectB instanceof Arrow) {
                    console.log("몬스터가 화살에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.bowATK, gameObjectB);
                    if (result === 'death') {
                        this.iteamDrop(gameObjectA);
                        // 몬스터 배열에서 해당 몬스터 제거
                        this.removeMonsterFromArr(gameObjectA);
                    }
                    gameObjectB.destroy(); // 화살 제거

                } else if (gameObjectB instanceof Slash) {
                    console.log("몬스터가 칼날에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.swordATK, gameObjectB);
                    if (result === 'death') {
                        this.iteamDrop(gameObjectA);
                        // 몬스터 배열에서 해당 몬스터 제거
                        this.removeMonsterFromArr(gameObjectA);
                    }
                } else if (gameObjectB instanceof Magic) {
                    console.log("몬스터가 마법에 맞음");
                    const result = gameObjectA.takeDamage(this.player.status.magicATK, gameObjectB);
                    if (result === 'death') {
                        this.iteamDrop(gameObjectA);
                        // 몬스터 배열에서 해당 몬스터 제거
                        this.removeMonsterFromArr(gameObjectA);
                    }
                }
            }
        });
    }

    iteamDrop(monster) {
        if (this.mapNumber === 1) {
            //맵 1인 경우, 반드시 미트코인이 나온다
            this.itemType = Item.COIN_ITEM;
        
            // 몬스터의 위치에 객체 생성 
            this.item = new Item({
                scene: this,
                x: monster.x,
                y: monster.y,
                itemType: this.itemType
            });
        }else{
             // 아이템 종류 정하기 (토마토는 토마토시체 또는 코인 / 가지는 가지 시체 또는 코인)
            this.itemType = Item.createItemType(monster);

            // 몬스터의 위치에 객체 생성 
            this.item = new Item({
                scene: this,
                x: monster.x,
                y: monster.y,
                itemType: this.itemType
            });
        }


        // 플레이어와 아이템 충돌 이벤트 설정
        const unsubscribe = this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.item,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어와 아이템 충돌");
                // 아이템 효과 적용하기 및 화면에 반영하기
                gameObjectB.applyItem(gameObjectA, this.coinIndicatorText, this.heartIndicator);
                unsubscribe();
            }
        });
    }

    // 동적으로 생성된 몬스터 원거리 공격에 대한 충돌 이벤트 추가, 몸통박치기의 경우 이 메서드 사용하면 안됨
    setCollisionOfMonsterAttack(attack) {
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
                } else {
                    gameObjectB.destroy();
                    // 충돌 후 애니메이션 재생 하고 소멸
                    let egg_hit_anim = this.matter.add.sprite(x, y, 'eggplant_egg_hit');
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


    setCollisionOfMonsterShockwave(attack) {
        this.matterCollision.addOnCollideStart({
            objectA: this.player, // 플레이어
            objectB: attack, // 공격 객체 쇼크웨이브
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어가 몬스터 공격에 맞음");
                // 몬스터가 살아있을때만 넉백도 하고 데미지도 받음
                this.player.takeDamage(gameObjectB.damage);
                this.player.applyKnockback(gameObjectB);

                // // 충돌하면 총알 제거
                // gameObjectB.destroy();
                //
                // // 충돌 후 애니메이션 재생 하고 소멸
                // let egg_hit_anim = this.matter.add.sprite(x, y, 'eggplant_egg_hit');
                // egg_hit_anim.setBody({width: 1, height: 1})
                // egg_hit_anim.setSensor(true)
                // egg_hit_anim.play('eggplant_egg_hit');
                // this.time.delayedCall(600, () => {
                //     egg_hit_anim.destroy();
                // });
            }
        });
    }

    doMakeGoblin(){
        let m = new MonsterBossGoblin({
            scene: this,
            x: this.x,
            y: this.y,
            player: this.player // 플레이어 객체 전달
        });
        this.monsterArr.push(m);
    }
}