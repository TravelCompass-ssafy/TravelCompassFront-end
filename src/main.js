import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import 'swiper/swiper-bundle.css';
import { register } from 'swiper/element/bundle';
import { BootstrapVue3 } from 'bootstrap-vue-3';

import App from './App.vue';
import router from './router';
import { useKakao } from 'vue3-kakao-maps/@utils';

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import "bootstrap";

register();

const app = createApp(App);
const pinia = createPinia();
const { VITE_VUE_KAKAOMAP_KEY } = import.meta.env;

pinia.use(piniaPluginPersistedstate);
useKakao(VITE_VUE_KAKAOMAP_KEY);

app.use(pinia);
app.use(router);
app.use(BootstrapVue3);

router.isReady().then(() => {
    app.mount("#app");
});
