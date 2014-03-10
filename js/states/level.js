/*
 * TetraLevel is inherits Phaser.State
 */
Phaser.TetraLevel = function( game, levelName ){
    this.game = game;
    this.levelName = levelName;

    this.create = function() {
        this.game.stage.backgroundColor = '#000';
        this.game.stage.fullScreenScaleMode = Phaser.StageScaleMode.SHOW_ALL;
        Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        
        this.tools = new Phaser.TetraTools( this.game );
        
        this.setMap();
       
        this.setTetraShape();
                
        this.setHero();
        
        this.setControls();
    }
    
    this.update = function(){
        // Physics
        
        this.game.physics.collide(this.hero.sprite, this.ground);
        //this.game.physics.collide(this.hero.sprite, this.shapeLayer );
        
        // Tetrashape controls
        if( this.keys.shapeFast.isUp ) this.shape.normalFalling();
        if( ( this.keys.shapeLeft.isUp || 
                ( !this.keys.shapeLeft.isUp && !this.keys.shapeLeft.isDown ) ) && 
            ( this.keys.shapeRight.isUp ||
                ( !this.keys.shapeRight.isUp && !this.keys.shapeRight.isDown ) ) ) 
            this.shape.stopMoving();
        
                
        this.hero.update( this.cursors );
    }
    this.nextLevel = function(){
        var levels = this.game.config.levels;
        var currentIndex = levels.indexOf( this.game.state.current );
        if( currentIndex < levels.length - 1 ) this.game.state.start( levels[ currentIndex + 1 ] );
        else this.game.state.start( levels[ 0 ] );
    }
    
    this.restartGame = function(){
        this.game.state.start( this.game.config.levels[ 0 ] );
    }
    
    
    this.setMap = function(){
        this.map = this.game.add.tilemap( levelName );
        this.map.addTilesetImage('tileset', 'tileset');
        this.map.setCollision( this.game.config.collidableTiles, true, "ground" );
        this.map.setCollision( this.game.config.collidableTiles, true, "shape" );
        
        this.background = this.map.createLayer('background');
        this.ground = this.map.createLayer('ground');
        this.shapeLayer = this.map.createLayer( 'shape' );
        
        this.background.resizeWorld();
    }
    
    this.setTetraShape = function(){
        this.shape = new Phaser.TetraShape( this.game, this.map, {}, function(){ this.restartGame() }.bind(this) );
        this.shape.start();        
    }
    
    this.setHero = function(){
        var heroXY = this.tools.getObjectsPositionFromMap( this.map, "characters", this.game.config.hero.tileIndex )[0];
        this.hero = new Phaser.TetraHero( heroXY.x * this.map.tileWidth, heroXY.y * this.map.tileHeight, this.game );
    }
    
    this.setControls = function(){
        
        // Tetra shapes controls
        this.keys = {};
        this.keys.shapeLeft = this.game.input.keyboard.addKey( Phaser.Keyboard.A );
        this.keys.shapeRight = this.game.input.keyboard.addKey( Phaser.Keyboard.D );
        this.keys.shapeRotate = this.game.input.keyboard.addKey( Phaser.Keyboard.W );
        this.keys.shapeFast = this.game.input.keyboard.addKey( Phaser.Keyboard.S );
        
        this.keys.shapeLeft.onDown.add( function(){ this.startMove("left") }, this.shape );
        this.keys.shapeRight.onDown.add( function(){ this.startMove("right") }, this.shape );
        this.keys.shapeRotate.onDown.add( this.shape.rotate, this.shape );
        this.keys.shapeFast.onDown.add( this.shape.fastFalling, this.shape );
        
        // Hero controls
        this.cursors = this.game.input.keyboard.createCursorKeys(); 
         
        // Fullscreen mode
        this.game.input.keyboard.addKey( Phaser.Keyboard.F).onDown.add( function(){ this.game.stage.scale.startFullScreen(); }, this);
        
    }
    
}

Phaser.TetraLevel.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraLevel.prototype.constructor = Phaser.TetraLevel;
