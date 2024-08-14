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

        // 현재 대화창이 떠있는지 여부를 나타내는 상태변수
        this.isInDialogue = false;

        if (this.mapNumber < 3) { // 일반맵
            this.mapWidth = 960;
            this.mapHigth = 320;
            this.minX = 10;
            this.maxX = 950;
            this.minY = 96;
            this.maxY = 240;
        } else if (this.mapNumber == 4) { // 보스맵
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

        // 배경음악 로드
        this.load.audio("bgm_stage_1", "assets/audio/field_theme_1.wav");

        Player.preload(this);
        Monster.preload(this);
        MonsterBossPumpkin.preload(this);
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
        this.backgroundMusic = this.sound.add(`bgm_stage_${this.stageNumber}`, {
            volume: 0.3, // Set the volume (0 to 1)
            loop: true // Enable looping if desired
        });

        // 스테이지 진행률 UI
        this.progressIndicator = new ProgressIndicator(this, 'progressSheet', this.stageNumber, this.mapNumber - 1);
        // 하트(체력) UI
        this.heartIndicator = new HeartIndicator(this, 'heartSheet', this.player.status.nowHeart);

        //페이드인 완료 후 게임 실행
        this.cameras.main.once('camerafadeincomplete', (camera) => {
            this.chord.startPlayLute();
            this.backgroundMusic.play();
        });


        // 맵(1) 튜토리얼 끝난 후, 코드 자리 이동 및 플레이어 말풍선
        if (this.mapNumber === 1) {

            // 특정 지점에 센서 생성
            this.startSensor = this.matter.add.rectangle(600, this.player.y - 160, 10, 500, {
                isSensor: true, // 센서로 설정
                isStatic: true,
                collisionFilter: {
                    category: SENSOR_CATEGORY,
                    mask: PLAYER_CATEGORY // 플레이어만 충돌하도록 설정
                }
            });
        
            // 충돌 감지 설정
            this.matterCollision.addOnCollideStart({
                objectA: this.player,
                objectB: this.startSensor,
                callback: eventData => {
                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    this.isInDialogue = true;
                    this.player.stop();
                    this.matter.world.remove(this.startSensor); // 센서 삭제
                    // 대화
                    // 플레이어 말풍선을 표시하고, 클릭 후 코드 말풍선을 표시하도록 콜백 설정
                    this.player.showSpeechBubble('토마토? 아니 몬스터인가.', ()=>{
                        this.player.showSpeechBubble('저런 건 처음보는데…', () => {
                            this.chord.showSpeechBubble('얼마전부터 이 근방에 농작물처럼 생긴 몬스터가 나타나기 시작했다고 들었어요.', ()=>{
                                this.player.showSpeechBubble('한시가 급한데, 이상한 몬스터까지 나타나다니. 미치겠군.', ()=>{
                                    this.chord.showSpeechBubble('어쩌죠? 볼프강 박사가 있는 곳으로 가려면 이 길을 꼭 지나야 해요.', ()=>{
                                        this.player.showSpeechBubble('흥. 이정돈 별거 아니라고!', () => {
                                            this.isInDialogue = false;
                                            // 코드의 위치 이동시키기
                                            this.chord.setLocation(this.chordBattle.x, this.chordBattle.y);
                                            this.monsterArr.forEach((monster) => {
                                                monster.startBattle();
                                            });
                                        });
                                    });
                                });
                            });
                        })
                    });
                }
            });
        }

        // 맵(2) 시작 대화
        if(this.mapNumber === 2){
            // 특정 지점에 센서 생성
            this.startSensor = this.matter.add.rectangle(this.player.x +50, this.player.y - 160, 10, 500, {
                isSensor: true, // 센서로 설정
                isStatic: true,  // 센서는 물리 반응이 필요 없음
                collisionFilter: {
                    category: OBJECT_CATEGORY,
                    mask: PLAYER_CATEGORY // 플레이어만 충돌하도록 설정
                }
            });

            // 충돌 감지 설정
            this.matterCollision.addOnCollideStart({
                objectA: this.player,
                objectB: this.startSensor,
                callback: eventData => {
                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    this.isInDialogue = true;
                    this.player.stop();
                    this.matter.world.remove(this.startSensor); // 센서 삭제
                    // 대화
                    this.chord.showSpeechBubble('이제 본격적으로 출발해봅시다.\n 맥스님, 파이팅!', ()=>{
                        this.player.showSpeechBubble('이번엔 토마토랑 가지냐?', () => {
                            // 코드의 위치 이동시키기
                            this.chord.setLocation(this.chordBattle.x, this.chordBattle.y);
                            this.isInDialogue = false;
                            this.monsterArr.forEach((monster) => {
                                monster.startBattle();
                            });
                        });
                    });
                }
            });
        }


        // 플레이어와 몬스터 충돌 이벤트 설정
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.monsterArr,
            callback: eventData => {
                // 플레이어가 A, 충돌이 발생한 몬스터가 B
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어와 몬스터 충돌");
                // console.dir(gameObjectB);

                // 슬래쉬 초기화
                this.player.resetSlash();
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
            this.onBattleEnd(this.stageNumber, this.mapNumber);
        }
    }

    // 전투 종료시 실행될 메서드
    onBattleEnd(stageNumber, mapNumber) {
        this.isInDialogue = true;
        this.player.stop();
        this.chord.setLocation(this.chordEnd.x, this.chordEnd.y);
        if (stageNumber === 1 && mapNumber === 1) {
            this.player.showSpeechBubble('뭐야? \n 미트코인이잖아?', () => {
                this.player.showSpeechBubble('몬스터가 왜 미트코인을 가지고 있는거지?', () => {
                    this.chord.showSpeechBubble('역시 맥스님! A등급 용병은 다르군요!', () => {
                        this.player.showSpeechBubble('그나저나 너는 지금 내가 몬스터 잡는 동안', () => {
                            this.player.showSpeechBubble('고작 악기 연주나 하고 있어?', () => {
                                this.chord.showSpeechBubble('아무래도 응원가가 \n 있으면 좋으니까요!', () => {
                                    this.isInDialogue = false;
                                });
                            });
                        });
                    });
                });
            });
        } else if (stageNumber === 1 && mapNumber === 2) {

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

        } else if(this.mapNumber === 2){
            // 아이템 종류 정하기 (토마토는 토마토시체 또는 코인 / 가지는 가지 시체 또는 코인)
            this.itemType = Item.createItemType(monster);

            // 몬스터의 위치에 객체 생성 
            this.item = new Item({
                scene: this,
                x: monster.x,
                y: monster.y,
                itemType: this.itemType
            });

            // 몬스터 아이템이 나왔고, 또한 최초인지 확인
            if(this.itemType === Item.TOMATO_ITEM && !this.firstMonsterItemLogged){
                    console.log('TOMATO_ITEM이 나왔다');

                    // 맵(2) 끝 대화
                    setTimeout(() => {
                        this.chord.showSpeechBubble(' 맥스님, 이 토마토 좀 맛있어 보이네요? ', () => {

                            this.player.showSpeechBubble('윽, 이거 먹어도 되는거 맞지?');
                        });
                    }, 1000); // 1초 (1000 밀리초) 후에 실행

                    this.firstMonsterItemLogged = true; // Set the flag to true
                }
            else if(this.itemType === Item.Eggplant_ITEM && !this.firstMonsterItemLogged){
                    console.log('Eggplant_ITEM이 나왔다');

                     // 맵(2) 끝 대화
                    setTimeout(() => {
                        this.chord.showSpeechBubble(' 맥스님, 이 가지 좀 맛있어 보이네요? ', () => {

                            this.player.showSpeechBubble('윽, 이거 먹어도 되는거 맞지?');
                        });
                    }, 1000); // 1초 (1000 밀리초) 후에 실행

                    this.firstMonsterItemLogged = true; // Set the flag to true
                }

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

                // 충돌하면 총알 제거
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
        });
    }


    setCollisionOfMonsterPumpkinShockwave(attack) {
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


    removeSensor(sensor) {
        // 센서를 물리 세계에서 제거
        this.matter.world.remove(sensor);
    }
}
