// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import qs from 'qs'
import './utils/httpApi'
import 'element-ui/lib/theme-chalk/index.css';
import {
    MessageBox,
    Message,
    Select,
    Option,
    Table,
    TableColumn,
    Button,
    Input,
    Tag,
    Pagination,
    Form,
    FormItem,
    Col,
    Upload,
    Dialog,
    Radio,
    RadioGroup,
    Divider,
    Collapse,
    CollapseItem,
    Popover,
    Checkbox,
    CheckboxGroup
} from 'element-ui';

Vue.use(Select).use(Option).use(Table).use(TableColumn).use(Button).use(Input).use(Tag).use(Pagination).use(Form).use(FormItem).use(Col).use(Upload).use(Dialog).use(Radio).use(RadioGroup).use(Divider).use(Collapse).use(CollapseItem).use(Popover).use(Checkbox).use(CheckboxGroup)
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
    components: { App },
    template: '<App/>'
})
