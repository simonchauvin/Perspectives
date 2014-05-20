/*globals FM */
/**
 * @author Simon Chauvin
 */
var playState = function () {
    "use strict";
    FM.State.apply(this);

    this.player = null;
    this.npc1 = null;
    this.npc2 = null;
    this.npc3 = null;
    this.rendererNpc1 = null;
    this.rendererNpc2 = null;
    this.rendererNpc3 = null;
    this.audioNpc1 = null;
    this.audioNpc2 = null;
    this.audioNpc3 = null;
    this.spatial = null;
    this.renderer = null;
    this.physic = null;
    this.background = null;
    this.explodeSnd = null;
    this.music = null;
    this.sound = null;
    this.tileMap = null;
    this.fogMap = null;
    this.groundType = new FM.ObjectType("ground");
    this.playerType = new FM.ObjectType("player");
    this.npcType = new FM.ObjectType("npc");
};
playState.prototype = Object.create(FM.State.prototype);
/**
 * 
 * @returns {undefined}
 */
playState.prototype.init = function () {
    FM.State.prototype.init.apply(this, [2048, 1536]);

    this.background = new FM.GameObject(5);
    this.spatial = this.background.addComponent(new FM.SpatialComponent(0, 0, this.background));
    this.renderer = this.background.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("background"), 2048, 1536, this.background));
    this.add(this.background);

    this.music = new FM.GameObject(0);
    this.sound = this.music.addComponent(new FM.AudioComponent(this.music));
    this.sound.addSound(FM.AssetManager.getAssetByName("music"));
    this.sound.play("music", 0.5, true);

    //Loading tmx file
    var map = new FM.TmxMap();
    map.load(FM.AssetManager.getAssetByName("world").content);
    var objects = map.getObjectGroup('objects'),
        object,
        path,
        sap,
        aPump,
        i;
    //Load tiles
    this.tileMap = new FM.TileMap(FM.AssetManager.getAssetByName("tileset"), 32, 24, 64, 64, [this.groundType], 10, true);
    this.getWorld().loadTileMap(this.tileMap, map, "tiles", "ground");
    //Load fog
    this.fogMap = new FM.TileMap(FM.AssetManager.getAssetByName("tileset"), 32, 24, 64, 64, [], 14, false);
    this.getWorld().loadTileMap(this.fogMap, map, "fog", "ground");
    //Load objects
    for (i = 0; i < objects.objects.length; i = i + 1) {
        object = objects.objects[i];
        //Create avatar
        if (object.name === "avatar") {
            this.player = avatar(object.x, object.y, this.groundType, this.playerType);
            this.add(this.player);
            this.player.renderer.play("idle");
        } else if (object.type === "npc") {
            //Create NPCs
            var npc = new FM.GameObject(12);
            npc.addType(this.npcType);
            this.spatial = npc.addComponent(new FM.SpatialComponent(object.x, object.y, npc));
            if (object.name === "npc1") {
                this.npc1 = npc;
                npc.addComponent(new FM.CircleComponent(20, npc));
                this.rendererNpc1 = npc.addComponent(new FM.AnimatedSpriteRendererComponent(FM.AssetManager.getAssetByName("npc1"), 46, 63, npc));
                this.rendererNpc1.addAnimation("idle", [0], 30, false);
                this.rendererNpc1.addAnimation("explode", [1, 2, 3, 4], 20, false);
                this.rendererNpc1.play("idle");
                this.audioNpc1 = npc.addComponent(new FM.AudioComponent(npc));
                this.audioNpc1.addSound(FM.AssetManager.getAssetByName("explode"));
            } else if (object.name === "npc2") {
                this.npc2 = npc;
                npc.addComponent(new FM.CircleComponent(20, npc));
                this.rendererNpc2 = npc.addComponent(new FM.AnimatedSpriteRendererComponent(FM.AssetManager.getAssetByName("npc2"), 46, 63, npc));
                this.rendererNpc2.addAnimation("idle", [0], 30, false);
                this.rendererNpc2.addAnimation("explode", [1, 2, 3, 4], 20, false);
                this.rendererNpc2.play("idle");
                this.audioNpc2 = npc.addComponent(new FM.AudioComponent(npc));
                this.audioNpc2.addSound(FM.AssetManager.getAssetByName("explode"));
            } else if (object.name === "npc3") {
                this.npc3 = npc;
                npc.addComponent(new FM.CircleComponent(20, npc));
                this.rendererNpc3 = npc.addComponent(new FM.AnimatedSpriteRendererComponent(FM.AssetManager.getAssetByName("npc3"), 46, 63, npc));
                this.rendererNpc3.addAnimation("idle", [0], 30, false);
                this.rendererNpc3.addAnimation("explode", [1, 2, 3, 4], 20, false);
                this.rendererNpc3.play("idle");
                this.audioNpc3 = npc.addComponent(new FM.AudioComponent(npc));
                this.audioNpc3.addSound(FM.AssetManager.getAssetByName("explode"));
            }
            this.add(npc);
        }
    }

    this.centerCameraOn(this.player);
    this.follow(this.player, 512, 512);
    this.sortByZIndex();
};

