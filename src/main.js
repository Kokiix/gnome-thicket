let hex_grid = [];
let highlighted_tiles = [];
let class_selection_active = false;
let current_player = 1;
let revealed_gnomes = {1: [], 2: []}
let action_count = 1;
let using_ability = false;
let surprise_attack = false;
let surprise_attack_tile;
let killed_gnomes = {1: [], 2: []}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  init_config(width, height);
  init_board(height, width);
}

function draw() {
}

function mouseClicked() {
  if (class_selection_active) {
    handle_class_sel_click();
  } else {
    handle_board_click();
  }
}

function handle_board_click() {
    let [orig_q, r] = cartesian_to_hex(mouseX, mouseY);
    let q = 6 - (orig_q + 3); // Add so that 0 is at center; subtract from n bc cols are stored RTL
    let y = r + (q < 4 ? 3 : 6 - q); // And convert r to y because tiles are stored as such

    if (hex_grid[q] && hex_grid[q][y]) {
        let chosen_tile = hex_grid[q][y];
        // Select gnome
        if (chosen_tile.gnome && chosen_tile.gnome.owner == current_player) {
            if (highlighted_tiles[0] && highlighted_tiles[0].gnome.type && highlighted_tiles[0].gnome.type == chosen_tile.gnome.type) {
                clear_highlighted();
                highlighted_tiles.push(chosen_tile);
                using_ability = true;
                if (chosen_tile.gnome.type == "gardener") {
                    highlight_revealed_moves(q, y, t => (!t.has_thicket && !t.is_barren), t => false);
                } else if (chosen_tile.gnome.type == "ruffian") {
                    highlight_revealed_moves(q, y, t => (t.gnome && t.gnome.type && t.gnome.owner != current_player), t => false);
                } else {
                    highlight_revealed_moves(q, y, t => (t.has_thicket), t => false);
                }
                if (highlighted_tiles.length == 1) {clear_highlighted(); using_ability = false;}
            } else {
                clear_highlighted();
                highlighted_tiles.push(chosen_tile);
                hex_grid[q][y].draw_select();
                if (chosen_tile.gnome.type) {
                    highlight_revealed_moves(q, y);
                } else {
                    highlight_hidden_moves(q, y);
                }
            }
            return;
        // Select location to move to
        } else if (chosen_tile.is_highlighted) {
            if (using_ability) {
                if (highlighted_tiles[0].gnome.type == "gardener") {
                    chosen_tile.has_thicket = true;
                    if (chosen_tile.gnome) {
                        hide_gnome(chosen_tile);
                    }
                } else if (highlighted_tiles[0].gnome.type == "ruffian") {
                    hide_gnome(chosen_tile);
                    chosen_tile.gnome = undefined;
                } else {
                    if (chosen_tile.gnome) {
                        hide_gnome(chosen_tile);
                        chosen_tile.gnome = undefined;
                    }
                    chosen_tile.is_barren = true;
                    chosen_tile.has_thicket = false;
                }
                chosen_tile.draw();
                using_ability = false;
                if (!surprise_attack) {
                action_count -= 1;
                    if (action_count <= 0) {
                        current_player = current_player == 1 ? 2 : 1;
                        action_count += 2;
                    } 
                }
                clear_highlighted();
                return;
            } else if (chosen_tile.has_thicket) {
                if (highlighted_tiles[0].gnome.type) {
                    hide_gnome(highlighted_tiles[0]);
                }
                hex_grid[q][y].gnome = highlighted_tiles[0].gnome
                hex_grid[q][y].draw_gnome_for_player();
            } else {
                if (highlighted_tiles[0].gnome.type) {
                    hex_grid[q][y].gnome = highlighted_tiles[0].gnome
                    hex_grid[q][y].draw_gnome_for_player();
                } else {
                    let prev_tile = highlighted_tiles[0];
                    let [prev_q, prev_r] = cartesian_to_hex(prev_tile.x, prev_tile.y);
                    prev_tile.gnome = undefined;
                    clear_highlighted();
                    create_class_select(chosen_tile);
                    highlighted_tiles.push(chosen_tile);
                    surprise_attack = true;
                    
                    const extend_dir = (oldx, newx) => {
                        let v;
                        if (oldx > newx) {
                            v = -1;
                        } else if (newx > oldx) {
                            v = 1;
                        } else {
                            v = 0;
                        }
                        return newx + v;
                    };
                    let new_q = 6 - (extend_dir(prev_q, orig_q) + 3)
                    let new_y = extend_dir(prev_r, r) + (new_q < 4 ? 3 : 6 - new_q);
                    surprise_attack_tile = hex_grid[new_q][new_y]


                    return;
                }
            }
            highlighted_tiles[0].gnome = undefined;
            action_count -= 1;
            if (action_count <= 0) {
                current_player = current_player == 1 ? 2 : 1;
                action_count += 2;
            }
        }
        clear_highlighted();
    }
}

