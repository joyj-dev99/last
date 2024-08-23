import Item from "./Item.js";
import Tutorial from "./Tutorial.js";

const { type } = window.gameConfig;

export default class StageManager {
    constructor(scene, player, chord, dialog, skipTutorial) {
        this.scene = scene;
        this.player = player;
        this.chord = chord;
        this.dialog = dialog;
        this.skipTutorial = skipTutorial;
    }

    static preload(scene){
        scene.load.audio("forest_default", "assets/suno/battle_1.wav");
        scene.load.audio("forest_boss", "assets/audio/background/forest/forest_boss.mp3");
        scene.load.audio("dungeon_default", "assets/audio/background/dungeon/dungeon_default.mp3");
        scene.load.audio("dungeon_boss", "assets/audio/background/dungeon/dungeon_boss.mp3");
        scene.load.audio("room_default", "assets/audio/background/room/room_default.mp3");
        scene.load.audio("room_boss", "assets/audio/background/room/room_boss.mp3");
    }

    /**
    * @param {string} bgmKey - 배경음악 키값
    */
    setBGM(bgmKey) {
        // Play background music
        this.scene.backgroundMusic = this.scene.sound.add(bgmKey, {
            volume: window.gameConfig.bgVolume, // Set the volume (0 to 1)
            loop: true // Enable looping if desired
        });
    }

    setStageStart(stageNumber, partNumber, mapNumber, type) {
        if (stageNumber == 1 && mapNumber == 0) {

            if (this.skipTutorial) {
                // 튜토리얼을 건너뛰고 전투 바로 시작
                this.setBGM('forest_default');
                this.startBattleSequence();
            } else {
                // 튜토리얼 시작
                this.startTutorial(type);
            }

        } else {
            let dialogueMessages;
            if (stageNumber == 1 && partNumber == 1) {
                this.setBGM('forest_default');
                this.scene.isInDialogue = true;
                dialogueMessages = [
                    {name : '맥스', portrait : 'MaxPotrait', message : '가자. 에덴으로.'},
                ];
            } else if (stageNumber == 1 && partNumber < 4) {
                this.setBGM('forest_default');
                dialogueMessages = null;
            } else if (stageNumber == 1 && partNumber == 4) {
                this.setBGM('forest_boss');
                dialogueMessages = null;
            } else if (stageNumber == 2 && partNumber < 4) {
                this.setBGM('dungeon_default');
                dialogueMessages = null;
            } else if (stageNumber == 2 && partNumber == 4) {
                this.setBGM('dungeon_boss');
                dialogueMessages = null;
            } 
            else if (stageNumber == 3 && partNumber < 4) {
                this.setBGM('room_default');
                // 대화
                dialogueMessages = null;
            }
            else if (stageNumber == 3 && partNumber == 4) {
                this.setBGM('room_boss');
                this.scene.isInDialogue = true;
                dialogueMessages = [
                    {name : '볼프강', portrait : 'WolfgangPotrait', message : '오, 맥스. 드디어 왔구나.'},
                    {name : '볼프강', portrait : 'WolfgangPotrait', message : '쥐새끼처럼 내 연구소를 들쑤시고 다녔다지?'},
                    {name : '맥스', portrait : 'MaxPotrait', message : '볼프강! 가만두지 않겠다!'},
                ];
            }
            if (dialogueMessages != null) {
                // 메시지 표시가 끝난 후 콜백 처리
                this.dialog.showDialogModal(dialogueMessages, () => {
                    this.startBattleSequence();
                });
                if(type == 'pc'){
                    this.dialog.addInstructions('space');
                }
                else if(type == 'mobile'){
                    this.dialog.addInstructions('next');
                }
            } else {
                this.startBattleSequence();
            }
        }
    }

