import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY, SENSOR_CATEGORY, BOUNDARY_CATEGORY} from "./constants.js";
const UP = 'up', DOWN = 'down', LEFT = 'left', RIGHT = 'right', 
        UPLEFT = 'up_left', UPRIGHT = 'up_right', 
        DOWNLEFT = 'down_left', DOWNRIGHT = 'down_right',
        ATK1 = 'sword1', ATK2 = 'sword2', ATK3 = 'sword3', LEFTSHIFT = 'left_shift';

const UP_ANIMS = 'up_key', DOWN_ANIMS = 'down_key', LEFT_ANIMS = 'left_key', RIGHT_ANIMS = 'right_key', 
        ATK1_ANIMS = 'z_key', ATK2_ANIMS = 'z_key_double', ATK3_ANIMS = 'z_key_triple', SHIFT_ANIMS = 'shift_key';

export default class Tutorial{

    constructor(player, scene) {
        this.player = player;
        this.zKeyPressCount = 0; // z 키를 누른 횟수 추적
        this.zKeyLastTime = 0; // z 키를 마지막으로 누른 시간 추적
        this.zKeyMaxInterval = 300; // 연속 입력으로 인정되는 최대 시간 간격 (밀리초)

        // Z 키 입력 설정
        this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // shift 키 입력 설정
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    }
    
    static preload(scene) {

        // 튜토리얼 keyboard 이미지 파일
        scene.load.spritesheet('keyboard', 'assets/tutorial/keyboard/Keyboard Letters and Symbols.png', { frameWidth: 16, frameHeight: 16 });
        scene.load.spritesheet('keyboard_shift_key', 'assets/tutorial/keyboard/shift_key.png', { frameWidth: 32, frameHeight: 16 });

        scene.load.atlas('up_key', 'assets/tutorial/keyboard/up_key.png', 'assets/tutorial/keyboard/up_key_anim.json');
        scene.load.atlas('down_key', 'assets/tutorial/keyboard/down_key.png', 'assets/tutorial/keyboard/down_key_anim.json');
        scene.load.atlas('left_key', 'assets/tutorial/keyboard/left_key.png', 'assets/tutorial/keyboard/left_key_anim.json');
        scene.load.atlas('right_key', 'assets/tutorial/keyboard/right_key.png', 'assets/tutorial/keyboard/right_key_anim.json');
        scene.load.atlas('z_key', 'assets/tutorial/keyboard/z_key.png', 'assets/tutorial/keyboard/z_key_anim.json');
        scene.load.atlas('shift_key', 'assets/tutorial/keyboard/shift_key.png', 'assets/tutorial/keyboard/shift_key_anim.json');
        scene.load.image('right_sign', 'assets/tutorial/sign/right_sign-removebg-preview.png' );

    }

