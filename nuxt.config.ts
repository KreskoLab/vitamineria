import { defineNuxtConfig } from 'nuxt'
import UnpluginComponentsVite from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: ['nuxt-windicss', '@nuxtjs/strapi', 'unplugin-icons/nuxt', '@vueuse/nuxt'],

	css: ['@/assets/main.css'],

	strapi: {
		url: process.env.NUXT_PUBLIC_STRAPI || 'http://localhost:1337'
	},

	app: {
		head: {
			script: [
				{ src: process.env.GA_URL, children: process.env.GA_SCRIPT, async: true, type: 'text/javascript', hid: 'gtm' },
			],
		},
	},

	vite: {
		plugins: [
			UnpluginComponentsVite({
				dts: false,
				resolvers: [
					IconsResolver({
						prefix: 'Icon',
					}),
				],
			}),
		],
	},
})
