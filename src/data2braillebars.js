export class data2brailleBars {
    constructor(data, maxBarLength, barSymbol=[1,2,3,4,5,6]) {
        this.data = data;
        this.maxBarLength = maxBarLength;
        this.barSymbol = barSymbol;
        this.brailleBars = [];
        this.min = this.max = null;
        this.find_extrema();
        this.generate_bars();
    }

    // Find maximum and minimum, and set the interval.
    find_extrema() {
        for (const series in this.data) {
            if (series !== "label")
                for (const val of this.data[series]) {
                    if (this.min == null) {
                        this.min = this.max = val;
                        continue;
                    }
                    this.min = val < this.min ? val : this.min;
                    this.max = val > this.max ? val : this.max;
                }
        }
        this.interval = Math.abs(this.max-this.min)/this.maxBarLength;
    }
    
    generate_bars() {
        for (const series in this.data) {
            if (series !== "label") {
                let row = this.data[series];
                for (const val of row) {
                    let bar = [];
                    let barLength = Math.floor(Math.abs(val-this.min)/this.interval);
                    barLength = barLength < this.maxBarLength ? barLength : this.maxBarLength - 1;
                    for (let i = 0; i < barLength; ++i)
                        bar.push(this.barSymbol);
                    this.brailleBars.push(bar);
                }
            }
        }
    }
}

