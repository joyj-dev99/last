import {PLAYER_CATEGORY, ITEM_CATEGORY} from './constants.js';

export default class StoreItem extends Phaser.Physics.Matter.Sprite{
    /**
     * @param {object} config - 아이템의 설정 정보
     * @param {Phaser.Scene} config.scene - 아이템이 속할 장면(Scene)
     * @param {number} config.x - 아이템의 x 좌표
     * @param {number} config.y - 아이템의 y 좌표
     * @param {string} config.texture - 아이템의 이미지 텍스처 키
     * @param {string} config.name - 아이템의 이름
     * @param {string} config.description - 아이템에 대한 설명
     * @param {number} config.price - 아이템의 가격
     */
    constructor(data) {
        let {scene, x, y, texture, name, description, price} = data;
        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 스프라이트를 생성
        super(scene.matter.world, x, y, texture, 0);
        this.scene = scene;
        this.name = name;
        this.description = description;
        this.price = price;

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
        
        // 가격 텍스트
        this.priceText = scene.add.text(x, y + 15, `${price} G`, {
            fontSize: '10px',
            color: '#fff',
            align: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { left: 2, right: 2, top: 1, bottom: 1 },
        }).setOrigin(0.5, 0.5);

        // 이름 및 설명 텍스트
        this.nameText = scene.add.text(x, y - 50, name, {
            fontSize: '14px',
            color: '#fff',
            align: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
            wordWrap: { width: 150 }
        }).setOrigin(0.5, 0.5).setVisible(false);

        this.descriptionText = scene.add.text(x, y - 30, description, {
            fontSize: '12px',
            color: '#ddd',
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

        // F키 입력 감지
        scene.input.keyboard.on('keydown-F', () => {
            if (this.isPlayerNearby()) {
                this.buyItem();
            }
        });
    }

    static preload(scene) {
        scene.load.spritesheet('skillAndSpell', 'assets/item/Skills and Spells.png', { frameWidth: 32, frameHeight: 32 });
    }

    // 아이템 정보 보여주기
    showItemInfo() {
        this.nameText.setVisible(true);
        this.descriptionText.setVisible(true);
        this.buyKeySprite.setVisible(true);
        this.buyText.setVisible(true);
    }

    // 아이템 정보 숨기기
    hideItemInfo() {
        this.nameText.setVisible(false);
        this.descriptionText.setVisible(false);
        this.buyKeySprite.setVisible(false);
        this.buyText.setVisible(false);
    }

    // 플레이어가 아이템에 가까이 있는지 확인
    isPlayerNearby() {
        const player = this.scene.player;
        const distance = Phaser.Math.Distance.Between(player.x, player.y, this.sprite.x, this.sprite.y);
        return distance < 20; // 적당한 거리 설정 (필요시 조정 가능)
    }

    // 아이템 구매 처리
    buyItem() {
        // 여기서 플레이어의 골드를 차감하고, 아이템을 인벤토리에 추가하는 등의 작업을 할 수 있음
        console.log(`${this.name}을(를) ${this.price} G에 구매했습니다!`);
        // 예: this.scene.player.gold -= this.price;
    }
}
