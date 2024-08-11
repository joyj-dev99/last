import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "./constants.js";

export default class Magic extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let {scene} = data;

        const player = scene.player;
        const monsterArr = scene.monsterArr;
        // 마법이 도달할 수 있는 최대 거리
        const REACH = 150;

        // 현재 플레이어가 바라보고 있는 방향 벡터
        const directionVector = new Phaser.Math.Vector2(player.isLookingRight ? 1 : -1, 0);

        //플레이어가 바라보고 있는 방향에서 가장 가까운 몬스터 찾기 
        let closestMonster = null;
        let minDistance = Infinity;
        const angleThreshold = Math.PI / 2; // 90도 각도로 반원 설정

        monsterArr.forEach(monster => {
            const monsterVector = new Phaser.Math.Vector2(monster.x - player.x, monster.y - player.y);
            const distance = monsterVector.length();
            console.log('distance : ', distance);

            // 몬스터가 reach 내에 있는지 확인
            if (distance <= REACH) {
                // 몬스터와 플레이어가 바라보는 방향 간의 각도 계산
                const angleBetween = Phaser.Math.Angle.Between(player.x, player.y, monster.x, monster.y);
                const directionAngle = Math.atan2(directionVector.y, directionVector.x);

                // 각도가 90도 이하일 때만 해당 몬스터를 대상으로 설정
                if (Math.abs(Phaser.Math.Angle.Wrap(angleBetween - directionAngle)) <= angleThreshold && distance < minDistance) {
                    minDistance = distance;
                    closestMonster = monster;
                }
            }
        });

        console.log('closestMonster : ', closestMonster);

        // 마법 생성 위치 결정
        let targetX, targetY;

        if (closestMonster) {
            // 반원 내에서 가장 가까운 몬스터가 있을 때
            targetX = closestMonster.x;
            targetY = closestMonster.y;
        } else {
            // 반원 내에 몬스터가 없을 때
            targetX = player.x + directionVector.x * REACH;
            targetY = player.y;
        }

        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 스프라이트를 생성
        super(scene.matter.world, targetX, targetY, 'thunder', 'thunderstrike_w_blur_0');

        this.scene = scene;
        // 화면에 렌더링 + 다른 게임 객체들과 상호작용 가능해짐
        scene.add.existing(this);

    
        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const magicCollider = Bodies.rectangle(this.x, this.y, 30, 30, { 
            isSensor: true,
            isStatic: false, 
            label: 'magic' 
        });
        this.setExistingBody(magicCollider);

        // 충돌체 중심점 아래로 이동
        Body.setCentre(this.body, {x: this.x, y: this.y - 15}, false);

        // 충돌 카테고리 설정
        this.setCollisionCategory(PLAYER_ATTACK_CATEGORY);
        this.setCollidesWith([MONSTER_CATEGORY]);

        this.anims.play('thunder');
        this.on('animationcomplete', this.handleAnimationComplete, this);
    }

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        scene.load.atlas('thunder', 'assets/player/thunder.png', 'assets/player/thunder_atlas.json');
        scene.load.animation('thunderAnim', 'assets/player/thunder_anim.json');
    }

    handleAnimationComplete() {
        this.destroy();
    }
    
}