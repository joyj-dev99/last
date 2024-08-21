// Dialog 클래스를 전역에서 사용할 수 있도록 선언
let dialog;

export function showMapSelectionUI(scene, selectedMaps, onSelect, onCancel) {
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

    paths.forEach((pathText, index) => {
        // 스프라이트 버튼 생성
        const buttonSprite = scene.add.sprite(0, 0, 'mapButton', 0).setOrigin(0.5, 0.5);
        buttonSprite.setDisplaySize(140, 35); // 크기 조정

        // 텍스트 생성 및 위치 조정
        const text = scene.add.text(-buttonSprite.displayWidth / 4 + textPadding, 0, pathText, {
            fontSize: '18px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        // 아이콘 생성 및 위치 조정 (아이콘이 있는 경우에만)
        const iconInfo = pathIcons.find(p => p.text === pathText);
        let icon = null;
        if (iconInfo && iconInfo.icon) {
            icon = scene.add.image(buttonSprite.displayWidth / 2.5 - iconPadding, 0, iconInfo.icon);
            icon.setScale(0.7);  // 아이콘 크기 조절
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
            selectedIndex = index;
            console.log('index : '+index);
            onSelect(selectedMaps[selectedIndex]);
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
            selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : paths.length - 1;
            updateSelection();
        } else if (event.code === 'ArrowDown') {
            selectedIndex = (selectedIndex < paths.length - 1) ? selectedIndex + 1 : 0;
            updateSelection();
        } else if (event.code === 'Space') {
            onSelect(selectedMaps[selectedIndex]);
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