function handle_class_sel_click() {
    let margin_size = (width - CONFIG.board_right_border - CONFIG.class_sel.WIDTH) / 2;
    let surprise = false;
    if (mouseX > CONFIG.board_right_border + margin_size && mouseX < width - margin_size) {
        if (mouseY > CONFIG.class_sel.top_border && mouseY < CONFIG.class_sel.top_border + CONFIG.class_sel.HEIGHT/3) {
            highlighted_tiles[0].gnome = new Gnome(current_player, "gardener");
            if (!surprise_attack_tile.has_thicket && !surprise_attack_tile.is_barren) surprise = true;
            revealed_gnomes[current_player].push(1);
        } else if (mouseY > CONFIG.class_sel.top_border + CONFIG.class_sel.HEIGHT/3 && mouseY < CONFIG.class_sel.top_border + CONFIG.class_sel.HEIGHT * 2/3) {
            highlighted_tiles[0].gnome = new Gnome(current_player, "ruffian");
            if (surprise_attack_tile.gnome && surprise_attack_tile.gnome.type && surprise_attack_tile.gnome.owner != current_player) surprise = true;
            revealed_gnomes[current_player].push(2);
        } else if (mouseY > CONFIG.class_sel.top_border + CONFIG.class_sel.HEIGHT * 2/3 && mouseY < CONFIG.class_sel.top_border + CONFIG.class_sel.HEIGHT) {
            highlighted_tiles[0].gnome = new Gnome(current_player, "salt");
            if (surprise_attack_tile.has_thicket) surprise = true;
            revealed_gnomes[current_player].push(3);
        } else {return;}

        reset_canvas();
        if (surprise) {
            surprise_attack_tile.draw_select(CONFIG.ABILITY_TILE);
            highlighted_tiles.push(surprise_attack_tile);
            using_ability = true;
        }
        action_count -= 1;
        class_selection_active = false;
    }
}

function init_board(height, width) {
    init_tiles(height, width);

    // Draw thickets on top and bottom border
    for (let i = 0; i < hex_grid.length; i++) {
        hex_grid[i][0].draw_thicket();
        hex_grid[i][hex_grid[i].length - 1].draw_thicket();
    }

    // Thickets sticking out of center row
    hex_grid[3][1].draw_thicket();
    hex_grid[3][5].draw_thicket();

    hex_grid[2][0].draw_gnome_for_player(1);
    hex_grid[3][0].draw_gnome_for_player(1);
    hex_grid[4][0].draw_gnome_for_player(1);
    hex_grid[2][5].draw_gnome_for_player(2);
    hex_grid[3][6].draw_gnome_for_player(2);
    hex_grid[4][5].draw_gnome_for_player(2);
}

