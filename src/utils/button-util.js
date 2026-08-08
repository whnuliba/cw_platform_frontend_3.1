import Vue from 'vue';
Vue.directive('ele-show',{
    bind(el, binding, vnode, oldVnode){
       const btns = JSON.parse(sessionStorage.getItem('sys_buttons_code'))  
       const btnCode = binding.value.btnCode
       if(btnCode===undefined)
        {
            return
        }
       if(Array.isArray(btns) && btns.indexOf(btnCode)<0){
           el.setAttribute("class", 'v-ele-show-btn');
       }
    }
})