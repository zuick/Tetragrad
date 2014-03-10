Phaser.TetraEnemyBlock = function( x, y, game ){

    
    var enemy = game.add.sprite( x, y, game.config.enemyBlock.spritesheet );
    
    enemy.dead = false;
        
    enemy.body.bounce.y = game.config.enemyBlock.bounce;
    enemy.body.gravity.y = game.config.enemyBlock.gravity;
    enemy.body.collideWorldBounds = true;
    enemy.body.setRectangle( 26, 27, 3, 6 );
    // todo: animations
    enemy.animations.add('left', [1,2,3,4], 6, true);
    enemy.animations.add('right', [5,6,7,8], 6, true);
    enemy.animations.add('death', [9,10,11,12], 8, false);
    enemy.frame = 0;
    enemy.vx = game.config.enemyBlock.speed;
    enemy.tetraUpdate = function(){
        if( this.body.onFloor() )this.move();
    }
    
    enemy.death = function( callback ){
        this.animations.play('death');
        this.dead = true;
        this.body.velocity.x = 0;
        if( typeof callback  == "function" )
            setTimeout( callback, game.config.enemyBlock.deathTimeout );
    }
    
    enemy.move = function(){
        if( this.body.velocity.x == 0 && !this.dead){ 

            var dir = ( Math.random() * 10 - 5 > 0 ) ? 1 : -1;
            
            this.vx = dir * this.vx;
            this.body.velocity.x = this.vx;
            
            if( this.vx > 0 ) this.animations.play('right');
            else this.animations.play('left');
            
            if( Math.random() * 10 - 5 > 0 ) this.body.velocity.y = -game.config.enemyBlock.jump;
        }
    }
    
    return enemy;
}


