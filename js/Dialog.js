// /** @type {Phaser.Types.GameObjects.Text.TextStyle} */
// const UI_TEXT_STYLE = Object.freeze({
//     // fontFamily: KENNEY_FUTURE_NARROW_FONT_NAME,
//     color: 'white',
//     fontSize: '20px',
//     wordWrap: {width: 0},
// });

const {type} = window.gameConfig;

export default class Dialog {

    /** @type {Phaser.Scene} */
    #scene;
    /** @type {number} */
    #padding;
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {boolean} */
    #isVisible;
    /** @type {Phaser.GameObjects.Text} */
    #uiText;
    /** @type {Phaser.GameObjects.Text} */
    #nameText;
    /** @type {Phaser.GameObjects.Image} */
    #portrait;
    /** @type {boolean} */
    #textAnimationPlaying;
    /** @type {string[]} */
    #messagesToShow;
    /**
     * @type {{name: string, portrait: string, message: string} | null}
     * @private
     * 현재 표시 중인 메시지를 저장합니다.
     * - `name`: 발신자의 이름
     * - `portrait`: 초상화 이미지의 키
     * - `message`: 대화의 텍스트
     *
     * 이 속성은 텍스트 애니메이션이 진행 중일 때 사용자가 스페이스바를 눌렀을 경우,
     * 현재 메시지를 완전히 표시하는 데 사용됩니다.
     */
    #currentMessage = null;

    #currentInstructions = [];
    /** @type {boolean} */
    #ignoreSpaceKey;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, width, height, stageNumber, mapNumber) {
        this.#scene = scene;
        this.#padding = 10;
        this.#width = width - this.#padding * 2;
        this.#height = height;
        this.#textAnimationPlaying = false;
        this.#messagesToShow = [];
        this.#currentInstructions = [];  // 현재 추가된 UI 요소들을 추적
        this.#ignoreSpaceKey = false; // 스페이스 키를 무시하는 플래그

        this.stageNumber = stageNumber;
        this.mapNumber = mapNumber;

