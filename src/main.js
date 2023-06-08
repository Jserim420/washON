// 라우터설치

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import store from "./store/index.js"

import axios from "axios"

loadFonts()

var app = createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)

app.config.globalProperties.$axios = axios;
app.mount('#app')
