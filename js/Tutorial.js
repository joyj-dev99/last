import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY, SENSOR_CATEGORY} from "./constants.js";

const UP = 'up', DOWN = 'down', LEFT = 'left', RIGHT = 'right', 
        UPLEFT = 'up_left', UPRIGHT = 'up_right', 
        DOWNLEFT = 'down_left', DOWNRIGHT = 'down_right',
        ATK1 = 'attack1', ATK3 = 'attack3', SHIFT = 'shift';

const UP_ANIMS = 'up_key', DOWN_ANIMS = 'down_key', LEFT_ANIMS = 'left_key', RIGHT_ANIMS = 'right_key', 
        ATK_ANIMS = 'z_key', SHIFT_ANIMS = 'shift_key_anim';

export default class Tutorial{

    constructor() {

    }
    
    static preload(scene) {

        // 튜토리얼 keyboard 이미지 파일
        scene.load.spritesheet('keyboard', 'assets/tutorial/keyboard/Keyboard Letters and Symbols.png', { frameWidth: 16, frameHeight: 16 });
        scene.load.spritesheet('shift_key', 'assets/tutorial/keyboard/shift_key.png', { frameWidth: 32, frameHeight: 16 });

        scene.load.atlas('up_key', 'assets/tutorial/keyboard/up_key.png', 'assets/tutorial/keyboard/up_key_anim.json');
        scene.load.atlas('down_key', 'assets/tutorial/keyboard/down_key.png', 'assets/tutorial/keyboard/down_key_anim.json');
        scene.load.atlas('left_key', 'assets/tutorial/keyboard/left_key.png', 'assets/tutorial/keyboard/left_key_anim.json');
        scene.load.atlas('right_key', 'assets/tutorial/keyboard/right_key.png', 'assets/tutorial/keyboard/right_key_anim.json');
        scene.load.atlas('z_key', 'assets/tutorial/keyboard/z_key.png', 'assets/tutorial/keyboard/z_key_anim.json');
        scene.load.atlas('shift_key_anim', 'assets/tutorial/keyboard/shift_key.png', 'assets/tutorial/keyboard/shift_key_anim.json');

    }

    // 방향키 조작법 설명 시작
    startDirectionControlExplanation(scene, sensor_x, sensor_y){
        
        // 키 입력을 위한 기본 커서 키 설정
        let cursors = scene.input.keyboard.createCursorKeys();
        // cursors.left
        
        let keyboard_up  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+10, sensor_y+155, 'keyboard', 0);
        scene.add.existing(keyboard_up);  
        keyboard_up.setScale(2);

