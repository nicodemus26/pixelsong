var hexes = 0;
var hexes_this_side = 0;
var hexes_this_layer = 0;
var max_this_layer = 1;
var side = 0;
var layer = 0;
var hex_edge_px = 10;
var margin_px = 2;
var tile_px = hex_edge_px*2+margin_px;
var pallette_slot = 0;
var pallette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(240);
  hexes = 0;
  hexes_this_side = 0;
  hexes_this_layer = 0;
  max_this_layer = 1;
  side = 0;
  layer = 0;
  hex_edge_px = 10;
  margin_px = 2;
  tile_px = hex_edge_px*2+margin_px;
  pallette_slot = 0;
  pallette = [];
  add_color();
  add_color();
  add_color();
}

function random_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function add_color() {
  var r = random_int(0,256);
  var g = random_int(0,256);
  var b = random_int(0,256);
  pallette.push(color(r,g,b));
}

function advance_hex() {
  hexes = hexes + 1;
  hexes_this_layer = hexes_this_layer + 1;
  hexes_this_side = hexes_this_side + 1;
  if (hexes_this_layer >= max_this_layer) {
    // Advance layer
    layer = layer + 1;
    side = 0;
    hexes_this_layer = 0;
    hexes_this_side = 0;
    max_this_layer = layer * 6;
    pallette_slot = pallette_slot + 2;
    if (layer % 3 == 0) {
      add_color();
    }
  } else {
    if (hexes_this_side >= layer) {
      // Turn.
      side = side + 1;
      hexes_this_side = 0;
    }
  }
  pallette_slot = (pallette_slot + 1) % pallette.length;
}

function hexagon() {
  noStroke();
  fill(pallette[pallette_slot]);
  beginShape();
  for (var a = 0; a < TWO_PI; a += (TWO_PI/6)) {
    var sx = cos(a) * hex_edge_px;
    var sy = sin(a) * hex_edge_px;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function draw() {
  push();
  translate(width*0.5, height*0.5);
  rotate(side*TWO_PI/6);
  translate(0, layer*tile_px);
  rotate(TWO_PI/3);
  translate(0, hexes_this_side*tile_px);
  hexagon();
  pop();
  advance_hex();
}

function mousePressed() {
  if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    var fs = fullscreen();
    fullscreen(!fs);
  } else {
    setup()
  }
}
