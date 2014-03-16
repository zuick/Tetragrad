/*
 * TetraLevelIntro is inherits Phaser.State
 */
Phaser.TetraLevelIntro = function( game, levelName ){
   
    this.continue = function(){
        game.input.keyboard.removeKey( this.enterKey.keyCode );
        game.input.keyboard.removeKey( this.spaceKey.keyCode );
        
        game.state.start( levelName, true, true );
    }
    this.create = function() {
        var style = { fill: "#FFF" };
        var title = Phaser.TetraTools.getLevelTitle( game.config.levels, levelName );
        var text = game.add.text( game.config.width / 2, game.config.height / 2, title, style ).anchor.setTo( 0.5, 0.5 );
        game.camera.follow(text);
        game.input.onDown.add( function(){ game.state.start( levelName, true, true ) }, this);
        this.enterKey = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR ).onDown.add( this.continue, this);
        this.spaceKey = game.input.keyboard.addKey( Phaser.Keyboard.ENTER ).onDown.add( this.continue, this);
        setTimeout( function(){ this.continue() }.bind(this), game.config.introDelay )
    }
}

Phaser.TetraLevelIntro.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraLevelIntro.prototype.constructor = Phaser.MyState;


