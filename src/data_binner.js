export class DataBinner {
  constructor(data, bin_count) {
    this.data = data;
    this.bin_count = bin_count;
    this.dataset = null;
    this.min = null;
    this.max = null;
    this.interval = null;
    this.bin_slots = [];
    this.init()
  }

  init () {
    // console.log(this.data);
    this.find_min_max_values();
    this.find_interval();
    this.find_bins();
    this.normalize_data();
  }

  find_min_max_values() {
    // TODO: find longest string in labels, set line_label_width and x_label_font_size accordingly
    // const longest_string = this.record_labels.reduce((a, b) => { return a.length > b.length ? a : b; });

    for (const series in this.data) {
      if (`label` === series) {
        this.record_labels = this.data[series];
        this.record_count = this.record_labels.length;
      } else {
        let row = this.data[series];
        for (let record of row) {
          let val = parseFloat(record);

          if (!this.max || !this.min) {
            this.max = !this.max ? val : this.max;
            this.min = !this.min ? val : this.min;
          }

          if (`` !== val && !isNaN(val)) {
            this.max = this.max < val ? val : this.max;
            this.min = this.min > val ? val : this.min;
          }
        }
      }
    }

    // round min down to nearest even number
    this.min = this.min % 2 == 0 ? this.min : this.min - 1;

    // round max up to nearest even number
    this.max = this.max % 2 == 0 ? this.max : this.max + 1;
  }

  find_interval() {
    const range = this.max - this.min;
    this.interval = range / this.bin_count;
    // console.log(this.min, this.max, this.interval);
  }

  find_bins() {
    for (var b = 0; this.bin_count > b; ++b) {
      this.bin_slots.push(this.min + (this.interval * b));
    }
    // console.log(this.bin_slots);
  }

  normalize_data() {
    // make static clone of dataset
    this.dataset = JSON.parse(JSON.stringify( this.data ));

    // assign new dataset entries to bins
    for (const series in this.dataset) {
      if (`label` !== series) {
        let row = this.dataset[series];
        for (let r = 0, r_len = row.length; r_len > r; ++r) {
            row[r] = Math.floor(Math.abs(row[r]-this.min)/this.interval);
        }
      }
    }
  }
}
