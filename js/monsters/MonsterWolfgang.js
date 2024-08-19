import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterWolfgang extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        console.log('MonsterWolfgang constructor');
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'wolfgang',
            frame: 'wolfgang_sprite_sheet_0',
            monsterType: 'wolfgang',
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

        this.healthBarBack = this.scene.add.graphics();
        this.healthBar = this.scene.add.graphics();
        // 초기 프레임 설정
        this.healthBar.setScrollFactor(0);
        this.healthBarBack.setScrollFactor(0);
        this.healthBar.setDepth(1001);
        this.healthBarBack.setDepth(1001);

        
    }


    update(){

        // super.update();
        //
        // this.healthBarBack.clear();
        // this.healthBar.clear();
        // this.healthBarBack.fillStyle(0x000000);
        // this.healthBarBack.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, 240, 15);
        // let healthWidth = (this.hp / this.initHp) * 240;
        // this.healthBar.fillStyle(0xff0000);
        // this.healthBar.fillRect(this.scene.sys.game.config.width / 4 - 10, 20, healthWidth, 15);

    }



}