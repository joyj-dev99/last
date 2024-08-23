import Player from "./Player.js";
import Chord from "./character/Chord.js";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'});

    }

    preload() {
        this.load.image('title_background', 'assets/title/title_background.png');
        this.load.image('title_start_button', 'assets/title/title_start_button.png');
        this.load.image('title_banner', 'assets/title/title_banner.png');
        this.load.audio('title_bgm', 'assets/suno/title_song_of_hero.wav');

        Player.preload(this);
        Chord.preload(this);
    }

    create() {
        // 페이드인 효과 적용
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const mapWidth = 454;
        const mapHieght = 256;

        this.bgm = this.sound.add('title_bgm', {
            volume: 0.4,
            loop: true
        });

        const background = this.add.image(0, 0, 'title_background');
        // 이미지의 크기를 화면 크기에 맞게 조정
        background.setDisplaySize(mapWidth, mapHieght);
        // 이미지를 씬의 중앙에 위치시키기 위해 origin을 설정
        background.setOrigin(0, 0);

        const banner = this.add.image(mapWidth / 2, 5, 'title_banner')
            .setOrigin(0.5, 0);

        this.tweens.add({
            targets: banner,
            y: '+=10',  // y 위치를 5 픽셀 위아래로 움직임
            yoyo: true,  // 다시 원래 위치로 돌아옴
            repeat: -1,  // 무한 반복
            ease: 'Sine.easeInOut',  // Sine 함수를 사용하여 부드럽게 움직임
            duration: 2000,  // 2초에 한 번씩 움직임
        });

        this.player = new Player({
            scene: this,
            x: 180,
            y: 210,
            hiddenFlag: true
        });
        this.player.anims.msPerFrame = 300;  // 10 FPS로 변경 (1000ms / 100ms = 10fps)

        // 3초마다 'player_look_around' 애니메이션 실행
        this.time.addEvent({
            delay: 5000,  // 5초
            loop: true,
            callback: () => {
                this.playLookAroundAnimation();
            },
            callbackScope: this
        });

        this.chord = new Chord({
            scene: this,
            x: 135,
            y: 200
        });

        // 페이드인 완료 후 실행
        this.cameras.main.once('camerafadeincomplete', () => {
            // 캐릭터 애니메이션 실행
            this.chord.startPlayLute();
        });


        this.chord.once('animationcomplete-chord_ready', () => {
            if (!this.bgm.isPlaying) {
                this.bgm.play();
            }
        }, this);

        const startButton = this.add.image(mapWidth - 20, mapHieght - 20, 'title_start_button')
            .setOrigin(1, 1)
            .setInteractive();
        
        // 마우스가 버튼 위로 올라갔을 때
        startButton.on('pointerover', () => {
            startButton.setScale(1.1);  // 크기 약간 증가
        });

        // 마우스가 버튼에서 내려갔을 때
        startButton.on('pointerout', () => {
            startButton.setScale(1);  // 원래 크기로 되돌리기
        });

        // 버튼 클릭 이벤트 설정
        startButton.on('pointerdown', () => {
            // Start 버튼 클릭 시 페이드아웃 효과 및 BGM 페이드아웃
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            this.fadeOutBGM();

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('IntroScene');  // 인트로 씬으로 이동
            });
        });

    }

    playLookAroundAnimation() {
        // 'player_look_around' 애니메이션 실행
        this.player.play('player_look_around');
    
        // 'player_look_around' 애니메이션이 끝나면 'player_idle' 애니메이션으로 복귀
        this.player.once('animationcomplete', () => {
            this.player.play('player_idle');
            this.player.anims.msPerFrame = 300;  // 10 FPS로 변경 (1000ms / 100ms = 10fps)
        }, this);
    }

    fadeOutBGM() {
        if (this.bgm) {
            // 1초 동안 볼륨을 서서히 줄임 (1000ms)
            this.tweens.add({
                targets: this.bgm,
                volume: 0,
                duration: 2000,
                onComplete: () => {
                    this.bgm.stop();
                }
            });
        }
    }
}