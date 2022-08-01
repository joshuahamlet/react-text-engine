import * as Phaser from 'phaser';

class Game1 extends Phaser.Game {
  constructor(setActivated) {
    const config = {
      type: Phaser.AUTO,
      width: 240,
      height: 160,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      parent: 'gameboy1',
      pixelArt: true,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };
    super(config);
    this.setActivated = setActivated;
  }
}

export default Game1;

function preload() {
  this.load.tilemapTiledJSON('map', 'assets/textadventure.json');
  this.load.image('TilesetFloor', 'assets/TilesetFloor.png');
  this.load.image('TilesetHouse', 'assets/TilesetHouse.png');
  this.load.image('TilesetNature', 'assets/TilesetNature.png');
  this.load.image('fog', 'assets/fog.png');
  this.load.image('glitch', 'assets/textadventureGlitch.png');

  this.load.spritesheet('spooky-walk', 'assets/spooky-walk.png', {
    frameWidth: 16,
    frameHeight: 16,
  });
}

function create() {
  this.cameras.main.setBounds(0, 0, 240, 160);
  this.physics.world.setBounds(0, 0, 240, 160);

  let map = this.make.tilemap({ key: 'map' });
  let tileset1 = map.addTilesetImage('TilesetNature', 'TilesetNature');
  let tileset2 = map.addTilesetImage('TilesetFloor', 'TilesetFloor');
  let tileset3 = map.addTilesetImage('TilesetHouse', 'TilesetHouse');
  this.colliderLayer = map.createLayer('Collider_Layer', tileset1, 0, 0);
  this.groundLayer = map.createLayer('Ground_Layer', tileset2, 0, 0);
  this.elementLayer = map.createLayer('Element_Layer', tileset1, 0, 0);
  this.houseLayer = map.createLayer('House_Layer', tileset3, 0, 0);

  this.colliderLayer.setCollisionByProperty({ collides: true });

  this.fog = this.add.image(240 - 32, 160 - 32, 'fog').setDepth(1);
  this.glitch = this.add.image(120, 80, 'glitch').setDepth(2);
  this.glitch.visible = false;
  this.colliderLayer.visible = true;
  this.elementLayer.visible = true;
  this.houseLayer.visible = true;
  this.glitchTrigger = false;

  this.cursors = this.input.keyboard.createCursorKeys();

  this.spook = this.physics.add
    .sprite(24, 48)
    .setBodySize(16, 16, false)
    .setCollideWorldBounds(true);

  console.log(this.spook);
  this.physics.add.collider(this.spook, this.colliderLayer);

  this.spook.anims.create({
    key: 'spooky-walk-down',
    frames: this.anims.generateFrameNumbers('spooky-walk', {
      frames: [0, 4, 8, 12],
    }),
    frameRate: 4,
    repeat: -1,
  });

  this.spook.anims.create({
    key: 'spooky-walk-up',
    frames: this.anims.generateFrameNumbers('spooky-walk', {
      frames: [1, 5, 9, 13],
    }),
    frameRate: 4,
    repeat: -1,
  });

  this.spook.anims.create({
    key: 'spooky-walk-left',
    frames: this.anims.generateFrameNumbers('spooky-walk', {
      frames: [2, 6, 10, 14],
    }),
    frameRate: 4,
    repeat: -1,
  });

  this.spook.anims.create({
    key: 'spooky-walk-right',
    frames: this.anims.generateFrameNumbers('spooky-walk', {
      frames: [3, 7, 11, 15],
    }),
    frameRate: 4,
    repeat: -1,
  });

  this.spook.play('spooky-walk-down', true);

  this.cameras.main.startFollow(this.spook, true, 0.08, 0.08);
  this.cameras.main.setZoom(2);

  this.events.on('downButton', () => (this.downButton = true));
  console.log(this.events);
}

