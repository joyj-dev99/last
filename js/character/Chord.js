export default class Chord extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y} = data;
        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 플레이어 스프라이트를 생성
        super(scene.matter.world, x, y, 'chord', 'chord_idle_1_01');

        this.scene = scene;
        scene.add.existing(this);

        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const chordCollider = Bodies.rectangle(this.x, this.y, 32, 28, { 
            isSensor: false,
            isStatic: true,
            label: 'chord'
        });
        this.setExistingBody(chordCollider);

        // 충돌체 중심점 아래로 이동
        Body.setCentre(this.body, {x: this.x, y: this.y - 5}, false);

        this.anims.play('chord_idle_1');
    }

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        scene.load.atlas('chord', 'assets/npc/chord/chord.png', 'assets/npc/chord/chord_atlas.json');
        scene.load.animation('chordAnim', 'assets/npc/chord/chord_anim.json');
        // Load the speech bubble image
        scene.load.image('speechBubble', '/assets/ui/—Pngtree—pixel speech bubble_8533530.png');
    }

    startPlayLute() {
        this.anims.play('chord_ready');
        this.on('animationcomplete', this.handleAnimationComplete, this);
    }

    handleAnimationComplete(animation, frame) {
        if (
            animation.key === 'chord_ready') {
            this.anims.play('chord_sing', true);
        }
    }

    showSpeechBubble() {
        const bubble = this.scene.add.image(this.x, this.y -20 , 'speechBubble').setScale(0.015);
        const text = this.scene.add.text(this.x, this.y-20, '이제 배운걸\n써먹어 보자', { fontSize: '8px', fill: '#000000' });
        text.setOrigin(0.5, 0.5); // Center the text within the bubble

        // Optionally, destroy the bubble after some time
        this.scene.time.delayedCall(3000, () => {
            bubble.destroy();
            text.destroy();
        });
    }

    setLocation(x, y) {
        this.setX(x);
        this.setY(y);
    }

}
