import Player from "./Player.js";
import Bonfire from "./objects/Bonfire.js";
import Chord from "./character/Chord.js";

const { type } = window.gameConfig;


export default class NightScene extends Phaser.Scene {
    constructor() {
        super("NightScene");
    }

    // 씬이 시작되기 전에 호출되는 메서드로 안전하게 데이터를 초기화할 수 있음.
    // data : 이전 씬에서 'this.scene.start('MainScene', data)와 같은 방식으로 전달된 데이터
    init(data) {
        this.stageNumber = data.stageNumber || 1;
        this.mapNumber = data.mapNumber || 5;
        this.playerStatus = data.playerStatus || null;

        // 현재 대화창이 떠있는지 여부를 나타내는 상태변수
        this.isInDialogue = false;

        this.mapWidth = 480;
        this.mapHigth = 320;
        this.minX = 74;
        this.maxX = 406;
        this.minY = 74;
        this.maxY = 278;
    }

    create() {
        // 씬이 시작될때 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.matter.world.setBounds();
        this.map = this.make.tilemap({key: `stage_0${this.stageNumber}_night_map`});//
        const forestTileset = this.map.addTilesetImage("Forest-Prairie Tileset v1", "forestTileset");
        const labTileset = this.map.addTilesetImage("Lab Tileset", "labTileset");
        
        this.floorLayer = this.map.createLayer("floor", forestTileset, 0, 0);
        if (this.stageNumber === 1) {
            this.cliffLayer = this.map.createLayer("cliff", forestTileset, 0, 0);
            this.decor1Layer = this.map.createLayer("decor1", forestTileset, 0, 0);
        } else if (this.stageNumber === 2) {
            this.wallLayer = this.map.createLayer("wall", labTileset, 0, 0);
            this.decor1Layer = this.map.createLayer("decor1", labTileset, 0, 0);
        }

        this.decor2Layer = this.map.createLayer("decor2", forestTileset, 0, 0);

        // 조명설정
        this.lights.enable().setAmbientColor(0x7c6dc7); // 어두운 조명 (밤)
    
        this.floorLayer.setPipeline('Light2D');
        if (this.stageNumber === 1) {
            this.cliffLayer.setPipeline('Light2D');
        } else if (this.stageNumber === 2) {
            this.wallLayer.setPipeline('Light2D');
        }
        this.decor1Layer.setPipeline('Light2D');
        this.decor2Layer.setPipeline('Light2D');

        // 충돌설정
        this.floorLayer.setCollisionByProperty({collides: true});
        this.matter.world.convertTilemapLayer(this.floorLayer);
        if (this.wallLayer) {
            this.wallLayer.setCollisionByProperty({collides: true});
            this.matter.world.convertTilemapLayer(this.wallLayer);
        }

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

            // 모닥불
            if (name === 'bonfire') {
                this.bonfire = new Bonfire({
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
                    y: y,
                    hiddenFlag: true
                });
            }
        });

        // Play background music
        this.backgroundMusic = this.sound.add('night_default', {
            volume: window.gameConfig.bgVolume, // Set the volume (0 to 1)
            loop: true // Enable looping if desired
        });


        //페이드인 완료 후 게임 실행
        this.cameras.main.once('camerafadeincomplete', (camera) => {
            this.chord.startPlayLute();
            this.backgroundMusic.play();
            
        });

        // 플레이어 움직임에 따라 카메라 이동
        this.cameras.main.setBounds(0, 0, 480, 320);
        this.matter.world.setBounds(0, 0, 480, 320);
        this.cameras.main.startFollow(this.player);

        // 다음 맵으로 이동하는 이벤트 핸들러
        const goToNextHandler = (event) => {
            console.log('Moving to the next map...');
            const stageNumber = this.stageNumber + 1;
            const mapNumber = 1;
            const playerStatus = this.playerStatus;

            this.scene.start('MainScene', {stageNumber, mapNumber, playerStatus});
            this.backgroundMusic.stop();
        }

        // 플레이어와 모닥불 충돌 이벤트 설정
        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.bonfire,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어와 모닥불 충돌");
                // 상호작용 가능 키 표시
                gameObjectB.showInteractPrompt();
                // 키보드 입력 이벤트 설정
                this.input.keyboard.on('keydown-E', goToNextHandler);

                // this.input.on('pointerdown',() => {
                //     // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                //     const shiftKeyUpEvent = new KeyboardEvent('keydown', {
                //      key: 'E',
                //      code: 'E',
                //      keyCode: Phaser.Input.Keyboard.KeyCodes.E,
                //      bubbles: true,
                //      cancelable: true
                //  });
     
                //  window.dispatchEvent(shiftKeyUpEvent);
             
            //  }, this);
     
            }
        });

        this.matterCollision.addOnCollideEnd({
            objectA: this.player,
            objectB: this.bonfire,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                console.log("플레이어와 모닥불 떨어짐");
                // 상호작용 가능 키 숨기기
                gameObjectB.hideInteractPrompt();
                // 키보드 입력 이벤트 해제
                this.input.keyboard.off('keydown-E', goToNextHandler);

            //     this.input.off('pointerdown',() => {
            //         // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
            //         const shiftKeyUpEvent = new KeyboardEvent('keyup', {
            //         key: 'E',
            //         code: 'E',
            //         keyCode: Phaser.Input.Keyboard.KeyCodes.E,
            //         bubbles: true,
            //         cancelable: true
            //      });
     
            //      window.dispatchEvent(shiftKeyUpEvent);
             
            //  }, this);

            }
        });

        if(type === 'mobile'){
            // 가상 조이스틱 생성
            // 조이스틱 조작 시 player 에서 update를 실행할 때 신호를 준다.
            // or player 함수를 사용한다
            this.joystick = this.plugins.get('rexVirtualJoystick').add(this, {
                x: 80,
                y: 200,
                radius: 28,
                base: this.add.circle(0, 0, 30, 0x888888),
                thumb: this.add.circle(0, 0, 15, 0xcccccc),
                dir: '8dir', 
                forceMin: 1,
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
