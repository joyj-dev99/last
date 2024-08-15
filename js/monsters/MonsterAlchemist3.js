import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterAlchemist3 extends Monster {

    constructor(data) {
        let {scene, x, y, player} = data;
        
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'minotaur',
            frame: 'minotaur_sprite_sheet_0',//alchemist
            monsterType: 'minotaur',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -6,
            hp: 250,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove : 30,
            maxMove : 100,
            followDistance : 70,
            player: player
        });

        this.initHp = 250;

        this.flag = '대기';
        
        this.healthBarBack = this.scene.add.graphics();
        this.healthBar = this.scene.add.graphics();
        // 초기 프레임 설정
        this.healthBar.setScrollFactor(0);
        this.healthBarBack.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBarBack.setDepth(1001);
        this.monsterType = 'alchemist';
    }

    update() {

        if(this.flag === '변신중'){
            return;
        }
        else if (this.flag === '대기' && this.initHp / 2 >= this.hp) {
            this.flag = '변신중';
            this.monsterType = 'minotaur';
            // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
            this.on('animationcomplete', this.handleAnimationComplete2, this);

            this.anims.play('transform__into__the__minotaur');
            return;
        }

        // console.log('update monster minotaur start' );
        super.update();
        // console.log('update monster minotaur end' );

        //몬스터가 죽었으면 update 실행하지 않음
        if (!this.isAlive) return;

        this.healthBarBack.clear();
        this.healthBar.clear();
        this.healthBarBack.fillStyle(0x000000);
        this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, 240, 15);
        let healthWidth = (this.hp / this.initHp) * 240;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, healthWidth, 15);

    }

    attack() {
        // this.setStatic(true);
        // this.moveEvent.destroy();
// 
        if(this.monsterType == 'minotaur'){
            if (this.initHp / 2 >= this.hp) {
                this.anims.play(`${this.monsterType}_attack1`);
            } else {
                this.anims.play(`${this.monsterType}_attack2`);
            }
        }
        if(this.monsterType == 'alchemist'){
            this.anims.play(`${this.monsterType}_throw_flask`);

        //     if (this.initHp / 2 >= this.hp) {
        //         this.anims.play(`${this.monsterType}_thriw_flask`);
        //     } 
        //     else {
        //         this.anims.play(`${this.monsterType}_attack2`);
        //     }
        }
    }


    startBattle() {
        super.startBattle();
        this.moveEvent = this.scene.time.addEvent({
            delay: 2000, // 2초마다
            callback: this.prepareMove,
            callbackScope: this,
            loop: true
        });
        this.isBattleStared = true;
    }



    handleAnimationComplete2(animation) {
        this.flag = '완료';
        console.log('변신 완료');

        if (animation.key === 'transform__into__the__minotaur') {
            this.isHurt = false;
            // this.anims.play(`${this.monsterType}_idle`, true);
            this.anims.play(`${this.monsterType}_attack1`, true);

        }
        // this.startBattle();
        startBattle();
        // 이 리스너는 특정 애니메이션이 끝날 때 자동으로 호출됨
        this.off('animationcomplete', this.handleAnimationComplete2, this);

    }

    handleAnimationComplete(animation) {

        super.handleAnimationComplete(animation);
        if (animation.key === `${this.monsterType}_damage`) {
            this.isHurt = false;
            this.anims.play(`${this.monsterType}_idle`, true);
        } else if (animation.key === `${this.monsterType}_attack1`)  {
            this.anims.play(`${this.monsterType}_idle`, true);
        } 



    }


    actionAmin(state) {    
        console.log('actionAmin(state) : '+state);

        super.actionAmin(state);

        this.state = state;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        if (state === 'attack') {                                                                             
            // 몬스터를 일시적으로 정적으로 설정하여 충돌 순간에 제자리에 있도록 함
            this.anims.play(`${this.monsterType}_attack1`, true);
            this.setStatic(true);
            // 일정 시간 후 몬스터를 다시 움직일 수 있도록 설정
            this.scene.time.delayedCall(500, () => {
                this.setStatic(false);
            });
        }
        
    }



}