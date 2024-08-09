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
        if (!this.hurt) {
            this.hp -= amount;
            console.log('monster HP', this.hp)
            if (this.hp > 0) {
                this.state = 'damage';
            } else {
                this.isAlive = false;
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
                // 몬스터 현재 위치 가져오기
                // 몬스터 객체 삭제 후 아이템 객체 생성하기 위해 미리 x,y 받아두기
                const x = this.x;
                const y = this.y;

                const randomValue = Math.random();
                if(randomValue <= 0.2){
                    console.log("토마토 시체 아이템 생성");
                    // new Item(this.scene, this.x, this.y, 'item', 3, this.player, 'tomato');
                }else{
                    console.log("coin 아이템 생성");
                    // new Item(this.scene, this.x, this.y, 'coin', null, this.player, 'coin');
                }

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