class Board {

    constructor() {
        this.hex_grid = [];
    }

    init(height, width) {
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

    highlight_revealed_moves(q, y) {
        let draw_on_top = [];
        const select = (tile) => {
            if (tile && !tile.gnome) {
            highlighted_tiles.push(tile);
            if (tile.has_thicket) {
                draw_on_top.push(tile);
            } else {
                tile.draw_select();
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

    clear_highlighted() {
        for (let i = 0; i < highlighted_tiles.length; i++) {
            highlighted_tiles[i].draw();
        }
        highlighted_tiles = [];
    }
}