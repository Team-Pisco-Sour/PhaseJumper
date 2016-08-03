var Scene = {};
Scene.Boot = function (game) {

};
Scene.Boot.prototype = {
    preload: function () {
         // placeholder preload loader image
        game.load.image('preloaderBackground', 'assets/preloader.jpg');
    },
    create: function () {
        this.game.state.start('Preloader');
    }
};