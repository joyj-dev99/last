import {PLAYER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "./constants.js";

import TextIndicator from "./TextIndicator.js";
import MonsterTomato from "./monsters/MonsterTomato.js";
import MonsterEggplant from "./monsters/MonsterEggplant.js";
import MonsterApple from "./monsters/MonsterApple.js";
import MonsterLemon from "./monsters/MonsterLemon.js";
import MonsterBossPumpkin from "./monsters/MonsterBossPumpkin.js";
import MonsterFly from "./monsters/MonsterFly.js";
import MonsterSpider from "./monsters/MonsterSpider.js";
import MonsterMiniGoblin from "./monsters/MonsterMiniGoblin.js";
import MonsterRatfolk from "./monsters/MonsterRatfolk.js";
import MonsterBossGoblin from "./monsters/MonsterBossGoblin.js";
import MonsterBossNecromancer from "./monsters/MonsterBossNecromancer.js";
import MonsterBugbear from "./monsters/MonsterBugbear.js";
import MonsterAngel from "./monsters/MonsterAngel.js";
import MonsterGolem from "./monsters/MonsterGolem.js";

export default class Item extends Phaser.Physics.Matter.Sprite {

    // 동전 아이템 데이터 
    static COIN_ITEM = {
        type : 'coin',
        texture : 'coin',
        frame : null,
        scale : 0.5,
        // 상단 누적코인 갯수 표시하는 text 객체
        // textIndicator : this.coinIndicatorText,
        message : '+10 coin',
        drap_per : 0.2
    };

    // 토마토 시체 아이템 데이터 
    static TOMATO_ITEM = {
        type : 'tomato',
        texture : 'fruit',
        frame : 3,
        // 상단 우측 체력 표시하는 하트 표시 객체
        // heartIndicator : this.heartIndicator,
        message : '+1 heart',
        drap_per : 0.2
    };

    // 가지 시체 아이템 데이터 
    static Eggplant_ITEM = {
        type : 'eggplant',
        // texture : 'fruit',
        // frame : 10,
        texture : 'eggplant',
        frame : null,
        scale : 0.66,
        message : '+5 ATK', //Strength (공격력 5 증가) 
        drap_per : 1.0
    };

    // 사과 시체 아이템 데이터 
    static Apple_ITEM = {
        type : 'apple',
        texture : 'fruit',
        frame : 4,
        message : '+1 heart' ,
        drap_per : 0.2
    };


    // 레몬 시체 아이템 데이터 
    static Lemon_ITEM = {
        type : 'lemon',
        texture : 'fruit',
        frame : 23,
        message : '+1 heart' ,
        drap_per : 0.2
    };

    // 호박 시체 아이템 데이터 
    static Pumpkin_ITEM = {
        type : 'pumpkin',
        texture : 'pumpkin',
        frame : 0,
        message : '+5 ATK' ,
        scale : 0.5,
        drap_per : 1.0
    };


    // 고블린 고기 아이템 데이터 
    static MiniGoblin_ITEM = {
        type : 'mini_goblin_meat',
        texture : 'meat',
        frame : null,
        scale : 0.66,
        message : '+1 heart' ,
        drap_per : 0.5
    };
    
    // 쥐의 치즈 아이템 데이터 
    static Ratfolk_ITEM = {
        type : 'cheese',
        texture : 'cheese',
        frame : null,
        scale : 0.5,
        message : '+1 heart' ,
        drap_per : 0.5
    };
    
    // 물약 아이템 데이터 
    static Blue_Potion_ITEM = {
        type : 'potion',
        texture : 'potion',
        frame : 0,
        scale : 0.66,
        message : '+5 ATK' ,
        drap_per : 0.5
    };
    // 물약 아이템 데이터 
    static Yellow_Potion_ITEM = {
        type : 'potion',
        texture : 'potion',
        frame : 1,
        scale : 0.66,
        message : '+5 ATK' ,
        drap_per : 0.5
    };
    // 물약 아이템 데이터 
    static Red_Potion_ITEM = {
        type : 'potion',
        texture : 'potion',
        frame : 2,
        scale : 0.66,
        message : '+5 ATK' ,
        drap_per : 0.5
    };

    // 붉은 하트 아이템 데이터 
    static Heart_ITEM = {
        type : 'heart',
        texture : 'Skills and Spells',
        frame : 146,
        scale : 0.5,
        message : '+1 heart' ,
        drap_per : 0.5
    };

    //천사의 심장(최대하트) 아이템 데이터
    static MaxHeart_ITEM = {
        type: 'max_heart',
        texture: 'Skills and Spells',  // 아이템의 텍스처 이름
        frame: 1090,           // 특정 프레임이 필요하지 않다면 null로 설정
        scale: 0.5,            // 아이템의 크기 비율
        message: '+1 Max Heart',  // 아이템을 얻었을 때 표시할 메시지
        drap_per: 0.5          // 드랍 확률 (50%)
    };

    // 팬텀 망토 아이템 데이터
    static PhantomCloak_ITEM = {
        type: 'phantom_cloak',
        texture: 'Weapons and Equipment',  // 텍스처 시트 이름
        frame: 1259,  // 팬텀 망토의 프레임 번호
        scale: 0.5,
        message: '10s Invincibility!',  // 10초동안 안보임, 데미지 안받음
        drap_per: 0.3  // 드랍 확률 (30%)
    };

    // 신속의 장화 아이템 데이터
    static SwiftBoots_ITEM = {
        type: 'swift_boots',
        texture: 'Weapons and Equipment', 
        frame: 1904,  // 신속의 장화의 프레임 번호
        scale: 0.5,
        message: 'Speed +25%',  
        drap_per: 0.4  // 드랍 확률 (40%)
    };
    
    // 알 수 없는 부적 아이템 데이터
    static UnknownAmulet_ITEM = {
        type: 'unknown_amulet',
        texture: 'Loot and Treasure',  // 텍스처 시트 이름
        frame: 96,  // 알 수 없는 부적의 프레임 번호
        scale: 0.5,
        message: '-3s Skill Cooldown',  // 아이템 효과 메시지
        drap_per: 0.5  // 드랍 확률 (50%)
    };

    // 양자 모래시계 아이템 데이터
    static QuantumHourglass_ITEM = {
        type: 'quantum_hourglass',
        texture: 'Loot and Treasure',  // 텍스처 시트 이름
        frame: 181,  // 양자 모래시계의 프레임 번호
        scale: 0.5,
        message: '+3s Skill Cooldown',  // 아이템 효과 메시지
        drap_per: 0.5  // 드랍 확률 (50%)
    };

    // 허리에 좋은 약초 아이템 데이터
    static HerbalMedicine_ITEM = {
        type: 'herbal_medicine',
        texture: 'Alchemy and Potions',  // 텍스처 시트 이름
        frame: 33,  // 허리에 좋은 약초의 프레임 번호
        scale: 0.5,
        message: 'No Rolling for 30s',  // 아이템 효과 메시지
        drap_per: 0.15  // 드랍 확률 (15%)
    };

    // 해적의 금고 아이템 데이터
    static PiratesSafe_ITEM = {
        type: 'pirates_safe',
        texture: 'Loot and Treasure', 
        frame: 126,  
        scale: 0.5,
        message: 'All Coins Lost ㅠ.ㅠ',  
        drap_per: 0.5  
    };
    
    // 고대의 묘약 아이템 데이터
    static AncientPotion_ITEM = {
        type: 'ancient_potion',
        texture: 'Loot and Treasure',  // 텍스처 시트 이름
        frame: 25,  // 고대의 묘약의 프레임 번호
        scale: 0.5,
        message: 'Speed -25%',  // 아이템 효과 메시지
        drap_per: 1.0  // 드랍 확률 (100%)
    };

    // 두꺼운 장갑 아이템 데이터
    static HeavyGloves_ITEM = {
        type: 'heavy_gloves',
        texture: 'Weapons and Equipment',  // 텍스처 시트 이름
        frame: 47,  // 두꺼운 장갑의 프레임 번호
        scale: 0.5,
        message: '-25% Attack Power',  // 아이템 효과 메시지
        drap_per: 0.7  // 드랍 확률 (70%)
    };

    // 화살(1개) 아이템 데이터
    static arrow_ITEM = {
        type: 'arrow',
        texture: 'arrow', 
        frame: 0,  
        scale: 0.5,
        message: '화살 +1개'
    };

    // 화살(10개) 아이템 데이터
    static arrow_10_ITEM = {
        type: 'arrow_10',
        texture: 'arrow_10', 
        frame: 0,  
        scale: 0.5,
        message: '화살 +10개'
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

        }else if(monster instanceof MonsterApple){
            monsterITEM = Item.Apple_ITEM;
        }
        else if(monster instanceof MonsterLemon){
            monsterITEM = Item.Lemon_ITEM;
        }
        else if(monster instanceof MonsterBossPumpkin){
            monsterITEM = Item.Pumpkin_ITEM;
        }
        else if(monster instanceof MonsterFly){
            monsterITEM = Item.COIN_ITEM;
        }
        else if(monster instanceof MonsterSpider){
            monsterITEM = Item.COIN_ITEM;
        }
        else if(monster instanceof MonsterMiniGoblin){
            monsterITEM = Item.MiniGoblin_ITEM;
        }
        else if(monster instanceof MonsterRatfolk){
            monsterITEM = Item.Ratfolk_ITEM;
        }
        else if(monster instanceof MonsterBossGoblin){
            monsterITEM = Item.Blue_Potion_ITEM;
        }
        else if(monster instanceof MonsterBossNecromancer){
            monsterITEM = Item.Blue_Potion_ITEM;
        }
        else if(monster instanceof MonsterBugbear){
            monsterITEM = Item.Yellow_Potion_ITEM;
        }
        else if(monster instanceof MonsterAngel){
            monsterITEM = Item.Heart_ITEM;
        }
        else if(monster instanceof MonsterGolem){
            monsterITEM = Item.Red_Potion_ITEM;
        }
        else{
            monsterITEM = Item.COIN_ITEM;
        }
        
        // Math.random() 함수는 0 (포함)에서 1 (제외) 사이의 난수를 생성합니다.
        const randomValue = Math.random();
        console.log('randomValue : '+randomValue);
        console.log('monsterITEM.drap_per : '+monsterITEM.drap_per);

        const itemType = randomValue <= monsterITEM.drap_per ? monsterITEM : Item.COIN_ITEM;
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
        scene.load.image('coin', 'assets/item/pixel_meat_coin.png');
        scene.load.spritesheet('fruit', 'assets/item/fruits asset.png', { frameWidth: 16, frameHeight: 16 });
        scene.load.image('pumpkin', 'assets/item/pumpkin.png');
        scene.load.image('cheese', 'assets/item/cheese.png');
        scene.load.image('meat', 'assets/item/meat.png');
        scene.load.spritesheet('potion', 'assets/item/potion.png', { frameWidth: 24, frameHeight: 24 });
        scene.load.image('eggplant', 'assets/item/eggplant.png');
        scene.load.spritesheet('Skills and Spells', 'assets/item/Skills and Spells.png', { frameWidth: 32, frameHeight: 32 } );
        scene.load.spritesheet('Weapons and Equipment', 'assets/item/Weapons and Equipment.png', { frameWidth: 32, frameHeight: 32 } );
        scene.load.spritesheet('Loot and Treasure', 'assets/item/Loot and Treasure.png', { frameWidth: 32, frameHeight: 32 } );
        scene.load.spritesheet('Alchemy and Potions', 'assets/item/Alchemy and Potions.png', { frameWidth: 32, frameHeight: 32 } );
        scene.load.image('arrow', 'assets/player/arrow.png');
        scene.load.image('arrow_10', 'assets/player/arrow_10.jpg');
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
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);
        }
        else if(this.itemType.type == 'eggplant'){
            // 힘 3종류 +5 적용
            player.increaseATK(5);

        }else if(this.itemType.type == 'apple'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);
        }
        else if(this.itemType.type == 'lemon'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);
        }
        else if(this.itemType.type == 'pumpkin'){
            // 공격력 +5 적용
            player.increaseATK(5);
        }
        // 미니고블린의 고기
        else if(this.itemType.type == 'mini_goblin_meat'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);
        }
        // 쥐의 치즈
        else if(this.itemType.type == 'cheese'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);
        }
        // 포션 
        else if(this.itemType.type == 'potion'){
            // 공격력 +5 적용
            player.increaseATK(5);
        }
        // 붉은 하트
        else if(this.itemType.type == 'heart'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);
        }
        //천사의 심장
        else if(this.itemType.type == 'max_heart'){
            player.increaseMaxHeart(1);
            heartIndicator.setHeart(player.status.nowHeart);
        }
        //팬텀 망토
        else if(this.itemType.type == 'phantom_cloak'){
            // 플레이어를 무적 상태로 설정
            player.setInvincible(true);

             // 10초 후에 무적 상태를 해제
            this.scene.time.delayedCall(10000, () => {
                player.setInvincible(false);
                console.log('Phantom Cloak effect ended!');
            });
        }
        //신속의 장화
        else if(this.itemType.type == 'swift_boots'){
            player.adjustSpeed(1.25);  // 25% 속도 증가

            this.scene.time.delayedCall(60000, () => {
                player.adjustSpeed(1 / 1.25);  // 원래 속도로 복원
                console.log('Swift Boots effect ended. Speed reset to: ' + player.status.speed);
            });
        }
        //알수 없는 부적
        else if(this.itemType.type == 'unknown_amulet'){
            // 모든 공격 스킬의 쿨타임을 3초 감소시킴
            player.adjustCooldown(-3); 
        }
        //양자 모래시계
        else if(this.itemType.type == 'quantum_hourglass'){
             // 모든 공격 스킬의 쿨타임을 3초 증가시킴
            player.adjustCooldown(3);
        }
        //허리에 좋은 약초
        else if(this.itemType.type == 'herbal_medicine'){
            // 구르기 금지
            player.canRoll = false;

             // 30초 후에 다시 구르기 가능하도록 설정
            this.scene.time.delayedCall(30000, () => {
                player.canRoll = true;
                console.log('Rolling is now enabled again.');
            });
        }
        //해적의 금고
        else if(this.itemType.type == 'pirates_safe'){
            // 플레이어의 코인을 0으로 초기화
            player.status.coin = 0;
        }
        //고대의 묘약
        else if(this.itemType.type == 'ancient_potion'){
            // 이동속도를 25% 감소시킴
            player.adjustSpeed(0.75);  

            this.scene.time.delayedCall(60000, () => {
                player.adjustSpeed(1 / 0.75);  // 원래 속도로 복원
                console.log('Ancient Potion effect ended. Speed reset to: ' + player.status.speed);
            });
        }
        //두꺼운 장갑
        else if(this.itemType.type == 'heavy_gloves'){
            // 모든 공격 스킬의 공격력을 25% 감소시킴
            player.adjustAttackPower(0.75);  
        }
        //화살 1개
        else if(this.itemType.type == 'arrow'){
            // 플레이어가 가진 화살이 1개 늘어남
            player.addArrow(1);

        }
        //화살 10개
        else if(this.itemType.type == 'arrow_10'){
            // 플레이어가 가진 화살이 1개 늘어남
            player.addArrow(10);

        }
        
        let text = TextIndicator.createText(this.scene, this.x,this.y, this.itemType.message, {
            fontFamily: 'GalmuriMono7, sans-serif',
            fontSize: '8px', //8배수 단위로 늘어나야 잘 보임
            // fill: '#FFFFFF',
            fill: '#000000',
            resolution:2
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

    }

}

