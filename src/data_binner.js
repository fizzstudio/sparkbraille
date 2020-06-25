export class DataBinner {
  constructor(data, bin_count) {
    this.data = data;
    this.bin_count = bin_count;
    this.dataset = null;
    this.min = null;
    this.max = null;
    this.interval = null;
    this.range = null;
    this.zero_value = null;
    this.init()
  }

  init () {
    this.find_min_max_interval();
    this.normalize_data();

  }

  find_min_max_interval() {
    for (const series in this.data) {
      if (`label` === series) {
        this.record_labels = this.data[series];
        this.record_count = this.record_labels.length;
      } else {
        let row = this.data[series];
        for (let record of row) {
          let val = parseFloat(record);

          if (null === this.max || null === this.min) {
            this.max = (!this.max && 0 !== this.max) ? val : this.max;
            this.min = (!this.min && 0 !== this.min) ? val : this.min;
          }

          if (`` !== val && !isNaN(val)) {
            this.max = this.max < val ? val : this.max;
            this.min = this.min > val ? val : this.min;
          }
        }
      }
    }


    // find zero value, before rounding to prevent rounding bugs in bins2braille
    this.zero_value = Math.round(Math.abs(this.min)/((this.max - this.min)/(this.bin_count - 1)) * 10) / 10;

    // round min down to nearest even number
    this.min = this.min % 2 == 0 ? this.min : this.min - 1;

    // round max up to nearest even number, and ensure max is outside the range of the data values
    this.max = this.max % 2 == 0 ? this.max + 2 : this.max + 1;

    // find range
    this.range = this.max - this.min;    

    // find interval
    this.interval = this.range / this.bin_count;    

    // // find zero value
    // this.zero_value = Math.round(Math.abs(this.min)/(this.range/(this.bin_count - 1)) * 10) / 10;
  }

  normalize_data() {
    // make static clone of dataset
    this.dataset = JSON.parse(JSON.stringify( this.data ));

    // assign new dataset entries to bins
    for (const series in this.dataset) {
      if (`label` !== series) {
        let row = this.dataset[series];
        for (let r = 0, r_len = row.length; r_len > r; ++r) {
          row[r] = Math.floor(Math.abs(row[r]-this.min) / this.interval);
        }
      }
    }
  }
}
