const PLAYER_CATEGORY = 0x0001;
const ITEM_CATEGORY = 0x0003;
const TILE_CATEGORY = 0x0004;
const OBJECT_CATEGORY = 0x0005;

import TextIndicator from "./TextIndicator.js";

export default class Item extends Phaser.Physics.Matter.Sprite {

    constructor(data) {

        let {scene, x, y, itemType} = data;

        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 플레이어 스프라이트를 생성
        super(scene.matter.world, x, y, itemType.texture, itemType.frame);

        // 플레이어 스프라이트를 장면에 추가하여 화면에 렌더링되고 다른 게임 객체들과 상호작용
        // 화면에 아이템 보이게하기
        scene.add.existing(this);  
    
        // 밀리지 않도록 객체를 고정
        this.setStatic(true);

        // 충돌 이벤트 리스너 추가
        // scene.matter.world.on('collisionstart', this.handleCollision, this);
        this.setCollisionCategory(OBJECT_CATEGORY);
        this.setCollidesWith([PLAYER_CATEGORY, TILE_CATEGORY]);

        this.itemType = itemType;
    }

    static preload(scene) {
        // Load the SVG file
        scene.load.image('coin', 'assets/item/pixel_meat_coin.png');
        scene.load.spritesheet('fruit', 'assets/item/fruits asset.png', { frameWidth: 16, frameHeight: 16 });
        // scene.load.image('coin', 'assets/item/meatCoin.png');
    }

    // 아이템 적용 메소드
    // 아이템마다 상속으로 처리할 수도 있을 듯
    applyItem(player) {

        console.log('itemType : '+this.itemType.type);

        if(this.itemType.type == 'coin'){
            // 상단 coin 누적 갯수 화면에 반영
            player.status.coin += 10;
            this.itemType.textIndicator.setText(`Coins: ${player.status.coin}`);
        }
        else if(this.itemType.type == 'tomato'){
            // 체력 +1 적용
            player.increaseHeart(1);
            this.itemType.heartIndicator.setHeart(player.status.nowHeart);
        }
       
        let text = TextIndicator.createText(this.scene, this.x,this.y, this.itemType.message, {
            fontSize: '0.8vw',
            fill: '#FFF' // 글씨 색상 검은색
        });
        this.scene.time.delayedCall(2000, () => {
            TextIndicator.removeText(text);
        });
        
        this.destroy();

        console.log("상호작용 가능 표시를 보여주는 메서드.");

    }

}