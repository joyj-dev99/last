import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterRatfolk extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'ratfolk',
            frame: 'ratfolk_berserker_sprite_sheet_0',
            monsterType: 'ratfolk',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -6,
            hp: 80,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 2.5,
            oneMove : 30,
            maxMove : 100,
            followDistance : 180,
            player: player
        });
    }
}