        // 컨테이너 및 UI 요소 설정
        const panel = this.#scene.add
            .rectangle(0, 0, this.#width, this.#height, '#000000', 0.8)
            .setOrigin(0)
            .setStrokeStyle(8, '#000000', 1);

        console.log('Panel:', panel);


        this.#container = this.#scene.add.container(0, 0, [panel]);

        // 모든 요소에 setScrollFactor(0) 적용
        panel.setScrollFactor(0);

        // 이름 텍스트 객체 추가
        this.#nameText = this.#scene.add.text(90, 10, '', {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: 'yellow'
        }).setScrollFactor(0);
        this.#container.add(this.#nameText);

        // 초상화 이미지 객체 추가
        this.#portrait = this.#scene.add.image(50, this.#height / 2, null).setScale(0.4).setVisible(false).setScrollFactor(0);
        this.#container.add(this.#portrait);
  
        // 대화 텍스트 객체 추가
        this.#uiText = this.#scene.add.text(90, 30, '', {
            fontFamily: 'Arial',
            color: 'white',
            ...{wordWrap: {width: this.#width - 100}, fontSize: '15px'},
        }).setScrollFactor(0);
        this.#container.add(this.#uiText);

        // 스페이스바 입력 감지
        this.#scene.input.keyboard.on('keydown-SPACE', () => {
            this.onSpaceKeyPressed();
        });

        this.#scene.events.on('shutdown', () => {
            // 씬이 중단될 때 정리해야 할 작업 수행
            console.log("shutdown this.#scene.scale.off('resize', this.handleResize, this);");
            this.#scene.scale.off('resize', this.handleResize, this);
        });


        // 대화창의 depth를 플레이어보다 높게 설정
        const dialogDepth = 101;
        this.#container.setDepth(dialogDepth);
        this.#nameText.setDepth(dialogDepth);
        this.#portrait.setDepth(dialogDepth);
        this.#uiText.setDepth(dialogDepth);
        // this.nextBtnImage.setDepth(dialogDepth);


        this.#container.setScrollFactor(0); // 컨테이너 자체에도 적용

        this.hideDialogModal();

        // 스페이스바 입력 감지
        this.#scene.input.keyboard.on('keydown-SPACE', () => {
            this.onSpaceKeyPressed();
        });

        // 화면 크기 변경 이벤트 처리
        this.#scene.scale.on('resize', this.handleResize, this);

        this.onCompleteCallback = null;  // 대화 종료 시 호출될 콜백 저장

        console.log('this.#container.getAt(0):', this.#container.getAt(0));
        console.log('생성자 끝');

    }

    addInstructions(key) {
        // 기존 UI 요소 제거
        this.clearInstructions();
        if (key === 'map') {
            if (type == 'pc') {
                // 스페이스 키 이미지 추가
                const spaceSprite = this.#scene.add.sprite(this.#width - 120, this.#height - 10, 'keyboard_extas', 10).setOrigin(0.5, 0.5).setScrollFactor(0);
                this.#container.add(spaceSprite);
                this.#currentInstructions.push(spaceSprite);  // 요소 추적

                // "선택" 텍스트 추가
                const selectText = this.#scene.add.text(this.#width - 90, this.#height - 15, '선택', {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    color: 'white'
                }).setScrollFactor(0);
                this.#container.add(selectText);
                this.#currentInstructions.push(selectText);  // 요소 추적

                // ESC 키 이미지 추가
                const escKeySprite = this.#scene.add.sprite(this.#width - 50, this.#height - 10, 'keyboard_extas', 1).setOrigin(0.5, 0.5).setScrollFactor(0);
                this.#container.add(escKeySprite);
                this.#currentInstructions.push(escKeySprite);  // 요소 추적

                // "취소" 텍스트 추가
                const cancelText = this.#scene.add.text(this.#width - 30, this.#height - 15, '취소', {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    color: 'white'
                }).setScrollFactor(0);
                this.#container.add(cancelText);
                this.#currentInstructions.push(cancelText);  // 요소 추적
            } else if (type == 'mobile') {
            }

        } else if (key === 'space') {
            // 스페이스 키 이미지 추가
            const spaceSprite = this.#scene.add.sprite(this.#width - 70, this.#height - 10, 'keyboard_extas', 10).setOrigin(0.5, 0.5).setScrollFactor(0);
            this.#container.add(spaceSprite);
            this.#currentInstructions.push(spaceSprite);  // 요소 추적
            // "넘기기" 텍스트 추가
            const continueText = this.#scene.add.text(this.#width - 40, this.#height - 15, '넘기기', {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: 'white'
            }).setScrollFactor(0);
            this.#container.add(continueText);
            this.#currentInstructions.push(continueText);  // 요소 추적
        } else if (key === 'next') {
            // 스페이스 키 이미지 추가
            // 다음 버튼
            this.nextBtnImage = this.#scene.add.image(this.#width - 25, 62, 'nextBtnImage').setScale(1).setVisible(true).setScrollFactor(0);

            this.#container.add(this.nextBtnImage);

            this.nextBtnImage.setInteractive({useHandCursor: true});
            this.nextBtnImage.on('pointerdown', () => {
                console.log('nextBtnImage  pointerdown');
                this.onSpaceKeyPressed();
            })
                .on('pointerover', () => {
                    this.nextBtnImage.setScale(1.05); // 마우스를 올리면 크기가 5% 커짐
                })
                .on('pointerout', () => {
                    this.nextBtnImage.setScale(1); // 마우스를 떼면 원래 크기로 돌아감
                });
            this.#currentInstructions.push(this.nextBtnImage);  // 요소 추적
        }
    }

    clearInstructions() {
        // 현재 UI 요소들이 존재한다면 모두 제거
        if (this.#currentInstructions.length > 0) {
            this.#currentInstructions.forEach(element => element.destroy());
            this.#currentInstructions = [];
        }
    }

    /** @type {boolean} */
    get isVisible() {
        return this.#isVisible;
    }

    /** @type {boolean} */
    get isAnimationPlaying() {
        return this.#textAnimationPlaying;
    }

    /** @type {boolean} */
    get moreMessagesToShow() {
        return this.#messagesToShow.length > 0;
    }


    /**
     * @returns {void}
     */
    handleResize(gameSize) {

        // console.log('handleResize this.stageNumber : '+this.stageNumber);
        // console.log('handleResize this.mapNumber : '+this.mapNumber);

        const width = gameSize.width;
        const height = gameSize.height;

        // 화면의 크기에 비례하여 다이알로그 크기 조정
        this.#width = width - this.#padding * 2;
        this.#height = height * 0.3; // 화면 높이의 30%로 설정

        // console.log('this.#container'+this.#container);
        // console.log('this.#container.getAt(0)'+this.#container.getAt(0));
        // console.log('this.#container.getAt(0):', this.#container.getAt(0));
        // console.dir(this.#container);

        this.#container.getAt(0).setSize(this.#width, this.#height); // 패널 크기 조정
        this.#uiText.setWordWrapWidth(this.#width - 90);
        this.#portrait.setPosition(30, this.#height / 2); // 초상화 위치 조정
    }

    /**
     * @param {{name: string, portrait: string, message: string}[]} messages - 대화 메시지 배열. 각 객체는 대화하는 인물의 이름, 초상화 이미지 키, 메시지를 포함합니다.
     * @param {Function} [onComplete] - 대화 종료 후 실행될 콜백
     */
    showDialogModal(messages, onComplete) {
        if (messages.length <= 0) return;
        console.log('showDialogModal', messages);

        this.#messagesToShow = [...messages];
        this.onCompleteCallback = onComplete || null;
        console.log(this.#messagesToShow);

        const screenWidth = this.#scene.scale.width;
        const screenHeight = this.#scene.scale.height;

        // 대화창을 화면 하단 중앙에 고정
        const startX = (screenWidth - this.#width) / 2;
        const startY = screenHeight - this.#height - this.#padding;

        this.#container.setPosition(startX, startY);
        this.#container.setAlpha(1);
        this.#isVisible = true;

        this.showNextMessage();
    }

    /**
     * @returns {void}
     */
    showNextMessage() {
        if (this.#messagesToShow.length === 0) {
            // 더 이상 메시지가 남아 있지 않으면 애니메이션을 멈추고 대화 종료를 대기
            this.#textAnimationPlaying = false;
            return;
        }
        const {name, portrait, message} = this.#messagesToShow.shift();
        this.#currentMessage = {name, portrait, message}; // 현재 메시지 저장

        this.#nameText.setText(name);
        // portrait 값이 null이면 초상화 숨기기, 그렇지 않으면 표시
        if (portrait) {
            this.#portrait.setTexture(portrait).setVisible(true);
        } else {
            this.#portrait.setVisible(false);
        }

        this.#uiText.setText('').setAlpha(1);

        this.animateText(this.#scene, this.#uiText, message, {
            delay: 50, // 애니메이션 속도(밀리초)
            callback: () => {
                this.#textAnimationPlaying = false;
            },
        });
        this.#textAnimationPlaying = true;
    }

    /**
     * 텍스트를 한 글자씩 순차적으로 표시하는 함수
     * @param {Phaser.Scene} scene - 현재 장면
     * @param {Phaser.GameObjects.Text} textObject - 텍스트 객체
     * @param {string} message - 표시할 메시지
     * @param {{delay: number, callback: function}} options - 옵션: 딜레이와 콜백
     */
    animateText(scene, textObject, message, options) {
        const {delay, callback} = options;
        let i = 0;

        // 기존 타이머가 있을 경우 제거
        if (textObject.timer) {
            textObject.timer.remove(false);
        }

        // 텍스트를 초기화합니다.
        textObject.setText('');

        // 타이머 생성
        textObject.timer = scene.time.addEvent({
            delay: delay,
            callback: () => {
                textObject.text += message[i];
                i++;
                if (i >= message.length) {
                    textObject.timer.remove(false);
                    textObject.timer = null;  // 타이머를 초기화
                    if (callback) callback();
                }
            },
            loop: true
        });
    }

    /**
     * @returns {void}
     */
    hideDialogModal() {
        this.#container.setAlpha(0);
        this.#isVisible = false;

        // 대화창이 사라지면 바로 콜백 실행
        if (this.onCompleteCallback) {
            const callback = this.onCompleteCallback;
            this.onCompleteCallback = null; // 콜백이 중복 실행되지 않도록 초기화
            callback();  // 콜백 실행
        }
    }

    /**
     * @returns {void}
     */
    onSpaceKeyPressed() {
        if (this.#ignoreSpaceKey) {
            return; // 스페이스 키를 무시하도록 설정된 경우 아무것도 하지 않음
        }
        if (this.#textAnimationPlaying) {
            // 현재 텍스트 애니메이션을 중단하고 전체 메시지를 표시
            if (this.#uiText.timer) {
                this.#uiText.timer.remove(false);
                this.#uiText.timer = null;
            }
            this.#uiText.setText(this.#currentMessage.message); // 전체 메시지를 한 번에 표시
            this.#textAnimationPlaying = false;
        } else if (this.moreMessagesToShow) {
            // 애니메이션이 끝난 후 스페이스바를 누르면 다음 메시지로 넘어감
            this.showNextMessage();
        } else {
            // 메시지가 끝나고 스페이스바를 누르면 대화창 숨기기
            this.hideDialogModal();
        }
    }

    setIgnoreSpaceKey(value) {
        this.#ignoreSpaceKey = value; // 스페이스 키 무시 플래그 설정
    }
}