export default class TextIndicator {

    constructor() {
    }

    // 텍스트 객체 생성
    static createText(scene, x, y, content, style) {
        let text = scene.add.text(x, y, content, style);
        return text;
    }

    static setScrollFactorText(text) {
        // 계속 상단에 고정되도록 UI 레이어 설정
        text.setScrollFactor(0);
    }

    static setText(text,content) {
        text.setText(content);
    }

    // 텍스트 객체 제거
    static removeText(text) {

        if (text) {
            text.destroy();
            // this.text = null;
        }
    }

}