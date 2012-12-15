/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMState is a simple container of game objects and helps structure the game
 *
 * @returns {FMState}
 */
function fmState() {
    "use strict";
    var that = {};

    /**
     * Used to know when to pause the game.
     */
    var pause_ = false;

    /**
     * Object representing the world topology (bounds, tiles, collisions, objects)
     */
    var world_;

    /**
    * Bounds of the view (limited by the screen resolution of the game)
    */
    that.viewport = fmRectangle(0, 0, 0, 0);

    /**
     * Variables controlling fps display in debug
     */
    var fpsDisplay = fmGameObject(99);
    //TODO allow chaining by returning the object for every function
    var sp_ = fmSpatialComponent(fpsDisplay);
    sp_.init(10, 20);
    fpsDisplay.addComponent(sp_);
    var txtRdr_ = fmTextRendererComponent(fpsDisplay);
    txtRdr_.text = "0";
    txtRdr_.setFormat('#fcd116', '30px sans-serif', 'middle');
    fpsDisplay.addComponent(txtRdr_);
    var totalFrames = 0;
    var totalTimeElapsed = 0;
    var actualFps = 0;

    /**
    * The game object that makes the screen scrolls
    */
    var scroller = null;
    /**
     * Frame of the camera (used in case of scrolling)
     */
    var followFrame = null;

    /**
    * Array containing every game objects of the state
    */
    that.gameObjects = [];
    /**
    * Array of arrays that stores colliders
    */
    //var colliders = [];

    /**
    * Create the state
    */
    that.init = function () {
        if (fmParameters.debug) {
            console.log("INIT: The state is being created");
        }
        fpsDisplay.visible = false;
        that.add(fpsDisplay);

        world_ = fmWorld(that, fmParameters.worldWidth, fmParameters.worldHeight);

        //Set the viewport size by the chosen screen size
        that.viewport.setWidth(fmParameters.screenWidth);
        that.viewport.setHeight(fmParameters.screenHeight);
//TODO init the game objects !!
//        for (var i = 0; i < 8; i++) {
//                colliders.push([]);
//                for (var j = 0; j < 8; j++) {
//                        colliders[i].push([]);
//                }
//        }
    };

    /**
     * Initialize the game objects of the state
     */
    that.postInit = function () {
        if (fmParameters.debug) {
            console.log("INIT: The game objects are initializing");
        }
        for ( var i = 0; i < that.gameObjects.length; i++) {
            that.gameObjects[i].postInit();
        }
    }

    /**
    * Initialize the bounds of the world, if not defined then apply the size of the game screen
    */
    that.initBounds = function () {
        // By default the view and the world are of the same size
        /*if (that.worldBounds.getWidth() == 0) {
            that.worldBounds.setWidth(fmParameters.screenWidth);
        }
        if (that.worldBounds.getHeight() == 0) {
            that.worldBounds.setHeight(fmParameters.screenHeight);
        }*/
    };

    /**
    * Private method that sort game objects according to their z index
    */
    var sortZIndex = function (a, b) {
            return (a.zIndex - b.zIndex);
    };

    /**
    * Add a game object to the state and sort it
    */
    that.add = function (gameObject) {
        that.gameObjects.push(gameObject);
        that.gameObjects.sort(sortZIndex);

//        if (gameObject && gameObject.components[fmComponentTypes.renderer]) {
//                var spatial = gameObject.components[fmComponentTypes.spatial];
//                if (gameObject.components[fmComponentTypes.collider]) {
//                        var indexI = Math.floor((spatial.x - 1) / (that.worldBounds.width / 8));
//                        var indexJ = Math.floor((spatial.y - 1) / (that.worldBounds.height / 8));
//                        colliders[indexI][indexJ].push(gameObject);
//                }
//        }
    };

    /**
    * Remove an object from the state
    */
    that.remove = function (gameObject) {
        var tmpGameObject, i = 0;
        while (i < that.gameObjects.length) {
            tmpGameObject = that.gameObjects.shift();
            if (tmpGameObject !== gameObject) {
                that.gameObjects.push(tmpGameObject);
            } else {
                gameObject.destroy();
                return;
            }
            i++;
        }
    };

    /**
    * Call all the updates
    */
    that.update = function (game) {
        if (!pause_) {
            //preUpdate(game);
            mainUpdate(game);
            //postUpdate(game);
        }
    };

    /**
    * Ensure something someday
    */
    var preUpdate = function (game) {
        
    };

    /**
    * Update the game objects of the state
    */
    var mainUpdate = function (game) {
        //Keep track of the number of frames that was used since the start of the state
        totalFrames++;
        //Keep track of the number of seconds that passed since the start of the state
        totalTimeElapsed += elapsedTime();
        //Calculate the actual FPS at which the game is running
        actualFps = Math.round(totalFrames / totalTimeElapsed);

        //Update every game object present in the state
        var gameObject, collider, dynamic, controller, script, components;
        for ( var i = 0; i < that.gameObjects.length; i++) {
            gameObject = that.gameObjects[i];
            if (!gameObject.destroyed) {
                components = gameObject.components;
                collider = components[fmComponentTypes.collider];
                dynamic = components[fmComponentTypes.dynamic];
                controller = components[fmComponentTypes.controller];
                script = components[fmComponentTypes.script];
                //Update the dynamic component first
                if (dynamic) {
                    dynamic.update(game);
                }
                //Update the collider according to the modifications done by the dynamic component
                if (collider) {
                    collider.update(game);
                }
                //Update scrolling
                if (scroller === gameObject) {
                    var newOffset;
                    var xVelocity = dynamic.getXVelocity(), yVelocity = dynamic.getYVelocity();
                    var frameWidth = followFrame.getWidth(), frameHeight = followFrame.getHeight();
                    if (fmParameters.debug) {
                        if (!collider) {
                            console.log("ERROR: The scrolling object must have a collider component");
                        }
                    }
                    var xPosition = collider.x, yPosition = collider.y;
                    var farthestXPosition = xPosition + collider.getWidth(), farthestYPosition = yPosition + collider.getHeight();

                    // Going left
                    if (xVelocity < 0 && xPosition <= followFrame.x) {
                        var vel = xVelocity * elapsedTime();
                        newOffset = world_.xOffset + vel;
                        if (newOffset >= 0) {
                            world_.xOffset = newOffset;
                            followFrame.x += vel;
                        }
                    }
                    // Going up
                    if (yVelocity < 0 && yPosition <= followFrame.y) {
                        var vel = yVelocity * elapsedTime();
                        newOffset = world_.yOffset + vel;
                        if (newOffset >= 0) {
                            world_.yOffset = newOffset;
                            followFrame.y += vel;
                        }
                    }
                    // Going right
                    if (xVelocity > 0 && farthestXPosition >= followFrame.x + frameWidth) {
                        var vel = xVelocity * elapsedTime();
                        newOffset = world_.xOffset + vel;
                        if (newOffset + that.viewport.getWidth() <= world_.getWidth()) {
                            world_.xOffset = newOffset;
                            followFrame.x += vel;
                        }
                    }
                    // Going down
                    if (yVelocity > 0 && farthestYPosition >= followFrame.y + frameHeight) {
                        var vel = yVelocity * elapsedTime();
                        newOffset = world_.yOffset + vel;
                        if (newOffset + that.viewport.getHeight() <= world_.getHeight()) {
                            world_.yOffset = newOffset;
                            followFrame.y += vel;
                        }
                    }
                }

                //Update the user defined script
                if (script) {
                    script.update(game);
                }
            }
        }
    };

    /**
    * Ensure something someday
    */
    var postUpdate = function (game) {
        
    };

    /**
    * Draw the game objects of the state
    */
    that.draw = function (bufferContext) {
        //Clear the screen
        bufferContext.clearRect(0, 0, fmParameters.screenWidth, fmParameters.screenHeight);

        //Update offsets
        bufferContext.xOffset = world_.xOffset;
        bufferContext.yOffset = world_.yOffset;

        //Display every game objects
        var gameObject, renderer, components;
        for ( var i = 0; i < that.gameObjects.length; i++) {
            gameObject = that.gameObjects[i];
            renderer = gameObject.components[fmComponentTypes.renderer];

            //If the game object has a renderer
            if (renderer) {
                components = gameObject.components;
                var spatial = components[fmComponentTypes.spatial];
                var dynamic = components[fmComponentTypes.dynamic];
                var xPosition = spatial.x, yPosition = spatial.y;
                var farthestXPosition = xPosition + renderer.getWidth(), farthestYPosition = yPosition + renderer.getHeight();

                // Debug display the camera bounds
                if (fmParameters.debug && scroller) {
                    var frameWidth = followFrame.getWidth(), frameHeight = followFrame.getHeight();
                    bufferContext.strokeStyle = '#fff';
                    bufferContext.strokeRect(followFrame.x - world_.xOffset, followFrame.y - world_.yOffset, frameWidth,
                    frameHeight);
                }

                //Draw the object to render if it is on screen
                var newViewX = that.viewport.x, newViewY = that.viewport.y;
                if (renderer.scrolled) {
                    newViewX = that.viewport.x + world_.xOffset;
                    newViewY = that.viewport.y + world_.yOffset;
                }
                if (farthestXPosition >= newViewX && farthestYPosition >= newViewY
                    && xPosition <= newViewX + that.viewport.getWidth() && yPosition <= newViewY + that.viewport.getHeight()) {
                    if (!gameObject.destroyed && gameObject.visible) {
                        renderer.draw(bufferContext);

                        // Debug display the bounding box (if any)
                        var collider = components[fmComponentTypes.collider];
                        if (fmParameters.debug) {
                            if (collider) {
                                bufferContext.strokeStyle = '#f4f';
                                bufferContext.strokeRect(collider.x - bufferContext.xOffset, collider.y - bufferContext.yOffset, collider.getWidth(),
                                collider.getHeight());
                            }
                            if (dynamic) {
                                //TODO direction
                                //bufferContext.strokeStyle = '#15f';
                                //bufferContext.beginPath();
                                //bufferContext.moveTo(collider.x - bufferContext.xOffset, collider.y - bufferContext.yOffset);
                                //bufferContext.lineTo(((collider.x - bufferContext.xOffset) + collider.getWidth() * 2), Math.tan(((collider.y - bufferContext.yOffset) + collider.getHeight() * 2) * (Math.PI / 182)) / dynamic.yVelocity);
                                //bufferContext.stroke();
                                //bufferContext.closePath();
                            }
                        }
                    }
                }
            }
        }
        // Debug
        if (fmParameters.debug) {
            //Display the fps
            fpsDisplay.visible = true;
            fpsDisplay.components[fmComponentTypes.renderer].text = actualFps;
            //Display the view bounds
            bufferContext.strokeStyle = '#fff';
            bufferContext.strokeRect(0, 0, that.viewport.getWidth(), that.viewport.getHeight());

            //Display the world bounds
            bufferContext.strokeStyle = '#fff';
            bufferContext.strokeRect(that.viewport.x - 0, 0 - that.viewport.y, world_.getWidth(), world_.getHeight());
        }
        if (pause_) {
            //TODO le petit bonhomme disparait quand on met pause
            //Fade screen
            bufferContext.fillStyle = "rgba(99,99,99,0.5)";
            bufferContext.fillRect(0, 0, fmParameters.screenWidth, fmParameters.screenHeight);

            //Show pause icon
            bufferContext.drawImage(Object.getPrototypeOf(fmAssetManager.getAssetByName("fmPauseIcon")), fmParameters.screenWidth / 2 - 50, fmParameters.screenHeight / 2 - 100);
            bufferContext.drawImage(Object.getPrototypeOf(fmAssetManager.getAssetByName("fmMuteIcon")), fmParameters.screenWidth / 2 - 25, fmParameters.screenHeight - 160);

            bufferContext.fillStyle = '#fff';
            bufferContext.font = '50px bold sans-serif';
            bufferContext.textBaseline = 'middle';
            bufferContext.fillText("PAUSE", fmParameters.screenWidth / 2 - 70, 100);
            bufferContext.font = '15px sans-serif';
            bufferContext.fillText("Powered by FMJSEngine", fmParameters.screenWidth / 2 - 65, fmParameters.screenHeight - 15);
        }
    };

    /**
    * Center the viewport on a specific game object
    */
    that.centerViewportOn = function(gameObject) {
        var spatial = gameObject.components[fmComponentTypes.spatial];
        world_.xOffset = spatial.x - fmParameters.screenWidth / 2;
        world_.yOffset = spatial.y - fmParameters.screenHeight / 2;
    }

    /**
    * Center the viewport at a specific given position
    */
    that.centerViewportAt = function(xPosition, yPosition) {
        world_.xOffset = xPosition - fmParameters.screenWidth / 2;
        world_.yOffset = yPosition - fmParameters.screenHeight / 2;
    }

    /**
    * Make an object as the scroller
    */
    that.follow = function(gameObject, width, height) {
        scroller = gameObject;
        followFrame = fmRectangle(fmParameters.screenWidth / 2 - width / 2 + world_.xOffset, fmParameters.screenHeight / 2 - height / 2 + world_.yOffset, width, height);
    }

    /**
    * Delete the scroller
    */
    that.unFollow = function() {
        followFrame = null;
        scroller = null;
    }

    /**
     * Triggered when the canvas elements loses focus, show pause screen and pause the game.
     */
    that.pause = function (bufferContext) {
        pause_ = true;
    }

    /**
     * Triggered when the canvas elements retrieves focus, restart the game.
     */
    that.restart = function (bufferContext) {
        pause_ = false;
    }

    /**
    * Destroy the state and its objects
    */
    that.destroy = function() {
        for ( var i = 0; i < that.gameObjects.length; i++) {
                that.gameObjects[i].destroy();
        }
        that.gameObjects = null;
    }
    
    /**
     * Get the object that scrolls the screen
     * @returns {FMGameObject} The game object that scrolls the screen.
     */
    that.getScroller = function () {
        return scroller;
    }

    /**
     * Get the world
     * @returns {FMWorld} The world associated with the state.
     */
    that.getWorld = function () {
        return world_;
    }

    /**
     * Get the world
     * @param {FMWorld} The world to associate with the state.
     */
    that.setWorld = function (world) {
        world_ = world;
    }

    return that;
}