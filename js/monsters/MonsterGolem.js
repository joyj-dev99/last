import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterGolem extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'golem',
            frame: 'arcane_golem_tileset_0',
            monsterType: 'golem',
            bodyWidth: 50,
            bodyHeight: 62,
            centreX: 0,
            centreY: -18,
            hp: 200,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove : 30,
            maxMove : 100,
            followDistance : 250,
            player: player
        });

        this.defaultHpX = 26;
        this.defaultHpY = 50;
        this.healthBarWidth =52;

        this.scene.anims.create({
            key: 'myAnimation',
            frames: [
                { key: 'golem_beam', frame: 'energy_beam_sprite_sheet_0' },
                { key: 'golem_beam', frame: 'energy_beam_sprite_sheet_1' },
                { key: 'golem_beam', frame: 'energy_beam_sprite_sheet_2' }
            ],
            frameRate: 10, // 초당 10 프레임
            repeat: -1     // 무한 반복
        });

        // 스프라이트 생성 및 애니메이션 실행
        const sprite = this.scene.add.sprite(200, 200, 'myAtlas', 'energy_beam_sprite_sheet_0');
        sprite.setFlipX(true);
        sprite.play('myAnimation');

        // let bullet = this.scene.matter.add.image(this.x, this.y, 'golem_beam', 'energy_beam_sprite_sheet_2');


    }


}