    startTutorial(type){
        let tutorial = new Tutorial(this.player, this.scene, this.dialog , type);
            this.setBGM('forest_default');
            // 첫번째는 센서 없이 바로 시작
            this.scene.isInDialogue = true;
            let dialog_msg = '';

            if(type === 'pc'){
                dialog_msg = '방향키를 눌러보세요!';
            }
            else if(type === 'mobile'){
                dialog_msg = '이동 조작기를 사용해 8방향으로 자유롭게 움직여 보세요!';
            }

            const dialogueMessages = [
                {name : '코드', portrait : 'ChordPotrait', message : '모험을 떠나기 전에 몇가지 알려드릴게요.'},
                {name : '코드', portrait : 'ChordPotrait', message : dialog_msg},
            ];
            // // Dialog를 사용해 대화 표시, 대화 종료 후 콜백 전달
            // this.dialog.showDialogModal(dialogueMessages, () => {
            
            // });
            

            // 메시지 표시가 끝난 후 콜백 처리
              this.dialog.showDialogModal(dialogueMessages, () => {
                
                // this.startBattleSequence();
                this.scene.isInDialogue = false;
                // pc 튜토리얼
                tutorial.startDirectionControlExplanation(this.scene, 250, this.player.y - 160, this.player);
            });
            if(type == 'pc'){
                this.dialog.addInstructions('space');
            }
            else if(type == 'mobile'){
                this.dialog.addInstructions('next');
            }


            let sensor2 = tutorial.createSensor(this.scene, 280, this.player.y - 160, 10, 500);
            // 충돌시 이동키 설명관련 데이터 삭제
            // shift, z 한번, z 세번

            // shift를 눌러보세요!
            // z key를 눌러보세요!
            // z key를 연속 3번 눌러보세요!
            const unsubscribe2 = this.scene.matterCollision.addOnCollideStart({
                objectA: this.player,
                objectB: sensor2,
                callback: eventData => {
                    const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                    console.log("플레이어와 센서2 충돌");
                    this.scene.isInDialogue = true;
                    this.player.stopMove();
                    // 센서 제거
                    tutorial.onSensorHit(this.scene, bodyB);
                    // 오른쪽 사인 제거
                    tutorial.removeRightSign();
                    // 이동키 조작 설명 끝
                    tutorial.endDirectionControlExplanation();

                    if(type === 'pc'){
                        dialog_msg = 'z 키를 눌러보세요!';
                    }
                    else if(type === 'mobile'){
                        dialog_msg = '공격 버튼을 눌러보세요!';
                        // 공격 버튼을 연속으로 눌러 빠르게 검을 최대 3번까지 휘둘러 보세요. 3번의 연속 공격이 가능합니다!
                    }
        
                    const dialogueMessages = [
                        {name : '코드', portrait : 'ChordPotrait', message : dialog_msg},
                    ];
                    this.dialog.showDialogModal(dialogueMessages, () => {
                        this.scene.isInDialogue = false;
                        // 공격키 설명 시작
                        tutorial.startATKKeyControlExplanation(this.scene, this.player.x +50, this.player.y - 160);
                    });
    
                    // 충돌 이벤트 제거
                    unsubscribe2();
                }
            });


            let sensor3 = tutorial.createSensor(this.scene, 380, this.player.y - 160, 10, 500);
            // 충돌시 이동키 설명관련 데이터 삭제
            const unsubscribe3 = this.scene.matterCollision.addOnCollideStart({
                objectA: this.player,
                objectB: sensor3,
                callback: eventData => {
                    const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                    console.log("플레이어와 센서3 충돌");
                    this.scene.isInDialogue = true;
                    this.player.stopMove();
                    // 센서 제거
                    tutorial.onSensorHit(this.scene, bodyB);
                    // 오른쪽 사인 제거
                    tutorial.removeRightSign();
                    // z키 조작 설명 끝
                    tutorial.endATKKeyControlExplanation();

                    if(type === 'pc'){
                        dialog_msg = '방향키와 함께 shift 키를 누르면 구를 수 있어요!';
                    }
                    else if(type === 'mobile'){
                        dialog_msg = '이동조작기와 함께 구르기 버튼을 누르면 구를 수 있어요!';
                    }
        

                    const dialogueMessages = [
                        {name : '코드', portrait : 'ChordPotrait', message : dialog_msg},
                        {name : '코드', portrait : 'ChordPotrait', message : '공격을 피해야 할 때, 구르기를 사용해보세요.'},
                    ];
                    // 메시지 표시가 끝난 후 콜백 처리
                    this.dialog.showDialogModal(dialogueMessages, () => {
                        this.scene.isInDialogue = false;
                        // shift 키 설명 시작
                        tutorial.startshiftKeyControlExplanation(this.scene, this.player.x +50, this.player.y - 160);
                    });
                    // 충돌 이벤트 제거
                    unsubscribe3();
                }
            });

            
            let sensor4 = tutorial.createSensor(this.scene, 600, this.player.y - 160, 10, 500);
            // 충돌시 이동키 설명관련 데이터 삭제
            const unsubscribe4 = this.scene.matterCollision.addOnCollideStart({
                objectA: this.player,
                objectB: sensor4,
                callback: eventData => {
                    const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                    console.log("플레이어와 센서4 충돌");
                    this.scene.isInDialogue = true;
                    this.player.stopMove();
                    // 센서 제거
                    tutorial.onSensorHit(this.scene, bodyB);
                    // 오른쪽 사인 제거
                    tutorial.removeRightSign();
                    tutorial.endshiftKeyControlExplanation();
                    tutorial.finish(this.scene);

                    const dialogueMessages = [
                        {name : '맥스', portrait : 'MaxPotrait', message : '토마토? 아니 몬스터인가.'},
                        {name : '맥스', portrait : 'MaxPotrait', message : '저런 건 처음보는데…'},
                        {name : '코드', portrait : 'ChordPotrait', message : '얼마전부터 이 근방에 농작물처럼 생긴 몬스터가 나타나기 시작했다고 들었어요'},
                        {name : '맥스', portrait : 'MaxPotrait', message : '한시가 급한데, 이상한 몬스터까지 나타나다니. 미치겠군.'},
                        {name : '코드', portrait : 'ChordPotrait', message : '어쩌죠? 볼프강 박사가 있는 곳으로 가려면 이 길을 꼭 지나야 해요.'},
                        {name : '맥스', portrait : 'MaxPotrait', message : '흥. 이정돈 별거 아니라고!'},
                    ];
                    // 메시지 표시가 끝난 후 콜백 처리
                    this.dialog.showDialogModal(dialogueMessages, () => {
                        this.startBattleSequence();
                    });

                    if(type == 'pc'){
                        this.dialog.addInstructions('space');
                    }
                    else if(type == 'mobile'){
                        this.dialog.addInstructions('next');
                    }
                    // 충돌 이벤트 제거
                    unsubscribe4();
                }
            });
    }

