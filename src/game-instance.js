class Game {
    constructor() {
        this.board = new Board();
        this.class_selection_active = false;
        this.current_player = 0;
    }


    handle_board_click() {
        let [q, r] = cartesian_to_hex(mouseX, mouseY);
        q = 6 - (q + 3); // Add so that 0 is at center; subtract from n bc cols are stored RTL
        let y = r + (q < 4 ? 3 : 6 - q); // And convert r to y because tiles are stored as such

        if (this.board.hex_grid[q] && this.board.hex_grid[q][y]) {
            let chosen_tile = this.board.hex_grid[q][y];
            // Select gnome
            if (this.board.hex_grid[q][y].gnome && chosen_tile.gnome.owner == this.current_player) {
                this.board.clear_highlighted();
                this.board.hex_grid[q][y].draw_select();
                highlighted_tiles.push(chosen_tile);
                if (chosen_tile.gnome.type) {
                    this.board.highlight_revealed_moves(q, y);
                } else {
                    this.board.highlight_hidden_moves(q, y);
                }
                return;
            // Select location to move to
            } else if (chosen_tile.is_highlighted) {
                if (chosen_tile.has_thicket) {
                    if (highlighted_tiles[0].gnome.type) {
                        // unreveal gnome
                    } else {
                        this.board.hex_grid[q][y].gnome = highlighted_tiles[0].gnome
                        this.board.hex_grid[q][y].draw_gnome_for_player();
                        this.current_player = this.current_player == 1 ? 2 : 1;
                    }
                } else {
                    if (highlighted_tiles[0].gnome.type) {
                        this.board.hex_grid[q][y].gnome = highlighted_tiles[0].gnome
                        this.board.hex_grid[q][y].draw_gnome_for_player();
                        this.current_player = this.current_player == 1 ? 2 : 1;
                    } else {
                        highlighted_tiles[0].gnome = undefined;
                        this.board.clear_highlighted();
                        select_gnome_class(chosen_tile);
                        highlighted_tiles.push(chosen_tile);
                        return;
                    }
                }
                highlighted_tiles[0].gnome = undefined;
            }
            this.board.clear_highlighted();
        }
    }

    handle_class_sel_click() {
        let margin_size = (width - board_edge - rect_width) / 2;
        if (mouseX > board_edge + margin_size && mouseX < width - margin_size) {
            if (mouseY > rect_top && mouseY < rect_top + rect_height/3) {
                highlighted_tiles[0].gnome = new Gnome(this.current_player, "gardener");
            } else if (mouseY > rect_top + rect_height/3 && mouseY < rect_top + rect_height * 2/3) {
                highlighted_tiles[0].gnome = new Gnome(this.current_player, "ruffian");
            } else if (mouseY > rect_top + rect_height * 2/3 && mouseY < rect_top + rect_height) {
                highlighted_tiles[0].gnome = new Gnome(this.current_player, "salt");
            } else {return;}

            reset_canvas();
            highlighted_tiles[0].draw();
            highlighted_tiles = [];
            this.current_player = this.current_player == 1 ? 2 : 1;
            selecting_class = false;
        }
    }
}