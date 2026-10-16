(function () {
  var MIN_TIME = 2400; 
  var start = Date.now();
  var splash = document.getElementById("splash");
  var msg = document.getElementById("splash-msg");
  if (!splash) return;

  var messages = [
    "धैर्य गर्नु न है",
    "चिया खाँदै पर्खनुस्",
    "रिपोर्ट आउँदैछ",
  ];
  var i = 0;
  var timer = setInterval(function () {
    msg.classList.add("swap");
    setTimeout(function () {
      i = (i + 1) % messages.length;
      msg.textContent = messages[i];
      msg.classList.remove("swap");
    }, 300);
  }, 1100);

  function hide() {
    var wait = Math.max(0, MIN_TIME - (Date.now() - start));
    setTimeout(function () {
      clearInterval(timer);
      splash.classList.add("hide");
      setTimeout(function () { splash.remove(); }, 650);
    }, wait);
  }

  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide);
})();