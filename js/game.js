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
                title: 'В самом начале...'
            },
            {
                name: 'level2',
                title: 'Позже'
            }
        ],
        
        collidableTiles: [ 2, 5, 6, 7, 8, 9, 10, 11, 12 ],
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
            speed: 40,
            jump: 250,
            deathTimeout: 1000,
            enemyHit: 250
        },
        
        livesSpriteLength: 6,
        introDelay: 1000
    }
    
    var game = new Phaser.Game( config );

    // add autostarting preloader state
    game.state.add( "preloader", new Phaser.TetraPreloader( game ), true );
    
    // add levels to game state manager
    for( var i in config.levels ){
        game.state.add( config.levels[i].name + '-intro', new Phaser.TetraLevelIntro( game, config.levels[i].name ) );        
        game.state.add( config.levels[i].name, new Phaser.TetraLevel( game, config.levels[i].name ) );
    }
    
})();


