//import VueDevtools from 'nativescript-vue-devtools'
import Vue from "nativescript-vue";
import { isAndroid, isIOS } from 'tns-core-modules/platform';

//Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

//Vue.use(VueDevtools, {host: '192.168.0.21'})


import * as firebase from "nativescript-plugin-firebase";

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

Vue.prototype.$isAndroid = isAndroid;
Vue.prototype.$isIOS = isIOS;

new Vue({
    render: h => h('frame', [h(AppRoot)]),
    store: store,
    mounted() {
        firebase.init({
            showNotifications: true,
            showNotificationsWhenInForeground: true,

            onPushTokenReceivedCallback: (token) => {
                console.log('[Firebase] onPushTokenReceivedCallback:', { token });
            },

            onMessageReceivedCallback: (message) => {
                console.log('[Firebase] onMessageReceivedCallback:', { message });
            }
        }).then(
            instance => {
                console.log("firebase.init done");
            },
            error => {
                console.log(`firebase.init error: ${error}`);
            }
        );
    }
}).$start();
