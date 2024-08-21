export default class MeatCoin {
    constructor() {
    }

    static preload(scene) {
        scene.load.atlas('meatcoin', 'assets/item/meatcoin/meatcoin.png', 'assets/item/meatcoin/meatcoin_atlas.json');
        scene.load.animation('meatcoinAnim', '/assets/item/meatcoin/meatcoin.png');
    }

    coinDrop(scene) {
        // scene.
    }
}