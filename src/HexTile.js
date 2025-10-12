class HexTile {
    static p1_color = [178, 91, 84];
    static p2_color = [87, 163, 201];


        // this.hover_border_color = this.brighten(this.stroke_color, 10);
        // this.hover_fill_color = this.brighten(this.fill_color, 10);
        // this.select_border_color = [255, 255, 255];


    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.is_highlighted = false;
        this.has_thicket = false;
        this.gnome = undefined;
    }

    draw_hover() {this.draw(this.hover_border_color, this.hover_fill_color);}
    draw_select(color = this.select_border_color) {
        this.draw(color, this.fill_color);
        this.is_highlighted = true;
    }
    draw(stroke_color = CONFIG.TILE_STROKE, fill_color = CONFIG.TILE_FILL) {
        this.is_highlighted = false;
        strokeWeight(CONFIG.TILE_STROKE_WEIGHT);
        stroke(stroke_color);
        fill(fill_color);

        beginShape();
        for (let angle = 0; angle < 6.28; angle += PI / 3) {
            vertex(
            round(this.x + CONFIG.circumradius * cos(angle)), 
            round(this.y + CONFIG.circumradius * sin(angle)));
        }
        endShape(CLOSE);

        if (this.has_thicket) {
            this.draw_thicket();
        }
        if (this.gnome) {
            this.draw_gnome_for_player();
        }
    }

    draw_thicket() {
        this.has_thicket = true;
        fill(CONFIG.THICKET_FILL);
        stroke(CONFIG.TILE_STROKE);
        strokeWeight(CONFIG.TILE_STROKE_WEIGHT);
        circle(this.x, this.y, CONFIG.circumradius);
    }

    draw_gnome_for_player(player_n) {
        if (!this.gnome) {this.gnome = new Gnome(player_n);}
        else {player_n = this.gnome.owner;}
        strokeWeight(this.weight);
        strokeJoin(BEVEL);
        let player_color;
        if (player_n == 1) {player_color = HexTile.p1_color;}
        else if (player_n == 2) {player_color = HexTile.p2_color;}
        fill(player_color);
        stroke(player_color);
        let disp = this.weight * 4.5;
        if (this.gnome.type) {
            triangle(
                this.x - disp, this.y + disp,
                this.x + disp, this.y + disp,
                this.x, this.y - disp
            );
        } else {
            quad(this.x, this.y - disp,
                this.x - disp, this.y,
                this.x, this.y + disp,
                this.x + disp, this.y);
        }
    }

    brighten(color, brighten_amt) {
        let new_color = color;
        for (let i = 0; i < 3; i++) {
            new_color[i] += brighten_amt
        }
        return new_color;
    }
}