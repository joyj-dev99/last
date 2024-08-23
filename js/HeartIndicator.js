export default class HeartIndicator {

    static preload(scene) {
        scene.load.image('no_heart', 'assets/ui/no_heart.png');
        scene.load.image('helf_heart', 'assets/ui/helf_heart.png');
        scene.load.image('heart', 'assets/ui/heart.png');
    }

    constructor(scene) {
        this.heartArr = [];
        this.scene = scene;        
    }

    setHeart(nowHeart, maxHeart) {
        // 다 지우고
        this.heartArr.forEach((heart) => {
            heart.destroy();
        });

        // 0,1,2 패턴으로 차례로 image 설정
        const init_x = 20;
        const init_y = 36; 
        const maxCnt = 5;
     
        nowHeart = nowHeart*2;
        maxHeart = maxHeart * 2;

        maxHeart = Math.floor(maxHeart/2) + Math.floor(maxHeart % 2);

        // 반복문을 사용하여 num만큼 별 생성
        for (let i = 1; i <= maxHeart; i++) {
  
            let x = init_x + 16 * (Math.floor((i-1)%maxCnt));
            let y = init_y +  16 * (Math.floor((i-1)/maxCnt));

            let image_name;
            if(nowHeart >= i*2){
                image_name = 'heart';
            }
            else if(nowHeart == i*2-1 ){
                image_name = 'helf_heart';
            }
            else if(nowHeart < i*2-1 ){
                image_name = 'no_heart';
            }
            let heart = this.scene.add.image(x, y, image_name).setScale(0.5).setScrollFactor(0);

            this.heartArr.push(heart);
        }

    }

    setMaxHeart(num) {
    
        // let num = 6;

        let x = 10;
        let y = 10;
        let heart = this.add.image(x, y, 'no_heart');

        // 다 지우고
        // 갯수만큼 객체 생성
        // image 객체 차례로 만들기
        // 5개 이상 넘어가면 
        // 다음 줄에 만들기
        this.heartArr.push(heart);

    }

}