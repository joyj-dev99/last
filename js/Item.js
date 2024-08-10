const PLAYER_CATEGORY = 0x0001;
const TILE_CATEGORY = 0x0004;
const OBJECT_CATEGORY = 0x0005;
// const ITEM_CATEGORY = 0x0003;

import TextIndicator from "./TextIndicator.js";
import MonsterTomato from "./monsters/MonsterTomato.js";
import MonsterEggplant from "./monsters/MonsterEggplant.js";

export default class Item extends Phaser.Physics.Matter.Sprite {

    // 동전 아이템 데이터 
    static COIN_ITEM = {
        type : 'coin',
        texture : 'coin',
        frame : null,
        scale : 0.5,
        // 상단 누적코인 갯수 표시하는 text 객체
        // textIndicator : this.coinIndicatorText,
        message : '+10 coin'
    };

    // 토마토 시체 아이템 데이터 
    static TOMATO_ITEM = {
        type : 'tomato',
        texture : 'fruit',
        frame : 3,
        // 상단 우측 체력 표시하는 하트 표시 객체
        // heartIndicator : this.heartIndicator,
        message : '+1 heart'
    };

    // 가지 시체 아이템 데이터 
    static Eggplant_ITEM = {
        type : 'eggplant',
        texture : 'fruit',
        frame : 15,
        message : '+5 ATK' //Strength (공격력 5 증가) 
    };

    // Item.setData(this.coinIndicatorText,this.heartIndicator);
    // static setData(textIndicator, heartIndicator){
    //     Item.COIN_ITEM.textIndicator = textIndicator;
    //     Item.TOMATO_ITEM.heartIndicator = heartIndicator;
    // }

    static createItemType(monster){

        let monsterITEM = null;
        if(monster instanceof MonsterEggplant){
            monsterITEM = Item.Eggplant_ITEM;
        }
        else if(monster instanceof MonsterTomato){
            monsterITEM = Item.TOMATO_ITEM;
        }

        // Math.random() 함수는 0 (포함)에서 1 (제외) 사이의 난수를 생성합니다.
        const randomValue = Math.random();
        const itemType = randomValue <= 0.2 ? monsterITEM : Item.COIN_ITEM;
        return itemType;

    }

    constructor(data) {

        let {scene, x, y, itemType} = data;

        // COIN_ITEM에서 scale 값을 받아오고, 기본값은 1로 설정
        let scale = itemType.scale !== undefined ? itemType.scale : 1;

        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 플레이어 스프라이트를 생성
        super(scene.matter.world, x, y, itemType.texture, itemType.frame);

        // 플레이어 스프라이트를 장면에 추가하여 화면에 렌더링되고 다른 게임 객체들과 상호작용
        // 화면에 아이템 보이게하기
        scene.add.existing(this);  
    
        // 밀리지 않도록 객체를 고정
        this.setStatic(true);
        // 크기 설정 (코인 크기 0.5배로 설정)
        this.setScale(scale);

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
    applyItem(player, textIndicator, heartIndicator) {

        console.log('itemType : '+this.itemType.type);

        if(this.itemType.type == 'coin'){
            // 상단 coin 누적 갯수 화면에 반영
            player.status.coin += 10;
            textIndicator.setText(`Coins: ${player.status.coin}`);
        }
        else if(this.itemType.type == 'tomato'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart);
        }
        else if(this.itemType.type == 'eggplant'){
            // 힘 3종류 +5 적용
            player.increaseATK(5);
        }


        let text = TextIndicator.createText(this.scene, this.x,this.y, this.itemType.message, {
            fontSize: '0.8vw',
            fill: '#FFF' // 글씨 색상 검은색
        });
        this.scene.time.delayedCall(2000, () => {
            // gpt가 이 지연 호출이 정확히 실행될 때 text 객체가 이미 파괴되었을 가능성이 있습니다. 
            // 안전하게 처리하려면 text가 존재할 때만 제거하도록 할 수 있습니다.
            // 라면서 확인하라고 해서 추가한 코드
            if (text) {
                TextIndicator.removeText(text);
            }
        });
        
        
        this.destroy();

        console.log("상호작용 가능 표시를 보여주는 메서드.");

        return true;
        // return this.itemType.type;

    }

}

