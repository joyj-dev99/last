import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY} from "../constants.js";

const { type } = window.gameConfig;


export default class Milestone extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y} = data;
        // Matter.js 물리를 사용하여 지정된 texture로 (x, y) 위치에 스프라이트를 생성
        super(scene.matter.world, x, y, 'milestone', 'milestone_0');

        this.scene = scene;
        // 화면에 렌더링 + 다른 게임 객체들과 상호작용 가능해짐
        scene.add.existing(this);

        // 물리적 바디 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //물리적 바디가 초기 시각적 스프라이트 위치와 일치
        const signCollider = Bodies.circle(this.x, this.y, 10, { 
            isSensor: false,
            isStatic: true, 
            label: 'milestone',
            collisionFilter: {
                category: OBJECT_CATEGORY, // 현재 객체 카테고리
                mask: PLAYER_CATEGORY | MONSTER_CATEGORY
            } 
        });
        this.setExistingBody(signCollider);
    }

    // 상호작용 가능 표시를 보여주는 메서드
    showInteractPrompt() {
        if (!this.interativeKeyImg) {
            let keyImg;
            // 텍스트 추가
            const interactText = this.scene.add.text(0, 15, '다음 맵', {
                fontFamily: 'NeoDunggeunmo',
                fontSize: '12px',
                fill: '#ffffff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
            }).setOrigin(0.5, 0.5);


            if(type === 'mobile'){
                keyImg = this.scene.add.sprite(interactText.x, interactText.y-15, 'nextBtnImage');
                // Make the sprite interactive

                keyImg.setInteractive();
                // Add a click event listener to the sprite
                keyImg.on('pointerdown', function (pointer) {
                    // 예시: zKey에 대해 keydown 이벤트를 수동으로 트리거하기
                    const shiftKeyDownEvent = new KeyboardEvent('keydown', {
                        key: 'Shift',
                        code: 'ShiftLeft',
                        keyCode: Phaser.Input.Keyboard.KeyCodes.E,
                        bubbles: true,
                        cancelable: true
                    });

                    window.dispatchEvent(shiftKeyDownEvent);
                }, this);


            }
            else  if(type === 'pc'){
                keyImg = this.scene.add.sprite(interactText.x, interactText.y-15, 'keyboard_letter_symbols', 20);
            }

            // 컨테이너 생성
            this.interativeKeyImg = this.scene.add.container(this.x, this.y - 50, [keyImg, interactText]);
            this.interativeKeyImg.setSize(keyImg.width, keyImg.height + interactText.height);
            this.interativeKeyImg.setInteractive();
            this.interativeKeyImg.setDepth(101);
           
        }


    }

    // 상호작용 가능 표시를 숨기는 메서드
    hideInteractPrompt() {
        if (this.interativeKeyImg) {
            this.interativeKeyImg.destroy();
            this.interativeKeyImg = null;
        }
    }
}