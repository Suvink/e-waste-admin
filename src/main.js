/* eslint-disable */ 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import NavBar from './components/NavBar.vue'
import { firebaseApp } from './firebase'
import Vuelidate from 'vuelidate'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'


Vue.use(Vuelidate)
Vue.use(Chartkick.use(Chart))

Vue.component('NavBar', NavBar)


let app;
firebaseApp.auth().onAuthStateChanged(user => {
  if(!app){
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')    
  }
})

Vue.config.productionTip = false

