(function(){
    var config = {
        width: 640,
        height: 480,
        renderer: Phaser.CANVAS,
        parent: "",
        state: null,
        transparent: false,
        antialias: false,
        
        levels: [ "level1", "level2", "level3" ],
    }
    
    var game = new Phaser.Game( config );

    for( var i in config.levels ){                
        game.state.add( config.levels[i], new Phaser.TetraLevel( game, config.levels[i] ), i == 0 );        
    }
    
})();


