const insertUrlForm = document.getElementById(
  "url-input-form"
) as HTMLInputElement;
const tableOpen = document.getElementById("table-open") as HTMLTableElement;
const shuffleButton = document.getElementById("shuffle") as HTMLButtonElement;
const pasteButton = document.getElementById("paste") as HTMLButtonElement;

let tableDataOpen: [number, string][] = [];
let playersToHighlight: string[] = [];

// paste clipboard text into input
pasteButton.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) return;

    const inputElement = document.getElementById(
      "url-insert"
    ) as HTMLInputElement;
    inputElement.value = text;
  } catch (error) {
    console.error("Clipboard access failed:", error);
  }
});

// handle url submission
insertUrlForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    // get input url and polish it
    const inputElement = document.getElementById(
      "url-insert"
    ) as HTMLInputElement;

    let url = inputElement.value.trim();
    if (!url.startsWith("https://practiscore.com/results")) {
      throw new Error("Wrong url!");
    }
    url = (url + "?").split("?")[0] + "?page=overall-combined";

    // fetch website html
    const response = await fetch(`/.netlify/functions/fetch-dom?url=${url}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // extract table element from the html doc
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.message, "text/html");
    const tableHtmlElement = doc.querySelector("table") as HTMLTableElement;

    if (!tableHtmlElement) throw new Error("No table found.");

    // update visual
    extractTableData(tableHtmlElement);
    updateTableOpen(tableDataOpen);
    playersToHighlight = [];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
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
