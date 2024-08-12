export default class ProgressIndicator extends Phaser.GameObjects.Sprite {

    static preload(scene) {
        scene.load.spritesheet('progressSheet', 'assets/ui/spr_ui_progress_alt_strip5.png', {
            frameWidth: 230,
            frameHeight: 180
        });
    }

    constructor(scene, texture, stageNum, subStageNum) {
        // X, Y 위치를 화면의 상단 중앙으로 설정
        const x = scene.sys.game.config.width / 2;
        const y = 30; 
        
        super(scene, x, y, texture);
        scene.add.existing(this);

        // 초기 프레임 설정
        this.setFrame(0);

        // 스크롤에 영향을 받지 않도록 설정
        this.setScrollFactor(0);

        // 'Stage 1' 텍스트 추가
        this.stageText = scene.add.text(x, y - 12, `Stage ${stageNum}`, {
            fontFamily: 'Galmuri11, sans-serif',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.7);  // 텍스트를 중앙 정렬

        this.stageText.setScrollFactor(0);
        this.stageText.setDepth(1001);

        this.setScale(0.5);

        this.setProgress(subStageNum);
        
    }

    setProgress(frameIndex) {
        this.setFrame(frameIndex);
    }

}