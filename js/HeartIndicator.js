export default class HeartIndicator extends Phaser.GameObjects.Sprite {

    static preload(scene) {
        scene.load.spritesheet('heartSheet', 'assets/ui/HealthUI.png', {
            frameWidth: 99,
            frameHeight: 32.5
        });
    }

    constructor(scene, texture, num) {
        // X, Y 위치를 화면의 상단 중앙으로 설정
        const x = 400
        const y = 30; 
        
        super(scene, x, y, texture);
        scene.add.existing(this);

        // 초기 프레임 설정
        this.setFrame(0);
        // 스크롤에 영향을 받지 않도록 설정
        this.setScrollFactor(0);
        // 다른 오브젝트 위에 렌더링되도록 z-index 설정
        this.setDepth(1000);
        // 하트 크기 조절
        this.setScale(0.8);
        // 하트 조절
        this.setHeart(num);
        
    }

    setHeart(num) {
        if(num == 3){
            this.setFrame(0);
        }else if(num == 2.5){
            this.setFrame(1);
        }else if(num == 2){
            this.setFrame(2);
        }else if(num == 1.5){
            this.setFrame(3);
        }else if(num == 1){
            this.setFrame(4);
        }else if(num == 0.5){
            this.setFrame(5);
        }else if(num == 0){
            this.setFrame(6);
    }
}

}