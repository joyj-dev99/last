export default class SpeechBubble extends Phaser.GameObjects.Container{
    constructor(scene, contents, onDestroyCallback, name) {

        // 화면 크기 가져오기
        const { width, height } = scene.cameras.main;

        // 화면 하단 중앙에 위치 설정
        const bubbleX = width / 2;
        const bubbleY = height - 40; // 하단에서 약간 위로 올리기

        super(scene, bubbleX, bubbleY); // Container 생성자 호출

        this.scene = scene;
        this.contents = contents;
        this.onDestroyCallback = onDestroyCallback;
        this.name = name;
        this.whosImg = `${name}Image`;

        // 말풍선과 텍스트 생성
        this.createBubble();

        // 스크롤에 영향을 받지 않도록 설정
        this.setScrollFactor(0);

        // 씬에 추가
        this.scene.add.existing(this);

        // 컨테이너 전체에 대한 클릭 이벤트 설정
        this.setSize(this.bubble.width * this.bubble.scaleX, this.bubble.height * this.bubble.scaleY);
        this.setInteractive({ useHandCursor: true });
        this.on('pointerdown', () => this.destroyBubble());
    }

    //static : 리소스 로딩을 특정 객체의 인스턴스와 무관하게 클래스 전체의 관점에서 수행
    static preload(scene){
        // Load the speech bubble image
        scene.load.image('speechBubble', 'assets/ui/default_dialogue_box.jpg');

        // Load the player image
        scene.load.image('MaxImage', 'assets/intro/max_normal.png'); 
        scene.load.image('ChordImage', 'assets/intro/chord_normal.png'); 
    }
    
    createBubble() {
        // 말풍선 이미지 생성 및 위치 설정
        this.bubble = this.scene.add.image(0, 0, 'speechBubble').setScale(0.185);
        // Container 내 상대적 위치

        // 텍스트 객체 생성 및 위치 설정
        this.text = this.scene.add.text(0, 0, this.contents, {
            fontFamily: 'GalmuriMono7, sans-serif',
            fontSize: '8px', //8배수 단위로 늘어나야 잘 보임
            fill: '#000000',
            resolution:2
        });
        this.text.setOrigin(0.35, 0.5); // 텍스트를 오른쪽에 정렬

        // 인물 이미지 추가 및 위치 설정
        this.manImage = this.scene.add.image(-90, 0, this.whosImg).setScale(0.35);
        
        // 인물 이름
        this.manName = this.scene.add.text(-70, 15, this.name, {
            fontFamily: 'GalmuriMono14, sans-serif',
            fontSize: '15px', //15배수 단위로 늘어나야 잘 보임
            fontWeight: 'bold',
            fill: '#000000',
            resolution:2
        });


        // Container에 말풍선, 텍스트, 그리고 플레이어 이미지 추가
        this.add([this.bubble, this.text, this.manImage, this.manName]);

    }

    destroyBubble() {
        this.destroy(); // Container 자체를 제거
        if (this.onDestroyCallback) {
            this.onDestroyCallback(); // 콜백 함수가 있으면 호출
        }
    }
}
