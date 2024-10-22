export const mapAttributes = {
    1: [1, 2, 3],  // 속성 1~3번 중 하나 랜덤 선택
    2: [1, 2, 3],
    3: [1, 2, 3],
    4: [1, 2, 3],
    5: [1, 2, 3],
    6: [1, 2, 3],
    7: [1, 2, 3],
    8: [4],  
    9: [4],  
    10:[5] 
};

export const attributeIcons = {
    1: "heart_icon",  // 하트 드랍
    2: "item_icon",   // 아이템 드랍
    3: "mystery_icon",  // 알 수 없는 보상
    4: "monster_icon",  // 몬스터 2배
    5: "gift_icon"    // 아이템만 드랍
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
    const centerY = camera.scrollY + camera.height / 2 - 18; // 버튼들을 위로 이동
    
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
        const buttonContainer = scene.add.container(centerX, centerY - 50 + index * 40, [buttonSprite, text]);
        if (icon) {
            buttonContainer.add(icon);
        }
        buttonContainer.setSize(buttonSprite.displayWidth, buttonSprite.displayHeight);  // 컨테이너의 크기 설정
        buttonContainer.setDepth(200);     // 다른 요소들보다 위에 표시되도록 설정

        buttonContainer.setInteractive({ useHandCursor: true });
        buttonContainer.on('pointerdown', () => {
            const selectedMap = mapSelections[index];
            console.log('테스트중 : ', selectedMap);
            
            onSelect(selectedMap.mapNumber, selectedMap.attributeNumber);
            cleanup();
        })
        .on('pointerover', () => {
            buttonContainer.setScale(1.05); // 마우스를 올리면 크기가 5% 커짐
        })
        .on('pointerout', () => {
            buttonContainer.setScale(1); // 마우스를 떼면 원래 크기로 돌아감
        });

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
            const selectedMap = mapSelections[selectedIndex];
            console.log('테스트중 : ', selectedMap);
            
            onSelect(selectedMap.mapNumber, selectedMap.attributeNumber);
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
