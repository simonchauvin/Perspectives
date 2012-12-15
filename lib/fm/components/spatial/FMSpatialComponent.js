/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that0}
 */
function fmSpatialComponent(owner) {
    "use strict";
    var that_ = fmComponent(fmComponentTypes.spatial, owner);

    that_.x = 0;
    that_.y = 0;

    that_.init = function (x, y) {
        that_.x = x;
        that_.y = y;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that_.postInit = function () {
        
    };

    return that_;
};