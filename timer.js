/**
 * Returns a json list with the current hours, minutes, and seconds of the timer.
 */
function getClockTime() {
  var timeFormElements = document.forms['timeForm'].getElementsByTagName('input');
  return {
    'hours': parseInt(timeFormElements.hours.value),
    'minutes': parseInt(timeFormElements.minutes.value),
    'seconds': parseInt(timeFormElements.seconds.value)
  }
}

/**
 * Sets the clock time to the given input.
 * @param {Number} hours 
 * @param {Number} minutes 
 * @param {Number} seconds 
 */
function setClockTime(hours, minutes, seconds) {
  document.getElementById('hours').value = hours;
  document.getElementById('minutes').value = minutes;
  document.getElementById('seconds').value = seconds;
}

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
 * Returns true if there is time remaining on the clock.
 * @param {JSON} timeFormValues - A json object of timeform values with hours, minutes, and seconds
 */
function isTimeRemaining(currentClockTime) {
  return !((currentClockTime.hours === 0) && (currentClockTime.minutes === 0) && (currentClockTime.seconds === 0));
}

/**
 * Takes an input field and validates that it has surrounding 0's
 * @param {Element} input - The corresponding input box to be validated
 */
function validateClockInput(input) {
  if (input.value.length === 1) {
    input.value = '0' + input.value;
  } else if (input.value.length === 0) {
    input.value = '00';
  }
}

/**
 * Convert clock time to seconds
 * @param {JSON} clockTime - Clock time in JSON
 */
function clockTimeToSeconds(clockTime) {
  return (clockTime.hours * 60 * 60 * 1000) + (clockTime.minutes * 60 * 1000) + ((clockTime.seconds) * 1000);
}

/**
 * A function that 'zero's' the clock. This involves setting all inputs
 * to 00.
 */
function zeroClock() {
  var clock = document.getElementById('clockdiv');
  clock.querySelector('#hours').value = '00';
  clock.querySelector('#minutes').value = '00';
  clock.querySelector('#seconds').value = '00';
}

document.addEventListener('DOMContentLoaded', function (event) {
  zeroClock();

  // Define timer variables
  var startbtn = document.getElementById('startBtn');
  var clockInterval = null;
  var clockEndTime = new Date();
  var clockStartValues = {
    hours: '00',
    minutes: '00',
    seconds: '00'
  };

  /**
   * This function is within the onPageLoad event listener because it needs access to clockInterval
   * @param {JSON} options 
   */
  function updateClock(options) {
    var timeRemaining = getTimeRemaining(clockEndTime);
    setClockTime(('0' + timeRemaining.hours).slice(-2), ('0' + timeRemaining.minutes).slice(-2), ('0' + timeRemaining.seconds).slice(-2));

    if (timeRemaining.total <= 0) {
      if (options.lap) {
        var lapNum = document.getElementById('lapNumber');
        lapNum.innerHTML = parseInt(lapNum.innerHTML) + 1;
      }
      if (options.repeat) {
        // Add an extra second to start from original value.
        clockEndTime = new Date(Date.parse(new Date()) + clockStartValues + (1000));
      } else {
        clearInterval(clockInterval);
        startbtn.innerHTML = 'Start';
        document.body.setAttribute('class', 'colorchange pause-colorchange');
      }
    }
  }


  /////////////////////////////// Action Handlers ////////////////////////////////

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
      validateClockInput(this);
    }
  }

  startbtn.onclick = function () {

    var currentClockTime = getClockTime();

    if (startbtn.innerHTML === 'Start' && isTimeRemaining(currentClockTime)) {

      document.body.setAttribute('class', 'colorchange');
      startbtn.innerHTML = 'Pause';

      clockStartValues = currentClockTime;
      clockEndTime = new Date(Date.parse(new Date()) + clockTimeToSeconds(clockStartValues));

      clockInterval = setInterval(
        function () {
          var options = {
            'repeat': document.getElementById('repeat-chk-box').checked,
            'lap': document.getElementById('lap-chk-box').checked
          };
          updateClock(options);
        }, 1000);

    } else if (startbtn.innerHTML === 'Pause') {

      clearInterval(clockInterval);
      document.getElementById('startBtn').innerHTML = 'Unpause';
      document.body.setAttribute('class', 'colorchange pause-colorchange');

    } else if (startbtn.innerHTML === 'Unpause') {

      document.body.setAttribute('class', 'colorchange');
      startbtn.innerHTML = 'Pause';

      var timeOnClock = clockTimeToSeconds(currentClockTime);

      if (timeOnClock === 0) {
        timeOnClock = clockTimeToSeconds(clockStartValues) + 1000;
      }

      clockEndTime = new Date(Date.parse(new Date()) + timeOnClock);

      clockInterval = setInterval(function () {
        var options = {
          'repeat': document.getElementById('repeat-chk-box').checked,
          'lap': document.getElementById('lap-chk-box').checked
        };
        updateClock(options);
      }, 1000);

    }
  }

  var resetbtn = document.getElementById('resetBtn');
  resetbtn.onclick = function () {
    clearInterval(clockInterval);
    startbtn.innerHTML = 'Start';
    document.getElementById('lapNumber').innerHTML = 0;
    setClockTime(clockStartValues.hours, clockStartValues.minutes, clockStartValues.seconds);
    document.body.setAttribute('class', 'colorchange pause-colorchange');

    for (var i = 0; i < timerInputs.length; i++) {
      validateClockInput(timerInputs.item(i));
    }
  }

  var clearbtn = document.getElementById('clearBtn');
  clearbtn.onclick = function () {
    clearInterval(clockInterval);
    zeroClock();
    startbtn.innerHTML = 'Start';
    document.getElementById('lapNumber').innerHTML = 0;
    document.getElementById('lapDiv').setAttribute('class', 'hidden');
    document.getElementById('repeat-chk-box').checked = false;
    document.getElementById('lap-chk-box').checked = false;
    document.body.setAttribute('class', 'colorchange pause-colorchange');
  }

  // Toggle display of lapDiv
  var lapDiv = document.getElementById('lap-chk-box');
  lapDiv.onclick = function () {
    if (this.checked) {
      document.getElementById('lapDiv').setAttribute('class', '');
    } else {
      document.getElementById('lapNumber').innerHTML = 0;
      document.getElementById('lapDiv').setAttribute('class', 'hidden');
    }
  }
});