class HexTile {
    constructor(x, y, stroke_weight) {
        this.x = x;
        this.y = y;
        this.has_thicket = false;
        this.has_gnome = false;
        this.gnome_owner = 0;
        this.weight = stroke_weight;
        this.stroke_color = [51, 102, 68];
        this.fill_color = [87, 135, 75];

        this.thicket_color = [40, 83, 55];
        this.p1_color = [178, 91, 84];
        this.p2_color = [87, 163, 201];

        this.hover_border_color = this.brighten(this.stroke_color, 10);
        this.hover_fill_color = this.brighten(this.fill_color, 10);
        this.select_border_color = [255, 255, 255];
    }

    draw_hover() {this.draw(this.hover_border_color, this.hover_fill_color);}
    draw_select() {this.draw(this.select_border_color, this.fill_color);}
    draw(stroke_color = this.stroke_color, fill_color = this.fill_color) {
        strokeWeight(this.weight);
        stroke(stroke_color);
        fill(fill_color);

        beginShape();
        for (let angle = 0; angle < 6.28; angle += PI / 3) {
            vertex(
            round(this.x + DIMENSIONS.circumradius * cos(angle)), 
            round(this.y + DIMENSIONS.circumradius * sin(angle)));
        }
        endShape(CLOSE);

        if (this.has_thicket) {
            this.draw_thicket();
        }
        if (this.has_gnome) {
            this.draw_gnome_for_player(this.gnome_owner);
        }
    }

    draw_gnome_for_player(player_n) {
        this.has_gnome = true;
        this.gnome_owner = player_n;
        strokeWeight(this.weight);
        let player_color;
        if (player_n == 1) {player_color = this.p1_color;}
        else if (player_n == 2) {player_color = this.p2_color;}
        fill(player_color);
        strokeWeight(0);
        let disp = this.weight * 5;
        quad(this.x, this.y - disp,
            this.x - disp, this.y,
            this.x, this.y + disp,
            this.x + disp, this.y);
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