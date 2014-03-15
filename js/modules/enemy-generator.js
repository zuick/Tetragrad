Phaser.TetraEnemyGenerator = function( game, options, state ){
    options = options || {};
    this.game = game;
    
    this.type = options.type || 'block';
    this.interval = options.interval || 500;
    this.maxItems = options.maxItems || 5;
    this.state = state;
    
    this.items = [];
    
    this.start = function(){
        this.createEventHandle = this.game.time.events.loop( this.interval, this.create, this )
    }
   
    this.stop = function(){
        this.game.time.events.remove( this.createEventHandle );
    }
    
    this.create = function(){
        if( this.items.length >= this.maxItems ){
            
        }else{
            var ex = Math.floor( Math.random() * this.game.world.width );
            var ey = Math.floor( Math.random() * this.game.world.height / 2 );
            switch( this.type ){
                case 'block':
                    var enemy = Phaser.TetraEnemyBlock( ex, ey, this.game );
                    var date = new Date();
                    enemy.genID = date.valueOf();
                    this.items.push( enemy );
                    break;
                default: break;
            }            
            
        }
    }
    
    this.update = function( colliders ){
        for( var i in this.items ){
            for( var l in colliders ){
                if( colliders[l].name && colliders[l].name == 'hero' ){
                    this.game.physics.collide( colliders[l], this.items[i], this.checkHeroCollisions, this.processHeroCollistions, this );     
                }else{
                    this.game.physics.collide( this.items[i], colliders[l] );
                }
            }
            this.items[i].tetraUpdate();
        }
    }
    
    this.remove = function( ID ){
        for( var i in this.items ){
            if( this.items[i].genID == ID ){
                var enemy = this.items[ i ];
                this.items.splice( i, 1 ); 
                enemy.destroy();
                return;
            }
        }
    }
    
    this.removeAll = function( ID ){
        for( var i in this.items ){
            this.items[ i ].destroy();
        }
        this.items = [];
    }
    
    this.processHeroCollistions = function( hero, enemy ){
        if( enemy.dead || hero.dead ) return false;
            else return true;
    }
    
    this.checkHeroCollisions = function ( hero, object ){
        if( object.body.touching.up ){
            hero.jump();
  
            object.death( function(){ this.remove( object.genID ); }.bind(this) );
        }else{
            hero.death( function(){ this.state.restartGame(); }.bind(this));
        }
    }
}


