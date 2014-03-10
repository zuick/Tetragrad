Phaser.TetraHero = function( x, y, game ){
    this.game = game;
    
    this.dead = false;
    
    this.sprite = this.game.add.sprite( x, y, this.game.config.hero.spritesheet );
    
    this.sprite.body.bounce.y = this.game.config.hero.bounce;
    this.sprite.body.gravity.y = this.game.config.hero.gravity;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.setRectangle( 26, 27, 3, 6 );
    
    // todo: animations
    
    
    this.death = function( callback ){
        this.dead = true;
        this.sprite.body.velocity.y = -180;
        this.sprite.body.bounce.y = 0.3;
        // todo play death animation
        if( typeof callback  == "function" )
            setTimeout( callback, this.game.config.hero.deathTimeout );
    }
    
    this.update = function( cursors ){
        this.sprite.body.velocity.x = 0;

        if( !this.dead ){
            if (cursors.left.isDown){
                this.sprite.body.velocity.x = - this.game.config.hero.speed;
                
            }else if (cursors.right.isDown){
                this.sprite.body.velocity.x = this.game.config.hero.speed;                
                
            }else{
                this.sprite.animations.stop();
            }
            
            if(cursors.up.isDown && this.sprite.body.onFloor() )
                this.sprite.body.velocity.y = -this.game.config.hero.jump;
                
        }
    }
}
