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
                
        this.setTools();       
        this.setMap();
        this.setHero();
        this.setTetraShape();
        this.setEnemyBlockGenerator();
        this.setControls();
        this.setLivesSprite();  
        
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

        this.hero.tetraUpdate( this.keys.cursors );
        this.enemyGenerator.update( [ this.ground, this.hero ] );

        this.updLivesSprite();            
        

    }
    
    this.nextLevel = function(){
        var levels = this.game.config.levels;
        var currentIndex = levels.indexOf( this.game.state.current );
        if( currentIndex < levels.length - 1 ) this.game.state.start( levels[ currentIndex + 1 ] );
        else this.game.state.start( levels[ 0 ] );
    }
    
    this.setTools = function(){
        if( this.tools ) this.tools.destroy();
        this.tools = new Phaser.TetraTools( this.game );
    }
    
    this.setMap = function(){
        if( this.map ){            
            this.map.destroy();
            this.map = this.game.add.tilemap( levelName );
        }else{
            this.map = this.game.add.tilemap( levelName );
            
        }
        
        this.map.addTilesetImage('tileset', 'tileset');
        this.background = this.map.createLayer('background');
        this.ground = this.map.createLayer('ground');
        this.shapeLayer = this.map.createLayer( 'shape' );

        this.map.setCollision( this.game.config.collidableTiles, true, "ground" );

        this.background.resizeWorld();
        
    }
    
    this.setTetraShape = function(){
        if( this.shape ){
            this.shape.destroy();            
        }
        
        this.shape = new Phaser.TetraShape( this.game, this.map, { hero: this.hero }, function(){ this.create(); }.bind(this)  );
        
        this.shape.start();
    }
    
    this.setEnemyBlockGenerator = function(){
        if( this.enemyGenerator ){
            this.enemyGenerator.destroy();
        }
        this.enemyGenerator = new Phaser.TetraEnemyGenerator( this.game, {}, this );
        this.enemyGenerator.start();
    }
    
    this.setHero = function(){
        if( this.hero ){
            this.hero.destroy();
        }
        
        this.heroInitialXY = this.tools.getObjectsPositionFromMap( this.map, "characters", this.game.config.hero.tileIndex )[0];
        this.hero = Phaser.TetraHero( this.heroInitialXY.x * this.map.tileWidth, this.heroInitialXY.y * this.map.tileHeight, this.game );            
    }
    
    this.setControls = function(){
        
        // if already exists
        if( this.keys ){
            for( var i in this.keys ){
                this.game.input.keyboard.removeKey( this.keys[i].keyCode );
            }
        }else{
            this.keys = {};
        }
        
        // create keyboard handlers        
        this.keys.shapeLeft = this.game.input.keyboard.addKey( Phaser.Keyboard.A );
        this.keys.shapeRight = this.game.input.keyboard.addKey( Phaser.Keyboard.D );
        this.keys.shapeRotate = this.game.input.keyboard.addKey( Phaser.Keyboard.W );
        this.keys.shapeFast = this.game.input.keyboard.addKey( Phaser.Keyboard.S );
        this.keys.fullscreen = this.game.input.keyboard.addKey( Phaser.Keyboard.F);
        this.keys.pause = this.game.input.keyboard.addKey( Phaser.Keyboard.P );
        this.keys.cursors = this.game.input.keyboard.createCursorKeys(); 

        // set events
        this.keys.shapeLeft.onDown.add( function(){ this.startMove("left") }, this.shape );
        this.keys.shapeRight.onDown.add( function(){ this.startMove("right") }, this.shape );
        this.keys.shapeRotate.onDown.add( this.shape.rotate, this.shape );
        this.keys.shapeFast.onDown.add( this.shape.fastFalling, this.shape );
        
        this.keys.fullscreen.onDown.add( function(){ this.game.stage.scale.startFullScreen(); }, this);
        this.keys.pause.onDown.add( this.pause, this);
        
    }
    
    this.setLivesSprite = function(){
        if(this.hero.lives > 0){  
            this.lives = this.game.add.sprite(0, 0, 'lives');
            this.lives.fixedToCamera = true;
            this.lives.cameraOffset.x = 32;
            this.lives.cameraOffset.y = 32;
            this.lives.frame = 0;
        }
    }

    this.updLivesSprite = function(){
        if( this.hero.lives >= 0 ){
            this.lives.frame = Math.floor( this.game.config.livesSpriteLength - this.hero.lives/this.game.config.hero.lives * this.game.config.livesSpriteLength );
        }else{
            this.lives.frame = this.game.config.livesSpriteLength - 1;
        }
    }
    
    this.pause = function(){
        this.enemyGenerator.stop();
        this.game.state.start( "pause", true, true );
    }

    
}

Phaser.TetraLevel.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraLevel.prototype.constructor = Phaser.TetraLevel;
