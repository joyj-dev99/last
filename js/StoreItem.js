import {PLAYER_CATEGORY, ITEM_CATEGORY} from './constants.js';

const itemData = {
    1: {
        texture: "item_01",
        name: "붉은하트",
        price: 100,
        description: "살짝 기운 난다고요? 이 정도면 됐으니까, 더 바랄 생각 마세요. 하트 1개만큼 체력 회복이라고."
    },
    2: {
        texture: "item_02",
        name: "천사의 심장",
        price: 150,
        description: "천사의 심장? 최대 체력 하트 1개 늘어났으니까, 하루 더 버티시든 말든 알아서 하세요."
    },
    3: {
        texture: "item_03",
        name: "팬텀 망토",
        price: 80,
        description: "이 망토? 10초 동안 적들이 못 본다고요. 근데 10초밖에 안 되니까, 그 안에 다 처리하세요."
    },
    4: {
        texture: "item_04",
        name: "신속의 장화",
        price: 100,
        description: "신속의 장화 덕에 이동 속도 25% 빨라졌다네요. 장화에 깃든 마법 덕분이라나? 딱 1분이니까, 그동안 알아서 굴러다니세요."
    },
    5: {
        texture: "item_05",
        name: "알수없는 부적",
        price: 50,
        description: "이 부적이 뭔진 몰라도, 공격 스킬 쿨타임 3초 줄었으니까 그냥 이득 본 셈 치세요."
    },
    6: {
        texture: "item_06",
        name: "양자 모래시계",
        price: 50,
        description: "이 양자 모래시계 때문에 공격 스킬 쿨타임 3초 늘었으니까, 느긋하게 기다리시든가 알아서 하세요."
    },
    7: {
        texture: "item_07",
        name: "허리에 좋은 약초",
        price: 150,
        description: "허리에 약초 발랐다니까, 약초 마를 때까지 기다리세요. 30초 동안 구르기 금지라네요."
    },
    8: {
        texture: "item_08",
        name: "해적의 금고",
        price: 80,
        description: "해적의 금고를 열다니, 정신이 나갔군... 욕심 부리지 말고 있는 돈이나 잘 지키쇼"
    },
    9: {
        texture: "item_09",
        name: "고대의 묘약",
        price: 100,
        description: "물약 마시고 배탈 났다구요? 유통기한 2천 년 지났는데, 그 정도는 각오해야죠. 1분동안 이동속도 25% 감소요."
    },
    10: {
        texture: "item_10",
        name: "두꺼운 장갑",
        price: 70,
        description: "두꺼운 장갑 끼니까 무기가 잘 안 잡히신다구요? 뭐, 익숙해지세요. 공격력 25% 감소된 건 어쩔 수 없어요."
    },
    11: {
        texture: "item_11",
        name: "화살 10개",
        price: 50,
        description: "유비무환. 화살은 언제나 소중하죠."
    }
};

export default class StoreItem extends Phaser.Physics.Matter.Sprite{
    /**
     * @param {object} config - 아이템의 설정 정보
     * @param {Phaser.Scene} config.scene - 아이템이 속할 장면(Scene)
     * @param {number} config.x - 아이템의 x 좌표
     * @param {number} config.y - 아이템의 y 좌표
     * @param {string} config.itemKey - 아이템의 키
     */
    constructor(data) {
        let {scene, x, y, itemKey} = data;
        const itemConfig = itemData[itemKey];

        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 스프라이트를 생성
        super(scene.matter.world, x, y, itemConfig.texture, 0);
        this.scene = scene;
        this.name = itemConfig.name;
        this.description = itemConfig.description;
        this.price = itemConfig.price;
        this.canBuy = true; // 구매 가능 여부
        console.log(`아이템 생성 :`, this.name, this.price);

        // 화면에 렌더링 + 다른 게임 객체들과 상호작용 가능해짐
        scene.add.existing(this);

        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const itemCollider = Bodies.rectangle(this.x, this.y, 32, 32, { 
            isSensor: false,
            isStatic: true, 
            label: 'item',
            collisionFilter: {
                category: ITEM_CATEGORY,  // 아이템 카테고리 설정
                mask: PLAYER_CATEGORY     // 플레이어와만 충돌하도록 마스크 설정
            }
        });
        this.setExistingBody(itemCollider);

        this.canBuy = true;
        
        // 가격 텍스트
        this.priceText = scene.add.text(x, y + 20, `${this.price} G`, {
            fontSize: '10px',
            color: '#fff',
            align: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { left: 2, right: 2, top: 1, bottom: 1 },
        }).setOrigin(0.5, 0.5);

        // 이름 및 텍스트
        this.nameText = scene.add.text(x, y - 30, this.name, {
            fontSize: '14px',
            color: '#fff',
            align: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
            wordWrap: { width: 150 }
        }).setOrigin(0.5, 0.5).setVisible(false);

        // F 키 이미지 및 텍스트
        this.buyKeySprite = scene.add.sprite(x, y + 50, 'keyboard_letter_symbols', 21).setOrigin(0.5, 0.5).setVisible(false);
        this.buyText = scene.add.text(x + 20, y + 50, '구매', {
            fontSize: '14px',
            color: '#fff',
            align: 'center',
        }).setOrigin(0.5, 0.5).setVisible(false);
    }

    static preload(scene) {
        scene.load.image('item_01', 'assets/item/item_01.png');
        scene.load.image('item_02', 'assets/item/item_02.png');
        scene.load.image('item_03', 'assets/item/item_03.png');
        scene.load.image('item_04', 'assets/item/item_04.png');
        scene.load.image('item_05', 'assets/item/item_05.png');
        scene.load.image('item_06', 'assets/item/item_06.png');
        scene.load.image('item_07', 'assets/item/item_07.png');
        scene.load.image('item_08', 'assets/item/item_08.png');
        scene.load.image('item_09', 'assets/item/item_09.png');
        scene.load.image('item_10', 'assets/item/item_10.png');
        scene.load.image('item_11', 'assets/player/arrow_10.jpg')
    }

    updatePurchaseAvailability(playerCoins) {
        if (playerCoins >= this.price) {
            this.canBuy = true;
            this.priceText.setColor('#fff');
        } else {
            this.canBuy = false;
            this.priceText.setColor('#ff0000');
        }
    }

    // 아이템 정보 보여주기
    showItemInfo() {
        this.nameText.setVisible(true);
        if (this.canBuy) {
            this.buyKeySprite.setVisible(true);
            this.buyText.setVisible(true);
        }
    }

    // 아이템 정보 숨기기
    hideItemInfo() {
        this.nameText.setVisible(false);
        this.buyKeySprite.setVisible(false);
        this.buyText.setVisible(false);
    }

    // 아이템 구매 처리
    buyItem() {
        // 플레이어의 코인을 차감
        this.scene.player.status.coin -= this.price;
        this.scene.coinIndicatorText.setText(`Coins: ${this.scene.player.status.coin}`);
        console.log(`${this.name}을(를) ${this.price} G에 구매했습니다!`);

        // this.scene.itemArr에서 해당 아이템 삭제
        const itemIndex = this.scene.itemArr.indexOf(this);
        if (itemIndex > -1) {
            this.scene.itemArr.splice(itemIndex, 1);
        }

        // 텍스트와 이미지를 모두 제거
        this.priceText.destroy();
        this.nameText.destroy();
        this.buyKeySprite.destroy();
        this.buyText.destroy();

        // 해당 아이템 객체를 destroy
        this.destroy();
    }
}
