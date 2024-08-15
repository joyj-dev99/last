import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterAlchemist3 extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'alchemist',
            frame: 'alchemist_sprite_sheet_0',
            monsterType: 'alchemist',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -6,
            hp: 60,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove : 30,
            maxMove : 100,
            followDistance : 70,
            player: player
        });

        this.flag = '대기';
        this.count = 0;
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.on('animationcomplete', this.handleAnimationComplete, this);

    }

    update() {
        if(this.flag === '대기'){
           this.count++;
           console.log('대기');
           if(this.count == 500){
            this.flag = '변신시작';
           }
        }
        else if(this.flag === '변신시작'){
            this.flag = '변신중';
            this.monsterType = 'minotaur';
            this.변신();
            return;
        }
        else if(this.flag === '변신중'){
            return;
        }
        super.update();

    }

    handleAnimationComplete(animation) {
        this.flag = '완료';
        console.log('변신 완료');
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.off('animationcomplete', this.handleAnimationComplete, this);
    }

    변신(){
        console.log('변신');
        this.anims.play('transform__into__the__minotaur');
    }



}