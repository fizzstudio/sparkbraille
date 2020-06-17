export class bins2braille {
  constructor(data, is_area) {
    this.data = data;
    this.is_area = is_area || false;
    this.cell_dots =[ [1,2,3,7], [4,5,6,8] ];
    this.cell_array = [];
    this.init()
  }

  init () {
    // console.log(this.data);
    this.build_glyphs();
  }

  build_glyphs() {
    for (const series in this.data) {
      if (`label` !== series) {
        let row = this.data[series];
        let glyph = [];
        for (var r = 0, r_len = row.length; r_len > r; ++r) {
          let val = row[r];

          // switch column on every odd number
          let col = 0;
          if (0 !== r % 2) {
            col = 1;
          }

          glyph.push( this.cell_dots[col][3 - val] );
          if (this.is_area) {
            for (var v = val; 0 <= v; --v) {
              glyph.push( this.cell_dots[col][3 - v] );
            }
          }

          if (1 === col || (r_len === r + 1)) {
            // reset new glyph
            this.cell_array.push(glyph);
            glyph = [];
          }
        }
      }
    }
  }

}
