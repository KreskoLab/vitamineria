<script setup lang="ts">
const props = defineProps<{
	name: string,
	slug: string,
	category: string,
	price: number,
	inStock: boolean
	image?: string,
	height?: number,
	width?: number,
}>()

const decimalPrice = computed(() => props.price.toFixed(2))
</script>

<template>
	<article class="relative flex flex-col w-full h-full">
		<NuxtLink :to="`/${category}/${slug}`">
			<NuxtImg 
				:src="image"
				:width="width"
				:height="height"
				provider="cloudinary"
				format="webp"
				loading="lazy"
				class="border-4 border-light-50 h-auto max-w-full object-cover"
			/>

			<div class="flex flex-col items-center w-full mt-1 lg:mt-2">
				<h1 class="text-base lg:text-xl text-center font-medium text-dark-400 break-words">
					{{ name }}
				</h1>

				<span class="text-base lg:text-lg text-dark-100">
					{{ decimalPrice }} грн
				</span>
			</div>
		</NuxtLink>

		<div 
			v-if="!inStock"
			class="absolute -right-3 top-2 sm:(top-5 right-0 w-42) transform rotate-20 bg-red-400 py-1 px-3"
		>
			<p class="font-medium text-center">нема в наявності</p>
		</div>
	</article>
</template>