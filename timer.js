function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  return {
    'total': t,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function zeroClock() {
  var clock = document.getElementById("clockdiv");
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  hoursSpan.setAttribute("value", '00');
  minutesSpan.setAttribute("value", '00');
  secondsSpan.setAttribute("value", '00');
}

function stopClockAndUpdate(runningInterval) {
  document.getElementById("startBtn").innerHTML = "Start Timer";
  document.body.setAttribute("class", "colorchange pause-colorchange");
  zeroClock();
  clearInterval(runningInterval);
}

function getTimeFormValues() {
  var timeFormElements = document.forms["timeForm"].getElementsByTagName("input");
  return {
    'hours': parseInt(timeFormElements.hours.value),
    'minutes': parseInt(timeFormElements.minutes.value),
    'seconds': parseInt(timeFormElements.seconds.value)
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  var deadline = new Date();
  var totalTime = 0;

  zeroClock();

  var startTimer = null;
  var startbtn = document.getElementById("startBtn");

  function updateClock(endTime, options) {
    var t = getTimeRemaining(endTime);

    var clock = document.getElementById("clockdiv");
    clock.querySelector('.hours').value = ('0' + t.hours).slice(-2);
    clock.querySelector('.minutes').value = ('0' + t.minutes).slice(-2);
    clock.querySelector('.seconds').value = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      if (options.repeat) {
        // Add an extra second to start from original value.
        deadline = new Date(Date.parse(new Date()) + totalTime + (1000));
      } else {
        stopClockAndUpdate(startTimer);
      }
    }
  }

  startbtn.onclick = function() {
    if (startbtn.innerHTML === "Start Timer") {

      document.body.setAttribute("class", "colorchange");
      startbtn.innerHTML = "Stop Timer";

      var timeFormValues = getTimeFormValues();
      totalTime = (timeFormValues.hours * 60 * 60 * 1000) + (timeFormValues.minutes * 60 * 1000) +
                      ((timeFormValues.seconds) * 1000);
      deadline = new Date(Date.parse(new Date()) + totalTime);

      var repeatBox = document.getElementById("repeat-chk-box");

      startTimer = setInterval(
        function() {
          options = {"repeat": repeatBox.checked};
          updateClock(deadline, options);
        }, 1000);

    } else {
      // Kill Timer
      stopClockAndUpdate(startTimer)
    }
  }
});

// TODO cleanup and validate minutes/strings, also implement lap
