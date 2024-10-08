const currentUrl = new URL(window.location.href);
let test = JSON.parse(localStorage.getItem("tests"))[currentUrl.searchParams.get("id")];

let startingTime = Date.parse(test.start),
  endingTime = Date.parse(test.end);
let ststr = parseTimeString(startingTime),
  etstr = parseTimeString(endingTime);
document.getElementById("time-start").innerHTML = ststr.slice(0, ststr.indexOf(":", ststr.indexOf(":") + 1));
document.getElementById("time-end").innerHTML = etstr.slice(0, etstr.indexOf(":", etstr.indexOf(":") + 1));
startingTime = new Date(+startingTime);
endingTime = new Date(+endingTime);
const difference = endingTime - startingTime;
const a = {
  hour: endingTime.getHours(),
  min: endingTime.getMinutes(),
  sec: endingTime.getSeconds(),
  milsec: endingTime.getMilliseconds()
};

let now;
let confettiDone = false;

const digitalDisp = document.getElementById("digital-disp");
const titleDisp = document.getElementById("title");
titleDisp.innerHTML = test.name;
const timeLeftDisplay = document.getElementById("time-left");
const clock = document.getElementById("clock");
const ctx = clock.getContext("2d");
//clock.width = clock.height = Math.min(window.innerWidth, window.innerHeight) / 2;
clock.width = clock.height = 300;

requestAnimationFrame(function f() {
  now = new Date();
  setTime(now);

  let difference = startingTime - now;
  if (difference < 0) {
    difference = endingTime - now;
    setDifference(difference, true);
  } else {
    setDifference(difference, false);
  }

  requestAnimationFrame(f);
})

function setTime(time) {
  let hour = time.getHours(),
    min = time.getMinutes(),
    sec = time.getSeconds(),
    milsec = time.getMilliseconds();
  digitalDisp.innerHTML = parseTime(hour, min, sec, milsec);

  ctx.clearRect(0, 0, 300, 300);
  ctx.lineWidth = 1;
  ctx.lineCap = "square";
  // draw clock border
  ctx.beginPath();
  ctx.arc(150, 150, 150, 0, Math.PI * 2);

  // draw clock ticks
  for (let i = 0; i < 60; i++) {
    let angle = Math.PI / 30 * i;
    let vector = [Math.cos(angle), Math.sin(angle)];
    let length = 10;
    if (i % 5 == 0) length = 20;
    ctx.moveTo(vector[0] * 140 + 150, vector[1] * 140 + 150);
    ctx.lineTo(vector[0] * (140 - length) + 150, vector[1] * (140 - length) + 150);
  }
  ctx.stroke();

  // draw clock hands
  function drawHand(portion, length, thickness = 1) {
    let angle = 2 * Math.PI * portion / 60 - Math.PI / 2;
    let vec = [Math.cos(angle), Math.sin(angle)]
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(vec[0] * length + 150, vec[1] * length + 150)
    ctx.stroke();
  }

  // ending time
  ctx.strokeStyle = "#f0f0f0";
  //drawHand(a.sec + a.milsec / 1000, 115);
  //drawHand(a.min + a.sec / 60 + milsec / 60000, 90, 3);
  drawHand((a.hour + (a.min + a.sec / 60 + a.milsec / 60000) / 60) * 5, 75, 5);

  // now
  ctx.strokeStyle = "black";
  drawHand(sec + milsec / 1000, 115);
  drawHand(min + sec / 60 + milsec / 60000, 90, 3);
  drawHand((hour + (min + sec / 60 + milsec / 60000) / 60) * 5, 75, 5);
  // there's 12 hours each round

}
function setDifference(d, inTest) {
  document.querySelector(".valuebar").style.height =
    Math.min(100 - d / difference * 100, 100) + '%';
  let showMs = false;
  let radius = 5;
  if (d < 600000 && d > 0 && inTest) {
    timeLeftDisplay.style.color = "red";
    let thing = document.getElementsByClassName('wrap')[0];
    let top = document.querySelector('.top');
    let clock = document.querySelector('.clock');
    //    document.getElementsByClassName("bottom")[0].style.animation = "0.2s linear 0s infinite normal none running vibrate";
    let angle = Math.random() * 2 * Math.PI;
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    let rotate = Math.random() * 2 - 1;
    thing.style.transform = thing.style.mozTransform =
      `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    top.style.transform = top.style.mozTransform =
      `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    clock.style.transform = clock.style.mozTransform =
      `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    showMs = true;
    document.querySelector(".smoke-img").style.opacity = -d / 1e6 + 1;
  }
  if (d < 0) {
    timeLeftDisplay.innerHTML = window.sl["test-end"];
    timeLeftDisplay.style.color = "red";
    if (!confettiDone) {
      confettiDone = true;
      confetti();
      setInterval(confetti, 5000);
    }
    let thing = document.getElementsByClassName('wrap')[0];
    thing.style.transform = thing.style.mozTransform = null;
    showMs = true;
    document.querySelector(".smoke-img").style.opacity = 0;
  } else {
    if (inTest) {
      timeLeftDisplay.innerHTML = window.sl["time-remaining"].format(parseTimeFromNumber(d, showMs));
    } else {
      timeLeftDisplay.innerHTML = window.sl["test-not-start"];
    }
  }
}

function parseTimeString(d, showMs = false) {
  let date = new Date(+d);
  let hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds(),
    milsec = date.getMilliseconds();
  return parseTime(hour, min, sec, milsec, showMs);
}
function parseTimeFromNumber(n, showMs = false) {
  let d = new Date(n);
  let hour = Math.floor((n % 86400000) / 3600000),
    min = Math.floor((n % 3600000) / 60000),
    sec = Math.floor((n % 60000) / 1000),
    milsec = n % 1000;
  /* let hour = d.getHours(),
    min = d.getMinutes(),
    sec = d.getSeconds(),
    milsec = d.getMilliseconds(); */
  return parseTime(hour, min, sec, milsec, showMs);

}
function parseTime(h, m, s, ms, showMs = false) {
  let hstring = h > 0 ? h + ":" : "";
  //let mstring = m > 0 ? m < 10 && hstring != "" ? "0" + m + ":" : m + ":" : "";
  let mstring = "";
  if (hstring && m < 10) mstring += "0";
  if (m > 0 || mstring != '') {
    mstring += m;
    mstring += ':';
  }

  let sstring = s < 10 && mstring != "" ? "0" + s : s;

  let msstring = "." + (ms < 10 ? "00" + ms : ms < 100 ? "0" + ms : ms);
  return hstring + mstring + sstring + (showMs ? msstring : "");
}
function r(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