    // 방향키 조작법 설명 시작
    startDirectionControlExplanation(scene, sensor_x, sensor_y){

         // x = 200 에 고정된 보이지 않는 경계 생성
        this.boundary = scene.matter.add.rectangle(200, scene.scale.height / 2, 10, scene.scale.height, {
            isStatic: true, // 이 속성으로 경계가 움직이지 않도록 설정
            isSensor: false, // 센서가 아니라 실제로 충돌하는 객체로 만듦
            collisionFilter:{
                category: BOUNDARY_CATEGORY,
                mask: PLAYER_CATEGORY
            }
        });

        // Matter 월드에 이 경계를 추가
        scene.matter.world.add(this.boundary);

        console.log('방향키 조작방법 시작');
        
        
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

        this.키조작설명순서 = [RIGHT,UP,LEFT,DOWN,UPRIGHT,UPLEFT,DOWNLEFT,DOWNRIGHT];

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
            // console.log('Key pressed: down? ' + event.key); // 누른 키를 출력합니다.

            let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
            console.log("관련된값", 관련된값);
            if(관련된값.result === true){
                //  return {anim_keys : anim_key, anim_keyboards : anim_keyboard};
                for (let i = 0; i < 관련된값.anim_keyboards.length; i++) {
                    관련된값.anim_keyboards[i].stop();
                }

                if(관련된값.anim_keys[0] === "z_key"){
                    console.log(관련된값.anim_keys[0] + " 누름");
                    this.player.handleSlash(); // 첫 번째 슬래쉬

                }else if(관련된값.anim_keys[0] === "z_key_double"){
                    console.log(관련된값.anim_keys[0] + " 누름");

                    this.player.handleSlash(); // 첫 번째 슬래쉬
                    // 두 번째 슬래쉬는 첫 번째 슬래쉬 후 일정 시간 후에 실행
                    setTimeout(() => {
                        this.player.handleSlash();
                    }, 200); // 200ms 지연 후 실행

                }else if(관련된값.anim_keys[0] === "z_key_triple"){
                    console.log(관련된값.anim_keys[0] + " 누름");
                    this.player.handleSlash(); // 첫 번째 슬래쉬

                    // 두 번째 슬래쉬는 첫 번째 슬래쉬 후 일정 시간 후에 실행
                    setTimeout(() => {
                        this.player.handleSlash();
                    }, 300); // 300ms 지연 후 실행

                    // 세 번째 슬래쉬는 두 번째 슬래쉬 후 일정 시간 후에 실행
                    setTimeout(() => {
                        this.player.handleSlash();
                    }, 600); // 두 번째 슬래쉬 후 300ms 추가 지연 (총 600ms 후 실행)

                }else if(관련된값.anim_keys[0] === "left_key" && 관련된값.anim_keys[1] === "shift_key"){
                    this.player.handleRoll(this.player.body.velocity);
                    // 현재 플레이어의 이동속도 전달
                }
                else if(관련된값.anim_keys[0] === "x_key"){
                    console.log("x_key 누름");
                    this.player.handleBow();

                }else if(관련된값.anim_keys[0] === "c_key"){
                    console.log("c_key 누름");
                    this.player.handleSpell();
                }

                console.log('this.키조작설명순서[0] : '+this.키조작설명순서[0]);
                console.log('stop');
            }
            else{ 
                return;
            }


            this.키조작설명순서.splice(0, 1);
            if(this.키조작설명순서.length == 0){
                console.log('조작키 설명 완료');

               // 0.5초 후에 오른쪽 사인 생성
                setTimeout(() => {
                    this.createRightSign(scene, this.player.x + 30, this.player.y - 30);

                    // 경계를 제거하여 이동 허용
                    scene.matter.world.remove(this.boundary);

                    // 물리엔진 갱신
                    scene.matter.world.engine.world.bodies = scene.matter.world.engine.world.bodies.filter(body => body !== this.boundary);

                }, 1000);

            }
            else {                
                console.log('조작키 설명 남음');
                let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
                for (let i = 0; i < 관련된값.anim_keyboards.length; i++) {
                    console.log('anim_keys');

                    관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
                }
            }

        };

        scene.input.keyboard.on('keydown', this.keyHandler);
        scene.input.keyboard.on('keyup', this.keyHandler);

