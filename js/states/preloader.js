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
        this.game.config.levels.forEach( function( level ){
            this.game.load.tilemap( level.name, 'assets/' + level.name + '.json', null, Phaser.Tilemap.TILED_JSON);            
        }.bind( this ));
            
        // load sprites
        this.game.load.spritesheet('hero', 'assets/hero-sprite.png', 32, 32);
        this.game.load.spritesheet('enemy-block', 'assets/enemy-block-sprite.png', 32, 32);
        this.game.load.spritesheet('lives', 'assets/lives.png', 48, 48);
        this.game.load.spritesheet('door', 'assets/door.png', 32, 32);
    }

    this.create = function() {
        this.game.state.start( this.game.config.levels[0].name + '-intro', true, true );
    }
}

Phaser.TetraPreloader.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraPreloader.prototype.constructor = Phaser.MyState;