/**
* Update the game
*/
playState.prototype.update = function (dt) {
    FM.State.prototype.update.apply(this, [dt]);
    if (this.sound.currentTime >= this.sound.duration - 1) {
        this.sound.currentTime = 0;
    }

    if (this.rendererNpc1.getCurrentAnim() === "explode" && this.rendererNpc1.finished && this.npc1.isVisible()) {
        this.npc1.kill();
        this.npc1.hide();
        this.player.jumpHeight = 1.3;
    }

    if (this.rendererNpc2.getCurrentAnim() === "explode" && this.rendererNpc2.finished && this.npc2.isVisible()) {
        this.npc2.kill();
        this.npc2.hide();
        this.player.jumpHeight = 1.6;
    }

    if (this.rendererNpc3.getCurrentAnim() === "explode" && this.rendererNpc3.finished && this.npc3.isVisible()) {
        this.npc3.kill();
        this.npc3.hide();
        this.player.jumpHeight = 2;
    }

    if (!this.player.physic.overlapsWithObject(this.npc1.components[FM.ComponentTypes.PHYSIC]) && this.rendererNpc1.getCurrentAnim() !== "explode") {
        this.rendererNpc1.play("idle");
    } else if (this.player.physic.overlapsWithObject(this.npc1.components[FM.ComponentTypes.PHYSIC]) && this.rendererNpc1.getCurrentAnim() !== "explode") {
        this.rendererNpc1.play("explode");
        this.audioNpc1.play("explode", 0.3, false);
    }

    if (!this.player.physic.overlapsWithObject(this.npc2.components[FM.ComponentTypes.PHYSIC]) && this.rendererNpc2.getCurrentAnim() !== "explode") {
        this.rendererNpc2.play("idle");
    } else if (this.player.physic.overlapsWithObject(this.npc2.components[FM.ComponentTypes.PHYSIC]) && this.rendererNpc2.getCurrentAnim() !== "explode") {
        this.rendererNpc2.play("explode");
        this.audioNpc2.play("explode", 0.3, false);
    }

    if (!this.player.physic.overlapsWithObject(this.npc3.components[FM.ComponentTypes.PHYSIC]) && this.rendererNpc3.getCurrentAnim() !== "explode") {
        this.rendererNpc3.play("idle");
    } else if (this.player.physic.overlapsWithObject(this.npc3.components[FM.ComponentTypes.PHYSIC]) && this.rendererNpc3.getCurrentAnim() !== "explode") {
        this.rendererNpc3.play("explode");
        this.audioNpc3.play("explode", 0.3, false);
    }

    this.player.sight = 2 + (1 / this.player.spatial.position.y) * 1000;

    //Lighten the player and around
    var idxI = Math.floor(this.player.spatial.position.y / 64),
        idxJ = Math.floor(this.player.spatial.position.x / 64),
        i,
        data,
        tile;
    for (i = 0; i < this.player.sight; i += 1) {
        data = this.fogMap.getData();
        tile = this.getGameObjectById(data[idxI][idxJ]);
        tile.hide();
        if (data[idxI + i]) {
            tile = this.getGameObjectById(data[idxI + i][idxJ]);
            tile.hide();
            if (data[idxI + i][idxJ + i]) {
                tile = this.getGameObjectById(data[idxI + i][idxJ + i]);
                tile.hide();
            }
        }
        if (data[idxI - i]) {
            tile = this.getGameObjectById(data[idxI - i][idxJ]);
            tile.hide();
        }
        if (data[idxI][idxJ + i]) {
            tile = this.getGameObjectById(data[idxI][idxJ + i]);
            tile.hide();
            if (data[idxI - i] && data[idxI - i][idxJ + i]) {
                tile = this.getGameObjectById(data[idxI - i][idxJ + i]);
                tile.hide();
            }
        }
        if (data[idxI][idxJ - i]) {
            tile = this.getGameObjectById(data[idxI][idxJ - i]);
            tile.hide();
            if (data[idxI - i] && data[idxI - i][idxJ - i]) {
                tile = this.getGameObjectById(data[idxI - i][idxJ - i]);
                tile.hide();
            }
            if (data[idxI + i] && data[idxI + i][idxJ - i]) {
                tile = this.getGameObjectById(data[idxI + i][idxJ - i]);
                tile.hide();
            }
        }

        if (data[idxI][idxJ + i]) {
            tile = this.getGameObjectById(data[idxI][idxJ + i]);
            tile.hide();
        }
    }

    //end of the game
    if (this.player.spatial.position.y < 300 && this.player.spatial.position.x < 150) {
        FM.Game.switchState(new endState());
    }
};