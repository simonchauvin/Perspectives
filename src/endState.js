/**
 * @author Simon Chauvin
 */
function endState() {
    "use strict";
    var that = Object.create(FM.state()),
        text;

    that.init = function () {
        Object.getPrototypeOf(that).init();

        text = FM.gameObject(5);
        FM.spatialComponent(0, 0, text);
        FM.spriteRendererComponent(FM.assetManager.getAssetByName("end"), 1024, 768, text);
        that.add(text);

        text = FM.gameObject(99);
        FM.spatialComponent(FM.game.getScreenWidth() / 2 - 160, 250, text);
        var renderer = FM.textRendererComponent("Perspectives", text);
        renderer.setFormat('#fff', '60px sans-serif', 'middle');
        that.add(text);
    };

    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

    };

    return that;
}