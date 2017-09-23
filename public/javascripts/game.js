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
    type   : getParameterByName('type'),    // flat|pointy
    layout : getParameterByName('layout')   // even|odd
  },
  grid : {
    rows : parseInt(getParameterByName('rows', 10)),
    cols : parseInt(getParameterByName('cols', 10))
  }
};

var poly;
var graphics;
var map;
var hexList = [];

function create() {

  graphics = game.add.graphics(0, 0);

  var color;
  for (var col = 0; col < config.grid.cols; col++) {
    for (var row = 0; row < config.grid.rows; row++) {

      color = row % 2 === 0 ? 0xDDDDDD : 0xEEEEEE;

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

  // game.debug.geom(poly, '#0fffff');
  game.debug.text(game.input.x + ' x ' + game.input.y, 16, 32);

  var hoveredHex = getHoveredHex();
  if (typeof hoveredHex === 'object') {
    game.debug.text('hex: ' + hoveredHex.grid.row + ',' + hoveredHex.grid.col, 16, 48);
  }

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
