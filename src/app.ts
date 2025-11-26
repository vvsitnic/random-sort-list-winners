const tableOpen = document.getElementById("table-open") as HTMLTableElement;
const shuffleButton = document.getElementById("shuffle") as HTMLButtonElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;

let tableDataOpen: [number, string][] = [];
let playersToHighlight: string[] = [];

// upload csv
fileInput.addEventListener("change", async (e) => {
  const inputElement = e.target as HTMLInputElement;

  if (!inputElement.files || inputElement.files.length == 0) {
    console.error("No file selected!");
    return;
  }

  const text = await inputElement.files[0].text();

  extractTableData(text);
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
function extractTableData(text: string) {
  tableDataOpen = [];
  const rows = text.trim().split("\n");
  const arr = rows.map((row) => row.split(","));
  console.log(arr);
  let a = -1,
    b = -1;
  for (let i = 0; i < arr[0].length; i++) {
    if (arr[0][i] === "Place") {
      a = i;
    }

    if (arr[0][i] === "Last Name") {
      b = i;
    }
  }

  if (a == -1 || b == -1) return;

  for (let i = 1; i < arr.length; i++) {
    tableDataOpen.push([+arr[i][a], arr[i][b + 1] + " " + arr[i][b]]);
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