function init_tiles(height, width) {
    const board_height = CONFIG.inradius * CONFIG.CENTER_N_TILES * 2;
    const center_col_start_y = (height - board_height) / 2 + CONFIG.inradius;
    // Using axial coordinates: https://www.redblobgames.com/grids/hexagons/#coordinates-axial
    // The number of tiles in col loop from 4 to 7 to 4
    let col_index = 0;
    let col_grow_direction = 1;
    for (let tiles_in_col = CONFIG.EDGE_N_TILES; 
        tiles_in_col <= CONFIG.CENTER_N_TILES && tiles_in_col >= CONFIG.EDGE_N_TILES; 
        tiles_in_col += col_grow_direction) {

        hex_grid[col_index] = [];
        
        const tile_diff_from_center = CONFIG.CENTER_N_TILES - tiles_in_col
        // Generate tiles top to bottom
        const col_start_y = center_col_start_y + CONFIG.inradius * tile_diff_from_center;
        const x = width / 2 + (tile_diff_from_center * col_grow_direction
          * CONFIG.circumradius * 1.5); // Distance from 1 hex to another is circ * 1.5
        for (let tile_y = 0; tile_y < tiles_in_col; tile_y++) {
            const y = col_start_y + CONFIG.inradius * tile_y * 2
            hex_grid[col_index][tile_y] = new HexTile(x, y);
            hex_grid[col_index][tile_y].draw();
        }

        col_index += 1;
        if (tiles_in_col == 7) {col_grow_direction = -1;}
    }
}

function reset_canvas() {
    clear();
    background('black');
    for (let q in hex_grid) {
        for (let y in hex_grid[q]) {
            hex_grid[q][y].draw();
        }
    }
}


function highlight_hidden_moves(init_q, init_y) {
    let draw_on_top = [];
    const highlightTile = (tile) => {
        if (tile && !tile.gnome) {
        highlighted_tiles.push(tile);
        if (!tile.has_thicket) {
            draw_on_top.push(tile);
            return false;
        } else {
            tile.draw_select();
            return true;
        }
        }
        return false;
    };

    const traverseAndHighlight = (start, end, step, incrementY) => {
        let y = init_y;
        for (let i = start; i !== end; i += step) {
        y += incrementY(i);
        if (!highlightTile(hex_grid[i][y])) {
            break;
        }
        }
    };

    // Highlight vertical bushes
    traverseAndHighlight(init_q, -1, 0, q => -1);
    traverseAndHighlight(init_q, -1, 0, q => 1);

    // Highlight diagonal bushes
    traverseAndHighlight(init_q - 1, -1, -1, q => ((q < 3) ? -1 : 0));
    traverseAndHighlight(init_q - 1, -1, -1, q => ((q >= 3) ? 1 : 0));

    traverseAndHighlight(init_q + 1, hex_grid.length, 1, q => (q > 3) ? -1 : 0);
    traverseAndHighlight(init_q + 1, hex_grid.length, 1, q => (q <= 3) ? 1 : 0);

    for (let i in draw_on_top) {
        draw_on_top[i].draw_select([255, 0, 0]);
    }
}

function highlight_revealed_moves(q, y, draw_req = t => !t.gnome, highlight_req = t => t.has_thicket) {
    let draw_on_top = [];
    const select = (tile) => {
        if (tile && draw_req(tile)) {
        highlighted_tiles.push(tile);
        if (highlight_req(tile)) {
            draw_on_top.push(tile);
        } else {
            if (using_ability) {
                tile.draw_select(CONFIG.ABILITY_TILE);
            } else {
                tile.draw_select();
            }
        }
        }
    };
    select(hex_grid[q][y + 1]);
    select(hex_grid[q][y - 1]);

    q -= 1;
    select(hex_grid[q][y + ((q < 3) ? -1 : 0)]);
    select(hex_grid[q][y + ((q >= 3) ? 1 : 0)]);
    q += 2;
    select(hex_grid[q][y + ((q > 3) ? -1 : 0)]);
    select(hex_grid[q][y + ((q <= 3) ? 1 : 0)]);
    for (let i in draw_on_top) {
        draw_on_top[i].draw_select([255, 0, 0]);
    }
}

