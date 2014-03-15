Phaser.TetraTools = function( game ){
    this.game;
    this.getObjectsPositionFromMap = function ( map, layerName, tileIndex ){
        var result = [];
        // find layer
        for( var i in map.layers ){
            var layer = map.layers[i];
            if( layer.name == layerName ){
                // find objects
                for( var k in layer.data ){
                    for( var l in layer.data[k] ){
                        if( layer.data[k][l] && layer.data[k][l].index == tileIndex ){
                            result.push({x: l , y: k });
                        }         
                    }
                }
                break;
            }
        }

        return result;
    }
    
    this.getTileMapLayerData = function( map, layerName ){
        var result = [];
        var layer = map.layers[ map.getLayerIndex( layerName ) ];
        for( var k in layer.data ){
            for( var l in layer.data[k] ){
                var index = ( layer.data[k][l] && layer.data[k][l].index ) ? layer.data[k][l].index : 0;
                result.push({x: l , y: k, tile: index, collides: layer.data[k][l].collides });
            }
        }
        return result;
    }
    
    this.restoreTileMapLayer = function( map, data, layerName ){
        var layer = map.layers[ map.getLayerIndex( layerName ) ];
        for( var i in data ){
            map.putTile( data[i].tile, data[i].x, data[i].y, layerName );
            layer.data[data[i].y][data[i].x].collides = data[i].collides;
        }
    }
}


