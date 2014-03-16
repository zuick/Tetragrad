/*
 * GameBumper is inherits Phaser.State
 */
Phaser.TetraGameBumper = function( game, levelName ){
	this.continue = function(){

        game.input.keyboard.removeKey( this.enterKey.keyCode );
        game.input.keyboard.removeKey( this.spaceKey.keyCode );
        
        game.state.start( levelName + '-intro', true, true );
    }

    this.create = function() {

    	
    	game.add.tileSprite(game.config.width/2 - 640/2, game.config.height/2-480/2, game.config.width,  game.config.height, 'bumper');

        game.input.onDown.add( this.continue, this);

        this.enterKey = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR ).onDown.add( this.continue, this);
        this.spaceKey = game.input.keyboard.addKey( Phaser.Keyboard.ENTER ).onDown.add( this.continue, this);
        
        setTimeout( function(){ this.continue() }.bind(this), game.config.bumperDelay )
    }
}

Phaser.TetraGameBumper.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraGameBumper.prototype.constructor = Phaser.TetraGameBumper;
