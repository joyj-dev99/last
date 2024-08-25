const {type} = window.gameConfig;

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // 로딩 바를 표시할 그래픽 객체 생성
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 로딩 바 배경
        const progressBarBg = this.add.graphics();
        progressBarBg.fillStyle(0x222222, 0.8);
        progressBarBg.fillRect(width / 4 - 10, height / 2 - 25, width / 2 + 20, 50);

        // 로딩 바
        const progressBar = this.add.graphics();

        // 로딩 텍스트
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5);

        // 로딩 애니메이션 설정
        let dotCount = 0;
        this.time.addEvent({
            delay: 1000,                // 1초마다 실행
            callback: () => {
                dotCount = (dotCount + 1) % 4;   // 0, 1, 2, 3 순서로 반복
                const dots = '.'.repeat(dotCount);  // 점의 개수를 결정
                loadingText.setText(`Loading${dots}`); // 텍스트 업데이트
            },
            loop: true                  // 무한 반복
        });

        // 퍼센트 텍스트
        const percentText = this.add.text(width / 2, height / 2 + 50, '0%', { fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5);

        // 파일 로딩 이벤트 리스너
        this.load.on('progress', (value) => {
            // 로딩 바 업데이트
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4, height / 2 - 20, (width / 2) * value, 40);

            // 퍼센트 텍스트 업데이트
            percentText.setText(`${parseInt(value * 100)}%`);
        });

        // 로딩 완료 이벤트 리스너
        this.load.on('complete', () => {
            // 로딩이 완료되면 로딩 바와 텍스트를 제거
            progressBar.destroy();
            progressBarBg.destroy();
            loadingText.destroy();
            percentText.destroy();
            this.scene.start('TitleScene');
        });

        // 타이틀 화면
        this.load.image('title_background', 'assets/title/title_background.png');
        this.load.image('title_start_button', 'assets/title/title_start_button.png');
        this.load.image('title_banner', 'assets/title/title_banner.png');

        // 인트로 화면
        this.load.video('letter_video', 'assets/intro/letter.mp4');

        // 플레이어
        this.load.atlas('player', 'assets/player/player.png', 'assets/player/player_atlas.json');
        this.load.animation('playerAnim', 'assets/player/player_anim.json');
        this.load.image('player_stun', 'assets/player/player_stun.png');
        

        // 쿨타임
        this.load.image('button_indicator', 'assets/player/button_indicator.png');
        if (type === 'mobile') {
            this.load.image('arrow_32', 'assets/player/arrow_32.png');
            this.load.image('magic_32', 'assets/player/magic_32.png');
            this.load.image('roll_32', 'assets/player/roll_32.png');
            this.load.image('sword_32', 'assets/player/sword_32.png');
        } else {
            this.load.image('arrow_16', 'assets/player/arrow_16.png');
            this.load.image('magic_16', 'assets/player/magic_16.png');
            this.load.image('roll_16', 'assets/player/roll_16.png');
            this.load.image('sword_16', 'assets/player/sword_16.png');
        }
        
        // 플레이어 공격
        this.load.atlas('slash', 'assets/player/slash.png', 'assets/player/slash_atlas.json');
        this.load.animation('slashAnim', 'assets/player/slash_anim.json');
        this.load.image('arrowImg', 'assets/player/arrow.png');
        this.load.atlas('thunder', 'assets/player/thunder.png', 'assets/player/thunder_atlas.json');
        this.load.animation('thunderAnim', 'assets/player/thunder_anim.json');
        
        // 코드
        this.load.atlas('chord', 'assets/npc/chord/chord.png', 'assets/npc/chord/chord_atlas.json');
        this.load.animation('chordAnim', 'assets/npc/chord/chord_anim.json');

        // 델마
        this.load.atlas('thelma', 'assets/npc/thelma/thelma.png', 'assets/npc/thelma/thelma_atlas.json');
        this.load.animation('thelmaAnim', 'assets/npc/thelma/thelma_anim.json');

        // 초상화
        this.load.image('MaxPotrait', 'assets/npc/potrait/max.png');
        this.load.image('ChordPotrait', 'assets/npc/potrait/chord.png');
        this.load.image('ThelmaPotrait', 'assets/npc/potrait/thelma.png');
        this.load.image('WolfgangPotrait', 'assets/npc/potrait/wolfgang.png');
        this.load.image('NecromancerPotrait', 'assets/npc/potrait/necromancer.png');

        // 상호작용 오브젝트
        this.load.atlas('storeFlag', 'assets/objects/storeFlag/store_flag.png', 'assets/objects/storeFlag/store_flag_atlas.json');
        this.load.atlas('milestone', 'assets/objects/milestone/milestone.png', 'assets/objects/milestone/milestone_atlas.json');
        this.load.animation('milestoneAnim', 'assets/objects/milestone/milestone_anim.json');
        this.load.atlas('bonfire', 'assets/objects/bonfire/bonfire.png', 'assets/objects/bonfire/bonfire_atlas.json');
        this.load.animation('bonfireAnim', 'assets/objects/bonfire/bonfire_anim.json');

        // 상호작용 버튼
        if (type === 'mobile') {
            // 모바일용 버튼
            this.load.image('nextBtnImage', 'assets/ui/Blue_Buttons_Pixel.png');
            this.load.image('buy', 'assets/ui/buy.png');
        } else {
            // 키보드
            this.load.spritesheet('keyboard_extas', 'assets/ui/Keyboard Extras.png', {
                frameWidth: 32, // 각 프레임의 너비
                frameHeight: 16, // 각 프레임의 높이
            });
            this.load.spritesheet('keyboard_letter_symbols', 'assets/ui/Keyboard Letters and Symbols.png', {
                frameWidth: 16, // 각 프레임의 너비
                frameHeight: 16, // 각 프레임의 높이
            });
        }


        // 일반몬스터
        this.load.atlas('tomato', 'assets/monster/tomato/tomato.png', 'assets/monster/tomato/tomato_atlas.json');
        this.load.animation('tomatoAnim', 'assets/monster/tomato/tomato_anim.json');
        this.load.atlas('eggplant', 'assets/monster/eggplant/eggplant.png', 'assets/monster/eggplant/eggplant_atlas.json');
        this.load.animation('eggplantoAnim', 'assets/monster/eggplant/eggplant_anim.json');
        this.load.atlas('apple', 'assets/monster/apple/apple.png', 'assets/monster/apple/apple_atlas.json');
        this.load.animation('appleAnim', 'assets/monster/apple/apple_anim.json');
        this.load.atlas('lemon', 'assets/monster/lemon/lemon.png', 'assets/monster/lemon/lemon_atlas.json');
        this.load.animation('lemonAnim', 'assets/monster/lemon/lemon_anim.json');
        this.load.atlas('fly', 'assets/monster/fly/fly.png', 'assets/monster/fly/fly_atlas.json');
        this.load.animation('flyAnim', 'assets/monster/fly/fly_anim.json');
        this.load.atlas('spider', 'assets/monster/spider/spider.png', 'assets/monster/spider/spider_atlas.json');
        this.load.animation('spiderAnim', 'assets/monster/spider/spider_anim.json');
        this.load.atlas('mini_goblin', 'assets/monster/mini goblin/mini_goblin.png', 'assets/monster/mini goblin/mini_goblin_atlas.json');
        this.load.animation('mini_goblinAnim', 'assets/monster/mini goblin/mini_goblin_anim.json');
        this.load.atlas('ratfolk', 'assets/monster/ratfolk/ratfolk.png', 'assets/monster/ratfolk/ratfolk_atlas.json');
        this.load.animation('ratfolkAnim', 'assets/monster/ratfolk/ratfolk_anim.json');

        this.load.atlas('bugbear', 'assets/monster/bugbear/bugbear.png', 'assets/monster/bugbear/bugbear_atlas.json');
        this.load.animation('bugbearAnim', 'assets/monster/bugbear/bugbear_anim.json');
        this.load.atlas('angel', 'assets/monster/angel/angel.png', 'assets/monster/angel/angel_atlas.json');
        this.load.animation('angelAnim', 'assets/monster/angel/angel_anim.json');
        this.load.atlas('golem', 'assets/monster/golem/golem.png', 'assets/monster/golem/golem_atlas.json');
        this.load.animation('golemAnim', 'assets/monster/golem/golem_anim.json');

        this.load.atlas('golem_wave_front', 'assets/monster/golem/golem_wave/Front/wave_attack_front.png', 'assets/monster/golem/golem_wave/Front/wave_attack_front_atlas.json');
        this.load.atlas('golem_wave_back', 'assets/monster/golem/golem_wave/Back/wave_attack_back.png', 'assets/monster/golem/golem_wave/Back/wave_attack_back_atlas.json');
        this.load.atlas('golem_beam', 'assets/monster/golem/golem_beam/energy_beam.png', 'assets/monster/golem/golem_beam/energy_beam_atlas.json');

        // 보스몬스터
        // 호박
        this.load.atlas('pumpkin', 'assets/monster/pumpkin/pumpkin.png', 'assets/monster/pumpkin/pumpkin_atlas.json');
        this.load.animation('pumpkinAnim', 'assets/monster/pumpkin/pumpkin_anim.json');
        this.load.atlas('seed', 'assets/monster/pumpkin/seed/seed.png', 'assets/monster/pumpkin/seed/seed_atlas.json');
        this.load.animation('seedAnim', 'assets/monster/pumpkin/seed/seed_anim.json');
        this.load.image('pumpkin_shockwave', 'assets/monster/pumpkin/shockwave.png');
        // 고블린
        this.load.atlas('goblin', 'assets/monster/goblin/goblin.png', 'assets/monster/goblin/goblin_atlas.json');
        this.load.animation('goblinAnim', 'assets/monster/goblin/goblin_anim.json');
        this.load.atlas('coin_bag', 'assets/monster/goblin/coin_bag/coin_bag.png', 'assets/monster/goblin/coin_bag/coin_bag_atlas.json');
        this.load.animation('coin_bagAnim', 'assets/monster/goblin/coin_bag/coin_bag_anim.json');
        this.load.image('goblin_shockwave', 'assets/monster/goblin/shockwave.png');
        // 네크로맨서
        this.load.atlas('necromancer', 'assets/monster/necromancer/necromancer.png', 'assets/monster/necromancer/necromancer_atlas.json');
        this.load.animation('necromancerAnim', 'assets/monster/necromancer/necromancer_anim.json');
        this.load.image('necromancer_beam', 'assets/monster/necromancer/beam/beam.png');
        this.load.image('necromancer_magic_circle', 'assets/monster/necromancer/magic_circle.png');
        this.load.image('necromancer_magic_circle2', 'assets/monster/necromancer/magic_circle2.png');
        // 조수
        this.load.atlas('minotaur', 'assets/monster/minotaur/minotaur.png', 'assets/monster/minotaur/minotaur_atlas.json');
        this.load.animation('minotaurAnim', 'assets/monster/minotaur/minotaur_anim.json');
        this.load.atlas('alchemist_transform', 'assets/monster/alchemist/tramsform/alchemist_transform.png', 'assets/monster/alchemist/tramsform/alchemist_transform_atlas.json');
        this.load.animation('alchemist_transformAnim', 'assets/monster/alchemist/tramsform/alchemist_transform_anim.json');
        this.load.atlas('alchemist', 'assets/monster/alchemist/alchemist.png', 'assets/monster/alchemist/alchemist_atlas.json');
        this.load.animation('alchemistAnim', 'assets/monster/alchemist/alchemist_anim.json');
        this.load.image('alchemist_poison', 'assets/monster/alchemist/alchemist_poison.png');
        //볼프강
        this.load.atlas('wolfgang', 'assets/monster/Wolfgang/wolfgang.png', 'assets/monster/Wolfgang/wolfgang_atlas.json');
        this.load.animation('wolfgangAnim', 'assets/monster/Wolfgang/wolfgang_anim.json');
        this.load.atlas('explode_flask', 'assets/monster/Wolfgang/explode_flask/explode_flask.png', 'assets/monster/Wolfgang/explode_flask/explode_flask_atlas.json');
        this.load.animation('explodeFlaskAnim', 'assets/monster/Wolfgang/explode_flask/explode_flask_anim.json');
        this.load.atlas('acid_flask', 'assets/monster/Wolfgang/acid_flask/acid_flask.png', 'assets/monster/Wolfgang/acid_flask/acid_flask_atlas.json');
        this.load.animation('acidFlaskAnim', 'assets/monster/Wolfgang/acid_flask/acid_flask_anim.json');
        this.load.atlas('poison_cloud', 'assets/monster/Wolfgang/poison_cloud__flask/poison_cloud.png', 'assets/monster/Wolfgang/poison_cloud__flask/poison_cloud_atlas.json');
        this.load.animation('poisonCloudFlaskAnim', 'assets/monster/Wolfgang/poison_cloud__flask/poison_cloud_anim.json');
        this.load.image('wolfgang_missile', 'assets/monster/Wolfgang/wolfgang_missile.png')
        this.load.image('wolfgang_missile_hit', 'assets/monster/Wolfgang/wolfgang_missile_hit.png')

        // 미트코인
        this.load.atlas('meatcoin', 'assets/item/meatcoin/meatcoin.png', 'assets/item/meatcoin/meatcoin_atlas.json');
        this.load.animation('meatcoinAnim', 'assets/item/meatcoin/meatcoin_anim.json');

        // 아이템
        this.load.image('item_01', 'assets/item/item_01.png');
        this.load.image('item_02', 'assets/item/item_02.png');
        this.load.image('item_03', 'assets/item/item_03.png');
        this.load.image('item_04', 'assets/item/item_04.png');
        this.load.image('item_05', 'assets/item/item_05.png');
        this.load.image('item_06', 'assets/item/item_06.png');
        this.load.image('item_07', 'assets/item/item_07.png');
        this.load.image('item_08', 'assets/item/item_08.png');
        this.load.image('item_09', 'assets/item/item_09.png');
        this.load.image('item_10', 'assets/item/item_10.png');
        this.load.image('item_11', 'assets/item/arrow_10.png');
        this.load.image('item_12', 'assets/item/item_12.png');

        // 사운드 버튼
        this.load.spritesheet('setting', 'assets/ui/Blue_Buttons_Pixel2.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('status', 'assets/ui/on_off.png', {frameWidth: 32, frameHeight: 16});

        // 하트ui
        this.load.image('no_heart', 'assets/ui/no_heart.png');
        this.load.image('helf_heart', 'assets/ui/helf_heart.png');
        this.load.image('heart', 'assets/ui/heart.png');

        // 진행률ui
        this.load.spritesheet('progressSheet', 'assets/ui/spr_ui_progress_alt_strip5.png', {
            frameWidth: 230,
            frameHeight: 180
        });

        // 맵
        this.load.image("forestTileset", "assets/map/Forest-Prairie Tileset v1.png");
        this.load.image("dungeonTileset", "assets/map/Royal Dungeon Tileset.png");
        this.load.image("officeTileset", "assets/map/Modern_Office_32x32.png");
        this.load.image("roomBuilderTileset", "assets/map/Room_Builder_Office_32x32.png");
        this.load.image("labTileset", "assets/map/Lab Tileset.png");

        this.load.spritesheet('mapButton', 'assets/ui/mapButton.png', {
            frameWidth: 34, // 각 프레임의 너비
            frameHeight: 10, // 각 프레임의 높이
            spacing: 4         // 각 프레임 사이의 간격
        });
        this.load.image('heart_icon', "assets/map/icon/heart_icon.png");
        this.load.image('item_icon', "assets/map/icon/item_icon.png");
        this.load.image('mystery_icon', "assets/map/icon/mystery_icon.png");
        this.load.image('monster_icon', "assets/map/icon/monster_icon.png");
        this.load.image('gift_icon', "assets/map/icon/gift_icon.png");

        this.load.tilemapTiledJSON("stage_01_tutorial", "assets/map/stage_01/stage_01_tutorial.json");
        this.load.tilemapTiledJSON("stage_01_01", "assets/map/stage_01/stage_01_01.json");
        this.load.tilemapTiledJSON("stage_01_02", "assets/map/stage_01/stage_01_02.json");
        this.load.tilemapTiledJSON("stage_01_03", "assets/map/stage_01/stage_01_03.json");
        this.load.tilemapTiledJSON("stage_01_04", "assets/map/stage_01/stage_01_04.json");
        this.load.tilemapTiledJSON("stage_01_05", "assets/map/stage_01/stage_01_05.json");
        this.load.tilemapTiledJSON("stage_01_06", "assets/map/stage_01/stage_01_06.json");
        this.load.tilemapTiledJSON("stage_01_07", "assets/map/stage_01/stage_01_07.json");
        this.load.tilemapTiledJSON("stage_01_08", "assets/map/stage_01/stage_01_08.json");
        this.load.tilemapTiledJSON("stage_01_09", "assets/map/stage_01/stage_01_09.json");
        this.load.tilemapTiledJSON("stage_01_10", "assets/map/stage_01/stage_01_10.json");
        this.load.tilemapTiledJSON("stage_01_boss", "assets/map/stage_01/stage_01_boss.json");

        this.load.tilemapTiledJSON("stage_02_01", "assets/map/stage_02/stage_02_01.json");
        this.load.tilemapTiledJSON("stage_02_02", "assets/map/stage_02/stage_02_02.json");
        this.load.tilemapTiledJSON("stage_02_03", "assets/map/stage_02/stage_02_03.json");
        this.load.tilemapTiledJSON("stage_02_04", "assets/map/stage_02/stage_02_04.json");
        this.load.tilemapTiledJSON("stage_02_05", "assets/map/stage_02/stage_02_05.json");
        this.load.tilemapTiledJSON("stage_02_06", "assets/map/stage_02/stage_02_06.json");
        this.load.tilemapTiledJSON("stage_02_07", "assets/map/stage_02/stage_02_07.json");
        this.load.tilemapTiledJSON("stage_02_08", "assets/map/stage_02/stage_02_08.json");
        this.load.tilemapTiledJSON("stage_02_09", "assets/map/stage_02/stage_02_09.json");
        this.load.tilemapTiledJSON("stage_02_10", "assets/map/stage_02/stage_02_10.json");
        this.load.tilemapTiledJSON("stage_02_boss", "assets/map/stage_02/stage_02_boss.json");

        this.load.tilemapTiledJSON("stage_03_01", "assets/map/stage_03/stage_03_01.json");
        this.load.tilemapTiledJSON("stage_03_02", "assets/map/stage_03/stage_03_02.json");
        this.load.tilemapTiledJSON("stage_03_03", "assets/map/stage_03/stage_03_03.json");
        this.load.tilemapTiledJSON("stage_03_04", "assets/map/stage_03/stage_03_04.json");
        this.load.tilemapTiledJSON("stage_03_05", "assets/map/stage_03/stage_03_05.json");
        this.load.tilemapTiledJSON("stage_03_06", "assets/map/stage_03/stage_03_06.json");
        this.load.tilemapTiledJSON("stage_03_07", "assets/map/stage_03/stage_03_07.json");
        this.load.tilemapTiledJSON("stage_03_08", "assets/map/stage_03/stage_03_08.json");
        this.load.tilemapTiledJSON("stage_03_09", "assets/map/stage_03/stage_03_09.json");
        this.load.tilemapTiledJSON("stage_03_10", "assets/map/stage_03/stage_03_10.json");
        this.load.tilemapTiledJSON("stage_03_boss", "assets/map/stage_03/stage_03_boss.json");

        this.load.tilemapTiledJSON("stage_01_night_map", "assets/map/stage_01/stage_01_night.json");
        this.load.tilemapTiledJSON("stage_02_night_map", "assets/map/stage_02/stage_02_night.json");

        this.load.tilemapTiledJSON("stage_01_store", "assets/map/stage_01/stage_01_store.json");
        this.load.tilemapTiledJSON("stage_02_store", "assets/map/stage_02/stage_02_store.json");
        this.load.tilemapTiledJSON("stage_03_store", "assets/map/stage_03/stage_03_store.json");


        // 노래 로드
        // 배경음악
        this.load.audio('title_bgm', 'assets/suno/title_song_of_hero.wav');
        this.load.audio('song_letter', 'assets/suno/song_letter.wav');
        this.load.audio("forest_default", "assets/suno/battle_1.wav");
        this.load.audio("forest_boss", "assets/audio/background/forest/forest_boss.mp3");
        this.load.audio("dungeon_default", "assets/audio/background/dungeon/dungeon_default.mp3");
        this.load.audio("dungeon_boss", "assets/audio/background/dungeon/dungeon_boss.mp3");
        this.load.audio("room_default", "assets/audio/background/room/room_default.mp3");
        this.load.audio("room_boss", "assets/audio/background/room/room_boss.mp3");
        this.load.audio("night_default", "assets/audio/background/night/night_default.mp3");
        // 효과음
        this.load.audio("get_item", "assets/audio/get_item.wav");
        this.load.audio("coin_drop", "assets/audio/coin_drop.wav");
        this.load.audio("potion_drop", "assets/audio/potion_drop.wav");
        this.load.audio("monster_damage1", "assets/audio/monster_damage1.wav");
        this.load.audio("monster_death1", "assets/audio/monster_death1.wav");
        this.load.audio("monster_death2", "assets/audio/monster_death2.wav");
        this.load.audio("small_shot", "assets/audio/small_shot.wav");
        this.load.audio("monster_clear", "assets/audio/팡파르 나팔소리.mp3");
        this.load.audio("boss_monster_clear", "assets/audio/노래방 100점.mp3");

        this.load.audio('sound_player_hit', 'assets/audio/sound_player_hit.mp3');
        this.load.audio('sound_player_move', 'assets/audio/sound_player_move.mp3');
        this.load.audio('sound_player_death', 'assets/audio/sound_player_death.mp3');
        this.load.audio('sound_player_damage', 'assets/audio/sound_player_damage.mp3');
        this.load.audio('sound_player_bow', 'assets/audio/sound_player_bow.mp3');
        this.load.audio('sound_player_spell', 'assets/audio/sound_player_spell.mp3');
        this.load.audio('sound_player_roll', 'assets/audio/sound_player_roll.wav'); 

        this.load.audio("pumpkin_shockwave", "assets/audio/pumpkin_shockwave.wav");
        this.load.audio("pumpkin_seed", "assets/audio/pumpkin_seed.wav");

        //결과
        this.load.image('gameOverImage', 'assets/Game over.png');
        this.load.image('gameClearImage', 'assets/Game clear.png');

        //튜토리얼
        this.load.image('right_sign', 'assets/tutorial/sign/right_sign-removebg-preview.png' );
        if (type === 'mobile') {
            this.load.image('pointer', 'assets/ui/finger_down.png');
        } else {
            // 튜토리얼 keyboard 이미지 파일
            this.load.spritesheet('keyboard_shift_key', 'assets/tutorial/keyboard/shift_key.png', { frameWidth: 32, frameHeight: 16 });
            this.load.atlas('up_key', 'assets/tutorial/keyboard/up_key.png', 'assets/tutorial/keyboard/up_key_anim.json');
            this.load.atlas('down_key', 'assets/tutorial/keyboard/down_key.png', 'assets/tutorial/keyboard/down_key_anim.json');
            this.load.atlas('left_key', 'assets/tutorial/keyboard/left_key.png', 'assets/tutorial/keyboard/left_key_anim.json');
            this.load.atlas('right_key', 'assets/tutorial/keyboard/right_key.png', 'assets/tutorial/keyboard/right_key_anim.json');
            this.load.atlas('z_key', 'assets/tutorial/keyboard/z_key.png', 'assets/tutorial/keyboard/z_key_anim.json');
            this.load.atlas('shift_key', 'assets/tutorial/keyboard/shift_key.png', 'assets/tutorial/keyboard/shift_key_anim.json');
            this.load.atlas('x_key', 'assets/tutorial/keyboard/x_key.png', 'assets/tutorial/keyboard/x_key_atlas.json');
            this.load.atlas('c_key', 'assets/tutorial/keyboard/c_key.png', 'assets/tutorial/keyboard/c_key_atlas.json');
        }
    }
}