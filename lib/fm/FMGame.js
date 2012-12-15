/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMGame represents the game application and contains all the necessary
 * information to handle its execution
 * 
 * @param name
 * @param width
 * @param height
 * @param firstState
 * @returns {FMGame}
 */
function fmGame(gameName, gameWidth, gameHeight, firstState) {
    "use strict";
    var that = {};

    /**
    * Name of the game
    */
    var name = gameName;

    /**
    * Specifications of the current game
    */
    fmParameters.screenWidth = gameWidth;
    fmParameters.screenHeight = gameHeight;

    /**
    * State of the game
    */
    var currentState = fmPreloader(firstState);

    /**
    * HTML5 canvas
    */
    var canvas = document.getElementById("canvas");
    var context = null;
    var bufferCanvas = null;
    var bufferContext = null;

    //Create canvas context if it exists and use double buffering
    if (canvas && canvas.getContext) {
        context = canvas.getContext("2d");

        if (context) {
            canvas.width = fmParameters.screenWidth;
            canvas.height = fmParameters.screenHeight;
            bufferCanvas = document.createElement("canvas");
            bufferCanvas.width = fmParameters.screenWidth;
            bufferCanvas.height = fmParameters.screenHeight;
            bufferContext = bufferCanvas.getContext("2d");
            bufferContext.xOffset = 0;
            bufferContext.yOffset = 0;
        }
    }

    /**
    * Input management
    */
    var currentPressedKeys = [];
    var currentReleasedKeys = [];
    var mouseClicked = false;
    var mousePressed = false;
    var mouseReleased = false;
    var mouseX = 0;
    var mouseY = 0;

    /**
    * Main game loop Calling update and draw on game objects
    */
    var gameLoop = function () {
        setTimeout(function () {
            context.clearRect(0, 0, fmParameters.screenWidth, fmParameters.screenHeight);
            context.fillStyle = fmParameters.backgroundColor;
            context.fillRect(0, 0, currentState.getWorld().getWidth(), currentState.getWorld().getHeight());

            currentState.update(that);
            currentState.draw(bufferContext);

            context.drawImage(bufferCanvas, 0, 0);
            lastUpdate = new Date();
            mouseClicked = false;
            currentReleasedKeys = [];

            gameLoop();
        }, 1 / fmParameters.FPS * 1000);
    };

    /**
    * Start running the game
    */
    that.run = function () {
        if (context && bufferContext) {
            canvas.onkeydown = function (event) {
                onKeyPressed(event);
            };
            canvas.onkeyup = function (event) {
                onKeyReleased(event);
            };
            canvas.onclick = function (event) {
                onClick(event);
            };
            canvas.onmousedown = function (event) {
                onMousePressed(event);
            };
            canvas.onmouseup = function (event) {
                onMouseReleased(event);
            };
            canvas.onmousemove = function (event) {
                onMouseMove(event);
            };
            canvas.onfocus = function (event) {
                onFocus(event);
            };
            canvas.onblur = function (event) {
                onOutOfFocus(event);
            };

            //Focus on the canvas
            canvas.focus();

            //Init the current state
            currentState.init();
            currentState.postInit();
            currentState.initBounds();

            gameLoop();
        }
    };

    /**
    * Switch between two states
    */
    that.switchState = function (newState) {
        currentState.destroy();
        newState.init();
        newState.postInit();
        newState.initBounds();
        currentState = newState;
    };

    /**
    * Handle keys pressed
    */
    var onKeyPressed = function (event) {
        currentPressedKeys[event.keyCode] = 1;
    };

    /**
    * Handle keys released
    */
    var onKeyReleased = function (event) {
        var key = event.keyCode;
        currentReleasedKeys[key] = 1;
        delete currentPressedKeys[key];
    };

    /**
    * Handle mouse moves
    */
    var onMouseMove = function (event) {
        mouseX = event.clientX - event.target.offsetLeft;
        mouseY = event.clientY - event.target.offsetTop;
    };

    /**
    * Handle mouse click
    */
    var onClick = function (event) {
        mouseClicked = true;
    };

    /**
    * Handle mouse pressed
    */
    var onMousePressed = function (event) {
        mousePressed = true;
        mouseReleased = false;
    };

    /**
    * Handle mouse pressed
    */
    var onMouseReleased = function (event) {
        mouseReleased = true;
        mousePressed = false;
    };

    /**
    * Handle canvas's retrieve of focus
    */
    var onFocus = function (event) {
        currentState.restart(bufferContext);
    };

    /**
    * Handle canvas's lost of focus
    */
    var onOutOfFocus = function (event) {
        currentState.pause(bufferContext);
    };

    /**
    * Check if the mouse has been clicked
    * @returns {Boolean}
    */
    that.isMouseClicked = function () {
        return mouseClicked;
    };

    /**
    * Check if a key is pressed
    * @param key
    * @returns {Boolean}
    */
    that.isKeyPressed = function (key) {
        if (currentPressedKeys[key]) {
            return true;
        } else {
            return false;
        }
    };

    /**
    * Check if a key has been released
    * @param key
    * @returns {Boolean}
    */
    that.isKeyReleased = function (key) {
        if (currentReleasedKeys[key]) {
            return true;
        } else {
            return false;
        }
    };

    /**
    * Check if a mouse button is pressed
    * @returns {Boolean}
    */
    that.isMousePressed = function () {
        return mousePressed;
    };

    /**
    * Check if a mouse button has been released
    * @returns {Boolean}
    */
    that.isMouseReleased = function () {
        return mouseReleased;
    };

    that.getName = function () {
        return name;
    };

    /**
    * Retrieve the mouse x position
    * @returns {Number}
    */
    that.getMouseX = function () {
        return mouseX;
    };

    /**
    * Retrieve the mouse y position
    * @returns {Number}
    */
    that.getMouseY = function () {
        return mouseY;
    };

    /**
    * Retrieve the chosen width of the game screen
    * @returns
    */
    that.getScreenWidth = function () {
        return screenWidth;
    };

    /**
    * Retrieve the chosen height of the game screen
    * @returns
    */
    that.getScreenHeight = function () {
        return screenHeight;
    };

    /**
    * Retrieve the current state of the game
    * @returns
    */
    that.getCurrentState = function () {
        return currentState;
    };

    return that;
}