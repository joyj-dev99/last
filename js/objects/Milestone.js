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

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        scene.load.atlas('milestone', 'assets/objects/milestone/milestone.png', 'assets/objects/milestone/milestone_atlas.json');
        scene.load.animation('milestoneAnim', 'assets/objects/milestone/milestone_anim.json');
        scene.load.spritesheet('keybordImg', 'assets/ui/Keyboard Letters and Symbols.png', { frameWidth: 16, frameHeight: 16 });
        scene.load.image('nextBtnImg', 'assets/ui/Blue_Buttons_Pixel.png');//52, { frameWidth: 32, frameHeight: 16 }
    }

    // 상호작용 가능 표시를 보여주는 메서드
    showInteractPrompt() {
        if (!this.interativeKeyImg) {

            if(type === 'mobile'){
                this.interativeKeyImg = this.scene.add.sprite(this.x, this.y - 15, 'nextBtnImg');//, 52
                // Make the sprite interactive
                this.interativeKeyImg.setInteractive();
                // Add a click event listener to the sprite
                this.interativeKeyImg.on('pointerdown', function (pointer) {
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
                this.interativeKeyImg = this.scene.add.sprite(this.x, this.y - 15, 'keybordImg', 20);
            }

            this.interativeKeyImg.setOrigin(0.5);
           
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