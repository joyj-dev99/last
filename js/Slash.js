import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "./constants.js";

export default class Slash extends Phaser.Physics.Matter.Sprite{

    constructor(scene, x, y){

        super(scene.matter.world, x, y, 'slash', 'fe1002_01');

        // 플레이어 스프라이트를 장면에 추가하여 화면에 렌더링되고 다른 게임 객체들과 상호작용
        // 화면에 아이템 보이게하기
        scene.add.existing(this);  

        // Initialize the animation
        this.play('slash');

        // Scale the sprite visually
        this.setScale(1.5);

        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const slashCollider = Bodies.rectangle(this.x, this.y, 35, 35, { 
            isSensor: true,
            isStatic: false, 
            label: 'slash' 
        });
        this.setExistingBody(slashCollider);

        // 충돌 카테고리 설정
        this.setCollisionCategory(PLAYER_ATTACK_CATEGORY);
        this.setCollidesWith([MONSTER_CATEGORY]);

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