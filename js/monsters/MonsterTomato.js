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
            hp: 60,
            damage: 0.5, //플레이어의 기준 체력이 3이기 때문에, 0.5로 설정
            reach: 20,
            speed: 1,
            oneMove : 30,
            maxMove : 100,
            followDistance : 70,
            player: player
        });
    }

    takeDamage(amount) {
        console.log('takeDamage 실행됨');
        if (!this.hurt) {
            this.hp -= amount;
            console.log('monster HP', this.hp)
            if (this.hp > 0) {
                this.actionAmin('damage');
            } else {
                this.isAlive = false;
                this.hp = 0;
                this.anims.play('tomato_death');
            }
            this.hurt = true;
            if (this.hp > 0) {
                this.scene.time.delayedCall(1000, () => {
                    this.hurt = false;
                });
            } else {
                this.scene.time.delayedCall(1000, () => {
                    this.destroy();
                });
                return 'destroy';
            }
        }
    }
}