Phaser.TetraHero = function( x, y, game, onDeath ){

    var hero = game.add.sprite( x, y, game.config.hero.spritesheet );
    
    hero.enemyHit = function( onDeath ){
        if( this.noTouch ) return;
        this.lives--;
        
        if( this.lives < 0 ) this.death();
        
        if( this.body.touching.left ) this.body.velocity.x = game.config.enemyBlock.enemyHit;
        if( this.body.touching.right ) this.body.velocity.x = -game.config.enemyBlock.enemyHit;
        
        this.body.velocity.y = - game.config.enemyBlock.enemyHit;
        this.noTouch = true;
        
        setTimeout( function(){ this.noTouch = false; }.bind(this), 200 );
    }
    
    hero.death = function(){
        if( this.dead ) return;
        this.dead = true;
        this.body.velocity.y = -180;
        this.body.bounce.y = 0.3;

        this.animations.play('death');

        if( typeof onDeath  == "function" ){
            setTimeout( onDeath, game.config.enemyBlock.deathTimeout );
        }
    }
    
    hero.init = function(){
        this.name = 'hero';
        this.dead = false;
        this.noTouch = false; // after enemy hits, hero is untouchable some time
        this.lives = this.game.config.hero.lives;
        
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.bounce.y = game.config.hero.bounce;
        this.body.gravity.y = game.config.hero.gravity;
        this.body.collideWorldBounds = true;
        this.body.setRectangle( 26, 27, 3, 6 );
        // todo: animations
        this.animations.add('right', [1,2], 4, true);
        this.animations.add('left', [3,4], 4, true);
        this.animations.add('death', [5,6], 4, false);
        this.frame = 0;
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
    
    hero.init();
    
    return hero;
}
