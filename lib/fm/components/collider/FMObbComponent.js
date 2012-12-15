/**
 * Under Creative Commons Licence.
 * 
 * @author Simon Chauvin.
 * @param {FMGameObject} The game object to which the component belong.
 * @returns {FMAabbComponent} The oriented bounding box component itself.
 */
function fmObbComponent(owner) {
    "use strict";
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
     * The components necessary
     */
    var spatial = null;
    var renderer = null;
    var dynamic = null;

    /**
     * The actual axis aligned bounding box
     */
    var obb_ = null;

    /**
     * To simplify, x and y are accessible without having to pass by the spatial component
     * TODO define a getter that is called when using x and y (same for width and height)
     */
    that_.x = null;
    that_.y = null;

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
        obb_ = fmRectangle(x, y, width, height);
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that_.postInit = function () {
        //Retrieve the components
        spatial = owner.components[fmComponentTypes.spatial];
        renderer = owner.components[fmComponentTypes.renderer];
        dynamic = owner.components[fmComponentTypes.dynamic];
    };

    /**
     * Update the component
     */
    that_.update = function (game) {
        //Update bounding box position
        that_.x = spatial.x + ((renderer.getWidth() - obb_.getWidth()) / 2);
        that_.y = spatial.y + ((renderer.getHeight() - obb_.getHeight()) / 2);

        //Make sure that the position of the bounding box is updated
        obb_.x = that_.x;
        obb_.y = that_.y;
    };

    /**
     * Check collisions and add the sides that collide to the touching array
     * TODO make it private and called by the functions isBottomSideColliding, isTopSide.. etc.
     * @param {FMTileMap} Collision tiles map.
     */
    that_.checkCollisions = function (collisions, xVelocity, yVelocity) {
        //TODO
        return false;
    }

    /**
     * Get the width of the bounding box
     */
    that_.getWidth = function () {
        return obb_.getWidth();
    };

    /**
     * Get the height of the bounding box
     */
    that_.getHeight = function () {
        return obb_.getHeight();
    };

    /**
     * Get the width of the bounding box
     */
    that_.setWidth = function (width) {
        obb_.setWidth(width);
    };

    /**
     * Get the height of the bounding box
     */
    that_.setHeight = function (height) {
        obb_.setHeight(height);
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