/*
 * TetraPause is inherits Phaser.State
 */
Phaser.TetraPause = function( game ){
    this.game = game;
    
    this.preload = function() {
        
        this.game.add.text( this.game.world.centerX, this.game.world.centerY, "Шпауза", { fill: "#FFF" } ).anchor.setTo( 0.5, 0.5 );
      
    }

    this.create = function() {
        this.game.input.keyboard.addKey( Phaser.Keyboard.P ).onDown.add( function(){ game.state.start('level1') }, this);
    }
}

Phaser.TetraPause.prototype = Object.create( Phaser.State.prototype );
Phaser.TetraPause.prototype.constructor = Phaser.MyState;


