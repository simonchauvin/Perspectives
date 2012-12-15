/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param x
 * @param y
 * @param zIndex
 * @returns {FMGameObject}
 */
function fmGameObject(zIndex) {
    "use strict";
    var that = {};

    /**
     * 
     */
    var id_;
    /**
     *
     */
    var name_ = "";
    /**
     *
     */
    that.components = {};
    /**
     *
     */
    var allowCollisions_ = fmParameters.ANY;
    /**
     *
     */
    that.zIndex = zIndex;
    /**
     *
     */
    that.destroyed = false;
    /**
     *
     */
    that.visible = true;

    /**
     *
     */
    that.init = function () {
        
    }

    /**
     *
     */
    that.postInit = function () {
        if (fmParameters.debug) {
            console.log("INIT: The components are being initialized");
        }
        //Init the components
        for (var component in that.components) {
            that.components[component].postInit();
        }
    }

    /**
    * Update the game object
    */
    that.update = function (game) {

    };

    /**
    * Draw the game object
    */
    that.draw = function (bufferContext) {

    };

    /**
     *
     */
    that.addComponent = function(component) {
        var name = component.name;
        if (!that.components[name]) {
            that.components[name] = component;
        }
    };

    /**
     *
     */
    that.getComponent = function (type) {
        return components[type];
    };

    /**
    * Check if two game objects collide
    * To use in case the game objects are very likely to collide
    *
    * @param otherGameObject
    */
    that.collide = function (otherGameObject) {
        var spatial1 = that.components[fmComponentTypes.spatial];
        var spatial2 = otherGameObject.components[fmComponentTypes.spatial];
        var dynamic1 = that.components[fmComponentTypes.dynamic];
        var dynamic2 = otherGameObject.components[fmComponentTypes.dynamic];
        var renderer1 = that.components[fmComponentTypes.renderer];
        var renderer2 = otherGameObject.components[fmComponentTypes.renderer];
        if (dynamic1 && dynamic2) {
            return (spatial2.x + dynamic2.boundingBox.width > spatial1.x) && (spatial2.x < spatial1.x + dynamic1.boundingBox.width)
            && (spatial2.y + dynamic2.boundingBox.height > spatial1.y) && (spatial2.y < spatial1.y + dynamic1.boundingBox.height);
        } else if (renderer1 || renderer2) {
            return (spatial2.x + renderer2.getWidth() > spatial1.x) && (spatial2.x < spatial1.x + renderer1.getWidth())
            && (spatial2.y + renderer2.getHeight() > spatial1.y) && (spatial2.y < spatial1.y + renderer1.getHeight());
        } else {
            return false;
        }
    };

    /**
    *
    */
    that.destroy = function () {
        that.destroyed = true;
        //TODO nullify every variables
    };

    /**
     *
     */
    that.getName = function () {
        return name_;
    }

    /**
     *
     */
    that.setName = function (name) {
        name_ = name;
    }

    /**
     *
     */
    that.getId = function () {
        return id_;
    }

    /**
     *
     */
    that.setId = function (id) {
        id_ = id;
    }

    return that;
}