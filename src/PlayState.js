/**
 * @author Simon Chauvin
 */
function playState() {
    "use strict";
    var that = Object.create(fmState());

    var player;
    var npc1;
    var npc2;
    var npc3;
    var rendererNpc1;
    var rendererNpc2;
    var rendererNpc3;
    var background = fmGameObject(0);
    var sp_ = fmSpatialComponent(background);
    sp_.init(0, 0);
    background.addComponent(sp_);
    var rdr_ = fmSpriteRendererComponent(background);
    rdr_.init(fmAssetManager.getAssetByName("background"), 2048, 1536);
    background.addComponent(rdr_);

    var explodeSnd;
    var music;
    var sound;

    var fogMap;

    that.init = function () {
        Object.getPrototypeOf(that).init();
        //fmParameters.debug = true;

        that.getWorld().setWidth(parameters.WORLD_WIDTH);
        that.getWorld().setHeight(parameters.WORLD_HEIGHT);

        explodeSnd = fmGameObject(0);
        var soundComponent = fmSoundComponent(explodeSnd);
        soundComponent.init(fmAssetManager.getAssetByName("explode"));
        explodeSnd.addComponent(soundComponent);
        explodeSnd = explodeSnd.components[fmComponentTypes.sound];
        music = fmGameObject(0);
        var soundComponent = fmSoundComponent(music);
        soundComponent.init(fmAssetManager.getAssetByName("music"));
        music.addComponent(soundComponent);
        sound = music.components[fmComponentTypes.sound].getSound();
        //sound.play(1, 0);

        var file = fmAssetManager.getAssetByName("world");
        var world = that.getWorld();
        world.init(file, "level", "collisions", "tiles", ["ground1","ground2","ground3","ground4","ground5"], 20);

        fogMap = fmTileMap();
        fogMap.init(file, "level", "fog", fmParameters.worldWidth, fmParameters.worldHeight);
        fogMap.loadMapFromCsv();
        var lines = fogMap.length;
        
        for (var i = 0; i < lines; i++) {
            var col = fogMap[i].length;
            for (var j = 0; j < col; j++) {
                if (fogMap[i][j] == 5) {
                    fogMap[i][j] = fmGameObject(20);
                    var spatial = fmSpatialComponent(fogMap[i][j]);
                    spatial.init(j * 64, i * 64);
                    fogMap[i][j].addComponent(spatial);
                    var renderer = fmSpriteRendererComponent(fogMap[i][j]);
                    renderer.init(fmAssetManager.getAssetByName("fog"), 64, 64);
                    fogMap[i][j].addComponent(renderer);
                    that.add(fogMap[i][j]);
                }
            }
        }
        fogMap = fogMap;

        player = world.getObjectByName("avatar");
        player = avatar(player.x, player.y);
        that.add(player);
        player.renderer.play("idle");

        npc1 = world.getObjectByName("npc1");
        var npcX = npc1.x;
        var npcY = npc1.y;
        npc1 = fmGameObject(10);
        sp_ = fmSpatialComponent(npc1);
        sp_.init(npcX, npcY);
        npc1.addComponent(sp_);
        rdr_ = fmAnimatedSpriteRendererComponent(npc1);
        rdr_.init(fmAssetManager.getAssetByName("npc1"), 46, 63);
        npc1.addComponent(rdr_);
        rdr_.setAnimation("idle", [0], 30, false);
        rdr_.setAnimation("explode", [1,2,3,4], 20, false);
        that.add(npc1);
        rendererNpc1 = npc1.components[fmComponentTypes.renderer];
        rendererNpc1.play("idle");

        npc2 = world.getObjectByName("npc2");
        npcX = npc2.x;
        npcY = npc2.y;
        npc2 = fmGameObject(10);
        sp_ = fmSpatialComponent(npc2);
        sp_.init(npcX, npcY);
        npc2.addComponent(sp_);
        rdr_ = fmAnimatedSpriteRendererComponent(npc2);
        rdr_.init(fmAssetManager.getAssetByName("npc2"), 46, 63);
        rdr_.setAnimation("idle",  [0], 30, false);
        rdr_.setAnimation("explode", [1,2,3,4], 20, false);
        npc2.addComponent(rdr_);
        rendererNpc2 = npc2.components[fmComponentTypes.renderer];
        that.add(npc2);
        rendererNpc2.play("idle");

        npc3 = world.getObjectByName("npc3");
        npcX = npc3.x;
        npcY = npc3.y;
        npc3 = fmGameObject(10);
        sp_ = fmSpatialComponent(npc3);
        sp_.init(npcX, npcY);
        npc3.addComponent(sp_);
        rdr_ = fmAnimatedSpriteRendererComponent(npc3);
        rdr_.init(fmAssetManager.getAssetByName("npc3"), 46, 63);
        rdr_.setAnimation("idle", [0], 30, false);
        rdr_.setAnimation("explode", [1,2,3,4], 20, false);
        npc3.addComponent(rdr_);
        rendererNpc3 = npc3.components[fmComponentTypes.renderer];
        that.add(npc3);
        rendererNpc3.play("idle");

        that.add(background);

        that.centerViewportOn(player);
        that.follow(player, 512, 512);
    };

    /**
    * Update the game
    */
    that.update = function (game) {
        Object.getPrototypeOf(that).update(game);

        if (sound.currentTime >= sound.duration - 1) {
            sound.currentTime = 0;
        }

        if (rendererNpc1.getCurrentAnim() == "explode" && rendererNpc1.finished && npc1.visible) {
            npc1.destroy();
            npc1.visible = false;
            player.components[fmComponentTypes.dynamic].yAcceleration = 400;
            player.components[fmComponentTypes.dynamic].maxYVelocity = 1000;
        }

        if (rendererNpc2.getCurrentAnim() == "explode" && rendererNpc2.finished && npc2.visible) {
            npc2.destroy();
            npc2.visible = false;
            player.jumpHeight = 0.4;
        }

        if (rendererNpc3.getCurrentAnim() == "explode" && rendererNpc3.finished && npc3.visible) {
            npc3.destroy();
            npc3.visible = false;
            player.jumpHeight = 0.6;
        }

        if (!player.collide(npc1) && rendererNpc1.getCurrentAnim() != "explode") {
            rendererNpc1.play("idle");
        } else if (player.collide(npc1) && rendererNpc1.getCurrentAnim() != "explode") {
            rendererNpc1.play("explode");
            explodeSnd.play(1, 0);
        }

        if (!player.collide(npc2) && rendererNpc2.getCurrentAnim() != "explode") {
            rendererNpc2.play("idle");
        } else if (player.collide(npc2) && rendererNpc2.getCurrentAnim() != "explode") {
            rendererNpc2.play("explode");
            explodeSnd.play(1, 0);
        }

        if (!player.collide(npc3) && rendererNpc3.getCurrentAnim() != "explode") {
            rendererNpc3.play("idle");
        } else if (player.collide(npc3) && rendererNpc3.getCurrentAnim() != "explode"){
            rendererNpc3.play("explode");
            explodeSnd.play(1, 0);
        }

        player.sight = 2 + (1 / player.spatial.y) * 1000;

        //Lighten the player and around
        var idxI = Math.floor(player.spatial.y / 64);
        var idxJ = Math.floor(player.spatial.x / 64);

        for (var i = 0; i < player.sight; i++) {
            fogMap[idxI][idxJ].visible = false;
            if (fogMap[idxI + i]) {
                fogMap[idxI + i][idxJ].visible = false;
                if (fogMap[idxI + i][idxJ + i]) {
                    fogMap[idxI + i][idxJ + i].visible = false;
                }
            }
            if (fogMap[idxI - i]) {
                fogMap[idxI - i][idxJ].visible = false;
            }
            if (fogMap[idxI][idxJ + i]) {
                fogMap[idxI][idxJ + i].visible = false;
                if (fogMap[idxI - i] && fogMap[idxI - i][idxJ + i]) {
                    fogMap[idxI - i][idxJ + i].visible = false;
                }
            }
            if (fogMap[idxI][idxJ - i]) {
                fogMap[idxI][idxJ - i].visible = false;
                if (fogMap[idxI - i] && fogMap[idxI - i][idxJ - i]) {
                    fogMap[idxI - i][idxJ - i].visible = false;
                }
                if (fogMap[idxI + i] && fogMap[idxI + i][idxJ - i]) {
                    fogMap[idxI + i][idxJ - i].visible = false;
                }
            }

            if (fogMap[idxI][idxJ + i]) {
                fogMap[idxI][idxJ + i].visible = false;
            }
        }

        //end of the game
        if (player.spatial.y < 300 && player.spatial.x < 150) {
            var newState = null;
            game.switchState(newState = endState());
        }
    };

    return that;
}