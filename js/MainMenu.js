Scene.MainMenu = function (game) {
    this.music = null;
    this.playButton = null;

};

Scene.MainMenu.prototype = {

    create: function () {

        //  We've already preloaded our assets, so let's kick right into the Main Menu itself.

        // this.music = this.add.audio('titleMusic');
        // this.music.play();

        // this.add.sprite(0, 0, 'titlepage');
        // this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.startGame();
    },

    update: function () {

        //  Do some nice funky main menu effect here

    },

    startGame: function (pointer) {

        //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        // this.music.stop();

        //  And start the actual game
        this.state.start('Level1');

    }

};
