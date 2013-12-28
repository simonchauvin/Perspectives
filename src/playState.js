/**
 * @author Simon Chauvin
 */
function playState() {
    "use strict";
    var that = Object.create(FM.state()),
        player,
        npc1,
        npc2,
        npc3,
        rendererNpc1,
        rendererNpc2,
        rendererNpc3,
        audioNpc1,
        audioNpc2,
        audioNpc3,
        spatial,
        renderer,
        physic,
        background = null,
        explodeSnd,
        music,
        sound,
        tileMap,
        fogMap,
        groundType = FM.objectType("ground"),
        playerType = FM.objectType("player"),
        npcType = FM.objectType("npc");

    that.init = function () {
        Object.getPrototypeOf(that).init(2048, 1536);

        background = FM.gameObject(5);
        spatial = FM.spatialComponent(0, 0, background);
        background.addComponent(spatial);
        renderer = FM.spriteRendererComponent(FM.assetManager.getAssetByName("background"), 2048, 1536, background);
        that.add(background);

        music = FM.gameObject(0);
        sound = FM.audioComponent(music);
        sound.addSound(FM.assetManager.getAssetByName("music"));
        sound.play("music", 0.5, true);

        //Loading tmx file
        var map = FM.tmxMap();
        map.load(FM.assetManager.getAssetByName("world").getContent());
        var objects = map.getObjectGroup('objects'),
            object,
            path,
            sap,
            aPump,
            i;
        //Load tiles
        tileMap = FM.tileMap(FM.assetManager.getAssetByName("tileset"), 32, 24, 64, 64, [groundType], 10, true);
        that.getWorld().loadTileMap(tileMap, map, "tiles", "ground");
        //Load fog
        fogMap = FM.tileMap(FM.assetManager.getAssetByName("tileset"), 32, 24, 64, 64, [], 14, false);
        that.getWorld().loadTileMap(fogMap, map, "fog", "ground");
        //Load objects
        for (i = 0; i < objects.objects.length; i = i + 1) {
            object = objects.objects[i];
            //Create avatar
            if (object.name === "avatar") {
                player = avatar(object.x, object.y, groundType, playerType);
                that.add(player);
                player.renderer.play("idle");
            } else if (object.type === "npc") {
                //Create NPCs
                var npc = FM.gameObject(12);
                npc.addType(npcType);
                spatial = FM.spatialComponent(object.x, object.y, npc);
                if (object.name === "npc1") {
                    npc1 = npc;
                    FM.circleComponent(20, npc);
                    rendererNpc1 = FM.animatedSpriteRendererComponent(FM.assetManager.getAssetByName("npc1"), 46, 63, npc);
                    rendererNpc1.addAnimation("idle", [0], 30, false);
                    rendererNpc1.addAnimation("explode", [1, 2, 3, 4], 20, false);
                    rendererNpc1.play("idle");
                    audioNpc1 = FM.audioComponent(npc);
                    audioNpc1.addSound(FM.assetManager.getAssetByName("explode"));
                } else if (object.name === "npc2") {
                    npc2 = npc;
                    FM.circleComponent(20, npc);
                    rendererNpc2 = FM.animatedSpriteRendererComponent(FM.assetManager.getAssetByName("npc2"), 46, 63, npc);
                    rendererNpc2.addAnimation("idle", [0], 30, false);
                    rendererNpc2.addAnimation("explode", [1, 2, 3, 4], 20, false);
                    rendererNpc2.play("idle");
                    audioNpc2 = FM.audioComponent(npc);
                    audioNpc2.addSound(FM.assetManager.getAssetByName("explode"));
                } else if (object.name === "npc3") {
                    npc3 = npc;
                    FM.circleComponent(20, npc);
                    rendererNpc3 = FM.animatedSpriteRendererComponent(FM.assetManager.getAssetByName("npc3"), 46, 63, npc);
                    rendererNpc3.addAnimation("idle", [0], 30, false);
                    rendererNpc3.addAnimation("explode", [1, 2, 3, 4], 20, false);
                    rendererNpc3.play("idle");
                    audioNpc3 = FM.audioComponent(npc);
                    audioNpc3.addSound(FM.assetManager.getAssetByName("explode"));
                }
                that.add(npc);
            }
        }

        that.centerCameraOn(player);
        that.follow(player, 512, 512);
        that.sortByZIndex();
    };

    /**
    * Update the game
    */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

        if (sound.currentTime >= sound.duration - 1) {
            sound.currentTime = 0;
        }

        if (rendererNpc1.getCurrentAnim() === "explode" && rendererNpc1.finished && npc1.isVisible()) {
            npc1.kill();
            npc1.hide();
            player.jumpHeight = 1.3;
        }

        if (rendererNpc2.getCurrentAnim() === "explode" && rendererNpc2.finished && npc2.isVisible()) {
            npc2.kill();
            npc2.hide();
            player.jumpHeight = 1.6;
        }

        if (rendererNpc3.getCurrentAnim() === "explode" && rendererNpc3.finished && npc3.isVisible()) {
            npc3.kill();
            npc3.hide();
            player.jumpHeight = 2;
        }

        if (!player.physic.overlapsWithObject(npc1.components[FM.componentTypes.PHYSIC]) && rendererNpc1.getCurrentAnim() !== "explode") {
            rendererNpc1.play("idle");
        } else if (player.physic.overlapsWithObject(npc1.components[FM.componentTypes.PHYSIC]) && rendererNpc1.getCurrentAnim() !== "explode") {
            rendererNpc1.play("explode");
            audioNpc1.play("explode", 0.3, false);
        }

        if (!player.physic.overlapsWithObject(npc2.components[FM.componentTypes.PHYSIC]) && rendererNpc2.getCurrentAnim() !== "explode") {
            rendererNpc2.play("idle");
        } else if (player.physic.overlapsWithObject(npc2.components[FM.componentTypes.PHYSIC]) && rendererNpc2.getCurrentAnim() !== "explode") {
            rendererNpc2.play("explode");
            audioNpc2.play("explode", 0.3, false);
        }

        if (!player.physic.overlapsWithObject(npc3.components[FM.componentTypes.PHYSIC]) && rendererNpc3.getCurrentAnim() !== "explode") {
            rendererNpc3.play("idle");
        } else if (player.physic.overlapsWithObject(npc3.components[FM.componentTypes.PHYSIC]) && rendererNpc3.getCurrentAnim() !== "explode") {
            rendererNpc3.play("explode");
            audioNpc3.play("explode", 0.3, false);
        }

        player.sight = 2 + (1 / player.spatial.position.y) * 1000;

        //Lighten the player and around
        var idxI = Math.floor(player.spatial.position.y / 64),
            idxJ = Math.floor(player.spatial.position.x / 64),
            i,
            data,
            tile;
        for (i = 0; i < player.sight; i += 1) {
            data = fogMap.getData();
            tile = that.getGameObjectById(data[idxI][idxJ]);
            tile.hide();
            if (data[idxI + i]) {
                tile = that.getGameObjectById(data[idxI + i][idxJ]);
                tile.hide();
                if (data[idxI + i][idxJ + i]) {
                    tile = that.getGameObjectById(data[idxI + i][idxJ + i]);
                    tile.hide();
                }
            }
            if (data[idxI - i]) {
                tile = that.getGameObjectById(data[idxI - i][idxJ]);
                tile.hide();
            }
            if (data[idxI][idxJ + i]) {
                tile = that.getGameObjectById(data[idxI][idxJ + i]);
                tile.hide();
                if (data[idxI - i] && data[idxI - i][idxJ + i]) {
                    tile = that.getGameObjectById(data[idxI - i][idxJ + i]);
                    tile.hide();
                }
            }
            if (data[idxI][idxJ - i]) {
                tile = that.getGameObjectById(data[idxI][idxJ - i]);
                tile.hide();
                if (data[idxI - i] && data[idxI - i][idxJ - i]) {
                    tile = that.getGameObjectById(data[idxI - i][idxJ - i]);
                    tile.hide();
                }
                if (data[idxI + i] && data[idxI + i][idxJ - i]) {
                    tile = that.getGameObjectById(data[idxI + i][idxJ - i]);
                    tile.hide();
                }
            }

            if (data[idxI][idxJ + i]) {
                tile = that.getGameObjectById(data[idxI][idxJ + i]);
                tile.hide();
            }
        }

        //end of the game
        if (player.spatial.position.y < 300 && player.spatial.position.x < 150) {
            FM.game.switchState(endState());
        }
    };

    return that;
}