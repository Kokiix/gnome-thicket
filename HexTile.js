class HexTile {
    constructor(x, y, stroke_weight) {
        this.x = x;
        this.y = y;
        this.weight = stroke_weight;
        this.border_color = [51, 102, 68];
        this.fill_color = [87, 135, 75];

        this.hover_border_color = [];
        this.hover_fill_color = [];
        for (let i = 0; i < 3; i++) {
            this.hover_border_color[i] = this.border_color[i] + 10;
            this.hover_fill_color[i] = this.fill_color[i] + 10;
        }

        this.select_border_color = [255, 255, 255];
    }

    draw_hover() {this.draw(this.hover_border_color, this.hover_fill_color);}
    draw_select() {this.draw(this.select_border_color, this.fill_color);}
    draw(border_color = this.border_color, fill_color = this.fill_color) {
        strokeWeight(this.weight);
        stroke(border_color[0], border_color[1], border_color[2]);
        fill(fill_color[0], fill_color[1], fill_color[2]);

        beginShape();
        for (let angle = 0; angle < 6.28; angle += PI / 3) {
            vertex(
            round(this.x + DIMENSIONS.circumradius * cos(angle)), 
            round(this.y + DIMENSIONS.circumradius * sin(angle)));
        }
        endShape(CLOSE);
    }
}