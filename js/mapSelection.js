export function mapPreload(scene) {
    scene.load.image('heart_icon', "assets/map/icon/heart_icon.png");
    scene.load.image('skill_icon', "assets/map/icon/skill_icon.png");
    scene.load.image('item_icon', "assets/map/icon/item_icon.png");
    scene.load.image('mystery_icon', "assets/map/icon/mystery_icon.png");
    scene.load.image('skull_icon', "assets/map/icon/skull_icon.png");
    scene.load.image('gift_icon', "assets/map/icon/gift_icon.png");
    
    scene.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
    scene.load.tilemapTiledJSON("stage_01_tutorial", "assets/map/stage_01/stage_01_tutorial.json");
    scene.load.tilemapTiledJSON("stage_01_01", "assets/map/stage_01/stage_01_01.json");
    scene.load.tilemapTiledJSON("stage_01_02", "assets/map/stage_01/stage_01_02.json");
    scene.load.tilemapTiledJSON("stage_01_03", "assets/map/stage_01/stage_01_03.json");
    scene.load.tilemapTiledJSON("stage_01_04", "assets/map/stage_01/stage_01_04.json");
    scene.load.tilemapTiledJSON("stage_01_05", "assets/map/stage_01/stage_01_05.json");
    scene.load.tilemapTiledJSON("stage_01_06", "assets/map/stage_01/stage_01_06.json");
    scene.load.tilemapTiledJSON("stage_01_07", "assets/map/stage_01/stage_01_07.json");
    scene.load.tilemapTiledJSON("stage_01_08", "assets/map/stage_01/stage_01_08.json");
    scene.load.tilemapTiledJSON("stage_01_09", "assets/map/stage_01/stage_01_09.json");
    scene.load.tilemapTiledJSON("stage_01_10", "assets/map/stage_01/stage_01_10.json");
}

export const mapAttributes = {
    1: [1, 2, 3, 4],  // 속성 1~4번 중 하나 랜덤 선택
    2: [1, 2, 3, 4],
    3: [1, 2, 3, 4],
    4: [1, 2, 3, 4],
    5: [1, 2, 3, 4],
    6: [1, 2, 3, 4],
    7: [1, 2, 3, 4],
    8: [5],  // 속성 5번
    9: [5],  // 속성 5번
    10: [6]   // 속성 6번
};

export const attributeIcons = {
    1: "heart_icon",  // 하트 드랍
    2: "skill_icon",  // 스킬 드랍
    3: "item_icon",   // 아이템 드랍
    4: "mystery_icon",  // 알 수 없는 보상
    5: "skull_icon",  // 몬스터 2배
    6: "gift_icon"    // 아이템만 드랍
};

// Dialog 클래스를 전역에서 사용할 수 있도록 선언
let dialog;

export function showMapSelectionUI(scene, mapSelections, onSelect, onCancel) {
    console.log("Map Selection UI is being shown.");

    let selectedIndex = 0;
    const mapContainers = [];

    dialog = scene.dialog;
    // 다이알로그가 스페이스 키를 무시하도록 설정
    dialog.setIgnoreSpaceKey(true);

    // 카메라의 뷰포트를 기준으로 다이얼로그 박스 중앙 위치 계산
    const camera = scene.cameras.main;
    const centerX = camera.scrollX + camera.width / 2;
    const centerY = camera.scrollY + camera.height / 2 - 50; // 버튼들을 위로 이동
    
    // 길 텍스트 설정
    const paths = ["오른쪽 길", "가운데 길", "왼쪽 길"];
    
    // 패딩 설정
    const textPadding = 20;
    const iconPadding = 10;

    mapSelections.forEach((selection, index) => {
        const { mapNumber, iconKey } = selection;
        console.log('선택지 생성 : ', index, mapNumber, iconKey);

        // 스프라이트 버튼 생성
        const buttonSprite = scene.add.sprite(0, 0, 'mapButton', 0).setOrigin(0.5, 0.5);
        buttonSprite.setDisplaySize(140, 35); // 크기 조정

        // 텍스트 생성 및 위치 조정
        const pathText = paths[index];
        const text = scene.add.text(-buttonSprite.displayWidth / 4 + textPadding, 0, pathText, {
            fontSize: '18px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        // 아이콘 생성 및 위치 조정 (아이콘이 있는 경우에만)
        let icon = null;
        if (iconKey) {
            icon = scene.add.image(buttonSprite.displayWidth / 4 + iconPadding, 0, iconKey);
        }

        // 컨테이너에 버튼, 텍스트, 아이콘 추가
        const buttonContainer = scene.add.container(centerX, centerY - 50 + index * 50, [buttonSprite, text]);
        if (icon) {
            buttonContainer.add(icon);
        }
        buttonContainer.setSize(buttonSprite.displayWidth, buttonSprite.displayHeight);  // 컨테이너의 크기 설정
        buttonContainer.setDepth(200);     // 다른 요소들보다 위에 표시되도록 설정

        mapContainers.push(buttonContainer);
    });

    // UI가 완전히 렌더링된 후 플래그 설정
    scene.time.delayedCall(100, () => {
        scene.isMapSelectionReady = true;
    });

    const updateSelection = () => {
        mapContainers.forEach((container, index) => {
            const buttonSprite = container.getAt(0); // 첫 번째 요소가 스프라이트 버튼임
            buttonSprite.setFrame(index === selectedIndex ? 1 : 0);
        });
    };

    // UI가 처음 표시될 때 첫 번째 버튼을 자동으로 선택
    updateSelection();

    const handleKeyDown = (event) => {
        if (!scene.isMapSelectionReady) return;
        if (event.code === 'ArrowUp') {
            selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : mapSelections.length - 1;
            updateSelection();
        } else if (event.code === 'ArrowDown') {
            selectedIndex = (selectedIndex < mapSelections.length - 1) ? selectedIndex + 1 : 0;
            updateSelection();
        } else if (event.code === 'Space') {
            onSelect(mapSelections[selectedIndex].mapNumber, mapSelections[selectedIndex].mapAttribute);
            cleanup();
        } else if (event.code === 'Escape') {
            onCancel();
            cleanup();
        }
    };

    scene.input.keyboard.on('keydown', handleKeyDown);

    const cleanup = () => {
        mapContainers.forEach(container => {
            container.destroy();
        });
        scene.input.keyboard.off('keydown', handleKeyDown);
        
        if (dialog.isVisible) {
            dialog.hideDialogModal();
        }
        // 맵 선택이 끝나면 다이알로그가 다시 스페이스 키를 처리하도록 설정    
        dialog.setIgnoreSpaceKey(false);
    };

    // 대화창을 화면 하단에 표시
    dialog.showDialogModal([{ name: '코드', portrait: 'ChordPotrait', message: '어느 길로 이동할까요?' }]);
    dialog.addInstructions('map');
}
