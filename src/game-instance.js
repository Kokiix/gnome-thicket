class Game {
    constructor() {
        this.hex_grid = [];
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

    redraw_tiles() {
        clear();
        background('black');
        for (let q in hex_grid) {
            for (let y in hex_grid[q]) {
                hex_grid[q][y].draw();
            }
        }
    }
}