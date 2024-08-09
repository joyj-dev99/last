import Monster from "./Monster.js";

export default class MonsterEggplant extends Monster {
    constructor(data) {
        let {scene, x, y, player} = data;

        super({
            scene: scene,
            x: x,
            y: y,
            texture: 'eggplant',
            frame: 'eggplant_idle_01',
            monsterType: 'eggplant',
            bodyWidth: 16,
            bodyHeight: 16,
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

    takeDamage() {
        console.log("몬스터 데미지 받음");
    }

    takeDamage(distance, amount) {
        if (distance < 40 && !this.hurt) {
            this.hp -= amount;
            console.log('monster HP', this.hp)
            if (this.hp > 0) {
                this.state = 'damage';
            } else {
                this.state = 'death';
                this.hp = 0;
                this.anims.play('tomato_death');
                this.isAction = true;
            }
            this.hurt = true;
            if (this.hp > 0) {
                this.scene.time.delayedCall(1000, () => {
                    this.hurt = false;
                    this.state = 'attack';
                });
            } else {
                this.scene.time.delayedCall(2000, () => {
                    this.destroy();
                });
                return 'destroy';
            }
        }
    }

    itemDrop() {
    }
}