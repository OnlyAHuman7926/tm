let randomLines = [
  "你好，阿斯蒂芬！",
  "你好，阿斯蒂",
  "你好，阿斯蒂芬！",
  "你好，阿斯蒂芬！",
  "你好，阿斯蒂芬！",
]

let name = localStorage.getItem("name") || "阿斯蒂芬";
localStorage.setItem("name", name);

document.getElementById("greetings-title").innerHTML = "欢迎，{0}！".format(name);
document.getElementById("greetings-rand").innerHTML = randomLines[Math.floor(Math.random() * randomLines.length)];