function update() {
  //console.log('UPDATE THIS' , this)
  this.spook.setVelocity(0);

  let upPressed = this.cursors.up.isDown || upButton ? true : false;
  let downPressed = this.cursors.down.isDown || downButton ? true : false;
  let leftPressed = this.cursors.left.isDown || leftButton ? true : false;
  let rightPressed = this.cursors.right.isDown || rightButton ? true : false;

  let currentCursors = [upPressed, downPressed, leftPressed, rightPressed];
  let currentDirection = currentCursors.map((d) => {
    if (d) {
      return 'T';
    } else if (!d) {
      return 'F';
    }
  });
  let directionCode = currentDirection.join('');

  if (this.spook.x > 231) {
    console.log('itworked');
    console.log(this.game.touchControl);
    this.game.setActivated((p) => p = {status: true}) //? p : !p);
    if (!this.glitchTrigger) {
      this.glitchTrigger = true;
    }
  }

  if (this.glitchTrigger) {
    this.glitch.visible = !this.glitch.visible;
    this.groundLayer.visible = false;
    this.colliderLayer.visible = false;
    this.elementLayer.visible = false;
    this.houseLayer.visible = false;
    this.fog.visible = false;
  }

  //console.log('doesitwork', directionCode)
  switch (directionCode) {
    /////////////////////////////////
    case 'TFFF':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(-75);
      this.spook.play('spooky-walk-up', true);
      break;
    case 'FTFF':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(75);
      this.spook.play('spooky-walk-down', true);
      break;
    case 'FFTF':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityX(-75);
      this.spook.play('spooky-walk-left', true);
      break;
    case 'FFFT':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityX(75);
      this.spook.play('spooky-walk-right', true);
      break;
    /////////////////////////////////
    case 'TTFF':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocity(0);
      this.spook.play('spooky-walk-down', true);
      break;
    case 'TFTF':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(-75);
      this.spook.setVelocityX(-75);
      this.spook.play('spooky-walk-up', true);
      break;
    case 'TFFT':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(-75);
      this.spook.setVelocityX(75);
      this.spook.play('spooky-walk-up', true);
      break;
    case 'FTTF':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(75);
      this.spook.setVelocityX(-75);
      this.spook.play('spooky-walk-down', true);
      break;
    case 'FTFT':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(75);
      this.spook.setVelocityX(75);
      this.spook.play('spooky-walk-down', true);
      break;
    case 'FFTT':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocity(0);
      this.spook.play('spooky-walk-down', true);
      break;
    ////////////////////////////////
    case 'FTTT':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(75);
      this.spook.play('spooky-walk-down', true);
      break;
    case 'TFTT':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityY(-75);
      this.spook.play('spooky-walk-up', true);
      break;
    case 'TTFT':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityX(75);
      this.spook.play('spooky-walk-right', true);
      break;
    case 'TTTF':
      //console.log('CURRDIR', currentDirection)
      this.spook.setVelocityX(-75);
      this.spook.play('spooky-walk-left', true);
      break;
    ////////////////////////////////
    default:
      this.spook.setVelocity(0);
  }
}

let upButton
let downButton
let leftButton
let rightButton

export const TouchController = () => {
  return (
    <div
      style={{
        alignSelf: 'center',
        justifySelf: 'center',
        width: '280px',
        height: '100%',
      }}
    >
      <div
        style={{
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '99px',
          height: '99px',
          backgroundColor: 'black',
          color: 'white',
        }}
        // onMouseDown={() => (testButton = true)}
        // onMouseUp={() => (testButton = false)}
        // onTouchStart={() => (testButton = true)}
        // onTouchEnd={() => (testButton = false)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            width: '33px',
            height: '33px',
            backgroundColor: 'var(--grey)',
            color: 'white',
          }}
          onMouseDown={() => (upButton = true)}
          onMouseUp={() => (upButton = false)}
          onTouchStart={() => (upButton = true)}
          onTouchEnd={() => (upButton = false)}
        >
          {/* <BiUpArrow /> */}
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              width: '33px',
              height: '33px',
              backgroundColor: 'var(--grey)',
              color: 'white',
            }}
            onMouseDown={() => (leftButton = true)}
            onMouseUp={() => (leftButton = false)}
            onTouchStart={() => (leftButton = true)}
            onTouchEnd={() => (leftButton = false)}
          >
            {/* <BiLeftArrow /> */}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              width: '33px',
              height: '33px',
              backgroundColor: 'var(--grey)',
              color: 'white',
            }}
            onMouseDown={() => (rightButton = true)}
            onMouseUp={() => (rightButton = false)}
            onTouchStart={() => (rightButton = true)}
            onTouchEnd={() => (rightButton = false)}
          >
            {/* <BiRightArrow /> */}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            width: '33px',
            height: '33px',
            backgroundColor: 'var(--grey)',
            color: 'white',
          }}
          onMouseDown={() => (downButton = true)}
          onMouseUp={() => (downButton = false)}
          onTouchStart={() => (downButton = true)}
          onTouchEnd={() => (downButton = false)}
        >
          {/* <BiDownArrow /> */}
        </div>
      </div>
    </div>
  );
};