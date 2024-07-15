/* interface Test {
  start: number;
  end: number;
  name: string;
}*/

let tests = JSON.parse(localStorage.getItem("tests")) || [];
tests.forEach(t => {
  t.start = new Date(Date.parse(t.start));
  t.end = new Date(Date.parse(t.end));
})
let testTable = document.querySelector("tbody");
let sortMethod = "start";


let popup = document.querySelector("#popup");
let addBtn = document.querySelector("#add-btn");
let mask = document.querySelector(".mask");
let sortMenu = document.querySelector("#sort-menu");
let floatBtn = document.querySelector("#toggle-float-btn");

let sortMethods = {
  start: (t1, t2) => t1.start - t2.start,
  end: (t1, t2) => t1.end - t2.end,
  name: (t1, t2) => t1.name.localeCompare(t2.name)
}

function togglePopup() {
  mask.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
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
function updateTestTable(method = sortMethod) {
  sortMethod = method;
  sortFunc = sortMethods[sortMethod];
  tests.sort(sortFunc);
  testTable.innerHTML = "";
  tests.forEach(t => {
    let tr = document.createElement("tr");
    let start = new Date(Date.parse(t.start)),
      end = new Date(Date.parse(t.end));
    tr.innerHTML = `<td colspan="2">${t.name}</td><td>${start.toLocaleString()}</td><td>${end.toLocaleString()}</td>`;
    tr.addEventListener("click", () => {
      window.location.href = `./clock.html?start-time=${+start}&finish-time=${+end}`;
    })
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

floatBtn.addEventListener("click", () => {
  if (!sortMenu.classList.contains('on')) {
    sortMenu.classList.add("on");
    mask.style.display = "block";
    mask.backgroundColor = "opaque";
    mask.addEventListener("click", function temp() {
      sortMenu.classList.remove("on");
      mask.style.display = "none";
      mask.removeEventListener("click", temp);
    })
  }
})

Array.from(sortMenu.children).forEach(e => {
  e.addEventListener("click", () => {
    updateTestTable(e.dataset.val);
    for (let ee of sortMenu.children) {
      if (ee != e) ee.style.backgroundColor = null;
      else ee.style.backgroundColor = "#adf5ff"; // "#dafaff";
    }
    mask.click();
  })
})