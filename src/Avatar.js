/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function avatar(x, y) {
    "use strict";
    var that = Object.create(fmGameObject(10));

    //Spatial component
    that.spatial = fmSpatialComponent(that);
    that.spatial.init(x, y);
    that.addComponent(that.spatial);

    that.renderer = fmAnimatedSpriteRendererComponent(that);
    that.renderer.init(fmAssetManager.getAssetByName("avatar"), 46, 63);
    that.addComponent(that.renderer);

    var colliderComponent = fmAabbComponent(that);
    colliderComponent.init(x + 8, y, 30, 63);
    that.addComponent(colliderComponent);

    var physicComponent = fmPhysicComponent(that);
    that.addComponent(physicComponent);

    //Init the physics
    physicComponent.gravity = 80;
    physicComponent.groundFriction = 0.8;
    physicComponent.airFriction = 1;
    physicComponent.bouncing = 0;
    physicComponent.xAcceleration = 80;
    physicComponent.yAcceleration = 200;
    physicComponent.maxXVelocity = 300;
    physicComponent.maxYVelocity = 500;

    var scriptComponent = fmScriptComponent(that);
    that.addComponent(scriptComponent);

    var jumpTime = 0;
    that.jumpHeight = 0.2;
    that.sight = 3;

    var flySnd = fmGameObject(0);
    var soundComponent = fmSoundComponent(flySnd);
    soundComponent.init(fmAssetManager.getAssetByName("fly"));
    flySnd.addComponent(soundComponent);
    flySnd = flySnd.components[fmComponentTypes.sound];

    //Animations
    that.renderer.setAnimation("idle", [0], 30, false);
    that.renderer.setAnimation("left", [1], 30, false);
    that.renderer.setAnimation("right", [2], 30, false);
    that.renderer.setAnimation("fly", [3], 30, false);
    that.renderer.setAnimation("walkRight", [4,5,6,7,8,9,10], 30, true);
    that.renderer.setAnimation("walkLeft", [11,12,13,14,15,16,17], 30, true);

    that.init = function () {
        Object.getPrototypeOf(that).init();
    }

    /**
    * Update the avatar
    */
    that.update = function (game) {
        that.move(game);
    };

    that.move = function(game) {
        if (game.isKeyPressed(fmKeyboard.up)) {
            if (jumpTime < that.jumpHeight) {
                flySnd.play(0.3, 0);
                physicComponent.moveUp();
                jumpTime += elapsedTime();
            }
        } else if (physicComponent.isOnGround()) {
            jumpTime = 0;
        }

        if (game.isKeyPressed(fmKeyboard.left)) {
            physicComponent.moveLeft();
            if (physicComponent.isOnGround() && that.renderer.getCurrentAnim() != "walkLeft") {
                that.renderer.play("walkLeft");
            }
        }

        if (game.isKeyPressed(fmKeyboard.right)) {
            physicComponent.moveRight();
            if (physicComponent.isOnGround() && that.renderer.getCurrentAnim() != "walkRight") {
                that.renderer.play("walkRight");
            }
        }

        if (physicComponent.isOnGround() && !game.isKeyPressed(fmKeyboard.left) && !game.isKeyPressed(fmKeyboard.right)) {
            that.renderer.play("idle");
        }

        if (!physicComponent.isOnGround()) {
            that.renderer.play("fly");
        }
    }

    return that;
}