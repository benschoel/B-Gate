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
                if (this.entanglement.style === "CNOT") {
                    this.entanglement.control.entanglement.entangled = false;
                    this.entanglement.target.entanglement.entangled = false;
                    const controlVal = this.entanglement.control.measure();
                    if (controlVal === 1) {
                        this.entanglement.target.set(this.entanglement.target.value().reverse());
                    }
                    this.entanglement.target.measure();
                } else if (this.entanglement.style === "TOFFOLI") {
                    this.entanglement.control1.entanglement.entangled = false;
                    this.entanglement.control2.entanglement.entangled = false;
                    this.entanglement.target.entanglement.entangled = false;
                    const c1 = this.entanglement.control1.measure();
                    const c2 = this.entanglement.control2.measure();
                    if (c1 === 1 && c2 === 1) {
                        this.entanglement.target.set(this.entanglement.target.value().reverse());
                    }
                    this.entanglement.target.measure();
                }
            } else {
                const r = Math.random();
                const aVal = Math.pow(this.arr[0], 2);
                const val = r <= aVal ? 0 : 1;
                this.measured = val;
                return val;
            }
        }
    }

    entangle(bits) {
        this.entanglement.entangled = true;
        if (bits.length === 2) {
            this.entanglement.control = bits[0];
            this.entanglement.target = bits[1];
            this.entanglement.style = "CNOT";
        } else if (bits.length === 3) {
            this.entanglement.control1 = bits[0];
            this.entanglement.control2 = bits[1];
            this.entanglement.target = bits[2];
            this.entanglement.style = "TOFFOLI";
        }
    }
}

module.exports = QBit;
