/**
 * @author Simon Chauvin
 */
function endState() {
    "use strict";
    var that = Object.create(fmState());

    var startButton = null;

    that.init = function () {
        Object.getPrototypeOf(that).init();

        startButton = fmGameObject(10);
        var spatial = fmSpatialComponent(startButton);
        spatial.init(fmParameters.screenWidth / 2 - 160, 250);
        startButton.addComponent(spatial);
        var textRenderer = fmTextRendererComponent(startButton);
        textRenderer.text = "Perspectives";
        textRenderer.setFormat('#fff', '60px sans-serif', 'middle');
        startButton.addComponent(textRenderer);
        that.add(startButton);

        startButton = fmGameObject(5);
        var sp_ = fmSpatialComponent(startButton);
        sp_.init(0, 0);
        startButton.addComponent(sp_);
        var rdr_ = fmSpriteRendererComponent(startButton);
        rdr_.init(fmAssetManager.getAssetByName("end"), 1024, 768);
        startButton.addComponent(rdr_);
        that.add(startButton);
    };

    that.update = function (game) {
        Object.getPrototypeOf(that).update(game);

    };

    return that;
}