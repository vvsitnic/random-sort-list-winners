const insertUrlForm = document.getElementById(
  "url-input-form"
) as HTMLInputElement;
const tableOpen = document.getElementById("table-open") as HTMLTableElement;
const shuffleButton = document.getElementById("shuffle") as HTMLButtonElement;

let tableDataOpen: [number, string][] = [];
let playersToHighlite: string[] = [];

// =========EVENTS=========
insertUrlForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputElement = document.getElementById(
    "url-insert"
  ) as HTMLInputElement;
  const url = inputElement.value;

  const response = await fetch(`/.netlify/functions/fetch-dom?url=${url}`).then(
    (response) => response.json()
  );

  const parcer = new DOMParser();
  const doc = parcer.parseFromString(response.message, "text/html");
  const tableHtmlElement = doc.querySelector("table") as HTMLTableElement;

  extractTableData(tableHtmlElement);
  updateTableOpen(tableDataOpen);
  playersToHighlite = [];
});

shuffleButton.addEventListener("click", (e) => {
  updateTableOpen(tableDataOpen, "shuffle");
  setPlayerToHighlite(playersToHighlite);
});

tableOpen.addEventListener("click", (e) => {
  const el = e.target as HTMLElement;
  const rank = el.closest("tr")?.dataset.rank;

  if (!rank) return;
  const activeIndex = playersToHighlite.findIndex((pl) => pl === rank);
  if (activeIndex === -1) {
    playersToHighlite.push(rank);
  } else {
    playersToHighlite.splice(activeIndex, 1);
  }

  setPlayerToHighlite(playersToHighlite);
});

// =========EXTRACT TABLE FROM DOM=========
function extractTableData(table: HTMLTableElement) {
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

function setPlayerToHighlite(pls: string[] = []) {
  const tableRows = Array.from(tableOpen.rows).slice(1);

  tableRows.forEach((row) => {
    pls.includes(row.dataset.rank!)
      ? row.classList.add("highlite")
      : row.classList.remove("highlite");
  });
}
