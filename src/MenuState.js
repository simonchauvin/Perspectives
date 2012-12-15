/**
 * @author Simon Chauvin
 */
function menuState() {
    "use strict";
    var that = Object.create(fmState());

    var text = null;
    var music = null;
    var sound = null;

    that.init = function () {
        Object.getPrototypeOf(that).init();
        //fmParameters.debug = true;

        text = fmGameObject(10);
        var spatial = fmSpatialComponent(text);
        spatial.init(fmParameters.screenWidth / 2 - 160, 250);
        text.addComponent(spatial);
        var textRenderer = fmTextRendererComponent(text);
        textRenderer.text = "Perspectives";
        textRenderer.setFormat('#fff', '60px sans-serif', 'middle');
        text.addComponent(textRenderer);
        that.add(text);

        text = fmGameObject(10);
        spatial = fmSpatialComponent(text);
        spatial.init(fmParameters.screenWidth / 2 - 120, 512);
        text.addComponent(spatial);
        var textRenderer = fmTextRendererComponent(text);
        textRenderer.text = "Press Enter to play";
        textRenderer.setFormat('#fff', '30px sans-serif', 'middle');
        text.addComponent(textRenderer);
        that.add(text);

        text = fmGameObject(10);
        spatial = fmSpatialComponent(text);
        spatial.init(fmParameters.screenWidth / 2 - 150, 600);
        text.addComponent(spatial);
        var textRenderer = fmTextRendererComponent(text);
        textRenderer.text = "A game created by Simon Chauvin";
        textRenderer.setFormat('#fff', '20px sans-serif', 'middle');
        that.add(text);

        text = fmGameObject(10);
        spatial = fmSpatialComponent(text);
        spatial.init(fmParameters.screenWidth / 2 - 40, 650);
        text.addComponent(spatial);
        var textRenderer = fmTextRendererComponent(text);
        textRenderer.text = "Ludum Dare 23";
        textRenderer.setFormat('#fff', '10px sans-serif', 'middle');
        that.add(text);
    };

    that.update = function (game) {
        Object.getPrototypeOf(that).update(game);
        if (game.isKeyReleased(fmKeyboard.enter) || game.isMouseClicked()) {
            var newState = null;
            game.switchState(newState = playState());
            //that.destroy();
        }
    };

    return that;
}