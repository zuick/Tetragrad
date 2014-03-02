/*
 * TetraLevel is inherits Phaser.State
 */
Phaser.TetraLevel = function( game, levelName ){
    this.game = game;
    this.levelName = levelName;

    this.create = function() {
        
        this.game.input.onDown.add( this.nextLevel, this);
        
        this.game.stage.backgroundColor = '#000';
        
        this.map = this.game.add.tilemap( levelName );
        this.map.addTilesetImage('tileset', 'tileset');
        this.map.setCollision( this.game.config.collidableTiles );
        
        this.ground = this.map.createLayer('ground');
        this.ground.resizeWorld();
        
        this.shapeLayer = this.map.createLayer( 'shape' );
        this.shapeLayer.resizeWorld();
        
        this.shape = new Phaser.TetraShape( this.game, this.map, 300 );
        this.shape.setShape( 'z', 10, 2, 'a', 11 );
        this.shape.start();
        
        //this.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR ).onDown.add( this.randomTile, this );
        
    }
    
    
    this.nextLevel = function(){
        var levels = this.game.config.levels;
        var currentIndex = levels.indexOf( this.game.state.current );
        if( currentIndex < levels.length - 1 ) this.game.state.start( levels[ currentIndex + 1 ] );
        else this.game.state.start( levels[ 0 ] );
    }
}

Phaser.TetraLevel.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraLevel.prototype.constructor = Phaser.MyState;
