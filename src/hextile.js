class HexTile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.is_highlighted = false;
        this.has_thicket = false;
        this.is_barren = false;
        this.gnome = undefined;
    }

    // draw_hover() {this.draw(this.hover_border_color, this.hover_fill_color);}
    draw_select(color = "white") {
        this.draw(color);
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
        if (!this.is_barren) {
            this.has_thicket = true;
            fill(CONFIG.THICKET_FILL);
            stroke(CONFIG.TILE_STROKE);

        } else {
            fill(210, 180, 140);
            stroke(180, 160, 120);
        }
        strokeWeight(CONFIG.TILE_STROKE_WEIGHT);
        circle(this.x, this.y, CONFIG.thicket_diameter);
    }

    draw_gnome_for_player(player_n) {
        let player_color;

        if (this.gnome) {player_n = this.gnome.owner;}
        else {this.gnome = new Gnome(player_n);}
        strokeWeight(CONFIG.TILE_STROKE);
        strokeJoin(BEVEL);
        if (player_n == 1) {player_color = CONFIG.P1_COLOR;}
        else if (player_n == 2) {player_color = CONFIG.P2_COLOR;}
        fill(player_color);
        let darker = player_color.slice();
        for (let n in darker) {
            darker[n] -= 25;
        }
        stroke(darker);
        if (this.gnome.type) {
            triangle(
                this.x - CONFIG.gnome_size, this.y + CONFIG.gnome_size,
                this.x + CONFIG.gnome_size, this.y + CONFIG.gnome_size,
                this.x, this.y - CONFIG.gnome_size
            );

            push();
            beginClip();
            for (let i = 1; i < 4; i++) {
                triangle(
                    this.x - CONFIG.gnome_size, this.y + CONFIG.gnome_size,
                    this.x + CONFIG.gnome_size, this.y + CONFIG.gnome_size,
                    this.x, this.y - CONFIG.gnome_size
                );
            }
            endClip()
            let stripe_weight = CONFIG.gnome_size / 5;
            strokeWeight(stripe_weight);
            stroke("white");
            let loop_cap = -3 + 2 * this.gnome.n_stripes;
            for (let i = -1; i <= loop_cap; i += 2) {
                line(this.x - CONFIG.gnome_size, this.y + stripe_weight * i,
                this.x + CONFIG.gnome_size, this.y + stripe_weight * i);
            }
            pop();
        } else {
            quad(this.x, this.y - CONFIG.gnome_size,
                this.x - CONFIG.gnome_size, this.y,
                this.x, this.y + CONFIG.gnome_size,
                this.x + CONFIG.gnome_size, this.y);
        }
    }
}