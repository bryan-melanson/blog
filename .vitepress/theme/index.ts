// https://vitepress.dev/guide/custom-theme
import DefaultTheme from "vitepress/theme";
import MyLayout from "./components/MyLayout.vue";
import BryanMelanson from "./components/BryanMelanson.vue";
import "./style.css";
import "./styles/mathjax3.css";

import mermaid from "mermaid";
import { onMounted, watch } from "vue";
import { useRoute } from "vitepress";

export default {
	...DefaultTheme,
	Layout: MyLayout,
	enhanceApp({ app, router, siteData }) {
		app.component("BryanMelanson", BryanMelanson);

		// Mermaid logic must run in onMounted() to avoid SSR issues
		onMounted(() => {
			const route = useRoute();

			watch(
				() => route.path,
				() => {
					renderMermaid();
				},
				{ immediate: true },
			);
		});
	},
};

function renderMermaid() {
	const blocks = document.querySelectorAll("pre code.language-mermaid");

	blocks.forEach((block) => {
		const code = block.textContent;
		if (!code) return;

		const container = document.createElement("div");
		container.className = "mermaid";
		container.textContent = code;

		const pre = block.parentElement;
		if (pre?.parentElement) {
			pre.parentElement.replaceChild(container, pre);
		}
	});

	mermaid.initialize({ startOnLoad: false });
	mermaid.init(undefined, ".mermaid");
}
