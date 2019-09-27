class QBit {
    constructor() {
        this.arr = [1, 0];
        this.entanglement = {
            entangled: false
        };
    }

    value() {
        return this.arr;
    }

    set(a) {
        this.arr = a;
    }

    setMeasured(x) {
        this.measured = x;
    }

    measure() {
        if (this.measured) {
            return this.measured;
        } else {
            if (this.entanglement.entangled) {
                this.entanglement.control.entanglement.entangled = false;
                this.entanglement.target.entanglement.entangled = false;
                const controlVal = this.entanglement.control.measure();
                if (controlVal === 1) {
                    this.entanglement.target.set(this.entanglement.target.value().reverse());
                }
                this.entanglement.target.measure();
            } else {
                const r = Math.random();
                const aVal = Math.pow(this.arr[0], 2);
                const val = r <= aVal ? 0 : 1;
                this.measured = val;
                return val;
            }
        }
    }

    entangle(cbit, tbit) {
        this.entanglement.entangled = true;
        this.entanglement.control = cbit;
        this.entanglement.target = tbit;
    }
}

module.exports = QBit;
