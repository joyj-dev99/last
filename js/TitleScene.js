import Dialog from "./Dialog.js";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'});

    }

    preload() {
        // 이미지, 오디오 등의 리소스를 미리 로드
        this.load.image('title_image_temp', 'assets/intro/title_image_temp.png');
    }

    create() {
        this.title_image_temp = this.add.image(0, 0, 'title_image_temp');
        this.title_image_temp.setX(454 / 2);
        this.title_image_temp.setY(256 - 256 / 2);
        this.title_image_temp.setDisplaySize(454,256);
        this.input.on('pointerdown', this.introScene, this);

    }

    introScene() {
        this.scene.start('IntroScene')
    }
}