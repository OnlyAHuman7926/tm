/* interface Test {
  start: number;
  end: number;
  name: string;
}*/

let tests = JSON.parse(localStorage.getItem("tests")) || [];
let testTable = document.querySelector("tbody");
let sortMethod = (t1, t2) => t1.start - t2.start;


let popup = document.querySelector("#popup");
let addBtn = document.querySelector("#add-btn");
let mask = document.querySelector(".mask");

function togglePopup() {
  let isOff = mask.style.display == "none" || mask.style.display == '';
  if (isOff) {
    mask.style.display = "block";
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.opacity = mask.style.opacity = 1;
    })    // 这里是为了使opacity动画显示

  } else {
    mask.style.opacity = popup.style.opacity = 0;
    setTimeout(() => {
      mask.style.display = popup.style.display = "none";
    }, 150)
  }
}
function updateTestTable(f = sortMethod) {
  sortMethod = f;
  tests.sort(sortMethod);
  testTable.innerHTML = "";
  tests.forEach(t => {
    let tr = document.createElement("tr");
    let start = new Date(Date.parse(t.start)),
      end = new Date(Date.parse(t.end));
    tr.innerHTML = `<td colspan="2">${t.name}</td><td>${start.toLocaleString()}</td><td>${end.toLocaleString()}</td>`;
    testTable.append(tr);
  })
}
updateTestTable();

document.getElementById('toggle-add-btn').addEventListener('click', togglePopup);
document.querySelector("#close").addEventListener('click', togglePopup);

addBtn.addEventListener("click", () => {
  let test = {
    name: document.getElementById("test-name").value,
    start: new Date(document.getElementById("test-start").value),
    end: new Date(document.getElementById("test-end").value),
    desc: document.getElementById("test-desc").value
  }
  tests.push(test);
  localStorage.tests = JSON.stringify(tests);
  updateTestTable();
  togglePopup();
})