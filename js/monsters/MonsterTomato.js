import Monster from "./Monster.js";

export default class MonsterTomato extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;

        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'tomato',
            frame: 'tomato_idle_01',
            monsterType: 'tomato',
            bodyWidth: 14,
            bodyHeight: 14,
            centreX: 0,
            centreY: -6,
            hp: 100,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 2,
            oneMove : 30, 
            maxMove : 100,
            followDistance : 70,
            player: player
        });

    }

    takeDamage(amount) {
        console.log('takeDamage 실행됨');
        
    }

    itemDrop() {
    }
}