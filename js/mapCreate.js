import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY,
    MONSTER_ATTACK_CATEGORY
} from "./constants.js";

import Player from "./Player.js";
import Chord from "./character/Chord.js";
import Milestone from "./objects/Milestone.js";
import Item from './Item.js';

import MonsterTomato from "./monsters/MonsterTomato.js";
import MonsterEggplant from "./monsters/MonsterEggplant.js";
import MonsterApple from "./monsters/MonsterApple.js";
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
import MonsterBossAlchemist from "./monsters/MonsterBossAlchemist.js";
import MonsterBossWolfgang from "./monsters/MonsterBossWolfgang.js";

export function mapCreatePreload(scene) {
    scene.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
    scene.load.image("dungeonTileset", "assets/map/Royal Dungeon Tileset.png");
    scene.load.image("officeTileset", "assets/map/Modern_Office_32x32.png");
    scene.load.image("roomBuilderTileset", "assets/map/Room_Builder_Office_32x32.png");
    scene.load.image("labTileset", "assets/map/Lab Tileset.png");

    scene.load.tilemapTiledJSON("stage_01_tutorial", "assets/map/stage_01/stage_01_tutorial.json");
    scene.load.tilemapTiledJSON("stage_01_01", "assets/map/stage_01/stage_01_01.json");
    scene.load.tilemapTiledJSON("stage_01_02", "assets/map/stage_01/stage_01_02.json");
    scene.load.tilemapTiledJSON("stage_01_03", "assets/map/stage_01/stage_01_03.json");
    scene.load.tilemapTiledJSON("stage_01_04", "assets/map/stage_01/stage_01_04.json");
    scene.load.tilemapTiledJSON("stage_01_05", "assets/map/stage_01/stage_01_05.json");
    scene.load.tilemapTiledJSON("stage_01_06", "assets/map/stage_01/stage_01_06.json");
    scene.load.tilemapTiledJSON("stage_01_07", "assets/map/stage_01/stage_01_07.json");
    scene.load.tilemapTiledJSON("stage_01_08", "assets/map/stage_01/stage_01_08.json");
    scene.load.tilemapTiledJSON("stage_01_09", "assets/map/stage_01/stage_01_09.json");
    scene.load.tilemapTiledJSON("stage_01_10", "assets/map/stage_01/stage_01_10.json");
    scene.load.tilemapTiledJSON("stage_01_boss", "assets/map/stage_01/stage_01_boss.json");

    scene.load.tilemapTiledJSON("stage_02_01", "assets/map/stage_02/stage_02_01.json");
    scene.load.tilemapTiledJSON("stage_02_02", "assets/map/stage_02/stage_02_02.json");
    scene.load.tilemapTiledJSON("stage_02_03", "assets/map/stage_02/stage_02_03.json");
    scene.load.tilemapTiledJSON("stage_02_04", "assets/map/stage_02/stage_02_04.json");
    scene.load.tilemapTiledJSON("stage_02_05", "assets/map/stage_02/stage_02_05.json");
    scene.load.tilemapTiledJSON("stage_02_06", "assets/map/stage_02/stage_02_06.json");
    scene.load.tilemapTiledJSON("stage_02_07", "assets/map/stage_02/stage_02_07.json");
    scene.load.tilemapTiledJSON("stage_02_08", "assets/map/stage_02/stage_02_08.json");
    scene.load.tilemapTiledJSON("stage_02_09", "assets/map/stage_02/stage_02_09.json");
    scene.load.tilemapTiledJSON("stage_02_10", "assets/map/stage_02/stage_02_10.json");
    scene.load.tilemapTiledJSON("stage_02_boss", "assets/map/stage_02/stage_02_boss.json");
}

