let randomLines = [
  "新的一天，迎接新的考试！",
  "今天的考试你复习了吗？",
  "[Line 3]",
  "[Line 4]",
  "[Line 5]",
]

let name = localStorage.getItem("name") || "阿斯蒂芬";
localStorage.setItem("name", name);

document.getElementById("greetings-title").innerHTML = "欢迎，{0}！".format(name);
document.getElementById("greetings-rand").innerHTML = randomLines[Math.floor(Math.random() * randomLines.length)];