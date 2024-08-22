import Player from "./Player.js";
import Chord from "./character/Chord.js";
import Dialog from "./Dialog.js";

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({key: 'IntroScene'});
    }

    preload() {
        this.load.video('letter_video', 'assets/intro/letter.mp4');

        Player.preload(this);
        Chord.preload(this);
    }

    create() {
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
                this.showPlayer();
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

    showPlayer() {
        // 동영상이 끝나면 플레이어 로드 및 화면에 표시
        this.letterVideo.destroy(); // 동영상 객체 제거

        this.player = new Player({
            scene: this,
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2
        });
    }
}