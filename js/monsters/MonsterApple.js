import Monster from "./Monster.js";
import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY} from "../constants.js";

export default class MonsterApple extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;
        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'apple',
            frame: 'apple_sprite_sheet_0',
            monsterType: 'apple',
            bodyWidth: 16,
            bodyHeight: 16,
            centreX: 0,
            centreY: -6,
            hp: 60,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 2,
            oneMove : 30,
            maxMove : 100,
            followDistance : 80,
            player: player
        });
    }
}