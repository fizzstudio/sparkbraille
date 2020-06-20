// Constants:
const brailleUnicodeBlock = 0x2800;
export const space = [];
export const fullCell = [1,2,3,4,5,6,7,8];

/* Converts an array of dot specifications to a string of (Unicode) braille.
   Each dot specification is an array of integers (1-8); [] represents a braille space character.
*/
export function convertCells(cells) {
  return cells.reduce((accumulator, cell) => {
    if (typeof(cell) == "undefined" || cell == null)
      throw new Error("Invalid dot specification");
    let dots = brailleUnicodeBlock;
    for (let dot of cell) {
      if (dot < 1 || dot > 8)
        throw new Error(`Dot out of range: ${dot}`);
      dots |= 1 << (dot - 1);
    }
    return accumulator + String.fromCharCode(dots);
  }, "");
}

// These functions insert braille into a document.

export function insertBraille(node, dots) {
  node.innerText = convertCells(dots);
}

export function insertBrailleLines(node, lines) {
  if (!lines.length)
  return;
  let brailleLines = "";
  for (let i = 0; i < lines.length; ++i) {
  brailleLines += convertCells(lines[i]);
  if (i < lines.length - 1)
    brailleLines += "\n";
  }
  node.innerHTML = `<pre>${brailleLines}</pre>`;
}

export function insertInteractiveBrailleRegion(container, lines, eventListener) {
  const region = document.createElement("div");
  region.setAttribute("role", "textbox");
  region.setAttribute("contenteditable", "true");
  document.addEventListener("selectionchange", () => {
    const selection = document.getSelection();
    // Only respond to events from the current interactive region.
    if (region !== selection.anchorNode.parentNode.parentNode) {
    return;
    }
    let offset = selection.anchorOffset;
    eventListener(offset, region, selection);
  });
  insertBrailleLines(region, lines);

  // clear container, and insert new braille string
  while (container.firstChild) {
    container.firstChild.remove();
  }
  container.appendChild(region);
}
