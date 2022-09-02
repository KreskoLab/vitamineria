<script setup lang="ts">
import { SubcategoryResponse } from '~~/interfaces';
import { categoryQuery } from '~~/queries';
	
const client = useStrapiClient()
const route = useRoute()
	
const param = route.params.category as string
const query = categoryQuery(param)
	
const { data: category } = await useAsyncData(
	'category',
	() => client<SubcategoryResponse>(`subategories?${query}`),
	{
		initialCache: false,
		default: (): SubcategoryResponse => ({ data: [] })
	}
)
	
useHead({
	title: category.value.data[0].attributes.name,
})
</script>
	
<template>
	<div 
		class="flex flex-col w-full h-[calc(100vh-5rem)] lg:(h-[calc(100vh-5.5rem)]) overflow-y-auto"
		:style="{ 'background-color': category.data[0].attributes.color }"
	>
		<section class="flex flex-col space-y-1 pt-5 lg:(space-y-3 px-12 pt-6)">
			<h1 class="text-center text-4xl lg:(text-6xl font-normal) font-medium text-dark-200 uppercase tracking-widest">
				{{ category.data[0].attributes.name }}
			</h1>
				
			<p class="text-2xl italic text-center lg:(uppercase)">
				{{ category.data[0].attributes.subtitle }}
			</p>
		</section>
	
		<section class="mt-8 grid place-items-center grid-cols-2 gap-x-6 gap-y-3 px-4 xl:(grid-cols-3 gap-6 px-32) pb-8">
			<ProductCard 
				v-for="product in category.data[0].attributes.products.data"
				:key="product.id" 
				:category="param"
				:name="product.attributes.name" 
				:price="product.attributes.prices[0].variants[0].price" 
				:slug="product.attributes.slug"
				:image="product.attributes.images.data[0].attributes.formats.small.hash + product.attributes.images.data[0].attributes.formats.small.ext"
				:in-stock="product.attributes.in_stock"
			/>
		</section>
	</div>
</template>	