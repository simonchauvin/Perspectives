/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMPreloader is used to set the preload page
 * 
 */
function fmPreloader(firstState) {
    "use strict";
    var that = Object.create(fmState());

    var loadingIndicator = null;

    /**
     * Init the preloader
     */
    that.init = function () {
        Object.getPrototypeOf(that).init();

        //Add the assets from the engine and load them all
        //TODO fix might fail when the user do not put fm in libs folder
        fmAssetManager.addAsset("fmPauseIcon", fmParameters.IMAGE, "lib/fm/assets/gfx/fm_pause.png");
        fmAssetManager.addAsset("fmMuteIcon", fmParameters.IMAGE, "lib/fm/assets/gfx/fm_mute.png");
        fmAssetManager.addAsset("fmSoundOnIcon", fmParameters.IMAGE, "lib/fm/assets/gfx/fm_sound_on.png");
        fmAssetManager.addAsset("fmLogo", fmParameters.IMAGE, "lib/fm/assets/gfx/fm_logo.png");
        fmAssetManager.loadAssets();

        //Create the loading text
        loadingIndicator = fmGameObject(99);
        var spatial = fmSpatialComponent(loadingIndicator);
        spatial.init(fmParameters.screenWidth / 2, fmParameters.screenHeight / 2);
        loadingIndicator.addComponent(spatial);
        var textRenderer = fmTextRendererComponent(loadingIndicator);
        textRenderer.text = 100;
        textRenderer.setFormat('#fff', '30px sans-serif', 'middle');
        loadingIndicator.addComponent(textRenderer);
        that.add(loadingIndicator);
    };

    /**
     * 
     */
    that.update = function (game) {
        Object.getPrototypeOf(that).update(game);

        //Update the value of the loading text
        loadingIndicator.components[fmComponentTypes.renderer].text = Math.ceil(fmAssetManager.loadingProgress);

        //If all the assets are loaded then start the first state
        if (fmAssetManager.assets.length == 0 || fmAssetManager.areAllAssetsLoaded()) {
            game.switchState(firstState());
        }
    };

    /**
     * 
     */
    that.draw = function (bufferContext) {
        Object.getPrototypeOf(that).draw(bufferContext);

        //Loading screen
        bufferContext.drawImage(Object.getPrototypeOf(fmAssetManager.getAssetByName("fmLogo")), fmParameters.screenWidth / 2 - 250, fmParameters.screenHeight / 2 - 200);
    };

    return that;
}