Phaser.TetraHero = function( x, y, game ){
    this.game = game;
    this.game.add.sprite( x, y, this.game.config.hero.spritesheet );
}

Phaser.TetraHero.prototype = Object.create( Phaser.Sprite.prototype );
Phaser.TetraHero.prototype.constructor = Phaser.TetraHero;
