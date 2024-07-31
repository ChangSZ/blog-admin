import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import store from './store'

Vue.use(iView);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        const token = store.getters['auth/token'];
        if (token) {
            store.dispatch('auth/setRefreshTimer');
        }
    }
}).$mount('#app');

