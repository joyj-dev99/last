export default class MeatCoin {
    constructor() {
    }

    static preload(scene) {
        scene.load.atlas('meatcoin', 'assets/item/meatcoin/meatcoin.png', 'assets/item/meatcoin/meatcoin_atlas.json');
        scene.load.animation('meatcoinAnim', 'assets/item/meatcoin/meatcoin_anim.json');
    }

    coinDrop(scene, minCoin, maxCoin, x, y) {
        const coinAmount = Phaser.Math.Between(minCoin, maxCoin);

        // 코인 스프라이트 생성 및 애니메이션 재생
        const coin = scene.add.sprite(x, y, 'meatcoin');
        coin.play('meatcoin_drop');

        // 코인 획득 효과음 재생
        scene.coinDropSound.play();

        // '+X coin' 텍스트 생성
        const coinText = scene.add.text(x, y - 20, `+${coinAmount} coin`, {
            fontSize: '16px',
            fill: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);

        // 애니메이션 재생 완료 후 코인 스프라이트와 텍스트 삭제
        coin.on('animationcomplete', () => {
            coin.destroy();
            coinText.destroy();
        });

        // 텍스트 페이드아웃 애니메이션
        scene.tweens.add({
            targets: coinText,
            alpha: 0,
            y: y - 40,
            ease: 'Power1',
            duration: 1000,
            onComplete: () => {
                coinText.destroy();
            }
        });
        // 플레이어에게 코인 추가
        scene.player.addCoin(coinAmount);
    }


}