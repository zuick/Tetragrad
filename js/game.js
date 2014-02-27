var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {
    game.load.image('block', 'assets/tetris-block.png');
}

function create() {
    game.add.sprite(0, 0, 'block');
}