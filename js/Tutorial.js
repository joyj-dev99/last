import {PLAYER_CATEGORY, MONSTER_CATEGORY, TILE_CATEGORY, OBJECT_CATEGORY, PLAYER_ATTACK_CATEGORY, SENSOR_CATEGORY, BOUNDARY_CATEGORY} from "./constants.js";
const UP = 'up', DOWN = 'down', LEFT = 'left', RIGHT = 'right', 
        UPLEFT = 'up_left', UPRIGHT = 'up_right', 
        DOWNLEFT = 'down_left', DOWNRIGHT = 'down_right',
        SWORD1 = 'sword1', SWORD2 = 'sword2', SWORD3 = 'sword3',
        BOW = 'bow', SPELL = 'spell',
        LEFTSHIFT = 'left_shift';

const UP_ANIMS = 'up_key', DOWN_ANIMS = 'down_key', LEFT_ANIMS = 'left_key', RIGHT_ANIMS = 'right_key', 
        SWORD1_ANIMS = 'z_key', SWORD2_ANIMS = 'z_key_double', SWORD3_ANIMS = 'z_key_triple', 
        BOW_ANIMS = 'x_key', SPELL_ANIMS = 'c_key',
        SHIFT_ANIMS = 'shift_key';


        
export default class Tutorial{

    constructor(player, scene, dialog, type) {
        this.player = player;
        this.zKeyPressCount = 0; // z 키를 누른 횟수 추적
        this.zKeyLastTime = 0; // z 키를 마지막으로 누른 시간 추적
        this.zKeyMaxInterval = 300; // 연속 입력으로 인정되는 최대 시간 간격 (밀리초)

        // Z 키 입력 설정
        this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // X 키 입력 설정
        this.xKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        // C 키 입력 설정
        this.cKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        // shift 키 입력 설정
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        // 다이얼로그 가져오기
        this.dialog = dialog;

        this.type = type;
    }
    
    static preload(scene) {

        // 튜토리얼 keyboard 이미지 파일
        scene.load.spritesheet('keyboard', 'assets/tutorial/keyboard/Keyboard Letters and Symbols.png', { frameWidth: 16, frameHeight: 16 });
        scene.load.spritesheet('keyboard_shift_key', 'assets/tutorial/keyboard/shift_key.png', { frameWidth: 32, frameHeight: 16 });
        scene.load.image('pointer', 'assets/ui/finger_down.png');//52, { frameWidth: 32, frameHeight: 16 }

        scene.load.atlas('up_key', 'assets/tutorial/keyboard/up_key.png', 'assets/tutorial/keyboard/up_key_anim.json');
        scene.load.atlas('down_key', 'assets/tutorial/keyboard/down_key.png', 'assets/tutorial/keyboard/down_key_anim.json');
        scene.load.atlas('left_key', 'assets/tutorial/keyboard/left_key.png', 'assets/tutorial/keyboard/left_key_anim.json');
        scene.load.atlas('right_key', 'assets/tutorial/keyboard/right_key.png', 'assets/tutorial/keyboard/right_key_anim.json');
        scene.load.atlas('z_key', 'assets/tutorial/keyboard/z_key.png', 'assets/tutorial/keyboard/z_key_anim.json');
        scene.load.atlas('shift_key', 'assets/tutorial/keyboard/shift_key.png', 'assets/tutorial/keyboard/shift_key_anim.json');
        scene.load.image('right_sign', 'assets/tutorial/sign/right_sign-removebg-preview.png' );
        scene.load.atlas('x_key', 'assets/tutorial/keyboard/x_key.png', 'assets/tutorial/keyboard/x_key_atlas.json');
        scene.load.atlas('c_key', 'assets/tutorial/keyboard/c_key.png', 'assets/tutorial/keyboard/c_key_atlas.json');

    }

