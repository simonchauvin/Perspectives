/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmWorld(state, width, height) {
    "use strict";
    var that_ = {};

    /**
     *
     */
    var state_ = state;
    /**
     *
     */
    var data_ = "";
    /**
     *
     */
    var collisions_ = fmTileMap();
    /**
     *
     */
    var tiles_ = fmTileMap();
    /**
     *
     */
    var objects_ = [];
    /**
     *
     */
    var hasCollisions_ = false;
    /**
     * Width of the world
     */
    var width_ = width;
    /**
     * Height of the world
     */
    var height_ = height;
    /**
     * Horizontal offset of the world (used in case of scrolling)
     */
    that_.xOffset = 0;
    /**
     * Vertical offset of the world (used in case of scrolling)
     */
    that_.yOffset = 0;

    /**
     * 
     */
    that_.init = function (worldFile, worldLabel, collisionsLabel, tilesLabel, tileSet, tilesZindex) {
        //Retrieve the content of the file
        data_ = worldFile.getContent();
        //Load collisions
        collisions_.init(worldFile, worldLabel, collisionsLabel, width_, height_);
        collisions_.loadMapFromBitString();
        hasCollisions_ = collisions_.length > 0;
        //Load tiles
        tiles_.init(worldFile, worldLabel, tilesLabel, width_, height_);
        tiles_.loadMapFromCsv();
        //Create the tiled world
        createTiling(tileSet, tiles_.getTileWidth(), tiles_.getTileHeight(), tilesZindex);
        //Load objects
        loadObjects(worldLabel);
    };

    /**
     * 
     */
    var createTiling = function (tileSet, tileWidth, tileHeight, tilesZindex) {
        //TODO do something about creating the map here (give the name of the tile ?)
        //And add game objects here too ?
        var lines = tiles_.length;
        for (var i = 0; i < lines; i++) {
            var col = tiles_[i].length;
            for (var j = 0; j < col; j++) {
                var size = tileSet.length;
                for (var k = 0; k < size; k++) {
                    if (tiles_[i][j] == k) {
                        tiles_[i][j] = fmGameObject(tilesZindex);
                        var spatial = fmSpatialComponent(tiles_[i][j]);
                        spatial.init(j * tileWidth, i * tileHeight);
                        tiles_[i][j].addComponent(spatial);
                        var renderer = fmSpriteRendererComponent(tiles_[i][j]);
                        renderer.init(fmAssetManager.getAssetByName(tileSet[k]), tileWidth, tileHeight);
                        tiles_[i][j].addComponent(renderer);
                        state_.add(tiles_[i][j]);
                    }
                }
            }
        }
    }

    /**
     *
     */
    var loadObjects = function (rootName) {
        //Retrieve root element
        var root = parseXml(data_).getElementsByTagName(rootName)[0];
        //Retriebe objects node
        var objects = root.getElementsByTagName("objects")[0].childNodes;

        //Retrieve all the objects
        var i;
        for (i = 0; i < objects.length; i++) {
            //If the node is a dom element
            var object;
            if (objects[i].nodeType == 1) {
                //TODO do something about loading new game objects instead of object custom type (precise the type of the object ?)
                object = {id: 0, name: "", x: 0, y: 0};
                object.id = objects[i].getAttribute("id");
                object.name = objects[i].tagName;
                object.x = parseInt(objects[i].getAttribute("x"));
                object.y = parseInt(objects[i].getAttribute("y"));
                objects_.push(object);
            }
        }
    }

    /**
     * Retrieve the object whose name is specified.
     * @param {String} Name of the object to retrieve.
     * @returns {object} Object whose is the one specified, null otherwise.
     */
    that_.getObjectByName = function (name) {
        for (var i = 0; i < objects_.length; i++) {
            if (objects_[i].name == name) {
                return objects_[i];
            }
        }
        return null;
    }

    /**
     * Get the collisions array.
     * @returns {Array} Tiles of collisions.
     */
    that_.getCollisions = function () {
        return collisions_;
    }

    /**
     * @returns {boolean} True if the world has collisions, false otherwise.
     */
    that_.hasCollisions = function () {
        return hasCollisions_;
    }

    /**
     * Get the width
     */
    that_.getWidth = function () {
        return width_;
    }

    /**
     * Get the height
     */
    that_.getHeight = function () {
        return height_;
    }

    /**
     * Set the width
     */
    that_.setWidth = function (newWidth) {
        width_ = newWidth;
    }

    /**
     * Set the height
     */
    that_.setHeight = function (newHeight) {
        height_ = newHeight;
    }

    return that_;
}