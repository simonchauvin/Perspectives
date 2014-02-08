/*globals FM */
/**
 * @author Simon Chauvin
 */
var endState = function () {
    "use strict";
    FM.State.apply(this);
    this.text = null;
};
endState.prototype = Object.create(FM.State.prototype);
endState.prototype.init = function () {
    FM.State.prototype.init.apply(this);

    this.text = new FM.GameObject(5);
    this.text.addComponent(new FM.SpatialComponent(0, 0, this.text));
    this.text.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("end"), 1024, 768, this.text));
    this.add(this.text);

    this.text = new FM.GameObject(99);
    this.text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 160, 250, this.text));
    var renderer = this.text.addComponent(new FM.TextRendererComponent("Perspectives", this.text));
    renderer.setFormat('#fff', '60px sans-serif', 'middle');
    this.add(this.text);
};

endState.prototype.update = function (dt) {
    FM.State.prototype.update.apply(this, [dt]);

};