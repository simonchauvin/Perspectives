/**
 * 
 * @author Simon Chauvin
 * @param owner
 * @returns
 */
function fmSpriteRendererComponent(owner) {
    "use strict";
    var that = fmComponent(fmComponentTypes.renderer, owner);

    that.spatial = owner.components[fmComponentTypes.spatial];

    var image = new Image(), width_ = 50, height_ = 50;

    that.scrolled = true;

    /**
    * Initialize the sprite
    * @param img
    */
    that.init = function (img) {
        image = img;
        width_ = img.naturalWidth;
        height_ = img.naturalHeight;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        
    };

    /**
    * Draw the sprite
    */
    that.draw = function (bufferContext) {
        var xPosition = that.spatial.x, yPosition = that.spatial.y;
        if (that.scrolled) {
            xPosition -= bufferContext.xOffset;
            yPosition -= bufferContext.yOffset;
        }
        bufferContext.drawImage(Object.getPrototypeOf(image), xPosition, yPosition);

        //Debug draw the bounds of the sprite
        if (fmParameters.debug) {
            bufferContext.fillStyle = '#fff';
            bufferContext.strokeRect(xPosition, yPosition, width_, height_);
        }
    };

    /**
     *
     */
    that.setWidth = function (newWidth) {
        width_ = newWidth;
    };

    /**
     *
     */
    that.setHeight = function (newHeight) {
        height_ = newHeight;
    };

    /**
     *
     */
    that.getWidth = function () {
        return width_;
    };

    /**
     *
     */
    that.getHeight = function () {
        return height_;
    };

    return that;
}