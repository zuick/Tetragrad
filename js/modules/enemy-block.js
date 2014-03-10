Phaser.TetraEnemyBlock = function( x, y, game ){

    
    var enemy = game.add.sprite( x, y, game.config.enemyBlock.spritesheet );
    
    enemy.dead = false;
        
    enemy.body.bounce.y = game.config.enemyBlock.bounce;
    enemy.body.gravity.y = game.config.enemyBlock.gravity;
    enemy.body.collideWorldBounds = true;
    enemy.body.setRectangle( 26, 27, 3, 6 );
    // todo: animations
    enemy.animations.add('right', [1,2,3,2], 6, true);
    enemy.animations.add('left', [4,5,6,5], 6, true);
    enemy.animations.add('death', [7,8,9,10], 8, false);
    enemy.frame = 0;
    
    enemy.tetraUpdate = function(){
        
    }
    
    enemy.death = function( callback ){
        this.animations.play('death');
        this.dead = true;
        this.body.velocity.x = 0;
        if( typeof callback  == "function" )
            setTimeout( callback, game.config.enemyBlock.deathTimeout );
    }
    
    return enemy;
}


