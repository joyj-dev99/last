import MainScene from './MainScene.js';
import NightScene from './NightScene.js';
import IntroScene from './IntroScene.js';
import TitleScene from './TitleScene.js';
import BattleResultScene from './BattleResultScene.js';
import StoreScene from './StoreScene.js';
import PreloadScene from './PreloadScene.js';

const config = {
    // 32*32px 타일 기준 세로 8칸, 가로 11.1칸
    width: 454,
    height: 256,
    backgroundColor: '#000000',
    pixelArt: true, // 픽셀 아트 스타일 활성화, 화질 깨지는 걸 막음
    type: Phaser.AUTO,
    parent: 'game',
    // scene: [MainScene ,TitleScene,  StoreScene, IntroScene, BattleResultScene, NightScene],
    scene: [PreloadScene, TitleScene,MainScene ,  StoreScene, IntroScene, BattleResultScene, NightScene],
    // scene: [ MainScene],
    scale: {
        // 다양한 디바이스와 해상도에 맞춰지도록
        mode: Phaser.Scale.FIT,
        // 화면 중앙에 오도록 설정
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false ,
            gravity: {y: 0},
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin.default,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
        ,
        global: [{
            key: 'rexVirtualJoystick',
            plugin: rexvirtualjoystickplugin,
            start: true
        }]
    }
}

new Phaser.Game(config);