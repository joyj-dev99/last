import {PLAYER_CATEGORY, OBJECT_CATEGORY} from "../constants.js";

export default class Thelma extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y} = data;
        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 플레이어 스프라이트를 생성
        super(scene.matter.world, x, y, 'thelma', 'bw_-_sprite_sheet_8');

        this.scene = scene;
        scene.add.existing(this);

        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const thelmaCollider = Bodies.rectangle(this.x, this.y, 20, 28, { 
            isSensor: false,
            isStatic: true,
            label: 'thelma',
            collisionFilter: {
                category: OBJECT_CATEGORY, // 현재 객체 카테고리
                mask: PLAYER_CATEGORY //충돌할 대상 카테고리
            }
        });
        this.setExistingBody(thelmaCollider);

        // 충돌체 중심점 아래로 이동
        Body.setCentre(this.body, {x: this.x, y: this.y - 5}, false);

        this.anims.play('thelma_idle');
        this.setFlipX(true);
        
    }

}
