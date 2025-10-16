class Gnome {
    constructor(owner, type = undefined) {
        this.owner = owner;
        this.type = type;
    }

    n_stripes() {
        if (this.type == "gardener") {return 1;}
        if (this.type == "ruffian") {return 2;}
        return 3;
    }
}