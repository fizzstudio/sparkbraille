import { LineChart } from "../src/line_chart.js";
import * as data_generator from "../src/data_generator.js";
import { DataBinner } from "../src/data_binner.js";
import { bins2braille } from "../src/bins2braille.js";
import * as table from "../src/table_generator.js";
import * as braille from "../src/directBraille.js";
import { DataLookup } from "../src/data_lookup.js";

document.getElementById(`data_params_submit`).addEventListener(`click`, generate_linechart);

function generate_linechart () {
  let record_count = document.getElementById(`record_count_input`).value;
  let chart_width = Math.max( 220, (record_count * 25) + 55);
  let is_area_chart =  document.getElementById(`area-checkbox`).checked;

  let dataset = data_generator.genData(1, record_count, false);

  table.create_table( dataset, document.querySelector('section#data-table') );

  // console.log(dataset);
  //Create new chart and place it on chart section.
  let expanded_chart = new LineChart(`expanded`, dataset, document.querySelector('section#expanded_chart'), chart_width, 200, true);

  //Create new chart and place it on chart section.
  let compressed_chart = new LineChart(`compressed`, dataset, document.querySelector('section#compressed_chart'), chart_width, 100, true);

  let normalized_data = new DataBinner(dataset, 4);

  // console.log(normalized_data);
  let binned_chart = new LineChart(`binned`, normalized_data.dataset, document.querySelector('section#binned_chart'), chart_width, 100, false);

  let braille_array = new bins2braille(normalized_data.dataset, is_area_chart);
  // console.log(braille_array.cell_array);

  let last_data_index = 0;
  // insert interactive braille chart
  braille.insertInteractiveBrailleRegion(document.getElementById(`braille_linechart`), [braille_array.cell_array], (offset, node, selection) => {
    // console.log(offset);
    const data_index = offset * 2;
    // get data at index from original dataset
    const data_tuple = new DataLookup(dataset, data_index).tuple;

    // console.log(data_tuple);
    document.getElementById(`data_tuple_output`).textContent = data_tuple.toString().replace(`,`, `, `);

    hilite_table ([last_data_index, data_index]);
    last_data_index = data_index;
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
