export function create_table (data, container) {
    while (container.firstChild) {
      container.firstChild.remove();
    }

  const table = document.createElement(`table`);
  const thead = document.createElement(`thead`);
  table.appendChild(thead);
  const tbody = document.createElement(`tbody`);
  table.appendChild(tbody);

  for (const series in data) {
    let cell_type = `td`;
    let parent_node = tbody;
    if (`label` === series) {
      cell_type = `th`;
      parent_node = thead;
    }

    const row_el = table.insertRow();

    let row = data[series];
    for (let record of row) {
      let val = record;
      let cell = document.createElement(cell_type);
      cell.textContent = val;
      row_el.appendChild(cell);
    }
    parent_node.appendChild(row_el);
  }

  container.appendChild(table);
}
