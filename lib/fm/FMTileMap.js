/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmTileMap() {
    "use strict";
    var that_ = [];

    var data_ = "";
    var element_ = "";
    var width_ = 0;
    var height_ = 0;
    var tileWidth_ = 0;
    var tileHeight_ = 0;
    var linesNum_ = 0;
    var columnsNum_ = 0;

    /**
     * Init the map
     */
    that_.init = function (worldFile, rootName, elementName, mapWidth, mapHeight) {
        //Retrieve the content of the file
        data_ = worldFile.getContent();
        //Retrieve root element
        var root = parseXml(data_).getElementsByTagName(rootName)[0];
        //Retrieve the width and height of the map
        width_ = mapWidth;
        height_ = mapHeight;
        //Retrieve the targeted element
        element_ = root.getElementsByTagName(elementName)[0].firstChild.nodeValue;
    };

    /**
     * Load a given element from bitstring data
     */
    that_.loadMapFromBitString = function () {
        var idxI = 0, idxJ = 0;
        that_.push([]);
        for (var i = 0; i < element_.length; i++) {
            if (element_[i] != "\n") {
                that_[idxI][idxJ] = element_[i];
                idxJ++;
            } else {
                that_.push([]);
                idxI++;
                idxJ = 0;
            }
        }
        linesNum_ = that_.length;
        columnsNum_ = that_[0].length;
        tileWidth_ = width_ / columnsNum_;
        tileHeight_ = height_ / linesNum_;
    }

    /**
     * Load a given element from csv type data
     */
    that_.loadMapFromCsv = function () {
        var array = element_.split("\n");
        var length = array.length;
        for (var i = 0; i < length; i++) {
            that_[i] = array[i].split(",");
        }
        linesNum_ = that_.length;
        columnsNum_ = that_[0].length;
        tileWidth_ = width_ / columnsNum_;
        tileHeight_ = height_ / linesNum_;
    }

    /**
     * Retrieve the tile associated to the specified position
     */
    that_.getTile = function (x, y) {
        return that_[Math.floor(y / tileHeight_)][Math.floor(x / tileWidth_)];
    }

    /**
     * Get the map
     */
    that_.getMap = function () {
        return that_;
    }

    /**
     * Get the width of the map
     */
    that_.getWidth = function () {
        return width_;
    }

    /**
     * Get the height of the map
     */
    that_.getHeight = function () {
        return height_;
    }

    /**
     * Get the width of a tile
     */
    that_.getTileWidth = function () {
        return tileWidth_;
    }

    /**
     * Get the height of a tile
     */
    that_.getTileHeight = function () {
        return tileHeight_;
    }

    /**
     * Get the number of columns of the map
     */
    that_.getColumnsNumber = function () {
        return columnsNum_;
    }

    /**
     * Get the number of lines of the map
     */
    that_.getLinesNumber = function () {
        return linesNum_;
    }

    return that_;
}