    // 방향키 조작법 설명 시작
    startDirectionControlExplanation(scene, sensor_x, sensor_y){



        console.log('방향키 조작방법 시작');
        if(this.type === 'pc'){

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

            // 키 입력을 위한 기본 커서 키 설정
            let cursors = scene.input.keyboard.createCursorKeys();
            // cursors.left
            
            let keyboard_up  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+10, sensor_y+130, 'keyboard', 0);
            scene.add.existing(keyboard_up);  
            keyboard_up.setScale(2);

            let keyboard_down  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+10, sensor_y+165, 'keyboard', 1);
            scene.add.existing(keyboard_down);  
            keyboard_down.setScale(2);

            let keyboard_left  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x-25, sensor_y+165, 'keyboard', 2);
            scene.add.existing(keyboard_left);  
            keyboard_left.setScale(2);

            let keyboard_right  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+45, sensor_y+165, 'keyboard', 3);
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
                keyboard_up.setTexture('keyboard', 0); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);

            // 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_down.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
                keyboard_down.setTexture('keyboard', 1); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);

            // 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_left.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
                keyboard_left.setTexture('keyboard', 2); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);

            // 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_right.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
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
                    
                        this.dialog.showDialogModal([
                            {name : '코드', portrait : 'ChordPotrait', message: 'z키를 연달아 2번 눌러보세요.' }
                        ]);

                    }else if(관련된값.anim_keys[0] === "z_key_double"){
                        console.log(관련된값.anim_keys[0] + " 누름");

                        this.player.handleSlash(); // 첫 번째 슬래쉬
                        // 두 번째 슬래쉬는 첫 번째 슬래쉬 후 일정 시간 후에 실행
                        setTimeout(() => {
                            this.player.handleSlash();
                        }, 200); // 200ms 지연 후 실행

                        this.dialog.showDialogModal([
                            {name : '코드', portrait : 'ChordPotrait', message: 'z키를 연달아 3번 눌러보세요.' }
                        ]);

                    }else if(관련된값.anim_keys[0] === "z_key_triple"){
                        console.log(관련된값.anim_keys[0] + " 누름");
                        this.player.handleSlash(); // 첫 번째 슬래쉬

                        // 두 번째 슬래쉬는 첫 번째 슬래쉬 후 일정 시간 후에 실행
                        setTimeout(() => {
                            this.player.handleSlash();
                        }, 200); // 200ms 지연 후 실행

                        // 세 번째 슬래쉬는 두 번째 슬래쉬 후 일정 시간 후에 실행
                        setTimeout(() => {
                            this.player.handleSlash();
                        }, 400); // 두 번째 슬래쉬 후 200ms 추가 지연 (총 400ms 후 실행)

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
        else if(this.type === 'mobile'){

            // 손 표시, 원 표시
            // - 원형 표시, 손가락 가리키는 표시
            this.pointer = scene.add.image(80, 140, 'pointer');
            scene.add.existing(this.pointer);  
            this.pointer.setScale(0.2);
            this.pointer.setRotation(Phaser.Math.DegToRad(180)); // 방향을 180도 회전
            this.pointer.setScrollFactor(0);

            // 새로운 그래픽스 객체 생성
            this.graphics = scene.add.graphics();
            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics.lineStyle(2, 0xffffff); // 두께 2, 흰색 테두리
            // 원 그리기 (x, y, 반지름)
            this.graphics.strokeCircle(80, 195, 40); // (200, 200) 위치에 반지름 50의 원
            // 카메라에 고정시키기
            this.graphics.setScrollFactor(0);

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
        else if(이동키조작설명값 == SWORD1){
            result = (this.zKeyPressCount === 1);

            anim_key = [SWORD1_ANIMS];
            anim_keyboard = [this.keyboard_z];
        }else if(이동키조작설명값 == SWORD2){
            result = (this.zKeyPressCount === 2);

            anim_key = [SWORD2_ANIMS];
            anim_keyboard = [this.keyboard_z];

        }else if(이동키조작설명값 == SWORD3){
            result = (this.zKeyPressCount === 3);

            anim_key = [SWORD3_ANIMS];
            anim_keyboard = [this.keyboard_z];

        }else if(이동키조작설명값 == BOW){
            if(Phaser.Input.Keyboard.JustDown(this.xKey)){
                result = true;
            }
            else{
                result = false;
            }
            anim_key = [BOW_ANIMS];
            anim_keyboard = [this.keyboard_x];
        }
        else if(이동키조작설명값 == SPELL){
            if(Phaser.Input.Keyboard.JustDown(this.cKey)){
                result = true;
            }
            else{
                result = false;
            }
            anim_key = [SPELL_ANIMS];
            anim_keyboard = [this.keyboard_c];
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

        if(this.pointer){
            this.pointer.destroy();
        }
        if(this.graphics){
            this.graphics.destroy();
        }

    }

    endzKeyControlExplanation(){
        console.log('z키 조작방법 끝');
        if(this.keyboard_z){
            this.keyboard_z.destroy();
        }
        
        if(this.pointer){
            this.pointer.destroy();
        }
        if(this.graphics){
            this.graphics.destroy();
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


    startzKeyControlExplanation(scene, sensor_x, sensor_y){
        console.log('z키 조작방법 시작');
        

        if(this.type === 'pc'){

            // 키 입력을 위한 기본 커서 키 설정
            let cursors = scene.input.keyboard.createCursorKeys();

            let keyboard_z  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x-30, sensor_y+130, 'keyboard', 41);
            keyboard_z.setScale(2);
            scene.add.existing(keyboard_z);  
            this.keyboard_z = keyboard_z;

            this.키조작설명순서 = [SWORD1, SWORD2, SWORD3];

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
            
            // z키 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_z.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
                keyboard_z.setTexture('keyboard', 41); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);
            

            let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
            console.log('관련된 값 return 값 : ');
            console.dir(관련된값);
            for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
                관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
            }
            

        }
        else if(this.type === 'mobile'){

            // 손 표시, 원 표시
            // - 원형 표시, 손가락 가리키는 표시
            this.pointer = scene.add.image(365, 160, 'pointer');
            scene.add.existing(this.pointer);   
            this.pointer.setScale(0.2);
            this.pointer.setRotation(Phaser.Math.DegToRad(180)); // 방향을 180도 회전
            this.pointer.setScrollFactor(0);

            // 새로운 그래픽스 객체 생성
            this.graphics = scene.add.graphics();
            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics.lineStyle(2, 0xffffff); // 두께 2, 흰색 테두리
            // 원 그리기 (x, y, 반지름)
            this.graphics.strokeCircle(365, 205, 25); // (200, 200) 위치에 반지름 50의 원
            // 카메라에 고정시키기
            this.graphics.setScrollFactor(0);

        }
        
    }

    endzKeyControlExplanation(){
        console.log('z키 조작방법 끝');
        if(this.keyboard_z){
            this.keyboard_z.destroy();
        }
        
        if(this.pointer){
            this.pointer.destroy();
        }
        if(this.graphics){
            this.graphics.destroy();
        }
    }

    /*
    * x키 조작방법 시작
    */
    startxKeyControlExplanation(scene, x, y){
        console.log('x키 조작방법 시작');
        
        // 키 입력을 위한 기본 커서 키 설정
        let cursors = scene.input.keyboard.createCursorKeys();

        let keyboard_x = new Phaser.Physics.Matter.Sprite(scene.matter.world, x, y, 'keyboard', 39);
        keyboard_x.setScale(2);
        scene.add.existing(keyboard_x);  
        this.keyboard_x = keyboard_x;

        this.키조작설명순서 = [BOW];
        
        // x키 애니메이션 제작
        scene.anims.create({
            key: 'x_key',
            frames: [
                { key: 'x_key', frame: 'x_key_0' }, 
                { key: 'x_key', frame: 'x_key_1' }  
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // x키 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_x.on('animationstop', function () {
            console.log('animation stop '); 
            keyboard_x.setTexture('keyboard', 39); 
        }, this);

        let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
        console.log('관련된 값 return 값 : ');
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
        }
        
    }

    /*
    * x키 조작방법 종료
    */
    endxKeyControlExplanation(){
        if(this.keyboard_x){
            this.keyboard_x.destroy();
        }
    }

    /*
    * c키 조작방법 시작
    */
    startcKeyControlExplanation(scene, x, y){
        console.log('c키 조작방법 시작');
        
        // 키 입력을 위한 기본 커서 키 설정
        let cursors = scene.input.keyboard.createCursorKeys();

        let keyboard_c = new Phaser.Physics.Matter.Sprite(scene.matter.world, x, y, 'keyboard', 18);
        keyboard_c.setScale(2);
        scene.add.existing(keyboard_c);  
        this.keyboard_c = keyboard_c;

        this.키조작설명순서 = [SPELL];
        
        // c키 애니메이션 제작
        scene.anims.create({
            key: 'c_key',
            frames: [
                { key: 'c_key', frame: 'c_key_0' }, 
                { key: 'c_key', frame: 'c_key_1' }  
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // c키 애니메이션 완료 후 원래 이미지로 돌아가기
        keyboard_c.on('animationstop', function () {
            console.log('animation stop '); 
            keyboard_c.setTexture('keyboard', 18); 
        }, this);

        let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
        console.log('관련된 값 return 값 : ');
        console.dir(관련된값);
        for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
            관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
        }
        
    }

    /*
    * c키 조작방법 종료
    */
    endcKeyControlExplanation(){
        if(this.keyboard_c){
            this.keyboard_c.destroy();
        }
            
        if(this.pointer){
            this.pointer.destroy();
        }
        if(this.graphics){
            this.graphics.destroy();
        }
        
    }


    startshiftKeyControlExplanation(scene, sensor_x, sensor_y){
        
        console.log('shift키 조작방법 시작');
                
        if(this.type === 'pc'){

            // 키 입력을 위한 기본 커서 키 설정
            let cursors = scene.input.keyboard.createCursorKeys();

            // 왼쪽 키보드 스프라이트 생성
            let keyboard_left = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x - 25, sensor_y +130, 'keyboard', 2);
            keyboard_left.setScale(2);
            scene.add.existing(keyboard_left);
            this.keyboard_left = keyboard_left;

            // shift 키보드 스프라이트 생성
            let keyboard_shift  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+25, sensor_y+130, 'keyboard_shift_key', 0);
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
                keyboard_shift.setTexture('keyboard_shift_key', 0); // 원래 이미지로 돌아감
            }, this);

            // 애니메이션 완료 후 원래 이미지로 돌아가기 (왼쪽 키)
            this.keyboard_left.on('animationstop', function () {
                console.log('left animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
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
        else if(this.type === 'mobile'){

            // 손 표시, 원 표시
            // - 원형 표시, 손가락 가리키는 표시
            this.pointer = scene.add.image(400, 160, 'pointer');
            scene.add.existing(this.pointer);   
            this.pointer.setScale(0.2);
            this.pointer.setRotation(Phaser.Math.DegToRad(180)); // 방향을 180도 회전
            this.pointer.setScrollFactor(0);

            // 새로운 그래픽스 객체 생성
            this.graphics = scene.add.graphics();
            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics.lineStyle(2, 0xffffff); // 두께 2, 흰색 테두리
            // 원 그리기 (x, y, 반지름)
            this.graphics.strokeCircle(400, 205, 25); // (200, 200) 위치에 반지름 50의 원
            // 카메라에 고정시키기
            this.graphics.setScrollFactor(0);

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

        
        if(this.pointer){
            this.pointer.destroy();
        }
        if(this.graphics){
            this.graphics.destroy();
        }
    }

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

    finish(scene){
        console.log('튜토리얼 finish');
        scene.input.keyboard.off('keydown', this.keyHandler);
        scene.input.keyboard.off('keyup', this.keyHandler);
    }

}