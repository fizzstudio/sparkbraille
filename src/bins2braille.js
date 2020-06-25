export class bins2braille {
  constructor(data, zero_value, is_area) {
    this.data = data;
    this.zero_value = zero_value || 0;
    this.is_area = is_area || false;
    this.cell_dots =[ [1,2,3,7], [4,5,6,8] ];
    this.cell_array = [];
    this.init()
  }

  init () {
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
            // fill in additional dots to zero baseline
            // TODO: refactor to make more elegant
            if (val > this.zero_value) {
              for (var v = val; this.zero_value <= v; --v) {
                // positive values: push dot only if it isn't already in array
                let dot = this.cell_dots[col][3 - v];
                if (!glyph.includes(dot)) {
                  glyph.push( dot );
                }
              }
            } else {        
              for (var v = val; this.zero_value >= v; ++v) {
                // negative values: push dot only if it isn't already in array
                let dot = this.cell_dots[col][3 - v];
                if (!glyph.includes(dot)) {
                  glyph.push( dot );
                }
              }
            }
          }

          if (1 === col || (r_len === r + 1)) {
            // reset new glyph every 2 records
            this.cell_array.push(glyph);
            glyph = [];
          }
        }
      }
    }
  }
}
