/**
 * Under Creative Commons Licence
 * Object tile that represents what a tile is
 * @author Simon Chauvin
 */
function fmTile(x, y, name, zIndex, tileMap, width, height, visible, allowCollisions) {
    "use strict";
    var that_ = Object.create(fmGameObject(x, y, zIndex));


    /**
     * Reference to the tile map to which this tile is associated
     */
    var tileMap_ = tileMap;
    /**
     * Width of the tile
     */
    var width_ = width;
    /**
     * Height of the tile
     */
    var height_ = height;
    //Visibility of the tile (inherited from game object)
    that_.visible = visible;
    //What type (if any) of collisions is allowed (inherited from game object)
    allowCollisions_ = allowCollisions;

    return that_;
}