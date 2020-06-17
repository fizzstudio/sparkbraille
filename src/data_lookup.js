export class DataLookup {
  constructor(data, index) {
    this.data = data;
    this.index = index;
    this.tuple = [];
    this.init()
  }

  init () {
    this.get_data();
  }

  get_data() {
    for (const series in this.data) {
      if (`label` !== series) {
        let row = this.data[series];
        this.tuple = [
          row[this.index],
          row[this.index + 1]
        ];
      }
    }
  }

}
