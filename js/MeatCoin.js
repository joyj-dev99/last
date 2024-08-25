export default class MeatCoin {
    constructor() {
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
        scene.player.addCoins(coinAmount);
    }

    bossCoinDrop(scene, x, y) {
        for (let i = 0; i < 5; i++) {
            const coinAmount = Phaser.Math.Between(20, 30);

            // 각 코인을 약간의 시간 차이를 두고 생성
            scene.time.delayedCall(i * 200, () => {
                // 코인의 위치를 약간 무작위로 설정하여 x, y 주위에 흩뿌리기
                const offsetX = Phaser.Math.Between(-50, 50);
                const offsetY = Phaser.Math.Between(-50, 50);
                const coin = scene.add.sprite(x + offsetX, y + offsetY, 'meatcoin');
                coin.play('meatcoin_drop');

                // 코인 획득 효과음 재생
                scene.coinDropSound.play();

                // '+X coin' 텍스트 생성
                const coinText = scene.add.text(x + offsetX, y + offsetY - 20, `+${coinAmount} coin`, {
                    fontSize: '16px',
                    fill: '#FFD700',
                    fontStyle: 'bold'
                }).setOrigin(0.5, 0.5);
    
                // 코인 애니메이션 완료 후 코인 제거
                coin.on('animationcomplete', () => {
                    coin.destroy();
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
                scene.player.addCoins(coinAmount);

            }, [], this);
        }
    }


}