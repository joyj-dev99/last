import Player from "./Player.js";
import Chord from "./character/Chord.js";
import Dialog from "./Dialog.js";
import MonsterTomato from "./monsters/MonsterTomato.js";
import Monster from "./monsters/Monster.js";

import {
    PLAYER_CATEGORY,
    MONSTER_CATEGORY,
    TILE_CATEGORY,
    OBJECT_CATEGORY,
    PLAYER_ATTACK_CATEGORY,
    MONSTER_ATTACK_CATEGORY
} from "./constants.js";

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
        this.isInDialogue = false;
    }

    preload() {
        this.load.video('letter_video', 'assets/intro/letter.mp4');
        this.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
        this.load.tilemapTiledJSON("stage_01_tutorial", "assets/map/stage_01/stage_01_tutorial.json");
        
        Player.preload(this);
        Chord.preload(this);
        Dialog.preload(this);
        Monster.preload(this);
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
            const skipButton = this.add.text(this.cameras.main.width - 20, this.cameras.main.height - 20, '>>Skip', {
                fontSize: '16px',
                fill: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }).setOrigin(1, 1) // 오른쪽 위에 배치
            .setInteractive()
            .on('pointerdown', () => this.skipIntro())
            .on('pointerover', () => this.onHover(skipButton))
            .on('pointerout', () => this.onOut(skipButton));

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
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainScene');  // 다음 씬으로 이동 (NextScene을 원하는 씬 키로 교체)
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
    }

    update(time, delta) {
        if (this.beforeTutorial || this.isInDialogue || !this.player.isAlive) return;
        this.player.update(time, delta);
        this.monster.update();
    }


}