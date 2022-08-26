<script setup lang="ts">
const client = useStrapiClient()
const route = useRoute()

const orderId = route.query['id']

let res = ref<'success' | 'error' | 'pending'>('error');

onMounted(async () => {
	try {
		res.value = await client<'success' | 'error' | 'pending'>(`/me/order?id=${orderId}`, { method: 'GET' })
	} catch (error) {
		console.log(error);
	}

	if (res.value === 'success' || res.value === 'pending') {
		await clearCart()
	} else {
		await new Promise((resolve) => {
			setTimeout(() => resolve(navigateTo('/pastila')), 5000)
		})
	}
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

			<template v-if="res === 'pending'">
				Замовлення оброблюється
			</template>

			<template v-if="res === 'error'">
				Під час оплати винкила помилка
			</template>
		</h1>

		<p v-if="res === 'success' || res === 'pending'" class="text-2xl text-center md:text-3xl font-medium">
			На вашу пошту відправлено лист
		</p>

		<p v-if="res === 'success' || res === 'pending'" class="text-center text-2xl mt-4">
			Номер замовлення: {{ orderId }}
		</p>
	</div>
</template>