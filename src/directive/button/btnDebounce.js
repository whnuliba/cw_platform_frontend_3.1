import Vue from 'vue'

const debounce = Vue.directive('debounce', {
  inserted: function (el, binding) {
      el.addEventListener('click', () => {
          if (!el.disabled) {
              el.classList.add('is-disabled')
              el.disabled = true
              setTimeout(() => {
                  el.classList.remove('is-disabled')
                  el.disabled = false
              }, 2000)
          }
      })
  }
});

export default debounce; 