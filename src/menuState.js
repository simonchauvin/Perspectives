/**
 * @author Simon Chauvin
 */
function menuState() {
    "use strict";
    var that = Object.create(FM.state()),
        text = null;

    /**
     * 
     * @returns {undefined}
     */
    that.init = function () {
        Object.getPrototypeOf(that).init();

        text = FM.gameObject(99);
        FM.spatialComponent(FM.game.getScreenWidth() / 2 - 160, 250, text);
        var renderer = FM.textRendererComponent("Perspectives", text);
        renderer.setFormat('#fff', '60px sans-serif', 'middle');
        that.add(text);

        text = FM.gameObject(99);
        FM.spatialComponent(FM.game.getScreenWidth() / 2 - 120, 512, text);
        renderer = FM.textRendererComponent("Press Enter to play", text);
        renderer.setFormat('#fff', '30px sans-serif', 'middle');
        that.add(text);

        text = FM.gameObject(99);
        FM.spatialComponent(FM.game.getScreenWidth() / 2 - 150, 600, text);
        renderer = FM.textRendererComponent("A game created by Simon Chauvin", text);
        renderer.setFormat('#fff', '20px sans-serif', 'middle');
        that.add(text);

        text = FM.gameObject(99);
        FM.spatialComponent(FM.game.getScreenWidth() / 2 - 40, 650, text);
        renderer = FM.textRendererComponent("Ludum Dare 23", text);
        renderer.setFormat('#fff', '10px sans-serif', 'middle');
        that.add(text);
    };

    /**
     * 
     * @param {type} dt
     * @returns {undefined}
     */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

        if (FM.game.isKeyReleased(FM.keyboard.ENTER) || FM.game.isMouseClicked()) {
            FM.game.switchState(playState());
        }
    };

    return that;
}