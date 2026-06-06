import { defineConfig } from "vitepress";
import mathjax3 from "markdown-it-mathjax3";
import { withMermaid } from "vitepress-plugin-mermaid";
import markdownItAttrs from "markdown-it-attrs";
import markdownItContainer from "markdown-it-container";

const customElements = ["mjx-container"];

// Comic section
const comic = {
	text: "Comics",
	items: [
		{
			text: "Series",
			collapsible: true,
			items: [
				{ text: "Everybody Cheer Up", link: "/comic/everybody-cheer-up" },
			],
		},
	],
};

// Sound section
const sound = {
	text: "Sound",
	items: [
		{
			text: "Sound Design",
			collapsible: true,
			items: [
				{ text: "OK+Audio", link: "/sound/sound-design" },
			],
		},
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
			text: "Languages",
			collapsible: true,
			items: [{ text: "French", link: "/study-guides/language-french" }],
		},
		{
			text: "Programming",
			collapsible: true,
			items: [
				{ text: "Data Structures", link: "/study-guides/data-structures" },
			],
		},
		{
			text: "Programming Languages",
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

// Articles section
const articles = {
	text: "Articles",
	items: [
		{
			text: "Posts",
			collapsible: true,
			items: [
				{ text: "Maneki Neko USB", link: "/articles/maneki-neko" },
				{ text: "Microcorruption Pt. 9 - Santa Cruz", link: "/articles/microcorruption-09-santacruz" },
				{ text: "Microcorruption Pt. 8 - Johannesburg", link: "/articles/microcorruption-08-johannesburg" },
				{ text: "Microcorruption Pt. 7 - Montevideo", link: "/articles/microcorruption-07-montevideo" },
				{ text: "Microcorruption Pt. 6 - Whitehorse", link: "/articles/microcorruption-06-whitehorse" },
				{ text: "Microcorruption Pt. 5 - Reykjavik", link: "/articles/microcorruption-05-reykjavik" },
				{ text: "Microcorruption Pt. 4 - Cusco", link: "/articles/microcorruption-04-cusco" },
				{ text: "Microcorruption Pt. 3 - Hanoi", link: "/articles/microcorruption-03-hanoi" },
				{ text: "Microcorruption Pt. 2 - Sydney", link: "/articles/microcorruption-02-sydney" },
				{ text: "Creating a 2D Wrap from a 3D Object", link: "/articles/matryoshka-uv-map" },
				{ text: "Microcorruption Pt. 1 - New Orleans", link: "/articles/microcorruption-01-neworleans" },
				{ text: "sup world", link: "/articles/article1" },
			],
		},
	],
};

// Words section
const words = {
	text: "Words",
	items: [
		{
			text: "Posts",
			collapsible: true,
			items: [
				{ text: "A Yearly Reminder", link: "/blog/a-yearly-reminder" },
				{ text: "Missed Connections: Montréal", link: "/blog/missed-connections-montreal" },
			],
		},
	],
};

const all = {
	items: [...guides.items, ...sound.items],
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
				md.use(markdownItContainer, "div");
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
				{ text: "Words", link: "/words" },
				guides,
				sound,
				comic,
				{ text: "CV", link: "/resume" },
			],

			search: {
				provider: "local",
			},

			sidebar: {
				"/music/": sound,
				"/sound/": sound,
				"/study-guides/": guides,
				"/resume/": all,
				"/comic/": comic,
				"/blog/": words,
				"/articles/": articles,
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
