class Gnome {
    constructor(owner, type = undefined) {
        this.owner = owner;
        this.type = type;
        this.n_stripes;
        if (this.type == "gardener") {
            this.n_stripes = 1;
        } else if (this.type == "ruffian") {
            this.n_stripes = 2;
        } else {
            this.n_stripes = 3;
        }
    }
}
