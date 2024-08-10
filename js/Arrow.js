const PLAYER_CATEGORY = 0x0001;
const MONSTER_CATEGORY = 0x0002;
const TILE_CATEGORY = 0x0004;
const OBJECT_CATEGORY = 0x0005;
const PLAYER_ATTACK_CATEGORY = 0x0006;

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
        const arrowCollider = Bodies.circle(this.x, this.y, 10, { 
            isSensor: false,
            isStatic: false, 
            label: 'arrow' 
        });
        this.setExistingBody(arrowCollider);

        // 충돌 카테고리 설정
        this.setCollisionCategory(PLAYER_ATTACK_CATEGORY);
        this.setCollidesWith([MONSTER_CATEGORY]);

        this.SPEED = 10;
        this.DURATION = 1500;

        // 플레이어의 방향에 따라 화살의 속도와 각도를 설정
        this.setDirectionAndVelocity(scene.player);

        // 동적으로 생성된 화살에 충돌 이벤트 추가
        this.scene.matterCollision.addOnCollideStart({
            objectA: this.scene.mosterArr, // 몬스터 배열
            objectB: this, // 현재 화살 객체
            callback: eventData => {
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                console.log("몬스터가 공격에 맞음");
                gameObjectB.destroy(); // 화살 제거
            }
        });

        scene.time.addEvent({
            delay: this.DURATION,
            callback: () => {
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