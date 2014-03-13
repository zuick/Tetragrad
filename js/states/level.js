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
       
        this.setHero();
        
        this.setTetraShape();
        
        this.setEnemyBlockGenerator();     
        
        this.setControls();
        
        this.game.camera.follow( this.hero );
    }
    
    this.update = function(){
        // Physics
        
        this.game.physics.collide(this.hero, this.ground);
        
        
        // Tetrashape controls
        if( this.keys.shapeFast.isUp ) this.shape.normalFalling();
        if( ( this.keys.shapeLeft.isUp || 
                ( !this.keys.shapeLeft.isUp && !this.keys.shapeLeft.isDown ) ) && 
            ( this.keys.shapeRight.isUp ||
                ( !this.keys.shapeRight.isUp && !this.keys.shapeRight.isDown ) ) ) 
            this.shape.stopMoving();
        
                
        this.hero.tetraUpdate( this.cursors );
        this.enemyGenerator.update( [ this.ground, this.hero ] );
    }
    
    this.nextLevel = function(){
        var levels = this.game.config.levels;
        var currentIndex = levels.indexOf( this.game.state.current );
        if( currentIndex < levels.length - 1 ) this.game.state.start( levels[ currentIndex + 1 ] );
        else this.game.state.start( levels[ 0 ], true, true );
    }
    
    this.restartGame = function(){
        this.setMap();
        this.setHero();
        this.setTetraShape();
    }
    
    this.setMap = function(){
        if( !this.map ){
            this.map = this.game.add.tilemap( levelName );
            this.map.addTilesetImage('tileset', 'tileset');
            this.background = this.map.createLayer('background');
            this.ground = this.map.createLayer('ground');
            this.shapeLayer = this.map.createLayer( 'shape' );

            this.map.setCollision( this.game.config.collidableTiles, true, "ground" );

            this.background.resizeWorld();
            
            this.initialGroundData = this.tools.getTileMapLayerData( this.map, "ground" );
        }else{
            // clear shape layer
            this.map.fill( 1, 0, 0, this.map.width, this.height, "shape" )
            // reset ground
            this.tools.restoreTileMapLayer( this.map, this.initialGroundData, "ground" );
            this.map.setCollision( this.game.config.collidableTiles, true, "ground" );
        }
        
    }
    
    this.setTetraShape = function(){
        if( !this.shape ){
            this.shape = new Phaser.TetraShape( this.game, this.map, { hero: this.hero }, function(){ this.restartGame() }.bind(this) );
            this.shape.start();            
        }else{
            
            this.shape.reset();
        }
    }
    
    this.setEnemyBlockGenerator = function(){
        this.enemyGenerator = new Phaser.TetraEnemyGenerator( this.game, {}, this );
        this.enemyGenerator.start();     
    }
    
    this.setHero = function(){
        if( !this.heroInitialXY && !this.hero ){
            this.heroInitialXY = this.tools.getObjectsPositionFromMap( this.map, "characters", this.game.config.hero.tileIndex )[0];
            this.hero = Phaser.TetraHero( this.heroInitialXY.x * this.map.tileWidth, this.heroInitialXY.y * this.map.tileHeight, this.game );            
        }else{
            this.hero.x = this.heroInitialXY.x * this.map.tileWidth;
            this.hero.y = this.heroInitialXY.y * this.map.tileHeight;
            this.hero.init();
        }
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
