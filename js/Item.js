import {PLAYER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "./constants.js";
import {coinLocalStorageReset} from './localStorage.js';
import TextIndicator from "./TextIndicator.js";
export default class Item extends Phaser.Physics.Matter.Sprite {

    // 하트 데이터 
    static Heart = {
        type : 'heart',
        texture : 'item_01',
        message : '하트 +1'
    };

    // 좋은 아이템이든 나쁜 아이템이든 동일한 드랍확률을 가지도록 함
    // 천사의 심장 아이템 데이터
    static MaxHeart_ITEM = {
        type: 'max_heart',
        texture: 'item_02',                 
        message: '최대 하트 +1, 현재 하트 +1',
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 팬텀 망토 아이템 데이터
    static PhantomCloak_ITEM = {
        type: 'phantom_cloak',
        texture: 'item_03',  
        message: '앞으로 당신은 무적입니다. 망토 덕분에 아무리 몬스터에게 맞아도 죽지 않죠!',  
        drap_per: 0.01  // 드랍 확률 (1%)
    };

    // 신속의 장화 아이템 데이터
    static SwiftBoots_ITEM = {
        type: 'swift_boots',
        texture: 'item_04', 
        message: '신속의 장화 덕분에 이동속도 25% 증가!',   
        drap_per: 0.1  // 드랍 확률 (10%)
    };
        
    // 알 수 없는 부적 아이템 데이터
    static UnknownAmulet_ITEM = {
        type: 'unknown_amulet',
        texture: 'item_05',  
        message: '나이스! 공격 스킬 쿨타임 3초 감소',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 양자 모래시계 아이템 데이터
    static QuantumHourglass_ITEM = {
        type: 'quantum_hourglass',
        texture: 'item_06',  
        message: '이런, 공격스킬 쿨타임 3초 증가',   
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 허리에 좋은 약초 아이템 데이터
    static HerbalMedicine_ITEM = {
        type: 'herbal_medicine',
        texture: 'item_07',  
        message: '허리에 바른 약초가 마르려면, 앞으로 구르기는 금지입니다.', 
        drap_per: 0.05  // 드랍 확률 (5%)
    };

    // 해적의 금고 아이템 데이터
    static PiratesSafe_ITEM = {
        type: 'pirates_safe',
        texture: 'item_08', 
        message: '해적에게 코인을 도난당하셨군요. 코인 초기화',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };
        
    // 고대의 묘약 아이템 데이터
    static AncientPotion_ITEM = {
        type: 'ancient_potion',
        texture: 'item_09',  
        message: '묘약을 마셨더니 배탈이 났군요. 이동속도 25% 감소',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 두꺼운 장갑 아이템 데이터
    static HeavyGloves_ITEM = {
        type: 'heavy_gloves',
        texture: 'item_10',  
        message: '두꺼운 장갑을 끼니, 무기가 잘 안잡히죠? 공격력 25% 감소',  
        drap_per: 0.1  // 드랍 확률 (10%)
    };

    // 화살(10개) 아이템 데이터
    static arrow_10_ITEM = {
        type: 'arrow_10',
        texture: 'item_11', 
        frame: 0,  
        scale: 0.5,
        message: '화살 +10개',
        drap_per: 0.2  // 드랍 확률 (20%)
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
                gameObjectB.applyItem(gameObjectA, scene.heartIndicator, dialog);
                unsubscribe();
            }
        });

        return item;
    }

    // 랜덤 아이템 드랍 메서드
    static dropRandomItem(scene, player, x, y, dialog, excludeItemType = null) {
        const items = [
            Item.MaxHeart_ITEM,
            Item.PhantomCloak_ITEM,
            Item.SwiftBoots_ITEM,
            Item.UnknownAmulet_ITEM,
            Item.QuantumHourglass_ITEM,
            Item.HerbalMedicine_ITEM,
            Item.PiratesSafe_ITEM,
            Item.AncientPotion_ITEM,
            Item.HeavyGloves_ITEM,
            Item.arrow_10_ITEM
        ];

        // 제외할 아이템 타입이 있는 경우 필터링
        const filteredItems = excludeItemType ? items.filter(item => item !== excludeItemType) : items;

        const totalDropRate = filteredItems.reduce((acc, item) => acc + item.drap_per, 0);
        let randomValue = Math.random() * totalDropRate;

        let selectedItem = null;
        for (let oneItem of filteredItems) {
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
                    gameObjectB.applyItem(gameObjectA, scene.heartIndicator, dialog);
                    unsubscribe();
                }
            });

            return item;  // 선택된 아이템을 리턴하여 첫 번째 아이템 정보 전달
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
        // let scale = itemType.scale !== undefined ? itemType.scale : 1;

        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 플레이어 스프라이트를 생성
        super(scene.matter.world, x, y, itemType.texture, 0);

        // 플레이어 스프라이트를 장면에 추가하여 화면에 렌더링되고 다른 게임 객체들과 상호작용
        // 화면에 아이템 보이게하기
        scene.add.existing(this);  
    
        // 밀리지 않도록 객체를 고정
        this.setStatic(true);
        // 크기 설정 (코인 크기 0.5배로 설정)
        // this.setScale(scale);

        // 충돌 이벤트 리스너 추가
        // scene.matter.world.on('collisionstart', this.handleCollision, this);
        this.setCollisionCategory(OBJECT_CATEGORY);
        this.setCollidesWith([PLAYER_CATEGORY, TILE_CATEGORY]);

        this.itemType = itemType;
    }

    // 아이템 적용 메소드
    // 아이템마다 상속으로 처리할 수도 있을 듯
    applyItem(player, heartIndicator, dialog) {

        let dialogMessages = [];

        console.log('itemType : '+this.itemType.type);

        // 붉은 하트
        if(this.itemType.type == 'heart'){
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
        // 팬텀 망토
        else if(this.itemType.type == 'phantom_cloak'){
            dialogMessages.push({ name: '코드', portrait: 'ChordPotrait', message: this.itemType.message });
            player.setInvincible(true);  // 무적을 영구적으로 적용
            
        }
        // 신속의 장화
        else if(this.itemType.type == 'swift_boots'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.adjustSpeed(1.25);  // 이동속도 증가를 영구적으로 적용
        }
        //알수 없는 부적
        else if(this.itemType.type == 'unknown_amulet'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            console.log('sword cooldown: ' + player.status.swordCoolTime);
            console.log('magic cooldown: ' + player.status.magicCoolTime );
            player.adjustCooldown(-3000); 
            console.log('New sword cooldown: ' + player.status.swordCoolTime);
            console.log('New magic cooldown: ' + player.status.magicCoolTime );

        }
        //양자 모래시계
        else if(this.itemType.type == 'quantum_hourglass'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            console.log('sword cooldown: ' + player.status.swordCoolTime);
            console.log('magic cooldown: ' + player.status.magicCoolTime );
            player.adjustCooldown(3000);
            console.log('New sword cooldown: ' + player.status.swordCoolTime);
            console.log('New magic cooldown: ' + player.status.magicCoolTime );
        }
        // 허리에 좋은 약초
        else if(this.itemType.type == 'herbal_medicine'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.status.canRoll = false;  // 구르기 금지를 영구적으로 적용
        }
        //해적의 금고
        else if(this.itemType.type == 'pirates_safe'){
            // 플레이어의 코인을 0으로 초기화
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.status.coin = 0;
            coinLocalStorageReset();     
            //ui 변경
            this.scene.coinIndicatorText.setText(`Coins : ${player.status.coin}`);
            
        }
        // 고대의 묘약
        else if(this.itemType.type == 'ancient_potion'){
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.adjustSpeed(0.75);  // 이동속도 감소를 영구적으로 적용
        }
        //두꺼운 장갑
        else if(this.itemType.type == 'heavy_gloves'){
            // 모든 공격 스킬의 공격력을 25% 감소시킴
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.adjustAttackPower(0.75);  
            
        }
        //화살 10개
        else if(this.itemType.type == 'arrow_10'){
            // 플레이어가 가진 화살이 10개 늘어남
            dialogMessages.push({ name: "코드", portrait: 'ChordPotrait', message: this.itemType.message });
            player.addArrows(10);

        }
        dialog.showDialogModal(dialogMessages);
        
        this.destroy();

        // 5초 후에 다이얼로그를 닫음
        setTimeout(() => {
            dialog.hideDialogModal(); 
        }, 5000);
        

        return true;

    }

}

