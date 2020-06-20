// Input data formats:
export const csv=1;
export const json=2;
/* There are two arguments to the constructor: the input data, and the options.
options.type specifies the type of the input data (see the constants above for
possible types).
If the csv format is used, options.separator is a string or a regexp specifying the separator (tab by default, hence parsing TSV data).
*/

export class DataImporter {
    constructor(inputData, options) {
        this.data = {};
        this.parse_data(inputData, options);
    }

    parse_data(inputData, options) {
        let data = {};
        switch (options.type) {
        case csv:
            const separator = options.separator ? options.separator : "\t";
            // This very naive solution fails to handle escaping of the separator.
            const lines = inputData.trim().split("\n");
            if (lines.length < 2)
                throw new Error(`Failed to separate data into lines: ${inputData}`);
            const labels = lines[0].split(separator);
            // Eliminate extraneous white space.
            for (let label of labels)
                label.trim();
            data.label = labels;
            for (let i = 1; i < lines.length; ++i) {
                const row = lines[i].split(separator);
                if (!row.length)
                    throw new Error(`Failed to parse row ${lines[i]}`);
                let entries = [];
                for (let entry of row) {
                    const val = Number.parseFloat(entry);
                    if (isNaN(val))
                        throw new Error(`Failed to parse value ${entry}`);
                    entries.push(val);
                }
                data[i.toString()] = entries;
            }
            break;
        case json:
            data = JSON.parse(inputData);
            // perform minimal validation.
            if (!data.label.length)
                throw new Error("Missing labels in JSON data");
            if (!data[1].length)
                throw new Error("First row of data missing in JSON input");
            break;
        default:
            throw new Error(`Invalid input data type: ${options.type}`);
        }
        this.data = data;
    }
}
