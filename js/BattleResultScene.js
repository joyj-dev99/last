export default class BattleResultScene extends Phaser.Scene {
    constructor() {
        super("BattleResultScene");
    }

    init(data) {
        this.result = data.result;
    }

    preload() {
        this.load.image('gameOverImage', 'assets/Game over.png');
        this.load.image('gameClearImage', 'assets/Game clear.png');
    }

    create() {
        console.log('BattleResultScene 시작');

        // 배경 색상 설정 (원하는 대로 변경 가능)
        this.cameras.main.setBackgroundColor('#000000');
        this.textColor = "#ffffff"

        console.log(this.result);
        let result;
        if (this.result === 'death') {
            this.textColor = "#ff0000";
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'gameOverImage').setOrigin(0.5);
        } else if (this.result === 'clear') {
            this.textColor = "#0000ff";
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'gameClearImage').setOrigin(0.5);
        }

        // 결과 텍스트를 화면 중앙에 추가 (텍스트 크기 조절)
        

        // 버튼 스타일 (폰트 크기 조절)
        const buttonTextStyle = { font: "24px Arial", fill: "#ffffff" };

        const stageNumber = 1;
        const mapNumber = 1;
        const playerStatus = null;

        // 다시 시작 버튼
        const restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, '다시 시작', buttonTextStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainScene', {stageNumber, mapNumber, playerStatus}); // 전투 장면으로 다시 시작 (필요에 따라 조정)
            })
            .on('pointerover', () => {
                restartButton.setScale(1.05); // 마우스를 올리면 크기가 5% 커짐
                restartButton.setStyle({ fill: this.textColor }); // 텍스트 색상을 빨간색으로 변경
            })
            .on('pointerout', () => {
                restartButton.setScale(1); // 마우스를 떼면 원래 크기로 돌아감
                restartButton.setStyle({ fill: "#ffffff" }); // 텍스트 색상을 원래 색상으로 복원
            });

        // 처음으로 버튼
        const mainMenuButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, '처음으로', buttonTextStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('TitleScene', {stageNumber, mapNumber, playerStatus}); // 메인 메뉴 장면으로 이동 (필요에 따라 조정)
            })
            .on('pointerover', () => {
                mainMenuButton.setScale(1.05); // 마우스를 올리면 크기가 5% 커짐
                mainMenuButton.setStyle({ fill: this.textColor }); // 텍스트 색상을 빨간색으로 변경
            })
            .on('pointerout', () => {
                mainMenuButton.setScale(1); // 마우스를 떼면 원래 크기로 돌아감
                mainMenuButton.setStyle({ fill: "#ffffff" }); // 텍스트 색상을 원래 색상으로 복원
            });
    }

    update() {

    }
}