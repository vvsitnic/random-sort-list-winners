const tableOpen = document.getElementById("table-open") as HTMLTableElement;
const shuffleButton = document.getElementById("shuffle") as HTMLButtonElement;
const selectFileButton = document.getElementById(
  "select-file-btn"
) as HTMLButtonElement;

let tableDataOpen: [number, string][] = [];
let playersToHighlight: string[] = [];

// Select file and extract html
selectFileButton.addEventListener("click", async () => {
  const pickerOpts = {
    multiple: false,
    types: [
      {
        description: "HTML Files",
        accept: {
          "text/html": [".html"],
        },
      },
    ],
  } as OpenFilePickerOptions;

  const text = await window
    .showOpenFilePicker(pickerOpts)
    .then(([fileHandle]) => fileHandle.getFile())
    .then((file) => file.text());

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const tableHtmlElement = doc.querySelector("table") as HTMLTableElement;

  if (!tableHtmlElement) {
    console.error("No table found!!!");
    return;
  }

  extractTableData(tableHtmlElement);
  updateTableOpen(tableDataOpen);
  playersToHighlight = [];
});

// suffle winners and update visuals
shuffleButton.addEventListener("click", (e) => {
  updateTableOpen(tableDataOpen, "shuffle");
  updateHighlightedPlayers(playersToHighlight);
});

// handle highliting winners
tableOpen.addEventListener("click", (e) => {
  // get pressed row
  const el = e.target as HTMLElement;
  const rank = el.closest("tr")?.dataset.rank;

  if (!rank) return;
  const activeIndex = playersToHighlight.findIndex((pl) => pl === rank);
  if (activeIndex === -1) {
    playersToHighlight.push(rank);
  } else {
    playersToHighlight.splice(activeIndex, 1);
  }

  updateHighlightedPlayers(playersToHighlight);
});

// extract data from table html element
function extractTableData(table: HTMLTableElement) {
  tableDataOpen = [];
  const rows = Array.from(table.rows);

  for (const row of rows) {
    const cells = Array.from(row.cells);
    if (
      cells.length >= 2 &&
      cells[0].tagName.toLowerCase() === "td" &&
      cells[1].tagName.toLowerCase() === "td"
    ) {
      tableDataOpen.push([
        +cells[0].textContent!.trim(),
        cells[1].textContent!.trim(),
      ]);
    }
  }
}

function updateTableOpen(
  tableData: [number, string][],
  type: "shuffle" | "normal" = "normal"
) {
  if (tableData.length === 0) return;

  document.querySelector(".table-container")!.classList.remove("hidden");
  if (type === "shuffle") shuffle(tableDataOpen);

  tableOpen.innerHTML = `
      <tr>
      <th>No</th>
      <th>Rank</th>
      <th>Name</th>
      </tr>
      ${tableDataOpen
        .map(
          (val, i) =>
            `<tr data-rank=${val[0]}><td>${i + 1}.</td><td>${val[0]}</td><td>${
              val[1]
            }</td></tr>`
        )
        .join("")}
    `;
}

// shuffle array
function shuffle(array: [number, string][]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

// func to highlight players based on the arr
function updateHighlightedPlayers(pls: string[] = []) {
  const tableRows = Array.from(tableOpen.rows).slice(1);

  tableRows.forEach((row) => {
    pls.includes(row.dataset.rank!)
      ? row.classList.add("highlight")
      : row.classList.remove("highlight");
  });
}
