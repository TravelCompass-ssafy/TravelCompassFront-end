import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import 'swiper/swiper-bundle.css';
import { register } from 'swiper/element/bundle';
import { BootstrapVue3 } from 'bootstrap-vue-3';

import App from './App.vue';
import router from './router';

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import "bootstrap";

register();

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(BootstrapVue3);

router.isReady().then(() => {
    app.mount("#app");
});
