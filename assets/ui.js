import { LineChart } from "../src/line_chart.js";
import * as data_generator from "../src/data_generator.js";
import { DataBinner } from "../src/data_binner.js";
import { bins2braille } from "../src/bins2braille.js";
import { data2brailleBars } from "../src/data2braillebars.js";
import { TableGenerator } from "../src/table_generator.js";
import * as braille from "../src/directBraille.js";
import { DataLookup } from "../src/data_lookup.js";

document.getElementById(`data_params_submit`).addEventListener(`click`, generate_linechart);

window.onload = () => generate_linechart();

function generate_linechart () {
  let data_min = document.getElementById(`min_input`).value;
  let data_max = document.getElementById(`max_input`).value;
  let record_count = document.getElementById(`record_count_input`).value;
  let chart_width = Math.max( 220, (record_count * 25) + 55);

  // TODO: make more accurate chart width based on braille cell count
  /*
  const braille_cell_font_size = 32.12;
  const chart_axis_margin = 47.5;
  let chart_width = ((record_count / 2) * braille_cell_font_size) + chart_axis_margin;
  console.log(`chart width:`, chart_width);
  */
  
  let is_area_chart =  document.getElementById(`area-checkbox`).checked;

  let dataset = data_generator.genData(data_min, data_max, 1, record_count, false);  

  const table_container = document.querySelector('section#data-table');
  table_container.style.width = `${Math.max( 800, (chart_width * 0.7))}px`;
  let table = new TableGenerator( `random_data_table`, dataset, table_container );  

  //Create new chart and place it on chart section.
  let expanded_chart = new LineChart(`expanded`, dataset, document.querySelector('section#expanded_chart'), chart_width, 200, 0, true);

  //Create new chart and place it on chart section.
  let compressed_chart = new LineChart(`compressed`, dataset, document.querySelector('section#compressed_chart'), chart_width, 100, 0, true);

  let normalized_data = new DataBinner(dataset, 4);

  // console.log(normalized_data);
  let binned_chart = new LineChart(`binned`, normalized_data.dataset, document.querySelector('section#binned_chart'), chart_width, 100, normalized_data.zero_value, false);

  // create braille line chart
  let braille_line_array = new bins2braille(normalized_data.dataset, normalized_data.zero_value, is_area_chart);
  // console.log(braille_array.cell_array);

  let line_last_data_tuple = 0;
  // insert interactive braille chart
  braille.insertInteractiveBrailleRegion(document.getElementById(`braille_linechart`), [braille_line_array.cell_array], (offset, node, selection) => {
    // console.log(offset);
    const data_index = offset * 2;
    // get data at index from original dataset
    const line_data_tuple = new DataLookup(dataset, data_index).tuple;

    // console.log(data_tuple);
    document.getElementById(`line-data_tuple_output`).textContent = line_data_tuple.toString().replace(`,`, `, `);

    hilite_chart_segments([expanded_chart, compressed_chart, binned_chart], data_index);
    hilite_table ([line_last_data_tuple, data_index]);
    line_last_data_tuple = data_index;
  });


  // create braille bar chart
  let braille_bar_array = new bins2braille(normalized_data.dataset, normalized_data.zero_value, true);
  // console.log(braille_array.cell_array);

  let bar_last_data_tuple = 0;
  // insert interactive braille chart
  braille.insertInteractiveBrailleRegion(document.getElementById(`braille_barchart`), [braille_bar_array.cell_array], (offset, node, selection) => {
    // console.log(offset);
    const data_index = offset * 2;
    // get data at index from original dataset
    const bar_data_tuple = new DataLookup(dataset, data_index).tuple;

    // console.log(data_tuple);
    document.getElementById(`bar-data_tuple_output`).textContent = bar_data_tuple.toString().replace(`,`, `, `);

    hilite_chart_segments([expanded_chart, compressed_chart, binned_chart], data_index);
    hilite_table ([bar_last_data_tuple, data_index]);
    bar_last_data_tuple = data_index;
  });
}

function hilite_chart_segments (charts, data_index) {
  charts.forEach( chart => {
    chart.hilite_segments_by_id([`${chart.id}-row_0-segment_${data_index + 1}`]);
  });
}

function hilite_table (data_indexes) {
  data_indexes.forEach((data_index, i) => {
    // const data_index = data_indexes[each_index];
    // highlight table cells
    const active_cells = document.querySelectorAll(`#data-table table tbody tr:nth-child(1) td:nth-child(${data_index + 1}), #data-table table tbody tr:nth-child(1) td:nth-child(${data_index + 2})`);
    active_cells.forEach((item, j) => {
      // console.log(item);
      if (0 === i) {
        item.classList.remove(`hilite`);
      } else {
        item.classList.add(`hilite`);
        item.scrollIntoView(true);
      }
    });
  });
}

