/**
 * Under Creative Commons Licence
 * Component of basic physics.
 * @param {FMObject} The object that owns this component.
 * @author Simon Chauvin
 */
function fmPhysicComponent(owner) {
    "use strict";
    var that_ = fmComponent(fmComponentTypes.dynamic, owner);

    /**
     * The necessary components
     */
    var spatial = null;
    var renderer = null;
    var collider = null;

    /**
     * The world in which the game object is
     */
    var world_ = null;
    /**
     * Internal value representing the velocity on the x-axis
     */
    var xVelocity_ = 0;
    /**
     * Internal value representing the velocity on the y-axis
     */
    var yVelocity_ = 0;
    /**
     * The current direction of the object
     */
    var direction_ = 0;
    /**
     * To know if the object is on the ground or not
     */
    var onGround_ = false;
    /**
     * To know if the object is moving up or not
     */
    var movingUp = false;
    /**
     * To know if the object is moving down or not
     */
    var movingDown = false;
    /**
     * To know if the object is moving left or not
     */
    var movingLeft = false;
    /**
     * To know if the object is moving right or not
     */
    var movingRight = false;
    /**
     * Represent the maximum absolute value of the velocity on the x-axis
     */
    that_.maxXVelocity = 0;
    /**
     * Represent the maximum absolute value of the velocity on the y-axis
     */
    that_.maxYVelocity = 0;
    /**
     * The acceleration on the x-axis represent how fast the game object reach the maximum xVelocity
     */
    that_.xAcceleration = 0;
    /**
     * The acceleration on the y-axis represent how fast the game object reach the maximum yVelocity
     */
    that_.yAcceleration = 0;
    /**
     * Ground friction is a factor between 0 and 1
     */
    that_.groundFriction = 1;
    /**
     * Air friction is a factor between 0 and 1
     */
    that_.airFriction = 1;
    /**
     * Bouncing is a factor between 0 and 1
     */
    that_.bouncing = 0;
    /**
     * Gravity represent how fast the game object is going toward the bottom
     * //TODO define an x and y gravity so that it can be a vector !
     */
    that_.gravity = 0;
    /**
     *
     */
    that_.xThrust = 1;
    /**
     *
     */
    that_.yThrust = 1;

    /**
     * Post initialization to ensure that all components are initialized
     */
    that_.postInit = function () {
        //Retrieve the components
        spatial = owner.components[fmComponentTypes.spatial];
        renderer = owner.components[fmComponentTypes.renderer];
        collider = owner.components[fmComponentTypes.collider];
    }

    /**
    * Update the component.
    * @param {FMGame} The current game.
    */
    that_.update = function (game) {
        //Add negative acceleration to velocity if the game object is moving up
        if (movingUp) {
            var velocity = yVelocity_ - that_.yAcceleration;
            if (Math.abs(velocity) <= that_.maxYVelocity) {
                yVelocity_ = velocity;
            }
            else {
                yVelocity_ = -that_.maxYVelocity;
            }
        }
        //Add positive acceleration to velocity if the game object is moving down
        if (movingDown) {
            var velocity = yVelocity_ + that_.yAcceleration;
            if (Math.abs(velocity) <= that_.maxYVelocity) {
                yVelocity_ = velocity;
            }
            else {
                yVelocity_ = that_.maxYVelocity;
            }
        }
        //Add negative acceleration to velocity if the game object is moving left
        if (movingLeft) {
            var velocity = xVelocity_ - that_.xAcceleration;
            if (Math.abs(velocity) <= that_.maxXVelocity) {
                xVelocity_ = velocity;
            }
            else {
                xVelocity_ = -that_.maxXVelocity;
            }
        }
        //Add positive acceleration to velocity if the game object is moving right
        if (movingRight) {
            var velocity = xVelocity_ + that_.xAcceleration;
            if (Math.abs(velocity) <= that_.maxXVelocity) {
                xVelocity_ = velocity;
            }
            else {
                xVelocity_ = that_.maxXVelocity;
            }
        }

	//Increase yVelocity_ because of gravity
        //TODO change so that a gravity from other side can be done
        //if (that_.gravity != 0 && !onGround_) {
            yVelocity_ += that_.gravity;
        //}

        //Init the moving booleans to false
        movingUp = false;
        movingDown = false;
        movingLeft = false;
        movingRight = false;

        //If the object has a collider component
        if (collider) {
            //Retrieve the current state
            var state = game.getCurrentState();
            //Retrieve the world
            world_ = state.getWorld();
            //Retrieve collision tiles map
            var collisions = world_.getCollisions();
            //Retrieve the world bounds (in case there was a modification)
            var worldBounds = world_.bounds;

            //Retrieve the width and height of the object (in case there was a modification)
            //var width = collider.getWidth();
            //var height = collider.getHeight();

            //Retrieve the next position
            //TODO wont work cause there's no elapsedTime
            //var nextXPos = collider.x + xVelocity_;
            //var nextYPos = collider.y + yVelocity_;

            //Decrease the velocity according to the ground and air friction factor
            //TODO define the ground as a vector so that it is not when the bottom is colliding that it touches the ground
            //but when the vector is 0 ? or something
            //TODO some weird here, isbottomsidecolliding is not at the right place
            //TODO make friction 0 = no friction so that init velocities to the same velocity again and again
            // TODO make friction 1 = full friction so that init velocities to 0
            if (collider.isBottomSideColliding()) {
                xVelocity_ *= that_.groundFriction;
                onGround_ = true;
            } else {
                yVelocity_ *= that_.airFriction;
                onGround_ = false;
            }

            //In case the object is bouncing on the borders
            //TODO make bouncing a continuous value
            //TODO and put it in the algo below
            //TODO still add world border
            /*if (that_.bouncing) {
                if (nextXPos <= worldBounds.x || nextXPos + width >= worldBounds.getWidth()) {
                    that_.xVelocity_ = -xVelocity_;
                }
                if (nextYPos <= worldBounds.y || nextYPos + height >= worldBounds.getHeight()) {
                    that_.yVelocity_ = -yVelocity_;
                }
            }*/

            //Check collisions (if any)
            if (world_ && world_.hasCollisions()) {
                //Move the game object
                move(collisions, xVelocity_ * elapsedTime(), yVelocity_ * elapsedTime());
            }
        }

        //TODO add direction debug
        /*if (xVelocity_ != 0) {
            direction = Math.atan(yVelocity_ / xVelocity_) / (Math.PI / 180);
        } else {
            direction = 0;
        }*/
    };

    /**
     * 
     */
    var tryToMove = function (collisions, xVel, yVel) {
        var spX = spatial.x + xVel;
        var spY = spatial.y + yVel;
        var colX = collider.x + xVel;
        var colY = collider.y + yVel;
        if (!collider.checkCollisions(collisions, colX, colY)) {
            spatial.x = spX;
            collider.x = colX;
            spatial.y = spY;
            collider.y = colY;
            return true;
        }
        return false;
    }

    /**
     * 
     */
    var move = function (collisions, xVel, yVel) {
        if (Math.abs(xVel) >= collisions.getTileWidth() || Math.abs(yVel) >= collisions.getTileHeight())
	{
		move(collisions, xVel / 2, yVel / 2);
		move(collisions, xVel - xVel / 2, yVel - yVel / 2);
		return;
	}

	var hor = tryToMove(collisions, xVel, 0);
	var ver = tryToMove(collisions, 0, yVel);
        if (hor && ver)
            return;

	if (!hor) {
	    xVelocity_ = 0;
	    var i;
	    var maxSpeed = Math.abs(xVel);
	    for (i = 0; i < maxSpeed; i++) {
		var vel;
		if (xVel == 0)
		    vel = 0;
		else if (xVel > 0)
		    vel = 1;
		else
		    vel = -1;
		if (!tryToMove(collisions, vel, 0))
		    break;
		else
		    xVelocity_ += vel;
	    }
	}
	if (!ver) {
	    yVelocity_ = 0;
	    maxSpeed = Math.abs(yVel);
	    for (i = 0; i < maxSpeed; i++) {
		var vel;
		if (yVel == 0)
		    vel = 0;
		if (yVel > 0)
		    vel = 1;
		else
		    vel = -1;
		if (!tryToMove(collisions, 0, vel))
		    break;
		else
		    yVelocity_ += vel;
	    }
	}
    }

    /**
     * Move up the game object.
     */
    that_.moveUp = function () {
        movingUp = true;
    };

    /**
     * Move down the game object
     */
    that_.moveDown = function () {
        movingDown = true;
    };

    /**
     * Move left the game object
     */
    that_.moveLeft = function () {
        movingLeft = true;
    };

    /**
     * Move right the game object
     */
    that_.moveRight = function () {
        movingRight = true;
    };

    /**
     * Get the x velocity.
     * @returns {int} The current velocity on the x axis.
     */
    that_.getXVelocity = function () {
        return xVelocity_;
    }

    /**
     * Get the y velocity.
     * @returns {int} The current velocity on the y axis.
     */
    that_.getYVelocity = function () {
        return yVelocity_;
    }

    /**
     * Check if the game object is on the ground or not.
     * @returns {Boolean} True if the game object is on the ground, false otherwise.
     */
    that_.isOnGround = function () {
       return onGround_; 
    }

    return that_;
}