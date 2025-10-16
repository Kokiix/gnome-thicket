let CONFIG = {};

function init_config(width, height) {
    CONFIG = {
    CENTER_N_TILES: 7,
    EDGE_N_TILES: 4,

    
    TILE_STROKE_WEIGHT: 5,
    TILE_STROKE: color(51, 102, 68),
    TILE_FILL: color(87, 135, 75),

    THICKET_FILL: color(40, 83, 55),

    P1_COLOR: color(178, 91, 84),
    P2_COLOR: color(87, 163, 201),

    ABILITY_TILE: color(129, 34, 141),
    };

    if (height > width) {
        CONFIG.circumradius = 0.04 * height;
    } else {
        CONFIG.circumradius = 0.05 * width;
    }
    CONFIG.inradius = CONFIG.circumradius * sqrt(3) / 2;
    CONFIG.thicket_diameter = CONFIG.circumradius * 1.25;
    CONFIG.gnome_size = CONFIG.thicket_diameter * 0.5 * 0.75;
    CONFIG.board_right_border = width / 2 + 1.5 * CONFIG.circumradius * 3 + CONFIG.circumradius;

    CONFIG.class_sel = {
        HEIGHT: height * 0.75,
        WIDTH: width * 0.15,
    }
    CONFIG.class_sel.top_border = height / 2 - CONFIG.class_sel.HEIGHT / 2;
    CONFIG.class_sel.center = (CONFIG.board_right_border + width) / 2;
}