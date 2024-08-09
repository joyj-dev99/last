const PLAYER_CATEGORY = 0x0001;
const MONSTER_CATEGORY = 0x0002;
const TILE_CATEGORY = 0x0004;

export default class Monster extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame, monsterType, bodyWidth, bodyHeight, centreX, centreY, 
            hp, damage, reach, speed, oneMove, maxMove, followDistance, player} = data;

        super(scene.matter.world, x, y, texture, frame);
        this.scene = scene;
        this.scene.add.existing(this);
    
        // 최초 생성시 왼쪽을 바라보도록.
        this.setFlipX(true);

        // 초기화
        this.monsterType = monsterType;
        this.hp = hp; // 체력
        this.damage = damage; // 한번에 플레이어의 체력을 얼마나 깍는지. 기본은 0.5
        this.reach = reach; // 공격을 시도하는 최대 거리 (픽셀)
        this.speed = speed; // 이동속도
        this.oneMove = oneMove; // 한번에 이동하는 거리 (픽셀)
        this.maxMove = maxMove; // 초기 위치에서 최대로 이동할 수 있는 거리 (픽셀)
        this.followDistance = followDistance; // 플레이어와 몬스터 사이 거리가 해당 수치보다 작으면 몬스터가 플레이어를 따라다님 (픽셀)
        
        // 플레이어 객체 참조
        this.player = player; 

        // 충돌체 생성
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        this.monsterCollider = Bodies.rectangle(this.x, this.y, bodyWidth, bodyHeight, {
            isSensor: false,
            label: `${this.monsterType}Collider` // 아직 라벨을 사용하지 않음
        });

        const compoundBody = Body.create({
            parts: [this.monsterCollider],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        // 충돌체 중심점 이동 (상대적 위치로 이동함)
        Body.setCentre(this.body, {x: centreX, y: centreY}, true);

        // 애니메이션 재생
        this.anims.play(`${this.monsterType}_idle`);

        console.log("몬스터 생성: ", monsterType, x, y);


        this.setCollisionCategory(MONSTER_CATEGORY);
        this.setCollidesWith([PLAYER_CATEGORY, TILE_CATEGORY]);

    }

    static preload(scene) {
        scene.load.atlas('tomato', 'assets/monster/tomato/tomato.png', 'assets/monster/tomato/tomato_atlas.json');
        scene.load.animation('tomatoAnim', 'assets/monster/tomato/tomato_anim.json');
        scene.load.atlas('eggplant', 'assets/monster/eggplant/eggplant.png', 'assets/monster/eggplant/eggplant_atlas.json');
        scene.load.animation('eggplantoAnim', 'assets/monster/eggplant/eggplant_anim.json');
    }

    update() {
        
    }

    // 자식 몬스터 클래스에서 필수로 오버라이드 해야 하는 함수들
    itemDrop() {
        throw new Error('Method "itemDrop()" must be implemented.');
    }

    takeDamage() {
        throw new Error('Method "takeDamage()" must be implemented.');
    }

    
}
