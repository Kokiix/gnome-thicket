class Game {
    constructor() {
        this.hex_grid = [];
        this.highlighted_tiles = [];
        this.class_selection_active = false;
        this.current_player = 1;
    }

    handle_board_click() {
        let [q, r] = cartesian_to_hex(mouseX, mouseY);
        q = 6 - (q + 3); // Add so that 0 is at center; subtract from n bc cols are stored RTL
        let y = r + (q < 4 ? 3 : 6 - q); // And convert r to y because tiles are stored as such

        if (this.hex_grid[q] && this.hex_grid[q][y]) {
            let chosen_tile = this.hex_grid[q][y];
            // Select gnome
            if (this.hex_grid[q][y].gnome && chosen_tile.gnome.owner == this.current_player) {
                this.clear_highlighted();
                this.hex_grid[q][y].draw_select();
                this.highlighted_tiles.push(chosen_tile);
                if (chosen_tile.gnome.type) {
                    this.highlight_revealed_moves(q, y);
                } else {
                    this.highlight_hidden_moves(q, y);
                }
                return;
            // Select location to move to
            } else if (chosen_tile.is_highlighted) {
                if (chosen_tile.has_thicket) {
                    if (this.highlighted_tiles[0].gnome.type) {
                        // unreveal gnome
                    } else {
                        this.hex_grid[q][y].gnome = this.highlighted_tiles[0].gnome
                        this.hex_grid[q][y].draw_gnome_for_player();
                        this.current_player = this.current_player == 1 ? 2 : 1;
                    }
                } else {
                    if (this.highlighted_tiles[0].gnome.type) {
                        this.hex_grid[q][y].gnome = this.highlighted_tiles[0].gnome
                        this.hex_grid[q][y].draw_gnome_for_player();
                        this.current_player = this.current_player == 1 ? 2 : 1;
                    } else {
                        this.highlighted_tiles[0].gnome = undefined;
                        this.clear_highlighted();
                        select_gnome_class(chosen_tile);
                        this.highlighted_tiles.push(chosen_tile);
                        return;
                    }
                }
                this.highlighted_tiles[0].gnome = undefined;
            }
            this.clear_highlighted();
        }
    }

    handle_class_sel_click() {
        let margin_size = (width - board_edge - rect_width) / 2;
        if (mouseX > board_edge + margin_size && mouseX < width - margin_size) {
            if (mouseY > rect_top && mouseY < rect_top + rect_height/3) {
                this.highlighted_tiles[0].gnome = new Gnome(this.current_player, "gardener");
            } else if (mouseY > rect_top + rect_height/3 && mouseY < rect_top + rect_height * 2/3) {
                this.highlighted_tiles[0].gnome = new Gnome(this.current_player, "ruffian");
            } else if (mouseY > rect_top + rect_height * 2/3 && mouseY < rect_top + rect_height) {
                this.highlighted_tiles[0].gnome = new Gnome(this.current_player, "salt");
            } else {return;}

            reset_canvas();
            this.highlighted_tiles[0].draw();
            this.highlighted_tiles = [];
            this.current_player = this.current_player == 1 ? 2 : 1;
            selecting_class = false;
        }
    }

    init_board(height, width) {
        this.init_tiles(height, width);

        // Draw thickets on top and bottom border
        for (let i = 0; i < this.hex_grid.length; i++) {
            this.hex_grid[i][0].draw_thicket();
            this.hex_grid[i][this.hex_grid[i].length - 1].draw_thicket();
        }

        // Thickets sticking out of center row
        this.hex_grid[3][1].draw_thicket();
        this.hex_grid[3][5].draw_thicket();

        this.hex_grid[2][0].draw_gnome_for_player(1);
        this.hex_grid[3][0].draw_gnome_for_player(1);
        this.hex_grid[4][0].draw_gnome_for_player(1);
        this.hex_grid[2][5].draw_gnome_for_player(2);
        this.hex_grid[3][6].draw_gnome_for_player(2);
        this.hex_grid[4][5].draw_gnome_for_player(2);
    }

    init_tiles(height, width) {
        const board_height = CONFIG.inradius * CONFIG.CENTER_N_TILES * 2;
        const center_col_start_y = (height - board_height) / 2 + CONFIG.inradius;
        // Using axial coordinates: https://www.redblobgames.com/grids/hexagons/#coordinates-axial
        // The number of tiles in col loop from 4 to 7 to 4
        let col_index = 0;
        let col_grow_direction = 1;
        for (let tiles_in_col = CONFIG.EDGE_N_TILES; 
            tiles_in_col <= CONFIG.CENTER_N_TILES && tiles_in_col >= CONFIG.EDGE_N_TILES; 
            tiles_in_col += col_grow_direction) {

            this.hex_grid[col_index] = [];
            
            const tile_diff_from_center = CONFIG.CENTER_N_TILES - tiles_in_col
            // Generate tiles top to bottom
            const col_start_y = center_col_start_y + CONFIG.inradius * tile_diff_from_center;
            const x = width / 2 + (tile_diff_from_center * col_grow_direction
             * CONFIG.circumradius * 1.5); // Distance from 1 hex to another is circ * 1.5
            for (let tile_y = 0; tile_y < tiles_in_col; tile_y++) {
                const y = col_start_y + CONFIG.inradius * tile_y * 2
                this.hex_grid[col_index][tile_y] = new HexTile(x, y);
                this.hex_grid[col_index][tile_y].draw();
            }

            col_index += 1;
            if (tiles_in_col == 7) {col_grow_direction = -1;}
        }
    }

    redraw() {
        clear();
        background('black');
        for (let q in this.hex_grid) {
            for (let y in this.hex_grid[q]) {
                this.hex_grid[q][y].draw();
            }
        }
    }


    highlight_hidden_moves(init_q, init_y) {
        let draw_on_top = [];
        const highlightTile = (tile) => {
            if (tile && !tile.gnome) {
            this.highlighted_tiles.push(tile);
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
            if (!highlightTile(this.hex_grid[i][y])) {
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

        traverseAndHighlight(init_q + 1, this.hex_grid.length, 1, q => (q > 3) ? -1 : 0);
        traverseAndHighlight(init_q + 1, this.hex_grid.length, 1, q => (q <= 3) ? 1 : 0);

        for (let i in draw_on_top) {
            draw_on_top[i].draw_select([255, 0, 0]);
        }
    }

    highlight_revealed_moves(q, y) {
        let draw_on_top = [];
        const select = (tile) => {
            if (tile && !tile.gnome) {
            this.highlighted_tiles.push(tile);
            if (tile.has_thicket) {
                draw_on_top.push(tile);
            } else {
                tile.draw_select();
            }
            }
        };
        select(this.hex_grid[q][y + 1]);
        select(this.hex_grid[q][y - 1]);

        q -= 1;
        select(this.hex_grid[q][y + ((q < 3) ? -1 : 0)]);
        select(this.hex_grid[q][y + ((q >= 3) ? 1 : 0)]);
        q += 2;
        select(this.hex_grid[q][y + ((q > 3) ? -1 : 0)]);
        select(this.hex_grid[q][y + ((q <= 3) ? 1 : 0)]);
        for (let i in draw_on_top) {
            draw_on_top[i].draw_select([255, 0, 0]);
        }
    }

    clear_highlighted() {
        for (let i = 0; i < this.highlighted_tiles.length; i++) {
            this.highlighted_tiles[i].draw();
        }
        this.highlighted_tiles = [];
    }

    select_gnome_class() {
        selecting_class = true;
        fill(200, 200, 200, 75);
        strokeWeight(0);
        rect(0, 0, width, height);

        stroke(180, 180, 180);
        strokeWeight(5);
        fill(200, 200, 200);
        rect_height = height * 0.75;
        rect_width = dimensions.circumradius * 3.5;
        board_edge = width / 2 + 1.5 * dimensions.circumradius * 3 + dimensions.circumradius;
        rect_top = height / 2 - rect_height / 2
        rect((board_edge + width) / 2 - 0.5 * rect_width, rect_top, rect_width, rect_height);

        strokeJoin(BEVEL);
        if (current_player == 1) {
            stroke(HexTile.p1_color);
            fill(HexTile.p1_color);
        } else {
            stroke(HexTile.p2_color);
            fill(HexTile.p2_color); 
        }

        let vert_hat_margin = rect_width / 10;
        let horiz_hat_margin = rect_width / 5;
        for (let i = 1; i < 4; i++) {
            triangle((board_edge + width) / 2, rect_top + (i - 1)/3 * rect_height + vert_hat_margin,
            (board_edge + width) / 2 - rect_width/2 + horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin,
            (board_edge + width) / 2 + rect_width/2 - horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin);
        }
        push();
        beginClip();
        for (let i = 1; i < 4; i++) {
            triangle((board_edge + width) / 2, rect_top + (i - 1)/3 * rect_height + vert_hat_margin,
            (board_edge + width) / 2 - rect_width/2 + horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin,
            (board_edge + width) / 2 + rect_width/2 - horiz_hat_margin, rect_top + i/3 * rect_height - vert_hat_margin);
        }
        endClip()
        let stripe_weight = rect_width / 12;
        strokeWeight(stripe_weight);
        stroke("white");
        for (let i = 1; i < 4; i++) {
            line(board_edge, rect_top + i/3 * rect_height - vert_hat_margin - stripe_weight,
            width, rect_top + i/3 * rect_height - vert_hat_margin - stripe_weight);
            for (let j = 2; j <= i; j++) {
            line(board_edge, rect_top + i/3 * rect_height - vert_hat_margin - (stripe_weight * j * 1.5),
                width, rect_top + i/3 * rect_height - vert_hat_margin - (stripe_weight * j * 1.5));
            }
        }
        pop();
    }
}