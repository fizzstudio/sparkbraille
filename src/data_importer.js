// Input data formats:
export const csv=1;
export const json=2;
/* There are two arguments to the constructor: the input data, and the options.
options.type specifies the type of the input data (see the constants above for
possible types).
If the csv format is used, options.separator is the separator character ("," by default).
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
            const separator = options.separator ? options.separator : ",";
            const records = new CsvData(inputData, separator).data;
            if (records.length < 2)
                throw new Error(`At least two CSV records (labels and data, respectively) required`);
            const labels = records[0];
            // Eliminate extraneous white space.
            for (let label of labels)
                label.trim();
            data.label = labels;
            for (let i = 1; i < records.length; ++i) {
                const row = records[i];
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

class CsvData {
    constructor(inputData, separator) {
        this.init(inputData, separator);
        this.parse();
    }

    init(inputData, separator) {
        this.data = [];
        this.index = 0;
        this.inputData = inputData;
        this.separator = separator;
    }

    nextCharacter(consume=true) {
        let character = null;
        if (this.index < this.inputData.length) {
            character = this.inputData[this.index];
            if (consume)
                ++this.index;
        }
        return character;
    }

    parse() {
        const start_of_record = 0;
        const start_of_field = 1;
        const in_field = 2;
        const in_quote = 3;
        const end_of_field = 4;
        const end_of_record = 5;
        const end_of_input = 6;
        const end = 7;
        let state = start_of_record;
        let inputCharacter;
        let record;
        let field;
        while (state != end) {
            switch (state) {
            case start_of_record:
                record = [];
                // Fall through to the next case.
            case start_of_field:
                field = "";
                inputCharacter = this.nextCharacter();
                if (inputCharacter == null) {
                    state = end_of_input;
                    continue;
                }
                switch (inputCharacter) {
                case "\r":
                case "\n":
                    state = start_of_record;
                    continue;
                case this.separator:
                    continue;
                case "\\":
                    state = in_quote;
                    continue;
                default:
                    field += inputCharacter;
                    state = in_field;
                }
            case in_field:
                inputCharacter = this.nextCharacter();
                if (inputCharacter == null) {
                    state = end_of_input;
                    continue;
                }
                switch (inputCharacter) {
                case "\r":
                case "\n":
                    state = end_of_record;
                    continue;
                case "\\":
                    state = in_quote;
                    continue;
                case this.separator:
                    state = end_of_field;
                    continue;
                default:
                    field += inputCharacter;
                    continue;
                }
            case in_quote:
                inputCharacter = this.nextCharacter();
                if (inputCharacter == null) {
                    state = end_of_input;
                    continue;
                }
                // Allow quoting of any character, including new line.
                field += inputCharacter;
                state = in_field;
                continue;
            case end_of_field:
                if (field.length)
                    record.push(field);
                state = start_of_field;
                continue;
            case end_of_record:
                if (field.length)
                    record.push(field);
                if (record.length)
                    this.data.push(record);
                state = start_of_record;
                continue;
            case end_of_input:
                if (field.length)
                    record.push(field);
                if (record.length)
                    this.data.push(record);
                state = end;
                continue;
            default:
                throw new Error(`Invalid stte: ${state}`);
            }
        }
    }
}
