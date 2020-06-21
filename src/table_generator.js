export class TableGenerator {
  constructor(id, data, container, width) {
    this.id = id;
    this.data = data;
    this.container = container;
    this.table = null;

    this.create_table();
  }

  create_table () {
    while (this.container.firstChild) {
      this.container.firstChild.remove();
    }

    this.table = document.createElement(`table`);
    const thead = document.createElement(`thead`);
    this.table.appendChild(thead);
    const tbody = document.createElement(`tbody`);
    this.table.appendChild(tbody);

    for (const series in this.data) {
      let cell_type = `td`;
      let parent_node = tbody;
      if (`label` === series) {
        cell_type = `th`;
        parent_node = thead;
      }

      const row_el = this.table.insertRow();

      let row = this.data[series];
      for (let record of row) {
        let val = record;
        let cell = document.createElement(cell_type);
        cell.textContent = val;
        row_el.appendChild(cell);
      }
      parent_node.appendChild(row_el);
    }

    this.container.appendChild(this.table);
  }
};
