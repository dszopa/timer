/**
 * A function that gets the amount of time between the date end time
 * and the current time.
 * @param {Date} endtime - The end time in a Date format.
 */
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

/**
 * A function that "zero's" the clock. This involves setting all inputs
 * to 00.
 */
function zeroClock() {
  var clock = document.getElementById("clockdiv");
  clock.querySelector('#hours').value = '00';
  clock.querySelector('#minutes').value = '00';
  clock.querySelector('#seconds').value = '00';
}

/**
 * Ends the specified interval, updates the button to "Start Timer",
 * pauses color changing, and resets the clock.
 * @param {setInterval} runningInterval - The ongoing interval to stop.
 */
function stopClockAndUpdate(runningInterval) {
  clearInterval(runningInterval);
  document.getElementById("startBtn").innerHTML = "Start Timer";
  document.getElementById('lapNumber').innerHTML = 0;
  document.body.setAttribute("class", "colorchange pause-colorchange");
  zeroClock();
}

/**
 * Returns a json list with the current hours, minutes, and seconds of the timer.
 */
function getTimeFormValues() {
  var timeFormElements = document.forms["timeForm"].getElementsByTagName("input");
  return {
    'hours': parseInt(timeFormElements.hours.value),
    'minutes': parseInt(timeFormElements.minutes.value),
    'seconds': parseInt(timeFormElements.seconds.value)
  }
}

/**
 * Returns true if there is time remaining on the clock.
 * @param {TimeFormValue} timeFormValues - A json object of timeform values iwth hours, minutes, and seconds
 */
function isTimeRemaining(timeFormValues) {
  return !(timeFormValues.hours === 0 && timeFormValues.minutes === 0 && timeFormValues.seconds === 0);
}

/**
 * Takes an input field and validates that it has surrounding 0's
 * @param {Element} input - The corresponding input box to be validated
 */
function validateInput(input) {
  if (input.value.length === 1) {
    input.value = '0' + input.value;
  } else if (input.value.length === 0) {
    input.value = '00';
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  zeroClock();

  // Define timer variables
  var deadline = new Date();
  var totalTime = 0;

  var startTimer = null;
  var startbtn = document.getElementById("startBtn");

  var hoursInput = document.getElementById('hours');
  var minutesInput = document.getElementById('minutes');
  var secondsInput = document.getElementById('seconds');

  // Add actions for onfocus and onblur to each timerInput
  var timerInputs = document.getElementsByClassName('timerInput');
  for (var i = 0; i < timerInputs.length; i++) {
    var input = timerInputs.item(i);
    // Set onfocus to empty the input box
    input.onfocus = function () {
      this.value = '';
    }

    // If shorter than 2, add 0's
    input.onblur = function () {
      validateInput(this);
    }
  }

  // This function is within the onPageLoad event listener because it needs access to startTimer
  function updateClock(endTime, options) {
    var timeRemaining = getTimeRemaining(endTime);
    hoursInput.value = ('0' + timeRemaining.hours).slice(-2);
    minutesInput.value = ('0' + timeRemaining.minutes).slice(-2);
    secondsInput.value = ('0' + timeRemaining.seconds).slice(-2);

    if (timeRemaining.total <= 0) {
      if (options.repeat) {
        if (options.lap) {
          var lapNum = document.getElementById('lapNumber');
          lapNum.innerHTML = parseInt(lapNum.innerHTML) + 1;
        }
        // Add an extra second to start from original value.
        deadline = new Date(Date.parse(new Date()) + totalTime + (1000));
      } else {
        stopClockAndUpdate(startTimer);
      }
    }
  }

  startbtn.onclick = function () {
    var timeFormValues = getTimeFormValues();
    if (startbtn.innerHTML === "Start Timer" && isTimeRemaining(timeFormValues)) {

      document.body.setAttribute("class", "colorchange");
      startbtn.innerHTML = "Stop Timer";

      totalTime = (timeFormValues.hours * 60 * 60 * 1000) + (timeFormValues.minutes * 60 * 1000) +
        ((timeFormValues.seconds) * 1000);
      deadline = new Date(Date.parse(new Date()) + totalTime);

      startTimer = setInterval(
        function () {
          var options = {
            "repeat": document.getElementById("repeat-chk-box").checked,
            "lap": document.getElementById("lap-chk-box").checked
          };
          updateClock(deadline, options);
        }, 1000);
    } else {
      stopClockAndUpdate(startTimer)
    }
  }

  // Toggle display of lapDiv
  document.getElementById('lap-chk-box').onclick = function () {
    if (this.checked) {
      document.getElementById('lapDiv').setAttribute('class', '');
    } else {
      document.getElementById('lapDiv').setAttribute('class', 'hidden');
    }
  }
});