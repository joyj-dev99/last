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

        // let dialogueMessages;
        // if (stageNumber == 1 && mapNumber == 0) {
        //     dialogueMessages = [
        //         {name : '맥스', portrait : 'MaxPotrait', message : '뭐야? 미트코인이잖아?'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '몬스터가 왜 미트코인을 가지고 있는거지?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '역시 맥스님! A등급 용병은 다르군요!'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '너는 지금 내가 몬스터 잡는 동안 고작 악기 연주나 하고 있어?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '아무래도 응원가가 있는 편이 좀더 힘이 나니까요!'},       
        //     ];
        // } else if (stageNumber == 1 && mapNumber == 1) {
        //     dialogueMessages = [
        //         {name : '코드', portrait : 'ChordPotrait', message : '채소 몬스터의 사체를 드셔보셨나요?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '먹고나면 체력이 회복된답니다.'},       
        //         {name : '코드', portrait : 'ChordPotrait', message : '맛도 아주 좋다는 이야기를 들었어요.'},       
        //         {name : '맥스', portrait : 'MaxPotrait', message : '윽... 이거 먹어도 되는거 맞겠지?'},                
        //     ];
        // } else if (stageNumber == 1 && mapNumber == 2) {
        //     dialogueMessages = [
        //         {name : '맥스', portrait : 'MaxPotrait', message : '몬스터가 왜 이렇게 많아?'},    
        //         {name : '코드', portrait : 'ChordPotrait', message : '그러게요. 근데 전부 엄청 신선해보여요!'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '배고파? 왜 자꾸 신선 타령이야?'},    
        //         {name : '코드', portrait : 'ChordPotrait', message : '아뇨! 저 말고 맥스님이 배고프실까봐 그렇죠!'},            
        //     ];
        // } else if (stageNumber == 1 && mapNumber == 4) {
        //     dialogueMessages = [
        //         {name : '코드', portrait : 'ChordPotrait', message : '저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '지름길인가? 이런 길을 잘도 알고 있군'},    
        //         {name : '코드', portrait : 'ChordPotrait', message : '하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '주변에 불 피울 것 좀 찾아볼게요!'},               
        //     ];
        // } else if (stageNumber == 2 && mapNumber == 1) {
        //     dialogueMessages = [
        //         {name : '코드', portrait : 'ChordPotrait', message : '맥스님, 정말 대단하세요!'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '흥. 그런데 여긴 아무도 없나?'},    
        //         {name : '코드', portrait : 'ChordPotrait', message : '이 지하감옥은 예전에 영주였던 귀족나리가 죽은 후로 게속 방치되고 있다고 들었어요.'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '덕분에 마을을 오가는 지름길로 잘 쓰고 있죠. 히힛.'},               
        //     ];
        // } else if (stageNumber == 2 && mapNumber == 2) {
        //     dialogueMessages = [
        //         {name : '코드', portrait : 'ChordPotrait', message : '맥스 님, 정말 멋지십니다! 딸랑딸랑~'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '고블린 고기가 정말 별미라고 하던데... 기회가 되면 꼭 드셔보세요!'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '...후'},              
        //     ];
        // } else if (stageNumber == 2 && mapNumber == 3) {
        //     dialogueMessages = [
        //         {name : '코드', portrait : 'ChordPotrait', message : '쥐는 치즈를 좋아해~'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '이봐 코드! 이제 다 온거냐?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '네! 한 층만 더 위로 올라가면 지상으로 나갈 수 있어요!'},           
        //     ];
        // } else if (stageNumber == 2 && mapNumber == 4) {
        //     dialogueMessages = [
        //         {name : '네크로맨서', portrait : 'NecromancerPotrait', message : '큭… 안돼… 마이 베이비…'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '이봐. 너. 볼프강 박사를 알고 있나?'},
        //         {name : '네크로맨서', portrait : 'NecromancerPotrait', message : '볼프강! 내 둘도 없는 친우지!'},
        //         {name : '네크로맨서', portrait : 'NecromancerPotrait', message : '다시 보니 네놈 코드로구나! 볼프강을 배신한거냐?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '배신이라뇨! 애초에 전 돈 받은 만큼 일한 것 뿐 이라구요!'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '일? 날 상대로 사기친 일을 말하는거냐?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '아이고, 맥스님. 저도 정말 미트코인이 사기일줄 몰랐다니까요!'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '그렇다고치고. 이봐, 볼프강은 어디있지'},
        //         {name : '네크로맨서', portrait : 'NecromancerPotrait', message : '뭐야, 볼프강의 손님이었나?'},
        //         {name : '네크로맨서', portrait : 'NecromancerPotrait', message : '볼프강은 언제나처럼 연구소에 있을거다. 썩 꺼져버려.'},
        //     ];
        // }
        // else if (stageNumber == 3 && mapNumber == 1) {
        //     dialogueMessages = [
        //         {name : '맥스', portrait : 'MaxPotrait', message : '몬스터를 호위무사로 쓴다고?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '예전에 봤을 땐, 분명 인간이었는데…'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '볼프강. 도대체 무슨 짓을 하고 있는거지?'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '으앗! 맥스님, 같이 가요!'},
        //     ];
        // }
        // else if (stageNumber == 3 && mapNumber == 2) {
        //     dialogueMessages = [
        //         {name : '맥스', portrait : 'MaxPotrait', message : '천사를 죽이다니. 어딘가 찝찝하군.'},
        //     ];
        // }
        // else if (stageNumber == 3 && mapNumber == 3) {
        //     dialogueMessages = [
        //         {name : '코드', portrait : 'ChordPotrait', message : '맥스님! 볼프강 박사를 만날 준비가 되셨나요?'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '좋아. 가자!'},
        //     ];
        // }
        // else if (stageNumber == 3 && mapNumber == 4) {
        //     dialogueMessages = [
        //         {name : '볼프강', portrait : null, message : '크윽. 분하다... 내 꿈이... 연구의 끝을 볼 수 있었는데...'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '돈 내놔. 사기꾼 자식아!'},
        //         {name : '볼프강', portrait : null, message : '돈? 무슨 돈을 말하는거지?'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '니가 미트코인 상장폐지 시키고 꿀꺽한 내 돈 말이야!'},
        //         {name : '볼프강', portrait : null, message : '언제적 이야기를 하는지 모르겠군…'},
        //         {name : '볼프강', portrait : null, message : '그건 이미 연구비로 다 썼어. 남은 돈은 없다.'},
        //         {name : '맥스', portrait : 'MaxPotrait', message : '뭐??'},
        //         {name : '코드', portrait : 'ChordPotrait', message : '저런...'},
        //     ];
        // } else {
        //     dialogueMessages = [
        //         {name : '맥스', portrait : 'MaxPotrait', message : '대사 아직 없음'}
        //     ];
        // }
        // 메시지 표시가 끝난 후 콜백 처리
        // this.dialog.showDialogModal(dialogueMessages, () => {
        //     this.scene.isInDialogue = false;
            
        // });
    }
}