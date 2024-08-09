import Player from "./Player.js";
import Chord from "./character/Chord.js";

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({key: 'IntroScene'});
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.dialogue = [
            // {speaker: 'max_normal', text: "내용1내용1 내용1내용1"},
            // {speaker: 'max_normal', text: "내용2내용2 내용2내용2 내용2내용2"},
            // {speaker: 'chord_normal', text: "내용3내용3 내용3내용3 내용3내용3내용3"},
            // {speaker: 'chord_normal', text: "내용4내용4 내용4내용4 내용4내용4내용4"},
            // {speaker: 'chord_normal', text: "내용5"},
            // {speaker: 'max_normal', text: "내용6"},
            // {speaker: 'narration', text: "나래이션1나래이션1 나래이션1나래이션1"},
            // {speaker: 'narration', text: "나래이션2나래이션2 나래이션2나래이션2"},
            // {speaker: 'max_angry', text: "내용7"},
            // {speaker: 'chord_scary', text: "내용8"},
            // {speaker: 'chord_scary', text: "내용9"},
            // {speaker: 'max_angry', text: "내용10"},
            // {speaker: 'max_angry', text: "내용11"}
            {speaker: 'chord_scary', text: "맥스, 제발 이러지 마. 난 진짜 몰랐다고! 볼프강 박사가 이런 짓을 할 줄은 꿈에도 몰랐어."},
            {speaker: 'max_angry', text: "닥쳐, 코드. 네 말만 믿고 내 전 재산을 날렸어. 그걸로도 모자라서 이젠 괴물들까지 상대해야 한다니."},
            {speaker: 'chord_scary', text: "알았어, 알았어! 내가 너한테 정보를 줄게. "},
            {speaker: 'chord_scary', text: "볼프강 박사가 있는 연구소는 저쪽 숲을 지나야 해. 하지만 그곳으로 가려면..."},
            {speaker: 'max_angry', text: "변명할 시간 없어. 어디든 데려가."},
            {speaker: 'max_angry', text: "네가 볼프강 박사에게 날 팔아넘겼다는 게 확인되면, 네 목숨도 여기까지야."},
            {speaker: 'chord_scary', text: "정말이야, 난 너를 팔 생각 없었어! 그냥 정보만 주면 된다고 했다고!"},
            {speaker: 'max_angry', text: "네가 나한테 한 일이랑, 볼프강이 마을에 한 일을 생각해봐."},
            {speaker: 'max_angry', text: "그 괴물들이 원래는 사람이었다고. 네가 책임져야 할 몫이 커졌다고."},
            {speaker: 'chord_scary', text: "제발, 맥스. 여기서 우린 둘 다 같은 편이야. 너도 이 사기를 막고 싶잖아!"},
            {speaker: 'max_angry', text: "알겠어, 당분간은 같은 편이라고 생각하자."},
            {speaker: 'max_angry', text: "하지만 방심하지 마. 볼프강을 찾고 나면 그때 가서 결판을 내자고."},
            {speaker: 'chord_normal', text: "알겠어. 일단 볼프강을 잡고 마을을 구하자. 모험을 떠날 시간이야!"},

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