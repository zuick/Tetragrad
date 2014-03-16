(function(){
    var config = {
        width: 640,
        height: 640,
        renderer: Phaser.CANVAS,
        parent: "",
        state: null,
        transparent: false,
        antialias: false,
        
        levels: [
            { 
                name: 'level1',
                title: 'Глава 1.\nДобраться до города.',
                enemies: { disable: true },
                shapes: false
            },
            {
                name: 'level2',
                title: 'Глава 1.\nДобраться до города живым.',
                enemies: { 
                    disable: false,
                    maxItems: 8,
                    interval: 600
                },
                shapes: false
            },
            {
                name: 'level3',
                title: 'Глава 2.\nДобро Пожаловать в Тетраград!',
                enemies: { 
                    disable: false,
                    maxItems: 14,
                    interval: 1000
                },
                shapes: false
            },
            {
                name: 'level4',
                title: 'Глава 3.\nВысылаем подмогу!\nОсторожно, головааа!',
                enemies: { 
                    disable: false,
                    maxItems: 12,
                    interval: 600
                },
                shapes: true
            },
            {
                name: 'level5',
                title: 'Глава 3.\nЗадавите их всех!',
                enemies: { 
                    disable: false,
                    maxItems: 40,
                    interval: 200
                },
                shapes: true
            },
        ],
        
        collidableTiles: [ 2, 5, 6, 7, 8, 9, 10, 11, 12, 21, 22, 23, 24 ],
        fallingShapesTiles: [ 9, 10, 11, 12 ],
        fallingShapesTypes: [ 'i', 'l', 'j', 's','z','o','t'],
        fallingShapesRotates: [ 'a', 'b', 'c', 'd'],
        
        hero: {
            tileIndex: 17,
            spritesheet: 'hero',
            bounce: 0.01,
            gravity: 1000,
            speed: 180,
            jump: 390,
            lives: 5,
            deathTimeout: 1000,
        },
        
        enemyBlock: {
            tileIndex: 18,
            spritesheet: 'enemy-block',
            bounce: 0.05,
            gravity: 500,
            speed: 50,
            jump: 270,
            deathTimeout: 1000,
            enemyHit: 250
        },

        door:{
            tileIndex: 4,
        },
        
        livesSpriteLength: 6,
        introDelay: 500,
        bumperDelay: 1000
    }
    
    var game = new Phaser.Game( config );

    // add autostarting preloader state
    game.state.add( "bumper", new Phaser.TetraGameBumper( game, config.levels[0].name ));
    game.state.add( "preloader", new Phaser.TetraPreloader( game ), true );
    
    // add levels to game state manager
    for( var i in config.levels ){
        game.state.add( config.levels[i].name + '-intro', new Phaser.TetraLevelIntro( game, config.levels[i].name ) );        
        game.state.add( config.levels[i].name, new Phaser.TetraLevel( game, config.levels[i] ) );
    }
    
})();


