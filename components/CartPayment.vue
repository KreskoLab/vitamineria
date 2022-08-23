<script setup lang="ts">
const client = useStrapiClient()

const a = ref('')

const paymentMethods = [
	{
		name: 'Онлайн',
		value: 'online'
	},
	{
		name: "Готівка",
		value: 'cash'
	},
	{
		name: 'Картка Приватбанку',
		value: 'privat'
	}
]

async function pay() {
	const cart = cartCookie().value

	// try {
	// 	const paymentLink = await client<string>('/me/order', { method: 'PUT', body: { userSettings, cart } })
	// 	window.open(paymentLink, '_self')
	// } catch (error) {
		
	// }
}
</script>

<template>
	<div class="flex flex-col justify-between h-full overflow-y-auto">
		<form
			class="grid grid-cols-2 gap-y-12 gap-x-8 mt-4 px-4 py-6"
			@submit.prevent
		>
			<AppSelect 
				v-model="a"
				class="col-span-full"
				label="Спосіб оплати"
				:options="paymentMethods"
			/>
		</form>

		<section 
			class="border-t-2 border-gray-600"
		>
			<div class="flex flex-col space-y-6 px-4 py-6">
				<button
					class="w-full appearance-none border-2 border-gray-600 text-xl font-medium h-14 bg-green-200" 
				>
					Оплатити
				</button>
			</div>
		</section>
	</div>
</template>