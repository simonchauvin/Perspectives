/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that1}
 */
function fmSoundComponent(owner) {
    "use strict";
    var that_ = fmComponent(fmComponentTypes.sound, owner);

    var sound = new Audio();

    that_.init = function (snd) {
        sound = snd;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that_.postInit = function () {
        
    }

    that_.play = function (volume, startingTime) {
        Object.getPrototypeOf(sound).volume = volume;
        //FIXME give current time
        //sound.currentTime = startingTime;
        Object.getPrototypeOf(sound).play();
    };

    that_.pause = function () {
        sound.pause();
    };

    that_.getSound = function () {
        return sound;
    };

    return that_;
}