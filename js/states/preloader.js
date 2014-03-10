/*
 * TetraPreloader is inherits Phaser.State
 */
Phaser.TetraPreloader = function( game ){
    this.game = game;
    
    this.preload = function() {
        // just shows that preloading in progress
        this.game.add.text( this.game.world.centerX, this.game.world.centerY, "Загрузка...", { fill: "#FFF" } ).anchor.setTo( 0.5, 0.5 );
        
        // load images
        this.game.load.image('tileset', 'assets/tileset.png');
        
        // load maps
        this.game.config.levels.forEach( function( levelName ){
            this.game.load.tilemap( levelName, 'assets/' + levelName + '.json', null, Phaser.Tilemap.TILED_JSON);            
        }.bind( this ));
            
        // load sprites
        this.game.load.spritesheet('hero', 'assets/hero-sprite.png', 32, 32);
    }

    this.create = function() {
        this.game.state.start( this.game.config.levels[0] );
    }
}

Phaser.TetraPreloader.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraPreloader.prototype.constructor = Phaser.MyState;


