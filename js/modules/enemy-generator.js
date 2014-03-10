Phaser.TetraEnemyGenerator = function( game, options ){
    options = options || {};
    this.game = game;
    
    this.type = options.type || 'block';
    this.interval = options.interval || 2000;
    this.maxItems = options.maxItems || 5;
    
    
    this.items = [];
    
    this.start = function(){
        this.createEventHandle = this.game.time.events.loop( this.interval, this.create, this )
    }
   
    this.stop = function(){
        this.game.time.events.remove( this.createEventHandle );
    }
    
    this.create = function(){
        if( this.items.length > this.maxItems ){
            
        }else{
            var ex = Math.floor( Math.random() * this.game.world.width );
            var ey = Math.floor( Math.random() * this.game.world.height );
            switch( this.type ){
                case 'block': 
                    this.items.push( new Phaser.TetraEnemyBlock( ex, ey, this.game ) );
                    break;
                default: break;
            }            
            
        }
    }
    
    this.update = function( colliders ){
        for( var i in this.items ){
            for( var l in colliders ){
                this.game.physics.collide(this.items[i].sprite, colliders[l] );                
            }
            this.items[i].update();
        }
    }
}


