var hexes = 0;
var hexes_this_side = 0;
var hexes_this_layer = 0;
var max_this_layer = 1;
var side = 0;
var layer = 0;
var hex_edge_px = 6;
var margin_px = 0;
var color_add_skip = 0;
var tile_px = (hex_edge_px*2)+margin_px;
var pallette_shade_distance = 8;
var pallette_size = 6;
var pallette_order_slot = 0;
var pallette = [];
var pallette_order = [];

function setup() {
  colorMode(HSB, 255);
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(240);
  hexes = 0;
  hexes_this_side = 0;
  hexes_this_layer = 0;
  max_this_layer = 1;
  side = 0;
  layer = 0;
  color_add_skip = random_int(-2,8);
  hex_edge_px = random_int(0,int(windowHeight/256))+3;
  margin_px = -1;
  tile_px = hex_edge_px*2+margin_px;
  initialize_pallette();
}

function initialize_pallette() {
  pallette_order_slot = 0;
  pallette = [];
  pallette_order = [1,4,7];
  var prime_hue = random_int(0,256);
  for (var i = 0; i < 3; i++) {
    prime_hue = (prime_hue + pallette_shade_distance*3) % 256
    var sat = random_int(128,256);
    pallette.push(color((prime_hue+pallette_shade_distance)%256, sat, 255));
    pallette.push(color(prime_hue, sat, 255));
    pallette.push(color((prime_hue-pallette_shade_distance)%256, sat, 255));
  }
}

function random_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function add_color() {
  pallette_order.push(random_int(0,pallette.length));
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
    if (color_add_skip >= 0) {
      if (layer % (color_add_skip + 1) == 0) {
        add_color();
      }
    } else {
      for (var i = color_add_skip; i < 0; i++) {
        // Negative color_add_skip get lots of new colors
        add_color();
      }
    }
    //pallette_order_slot = (3*layer) % pallette_order.length
  } else {
    if (hexes_this_side >= layer) {
      // Turn.
      side = side + 1;
      hexes_this_side = 0;
    }
  }
  pallette_order_slot = (pallette_order_slot + 1) % pallette_order.length;
}

function hexagon() {
  noStroke();
  fill(pallette[pallette_order[pallette_order_slot]]);
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
