const PauliX = toOp => {
    const state = [[0, 1], [1, 0]];

    return {
        run: qbits => {
            for (var i = 0; i < toOp.length; i++) {
                const bitIndex = toOp[i];
                qbits[bitIndex].set(mul(state, qbits[bitIndex].value()));
            }
            return qbits;
        }
    };
};

const PauliZ = toOp => {
    const state = [[1, 0], [0, -1]];

    return {
        run: qbits => {
            for (var i = 0; i < toOp.length; i++) {
                const bitIndex = toOp[i];
                qbits[bitIndex].set(mul(state, qbits[bitIndex].value()));
            }
            return qbits;
        }
    };
};

const HGate = toOp => {
    const state = [[1 / Math.sqrt(2), 1 / Math.sqrt(2)], [1 / Math.sqrt(2), -1 / Math.sqrt(2)]];

    return {
        run: qbits => {
            for (var i = 0; i < toOp.length; i++) {
                const bitIndex = toOp[i];
                qbits[bitIndex].set(mul(state, qbits[bitIndex].value()));
            }
            return qbits;
        }
    };
};

const MeasureGate = toOp => {
    return {
        run: qbits => {
            for (var i = 0; i < toOp.length; i++) {
                const bitIndex = toOp[i];
                qbits[bitIndex].measure();
            }
            return qbits;
        }
    };
};

const CNOTGate = bits => {
    if (bits.length !== 2) {
        throw new Error("CNOT gate operates on two bits at a time.");
    }
    return {
        run: qbits => {
            const control = bits[0];
            const target = bits[1];
            qbits[control].entangle([qbits[control], qbits[target]]);
            qbits[target].entangle([qbits[control], qbits[target]]);
            return qbits;
        }
    };
};

const Toffoli = bits => {
    if (bits.length !== 3) {
        throw new Error("Toffoli gate operates on three bits at a time.");
    }

    return {
        run: qbits => {
            const c1 = bits[0];
            const c2 = bits[1];
            const t = bits[2];
            qbits[c1].entangle([qbits[c1], qbits[c2], qbits[t]]);
            qbits[c2].entangle([qbits[c1], qbits[c2], qbits[t]]);
            qbits[t].entangle([qbits[c1], qbits[c2], qbits[t]]);
            return qbits;
        }
    };
};

const BlackBox = bits => {
    return {
        run: qbits => {
            return PauliX([bits[0]]).run(CNOTGate([bits[1], bits[0]]).run(qbits));
        }
    };
};

const tensor = (a1, a2) => {
    const arr = [];
    for (var i = 0; i < a1.length; i++) {
        for (var j = 0; j < a2.length; j++) {
            arr.push(a1[i] * a2[j]);
        }
    }
    return arr;
};

const mul = (a1, a2) => {
    if (a1[0].length !== a2.length) {
        throw new Error("To multiply, dimensions must match");
    }

    const res = [];

    for (var i = 0; i < a1.length; i++) {
        const curr = a1[i];
        let val = 0;
        for (var j = 0; j < curr.length; j++) {
            val += curr[j] * a2[j];
        }
        res.push(val);
    }

    return res;
};

const createGate = (type, bits) => {
    if (type === "H") {
        return HGate(bits);
    } else if (type === "CNOT") {
        return CNOTGate(bits);
    } else if (type === "MEASURE") {
        return MeasureGate(bits);
    } else if (type === "PAULIX") {
        return PauliX(bits);
    } else if (type === "PAULIZ") {
        return PauliZ(bits);
    } else if (type === "TOFFOLI") {
        return Toffoli(bits);
    } else {
        throw new Error("No gate with the name: " + type);
    }
};

module.exports = {
    tensor,
    createGate
};
