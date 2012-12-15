/**
 * Under Creative Commons Licence.
 * 
 * @author Simon Chauvin.
 * @param {FMGameObject} The game object to which the component belong.
 * @returns {FMAabbComponent} The axis aligned bounding box component itself.
 */
function fmAabbComponent(owner) {
    "use strict";
    //TODO make it inherit from rectangle, useless to have components inherit fmcomponent ?????
    var that_ = fmComponent(fmComponentTypes.collider, owner);

    /**
     * 
     */
    var ANY = 0;
    /**
     * 
     */
    var TOP = 1;
    /**
     * 
     */
    var BOTTOM = 2;
    /**
     * 
     */
    var LEFT = 3;
    /**
     * 
     */
    var RIGHT = 4;
    /**
     * The necessary components
     */
    var spatial = null;
    var renderer = null;
    var dynamic = null;

    /**
     * To simplify, x and y are accessible without having to pass by the spatial component
     * TODO define a getter that is called when using x and y (same for width and height)
     */
    that_.x = null;
    that_.y = null;

    /**
     * Width of the aabb
     */
    var width_ = 0;
    /**
     * Height of the aabb
     */
    var height_ = 0;

    /**
     * By default nothing touches the game object
     */
    var touching_ = [];

    /**
     * By default the bounding box allow collisions on every sides
     * TODO add param in init function
     */
    var allowCollisions_ = fmParameters.ANY;

    /**
     * Init the collider component
     */
    that_.init = function (x, y, width, height) {
        that_.x = x;
        that_.y = y;
        width_ = width;
        height_ = height;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that_.postInit = function () {
        //Retrieve the components
        renderer = owner.components[fmComponentTypes.renderer];
    };

    /**
     * Update the component
     */
    that_.update = function (game) {
        
    };

    /**
     * Check collisions and add the sides that collide to the touching array
     * TODO make it private and called by the functions isBottomSideColliding, isTopSide.. etc.
     * @param {FMTileMap} Collision tiles map.
     */
    that_.checkCollisions = function (collisions, xPos, yPos) {
        var tileWidth = collisions.getTileWidth();
        var tileHeight = collisions.getTileHeight();
        var i1 = Math.floor(yPos / tileHeight);
        var j1 = Math.floor(xPos / tileWidth);
        var i2 = Math.floor((yPos + height_) / tileHeight);
        var j2 = Math.floor((xPos + width_) / tileWidth);
        var i,j;
        touching_ = [];
        for(i = i1; i <= i2; i++)
        {
            for(j = j1; j <= j2; j++)
            {
                if (collisions[i] && collisions[i][j] == 1) {
                    if (j == j1) {
                        touching_.push(LEFT);
                    }
                    if (j == j2) {
                        touching_.push(RIGHT);
                    }
                    if (i == i1) {
                        touching_.push(TOP);
                    }
                    if (i == i2) {
                        touching_.push(BOTTOM);
                    }
                    if (touching_.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Get the width of the bounding box
     */
    that_.getWidth = function () {
        return width_;
    };

    /**
     * Get the height of the bounding box
     */
    that_.getHeight = function () {
        return height_;
    };

    /**
     * Get the width of the bounding box
     */
    that_.setWidth = function (width) {
       width_ = width;
    };

    /**
     * Get the height of the bounding box
     */
    that_.setHeight = function (height) {
        height_ = height;
    };

    /**
     * Check if any side of the aabb is colliding.
     * @returns {Boolean} Whether a side side is colliding or not.
     */
    that_.isColliding = function () {
        return touching_.length > 0;
    };

    /**
     * Check if the left side of the aabb is colliding.
     * @returns {Boolean} Whether the left side is colliding or not.
     */
    that_.isLeftSideColliding = function () {
        return touching_.indexOf(LEFT) != -1;
    };

    /**
     * Check if the right side of the aabb is colliding.
     * @returns {Boolean} Whether the right side is colliding or not.
     */
    that_.isRightSideColliding = function () {
        return touching_.indexOf(RIGHT) != -1;
    };

    /**
     * Check if the top side of the aabb is colliding.
     * @returns {Boolean} Whether the top side is colliding or not.
     */
    that_.isTopSideColliding = function () {
        return touching_.indexOf(TOP) != -1;
    };

    /**
     * Check if the bottom side of the aabb is colliding.
     * @returns {Boolean} Whether the bottom side is colliding or not.
     */
    that_.isBottomSideColliding = function () {
        return touching_.indexOf(BOTTOM) != -1;
    };

    return that_;
}