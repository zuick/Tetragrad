Phaser.TetraShape = function( game, map, interval ){
    this.game = game;
    this.map = map;
    
    this.type = 'i';
    this.x = 0;
    this.y = 0;
    this.rotate = 'a';
    this.tileIndex = 11;
    this.interval = interval;
    
    this.setShape = function( type, x, y, rotate, tileIndex ){
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotate = rotate;
        this.tileIndex = tileIndex;
    }
    
    this.putShape = function( type, x, y, rotate, tileIndex ){
        var shapeInfo = Phaser.TetraShapesInfo[type];
        if( shapeInfo && shapeInfo[rotate] ){
            for( var block in shapeInfo[rotate] ){
                var tx = shapeInfo[rotate][block][0];
                var ty = shapeInfo[rotate][block][1];
                this.map.putTile( tileIndex, tx + x, ty + y, "shape" );
            }
        }
    }
    
    this.start = function(){
        this.eventHandle = this.game.time.events.loop( this.interval, this.tick, this )
    }
    
    this.tick = function(){
        this.falling();
    }
    
    this.falling = function(){
        this.putShape( this.type, this.x, this.y, this.rotate, 1 );
        this.y++;
        this.putShape( this.type, this.x, this.y, this.rotate, this.tileIndex );
    }
    
    this.move = function( dx ){
        this.putShape( this.type, this.x, this.y, this.rotate, 1 );
        this.x += dx;
        this.putShape( this.type, this.x, this.y, this.rotate, this.tileIndex );        
    }
}


