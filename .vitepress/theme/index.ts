// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import MyLayout from './components/MyLayout.vue'
import BryanMelanson from './components/BryanMelanson.vue'
import './style.css'
import './styles/mathjax3.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }) {
    app.component('BryanMelanson', BryanMelanson)
  }
}
