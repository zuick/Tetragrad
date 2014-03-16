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
                    
        this.setMap();
        this.setHero();
        this.setTetraShape();
        this.setEnemyBlockGenerator();
        this.setControls();
        this.setLivesSprite();  
        
        this.game.camera.follow( this.hero );

        this.makeDoorNextLevel();

    }
    
    this.update = function(){
        // Physics
        this.game.physics.collide(this.hero, this.ground);
        if(!this.hero.dead ) this.game.physics.collide(this.hero, this.shapeLayer);
        this.game.physics.collide(this.hero, this.door, function(a,b){this.nextLevel();},null,this);

        // Tetrashape controls
        if( this.keys.shapeFast.isUp ) this.shape.normalFalling();
        if( ( this.keys.shapeLeft.isUp || 
                ( !this.keys.shapeLeft.isUp && !this.keys.shapeLeft.isDown ) ) && 
            ( this.keys.shapeRight.isUp ||
                ( !this.keys.shapeRight.isUp && !this.keys.shapeRight.isDown ) ) ) 
            this.shape.stopMoving();

        this.hero.tetraUpdate( this.keys.cursors );
        this.enemyGenerator.update( [ this.ground, this.shapeLayer, this.hero ] );

        this.updLivesSprite();            
        
    }
    
    this.restartLevel = function(){
        this.clean();
        this.create();
    }
    
    this.nextLevel = function(){
        this.enemyGenerator.stop();
        this.clean();
        
        var levels = this.game.config.levels;
        var currentIndex = Phaser.TetraTools.getLevelIndex( levels, this.game.state.current );
        if( currentIndex < levels.length - 1 ) this.game.state.start( levels[ currentIndex + 1 ].name + '-intro', true, true );
        else this.game.state.start( levels[ 0 ].name + '-intro', true, true );
    }
    
    this.pause = function(){
        this.enemyGenerator.stop();
        this.game.state.start( "pause", true, true );
    }
    
    this.clean = function(){
        this.game.world.destroy();
        if( this.lives ) this.lives.destroy();
        if( this.map ) this.map.destroy();
        if( this.shape ) this.shape.destroy();
        if( this.enemyGenerator ) this.enemyGenerator.destroy();
        if( this.hero ) this.hero.destroy();
        if( this.door ) this.door.destroy();
        
        if( this.keys ){
            for( var i in this.keys ){
                this.game.input.keyboard.removeKey( this.keys[i].keyCode );
            }
        }
    }
    
    this.setMap = function(){
        this.map = this.game.add.tilemap( levelName );
        this.map.addTilesetImage('tileset', 'tileset');
        this.background = this.map.createLayer('background');
        this.ground = this.map.createLayer('ground');
        this.shapeLayer = this.map.createLayer( 'shape' );

        this.map.setCollision( this.game.config.collidableTiles, true, "ground" );

        this.background.resizeWorld();
        
    }
    
    this.setTetraShape = function(){
        this.shape = new Phaser.TetraShape( this.game, this.map, { hero: this.hero }, function(){ this.restartLevel(); }.bind(this)  );        
        this.shape.start();
    }
    
    this.setEnemyBlockGenerator = function(){
        this.enemyGenerator = new Phaser.TetraEnemyGenerator( this.game, {}, this );
        this.enemyGenerator.start();
    }
    
    this.setHero = function(){        
        this.heroInitialXY = Phaser.TetraTools.getObjectsPositionFromMap( this.map, "characters", this.game.config.hero.tileIndex )[0];
        this.hero = Phaser.TetraHero( this.heroInitialXY.x * this.map.tileWidth, this.heroInitialXY.y * this.map.tileHeight, this.game, function(){ this.restartLevel(); }.bind(this) );            
    }
    
    this.setControls = function(){
        
        this.keys = {};

        // create keyboard handlers        
        this.keys.shapeLeft = this.game.input.keyboard.addKey( Phaser.Keyboard.A );
        this.keys.shapeRight = this.game.input.keyboard.addKey( Phaser.Keyboard.D );
        this.keys.shapeRotate = this.game.input.keyboard.addKey( Phaser.Keyboard.W );
        this.keys.shapeFast = this.game.input.keyboard.addKey( Phaser.Keyboard.S );
        this.keys.fullscreen = this.game.input.keyboard.addKey( Phaser.Keyboard.F);
        this.keys.next = this.game.input.keyboard.addKey( Phaser.Keyboard.N );
        this.keys.pause = this.game.input.keyboard.addKey( Phaser.Keyboard.P );
        this.keys.cursors = this.game.input.keyboard.createCursorKeys(); 

        // set events
        this.keys.shapeLeft.onDown.add( function(){ this.startMove("left") }, this.shape );
        this.keys.shapeRight.onDown.add( function(){ this.startMove("right") }, this.shape );
        this.keys.shapeRotate.onDown.add( this.shape.rotate, this.shape );
        this.keys.shapeFast.onDown.add( this.shape.fastFalling, this.shape );
        this.keys.next.onDown.add( this.nextLevel, this );
        
        this.keys.fullscreen.onDown.add( function(){ this.game.stage.scale.startFullScreen(); }, this);
        this.keys.pause.onDown.add( this.pause, this);
        
    }
    
    this.setLivesSprite = function(){
        if(this.hero.lives > 0){  
            this.lives = this.game.add.sprite(0, 0, 'lives');
            this.lives.fixedToCamera = true;
            this.lives.cameraOffset.x = 24;
            this.lives.cameraOffset.y = 24;
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


    this.makeDoorNextLevel = function(){
        var doorXY = Phaser.TetraTools.getObjectsPositionFromMap( this.map, "characters", this.game.config.door.tileIndex )[0];
        this.door = this.game.add.sprite(doorXY.x * this.map.tileWidth, doorXY.y  * this.map.tileHeight, 'door');

        this.door.animations.add('next', [0,1,2,3], 4, true);

        this.door.frame = 0; 
        this.door.animations.play('next');
    }
    


}

Phaser.TetraLevel.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraLevel.prototype.constructor = Phaser.TetraLevel;
