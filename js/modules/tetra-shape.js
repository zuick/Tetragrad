Phaser.TetraShape = function( game, map, options, onFail ){
    options = options || {};
    
    this.game = game;
    this.map = map;
    this.interval = options.interval || 500;
    this.turbo = options.turbo || 50;
    this.moveInterval = options.moveInterval || 200;
    this.maxLineWidth = options.maxLineWidth || 8;

    this.moving = false;
    this.rotateSequence = {
        'a': 'b',
        'b': 'c',
        'c': 'd',
        'd': 'a'
    }
        
    this.setShape = function( type, x, y, r, tileIndex ){
        this.type = type;
        this.x = x;
        this.y = y;
        this.r = r;
        this.tileIndex = tileIndex;
    }
    
    this.reset = function reset(){
        var type = this.game.config.fallingShapesTypes[Math.floor((Math.random()*this.game.config.fallingShapesTypes.length))];
        var x = this.map.width / 2;
        var y = 0;
        var r = this.game.config.fallingShapesRotates[Math.floor((Math.random()*this.game.config.fallingShapesRotates.length))];
        var tileIndex = this.game.config.fallingShapesTiles[Math.floor((Math.random()*this.game.config.fallingShapesTiles.length))];        
        this.setShape( type, x, y, r, tileIndex );
        
        if( this.isCollideGround( 0, 1 ) ){
            if( this.FallingEventHandle ) this.game.time.events.remove( this.FallingEventHandle );
            if( typeof onFail == 'function' ) onFail();
        }
    }
    
    this.putShape = function( type, x, y, r, tileIndex, layerName ){
        layerName = layerName || "shape";
        var shapeInfo = Phaser.TetraShapesInfo[type];
        if( shapeInfo && shapeInfo[r] ){
            for( var block in shapeInfo[r] ){
                var tx = shapeInfo[r][block][0];
                var ty = shapeInfo[r][block][1];
                this.map.putTile( tileIndex, tx + x, ty + y, layerName );
            }
        }
    }
    
    
    this.start = function( interval ){
        interval = interval || this.interval;
        this.FallingEventHandle = this.game.time.events.loop( interval, this.tick, this )
    }
    
    this.tick = function(){
        if( this.isCollideGround( 0, 1 ) ){
            // merge with ground layer
            this.putShape( this.type, this.x, this.y, this.r, this.tileIndex, "ground" );
            this.putShape( this.type, this.x, this.y, this.r, 1, "shape" );
            // check if line
            this.destroyLines( "ground" );
            // process collidable objects
            this.map.setCollision( this.game.config.collidableTiles );
            // create new shape
            this.reset();
            
        }else{
            this.falling(); 
        }
    }
    
    /* check if shape is collide blocks on ground 
      offsetX, offsetY - is where shape is going to move 
      nextR - where shape is going to be rotate
    */
    this.isCollideGround = function( offsetX, offsetY, nextR ){
        nextR = nextR || this.r;
        var shapeInfo = Phaser.TetraShapesInfo[this.type];
        if( shapeInfo && shapeInfo[nextR] ){
            for( var block in shapeInfo[nextR] ){
                var tx = shapeInfo[nextR][block][0] + this.x + offsetX;
                var ty = shapeInfo[nextR][block][1] + this.y + offsetY; // at the next tick
                // check if tile under tx, ty is collidable
                if( this.map.getTile( tx, ty ) && this.game.config.collidableTiles.indexOf( this.map.getTile( tx, ty, "ground" ).index ) >= 0 ){
                    return true;
                }
            }
        }
        return false;
    }
    
    this.falling = function(){
        this.putShape( this.type, this.x, this.y, this.r, 1 );
        this.y++;
        this.putShape( this.type, this.x, this.y, this.r, this.tileIndex );
    }

    this.startMove = function( dir ){
        if( this.moving ) return;
        
        var dx = ( dir == "left" ) ? -1 : 1;        
        
        this.move(dx);

        this.moveEventHandle = this.game.time.events.loop( this.moveInterval, function(){ this.move(dx) }, this );
        this.moving = true;
        
    }
    
    this.stopMoving = function( ){
        if( this.moving ){
            this.game.time.events.remove( this.moveEventHandle );
            this.moving = false;
        }
    }
    
    this.move = function( dx ){
        if( this.isCollideGround( dx, 0 ) ) return;
        this.putShape( this.type, this.x, this.y, this.r, 1 );
        this.x = this.x + dx;
        this.putShape( this.type, this.x, this.y, this.r, this.tileIndex ); 
    }
    
    this.rotate = function(){
        if( this.isCollideGround( 0, 0, this.rotateSequence[ this.r ] ) ) return;

        this.putShape( this.type, this.x, this.y, this.r, 1 );
        this.r = this.rotateSequence[ this.r ];
        this.putShape( this.type, this.x, this.y, this.r, this.tileIndex );
    }
    
    this.fastFalling = function(){ 
        this.game.time.events.remove( this.FallingEventHandle );
        this.start( this.turbo );
    }
    
    this.normalFalling = function(){
        if( this.FallingEventHandle.delay == this.interval ) return;
        
        this.game.time.events.remove( this.FallingEventHandle );
        this.start();
    }

    this.destroyTiles = function( tiles, layer ){
        for( var i in tiles ){            
            this.map.putTile( 1, tiles[i].x, tiles[i].y, layer.name );
            
            if( layer.data[tiles[i].x][tiles[i].y] ) layer.data[tiles[i].x][tiles[i].y].collides = false;
        }
    }
    
    this.destroyLines = function( layerName ){
        for( var i in this.map.layers ){
            var layer = this.map.layers[i];
            if( layer.name == layerName ){
                for( var k in layer.data ){
                    var tilesInLine = [];
                    for( var l in layer.data[k] ){

                        // check if tile collidable
                        if( layer.data[k][l] && this.game.config.fallingShapesTiles.indexOf( layer.data[k][l].index ) >= 0 ){
                            tilesInLine.push( { x: l, y: k } );
                        }else if( tilesInLine.length >= this.maxLineWidth ){
                                this.destroyTiles( tilesInLine, layer )
                                this.shiftFallingTiles( this.findTilesToFall( tilesInLine, layer ), layer );
                                break;
                        }else{
                            tilesInLine = [];                            
                        }
                    }
                }
            }
        }
        
    }
    
    this.findTilesToFall = function( destroyedTiles, layer ){
        var tilesToFall = []; 
        for( var i in destroyedTiles ){
            var dt = destroyedTiles[i];
            for( var k = dt.y - 1; k >= 0; k-- ){
                 // collect all block which looks like falling shapes while the another tile is come 
                 if( layer.data[k][dt.x] && this.game.config.fallingShapesTiles.indexOf( layer.data[k][dt.x].index ) >= 0 ){
                     tilesToFall.push( { x: dt.x, y: k, t: layer.data[k][dt.x].index } );
                 }else{
                     break;
                 }
            }
        }
        return tilesToFall;
    }
    
    this.shiftFallingTiles = function( tilesToFall, layer ){
        // clear tiles
        for( var i in tilesToFall ){
            this.map.putTile( 1, tilesToFall[i].x, tilesToFall[i].y, layer.name );
        }
        // draw tiles with shift
        for( var i in tilesToFall ){
            this.map.putTile( tilesToFall[i].t, tilesToFall[i].x, tilesToFall[i].y + 1, layer.name );
        }
    }
    this.reset();
}


