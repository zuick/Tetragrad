(function(){
    var config = {
        width: 640,
        height: 640,
        renderer: Phaser.CANVAS,
        parent: "",
        state: null,
        transparent: false,
        antialias: false,
        
        levels: [ 'level2', 'level2' ],
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
            deathTimeout: 1000
        },
        
        enemyBlock: {
            tileIndex: 18,
            spritesheet: 'enemy-block',
            bounce: 0.05,
            gravity: 400,
            speed: 180,
            jump: 390,
            deathTimeout: 1000
        }
    }
    
    var game = new Phaser.Game( config );
    
    
    
    // add autostarting preloader state
    game.state.add( "preloader", new Phaser.TetraPreloader( game ), true );
    
    // add levels to game state manager
    for( var i in config.levels ){
        game.state.add( config.levels[i], new Phaser.TetraLevel( game, config.levels[i] ) );        
    }
    
})();


