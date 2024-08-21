import Player from "./Player.js";
import Chord from "./character/Chord.js";
import Thelma from "./character/Thelma.js";
import Milestone from "./objects/Milestone.js";
import StoreItem from "./StoreItem.js";
import Dialog from "./Dialog.js";

const { type } = window.gameConfig;

export default class StoreScene extends Phaser.Scene {
    constructor() {
        super("StoreScene");
    }

    // 씬이 시작되기 전에 호출되는 메서드로 안전하게 데이터를 초기화할 수 있음.
    // data : 이전 씬에서 'this.scene.start('MainScene', data)와 같은 방식으로 전달된 데이터
    init(data) {
        this.stageNumber = data.stageNumber || 1;
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
        this.load.tilemapTiledJSON("stage_01_store_map", "assets/map/stage_01/stage_01_store.json");

        Player.preload(this);
        Chord.preload(this);
        Thelma.preload(this);
        Milestone.preload(this);
        StoreItem.preload(this);
        Dialog.preload(this);
    }

    create() {
        // 씬이 시작될때 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.matter.world.setBounds();
        this.map = this.make.tilemap({key: `stage_0${this.stageNumber}_store_map`});
        const forestTileset = this.map.addTilesetImage("Forest-Prairie Tileset v1", "forestTileset");
        
        this.floorLayer = this.map.createLayer("floor", forestTileset, 0, 0);
        this.cliffLayer = this.map.createLayer("cliff", forestTileset, 0, 0);
        this.decor1Layer = this.map.createLayer("decor1", forestTileset, 0, 0);
        this.decor2Layer = this.map.createLayer("decor2", forestTileset, 0, 0);

        // 충돌설정
        this.floorLayer.setCollisionByProperty({collides: true});
        this.matter.world.convertTilemapLayer(this.floorLayer);

        //오브젝트 레이어 관련 코드
        const objectLayer = this.map.getObjectLayer('object');
        objectLayer.objects.forEach(object => {
            // 각 오브젝트의 속성에 접근
            const { x, y, width, height, name, type, properties } = object;
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

            if (name === 'item') {
                const itemKey = Math.floor(Math.random() * 10) + 1;
                let item = new StoreItem({
                    scene: this,
                    x: x,
                    y: y,
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
            }
        });

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.itemArr,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                gameObjectB.showItemInfo();
            }
        });

        this.matterCollision.addOnCollideEnd({
            objectA: this.player,
            objectB: this.itemArr,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                gameObjectB.hideItemInfo();
            }
        });

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
        }

    }

    update() {
        this.player.update();
    }

    updateJoystickState(){

        var cursorKeys = this.joystick.createCursorKeys();
        let playerKeys = this.player.cursors;
        
        playerKeys.right.isDown = cursorKeys.right.isDown;
        playerKeys.left.isDown = cursorKeys.left.isDown;
        playerKeys.up.isDown = cursorKeys.up.isDown;
        playerKeys.down.isDown = cursorKeys.down.isDown;

    }

}
