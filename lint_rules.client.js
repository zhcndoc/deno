// deno:file:///home/runner/work/deno/deno/lint_rules.client.ts
var searchbar = document.getElementById("lint-rule-search");
if (searchbar) {
  searchbar.addEventListener("input", (e) => {
    const query = e.currentTarget?.value;
    const allBoxes = document.querySelectorAll(".lint-rule-box");
    for (const box of allBoxes) {
      if (!box.id.includes(query)) {
        box.style.display = "none";
      } else {
        box.style.display = "block";
      }
    }
  });
}
