import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY,
    PLAYER_ATTACK_GROUP
} from "./constants.js";

export default class Arrow extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y} = data;
        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 스프라이트를 생성
        super(scene.matter.world, x, y, 'arrowImg');

        this.scene = scene;
        // 화면에 렌더링 + 다른 게임 객체들과 상호작용 가능해짐
        scene.add.existing(this);

        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const arrowCollider = Bodies.rectangle(this.x, this.y, 12, 6, { 
            isSensor: false,
            isStatic: false, 
            label: 'arrow' 
        });
        this.setExistingBody(arrowCollider);

        // 충돌 카테고리 설정
        this.setCollisionCategory(PLAYER_ATTACK_CATEGORY);
        this.setCollidesWith([MONSTER_CATEGORY]);

        // 충돌 그룹 설정
        this.scene.matter.setCollisionGroup([this], PLAYER_ATTACK_GROUP);

        this.SPEED = 10;
        this.DURATION = 1500;

        // 플레이어의 방향에 따라 화살의 속도와 각도를 설정
        this.setDirectionAndVelocity(scene.player);

        scene.time.addEvent({
            delay: this.DURATION,
            callback: () => {
                console.log('화살 제거됨');
                this.destroy();
            },
            loop: false,
        });
        
    }

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        scene.load.image('arrowImg', 'assets/player/arrow.png');
    }

    // 플레이어의 바라보는 방향에 따라 화살의 속도와 회전을 설정하는 메서드
    setDirectionAndVelocity(player) {
        // 플레이어의 마지막 방향을 가져옴
        let direction = player.lastDirection;

        // 속도 정규화 후 속력 설정
        direction.normalize().scale(this.SPEED);

        // 화살의 속도를 설정
        this.setVelocity(direction.x, direction.y);
        
        // 화살의 회전 각도를 플레이어의 이동 방향에 맞춤
        const angle = Phaser.Math.Angle.Between(0, 0, direction.x, direction.y);
        this.setRotation(angle);
        
    }
    
}