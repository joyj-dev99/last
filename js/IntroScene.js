import Player from "./Player.js";
import Chord from "./character/Chord.js";

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({key: 'IntroScene'});
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.dialogue = [
            {speaker: 'max_angry', text: "코드! 너 이 새끼! 당장 죽여버리겠어! 넌 ‘미트 코인’이 사기라는 걸 알고 있었던 거지!"},
            {speaker: 'chord_scary', text: "맥스 님! 으악! 제발 때리지만 마세요! 저도 몰랐어요!"},
            {speaker: 'max_angry', text: "웃기는 소리 하지마. 미트 코인 상폐 되기 전에 돈을 빼서 유일하게 손해 안 본 게 너라던데! 넌 다 알고 있었던 거 잖아!"},
            {speaker: 'chord_scary', text: "아악! 윽, 아파요! 아악! 제가.. 제가 볼프강 박사가 어디에 있는지 알아요! 볼프강 박사를 족치면 돈을 다시 돌려받을 수 있을 거예요!"},
            {speaker: 'max_angry', text: "정말 볼프강이 어디에 있는지 알아? "},
            {speaker: 'chord_scary', text: " 네네! 볼프강 박사가 있는 곳까지 안내할게요! 같이 가서 맥스 님의 돈을 전부 돌려 받아요!"},
            {speaker: 'max_angry', text: "제대로 안내하지 않는다면 족쳐지는 건 너가 될 거야, 코드."},
            {speaker: 'chord_normal', text: "그럼요! 여부가 있겠습니까. 그럼 같이 모험을 떠나볼까요!"},

        ];

    }

    preload() {
        Player.preload(this);
        Chord.preload(this);

        this.load.image("intro_maxHome", "assets/intro/Medieval House Interior Tileset.png");
        this.load.tilemapTiledJSON("intro_maxHome_json", "assets/intro/intro.json");

        // 이미지, 오디오 등의 리소스를 미리 로드
        this.load.image('max_normal', 'assets/intro/max_normal.png');
        this.load.image('chord_normal', 'assets/intro/chord_normal.png');
        this.load.image('max_angry', 'assets/intro/max_angry.png');
        this.load.image('chord_scary', 'assets/intro/chord_scary.png');
        this.load.audio('introMusic', 'assets/audio/field_theme_1.wav');
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.matter.world.setBounds();
        const map = this.make.tilemap({key: "intro_maxHome_json"});
        const intro_maxHome = map.addTilesetImage("Medieval House Interior Tileset", "intro_maxHome");

        const floorLayer = map.createLayer("floor", intro_maxHome, 0, 0);
        map.wall = map.createLayer("wall", intro_maxHome, 0, 0);
        map.interior1 = map.createLayer("interior1", intro_maxHome, 0, 0);
        map.interior2 = map.createLayer("interior2", intro_maxHome, 0, 0);

        floorLayer.setCollisionByProperty({collides: true});
        this.matter.world.convertTilemapLayer(floorLayer);

        floorLayer.setCollisionByProperty({collides: true});
        this.matter.world.convertTilemapLayer(floorLayer);
        //
        this.max_normal = this.add.image(0, 0, 'max_normal');
        this.max_normal.setX(this.max_normal.width / 2);
        this.max_normal.setY(this.scale.height - this.max_normal.height / 2);

        this.chord_normal = this.add.image(0, 0, 'chord_normal');
        this.chord_normal.setX(this.scale.width - this.chord_normal.width / 2, this.scale.height - this.chord_normal.height / 2);
        this.chord_normal.setY(this.scale.height - this.chord_normal.height / 2);

        this.max_angry = this.add.image(0, 0, 'max_angry');
        this.max_angry.setX(this.max_angry.width / 2);
        this.max_angry.setY(this.scale.height - this.max_angry.height / 2);

        this.chord_scary = this.add.image(0, 0, 'chord_scary');
        this.chord_scary.setX(this.scale.width - this.chord_scary.width / 2, this.scale.height - this.chord_scary.height / 2);
        this.chord_scary.setY(this.scale.height - this.chord_scary.height / 2);


        let wid = this.scale.width - this.chord_normal.width * 2;
        this.textBox = this.add.graphics();
        this.textBox.fillStyle(0xffffff, 0.9);
        this.textBox.fillRoundedRect(this.max_normal.width, 150, wid, 100, 10);
        this.textStyle = {font: '16px Arial', fill: '#000000', wordWrap: {width: wid - 20}};
        this.dialogueText = this.add.text(this.max_normal.width + 10, 160, '', this.textStyle);

        this.nextTextStyle = {font: '8px Arial', fill: '#000000'};
        this.nextText = this.add.text(this.scale.width - 180, this.scale.height - 20, "아무 키나 누르세요.", this.nextTextStyle);
        this.nextText.setDepth(100);


        this.input.on('pointerdown', this.nextDialogue, this);
        this.input.keyboard.on('keydown', () => {
            this.nextDialogue();
        });
        this.nextDialogue();


        this.player = new Player({
            scene: this,
            x: 270,
            y: 120,
            texture: 'player',
            frame: 'player_idle_01'
        });
        this.chord = new Chord({
            scene: this,
            x: 310,
            y: 120
        });
        this.player.setDepth(100);
        this.chord.setDepth(100);
        this.chord.setFlipX(true);
    }

    nextDialogue() {
        if (this.dialogueIndex >= this.dialogue.length) {
            this.dialogueIndex = 0;
            this.scene.start('MainScene');
            return;
        }
        const {speaker, text} = this.dialogue[this.dialogueIndex];
        //
        //
        // if (this.dialogueIndex === 0) {
        //     this.max_angry.setAlpha(0);
        //     this.chord_scary.setAlpha(0);
        // }
        
        this.max_normal.setAlpha(0);
        this.chord_normal.setAlpha(0);
        this.max_angry.setAlpha(0);
        this.chord_scary.setAlpha(0);
        this.dialogueText.setText('');
        if (speaker === 'max_normal') {
            this.max_normal.setAlpha(1);
        } else if (speaker === 'chord_normal') {
            this.chord_normal.setAlpha(1);
        } else if (speaker === 'narration') {
            this.max_normal.setAlpha(0);
            this.chord_normal.setAlpha(0);
        } else if (speaker === 'max_angry') {
            this.max_angry.setAlpha(1);
        } else if (speaker === 'chord_scary') {
            this.chord_scary.setAlpha(1);
        }

        if (this.isTyping) {
            this.time.removeAllEvents();
            this.dialogueText.text = text;
            this.isTyping = false;
            this.dialogueIndex++;
        } else {
            let index = 0;
            this.timeEvent = this.time.addEvent({
                delay: 100,
                loop: true,
                callback: () => {
                    this.dialogueText.text += text[index];
                    index++;
                    this.isTyping = true;
                    if (index === text.length) {
                        this.isTyping = false;
                        this.time.removeAllEvents();
                        this.dialogueIndex++;
                    }
                }
            });
        }
    }

}