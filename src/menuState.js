/*globals FM */
/**
 * @author Simon Chauvin
 */
var menuState = function () {
    "use strict";
    FM.State.apply(this);
    this.text = null;
};
menuState.prototype = Object.create(FM.State.prototype);
menuState.prototype.constructor = menuState;
/**
 * 
 */
menuState.prototype.init = function () {
    FM.State.prototype.init.call(this);

    this.text = new FM.GameObject(99);
    this.text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 160, 250, this.text));
    var renderer = this.text.addComponent(new FM.TextRendererComponent("Perspectives", this.text));
    renderer.setFormat('#fff', '60px sans-serif', 'middle');
    this.add(this.text);

    this.text = new FM.GameObject(99);
    this.text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 120, 512, this.text));
    renderer = this.text.addComponent(new FM.TextRendererComponent("Press Enter to play", this.text));
    renderer.setFormat('#fff', '30px sans-serif', 'middle');
    this.add(this.text);

    this.text = new FM.GameObject(99);
    this.text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 150, 600, this.text));
    renderer = this.text.addComponent(new FM.TextRendererComponent("A game created by Simon Chauvin", this.text));
    renderer.setFormat('#fff', '20px sans-serif', 'middle');
    this.add(this.text);

    this.text = new FM.GameObject(99);
    this.text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 40, 650, this.text));
    renderer = this.text.addComponent(new FM.TextRendererComponent("Ludum Dare 23", this.text));
    renderer.setFormat('#fff', '10px sans-serif', 'middle');
    this.add(this.text);
};

/**
 * 
 * @param {type} dt
 */
menuState.prototype.update = function (dt) {
    FM.State.prototype.update.call(this, dt);

    if (FM.Game.isKeyReleased(FM.Keyboard.ENTER) || FM.Game.isMouseClicked()) {
        FM.Game.switchState(new playState());
    }
};