export function setMapSize(scene, stageNumber, mapNumber) {
    if (stageNumber === 1 && mapNumber <= 9) { // 일반맵
        scene.mapWidth = 960;
        scene.mapHigth = 320;
        scene.minX = 10;
        scene.maxX = 950;
        scene.minY = 96;
        scene.maxY = 240;
    } else if (stageNumber === 1 && mapNumber === 10) { // 보너스맵
        scene.mapWidth = 480;
        scene.mapHigth = 320;
        scene.minX = 74;
        scene.maxX = 406;
        scene.minY = 74;
        scene.maxY = 278;
    } else if (stageNumber === 1 && mapNumber == 11) { // 보스맵
        scene.mapWidth = 480;
        scene.mapHigth = 480;
        scene.minX = 74;
        scene.maxX = 406;
        scene.minY = 106;
        scene.maxY = 438;
    } else if (stageNumber === 2 && mapNumber <= 9) { // 일반맵
        scene.mapWidth = 960;
        scene.mapHigth = 320;
        scene.minX = 10;
        scene.maxX = 950;
        scene.minY = 96;
        scene.maxY = 240;
    } else if (stageNumber === 2 && mapNumber === 10) { // 보너스맵
        scene.mapWidth = 480;
        scene.mapHigth = 320;
        scene.minX = 74;
        scene.maxX = 406;
        scene.minY = 74;
        scene.maxY = 278;
    } else if (stageNumber === 2 && mapNumber == 11) { // 보스맵
        scene.mapWidth = 480;
        scene.mapHigth = 480;
        scene.minX = 74;
        scene.maxX = 406;
        scene.minY = 106;
        scene.maxY = 438;
    } else if (stageNumber === 3 && mapNumber <= 9) { // 일반맵
        scene.mapWidth = 960;
        scene.mapHigth = 320;
        scene.minX = 10;
        scene.maxX = 950;
        scene.minY = 96;
        scene.maxY = 240;
    } else if (stageNumber === 3 && mapNumber === 10) { // 보너스맵
        scene.mapWidth = 480;
        scene.mapHigth = 320;
        scene.minX = 74;
        scene.maxX = 406;
        scene.minY = 74;
        scene.maxY = 278;
    } else if (stageNumber === 3 && mapNumber == 11) { // 보스맵
        scene.mapWidth = 480;
        scene.mapHigth = 480;
        scene.minX = 74;
        scene.maxX = 406;
        scene.minY = 106;
        scene.maxY = 438;
    }
}

