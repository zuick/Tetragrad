Phaser.TetraHero = function( x, y, game ){

    var hero = game.add.sprite( x, y, game.config.hero.spritesheet );
    
    hero.name = 'hero';
    hero.dead = false;
    
    hero.noTouch = false; // after enemy hits, hero is untouchable some time
    
    hero.lives = 3;
    hero.maxLives = 3;
    
    hero.body.bounce.y = game.config.hero.bounce;
    hero.body.gravity.y = game.config.hero.gravity;
    hero.body.collideWorldBounds = true;
    hero.body.setRectangle( 26, 27, 3, 6 );
    // todo: animations
    hero.animations.add('right', [1,2], 4, true);
    hero.animations.add('left', [3,4], 4, true);
    hero.animations.add('death', [5,6], 4, false);
    hero.frame = 0;
    
    hero.death = function( callback, onhit ){
        if( this.noTouch ) return;
        this.lives--;
        
        if( this.lives < 0 ){
            this.dead = true;
            this.body.velocity.y = -180;
            this.body.bounce.y = 0.3;
            // todo play death animation

            this.animations.play('death');

            if( typeof callback  == "function" )
                setTimeout( callback, game.config.enemyBlock.deathTimeout );            
        }
        
        if( this.body.touching.left ) this.body.velocity.x = game.config.enemyBlock.enemyHit;
        if( this.body.touching.right ) this.body.velocity.x = -game.config.enemyBlock.enemyHit;
        
        this.body.velocity.y = - game.config.enemyBlock.enemyHit;
        this.noTouch = true;
        
        setTimeout( function(){ this.noTouch = false; }.bind(this), 200 );
    }
    
    hero.jump = function(){
        this.body.velocity.y = - game.config.hero.jump;
    }
    
    hero.tetraUpdate = function( cursors ){
        this.body.velocity.x = 0;

        if( !this.dead ){
            if (cursors.left.isDown){
                this.body.velocity.x = - game.config.hero.speed;
                this.animations.play('left');
            }else if (cursors.right.isDown){
                this.body.velocity.x = game.config.hero.speed;                
                this.animations.play('right')
            }else{
                this.animations.stop();
                this.frame = 0; 
            }
            
            if( cursors.up.isDown && hero.body.onFloor() ) this.jump();
        }
    }
    
    return hero;
}