        let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
        }
        
    }

    // z키 누른 횟수 세는 메서드
    updateZKeyPressCount() {
        const currentTime = this.player.scene.time.now; // 현재 시간을 가져옴
        const zKeyJustDown = Phaser.Input.Keyboard.JustDown(this.zKey);

        if (zKeyJustDown) {
            if (currentTime - this.zKeyLastTime > this.zKeyMaxInterval) {
                // 일정 시간 이상 경과 시 카운트 초기화
                this.zKeyPressCount = 0;
            }
            this.zKeyPressCount++;
            this.zKeyLastTime = currentTime; // 마지막 입력 시간을 갱신
        }
    }

    관련된값반환(이동키조작설명값, cursors){

        this.updateZKeyPressCount(); // z 키 입력 업데이트

        let anim_key = [];
        let anim_keyboard = [];
        let result;

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
            result = (this.zKeyPressCount === 1);

            anim_key = [ATK1_ANIMS];
            anim_keyboard = [this.keyboard_z];
        }else if(이동키조작설명값 == ATK2){
            result = (this.zKeyPressCount === 2);

            anim_key = [ATK2_ANIMS];
            anim_keyboard = [this.keyboard_z];

        }else if(이동키조작설명값 == ATK3){
            result = (this.zKeyPressCount === 3);

            anim_key = [ATK3_ANIMS];
            anim_keyboard = [this.keyboard_z];
        }
        else if(이동키조작설명값 == LEFTSHIFT){
            // 왼쪽 방향키 + shift 키를 함께 누를시
            if((Phaser.Input.Keyboard.JustDown(this.shiftKey)) && cursors.left.isDown ){
                result = true;
            }
            else{
                result = false;
            }
            anim_key = [LEFT_ANIMS,SHIFT_ANIMS];
            anim_keyboard = [this.keyboard_left, this.keyboard_shift];
        }

        // 조건이 충족되면 카운트 초기화 (다음 콤보를 위해)
        if(result){
            this.zKeyPressCount = 0;
        }

        return {'result': result, 'anim_keys' : anim_key, 'anim_keyboards' : anim_keyboard};
    }

    // 방향키 조작법 설명 끝
    endDirectionControlExplanation(){
        console.log('방향키 조작방법 끝');
        // 메모리에서 완전히 제거
        if(this.keyboard_up){
            this.keyboard_up.destroy();
        }
        if(this.keyboard_down){
            this.keyboard_down.destroy();
        }
        if(this.keyboard_left){
            this.keyboard_left.destroy();
        }
        if(this.keyboard_right){
            this.keyboard_right.destroy();
        }
    }

    endzKeyControlExplanation(){
        console.log('z키 조작방법 끝');
        if(this.keyboard_z){
            this.keyboard_z.destroy();
        }
        
    }


    // 오른쪽으로 이동하는 sign 객체 만들기
    createRightSign(scene, x, y) {
        // 'right_sign' 이미지를 특정 x, y 좌표에 생성
        this.rightSign = scene.add.image(x, y, 'right_sign');

        // 필요한 경우 추가 설정 (예: 크기 조정, 회전 등)
        this.rightSign.setScale(0.1);  // 이미지를 크기 조정 (필요에 따라 값 조정)
        this.rightSign.setOrigin(0.5, 0.5); // 이미지의 중심을 기준으로 설정

        return this.rightSign;
    }

    // 오른쪽으로 이동하는 sign 객체 제거하기
    removeRightSign() {
        if (this.rightSign) { // rightSign이 존재하는지 확인
            this.rightSign.destroy(); // 게임 씬에서 객체 제거
            this.rightSign = null; // 참조 해제
        }
    }


    startZKeyControlExplanation(scene, sensor_x, sensor_y){
        console.log('z키 조작방법 시작');
        
        // 키 입력을 위한 기본 커서 키 설정
        let cursors = scene.input.keyboard.createCursorKeys();

        let keyboard_z  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+15, sensor_y+190, 'keyboard', 41);
        keyboard_z.setScale(2);
        scene.add.existing(keyboard_z);  

        this.keyboard_z = keyboard_z;
        this.키조작설명순서 = [ATK1, ATK2, ATK3];

        // z키 관련 애니메이션 제작
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

        scene.anims.create({
            key: 'z_key_double',
            frames: [
                { key: 'z_key', frame: "zkey.png" },
                { key: 'z_key', frame: "zkey2.png" },
                { key: 'z_key', frame: "zkey.png" }, // 첫 번째 클릭 후 다시 원래 상태로
                { key: 'z_key', frame: "zkey2.png" } // 두 번째 클릭
            ],
            frameRate: 12, // 더 빠르게 번갈아가며 재생되도록 설정
            repeat: -1 // 반복
        });
        
        scene.anims.create({
            key: 'z_key_triple',
            frames: [
                { key: 'z_key', frame: "zkey.png" },
                { key: 'z_key', frame: "zkey2.png" },  // 첫 번째 클릭
                { key: 'z_key', frame: "zkey.png" },   // 다시 원래 상태로
                { key: 'z_key', frame: "zkey2.png" },  // 두 번째 클릭
                { key: 'z_key', frame: "zkey.png" },   // 다시 원래 상태로
                { key: 'z_key', frame: "zkey2.png" }   // 세 번째 클릭
            ],
            frameRate: 16,  // 빠르게 3번의 클릭을 표현하기 위해 프레임 속도를 높임
            repeat: -1      // 반복 설정
        });
        

        // 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_z.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
            keyboard_z.setFrame(41); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미
            keyboard_z.setTexture('keyboard', 41); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
        }, this);
        

        let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
        console.log('관련된 값 return 값 : ');
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
        }
        
    }

    endzKeyControlExplanation(){
        console.log('z키 조작방법 끝');
        if(this.keyboard_z){
            this.keyboard_z.destroy();
        }
    }

    startshiftKeyControlExplanation(scene, sensor_x, sensor_y){
        console.log('shift키 조작방법 시작');
                
        // 키 입력을 위한 기본 커서 키 설정
        let cursors = scene.input.keyboard.createCursorKeys();

        // 왼쪽 키보드 스프라이트 생성
        let keyboard_left = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x - 25, sensor_y + 190, 'keyboard', 2);
        keyboard_left.setScale(2);
        scene.add.existing(keyboard_left);
        this.keyboard_left = keyboard_left;

        // shift 키보드 스프라이트 생성
        let keyboard_shift  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+25, sensor_y+190, 'keyboard_shift_key', 0);
        keyboard_shift.setScale(2);
        scene.add.existing(keyboard_shift); 
        this.keyboard_shift = keyboard_shift;

        this.키조작설명순서 = [LEFTSHIFT];

        scene.anims.create({
            key:'shift_key',
            frames : [{
                key:'shift_key',
                frame:"shift_key.png"
            }, {
                key:'shift_key',
                frame:"shift_key2.png"
            }],
            frameRate : 8,
            repeat : -1
        });


        // 애니메이션 완료 후 원래 이미지로 돌아가기 (Shift 키)
        this.keyboard_shift.on('animationstop', function () {
            console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
            keyboard_shift.setFrame(0); // '0'은 keyboard 텍스처에서의 첫 번째 프레임을 의미
            keyboard_shift.setTexture('keyboard_shift_key', 0); // 원래 이미지로 돌아감
        }, this);

        // 애니메이션 완료 후 원래 이미지로 돌아가기 (왼쪽 키)
        this.keyboard_left.on('animationstop', function () {
            console.log('left animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
            keyboard_left.setFrame(2); // 
            keyboard_left.setTexture('keyboard', 2); // 원래 이미지로 돌아감
        }, this);
        

        let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
            console.log(관련된값.anim_keyboards[i]);
            console.log(관련된값.anim_keys[i]);
        }
        
    }


    endshiftKeyControlExplanation(){
        console.log('left + shift키 조작방법 끝');
        if(this.keyboard_shift){
            this.keyboard_shift.destroy();
        }
        if(this.keyboard_left){
            this.keyboard_left.destroy();
        }
    }

    finish(scene){
        console.log('튜토리얼 finish');
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
        // 센서를 물리 세계에서 제거   
        // console.dir(scene.matter);
        // console.dir(scene.matter.world);
        // console.dir(sensor);
        scene.matter.world.remove(sensor);
        // 센서가 삭제되었음을 콘솔에 출력
        console.log('Sensor has been destroyed');
    }

}