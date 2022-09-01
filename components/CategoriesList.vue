<script setup lang="ts">
import type { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types/v4'
import type { Category } from '~/types'
import qs from 'qs'

interface CategoriesResponse {
	data: Strapi4ResponseData<Category>[]
}

const route = useRoute()
const client = useStrapiClient()

const list = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)

const query = qs.stringify({
	fields: ['name', 'slug'],
	populate: {
		subcategories: {
			fields: ['name', 'slug']
		}
	}
}, {
	encodeValuesOnly: true,
});

const { data: categories } = await useAsyncData(
	'categories',
	() => client<CategoriesResponse>(`categories?${query}`),
	{
		default: () => ({ data: [] })
	}
)

const subcategoriesMenu = reactive({
	show: false,
	category: '',
	list: []
})

const isActive = (param: string) => param === route.params.category ? true : false

function getSubcategories(subcategories: object[], category: string) {
	if (subcategories.length) {
		subcategoriesMenu.category = category
		subcategoriesMenu.list = subcategories
		subcategoriesMenu.show = true
	} else subcategoriesMenu.show = false
}
</script>

<template>
	<div
		class="relative w-full h-full"
		@mouseleave="subcategoriesMenu.show = false"
	>
		<ul 
			ref="list"
			class="relative flex justify-between md:(justify-start gap-12) list-none w-full h-full"
		>
			<li
				v-for="category in categories.data"
				:key="category.id"
				class="relative group h-full cursor-pointer decorator"
				:class="{ 'after:(!w-full)': isActive(category.attributes.slug) }"
				@mouseenter="getSubcategories(category.attributes.subcategories.data, category.attributes.slug)"
			>
				<nuxt-link
					:to="`/${category.attributes.slug}`"
					class="text-sm lg:text-xl font-medium text-dark-100 h-full flex items-center"
					:class="{ 'text-dark-400': isActive(category.attributes.slug) }"
				>
					{{ category.attributes.name }}
				</nuxt-link>
			</li>
		</ul>

		<transition 
			enter-active-class="animate-animated animate-faster animate-fadeIn"
			leave-active-class="animate-animated animate-faster animate-fadeOut"
		>
			<ul
				v-if="subcategoriesMenu.show"
				ref="menu"
				class="absolute top-21 h-32 bg-white border-2 border-t-0 border-gray-600 z-50 transform -translate-x-1/2 left-1/2 w-[calc(100%+100px)] p-5 space-y-1"
				@mouseleave="subcategoriesMenu.show = false"
			>
				<li 
					v-for="subcategory in subcategoriesMenu.list" 
					:key="subcategory.id"
					class="text-lg"
				>
					<nuxt-link :to="`/${subcategoriesMenu.category}/subcategory/${subcategory.attributes.slug}`">
						{{ subcategory.attributes.name }}
					</nuxt-link>
				</li>
			</ul>
		</transition>
	</div>
</template>

<style scoped>
.decorator {
	@apply
	after:(content-DEFAULT absolute top-5 lg:top-14 w-0 h-[2px] bg-yellow-500 transition-all duration-500)
	after:hover:(bg-teal-300 w-full)
}
</style>