import{d as c,u as p,X as _,o as u,b as h,l,O as f,c as v,H as y,s as r,a3 as g,a4 as b,a5 as w,a6 as x,a7 as A,a8 as P,a9 as M,aa as k,ab as E,ac as T,V as $,j as V,y as B,ad as C,ae as D,af as L,ag as R}from"./chunks/framework.9e9a7fd0.js";import{t as m,V as j}from"./chunks/theme.30d00336.js";const O=c({__name:"MyLayout",setup(a){const{isDark:e}=p(),t=()=>"startViewTransition"in document&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches;return _("toggle-appearance",async({clientX:n,clientY:o})=>{if(!t()){e.value=!e.value;return}const i=[`circle(0px at ${n}px ${o}px)`,`circle(${Math.hypot(Math.max(n,innerWidth-n),Math.max(o,innerHeight-o))}px at ${n}px ${o}px)`];await document.startViewTransition(async()=>{e.value=!e.value,await f()}).ready,document.documentElement.animate({clipPath:e.value?i.reverse():i},{duration:3e3,easing:"ease-in",pseudoElement:`::view-transition-${e.value?"old":"new"}(root)`})}),(n,o)=>(u(),h(l(m).Layout))}});const S={class:"center-horizontal"},F={__name:"BryanMelanson",setup(a){const e=[{avatar:"https://avatars.githubusercontent.com/u/46350945?v=4",name:"Bryan Melanson",title:"Embedded Developer",links:[{icon:"github",link:"https://github.com/bryan-melanson"},{icon:"linkedin",link:"https://linkedin.com/in/bryanmelanson"}]}];return(t,n)=>(u(),v("div",S,[y(l(j),{size:"medium",members:e})]))}};const H={...m,Layout:O,enhanceApp({app:a,router:e,siteData:t}){a.component("BryanMelanson",F)}};function d(a){if(a.extends){const e=d(a.extends);return{...e,...a,async enhanceApp(t){e.enhanceApp&&await e.enhanceApp(t),a.enhanceApp&&await a.enhanceApp(t)}}}return a}const s=d(H),z=c({name:"VitePressApp",setup(){const{site:a}=p();return V(()=>{B(()=>{document.documentElement.lang=a.value.lang,document.documentElement.dir=a.value.dir})}),C(),D(),L(),s.setup&&s.setup(),()=>R(s.Layout)}});async function I(){const a=X(),e=N();e.provide(b,a);const t=w(a.route);return e.provide(x,t),e.component("Content",A),e.component("ClientOnly",P),Object.defineProperties(e.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:e,router:a,siteData:M}),{app:e,router:a,data:t}}function N(){return k(z)}function X(){let a=r,e;return E(t=>{let n=T(t);return n?(a&&(e=n),(a||e===n)&&(n=n.replace(/\.js$/,".lean.js")),r&&(a=!1),$(()=>import(n),[])):null},s.NotFound)}r&&I().then(({app:a,router:e,data:t})=>{e.go().then(()=>{g(e.route,t.site),a.mount("#app")})});export{I as createApp};