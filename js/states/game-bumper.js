/*
 * GameBumper is inherits Phaser.State
 */
Phaser.TetraGameBumper = function( game, levelName ){
    this.continue = function(){
        game.state.start( levelName + '-intro', true, true );
    }

    this.create = function() {

    	game.add.tileSprite(game.config.width/2 - 640/2, game.config.height/2-480/2, game.config.width,  game.config.height, 'bumper');
        setTimeout( function(){ this.continue() }.bind(this), game.config.bumperDelay )
    }
}

Phaser.TetraGameBumper.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraGameBumper.prototype.constructor = Phaser.TetraGameBumper;
