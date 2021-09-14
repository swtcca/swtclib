// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme"
import Mermaid from "./Mermaid.vue"
// import { plugin as VueTypedJs } from 'vue-typed-js'
import VueTypedJs from "./vue3-typed"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("Mermaid", Mermaid)
    app.component("VueTypedJs", VueTypedJs)
  }
}
