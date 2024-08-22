export default class ProgressIndicator extends Phaser.GameObjects.Sprite {

    static preload(scene) {
        scene.load.spritesheet('progressSheet', 'assets/ui/spr_ui_progress_alt_strip5.png', {
            frameWidth: 230,
            frameHeight: 180
        });
    }

    constructor(scene, texture, stageNumber, mapNumber, key) {
        // X, Y 위치를 화면의 상단 우측으로 설정
        const x = scene.sys.game.config.width / 2;/// 2 -65
        const y = 35; 
        
        super(scene, x, y, texture);
        scene.add.existing(this);

        // 초기 프레임 설정
        this.setFrame(0);
        // 스크롤에 영향을 받지 않도록 설정
        this.setScrollFactor(0);

        this.stageText = scene.add.text(x, y- 20, this.getStageName(stageNumber, key), {
            fontFamily: 'Galmuri11, sans-serif',
            fontSize: '14px',
            fill: '#000000',
            align: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.5)'  // 반투명한 검은색 배경
        }).setOrigin(0.5, 0.5);  // 텍스트를 중앙 정렬

        this.stageText.setScrollFactor(0);
        this.stageText.setDepth(1001);
        this.setDepth(1000);

        this.setScale(0.5);
        this.setProgress(mapNumber);

        if (key === 'store' ) {
            this.setVisible(false);
        } else if (mapNumber === 'boss'|| mapNumber > 10) {
            
        }
        this.setVisible(false);
            this.stageText.setVisible(false);
        
    }

    getStageName(stageNumber, key) {
        if (key == 'store') {
            return ' 델마의 상점 ';
        } else if (stageNumber == 1) {
            return ' 에덴 마을 외곽 ';
        } else if (stageNumber == 2) {
            return ' 지하 감옥 '
        } else if (stageNumber == 3) {
            return ' 볼프강의 연구소 '
        }
    }

    setProgress(frameIndex) {
        this.setFrame(frameIndex);
    }

}