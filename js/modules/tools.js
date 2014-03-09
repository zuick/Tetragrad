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
}


