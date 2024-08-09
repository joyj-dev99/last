import Player from "./Player.js";
import Bonfire from "./objects/bonfire.js";
import Chord from "./character/Chord.js";

export default class NightScene extends Phaser.Scene {
    constructor() {
        super("NightScene");
    }

    // 씬이 시작되기 전에 호출되는 메서드로 안전하게 데이터를 초기화할 수 있음.
    // data : 이전 씬에서 'this.scene.start('MainScene', data)와 같은 방식으로 전달된 데이터
    init(data) {
        this.stageNumber = data.stageNumber || 1;
        this.isDay = false; // 낮 상태를 추적하는 변수

    }

    preload() {
        this.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
        this.load.tilemapTiledJSON("stage_01_night_map", "assets/map/stage_01_night.json");

        // 배경음악 로드
        this.load.audio("nightMusic", "assets/audio/night_theme_1.wav");

        Player.preload(this);
        Bonfire.preload(this);
        Chord.preload(this);
    }

    create() {
        // 씬이 시작될때 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.matter.world.setBounds();
        this.map = this.make.tilemap({key: "stage_01_night_map"});
        const forestTileset = this.map.addTilesetImage("Forest-Prairie Tileset v1", "forestTileset");
        
        this.floorLayer = this.map.createLayer("floor", forestTileset, 0, 0);
        this.cliffLayer = this.map.createLayer("cliff", forestTileset, 0, 0);
        this.decor1Layer = this.map.createLayer("decor1", forestTileset, 0, 0);
        this.decor2Layer = this.map.createLayer("decor2", forestTileset, 0, 0);

        this.lights.enable().setAmbientColor(0x7c6dc7); // 어두운 조명 (밤)
        
        this.floorLayer.setPipeline('Light2D');
        this.cliffLayer.setPipeline('Light2D');
        this.decor1Layer.setPipeline('Light2D');
        this.decor2Layer.setPipeline('Light2D');


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
                /* name 으로 다음과 같이 구분
                chordStart : 해당 맵에 처음 들어갔을 때 코드의 위치, 플레이어 스타트 위치 바로 옆
                chordBattle : 전투 중 코드의 위치, 맵 중간, 이동불가 지역 -> 충돌체 설정시 오류 날 가능성 있으니 잘 확인할 것
                chordEnd : 전투 끝나고 코드 위치, 표지판 옆   
                */
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
                    y: y,
                    texture: 'bonfire',
                    frame: 'bonfire_01'
                });
            }

            // 플레이어 시작 위치 설정
            if (name === 'playerStart') {
                this.player = new Player({
                    scene: this,
                    x: x,
                    y: y,
                    texture: 'player',
                    frame: 'player_idle_01'
                });
        
            }
        });

         // Play background music
        this.backgroundMusic = this.sound.add('nightMusic', {
            volume: 0.3, // Set the volume (0 to 1)
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
    }

    update() {
        this.player.update();
    }
}
