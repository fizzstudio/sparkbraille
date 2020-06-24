//Generates random number betwen minimum and maximum, inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Generates random number for each slot in the dataset in accordance
with the specified dimensions of the dataset that were randomly generated.*/
export const genData = function(min, max, rows, cols, hasGaps) {
  min = parseInt(min);
  max = parseInt(max);
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
    
    // console.log(random());
    
		for(let j=0; j<dimensions[1]; j++) {
      outputTable[label].push(Math.floor(getRandomInt(min, max)));
			// outputTable[label].push(5*j); // test regular intervals
		}
	}

	// console.log(outputTable);

	return outputTable;
}