function clear_highlighted() {
    for (let i = 0; i < highlighted_tiles.length; i++) {
        highlighted_tiles[i].draw();
    }
    using_ability = false;
    highlighted_tiles = [];
    if (surprise_attack) {
        surprise_attack = false;
        if (action_count <= 0) {
            current_player = current_player == 1 ? 2 : 1;
            action_count += 2;
        }
    }
}

function create_class_select() {

    let vert_hat_margin = CONFIG.class_sel.HEIGHT / 20;
    let horiz_hat_margin = CONFIG.class_sel.WIDTH / 5;
    let center = CONFIG.class_sel.center;
    let top = CONFIG.class_sel.top_border;
    let rect_height = CONFIG.class_sel.HEIGHT;
    let rect_width = CONFIG.class_sel.WIDTH;
    let edge = CONFIG.board_right_border;

    class_selection_active = true;
    // Cover screen with blur grey rect
    fill(200, 200, 200, 75);
    strokeWeight(0);
    rect(0, 0, width, height);

    // Draw another grey rect to hold class select
    stroke(180, 180, 180);
    strokeWeight(5);
    fill(200, 200, 200);

    rect(center - 0.5 * CONFIG.class_sel.WIDTH, 
        top, CONFIG.class_sel.WIDTH, CONFIG.class_sel.HEIGHT);

    strokeJoin(BEVEL);
    if (current_player == 1) {
        stroke(CONFIG.P1_COLOR);
        fill(CONFIG.P1_COLOR);
    } else {
        stroke(CONFIG.P2_COLOR);
        fill(CONFIG.P2_COLOR); 
    }
    let stripe_weight = CONFIG.class_sel.WIDTH / 12;

    for (let i = 1; i < 4; i++) {
        if (!(revealed_gnomes[current_player].includes(i))) {
            triangle(center, top + (i - 1)/3 * rect_height + vert_hat_margin,
            center - rect_width/2 + horiz_hat_margin, top + i/3 * rect_height - vert_hat_margin,
            center + rect_width/2 - horiz_hat_margin, top + i/3 * rect_height - vert_hat_margin);
        }
    }
    push();
    beginClip();
    for (let i = 1; i < 4; i++) {
        if (!(revealed_gnomes[current_player].includes(i))) {
            triangle(center, top + (i - 1)/3 * rect_height + vert_hat_margin,
            center - rect_width/2 + horiz_hat_margin, top + i/3 * rect_height - vert_hat_margin,
            center + rect_width/2 - horiz_hat_margin, top + i/3 * rect_height - vert_hat_margin);
        }
    }
    endClip()
    strokeWeight(stripe_weight);
    stroke("white");
    for (let i = 1; i < 4; i++) {
        if (!(revealed_gnomes[current_player].includes(i))) {
            line(0, top + i/3 * rect_height - vert_hat_margin - stripe_weight,
            width, top + i/3 * rect_height - vert_hat_margin - stripe_weight);
            for (let j = 2; j <= i; j++) {
            line(0, top + i/3 * rect_height - vert_hat_margin - (stripe_weight * j * 1.5),
                width, top + i/3 * rect_height - vert_hat_margin - (stripe_weight * j * 1.5));
            }
        }
    }
    pop();
}

function hide_gnome(tile) {
    let player = tile.gnome.owner
    for (let n in revealed_gnomes[player]) {
        if (revealed_gnomes[player][n] == tile.gnome.n_stripes) {
            revealed_gnomes[player].splice(n, 1); break;
        }
    }
    killed_gnomes[current_player].push(tile.gnome.n_stripes);
    console.log(killed_gnomes[current_player].length);
    if (killed_gnomes[current_player].length == 2) {
        // fill(200, 200, 200, 75);
        // strokeWeight(0);
        // rect(0, 0, width, height);
        textSize(250);
        clear()
        text("GAME OVER", 0, height / 2);
    }
    tile.gnome.type = undefined;
}