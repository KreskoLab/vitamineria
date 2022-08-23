<script setup lang="ts">
const client = useStrapiClient()
const route = useRoute()

const orderId = route.query['orderId'] || ''

let res = ref<'success' | 'error'>('error');

onMounted(async () => {
	res.value = await client<'success' | 'error'>(`/me/order?orderId=${orderId}`, { method: 'GET' })
})
</script>

<template>
	<div 
		class="flex flex-col items-center justify-center w-full h-[calc(100vh-5rem)] lg:(h-[calc(100vh-5.5rem)]) overflow-y-auto bg-[#FBF0C4]"
	>
		<h1 class="text-2xl text-center md:text-3xl font-medium">
			<template v-if="res === 'success'">
				Дякуємо! Замовлення прийнято
			</template>

			<template v-else>
				Під час оплати винкила помилка
			</template>
		</h1>

		<p v-if="res === 'success'" class="text-center text-xl">
			Номер замовлення: {{ orderId }}
		</p>
	</div>
</template>