/*Global config*/
const playerJumpVelocity = 500,
    playerHorizontalVelocity = 200,
    timeBetweenJumps = 750;

//Define game world with corresponding functions
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    //Load all assets
    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.image('tiles-2', 'assets/tiles-2.png');
    game.load.spritesheet('player', 'assets/player.png', 32, 48);
    game.load.image('background', 'assets/background2.png');
}

var map,
    tileset,
    layer,
    player,
    facing = 'left',
    jumpTimer = 0,
    cursors,
    jumpButton,
    bg;

function create() {
    //Init physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Set default bgColor
    game.stage.backgroundColor = '#000000';
    //Add bg sprite
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    //Make it fixed to camera
    bg.fixedToCamera = true;
    //Add the json level definition
    map = game.add.tilemap('level2');
    //Add the title spritesheet
    map.addTilesetImage('tiles-2');

    //Set no collision with specific titles from titlemap
    map.setCollisionByExclusion([
        12, 13, 14, 15, 16, 46, 47, 48, 49, 50,
        80, 81, 82, 83, 84, 114, 115, 116, 117, 118,
        136, 137, 138, 139,
        153, 154, 155, 156,
        170, 171, 172, 173,
        187, 188, 189, 190
    ]);
    //Create a layer with all of the above
    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    //Resize the world to fit level
    layer.resizeWorld();
    //Set gravity
    game.physics.arcade.gravity.y = 800;
    //Add player
    player = game.add.sprite(32, 32, 'player');
    //Enable physics for player
    game.physics.enable(player, Phaser.Physics.ARCADE);
    //Set player bounce, collision and size in game
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    //Define animations
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('idle', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    //Get the camera to move along player
    game.camera.follow(player);
    //Define controls
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
    //Add collision between player and map titles
    game.physics.arcade.collide(player, layer);
    //Reset player velocity
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //Move player left
        player.body.velocity.x = -playerHorizontalVelocity;
        //Change player animation
        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = playerHorizontalVelocity;

        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else {
        if (facing != 'idle') {
            player.animations.stop();

            if (facing == 'left') {
                player.frame = 0;
            }
            else {
                player.frame = 5;
            }

            facing = 'idle';
        }
        else if (player.body.blocked.down) {
            player.animations.play('idle');
        }
    }
    //Make player jump and set timer
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -playerJumpVelocity;
        jumpTimer = game.time.now + timeBetweenJumps;
    }

}

function render() {
    //Debug options
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
}
