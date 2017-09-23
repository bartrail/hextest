/**
 * gridtest
 * Created by PhpStorm.
 * File:
 * User: con
 * Date: 22.09.17
 * Time: 20:34
 */


var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'example', {
  create : create,
  update : update,
  render : render
});

var config = {
  hex  : {
    size   : parseInt(getParameterByName('size', 50)),
    type   : getParameterByName('type'),     // flat|pointy
    layout : getParameterByName('layout'),   // even|odd,
    delta  : 0,
    width  : 0,
    height : 0,
    distH  : 0,
    distV  : 0
  },
  grid : {
    rows : parseInt(getParameterByName('rows', 10)),
    cols : parseInt(getParameterByName('cols', 10))
  }
};

config.hex.delta = config.hex.size - Math.sqrt(Math.pow(config.hex.size, 2) - Math.pow(config.hex.size / 2, 2));

switch (config.hex.type) {
  case 'flat':
    config.hex.width  = config.hex.size * 2;
    config.hex.height = Math.sqrt(3) / 2 * config.hex.width;
    config.hex.distH  = config.hex.width * 3 / 4;
    config.hex.distV  = config.hex.height;
    break;
  case 'pointy':
  default:
    config.hex.height = config.hex.size * 2;
    config.hex.width  = Math.sqrt(3) / 2 * config.hex.height;
    config.hex.distV  = config.hex.height * 3 / 4;
    config.hex.distH  = config.hex.width;
    break;
}

var poly;
var graphics;
var map;
var hexList = [];

function create() {

  graphics = game.add.graphics(0, 0);

  var color;
  for (var col = 0; col < config.grid.cols; col++) {
    for (var row = 0; row < config.grid.rows; row++) {

      if (row % 2 === 0) {
        color = 0xCCCCCC;
        // color = col % 2 === 0 ? 0xAAAAAA : 0xCCCCCC;
      } else {
        color = 0xDDDDDD;
        // color = col % 2 === 0 ? 0xBBBBBB : 0xDDDDDD;
      }

      var hex = new Hexagon({
        row : row,
        col : col
      }, color);
      hexList.push(hex);
    }
  }

  hexList.forEach(function(hex) {
    hex.draw();
  });

}

function render() {

  var hoveredHex = getHoveredHex();
  var debug      = [
    'size:   ' + config.hex.size,
    'type:   ' + config.hex.type,
    'layout: ' + config.hex.layout,
    'mouse:  ' + game.input.x + ' x ' + game.input.y
  ];

  debug.forEach(function(text, i) {
    game.debug.text(text, 5, 16 * (i + 1));
  });

  game.debug.text(hoveredHex.grid.row + ',' + hoveredHex.grid.col, hoveredHex.center.x, hoveredHex.center.y)

}

function update() {

  graphics.clear();

  hexList.forEach(function(hex) {
    if (hex.polygon.contains(game.input.x, game.input.y)) {

      hex.isHovered = true;
      if (game.input.activePointer.isDown) {
        // hex.setPosition(game.input.x, game.input.y);
      }

      hex.draw(0xFF3300);
    } else {
      hex.isHovered = false;
      hex.draw();
    }
  });

}

function getHoveredHex() {
  for (var i = 0, ii = hexList.length; i < ii; i++) {
    if (hexList[i].isHovered) {
      return hexList[i];
    }
  }
  return {
    grid   : {
      row : '',
      col : ''
    },
    center : {
      x : 0,
      y : 0
    }
  }
}

function up() {
  console.log('button up', arguments);
}

function over() {
  console.log('button over');
}

function out() {
  console.log('button out');
}

function actionOnClick() {
  console.log('button click');
}

function getParameterByName(name, defaultValue) {
  var url     = window.location.href;
  name        = name.replace(/[\[\]]/g, "\\$&");
  var regex   = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);

  if (typeof defaultValue === 'undefined') {
    if (!results) return null;
    if (!results[2]) return '';
  } else {
    if (!results) return defaultValue;
    if (!results[2]) return defaultValue;
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
