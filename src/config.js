let CONFIG = {};

function init_config(width) {
    CONFIG = {
    WIDTH_CIRCUMRADIUS_FACTOR: 20,
    CENTER_N_TILES: 7,
    EDGE_N_TILES: 4,

    
    TILE_STROKE_WEIGHT: 5,
    TILE_STROKE: color(51, 102, 68),
    TILE_FILL: color(87, 135, 75),

    THICKET_FILL: color(40, 83, 55),
    };

    CONFIG.circumradius = width / CONFIG.WIDTH_CIRCUMRADIUS_FACTOR;
    CONFIG.inradius = CONFIG.circumradius * sqrt(3) / 2;
}