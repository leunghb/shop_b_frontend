// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import qs from 'qs'
import './utils/httpApi'
import 'element-ui/lib/theme-chalk/index.css';
import {MessageBox, Message, Select, Option, Table, TableColumn, Button, Input, Tag, Pagination} from 'element-ui';

Vue.use(Select).use(Option).use(Table).use(TableColumn).use(Button).use(Input).use(Tag).use(Pagination)
Vue.prototype.$MessageBox = MessageBox;
Vue.prototype.$Message = Message;

Vue.prototype.$qs = qs

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    next();
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