        let keyboard_down  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+10, sensor_y+190, 'keyboard', 1);
        scene.add.existing(keyboard_down);  
        keyboard_down.setScale(2);

        let keyboard_left  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x-25, sensor_y+190, 'keyboard', 2);
        scene.add.existing(keyboard_left);  
        keyboard_left.setScale(2);

        let keyboard_right  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+45, sensor_y+190, 'keyboard', 3);
        scene.add.existing(keyboard_right);  
        keyboard_right.setScale(2);

    
        this.keyboard_up = keyboard_up;
        this.keyboard_down = keyboard_down;
        this.keyboard_left = keyboard_left;
        this.keyboard_right = keyboard_right;    

        this.이동키조작설명순서 = [UP,DOWN,LEFT,RIGHT,UPLEFT,UPRIGHT,DOWNLEFT,DOWNRIGHT];//,[UP,LEFT],[UP,RIGHT],[DOWN,LEFT],[DOWN,RIGHT]

        scene.anims.create({
            key:UP_ANIMS,
            frames : [{
                key:'up_key',
                frame:"up_key.png"
            }, {
                key:'up_key',
                frame:"up_key2.png"
            }],
            frameRate : 8,
            repeat : -1
        });

        scene.anims.create({
            key:DOWN_ANIMS,
            frames : [{
                key:'down_key',
                frame:"down_key.png"
            }, {
                key:'down_key',
                frame:"down_key2.png"
            }],
            frameRate : 8,
            repeat : -1
        });

        scene.anims.create({
            key:LEFT_ANIMS,
            frames : [{
                key:'left_key',
                frame:"left_key.png"
            }, {
                key:'left_key',
                frame:"left_key2.png"
            }],
            frameRate : 8,
            repeat : -1
        });

        scene.anims.create({
            key:RIGHT_ANIMS,
            frames : [{
                key:'right_key',
                frame:"right_key.png"
            }, {
                key:'right_key',
                frame:"right_key2.png"
            }],
            frameRate : 8,
            repeat : -1
        });

        // 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_up.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
            keyboard_up.setFrame(0); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미
            keyboard_up.setTexture('keyboard', 0); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
        }, this);

        // 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_down.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인

            keyboard_down.setFrame(1); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미
            keyboard_down.setTexture('keyboard', 1); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
        }, this);

        // 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_left.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인

            keyboard_left.setFrame(2); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미

            keyboard_left.setTexture('keyboard', 2); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
        }, this);

        // 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_right.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인

            keyboard_right.setFrame(3); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미

            keyboard_right.setTexture('keyboard', 3); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
        }, this);
        
        this.keyHandler = event => {
            // 이벤트 핸들러 로직
            // event는 키보드 이벤트 객체입니다.
            console.log('Key pressed: down? ' + event.key); // 누른 키를 출력합니다.

            let 관련된값 = this.관련된값반환(this.이동키조작설명순서[0] ,cursors);
            if(관련된값.result === true){
                //  return {anim_keys : anim_key, anim_keyboards : anim_keyboard};
                for (let i = 0; i < 관련된값.anim_keyboards.length; i++) {
                    관련된값.anim_keyboards[i].stop();
                }
                console.log('this.이동키조작설명순서[0] : '+this.이동키조작설명순서[0]);
                console.log('stop');
            }
            else{ 
                return;
            }


            this.이동키조작설명순서.splice(0, 1);
            if(this.이동키조작설명순서.length == 0){
                console.log('0');

                // this.endDirectionControlExplanation();
            }
            else {
                console.log('not 0');

                let 관련된값 = this.관련된값반환(this.이동키조작설명순서[0] ,cursors);
                for (let i = 0; i < 관련된값.anim_keyboards.length; i++) {
                    console.log('anim_keys');

                    관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
                }
            }

        };

        scene.input.keyboard.on('keydown', this.keyHandler);
        scene.input.keyboard.on('keyup', this.keyHandler);

        let 관련된값 = this.관련된값반환(this.이동키조작설명순서[0] ,cursors);
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
        }
        
    }

    관련된값반환(이동키조작설명값, cursors){

        let anim_key = [];
        let anim_keyboard = [];
        let result;

        if(이동키조작설명값 == ATK3){
            this.combo_count++;
        }
        else{
            this.combo_count = 0;
        }

        if(이동키조작설명값 == UP){
            if(!(cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            
            anim_key = [UP_ANIMS];
            anim_keyboard = [this.keyboard_up];
        }
        else if(이동키조작설명값 == DOWN){
            if(!(cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [DOWN_ANIMS];
            anim_keyboard = [this.keyboard_down];
        }
        else if(이동키조작설명값 == LEFT){
            if(!(cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown && !cursors.right.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [LEFT_ANIMS];
            anim_keyboard = [this.keyboard_left];
        }
        else if(이동키조작설명값 == RIGHT){
            if(!(cursors.right.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.up.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [RIGHT_ANIMS];
            anim_keyboard = [this.keyboard_right];
        }
        else if(이동키조작설명값 == UPLEFT){
            if(!(!cursors.right.isDown && !cursors.down.isDown && cursors.left.isDown && cursors.up.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [UP_ANIMS,LEFT_ANIMS];
            anim_keyboard = [this.keyboard_up,this.keyboard_left];
        }
        else if(이동키조작설명값 == UPRIGHT){
            if(!(cursors.right.isDown && !cursors.down.isDown && !cursors.left.isDown && cursors.up.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [UP_ANIMS,RIGHT_ANIMS];
            anim_keyboard = [this.keyboard_up, this.keyboard_right];
        }
        else if(이동키조작설명값 == DOWNLEFT){
            if(!(!cursors.right.isDown && cursors.down.isDown && cursors.left.isDown && !cursors.up.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [DOWN_ANIMS,LEFT_ANIMS];
            anim_keyboard = [this.keyboard_down, this.keyboard_left];
        }
        else if(이동키조작설명값 == DOWNRIGHT){
            if(!(cursors.right.isDown && cursors.down.isDown && !cursors.left.isDown && !cursors.up.isDown)){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [DOWN_ANIMS,RIGHT_ANIMS];
            anim_keyboard = [this.keyboard_down, this.keyboard_right];
        }
        else if(이동키조작설명값 == ATK1){
            if(!(Phaser.Input.Keyboard.JustDown(this.zKey))){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [ATK_ANIMS];
            anim_keyboard = [this.keyboard_z];
        }
        else if(이동키조작설명값 == ATK3){
            if(Phaser.Input.Keyboard.JustDown(this.zKey) && this.combo_count >= 6){
                console.log('atk3 true');
                result = true;

            }
            else{
                console.log('atk3 false');
                result = false;
            }
            anim_key = [ATK_ANIMS];
            anim_keyboard = [this.keyboard_z];
        }
        else if(이동키조작설명값 == SHIFT){
            if(!(Phaser.Input.Keyboard.JustDown(this.shiftKey))){
                result = false;
            }
            else{
                result = true;
            }
            anim_key = [SHIFT_ANIMS];
            anim_keyboard = [this.keyboard_shift];
        }
        
        console.log('this.combo_count : '+this.combo_count);

        return {'result': result, 'anim_keys' : anim_key, 'anim_keyboards' : anim_keyboard};
    }

    // 방향키 조작법 설명 끝
    endDirectionControlExplanation(){
        // 메모리에서 완전히 제거
        this.keyboard_up.destroy();
        this.keyboard_down.destroy();
        this.keyboard_left.destroy();
        this.keyboard_right.destroy();

        // // 나중에 이벤트 리스너를 제거합니다.
        // scene.input.keyboard.off('keydown', this.keyHandler);

        // // 나중에 이벤트 리스너를 제거합니다.
        // scene.input.keyboard.off('keyup', this.keyHandler);
    }

    startZKeyControlExplanation(scene, sensor_x, sensor_y){
        
        // 키 입력을 위한 기본 커서 키 설정
        let cursors = scene.input.keyboard.createCursorKeys();
        // Z 키 입력 설정
        this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.combo_count = 0;

        let keyboard_z  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+15, sensor_y+190, 'keyboard', 41);
        keyboard_z.setScale(2);
        scene.add.existing(keyboard_z);  

        this.keyboard_z = keyboard_z;
        // const ATK1 = {
        //     keyboard : keyboard_z,
        //     anim_key : 'z_key'
        // };

        // const ATK3 = {
        //     keyboard : keyboard_z,
        //     anim_key : 'z_key'
        // };

        this.이동키조작설명순서 = [ATK1,ATK3];

        scene.anims.create({
            key:'z_key',
            frames : [{
                key:'z_key',
                frame:"zkey.png"
            }, {
                key:'z_key',
                frame:"zkey2.png"
            }],
            frameRate : 8,
            repeat : -1
        });

        // 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_z.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
            keyboard_z.setFrame(41); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미
            keyboard_z.setTexture('keyboard', 41); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
        }, this);
        

        let 관련된값 = this.관련된값반환(this.이동키조작설명순서[0] ,cursors);
        console.log('관련된 값 return 값 : ');
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
        }
        
    }

    endzKeyControlExplanation(){
        this.keyboard_z.destroy();
    }

    startshiftKeyControlExplanation(scene, sensor_x, sensor_y){
        
                
        // 키 입력을 위한 기본 커서 키 설정
        let cursors = scene.input.keyboard.createCursorKeys();
        // Z 키 입력 설정
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);


        let keyboard_shift  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+25, sensor_y+190, 'shift_key', 0);
        keyboard_shift.setScale(2);
        scene.add.existing(keyboard_shift); 

        this.keyboard_shift = keyboard_shift;
        this.이동키조작설명순서 = [SHIFT];

        scene.anims.create({
            key:'shift_key_anim',
            frames : [{
                key:'shift_key_anim',
                frame:"shift_key.png"
            }, {
                key:'shift_key_anim',
                frame:"shift_key2.png"
            }],
            frameRate : 8,
            repeat : -1
        });


        // 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_shift.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
            keyboard_shift.setFrame(0); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미
            keyboard_shift.setTexture('shift_key_anim', 0); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
        }, this);
        

        let 관련된값 = this.관련된값반환(this.이동키조작설명순서[0] ,cursors);
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
        }
        
    }


    endshiftKeyControlExplanation(){
        this.keyboard_shift.destroy();
    }

    finish(scene){
        // 나중에 이벤트 리스너를 제거합니다.
        scene.input.keyboard.off('keydown', this.keyHandler);
        // 나중에 이벤트 리스너를 제거합니다.
        scene.input.keyboard.off('keyup', this.keyHandler);
    }

    // player, 
    // 튜토리얼 클래스 만들어서 빼기
    createSensor(scene, sensor_x, sensor_y, width, height){
     
        // 센서 1 : 충돌시 이동 조작키 이미지, text 보여주는 센서
        let sensor = scene.matter.add.rectangle(sensor_x, sensor_y, width, height, {
            isSensor: true, // 센서로 설정
            isStatic: true,  // 센서는 물리 반응이 필요 없음
            collisionFilter: {
                category: SENSOR_CATEGORY,
                mask: PLAYER_CATEGORY // 플레이어만 충돌하도록 설정
            }
        });

       return sensor;

    }

    onSensorHit(scene, sensor) {
        console.log('Player has reached the target sensor at x: 200, y: 150');
        // 센서를 물리 세계에서 제거
        console.dir(scene.matter);
        console.dir(scene.matter.world);
        console.dir(sensor);
        scene.matter.world.remove(sensor);
        // 센서가 삭제되었음을 콘솔에 출력
        console.log('Sensor has been destroyed');
    }

}