    // 전투 시작 시 호출될 메서드
    startBattleSequence() {
        this.scene.isInDialogue = false;
        
        // 코드의 위치 이동시키기 & 전투시작
        this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
        this.chord.startPlayLute();
        
        // 1초 후 배경음악 재생
        this.scene.time.delayedCall(1000, () => {
            this.scene.backgroundMusic.play();
        }, [], this.scene);
        
        // 각 몬스터의 전투 시작
        this.scene.monsterArr.forEach((monster) => {
            monster.startBattle();
        });

        
    }

    setStageEnd(stageNumber, mapNumber, mapAttribute) {
        this.scene.isInDialogue = true;
        this.player.stopMove();
        this.chord.setLocation(this.scene.chordEnd.x, this.scene.chordEnd.y);

        console.log("mapAttribute "+ mapAttribute);
        // 맵의 속성에 따라서, 아이템 or 하트 or 랜덤 보상을 드랍한다.
        const dropX = this.player.x -50;
        const dropY = this.player.y;

        if(mapNumber === 'boss'){
            // 첫 번째 아이템 드랍
            const firstItem = Item.dropRandomItem(this.scene, this.player, dropX, dropY, this.dialog, null);
            console.log("첫번째 아이템 드랍" + firstItem.itemType.type);
            // 두 번째 아이템 드랍 (첫 번째 아이템과 다른 종류로)
            const secondItem = Item.dropRandomItem(this.scene, this.player, dropX-40, dropY, this.dialog, firstItem.itemType);
            console.log("두번째 아이템 드랍" +secondItem.itemType.type);
        }else if(mapAttribute === 1){
            Item.dropHeart(this.scene, this.player, dropX, dropY, this.dialog);
        }else if(mapAttribute === 2){
            Item.dropRandomItem(this.scene, this.player, dropX, dropY, this.dialog);
        }else if(mapAttribute === 3){
            Item.dropRandomReward(this.scene, this.player, dropX, dropY, this.dialog)
        }else if(mapAttribute === 4){
            // 첫 번째 아이템 드랍
            const firstItem = Item.dropRandomItem(this.scene, this.player, dropX, dropY, this.dialog, null);
            console.log("첫번째 아이템 드랍" + firstItem.itemType.type);
            // 두 번째 아이템 드랍 (첫 번째 아이템과 다른 종류로)
            const secondItem = Item.dropRandomItem(this.scene, this.player, dropX - 40, dropY, this.dialog, firstItem.itemType);
            console.log("두번째 아이템 드랍" +secondItem.itemType.type);
        }

        if (stageNumber == 3 && mapNumber == 'boss') {
            // 엔딩씬 보여주기.
            this.scene.cameras.main.fadeOut(3000, 0, 0, 0); // 2초 동안 까맣게 페이드 아웃
            this.scene.backgroundMusic.stop();
            this.scene.cameras.main.once('camerafadeoutcomplete', () => {
                const result = 'clear';
                this.scene.scene.start('BattleResultScene', {result});
            });
        }
        this.scene.isInDialogue = false;
    }

    update() {
        if (this.scene.returnStoreStatus !== undefined) {
            this.scene.returnStoreStatus = undefined;
            this.storeFlag.destroy();
            this.scene.player.arrowCountText.setText(this.scene.player.status.arrowCount);
            this.scene.coinIndicatorText.setText(`Coins : ${this.scene.player.status.coin}`);
            if (this.scene.player.status.arrowCount === 0) {
                this.scene.player.overLayArrowCoolTime.setVisible(true);
            } else {
                this.scene.player.overLayArrowCoolTime.setVisible(false);
            }
        }
    }

    goToStore() {
        this.scene.scene.launch('StoreScene', {
            stageNumber: this.scene.stageNumber,
            partNumber: this.scene.partNumber,
            mapNumber: 0,
            mapAttribute: true,
            playerStatus: this.scene.player.status
        });
    }
}