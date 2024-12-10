import Vue from 'vue';
import App from './app.vue';
import router from './router';
import api from './axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/css/styles.css';


Vue.config.productionTip = false;
Vue.prototype.$http = api; // Adiciona o Axios como uma propriedade global

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
