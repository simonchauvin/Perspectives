/**
 * @author Simon Chauvin
 */
var start = function () {
    //Assets loading
    fmAssetManager.addAsset("explode", fmParameters.AUDIO, "assets/sfx/explode.wav");
    fmAssetManager.addAsset("fly", fmParameters.AUDIO, "assets/sfx/fly.wav");
    fmAssetManager.addAsset("music", fmParameters.AUDIO, "assets/sfx/music.wav");

    fmAssetManager.addAsset("avatar", fmParameters.IMAGE, "assets/gfx/avatar.png");
    fmAssetManager.addAsset("npc1", fmParameters.IMAGE, "assets/gfx/npc1.png");
    fmAssetManager.addAsset("npc2", fmParameters.IMAGE, "assets/gfx/npc2.png");
    fmAssetManager.addAsset("npc3", fmParameters.IMAGE, "assets/gfx/npc3.png");
    fmAssetManager.addAsset("background", fmParameters.IMAGE, "assets/gfx/background.png");
    fmAssetManager.addAsset("end", fmParameters.IMAGE, "assets/gfx/end.png");

    fmAssetManager.addAsset("ground1", fmParameters.IMAGE, "assets/gfx/ground.png");
    fmAssetManager.addAsset("ground2", fmParameters.IMAGE, "assets/gfx/ground2.png");
    fmAssetManager.addAsset("ground3", fmParameters.IMAGE, "assets/gfx/ground3.png");
    fmAssetManager.addAsset("ground4", fmParameters.IMAGE, "assets/gfx/ground4.png");
    fmAssetManager.addAsset("ground5", fmParameters.IMAGE, "assets/gfx/ground5.png");
    fmAssetManager.addAsset("fog", fmParameters.IMAGE, "assets/gfx/fog.png");

    fmAssetManager.addAsset("world", fmParameters.FILE, "world/world.oel");
    
    var game = fmGame("Perspectives", 1024, 768, menuState);
    game.run();
};

window.addEventListener("load", start, false);