export function setupMap(scene, stageNumber, mapNumber) {
    console.log('setupMap : ', stageNumber, mapNumber);
    let mapKey;
    if (mapNumber === 0) {
        mapKey = `stage_01_tutorial`;
    } else if (mapNumber > 9) {
        mapKey = `stage_0${stageNumber}_${mapNumber}`;
    } else {
        mapKey = `stage_0${stageNumber}_0${mapNumber}`;
    }

    console.log(`Loading map with key: ${mapKey}`);

    // 맵이 정상적으로 로드되었는지 확인
    if (!scene.cache.tilemap.has(mapKey)) {
        console.error(`Tilemap with key ${mapKey} does not exist.`);
        return;
    }

    const map = scene.make.tilemap({ key: mapKey });

    if (stageNumber === 1) {
        const forestTileset = map.addTilesetImage("Forest-Prairie Tileset v1", "forestTileset");

        const floor = map.createLayer("floor", forestTileset, 0, 0);
        map.createLayer("cliff", forestTileset, 0, 0);
        map.createLayer("decor1", forestTileset, 0, 0);
        map.createLayer("decor2", forestTileset, 0, 0);

        // 충돌이 필요한 타일 설정
        floor.setCollisionByProperty({collides: true});
        // 타일맵 레이어를 물리적으로 변환
        scene.matter.world.convertTilemapLayer(floor);
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
        scene.matter.world.convertTilemapLayer(floor);
        scene.matter.world.convertTilemapLayer(wall);
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

    } else if (stageNumber === 3 && mapNumber <= 10) {
        const Tileset = map.addTilesetImage("Modern_Office_32x32", "officeTileset");
        const Tileset2 = map.addTilesetImage("Room_Builder_Office_32x32", "roomBuilderTileset");

        const floor = map.createLayer("floor", Tileset2, 0, 0);
        const wall = map.createLayer("wall", Tileset2, 0, 0);
        map.createLayer("decor1", Tileset2, 0, 0);
        map.createLayer("decor2", Tileset, 0, 0);

        // 충돌이 필요한 타일 설정
        floor.setCollisionByProperty({collides: true});
        wall.setCollisionByProperty({collides: true});
        // 타일맵 레이어를 물리적으로 변환
        scene.matter.world.convertTilemapLayer(floor);
        scene.matter.world.convertTilemapLayer(wall);
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

    } else if (stageNumber === 3 && mapNumber === 11) {

        const Tileset = map.addTilesetImage("Lab Tileset", "labTileset");

        map.createLayer("floor", Tileset, 0, 0);
        const wall = map.createLayer("wall", Tileset, 0, 0);
        const decor1 = map.createLayer("decor1", Tileset, 0, 0);

        // 충돌이 필요한 타일 설정
        wall.setCollisionByProperty({collides: true});
        decor1.setCollisionByProperty({collides: true});
        // 타일맵 레이어를 물리적으로 변환
        scene.matter.world.convertTilemapLayer(wall);
        scene.matter.world.convertTilemapLayer(decor1);
        // 충돌 카테고리 설정
        wall.forEachTile(tile => {
            if (tile.physics.matterBody) {
                tile.physics.matterBody.body.collisionFilter.category = TILE_CATEGORY;
                tile.physics.matterBody.body.collisionFilter.mask = PLAYER_CATEGORY | MONSTER_CATEGORY;
            }
        });
        decor1.forEachTile(tile => {
            if (tile.physics.matterBody) {
                tile.physics.matterBody.body.collisionFilter.category = OBJECT_CATEGORY;
                tile.physics.matterBody.body.collisionFilter.mask = PLAYER_CATEGORY | MONSTER_CATEGORY | PLAYER_ATTACK_CATEGORY | MONSTER_ATTACK_CATEGORY;
            }
        });

    }

    //오브젝트 레이어 관련 코드
    const objectLayer = map.getObjectLayer('object');
    console.log('map : ' + map);
    console.dir(map);
    console.log('objectLayer : ' + objectLayer);

    // 먼저 playerStart 오브젝트를 처리
    // 그래야 선물맵의 아이템과 충돌 이벤트가 실행될 수 있음
    objectLayer.objects.forEach(object => {
        const {x, y, name, type} = object;

        if (name === 'playerStart') {
            scene.player = new Player({
                scene: scene,
                x: x,
                y: y
            });
            scene.player.setDepth(100);
            if (scene.playerStatus != null) {
                scene.player.status = scene.playerStatus;
            }
            // console.log("scene.player 생성됨:", scene.player);
        }
    });

    objectLayer.objects.forEach(object => {
        // 각 오브젝트의 속성에 접근
        const {x, y, name, type} = object;
        console.log(`Object: ${name}, Type: ${type}, X: ${x}, Y: ${y}`);

        // 코드 생성 위치 설정
        if (type === 'chord') {
            if (name === 'chordStart') {
                scene.chord = new Chord({
                    scene: scene,
                    x: x,
                    y: y
                });
            } else if (name === 'chordBattle') {
                scene.chordBattle = {x: x, y: y};
                console.log(`chordBattle = {x: ${scene.chordBattle.x}, y: ${scene.chordBattle.y}`);

            } else if (name === 'chordEnd') {
                scene.chordEnd = {x: x, y: y};
                console.log(`chordEnd = {x: ${scene.chordEnd.x}, y: ${scene.chordEnd.y}`);
            }
        }

        // 표지판
        if (name === 'milestone') {
            scene.milestone = new Milestone({
                scene: scene,
                x: x,
                y: y
            });
        }

        //선물 맵의 아이템 위치
        if(name === 'item'){

            // 아이템 리스트 정의
            const items = [
                Item.MaxHeart_ITEM,
                Item.PhantomCloak_ITEM,
                Item.SwiftBoots_ITEM,
                Item.UnknownAmulet_ITEM,
                Item.QuantumHourglass_ITEM,
                Item.HerbalMedicine_ITEM,
                Item.PiratesSafe_ITEM,
                Item.AncientPotion_ITEM,
                Item.HeavyGloves_ITEM,
                Item.arrow_10_ITEM
            ];
            // 랜덤으로 하나의 아이템 선택
            const randomItem = items[Math.floor(Math.random() * items.length)];

            // 선택된 아이템을 itemType으로 설정
            scene.item = new Item({
                scene: scene,
                x: x,
                y: y,
                itemType: randomItem
            });
            // console.log("scene.player" + scene.player); 
            // console.log("scene.item"+ scene.item);

            // 충돌 이벤트 설정
            const unsubscribe = scene.matterCollision.addOnCollideStart({
                objectA: scene.player,
                objectB: scene.item,   
                callback: eventData => { 
                    const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                    scene.getItemSound.play();
                    console.log("플레이어와 아이템 충돌");
                    // 아이템 효과 적용하기 및 화면에 반영하기
                    gameObjectB.applyItem(gameObjectA, scene.heartIndicator, scene.dialog);
                    unsubscribe();
                }
            });

    }});

    // 몬스터 생성 - 플레이어가 생성된 이후에 생성되어야 함.
    objectLayer.objects.forEach(object => {
        const {x, y, name, type} = object;
        if (type === 'monster') {
            let m;
            //몬스터 종류에 따라 다르게 생성 -> 추후 구현
            switch (name) {
                case 'tomato':
                    m = new MonsterTomato({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'eggplant':
                    m = new MonsterEggplant({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'apple':
                    m = new MonsterApple({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'lemon' :
                    m = new MonsterLemon({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'pumpkin' :
                    m = new MonsterBossPumpkin({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'fly' :
                    m = new MonsterFly({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'spider' :
                    m = new MonsterSpider({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'mini goblin' :
                    m = new MonsterMiniGoblin({//MonsterMiniGoblin
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'ratfolk' :
                    m = new MonsterRatfolk({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'goblin' :
                    m = new MonsterBossGoblin({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'necromancer':
                    m = new MonsterBossNecromancer({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    scene.necromancer = m;
                    break;
                case 'bugbear' :
                    m = new MonsterBugbear({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'angle' :
                    m = new MonsterAngel({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'golem' :
                    m = new MonsterGolem({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'alchemist' :
                    m = new MonsterBossAlchemist({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;
                case 'Wolfgang' :
                    m = new MonsterBossWolfgang({
                        scene: scene,
                        x: x,
                        y: y,
                        player: scene.player // 플레이어 객체 전달
                    });
                    break;

                default:
                // console.log("몬스터 생성 : " + name);
            }
            scene.monsterArr.push(m);
        }
    });
}