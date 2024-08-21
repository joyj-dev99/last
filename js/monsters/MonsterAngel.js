import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterAngel extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'angel',
            frame: 'angel_sprite_sheet_0',
            monsterType: 'angel',
            bodyWidth: 14,
            bodyHeight: 24,
            centreX: 0,
            centreY: -10,
            hp: 120,
            damage: 1, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 3,
            oneMove : 30,
            maxMove : 100,
            followDistance : 150,
            player: player
        });
        this.defaultHpY = 24;
    }
}