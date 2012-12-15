/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmFileAsset(name, path) {
    "use strict";
    var that_ = new XMLHttpRequest();

    var name_ = name;
    var path_ = path;
    var content_;

    /**
     * 
     */
    that_.load = function () {
        that_.addEventListener("load", that_.loaded, false);
        that_.open("GET", path_, false);
        that_.send();
    };

    that_.loaded = function () {
        content_ = that_.response;
        fmAssetManager.assetLoaded();
    }

    that_.getName = function () {
        return name_;
    };

    that_.getPath = function () {
        return path_;
    };

    that_.getContent = function () {
        return content_;
    }

    return that_;
};