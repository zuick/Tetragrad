Phaser.TetraEnemyBlock = function( x, y, game ){
    this.game = game;
    
    this.dead = false;
    
    this.sprite = this.game.add.sprite( x, y, this.game.config.enemyBlock.spritesheet );
    
    this.sprite.body.bounce.y = this.game.config.enemyBlock.bounce;
    this.sprite.body.gravity.y = this.game.config.enemyBlock.gravity;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.setRectangle( 26, 27, 3, 6 );
    // todo: animations
    this.sprite.animations.add('right', [1,2,3,4], 6, true);
    this.sprite.animations.add('left', [1,2,3,4], 6, true);
    this.sprite.frame = 0;
    
    this.update = function(){
        
    }
}


