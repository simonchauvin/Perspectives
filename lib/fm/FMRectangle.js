/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param width
 * @param height
 * @returns {___that0}
 */
function fmRectangle(x, y, width, height) {
    "use strict";
    var that_ = {};

    /**
     * Position
     */
    that_.x = x;
    that_.y = y;

    /**
     * Width
     */
    var width_ = width;
    /**
     * Height
     */
    var height_ = height;

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