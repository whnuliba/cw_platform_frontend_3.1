export default function(el) {
  var input = el
  input.onkeyup = function(e) {
    // eslint-disable-next-line eqeqeq
    if (e.target.value.length == 1) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '')
    } else {
      e.target.value = e.target.value.replace(/[^\d]/g, '')
    }
  }
}
