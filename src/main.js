import Vue from 'vue'
import App from './App.vue'

Vue.prototype.$inputData = []
Vue.prototype.$searchKeyWord = ""
Vue.prototype.$searchDocNumber = -1
Vue.prototype.$percentageMin = 50
Vue.prototype.$percentageMax = 51
Vue.prototype.$labels = ["National way of life", "Traditional morality", "Law and order", "Civic mindedness", "Multiculturalism"]
Vue.prototype.$shownLabels = []
Vue.prototype.$submittedLabels = []

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
