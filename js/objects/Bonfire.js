export default class Bonfire extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y} = data;
        // 조명 추가
        scene.lights.addLight(x, y + 8, 170, 0xffa500, 1.0); // 조명 색상과 강도 설정

        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 스프라이트를 생성
        super(scene.matter.world, x, y, 'bonfire', 'bonfire_1');

        this.scene = scene;
        // 화면에 렌더링 + 다른 게임 객체들과 상호작용 가능해짐
        scene.add.existing(this);

        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const bonfireCollider = Bodies.circle(this.x, this.y, 18, { 
            isSensor: false,
            isStatic: true,
            label: 'bonfire' 
        });
        this.setExistingBody(bonfireCollider);

        this.anims.play('bonfire_fire');
    }

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        // bonfire.png 파일의 이미지와 bonfireAtlas.json 의 프레임 정보를 연동
        scene.load.atlas('bonfire', 'assets/objects/bonfire/bonfire.png', 'assets/objects/bonfire/bonfire_atlas.json');
        // 애니메이션을 정의해놓은 json 파일을 통해 애니메이션 로드 + 생성
        scene.load.animation('bonfireAnim', 'assets/objects/bonfire/bonfire_anim.json');
    }
}