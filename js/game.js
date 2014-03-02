(function(){
    var config = {
        width: 640,
        height: 480,
        renderer: Phaser.CANVAS,
        parent: "",
        state: null,
        transparent: false,
        antialias: false,
        
        levels: [ 'level1', 'level2' ],
        collidableTiles: [ 2, 5, 6, 7, 8, 9, 10, 11, 12 ],
        fallingShapesTiles: [ 9, 10, 11, 12 ]
    }
    
    var game = new Phaser.Game( config );
    
    // add autostarting preloader state
    game.state.add( "preloader", new Phaser.TetraPreloader( game ), true );
    
    // add levels to game state manager
    for( var i in config.levels ){                
        game.state.add( config.levels[i], new Phaser.TetraLevel( game, config.levels[i] ) );        
    }
    
})();


