import {MONSTER_CATEGORY, PLAYER_ATTACK_CATEGORY, PLAYER_ATTACK_GROUP} from "./constants.js";

export default class Slash extends Phaser.Physics.Matter.Sprite {

    constructor(scene, x, y) {

        super(scene.matter.world, x, y, 'slash', 'slash_1_0');

        // 플레이어 스프라이트를 장면에 추가하여 화면에 렌더링되고 다른 게임 객체들과 상호작용
        // 화면에 아이템 보이게하기
        scene.add.existing(this);

        // Initialize the animation
        // slash_anim.json의 key를 작성함
        this.play('slash_1');

        // Scale the sprite visually
        // this.setScale(2);

        // 물리적 바디 설정
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const slashCollider = Bodies.rectangle(this.x, this.y, 35 * 1.5, 35 * 1.5, {
            isSensor: false,
            isStatic: false,
            label: 'slash'
        });
        this.setExistingBody(slashCollider);
        //충돌로 인한 회전을 방지
        this.setFixedRotation();

        // 충돌 카테고리 설정
        this.setCollisionCategory(PLAYER_ATTACK_CATEGORY);
        this.setCollidesWith([MONSTER_CATEGORY]);
        // 충돌 그룹 설정
        this.scene.matter.setCollisionGroup([this], PLAYER_ATTACK_GROUP);

        // 플레이어 depth 100. 항상 플레이어보다 위에 있음.
        this.setDepth(101);

    }

    static preload(scene) {
        if (scene.load) {
            // Preload the atlas and animation JSON files
            scene.load.atlas('slash', 'assets/player/slash.png', 'assets/player/slash_atlas.json');
            scene.load.animation('slashAnim', 'assets/player/slash_anim.json');
        } else {
            console.error("Scene does not have a load property. Ensure you're passing a valid Phaser scene.");
        }
    }
}