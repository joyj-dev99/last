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
        frame : 130,
        scale : 0.5,
        message : '+1 heart'
    };

    // 좋은 아이템이든 나쁜 아이템이든 동일한 드랍확률을 가지도록 함
    // 천사의 심장 아이템 데이터
    static MaxHeart_ITEM = {
        type: 'max_heart',
        texture: 'Skills and Spells',  
        frame: 1089,           
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
        message: '10초 동안 무적',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 신속의 장화 아이템 데이터
    static SwiftBoots_ITEM = {
        type: 'swift_boots',
        texture: 'Weapons and Equipment', 
        frame: 1858,  
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


    // 하트 드랍 메서드
    static dropHeart(scene, player, x, y, dialog) {
        let item = new Item({
            scene: scene,
            x: x,
            y: y,
            itemType: Item.Heart
        });

        // 플레이어와 아이템 충돌 이벤트 설정
        const unsubscribe = scene.matterCollision.addOnCollideStart({
            objectA: player,
            objectB: item,
            callback: eventData => {
                const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                scene.getItemSound.play();
                console.log("플레이어와 아이템 충돌");
                // 아이템 효과 적용하기 및 화면에 반영하기
                gameObjectB.applyItem(gameObjectA, scene.textIndicator, scene.heartIndicator, dialog);
                unsubscribe();
            }
        });
    }

    // 랜덤 아이템 드랍 메서드
    static dropRandomItem(scene, player, x, y, dialog) {
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

        const totalDropRate = items.reduce((acc, item) => acc + item.drap_per, 0);
        let randomValue = Math.random() * totalDropRate;

        let selectedItem = null;
        for (let oneItem of items) {
            if (randomValue < oneItem.drap_per) {
                selectedItem = oneItem;
                break;  // 조건을 만족하면 루프 종료
            }
            randomValue -= oneItem.drap_per;
        }

        if (selectedItem) {
            let item = new Item({
                scene: scene,
                x: x,
                y: y,
                itemType: selectedItem
            });

            // 플레이어와 아이템 충돌 이벤트 설정
            const unsubscribe = scene.matterCollision.addOnCollideStart({
                objectA: player,
                objectB: item,
                callback: eventData => {
                    const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                    scene.getItemSound.play();
                    console.log("플레이어와 아이템 충돌");
                    // 아이템 효과 적용하기 및 화면에 반영하기
                    gameObjectB.applyItem(gameObjectA, scene.textIndicator, scene.heartIndicator, dialog);
                    unsubscribe();
                }
            });
        }
    }


    // 랜덤 보상 드랍 메서드 (물음표)
    static dropRandomReward(scene, player, x, y, dialog) {
        const randomChoice = Math.random();

        if (randomChoice < 0.5) {
            return Item.dropHeart(scene, player, x, y, dialog);  // 하트 드랍
        } else {
            return Item.dropRandomItem(scene, player, x, y, dialog);  // 랜덤 아이템 드랍
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
    applyItem(player, textIndicator, heartIndicator, dialog) {

        let dialogMessages = [];

        console.log('itemType : '+this.itemType.type);

        if(this.itemType.type == 'coin'){
            // 상단 coin 누적 갯수 화면에 반영
            player.status.coin += 10;
            textIndicator.setText(`Coins: ${player.status.coin}`);
        }
        // 붉은 하트
        else if(this.itemType.type == 'heart'){
            // 체력 +1 적용
            player.increaseHeart(1);
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);

            // 텍스트 띄우기
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
        }
        //천사의 심장
        else if(this.itemType.type == 'max_heart'){
            dialogMessages.push({ name: '코드', portrait: 'ChordPotrait', message: this.itemType.message });
            player.increaseMaxHeart(1);
            heartIndicator.setHeart(player.status.nowHeart, player.status.maxHeart);

        }
        //팬텀 망토
        else if(this.itemType.type == 'phantom_cloak'){
            // 플레이어를 무적 상태로 설정
            dialogMessages.push({ name: '코드', portrait: 'ChordPotrait', message: this.itemType.message });
            dialog.showDialogModal(dialogMessages, () => {
                player.setInvincible(true);
                this.scene.time.delayedCall(20000, () => {
                    player.setInvincible(false);
                    console.log('Phantom Cloak effect ended!');
                });
            });
            return;
        }
        //신속의 장화
        else if(this.itemType.type == 'swift_boots'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            dialog.showDialogModal(dialogMessages, () => {
                player.adjustSpeed(1.25);
                this.scene.time.delayedCall(60000, () => {
                    player.adjustSpeed(1 / 1.25);
                    console.log('Swift Boots effect ended.');
                });
            });
            return;
        }
        //알수 없는 부적
        else if(this.itemType.type == 'unknown_amulet'){
            // 이미지 잘못됨
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.adjustCooldown(-3); 

        }
        //양자 모래시계
        else if(this.itemType.type == 'quantum_hourglass'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.adjustCooldown(3);
        }
        //허리에 좋은 약초
        else if(this.itemType.type == 'herbal_medicine'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            dialog.showDialogModal(dialogMessages, () => {
                player.canRoll = false;
                this.scene.time.delayedCall(30000, () => {
                    player.canRoll = true;
                    console.log('Rolling is now enabled again.');
                });
            });
            return;

        }
        //해적의 금고
        else if(this.itemType.type == 'pirates_safe'){
            // 플레이어의 코인을 0으로 초기화
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.status.coin = 0;
            
        }
        //고대의 묘약
        else if(this.itemType.type == 'ancient_potion'){
            // 이동속도를 25% 감소시킴
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            dialog.showDialogModal(dialogMessages, () => {
                player.adjustSpeed(0.75);
                this.scene.time.delayedCall(60000, () => {
                    player.adjustSpeed(1 / 0.75);
                    console.log('Ancient Potion effect ended.');
                });
            });
            return;
        }
        //두꺼운 장갑
        else if(this.itemType.type == 'heavy_gloves'){
            // 모든 공격 스킬의 공격력을 25% 감소시킴
            player.adjustAttackPower(0.75);  
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
        }
        //화살 1개
        else if(this.itemType.type == 'arrow'){
            // 플레이어가 가진 화살이 1개 늘어남
            player.addArrow(1);
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });

        }
        //화살 10개
        else if(this.itemType.type == 'arrow_10'){
            // 플레이어가 가진 화살이 10개 늘어남
            player.addArrow(10);
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });

        }
        
        dialog.showDialogModal(dialogMessages);
        
        this.destroy();

        return true;

    }

}

