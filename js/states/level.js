/*
 * TetraLevel is inherits Phaser.State
 */
Phaser.TetraLevel = function( game, levelName ){
    this.game = game;
    this.levelName = levelName;
    
    this.preload = function() {
        
    }

    this.create = function() {
        this.showLevelName();
        
        this.game.input.onDown.add( this.nextLevel, this);
    }
    
    this.showLevelName = function(){
        var text = this.game.add.text( this.game.world.centerX, this.game.world.centerY, this.levelName, { fill: "#FFF" } );
        text.anchor.setTo( 0.5, 0.5 );
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
