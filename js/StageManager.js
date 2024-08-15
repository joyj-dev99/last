import Tutorial from "./Tutorial.js";

export default class StageManager {
    constructor(scene, player, chord) {
        this.scene = scene;
        this.player = player;
        this.chord = chord;
    }

    setStageStart(stageNumber, mapNumber) {
        if (stageNumber == 1 && mapNumber == 1) {

            let tutorial = new Tutorial(this.player);
            
            // 첫번째는 센서 없이 바로 시작
            this.scene.isInDialogue = true;

            this.chord.showSpeechBubble('모험을 떠나기 전에 몇가지 알려드릴게요.', () =>{
                this.chord.showSpeechBubble('방향키를\n눌러보세요!', () =>{
                    this.scene.isInDialogue = false;
                    // 이동키 조작 설명 시작.
                    tutorial.startDirectionControlExplanation(this.scene, 250, this.player.y - 160, this.player);
                });
            });
            
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
                    this.player.stop();
                    // 센서 제거
                    tutorial.onSensorHit(this.scene, bodyB);
                    // 오른쪽 사인 제거
                    tutorial.removeRightSign();
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
                    // 오른쪽 사인 제거
                    tutorial.removeRightSign();
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
                    // 오른쪽 사인 제거
                    tutorial.removeRightSign();
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
        } else if (stageNumber == 2 && mapNumber == 2) {
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
                    console.log('monster : '+monster);
                    console.log('monster.type : '+monster.monsterType);
                    monster.startBattle();
                });
            });
        } else if (stageNumber == 2 && mapNumber == 3) {
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
        } else if (stageNumber == 2 && mapNumber == 4) {
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
        }
        else if (stageNumber == 3 && mapNumber == 1) {
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
        }
        else if (stageNumber == 3 && mapNumber == 2) {
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
        }
        else if (stageNumber == 3 && mapNumber == 3) {
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
        }
        else if (stageNumber == 3 && mapNumber == 4) {
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
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 2) {
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 3) {
            this.chord.showSpeechBubble('이제 저쪽 사이길로 들어가면 볼프강 박사의 연구소가 있는 성이 보일거예요!', () => {
                this.player.showSpeechBubble('지름길인가? 이런 길을 잘도 알고 있군.', () => {
                    this.chord.showSpeechBubble('하핫. 이제 어두워지니까 조금만 더 가서 야영할까요?', () => {
                        this.chord.showSpeechBubble('주변에 불 피울 것 좀 찾아볼게요!', () => {
                            this.scene.isInDialogue = false;
                        });
                    });
                });
            });
        } else if (stageNumber == 2 && mapNumber == 4) {
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