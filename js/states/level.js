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
        this.setLivesSprite();        

        this.game.camera.follow( this.game.world.hero );

    }
    
    this.update = function(){
        // Physics
        
        this.game.physics.collide(this.game.world.hero, this.game.world.ground);
        
        // Tetrashape controls
        if( this.keys.shapeFast.isUp ) this.shape.normalFalling();
        if( ( this.keys.shapeLeft.isUp || 
                ( !this.keys.shapeLeft.isUp && !this.keys.shapeLeft.isDown ) ) && 
            ( this.keys.shapeRight.isUp ||
                ( !this.keys.shapeRight.isUp && !this.keys.shapeRight.isDown ) ) ) 
            this.shape.stopMoving();
        
        this.game.world.hero.tetraUpdate( this.cursors );
        this.game.world.enemyGenerator.update( [ this.game.world.ground, this.game.world.hero ] );
        
        this.updLivesSprite();

    }
    
    this.nextLevel = function(){
        var levels = this.game.config.levels;
        var currentIndex = levels.indexOf( this.game.state.current );
        if( currentIndex < levels.length - 1 ) this.game.state.start( levels[ currentIndex + 1 ] );
        else this.game.state.start( levels[ 0 ] );
    }
    
    this.restartGame = function(){
        this.setMap();
        this.setHero();
        this.setTetraShape();
        this.setEnemyBlockGenerator();
        this.setLivesSprite();
    }
    
    this.pause = function(){
        this.game.world.enemyGenerator.stop();
        this.game.state.start( "pause", true, true );
    }
    
    this.setMap = function(){
        if( !this.game.world.map ){
            this.game.world.map = this.game.add.tilemap( levelName );
            this.game.world.map.addTilesetImage('tileset', 'tileset');
            this.game.world.background = this.game.world.map.createLayer('background');
            this.game.world.ground = this.game.world.map.createLayer('ground');
            this.game.world.shapeLayer = this.game.world.map.createLayer( 'shape' );

            this.game.world.map.setCollision( this.game.config.collidableTiles, true, "ground" );

            this.game.world.background.resizeWorld();
            
            this.initialGroundData = this.tools.getTileMapLayerData( this.game.world.map, "ground" );
        }else{
            // clear shape layer
            this.game.world.map.fill( 1, 0, 0, this.game.world.map.width, this.height, "shape" )
            // reset ground
            this.tools.restoreTileMapLayer( this.game.world.map, this.initialGroundData, "ground" );
            this.game.world.map.setCollision( this.game.config.collidableTiles, true, "ground" );
            
            this.game.world.background = this.game.world.map.createLayer('background');
            this.game.world.ground = this.game.world.map.createLayer('ground');
            this.game.world.shapeLayer = this.game.world.map.createLayer( 'shape' );
        }
        
    }
    
    this.setTetraShape = function(){
        if( !this.shape ){
            this.shape = new Phaser.TetraShape( this.game, this.game.world.map, { hero: this.game.world.hero }, function(){ this.restartGame() }.bind(this) );
            this.shape.start();            
        }else{
            this.shape.reset();
            this.shape.start();
        }
    }
    
    this.setEnemyBlockGenerator = function(){
        if( !this.game.world.enemyGenerator ){
            this.game.world.enemyGenerator = new Phaser.TetraEnemyGenerator( this.game, {}, this );
            this.game.world.enemyGenerator.start();                 
        }else{
            this.game.world.enemyGenerator.stop();
            this.game.world.enemyGenerator.removeAll();
            this.game.world.enemyGenerator.start();
        }
    }
    
    this.setHero = function(){
        this.game.world.heroInitialXY = this.tools.getObjectsPositionFromMap( this.game.world.map, "characters", this.game.config.hero.tileIndex )[0];
        this.game.world.hero = Phaser.TetraHero( this.game.world.heroInitialXY.x * this.game.world.map.tileWidth, this.game.world.heroInitialXY.y * this.game.world.map.tileHeight, this.game );            
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
            
        this.game.input.keyboard.addKey( Phaser.Keyboard.P).onDown.add( this.pause, this);
        
    }

    this.setLivesSprite = function(){
        if(this.game.world.hero.lives > 0){  
            this.lives = this.game.add.sprite(0, 0, 'lives');
            this.lives.fixedToCamera = true;
            this.lives.cameraOffset.x = 32;
            this.lives.cameraOffset.y = 32;
            this.lives.frame = 0;
        }
    }
    this.updLivesSprite = function(){
        if( this.game.world.hero.lives >= 0 ){
            this.lives.frame = Math.floor( this.game.config.livesSpriteLength - this.game.world.hero.lives/this.game.config.hero.lives * this.game.config.livesSpriteLength );
        }else{
            this.lives.frame = this.game.config.livesSpriteLength - 1;
        }
    }


    
}

Phaser.TetraLevel.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraLevel.prototype.constructor = Phaser.TetraLevel;
