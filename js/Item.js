import {PLAYER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "./constants.js";

import TextIndicator from "./TextIndicator.js";
export default class Item extends Phaser.Physics.Matter.Sprite {

    // 코인 데이터 
    static COIN = {
        type : 'coin',
        texture : 'coin',
        frame : null,
        scale : 0.5,
        // 상단 누적코인 갯수 표시하는 text 객체
        // textIndicator : this.coinIndicatorText,
        message : '+10 coin'
    };

    // 하트 데이터 
    static Heart = {
        type : 'heart',
        texture : 'Skills and Spells',
        frame : 146,
        scale : 0.5,
        message : '+1 heart'
    };

    // 좋은 아이템이든 나쁜 아이템이든 동일한 드랍확률을 가지도록 함
    // 천사의 심장 아이템 데이터
    static MaxHeart_ITEM = {
        type: 'max_heart',
        texture: 'Skills and Spells',  
        frame: 1090,           
        scale: 0.5,            
        message: '+1 Max Heart',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 팬텀 망토 아이템 데이터
    static PhantomCloak_ITEM = {
        type: 'phantom_cloak',
        texture: 'Weapons and Equipment',  
        frame: 1259,  
        scale: 0.5,
        message: '10s Invincibility!',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 신속의 장화 아이템 데이터
    static SwiftBoots_ITEM = {
        type: 'swift_boots',
        texture: 'Weapons and Equipment', 
        frame: 1904,  
        scale: 0.5,
        message: 'Speed +25%',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };
        
    // 알 수 없는 부적 아이템 데이터
    static UnknownAmulet_ITEM = {
        type: 'unknown_amulet',
        texture: 'Loot and Treasure',  
        frame: 96,  
        scale: 0.5,
        message: '-3s Skill Cooldown',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 양자 모래시계 아이템 데이터
    static QuantumHourglass_ITEM = {
        type: 'quantum_hourglass',
        texture: 'Loot and Treasure',  
        frame: 181,  
        scale: 0.5,
        message: '+3s Skill Cooldown',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 허리에 좋은 약초 아이템 데이터
    static HerbalMedicine_ITEM = {
        type: 'herbal_medicine',
        texture: 'Alchemy and Potions',  
        frame: 33,  
        scale: 0.5,
        message: 'No Rolling for 30s',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 해적의 금고 아이템 데이터
    static PiratesSafe_ITEM = {
        type: 'pirates_safe',
        texture: 'Loot and Treasure', 
        frame: 126,  
        scale: 0.5,
        message: 'All Coins Lost ㅠ.ㅠ',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };
        
    // 고대의 묘약 아이템 데이터
    static AncientPotion_ITEM = {
        type: 'ancient_potion',
        texture: 'Loot and Treasure',  
        frame: 25,  
        scale: 0.5,
        message: 'Speed -25%',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 두꺼운 장갑 아이템 데이터
    static HeavyGloves_ITEM = {
        type: 'heavy_gloves',
        texture: 'Weapons and Equipment',  
        frame: 47,  
        scale: 0.5,
        message: '-25% Attack Power',  
        drap_per: 0.1  // 드랍 확률 (10%)
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


    static dropHeart(){
        return Item.Heart;
    }

    static dropRandomItem() {
        const items = [
            Item.MaxHeart_ITEM,
            Item.PhantomCloak_ITEM,
            Item.SwiftBoots_ITEM,
            Item.UnknownAmulet_ITEM,
            Item.QuantumHourglass_ITEM,
            Item.HerbalMedicine_ITEM,
            Item.PiratesSafe_ITEM,
            Item.AncientPotion_ITEM,
            Item.HeavyGloves_ITEM
        ];

        // 총 드랍 확률 합계
        // 총 드랍확률을 합해서, 그중 특정 아이템이 드랍될 확률을 비율적으로 적용하기 위함
        const totalDropRate = items.reduce((acc, item) => acc + item.drap_per, 0);

        // 0과 totalDropRate 사이의 랜덤 값을 생성
        let randomValue = Math.random() * totalDropRate;

        // 랜덤 값에 따라 아이템 선택
        for (let item of items) {
            if (randomValue < item.drap_per) {
                return item;
            }
            randomValue -= item.drap_per;
        }

        // 예외 처리: 만약 모든 경우에 해당하지 않으면 (이론상 발생하지 않음)
        return null;
    }

    // 물음표 맵
    // 하트와 아이템을 떨어뜨리는 두 가지 메서드 중에서 랜덤으로 하나를 선택하여 실행하는 메서드
    static dropRandomReward() {
        // 50% 확률로 dropHeart 또는 dropRandomItem을 실행
        const randomChoice = Math.random();
    
        if (randomChoice < 0.5) {
            return Item.dropHeart();  // 하트 떨어뜨리기
        } else {
            return Item.dropRandomItem();  // 랜덤 아이템 떨어뜨리기
        }
    }
    
    constructor(data) {

        let {scene, x, y, itemType} = data;

        // COIN에서 scale 값을 받아오고, 기본값은 1로 설정
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
            heartIndicator.setHeart(player.status.nowHeart);
        }
        else if(this.itemType.type == 'eggplant'){
            // 힘 3종류 +5 적용
            player.increaseATK(5);

        }else if(this.itemType.type == 'apple'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart);
        }
        else if(this.itemType.type == 'lemon'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart);
        }
        else if(this.itemType.type == 'pumpkin'){
            // 공격력 +5 적용
            player.increaseATK(5);
        }
        // 미니고블린의 고기
        else if(this.itemType.type == 'mini_goblin_meat'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart);
        }
        // 쥐의 치즈
        else if(this.itemType.type == 'cheese'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart);
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
            heartIndicator.setHeart(player.status.nowHeart);
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

