<script setup lang="ts">
import { SubcategoryResponse } from '~~/interfaces';
import { subcategoryQuery } from '~~/queries';
	
const client = useStrapiClient()
const route = useRoute()
	
const param = route.params['slug'] as string
const query = subcategoryQuery(param)
	
const { data: category } = await useAsyncData(
	'subcategory',
	() => client<SubcategoryResponse>(`subcategories?${query}`),
	{
		initialCache: false,
		default: (): SubcategoryResponse => ({ data: [] })
	}
)
	
useHead({
	title: category.value.data[0].attributes.name,
	meta: [
		{
			name: 'description',
			content: category.value.data[0].attributes.seo[0].description
		},
		{
			name: 'keywords',
			content: category.value.data[0].attributes.seo[0].keywords
		}
	]
})
</script>
	
<template>
	<div 
		class="flex flex-col w-full h-[calc(100vh-7.5rem)] lg:(h-[calc(100vh-8rem)]) overflow-y-auto"
	>
		<section class="flex flex-col space-y-1 pt-5 lg:(space-y-3 px-12 pt-6)">
			<h1 class="text-center text-4xl lg:(text-6xl font-normal) font-medium text-dark-200 uppercase tracking-widest">
				{{ category.data[0].attributes.name }}
			</h1>
		</section>
	
		<section class="mt-8 grid place-items-center grid-cols-2 gap-x-6 gap-y-3 px-4 xl:(grid-cols-3 gap-6 px-32) pb-8">
			<ProductCard 
				v-for="product in category.data[0].attributes.products.data"
				:key="product.id" 
				:category="param"
				:name="product.attributes.name" 
				:slug="product.attributes.slug"
				:in-stock="product.attributes.in_stock"
				:price="product.attributes.prices[0].variants[0].price" 
				:image="product.attributes.cover.data.attributes.formats.small.hash + product.attributes.cover.data.attributes.formats.small.ext"
				:height="product.attributes.cover.data.attributes.formats.small.height"
				:width="product.attributes.cover.data.attributes.formats.small.width"
			/>
		</section>
	</div>
</template>