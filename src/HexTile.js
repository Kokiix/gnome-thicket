class HexTile {
    static p1_color = [178, 91, 84];
    static p2_color = [87, 163, 201];
    constructor(x, y, stroke_weight) {
        this.x = x;
        this.y = y;
        this.is_hilighted = false;
        this.has_thicket = false;
        this.gnome = undefined;

        this.weight = stroke_weight;
        this.stroke_color = [51, 102, 68];
        this.fill_color = [87, 135, 75];

        this.thicket_color = [40, 83, 55];

        this.hover_border_color = this.brighten(this.stroke_color, 10);
        this.hover_fill_color = this.brighten(this.fill_color, 10);
        this.select_border_color = [255, 255, 255];
    }

    draw_hover() {this.draw(this.hover_border_color, this.hover_fill_color);}
    draw_select(color = this.select_border_color) {
        this.draw(color, this.fill_color);
        this.is_hilighted = true;
    }
    draw(stroke_color = this.stroke_color, fill_color = this.fill_color) {
        this.is_hilighted = false;
        strokeWeight(this.weight);
        stroke(stroke_color);
        fill(fill_color);

        beginShape();
        for (let angle = 0; angle < 6.28; angle += PI / 3) {
            vertex(
            round(this.x + dimensions.circumradius * cos(angle)), 
            round(this.y + dimensions.circumradius * sin(angle)));
        }
        endShape(CLOSE);

        if (this.has_thicket) {
            this.draw_thicket();
        }
        if (this.gnome) {
            this.draw_gnome_for_player();
        }
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

    draw_thicket() {
        this.has_thicket = true;
        fill(this.thicket_color);
        strokeWeight(this.weight * 2);
        stroke(this.stroke_color);
        circle(this.x, this.y, this.weight * 15);
    }

    brighten(color, brighten_amt) {
        let new_color = color;
        for (let i = 0; i < 3; i++) {
            new_color[i] += brighten_amt
        }
        return new_color;
    }
}