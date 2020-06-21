//Generates random number betwen minimum and maximum
const genRandomNum = function(min, max) {
	return Math.random()*(max - min) + min;
}

/*Generates random number for each slot in the dataset in accordance
with the specified dimensions of the dataset that were randomly generated.*/
export const genData = function(rows, cols, hasGaps) {
	let outputTable = {};
	//Generate dimensions of csv file
	const dimensions = [rows, cols];

	//Create top left cell as empty.
	outputTable["label"] = [];
	//Write column labels
	for(let i=0; i<dimensions[1]; i++) {
		// outputTable["label"].push(genRandomLabel());
		outputTable["label"].push(i + 1);
	}

	//Fill in the table with random num values.
	//Currently only does integers.
	for(let i=0; i<dimensions[0]; i++) {
		//Generate row label
		let label = `row_${i}`;
		outputTable[label] = [];
		//Fill in the actual random values.
		for(let j=0; j<dimensions[1]; j++) {
      outputTable[label].push(Math.floor(genRandomNum(1,500)));
			// outputTable[label].push(5*j); // test regular intervals
		}
	}

	// console.log(outputTable);

	return outputTable;
}
