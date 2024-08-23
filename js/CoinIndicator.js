export default class CoinIndicator {

    static preload(scene) {
        scene.load.image('meatcoin_16', 'assets/item/meatcoin/meatcoin_16.png');
    }

    constructor(scene, x, y) {
        this.scene = scene;
        // 코인 이미지를 로드
        this.coinImage = scene.add.image(x, y, 'meatcoin_16').setOrigin(0, 0);
        
        // 코인 텍스트를 생성
        this.coinText = scene.add.text(x + 20, y + 2, '0', {
            fontSize: '12px',
            fill: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: {
                left: 5,
                right: 5,
                top: 2,
                bottom: 2
            }
        }).setOrigin(0, 0);

        // 코인 이미지와 텍스트를 컨테이너에 추가
        this.container = scene.add.container(x, y, [this.coinImage, this.coinText]);
        this.container.setScrollFactor(0); // 화면에 고정
    }

    // 코인 텍스트를 업데이트하는 메서드
    update(amount) {
        this.coinText.setText(amount);
    }

}