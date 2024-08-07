/* interface Test {
  start: number;
  end: number;
  name: string;
}*/

let tests = JSON.parse(localStorage.getItem("tests")) || {};
for (let asdf in tests) {
  let t = tests[asdf];
  t.start = new Date(Date.parse(t.start));
  t.end = new Date(Date.parse(t.end));
}
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
  testTable.innerHTML = "";
  if (!tests) return;
  sortMethod = method;
  sortFunc = sortMethods[sortMethod];
  let arrTests = [];
  for (let asdf in tests) {
    arrTests.push(tests[asdf]);
    arrTests.at(-1).id = asdf;
  }
  arrTests.sort(sortFunc);
  arrTests.forEach(t => {
    let tr = document.createElement("tr");
    let start = new Date(Date.parse(t.start)),
      end = new Date(Date.parse(t.end));
    tr.innerHTML = `<td colspan="2">${t.name}</td><td>${start.toLocaleString()}</td><td>${end.toLocaleString()}</td>`;
    tr.addEventListener("click", () => {
      //window.location.href = `./clock.html?start-time=${+start}&finish-time=${+end}`;
      window.location.href = `./test.html?id=${t.id}`;
    })
    testTable.append(tr);
  })
}
updateTestTable();

document.getElementById('toggle-add-btn').addEventListener('click', togglePopup);
document.querySelector("#close").addEventListener('click', togglePopup);

addBtn.addEventListener("click", () => {
  function addError(elem, msg) {
    let err = document.createElement("div");
    err.classList.add("err-inline");
    err.innerHTML = msg;
    elem.append(err);
    elem.addEventListener("click", function temp() {
      err.remove();
      elem.removeEventListener("click", temp);
    })
  }
  let test = {
    name: document.getElementById("test-name").value,
    start: new Date(document.getElementById("test-start").value),
    end: new Date(document.getElementById("test-end").value),
    desc: document.getElementById("test-desc").value
  }
  let id = +new Date();
  let valid = true;
  for (let e of document.querySelectorAll(".err-inline")) e.remove();
  /*
  if (test.name.length < 1) {
    valid = false;
    addError(document.getElementById("test-name").parentElement, "考试名称不能为空");
  } if (test.name.length > 150) {
    valid = false;
    addError(document.getElementById("test-name").parentElement, "考试名称不能超过150个字符");
  } if (test.start < new Date()) {
    valid = false;
    addError(document.getElementById("test-start").parentElement, "考试开始时间不能小于当前时间");
  } if (test.start > test.end) {
    valid = false;
    addError(document.getElementById("test-end").parentElement, "考试开始时间不能大于考试结束时间")
  }*/
  if (test.name.length < 1 || test.name.length > 150) {
    valid = false;
    addError(document.getElementById("test-name").parentElement, "考试名称无效！");
  } if (isNaN(+test.start) || test.start < new Date()) {
    valid = false;
    addError(document.getElementById("test-start").parentElement, "考试开始时间无效！");
  } if (isNaN(+test.end) || test.start > test.end) {
    valid = false;
    addError(document.getElementById("test-end").parentElement, "考试结束时间无效！")
  }
  if (valid) {
    tests[id] = test;
    localStorage.tests = JSON.stringify(tests);
    updateTestTable();
    togglePopup();
  }
})

floatBtn.addEventListener("click", () => {
  if (['', 'none'].includes(sortMenu.style.display)) {
    sortMenu.style.display = "block";
    setTimeout(() => {
      sortMenu.style.opacity = 1;
      sortMenu.style.transform = "scale(1)";
    }
    );
    mask.style.display = "block";
    mask.backgroundColor = "opaque";
    mask.addEventListener("click", function temp() {
      sortMenu.style.opacity = 0;
      sortMenu.style.transform = "scale(0)";
      setTimeout(() => sortMenu.style.display = "none", 150);
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