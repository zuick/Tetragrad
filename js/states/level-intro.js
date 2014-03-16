/*
 * TetraLevelIntro is inherits Phaser.State
 */
Phaser.TetraLevelIntro = function( game, levelName ){
   
    this.continue = function(){
        game.state.start( levelName, true, true );
    }
    this.create = function() {
        var style = { fill: "#FFF" };
        var title = Phaser.TetraTools.getLevelTitle( game.config.levels, levelName );
        var text = game.add.text( game.config.width / 2, game.config.height / 2, title, style ).anchor.setTo( 0.5, 0.5 );
        game.camera.follow(text);
        setTimeout( function(){ this.continue() }.bind(this), game.config.introDelay )
    }
}

Phaser.TetraLevelIntro.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraLevelIntro.prototype.constructor = Phaser.MyState;


