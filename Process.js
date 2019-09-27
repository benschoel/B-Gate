const QBit = require("./QBit");
const lib = require("./lib");

class Process {
    constructor() {
        this.qbits = [];
        this.pipeline = [];
        this.populateQbits();
    }

    populateQbits() {
        this.qbits = [];
        for (var i = 0; i < 3; i++) {
            this.qbits[i] = new QBit();
        }
    }

    step(gates) {
        const gateFuncs = [];
        for (const gate of gates) {
            gateFuncs.push(lib.createGate(gate.type, gate.bits));
        }
        this.pipeline.push(gateFuncs);
    }

    process() {
        for (var j = 0; j < this.pipeline.length; j++) {
            for (var k = 0; k < this.pipeline[j].length; k++) {
                this.qbits = this.pipeline[j][k].run(this.qbits);
            }
        }
    }

    getResults() {
        const arr = this.qbits.map(bit => {
            if (!isNaN(bit.measured)) {
                return bit.measured;
            } else {
                return bit;
            }
        });
        return arr;
    }
}

module.exports = Process;
