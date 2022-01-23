import Vue from 'vue'
import App from './App.vue'

Vue.prototype.$inputData = []
Vue.prototype.$searchKeyWord = ""
Vue.prototype.$searchDocNumber = -1
Vue.prototype.$labels = ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"]
Vue.prototype.$shownLabels = []
Vue.prototype.$submittedLabels = []

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
