import TextIndicator from "./TextIndicator.js";

export default class Item extends Phaser.Physics.Matter.Sprite {

    constructor(scene, x, y, texture, frame, player, type) {

        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 플레이어 스프라이트를 생성
        super(scene.matter.world, x, y, texture, frame);

        // 플레이어 스프라이트를 장면에 추가하여 화면에 렌더링되고 다른 게임 객체들과 상호작용
        // 화면에 아이템 보이게하기
        scene.add.existing(this);  
    
        // 밀리지 않도록 객체를 고정
        this.setStatic(true);

        // 특정 객체 (Player)를 인식하도록 저장
        this.player = player;
        this.type = type;

        // 충돌 이벤트 리스너 추가
        // scene.matter.world.on('collisionstart', this.handleCollision, this);

    }

    // // 충돌 이벤트 핸들러
    // handleCollision(event) {

    //     // 충돌 쌍 가져오기
    //     const pairs = event.pairs;

    //     // 모든 충돌 쌍 하나씩 가져오기 (반복)
    //     for (let i = 0; i < pairs.length; i++) {
    //         const bodyA = pairs[i].bodyA;
    //         const bodyB = pairs[i].bodyB;

    //         // this.body와 player.body의 충돌인지 확인
    //         // item과 플레이어가 충돌했다면
    //         if ((bodyA === this.body && bodyB === this.player.body) || (bodyA === this.player.body && bodyB === this.body)) {
                

    //             let content;;
    //             if(this.type == 'tomato'){
    //                 // 플레이어 heart 1회복
    //                 this.player.increaseHeart(1);
    //                 content = '+1 heart';
    //             }
    //             else if(this.type == 'coin'){
    //                 console.log('코인 획득');
    //                 this.player.addCoin(10);
    //                 content = '+10 coin';
    //             }
    //             else{
    //                 content='';
    //             }


    //             let text = TextIndicator.createText(this.scene, this.x,this.y, content, {
    //                 fontSize: '0.8vw',
    //                 fill: '#FFF' // 글씨 색상 검은색
    //             });

    //             this.scene.time.delayedCall(2000, () => {
    //                 TextIndicator.removeText(text);
    //             });

    //             // 객체를 화면에서 제거
    //             this.destroy();

    //         }
    //     }

    // }

    static preload(scene) {
        // Load the SVG file
        scene.load.image('coin', 'assets/item/pixel_meat_coin.png');
        scene.load.spritesheet('item', 'assets/item/fruits asset.png', { frameWidth: 16, frameHeight: 16 });
        // scene.load.image('coin', 'assets/item/meatCoin.png');
    }

}