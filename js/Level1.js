Scene.Level1 = function (game) {
    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.state;     //  the state manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator
    this.map;       //  a reference to the game map
    this.layer;     //  a reference to current layer
    this.player;    //  a reference to player
    this.facing = 'left';    //  player facing - left right or idle
    this.jumpTimer = 0;      //  jump frequency tracking var
    this.cursors;           // a reference to keyboard arrows
    this.jumpButton;        // a reference to SPACEBAR
    this.runButton;         // a reference to SHIFT
    this.bg;                // background
    this.isGameStarted = true;

    //  You can use any of these from any function within this scene.
};

Scene.Level1.prototype = {
    create: function () {
        //Init physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //Set default bgColor
        game.stage.backgroundColor = '#000000';
        //Add bg sprite
        this.bg = game.add.tileSprite(0, 0, 800, 600, 'background');
        //Make it fixed to camera
        this.bg.fixedToCamera = true;
        //Add the json level definition
        this.map = game.add.tilemap('level2');
        //Add the title spritesheet
        this.map.addTilesetImage('tiles-2');

        //Set no collision with specific titles from titlemap
        this.map.setCollisionByExclusion([
            12, 13, 14, 15, 16, 17, 46, 47, 48, 49, 50, 51,
            80, 81, 82, 83, 84, 85, 114, 115, 116, 117, 118, 119,
            136, 137, 138, 139, 140,
            153, 154, 155, 156, 157,
            170, 171, 172, 173, 174,
            187, 188, 189, 190, 191
        ]);
        //Create a layer with all of the above
        this.layer = this.map.createLayer('Tile Layer 1');

        //  Un-comment this on to see the collision tiles
        // layer.debug = true;

        //Resize the world to fit level
        this.layer.resizeWorld();
        //Set gravity
        game.physics.arcade.gravity.y = 800;
        //Add player
        this.player = game.add.sprite(32, 32, 'player');
        //Enable physics for player
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        //Set player bounce, collision and size in game
        this.player.body.bounce.y = 0.1;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(20, 32, 5, 16);
        //Define animations
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('idle', [4], 20, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        //Get the camera to move along player
        game.camera.follow(this.player);
        //Define controls
        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    },

    update: function () {
        if (!this.isGameStarted) return;

        //Add collision between player and map titles
        game.physics.arcade.collide(this.player, this.layer);
        //Reset player velocity
        this.player.body.velocity.x = 0;
        var boost = 0;
        if (this.runButton.isDown) {
            boost += runBoost;
        }
        if (this.cursors.left.isDown) {
            //Move player left
            this.player.body.velocity.x = -(playerHorizontalVelocity + boost);
            //Change player animation
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = playerHorizontalVelocity + boost;

            if (this.facing != 'right') {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        }
        else {
            if (this.facing != 'idle') {
                this.player.animations.stop();

                if (this.facing == 'left') {
                    this.player.frame = 0;
                }
                else {
                    this.player.frame = 5;
                }

                this.facing = 'idle';
            }
            else if (this.player.body.blocked.down) {
                this.player.animations.play('idle');
            }
        }
        //Make player jump and set timer
        if (this.jumpButton.isDown && this.player.body.onFloor() && game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -playerJumpVelocity;
            this.jumpTimer = game.time.now + timeBetweenJumps;
        }

        if (this.player.body.y >= this.map.heightInPixels - this.player.body.height) {
            this.quitGame();
            // this.isGameStarted = false;
        }

    },
    render: function () {
        //Debug options
        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        game.debug.bodyInfo(this.player, 16, 24);
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.player.destroy();
        this.map.destroy();
        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};