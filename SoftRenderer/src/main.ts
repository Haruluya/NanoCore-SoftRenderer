import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import NanoCoreUI from 'nanocore-ui'
import router from './router/routers';
import nano_software_renderer_page from "./pages/nano_software_renderer_page.vue"

const app = createApp(App)

app.use(router)

app.use(NanoCoreUI)


app.component(nano_software_renderer_page.name,nano_software_renderer_page)

app.mount('#app')


