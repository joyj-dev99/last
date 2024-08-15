import Tutorial from "./Tutorial.js";

export default class StageManager {
    constructor(scene, player, chord) {
        this.scene = scene;
        this.player = player;
        this.chord = chord;
        if (this.scene.necromancer) {
            this.necromancer = this.scene.necromancer;
        }
    }

    static preload(scene){
        scene.load.audio("forest_boss", "assets/audio/background/forest/forest_boss.mp3");
        scene.load.audio("dungeon_default", "assets/audio/background/dungeon/dungeon_default.mp3");
        scene.load.audio("dungeon_boss", "assets/audio/background/dungeon/dungeon_boss.mp3");
        scene.load.audio("room_default", "assets/audio/background/room/room_default.mp3");
        scene.load.audio("room_boss", "assets/audio/background/room/room_boss.mp3");
    }

    setStageStart(stageNumber, mapNumber) {
        if (stageNumber == 1 && mapNumber == 1) {
            let tutorial = new Tutorial();
            
            // 첫번째는 센서 없이 바로 시작
            this.scene.isInDialogue = true;

            this.chord.showSpeechBubble('모험을 떠나기 전에 몇가지 알려드릴게요.', () =>{
                this.chord.showSpeechBubble('방향키를\n눌러보세요!', () =>{
                    this.scene.isInDialogue = false;
                    // 이동키 조작 설명 시작.
                    tutorial.startDirectionControlExplanation(this.scene, this.player.x +50, this.player.y - 160);
                });
            });
            
            let sensor2 = tutorial.createSensor(this.scene, this.player.x +200, this.player.y - 160, 10, 500);
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
                    this.player.stop();
                    // 센서 제거
                    tutorial.onSensorHit(this.scene, bodyB);
                    // 이동키 조작 설명 끝
                    tutorial.endDirectionControlExplanation();

                    // 코드의 위치 이동시키기
                    this.chord.setLocation(this.player.x, this.player.y - 50);
                    this.chord.showSpeechBubble('z 키를 눌러보세요!', () =>{
                        this.scene.isInDialogue = false;
                        // z 키 설명 시작
                        tutorial.startZKeyControlExplanation(this.scene, this.player.x +50, this.player.y - 160);
                    });
                    // 충돌 이벤트 제거
                    unsubscribe2();
                }
            });


            let sensor3 = tutorial.createSensor(this.scene, this.player.x +300, this.player.y - 160, 10, 500);
            // 충돌시 이동키 설명관련 데이터 삭제
            const unsubscribe3 = this.scene.matterCollision.addOnCollideStart({
                objectA: this.player,
                objectB: sensor3,
                callback: eventData => {
                    const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                    console.log("플레이어와 센서3 충돌");
                    this.scene.isInDialogue = true;
                    this.player.stop();
                    // 센서 제거
                    tutorial.onSensorHit(this.scene, bodyB);
                    // 이동키 조작 설명 끝
                    tutorial.endzKeyControlExplanation();
                
                    // 코드의 위치 이동시키기
                    this.chord.setLocation(this.player.x, this.player.y - 50);
                    this.chord.showSpeechBubble('shift 키를 누르면 구를 수 있어요!', () =>{
                        this.chord.showSpeechBubble('공격을 피해야 할 때, 구르기를 사용해보세요.', () => {
                            this.scene.isInDialogue = false;
                            // shift 키 설명 시작
                            tutorial.startshiftKeyControlExplanation(this.scene, this.player.x +50, this.player.y - 160);
                        });
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
                    this.player.stop();
                    // 센서 제거
                    tutorial.onSensorHit(this.scene, bodyB);
                    tutorial.endshiftKeyControlExplanation();
                    tutorial.finish(this.scene);

                    // 코드의 위치 이동시키기
                    this.chord.setLocation(this.player.x, this.player.y - 50);
                    this.player.showSpeechBubble('토마토? 아니 몬스터인가.', ()=>{
                        this.player.showSpeechBubble('저런 건 처음보는데…', () => {
                            this.chord.showSpeechBubble('얼마전부터 이 근방에 농작물처럼 생긴 몬스터가 나타나기 시작했다고 들었어요.', ()=>{
                                this.player.showSpeechBubble('한시가 급한데, 이상한 몬스터까지 나타나다니. 미치겠군.', ()=>{
                                    this.chord.showSpeechBubble('어쩌죠? 볼프강 박사가 있는 곳으로 가려면 이 길을 꼭 지나야 해요.', ()=>{
                                        this.player.showSpeechBubble('흥. 이정돈 별거 아니라고!', () => {
                                            this.scene.isInDialogue = false;
                                            // 코드의 위치 이동시키기 & 전투시작
                                            this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                                            this.chord.startPlayLute();
                                            this.scene.time.delayedCall(1000, () => {
                                                this.scene.backgroundMusic.play();
                                            }, [], this.scene);
                                            this.scene.monsterArr.forEach((monster) => {
                                                monster.startBattle();
                                            });
                                        });
                                    });
                                });
                            });
                        })
                    });
                    // 충돌 이벤트 제거
                    unsubscribe4();
                }
            });
        } else if (stageNumber == 1 && mapNumber == 2) {
            this.scene.isInDialogue = true;
            // 대화
            this.player.showSpeechBubble('이번엔 토마토랑 가지냐?', () => {
                this.scene.isInDialogue = false;
                // 코드의 위치 이동시키기 & 전투시작
                this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                this.chord.startPlayLute();
                this.scene.time.delayedCall(1000, () => {
                    this.scene.backgroundMusic.play();
                }, [], this.scene);
                this.scene.monsterArr.forEach((monster) => {
                    monster.startBattle();
                });
            });
        } else if (stageNumber == 1 && mapNumber == 3) {
            this.chord.showSpeechBubble('사과와 레몬이네요!\n너무 상큼해보여요!', ()=>{
                this.player.showSpeechBubble('헛소리 하지말고, 저리가서 연주나 해.', () => {
                    this.scene.isInDialogue = false;
                    // 코드의 위치 이동시키기 & 전투시작
                    this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                    this.chord.startPlayLute();
                    this.scene.time.delayedCall(1000, () => {
                        this.scene.backgroundMusic.play();
                    }, [], this.scene);
                    this.scene.monsterArr.forEach((monster) => {
                        monster.startBattle();
                    });
                });
            });
        } else if (stageNumber == 1 && mapNumber == 4) {
            this.player.showSpeechBubble('이번엔 호박이야? 가지가지 하는군...', ()=>{
                this.chord.showSpeechBubble('이 호박은 다른 몬스터들보다 좀더 강해보여요.', () => {
                    this.player.showSpeechBubble('그래봐야 한주먹거리지.', ()=>{
                        this.chord.showSpeechBubble('역시 맥스님! 다녀오시면 제가 호박으로 스프라도 만들어드릴게요!', () => {
                            this.player.showSpeechBubble('헛소리 말고 저리 꺼져.', ()=>{
                                this.scene.isInDialogue = false;
                                // 코드의 위치 이동시키기 & 전투시작
                                this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                                this.chord.startPlayLute();
                                this.scene.backgroundMusic = this.scene.sound.add('forest_boss', {
                                    volume: 0.3, // Set the volume (0 to 1)
                                    loop: true // Enable looping if desired
                                });
                                this.scene.time.delayedCall(1000, () => {
                                    this.scene.backgroundMusic.play();
                                }, [], this.scene);
                                this.scene.monsterArr.forEach((monster) => {
                                    monster.startBattle();
                                });
                            });
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 1) {
            this.scene.isInDialogue = true;
            // 대화
            this.player.showSpeechBubble('과거에 감옥으로 썼던 곳인가 보군.', () => {
                this.chord.showSpeechBubble('으악! 맥스님, 거미랑 파리가 너무 많아요!', () => {
                    this.player.showSpeechBubble('시끄러워...', () => {
                        this.scene.isInDialogue = false;
                        // 코드의 위치 이동시키기 & 전투시작
                        this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                        this.chord.startPlayLute();
                        this.scene.backgroundMusic = this.scene.sound.add('dungeon_default', {
                            volume: 0.3, // Set the volume (0 to 1)
                            loop: true // Enable looping if desired
                        });
                        this.scene.time.delayedCall(1000, () => {
                            this.scene.backgroundMusic.play();
                        }, [], this.scene);
                        this.scene.monsterArr.forEach((monster) => {
                            monster.startBattle();
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 2) {
            this.scene.isInDialogue = true;
            // 대화
            this.player.showSpeechBubble('저건... 고블린?', () => {
                this.player.showSpeechBubble('원래 고블린이 건물 안에 살던가?', () => {
                    this.chord.showSpeechBubble('그럴리가요. 뭔가 이상하네요.', () => {
                        this.chord.showSpeechBubble('아무래도 조심하는게 좋을 거 같아요, 맥스님.', () => {
                            this.scene.isInDialogue = false;
                            // 코드의 위치 이동시키기 & 전투시작
                            this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                            this.chord.startPlayLute();
                            this.scene.backgroundMusic = this.scene.sound.add('dungeon_default', {
                                volume: 0.3, // Set the volume (0 to 1)
                                loop: true // Enable looping if desired
                            });
                            this.scene.time.delayedCall(1000, () => {
                                this.scene.backgroundMusic.play();
                            }, [], this.scene);
                            this.scene.monsterArr.forEach((monster) => {
                                monster.startBattle();
                            });
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 3) {
            this.scene.isInDialogue = true;
            // 대화
            this.chord.showSpeechBubble('으악!!!!!! 쥐다!!!!!', () => {
                this.player.showSpeechBubble('그냥 쥐라고 하기엔 너무 큰거 아냐?', () => {
                    this.chord.showSpeechBubble('여기서 무슨 일이 벌어지고 있긴 한가보군.', () => {
                        this.scene.isInDialogue = false;
                        // 코드의 위치 이동시키기 & 전투시작
                        this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                        this.chord.startPlayLute();
                        this.scene.backgroundMusic = this.scene.sound.add('dungeon_default', {
                            volume: 0.3, // Set the volume (0 to 1)
                            loop: true // Enable looping if desired
                        });
                        this.scene.time.delayedCall(1000, () => {
                            this.scene.backgroundMusic.play();
                        }, [], this.scene);
                        this.scene.monsterArr.forEach((monster) => {
                            monster.startBattle();
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 4) {
            this.scene.isInDialogue = true;
            // 대화
            console.log(this.necromancer);
            
            
            this.necromancer.showSpeechBubble('누구냐! 감히 우리 베이비들에게 손을 대다니!', () => {
                this.necromancer.showSpeechBubble('대가를 치르게 해주마!', () => {
                    this.player.showSpeechBubble('그.. 베이비가, 고블린은 아니겠지?', () => {
                        this.chord.showSpeechBubble('음. 사람마다 취향이 다를 수도 있죠..하하..', () => {
                            this.scene.isInDialogue = false;
                            // 코드의 위치 이동시키기 & 전투시작
                            this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                            this.chord.startPlayLute();
                            this.scene.backgroundMusic = this.scene.sound.add('dungeon_boss', {
                                volume: 0.3, // Set the volume (0 to 1)
                                loop: true // Enable looping if desired
                            });
                            this.scene.time.delayedCall(1000, () => {
                                this.scene.backgroundMusic.play();
                            }, [], this.scene);
                            this.scene.monsterArr.forEach((monster) => {
                                monster.startBattle();
                            });
                        });
                    });
                });
            });
        }
        else if (stageNumber == 3 && mapNumber == 1) {
            this.scene.isInDialogue = true;
            // 대화
            this.player.showSpeechBubble('이번엔 토마토랑 가지냐?', () => {
                this.scene.isInDialogue = false;
                // 코드의 위치 이동시키기 & 전투시작
                this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                this.chord.startPlayLute();
                this.scene.backgroundMusic = this.scene.sound.add('room_default', {
                    volume: 0.3, // Set the volume (0 to 1)
                    loop: true // Enable looping if desired
                });
                this.scene.time.delayedCall(1000, () => {
                    this.scene.backgroundMusic.play();
                }, [], this.scene);
                this.scene.monsterArr.forEach((monster) => {
                    monster.startBattle();
                });
            });
        }
        else if (stageNumber == 3 && mapNumber == 2) {
            this.scene.isInDialogue = true;
            // 대화
            this.player.showSpeechBubble('이번엔 토마토랑 가지냐?', () => {
                this.scene.isInDialogue = false;
                // 코드의 위치 이동시키기 & 전투시작
                this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                this.chord.startPlayLute();
                this.scene.backgroundMusic = this.scene.sound.add('room_default', {
                    volume: 0.3, // Set the volume (0 to 1)
                    loop: true // Enable looping if desired
                });
                this.scene.time.delayedCall(1000, () => {
                    this.scene.backgroundMusic.play();
                }, [], this.scene);
                this.scene.monsterArr.forEach((monster) => {
                    monster.startBattle();
                });
            });
        }
        else if (stageNumber == 3 && mapNumber == 3) {
            this.scene.isInDialogue = true;
            // 대화
            this.player.showSpeechBubble('이번엔 토마토랑 가지냐?', () => {
                this.scene.isInDialogue = false;
                // 코드의 위치 이동시키기 & 전투시작
                this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                this.chord.startPlayLute();
                this.scene.backgroundMusic = this.scene.sound.add('room_default', {
                    volume: 0.3, // Set the volume (0 to 1)
                    loop: true // Enable looping if desired
                });
                this.scene.time.delayedCall(1000, () => {
                    this.scene.backgroundMusic.play();
                }, [], this.scene);
                this.scene.monsterArr.forEach((monster) => {
                    monster.startBattle();
                });
            });
        }
        else if (stageNumber == 3 && mapNumber == 4) {
            this.scene.isInDialogue = true;
            // 대화
            this.player.showSpeechBubble('이번엔 토마토랑 가지냐?', () => {
                this.scene.isInDialogue = false;
                // 코드의 위치 이동시키기 & 전투시작
                this.chord.setLocation(this.scene.chordBattle.x, this.scene.chordBattle.y);
                this.chord.startPlayLute();
                this.scene.backgroundMusic = this.scene.sound.add('room_boss', {
                    volume: 0.3, // Set the volume (0 to 1)
                    loop: true // Enable looping if desired
                });
                this.scene.time.delayedCall(1000, () => {
                    this.scene.backgroundMusic.play();
                }, [], this.scene);
                this.scene.monsterArr.forEach((monster) => {
                    monster.startBattle();
                });
            });
        }
    }

    setStageEnd(stageNumber, mapNumber) {
        this.scene.isInDialogue = true;
        this.player.stop();
        this.chord.setLocation(this.scene.chordEnd.x, this.scene.chordEnd.y);
        if (stageNumber == 1 && mapNumber == 1) {
            this.player.showSpeechBubble('뭐야? \n 미트코인이잖아?', () => {
                this.player.showSpeechBubble('몬스터가 왜 미트코인을 가지고 있는거지?', () => {
                    this.chord.showSpeechBubble('역시 맥스님! A등급 용병은 다르군요!', () => {
                        this.player.showSpeechBubble('그나저나 너는 지금 내가 몬스터 잡는 동안', () => {
                            this.player.showSpeechBubble('고작 악기 연주나 하고 있어?', () => {
                                this.chord.showSpeechBubble('아무래도 응원가가 \n 있으면 좋으니까요!', () => {
                                    this.scene.isInDialogue = false;
                                });
                            });
                        });
                    });
                });
            });
        } else if (stageNumber == 1 && mapNumber == 2) {
            this.chord.showSpeechBubble('채소 몬스터의 사체를 드셔보셨나요?', () => {
                this.chord.showSpeechBubble('먹고나면 체력이 회복된답니다.', () => {
                    this.chord.showSpeechBubble('맛도 아주 좋다는 이야기를 들었어요.', () => {
                        this.player.showSpeechBubble('윽... 이거 먹어도 되는거 맞겠지?', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        } else if (stageNumber == 1 && mapNumber == 3) {
            this.player.showSpeechBubble('몬스터가 왜 이렇게 많아?', () => {
                this.chord.showSpeechBubble('그러게요. 근데 전부 엄청 신선해보여요!', () => {
                    this.player.showSpeechBubble('배고파? 왜 자꾸 신선 타령이야?', () => {
                        this.chord.showSpeechBubble('아뇨! 저 말고 맥스님이 배고프실까봐 그렇죠!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        } else if (stageNumber == 1 && mapNumber == 4) {
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 1) {
            this.chord.showSpeechBubble('맥스님, 정말 대단하세요!', () => {
                this.player.showSpeechBubble('흥. 그런데 여긴 아무도 없나?', () => {
                    this.chord.showSpeechBubble('이 지하감옥은 예전에 영주였던 귀족나리가\n죽은 후로 게속 방치되고 있다고 들었어요.', () => {
                        this.chord.showSpeechBubble('덕분에 마을을 오가는 지름길로 잘 쓰고 있죠. 히힛.', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 2) {
            this.chord.showSpeechBubble('맥스 님, 정말 멋지십니다! 딸랑딸랑~', () => {
                this.player.showSpeechBubble('...후', () => {
                    this.chord.showSpeechBubble('고블린 고기가 정말 별미라고 하던데... 기회가 되면 꼭 드셔보세요!', () => {
                        this.scene.isInDialogue = false;
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 3) {
            this.chord.showSpeechBubble('쥐는 치즈를 좋아해~', () => {
                this.player.showSpeechBubble('이봐 코드! 이제 다 온거냐?', () => {
                    this.chord.showSpeechBubble('네! 한 층만 더 위로 올라가면 지상으로 나갈 수 있어요!', () => {
                        this.scene.isInDialogue = false;
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 4) {
            this.chord.showSpeechBubble('쥐는 치즈를 좋아해~', () => {
                this.player.showSpeechBubble('이봐 코드! 이제 다 온거냐?', () => {
                    this.chord.showSpeechBubble('네! 한 층만 더 위로 올라가면 지상으로 나갈 수 있어요!', () => {
                        this.scene.isInDialogue = false;
                    });
                });
            });
            // this.necromancer.showSpeechBubble('큭… 안돼… 마이 베이비…', () => {
            //     this.player.showSpeechBubble('이봐. 너. 볼프강 박사를 알고 있나?', () => {
            //         this.necromancer.showSpeechBubble('볼프강! 내 둘도 없는 친우지!', () => {
            //             this.necromancer.showSpeechBubble('다시 보니 네놈 코드로구나! 볼프강을 배신한거냐?', () => {
            //                 this.chord.showSpeechBubble('배신이라뇨! 애초에 전 돈 받은 만큼 일한 것 뿐 이라구요!', () => {
            //                     this.player.showSpeechBubble('일? 날 상대로 사기친 일을 말하는거냐?', () => {
            //                         this.chord.showSpeechBubble('아이고, 맥스님. 저도 정말 미트코인이 사기일줄 몰랐다니까요!', () => {
            //                             this.player.showSpeechBubble('그렇다고치고. 이봐, 볼프강은 어디있지?', () => {
            //                                 this.necromancer.showSpeechBubble('뭐야, 볼프강의 손님이었나?', () => {
            //                                     this.necromancer.showSpeechBubble('볼프강은 언제나처럼 연구소에 있을거다. 썩 가버려.', () => {
            //                                         this.scene.isInDialogue = false;
            //                                     });
            //                                 });
            //                             });
            //                         });
            //                     });
            //                 });
            //             });
            //         });
            //     });
            // });
        }
        else if (stageNumber == 3 && mapNumber == 1) {
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        }
        else if (stageNumber == 3 && mapNumber == 2) {
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        }
        else if (stageNumber == 3 && mapNumber == 3) {
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        }
        else if (stageNumber == 3 && mapNumber == 4) {
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        }
    }
}