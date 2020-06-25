//import VueDevtools from 'nativescript-vue-devtools'
import Vue from "nativescript-vue";

//Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

//Vue.use(VueDevtools, {host: '192.168.0.21'})

import RadListView from 'nativescript-ui-listview/vue';
Vue.use(RadListView);

import moment from 'moment';
moment.locale('fr');

import NavPlugin from "./plugins/nav"
Vue.use(NavPlugin);

import "./filters";

import store from "./store";

import AppRoot from "./components/AppRoot";

Vue.config.silent = false

Vue.prototype.$store = store

new Vue({
    render: h => h('frame', [h(AppRoot)]),
    store: store
}).$start();
