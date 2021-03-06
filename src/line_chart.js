export class LineChart {
  constructor(id, data, container, width, height, zero_value, pad) {
    this.svgns = `http://www.w3.org/2000/svg`;
    this.id = id;
    this.data = data;
    this.pad = pad || false;
    this.zero_value = zero_value || 0;
    this.root = null;
    this.container = container;
    this.min = null;
    this.max = null;
    this.range = null;
    this.record_count = null;
    this.record_labels = null;
    this.width = width || document.documentElement.clientWidth;
    this.height = height || 400; //document.documentElement.clientHeight;
    this.font_size = 15;
    this.x_label_font_size = 15;
    this.margin = 15;
    this.ticklength = 10;
    this.line_label_width = 90;
    this.axis_label_bbox = {
      x: this.ticklength + (this.font_size * 1.5),
      y: this.font_size
    }
    this.dataspace = {
      x: this.margin + this.axis_label_bbox.x,
      y: this.margin,
      width: this.width - (this.margin * 2) - this.axis_label_bbox.x - this.line_label_width,
      height: this.height - (this.margin * 2) - this.axis_label_bbox.y
    }

    this.init()
  }

  init () {
    this.find_min_max_values(this.data);
    this.create_chart();
    this.create_axes();
    this.create_markers();

    let idnum = 0;
    for (const series in this.data) {
      if (`label` === series) {
        this.record_count = this.data[series].length;
      } else {
        let series_data = this.data[series];
        this.create_dataline(series_data, series, idnum++);
      }
    }
  }

  find_min_max_values() {
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
    this.range = this.max - this.min;
    // console.log(this.min, this.max, this.range);   

    if (this.pad) {
      // round max up to nearest even number
      // this.max = this.max % 2 == 0 ? this.max : this.max + 1;
    }
  }

  single_precision ( float ) {
    return Math.round(float * 10) / 10;
  }

  create_chart() {
    this.root = document.createElementNS(this.svgns, `svg`);
    this.root.setAttribute(`xmlns`, this.svgns);
    this.root.setAttribute(`viewBox`, `0 0 ${this.width} ${this.height}`);

    while (this.container.firstChild) {
      this.container.firstChild.remove();
    }

    this.container.appendChild(this.root);
  }

  create_axes() {
    this.create_axis_x();
    this.create_axis_y();
  }

  create_axis_x () {
    //  create x axis
    let x_axis = document.createElementNS(this.svgns, `g`);
    x_axis.id = `x_axis`;
    x_axis.classList.add(`axis`, `x`);

    // create line
    let x_line = document.createElementNS(this.svgns, `path`);
    x_line.setAttribute(`d`, `M${this.dataspace.x},${this.dataspace.y + this.dataspace.height} H${this.dataspace.x + this.dataspace.width}`);
    x_line.classList.add(`axis`);
    x_axis.appendChild(x_line);

    // create tickmarks
    const t_len = this.record_count;
    const x_tick_distance = this.single_precision(this.dataspace.width / (t_len - 1));
    for (let t = 0; t_len > t; ++t) {
      const x1 = this.dataspace.x + (x_tick_distance * t);
      const y1 = this.dataspace.y + this.dataspace.height;
      const x2 = null;
      const y2 = this.dataspace.y + this.dataspace.height + this.ticklength;
      const label_x = this.dataspace.x + (x_tick_distance * t);
      const label_y = this.dataspace.y + this.dataspace.height + this.ticklength + this.font_size;
      const label_text = this.record_labels[t];

      let tick = this.create_tick( `x`, x1, y1, x2, y2, label_x, label_y, label_text );
      x_axis.appendChild(tick);
    }
    this.root.appendChild(x_axis);
  }

  create_axis_y () {
    //  create y axis
    let y_axis = document.createElementNS(this.svgns, `g`);
    y_axis.id = `y_axis`;
    y_axis.classList.add(`axis`, `y`);

    // create line
    let y_line = document.createElementNS(this.svgns, `path`);
    y_line.setAttribute(`d`, `M${this.dataspace.x},${this.dataspace.y} V${this.dataspace.y + this.dataspace.height}`);
    y_line.classList.add(`axis`);
    y_axis.appendChild(y_line);

    // const quarters = Math.round(((this.max * 10) / 3) / 10);
    const quarters = Math.round(((this.range * 10) / 3) / 10);
    // console.log(`quarters`, quarters);
    
    // create tickmarks
    // const y_tick_values = [0, (quarters), (quarters * 2), (this.max)];
    const y_tick_values = [this.min, (this.min + quarters), (this.max - quarters), (this.max)];
    const y_t_len = 4;
    const y_tick_distance = this.single_precision(this.dataspace.height / (y_t_len - 1));
    for (let t = 0; y_t_len > t; ++t) {
      const x1 = this.dataspace.x;
      const y1 = (this.dataspace.y + this.dataspace.height) - (y_tick_distance * t);
      const x2 = this.dataspace.x - this.ticklength;
      const y2 = null;
      const label_x = (this.dataspace.x - this.ticklength) - (this.font_size/4);
      const label_y = (this.dataspace.y + this.dataspace.height) - (y_tick_distance * t) + (this.font_size * 0.3);
      const label_text = y_tick_values[t];

      let tick = this.create_tick( `y`, x1, y1, x2, y2, label_x, label_y, label_text );
      y_axis.appendChild(tick);
    }

    // add 0 line for charts with negative values
    if (0 > this.min || 0 !== this.zero_value) {
      let zero_pos = this.dataspace.height / (this.range / (this.zero_value - this.min));

      // create line
      let zero_line = document.createElementNS(this.svgns, `path`);
      zero_line.setAttribute(`d`, `M${this.dataspace.x},${(this.dataspace.y + this.dataspace.height) - this.single_precision(zero_pos)} H${this.dataspace.x + this.dataspace.width}`);
      zero_line.classList.add(`zero_line`);
      y_axis.appendChild(zero_line);
    }

    this.root.appendChild(y_axis);
  }

  create_tick( axis_dir, x1, y1, x2, y2, label_x, label_y, label_text ) {
    let tick = document.createElementNS(this.svgns, `g`);

    let d = `M${x1},${y1}`;
    if (`x` === axis_dir) {
      d += ` V${y2}`;
    } else if (`y` === axis_dir) {
      d += ` H${x2}`;
    } 

    let tick_line = document.createElementNS(this.svgns, `path`);
    tick_line.setAttribute(`d`, d);
    tick_line.classList.add(`axis`);
    tick.appendChild(tick_line);

    let tick_label = document.createElementNS(this.svgns, `text`);
    tick_label.setAttribute(`x`, label_x);
    tick_label.setAttribute(`y`, label_y);
    tick_label.setAttribute(`aria-hidden`, `true`);
    tick_label.classList.add(`tick_label`);
    tick_label.textContent = label_text;
    tick.appendChild(tick_label);

    return tick;
  }

  create_markers() {
    let defs = document.createElementNS(this.svgns, `defs`);

    for (let m = 0; this.record_count > m; ++m) {
      let marker = document.createElementNS(this.svgns, `marker`);
      marker.id = `marker-dot-${m}`;
      marker.setAttribute(`viewBox`, `-4 -4 8 8`);
      marker.setAttribute(`markerUnits`, `strokeWidth`);
      marker.setAttribute(`markerWidth`, `5`);
      marker.setAttribute(`markerHeight`, `5`);
      marker.setAttribute(`stroke`, `context-fill`);
      marker.setAttribute(`fill`, `context-fill`);

      let dot = document.createElementNS(this.svgns, `circle`);
      dot.setAttribute(`r`, 3 );
      marker.appendChild(dot);

      defs.appendChild(marker);
    }
    this.root.appendChild(defs);
  }

  create_dataline(series, label, series_id) {
    //  create dataline group
    let dataline_group = document.createElementNS(this.svgns, `g`);
    dataline_group.id = label;
    dataline_group.classList.add(`dataline`, `series_${series_id}`);

    // create line
    const l_len = this.record_count;
    const x_tick_distance = this.single_precision(this.dataspace.width / (l_len - 1));

    let prev_x_pos = 0;
    let prev_y_pos = 0;
    for (let l = 0; l_len > l; ++l) {
      let val = series[l];

      if (`` !== val && !isNaN(val)) {
        let value_pos = this.dataspace.height / (this.range / (val - this.min));
        let x_pos = this.dataspace.x + (x_tick_distance * l);
        let y_pos = (this.dataspace.y + this.dataspace.height) - this.single_precision(value_pos);
        let dataline = document.createElementNS(this.svgns, `path`);
        if (0 !== l) {
          let d = `M${prev_x_pos},${prev_y_pos} L${x_pos},${y_pos}`;
          dataline.setAttribute(`d`, d);
          // dataline.id = `series_${label}-segment_${l}`;
          dataline.id = `${this.id}-${label}-segment_${l}`;
          dataline_group.appendChild(dataline);
          dataline.setAttribute(`marker-start`, `url(#marker-dot-${series_id})`);
          dataline.setAttribute(`marker-end`, `url(#marker-dot-${series_id})`);
        }

        prev_x_pos = x_pos;
        prev_y_pos = y_pos;
      }
    }

    this.root.appendChild(dataline_group);
  }

  hilite_segments_by_id( id_arr ) {
    // console.log(id_arr);
    
    const segments = this.root.querySelectorAll(`path[id*=-segment_]`);
    if (!id_arr || !id_arr.length) {
      for (const segment of segments) {
        segment.classList.remove(`segment_hilite`);
      }
    } else {
      for (const segment of segments) {
        segment.classList.remove(`segment_hilite`);
      }

      for (const id of id_arr) {
        const segment = this.root.getElementById(id);
        if (segment){
          segment.classList.add(`segment_hilite`);
        }
      }
    }
  }
}
