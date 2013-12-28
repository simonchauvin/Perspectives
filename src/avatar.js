/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function avatar(x, y, groundType, playerType) {
    "use strict";
    var that = Object.create(FM.gameObject(8));

    //Spatial component
    that.spatial = FM.spatialComponent(x, y, that);
    that.renderer = FM.animatedSpriteRendererComponent(FM.assetManager.getAssetByName("avatar"), 46, 63, that);
    that.physic = FM.aabbComponent(30, 62, that);
    that.physic.offset.x = 8;
    that.physic.addTypeToCollideWith(groundType);
    that.physic.mass = 10;

    that.addType(playerType);

    //Init the physics
    that.physic.elasticity = 0;
    that.physic.drag.x = 4;
    that.physic.maxVelocity.x = 200;
    that.physic.maxVelocity.y = 1000;

    var jumpTime = 0;
    that.jumpHeight = 1;
    that.sight = 3;

    that.audio = FM.audioComponent(that);
    that.audio.addSound(FM.assetManager.getAssetByName("fly"));

    //Animations
    that.renderer.addAnimation("idle", [0], 30, false);
    that.renderer.addAnimation("left", [1], 30, false);
    that.renderer.addAnimation("right", [2], 30, false);
    that.renderer.addAnimation("fly", [3], 30, true);
    that.renderer.addAnimation("walkRight", [4, 5, 6, 7, 8, 9, 10], 30, true);
    that.renderer.addAnimation("walkLeft", [11, 12, 13, 14, 15, 16, 17], 30, true);

    /**
    * Update the avatar
    */
    that.update = function (dt) {
        if (FM.game.isKeyPressed(FM.keyboard.UP)) {
            if (jumpTime < 0.2) {
                if (!that.audio.isPlaying("fly")) {
                    that.audio.play("fly", 0.3, false);
                }
                that.physic.acceleration.y = -2000 * that.jumpHeight;
                jumpTime += dt;
            } else {
                that.physic.acceleration.y = 0;
            }
        }
        if (that.physic.velocity.y === 0) {
            jumpTime = 0;
        }

        if (that.physic.velocity.y === 0 && that.physic.velocity.x <= 0) {
            if (that.renderer.getCurrentAnim() !== "walkLeft") {
                that.renderer.play("walkLeft");
            }
        }
        if (that.physic.velocity.y === 0 && that.physic.velocity.x >= 0) {
            if (that.renderer.getCurrentAnim() !== "walkRight") {
                that.renderer.play("walkRight");
            }
        }
        if (that.physic.velocity.y !== 0) {
            that.renderer.play("fly");
        }

        if (FM.game.isKeyPressed(FM.keyboard.LEFT)) {
            that.physic.acceleration.x = -800;
        }

        if (FM.game.isKeyPressed(FM.keyboard.RIGHT)) {
            that.physic.acceleration.x = 800;
        }

        if (!FM.game.isKeyPressed(FM.keyboard.LEFT) && !FM.game.isKeyPressed(FM.keyboard.RIGHT)) {
            that.physic.acceleration.x = 0;
            if (that.physic.velocity.x === 0 && that.physic.velocity.y === 0) {
                that.renderer.play("idle");
            }
        }
        //Gravity
        that.physic.acceleration.y += 500;
    };

    return that;
};
