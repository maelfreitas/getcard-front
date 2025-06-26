import './assets/main.css'
import 'vue-advanced-cropper/dist/style.css'

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
