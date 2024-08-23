import HeartIndicator from "./HeartIndicator.js";
import CoinIndicator from "./CoinIndicator.js"; // 예를 들어, 코인을 표시하는 UI 클래스
import ProgressIndicator from "./ProgressIndicator.js"; // 진행 상황을 표시하는 UI 클래스

export default class UiManager {
    constructor(scene, player, key) {
        this.scene = scene;
        this.player = player;
        this.key = key;
        // key 값으로 'store'인 경우, 'boss'인 경우 등 관리

        // UI 요소들을 초기화
        this.heartIndicator = new HeartIndicator(scene);
        this.coinIndicator = new CoinIndicator(scene, 10 , 0);
        this.progressIndicator = new ProgressIndicator(scene, 'progressSheet');

        // 초기 설정 (예: 최대 체력 설정)
        this.heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);

        if (key === 'intro') {
            this.progressIndicator.setVisible(false, false);
        }

    }

    static preload(scene) {
        HeartIndicator.preload(scene);
        CoinIndicator.preload(scene);
        ProgressIndicator.preload(scene);
    }

    update() {
        // 플레이어의 상태에 따라 UI 요소를 업데이트
        this.heartIndicator.setHeart(this.player.status.nowHeart, this.player.status.maxHeart);
        this.coinIndicator.update(this.player.status.coin);
    }
}