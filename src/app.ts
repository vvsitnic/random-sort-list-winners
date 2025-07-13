const insertUrlForm = document.getElementById("url-input-form");
const table = document.getElementById("table");
const shuffleButton = document.getElementById("shuffle");

interface TableData {
  [key: number]: string;
}

let tableData = new Map<number, string>();

insertUrlForm!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputElement = document.getElementById(
    "url-insert"
  ) as HTMLInputElement;
  const url = inputElement.value;

  const htmlObj = await fetch("/.netlify/functions/fetch-dom?url=" + url).then(
    (response) => response.json()
  );

  const parcer = new DOMParser();
  const doc = parcer.parseFromString(htmlObj.message, "text/html");

  const tableHtmlElement = doc.querySelector("table");
  tableData = extractTableData(tableHtmlElement) as Map<number, string>;
  renderTable(tableData);
});

table!.addEventListener("click", (e) => {
  const el = e.target as HTMLElement;
  const rank = el.closest("tr")?.dataset.rank;
  if (rank) {
    tableData.delete(+rank);
    renderTable(tableData);
  }
});

shuffleButton!.addEventListener("click", (e) => {
  renderTable(tableData, "shuffle");
});

function extractTableData(table: HTMLTableElement | null) {
  if (table === null) return {};

  const data = new Map<number, string>();

  const rows = Array.from(table.rows);

  for (const row of rows) {
    const cells = Array.from(row.cells);
    if (
      cells.length >= 2 &&
      cells[0].tagName.toLowerCase() === "td" &&
      cells[1].tagName.toLowerCase() === "td"
    ) {
      data.set(+cells[0].textContent!.trim(), cells[1].textContent!.trim());
    }
  }

  return data;
}

function renderTable(
  tableData: Map<number, string>,
  type: "shuffle" | "normal" = "normal"
) {
  if (!tableData) return;

  document.getElementById("shuffle")!.classList.remove("hidden");
  document.querySelector(".table-container")!.classList.remove("hidden");

  const dataArr = Array.from(tableData);
  if (type === "shuffle") shuffle(dataArr);

  table!.innerHTML = `
      <tr>
      <th>Rank</th>
      <th>Name</th>
      </tr>
      ${dataArr
        .map(
          (val) =>
            `<tr data-rank=${val[0]}><td>${val[0]}</td><td>${val[1]}</td></tr>`
        )
        .join("")}
    `;
}

function shuffle(array: [number, string][]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
