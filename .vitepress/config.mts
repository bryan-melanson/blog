import { defineConfig } from "vitepress";
import mathjax3 from "markdown-it-mathjax3";
import { withMermaid } from "vitepress-plugin-mermaid";
import markdownItAttrs from 'markdown-it-attrs'
import markdownItContainer from 'markdown-it-container'

const customElements = ["mjx-container"];

// Music section
const music = {
	text: "Music",
	items: [
		{
			text: "Albums",
			collapsible: true,
			items: [
				{
					text: "Errand Boy - Bachelor of Commerce (2005)",
					link: "/music/bachelor-of-commerce",
				},
				{ text: "Errand Boy - Errand Boy (2007)", link: "/music/errand-boy" },
				{
					text: "Errand Boy - At the 24 Hr Art Marathon (2008)",
					link: "/music/art-marathon",
				},
				{
					text: "Errand Boy - Cape Disappointment (2009)",
					link: "/music/cape-disappointment",
				},
				{
					text: "Veneers - Similar Stories (2011)",
					link: "/music/veneers-similar-stories",
				},
			],
		},
	],
};

// Study Guides section
const guides = {
	text: "Study Guides",
	items: [
		{
			text: "Engineering",
			collapsible: true,
			items: [
				{ text: "Electronic Circuits", link: "/study-guides/circuits" },
				{ text: "Control Systems", link: "/study-guides/control-systems" },
				{
					text: "Probability & Random Processes",
					link: "/study-guides/probability",
				},
				{ text: "Digital Systems", link: "/study-guides/digital-systems" },
			],
		},
		{
			text: "Programming",
			collapsible: true,
			items: [
				{ text: "Data Structures", link: "/study-guides/data-structures" },
			],
		},
		{
			text: "Languages",
			collapsible: true,
			items: [
				{ text: "Lua", link: "/study-guides/lua" },
				{ text: "Rust", link: "/study-guides/rust" },
				{ text: "Make", link: "/study-guides/make" },
			],
		},
		{
			text: "Communication Protocols",
			collapsible: true,
			items: [
				{
					text: "CAN",
					collapsible: true,
					link: "/study-guides/protocol-can",
					items: [
						{ text: "CAN Standard", link: "/study-guides/protocol-can" },
						{ text: "CAN-ISOTP", link: "/study-guides/protocol-can-isotp" },
					],
				},
				{
					text: "BLE",
					collapsible: true,
					link: "/study-guides/protocol-ble-gap",
					items: [
						{ text: "BLE GAP", link: "/study-guides/protocol-ble-gap" },
						{ text: "BLE GATT", link: "/study-guides/protocol-ble-gatt" },
					],
				},
				{ text: "OneWire", link: "/study-guides/protocol-onewire" },
			],
		},
	],
};

const all = {
	items: [...guides.items, ...music.items],
};

export default withMermaid(
	defineConfig({
		base: "/blog/",
		srcDir: "./src",

		markdown: {
			toc: { level: [1, 2, 3] },
			config: (md) => {
				md.use(mathjax3);
				md.use(markdownItAttrs);
				md.use(markdownItContainer, 'div');
			},
		},

		vue: {
			template: {
				compilerOptions: {
					isCustomElement: (tag) => customElements.includes(tag),
				},
			},
		},

		head: [["link", { rel: "icon", href: "./favicon.ico" }]],

		title: "Bryan Melanson",
		description: "A young curmudgeon",

		themeConfig: {
			nav: [
				{ text: "Home", link: "/" },
				{ text: "Articles", link: "/articles" },
				guides,
				music,
				{ text: "CV", link: "/resume" },
			],

			search: {
				provider: "local",
			},

			sidebar: {
				"/music/": music,
				"/study-guides/": guides,
				"/resume/": all,
			},

			socialLinks: [
				{ icon: "github", link: "https://github.com/bryan-melanson" },
				{ icon: "linkedin", link: "https://linkedin.com/in/bryanmelanson" },
			],
		},

		mermaid: {
			theme: "default", // or 'dark'
		},
		mermaidPlugin: {
			class: "mermaid my-class",
		},
	}),
);
