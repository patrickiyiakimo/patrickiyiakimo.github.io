const display = document.getElementById("inp");

function appendToDisplay(input) {
  display.value += input;
}

function cls() {
  display.value = ""
}

function exe() {
  try {
    display.value = eval(display.value)
  } catch (error) {
    display.value = "syntax error"
  }
}

function cancel() {
  display.value = display.value.substr(0, display.value.length - 1)
}