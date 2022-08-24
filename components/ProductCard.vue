<script setup lang="ts">
const props = defineProps<{
	name: string,
	slug: string,
	category: string,
	price: number,
	image?: string
}>()

const decimalPrice = computed(() => props.price.toFixed(2))
</script>

<template>
	<article class="flex flex-col w-full h-full">
		<NuxtLink :to="`/${category}/${slug}`">
			<NuxtImg 
				:src="image"
				provider="cloudinary"
				format="webp"
				quality="80"
				class="border-4 border-light-50 h-auto max-w-full"
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
	</article>
</template>