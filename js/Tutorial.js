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
        this.scene = scene;

        this.boundaries = []; // 경계들을 저장할 배열
    }


    createBoundary(xArray) {
        xArray.forEach(x => {
            const boundary = this.scene.matter.add.rectangle(
                x,
                this.scene.scale.height / 2,
                10,
                this.scene.scale.height,
                {
                    isStatic: true, // 경계가 움직이지 않도록 설정
                    isSensor: false, // 실제로 충돌하는 객체로 만듦
                    collisionFilter: {
                        category: BOUNDARY_CATEGORY,
                        mask: PLAYER_CATEGORY
                    }
                }
            );
    
            // 경계를 저장 (x 좌표와 함께)
            this.boundaries.push({ x, boundary });
            
            // Matter 월드에 이 경계를 추가
            this.scene.matter.world.add(boundary);
        });
    }
    
    removeBoundary(x) {
        // x 좌표에 해당하는 경계를 찾음
        const index = this.boundaries.findIndex(b => b.x === x);
        
        if (index !== -1) {
            const { boundary } = this.boundaries[index];
            
            // Matter 월드에서 경계를 제거
            this.scene.matter.world.remove(boundary);
            
            // 배열에서 경계를 제거
            this.boundaries.splice(index, 1);

            // 물리엔진 갱신
            this.scene.matter.world.engine.world.bodies = this.scene.matter.world.engine.world.bodies.filter(body => body !== boundary);
        }
    }

    // 방향키 조작법 설명 시작
    startDirectionControlExplanation(scene, sensor_x, sensor_y){

        if(this.type === 'pc'){

           // 경계 3개 생성하기
            const boundaryPositions = [200, 340, 400]; // 경계의 x 좌표
            this.boundaryPositions = [...boundaryPositions]; // 초기화 및 복사
            this.createBoundary(boundaryPositions);

            console.log('방향키 조작방법 시작');
            
            // 키 입력을 위한 기본 커서 키 설정
            let cursors = scene.input.keyboard.createCursorKeys();
            // cursors.left
            
            let keyboard_up  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+10, sensor_y+130, 'keyboard_letter_symbols', 0);
            scene.add.existing(keyboard_up);  
            keyboard_up.setScale(2);

            let keyboard_down  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+10, sensor_y+165, 'keyboard_letter_symbols', 1);
            scene.add.existing(keyboard_down);  
            keyboard_down.setScale(2);

            let keyboard_left  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x-25, sensor_y+165, 'keyboard_letter_symbols', 2);
            scene.add.existing(keyboard_left);  
            keyboard_left.setScale(2);

            let keyboard_right  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x+45, sensor_y+165, 'keyboard_letter_symbols', 3);
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
                keyboard_up.setTexture('keyboard_letter_symbols', 0); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);

            // 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_down.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
                keyboard_down.setTexture('keyboard_letter_symbols', 1); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);

            // 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_left.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
                keyboard_left.setTexture('keyboard_letter_symbols', 2); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);

            // 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_right.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
                keyboard_right.setTexture('keyboard_letter_symbols', 3); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
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
                        
                        this.scene.isInDialogue = true;
                        this.player.stopMove();
                        this.dialog.showDialogModal([
                            {name : '맥스', portrait : 'MaxPotrait', message: 'z키를 연달아 2번 누르면 연속으로 공격할 수 있어.' }
                        ], () => {
                            this.scene.isInDialogue = false;
                        });

                    }else if(관련된값.anim_keys[0] === "z_key_double"){
                        console.log(관련된값.anim_keys[0] + " 누름");

                        this.player.handleSlash(); // 첫 번째 슬래쉬
                        // 두 번째 슬래쉬는 첫 번째 슬래쉬 후 일정 시간 후에 실행
                        setTimeout(() => {
                            this.player.handleSlash();
                        }, 200); // 200ms 지연 후 실행

                        this.scene.isInDialogue = true;
                        this.player.stopMove();
                        this.dialog.showDialogModal([
                            {name : '맥스', portrait : 'MaxPotrait', message: '검 공격은 3번까지 연속으로 공격이 가능해.' },
                            {name : '맥스', portrait : 'MaxPotrait', message: 'z키를 3번 연달아 눌러보자.' }
                        ], () => {
                            this.scene.isInDialogue = false;
                        });

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

                        this.scene.isInDialogue = true;
                        this.player.stopMove();
                        this.dialog.showDialogModal([
                            {name : '맥스', portrait : 'MaxPotrait', message: 'X키를 눌러서 활을 쏠 수 있어.' },
                            {name : '맥스', portrait : 'MaxPotrait', message: '소지하고 있는 화살의 갯수만큼만 쏠 수 있으니 잘 확인하자.' }
                        ], () => {
                            this.scene.isInDialogue = false;
                        });

                    }else if(관련된값.anim_keys[0] === "left_key" && 관련된값.anim_keys[1] === "shift_key"){
                        this.player.handleRoll(this.player.body.velocity);
                        // 현재 플레이어의 이동속도 전달
                    }
                    else if(관련된값.anim_keys[0] === "x_key"){
                        console.log("x_key 누름");
                        this.player.handleBow();

                        this.scene.isInDialogue = true;
                        this.player.stopMove();
                        this.dialog.showDialogModal([
                            {name : '맥스', portrait : 'MaxPotrait', message: 'C키를 눌러서 번개 마법을 쓸 수 있어' },
                            {name : '맥스', portrait : 'MaxPotrait', message: '마법은 한 번 쓰면, 다시 쓸 수 있게 되기까지 시간이 걸려.' }
                        ], () => {
                            this.scene.isInDialogue = false;
                        });

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

                    // 0.5초 후에 오른쪽 사인 생성 및 경계 제거
                    setTimeout(() => {
                        this.createRightSign(scene, this.player.x + 30, this.player.y - 30);
                        
                        // 현재 경계 제거
                        // 배열의 첫 번째 요소를 제거
                        let removeX = this.boundaryPositions.shift();
                        this.removeBoundary(removeX);
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
            this.pointer = scene.add.image(80, 135, 'pointer');
            scene.add.existing(this.pointer);  
            this.pointer.setScale(0.2);
            this.pointer.setRotation(Phaser.Math.DegToRad(180)); // 방향을 180도 회전
            this.pointer.setScrollFactor(0);

            // 새로운 그래픽스 객체 생성
            this.graphics = scene.add.graphics();
            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics.lineStyle(2, 0xffffff); // 두께 2, 흰색 테두리
            // 원 그리기 (x, y, 반지름)
            this.graphics.strokeCircle(80, 200, 39); // (200, 200) 위치에 반지름 50의 원
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


    startATKKeyControlExplanation(scene, sensor_x, sensor_y){

        console.log('z키 조작방법 시작');

        if(this.type === 'pc'){
        
            // 키 입력을 위한 기본 커서 키 설정
            let cursors = scene.input.keyboard.createCursorKeys();

            let keyboard_z  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x-50, sensor_y+130, 'keyboard_letter_symbols', 41);
            keyboard_z.setScale(2);
            scene.add.existing(keyboard_z);  
            this.keyboard_z = keyboard_z;

            let keyboard_x = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x, sensor_y+130, 'keyboard_letter_symbols', 39);
            keyboard_x.setScale(2);
            scene.add.existing(keyboard_x);  
            this.keyboard_x = keyboard_x;

            let keyboard_c = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x +30, sensor_y+130, 'keyboard_letter_symbols', 18);
            keyboard_c.setScale(2);
            scene.add.existing(keyboard_c);  
            this.keyboard_c = keyboard_c;

            this.키조작설명순서 = [SWORD1, SWORD2, SWORD3, BOW, SPELL];

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

            // z키 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_z.on('animationstop', function () {
                console.log('animation stop '); // 애니메이션 완료 이벤트가 발생했는지 확인
                keyboard_z.setTexture('keyboard_letter_symbols', 41); // 'yourOriginalTexture'는 원래 이미지의 키, 0은 첫 번째 프레임
            }, this);
        
            // x키 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_x.on('animationstop', function () {
                console.log('animation stop '); 
                keyboard_x.setTexture('keyboard_letter_symbols', 39); 
            }, this);

            // c키 애니메이션 완료 후 원래 이미지로 돌아가기
            keyboard_c.on('animationstop', function () {
                console.log('animation stop '); 
                keyboard_c.setTexture('keyboard_letter_symbols', 18); 
            }, this);

            let 관련된값 = this.관련된값반환(this.키조작설명순서[0] ,cursors);
            console.log('관련된 값 return 값 : ');
            console.dir(관련된값);
            for (let i = 0; i < 관련된값['anim_keyboards'].length; i++) {
                관련된값.anim_keyboards[i].play(관련된값.anim_keys[i]);
            }

        }
        else if(this.type === 'mobile'){

            let width = scene.sys.game.config.width;
            let height = scene.sys.game.config.height;

            // 손 표시, 원 표시
            // - 원형 표시, 손가락 가리키는 표시
            this.pointer = scene.add.image(390, 110, 'pointer');
            this.pointer.setDepth(1001);
            scene.add.existing(this.pointer);   
            this.pointer.setScale(0.2);
            this.pointer.setRotation(Phaser.Math.DegToRad(180)); // 방향을 180도 회전
            this.pointer.setScrollFactor(0);

            // 새로운 그래픽스 객체 생성
            this.graphics = scene.add.graphics();
            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics.lineStyle(2, 0xffffff); // 두께 2, 흰색 테두리
            // 원 그리기 (x, y, 반지름)
            // this.graphics.strokeCircle(372, 220, 33); // (200, 200) 위치에 반지름 50의 원
            this.graphics.strokeRect(width - 114, height - 125, 113, 120);
            this.graphics.setDepth(1001);
            // 카메라에 고정시키기
            this.graphics.setScrollFactor(0);

            // 새로운 그래픽스 객체 생성
            this.graphics2 = scene.add.graphics();
            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics2.lineStyle(2, 0xffffff); // 두께 2, 흰색 테두리
            // 원 그리기 (x, y, 반지름)
            // this.graphics.strokeCircle(372, 220, 33); // (200, 200) 위치에 반지름 50의 원
            // this.graphics.strokeRect(width - 114, height - 125, 113, 120);
            this.graphics2.strokeRect(width - 60, height - 63, 58, 58);

            this.graphics2.setDepth(1001);
            // 카메라에 고정시키기
            this.graphics2.setScrollFactor(0);
     

        }
    }

    endATKKeyControlExplanation(){
        console.log('공격키 조작방법 끝');

        if(this.keyboard_z){
            this.keyboard_z.destroy();
        }

        if(this.keyboard_x){
            this.keyboard_x.destroy();
        }

        if(this.keyboard_c){
            this.keyboard_c.destroy();
        }

        if(this.pointer){
            this.pointer.destroy();
        }
        if(this.graphics){
            this.graphics.destroy();
        }
        if(this.graphics2){
            this.graphics2.destroy();
        }
        

    }
    

    startshiftKeyControlExplanation(scene, sensor_x, sensor_y){
        console.log('shift키 조작방법 시작');

        if(this.type === 'pc'){

            // 키 입력을 위한 기본 커서 키 설정
            let cursors = scene.input.keyboard.createCursorKeys();

            // 왼쪽 키보드 스프라이트 생성
            let keyboard_left = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x - 25, sensor_y +130, 'keyboard_letter_symbols', 2);
            keyboard_left.setScale(2);
            scene.add.existing(keyboard_left);
            this.keyboard_left = keyboard_left;

            // shift 키보드 스프라이트 생성
            let keyboard_shift  = new Phaser.Physics.Matter.Sprite(scene.matter.world, sensor_x, sensor_y+130, 'keyboard_shift_key', 0);
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
                keyboard_left.setTexture('keyboard_letter_symbols', 2); // 원래 이미지로 돌아감
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

            let width = scene.sys.game.config.width;
            let height = scene.sys.game.config.height;

            // 손 표시, 원 표시
            // - 원형 표시, 손가락 가리키는 표시
            this.pointer = scene.add.image(420, height - 85, 'pointer');
            this.pointer.setDepth(1001);
            scene.add.existing(this.pointer);   
            this.pointer.setScale(0.2);
            this.pointer.setRotation(Phaser.Math.DegToRad(180)); // 방향을 180도 회전
            this.pointer.setScrollFactor(0);

            // 새로운 그래픽스 객체 생성
            this.graphics = scene.add.graphics();
            this.graphics.setDepth(1001);

            // 선의 스타일 설정 (두께, 색상 등)
            this.graphics.lineStyle(2, 0xffffff); // 두께 2, 흰색 테두리
            // 원 그리기 (x, y, 반지름)
            // this.graphics.strokeCircle(420, 220, 33); // (200, 200) 위치에 반지름 50의 원
            this.graphics.strokeRect(width - 60, height - 63, 58, 58);

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
