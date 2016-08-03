/*Global config*/
const playerJumpVelocity = 520,
    playerHorizontalVelocity = 200,
    timeBetweenJumps = 750,
    runBoost = 100;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', false, false, false); // Phaser engine initialization
//Define Scenes/States in Phaser
game.state.add('Boot', Scene.Boot); // scene to start loading game assets.
game.state.add('Preloader', Scene.Preloader); // loading game assets
game.state.add('MainMenu', Scene.MainMenu); // Main menu
game.state.add('Level1', Scene.Level1); // first level
game.state.start('Boot'); // Go to Boot scene (start the game)
