const insertUrlForm = document.getElementById("url-input-form");
const rmPlayersForm = document.getElementById("rm-players-form");

insertUrlForm!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputElement = document.getElementById(
    "url-insert"
  ) as HTMLInputElement;
  const url = inputElement.value;

  // try {
  //   const response = await fetch(url);
  //   if (!response.ok) throw new Error(`An error occured ${response.status}`);

  //   const html = await response.text();
  //   const parcer = new DOMParser();
  //   const doc = parcer.parseFromString(html, "text/html");

  //   const table = doc.querySelector("table");
  //   console.log(table);
  // } catch (err) {
  //   console.error(err);
  // }
});

rmPlayersForm!.addEventListener("submit", (e) => {
  e.preventDefault();
});
