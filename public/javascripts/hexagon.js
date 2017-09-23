/**
 * gridtest
 * Created by PhpStorm.
 * File:
 * User: con
 * Date: 23.09.17
 * Time: 16:00
 */


function Hexagon(grid, color) {

  this.center = {
    x : 0,
    y : 0
  };
  this.grid   = {
    row : 0,
    col : 0
  };

  this.grid.row  = grid.row;
  this.grid.col  = grid.col;
  this.color     = color;
  this.type      = config.hex.type;   // flat|pointy
  this.layout    = config.hex.layout; // odd|even
  this.isHovered = false;

  this.calculateCenter();
  this.createPolygon();
}

Hexagon.prototype.calculateCenter = function() {

  var size   = config.hex.size,
      delta  = config.hex.delta,
      distV  = config.hex.distV,
      distH  = config.hex.distH,
      offset = -delta;

  this.center.x = size + this.grid.col * distH;
  this.center.y = size + this.grid.row * distV;

  if (this.type === 'flat') {

    if (
      this.layout === 'even' && this.grid.col % 2 !== 0 ||
      this.layout === 'odd' && this.grid.col % 2 === 0
    ) {
      offset = size - 2 * delta;
    }

    this.center.y += offset;

  }

  if (this.type === 'pointy') {

    if (
      this.layout === 'even' && this.grid.row % 2 !== 0 ||
      this.layout === 'odd' && this.grid.row % 2 === 0
    ) {
      offset = size - 2 * delta;
    }

    this.center.x += offset;
  }

};

Hexagon.prototype.createPolygon = function() {

  var points = [];
  for (var i = 0; i < 6; i++) {
    points.push(this.hexCorner(i));
  }

  this.polygon = new Phaser.Polygon(points);
};

Hexagon.prototype.hexCorner = function(i) {

  var angleDeg;
  if (this.type === 'pointy') {
    angleDeg = 60 * i + 30;     // pointy topped
  } else {
    angleDeg = 60 * i;          // flat topped
  }
  var angleRad = Math.PI / 180 * angleDeg;

  return {
    x     : this.center.x + config.hex.size * Math.cos(angleRad),
    y     : this.center.y + config.hex.size * Math.sin(angleRad),
    angle : angleDeg
  };

};

Hexagon.prototype.draw = function(color) {

  color = typeof color == 'undefined' ? this.color : color;
  graphics.beginFill(color);
  graphics.drawPolygon(this.polygon.points);
  graphics.endFill();

};

Hexagon.prototype.setPosition = function(x, y) {
  this.center = {
    x : x,
    y : y
  };
  this.createPolygon();

};
