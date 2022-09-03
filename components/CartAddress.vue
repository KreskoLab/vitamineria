<script setup lang="ts">
import { Form, OrderInfo } from '~~/types';
import type { Strapi4Response } from '@nuxtjs/strapi/dist/runtime/types/v4'

interface FormReponse {
	form: Form[]
}

defineProps<{
	full: boolean
}>()

const { find } = useStrapi4()
const client = useStrapiClient()

const user = useUser()

const form = ref<HTMLFormElement | null>(null)

const [formData, adressData] = await Promise.all([
	find<Strapi4Response<FormReponse>>('user-settings-form'), 
	find<Strapi4Response<FormReponse>>('user-adress-form')
])

const order = reactive<OrderInfo>({
	name: '',
	surname: '',
	email: '',
	phone: '',
	account: false,
	payment: 'online',
	post: {
		name: 'novaposhta'
	}
})

onMounted(() => {
	if (user.value.email) {
		const userCredentials = getUserCredentials()
		const userAddress = getUserAddress()

		Object.assign(order, userCredentials)
		Object.assign(order.post, userAddress)
	}
})

const delivery = [
	{
		name: 'Самовивіз',
		value: 'samoviviz'
	},
	{
		name: "Кур'єр",
		value: 'courier'
	},
	{
		name: 'Нова пошта',
		value: 'novaposhta'
	},
	{
		name: 'Укрпошта',
		value: 'ukrposhta'
	}
]

const paymentMethods = [
	{
		name: 'Онлайн',
		value: 'online'
	},
	{
		name: "Готівка",
		value: 'cash'
	}
]

async function pay() {
	const cart = cartCookie().value  
	const cartModal = useCart()

	try {
		const response = await client<string>('/me/order', { method: 'PUT', body: { order, cart } })

		if (order.payment === 'cash') {
			cartModal.value = false
			await navigateTo(`/order?id=${response}`)
		}

		if (order.payment === 'online') {
			window.open(response, '_self')
		}
	} catch (error) {
		console.log(error);
	}
}

async function validate() {
	const isFormValid = form.value.checkValidity()

	if (!isFormValid) form.value.reportValidity()
	else pay()
}
</script>

<template>
	<div class="flex flex-col justify-between h-full overflow-y-auto">
		<div 
			v-if="full" 
		>
			<form
				ref="form"
				class="pt-2"
			>
				<fieldset 
					class="grid grid-cols-2 gap-y-12 gap-x-8 mt-4 px-4 py-6" 
					name="delivery"
				>
					<AppInput
						v-for="item in formData.data.attributes.form"
						:key="item.label"
						v-model="order[item.value]"
						:label="item.label"
						:class="[item.full ? 'col-span-full' : 'col-span-1']"
						:type="item.type"
						:required="item.required"
						:pattern="item.pattern"
						:message="item.message"
						:placeholder="item.placeholder"
						@input="order[item.value] = $event"
					/>
				</fieldset>

				<fieldset
					v-if="!user.email" 
					class="px-4 pb-6 pt-2"
				>
					<AppCheckbox 
						v-model="order.account"
						label="Створити аккаунт"
					/>
				</fieldset>

				<fieldset
					class="grid grid-cols-2 gap-y-12 gap-x-8 border-t-2 border-gray-600 px-4 pt-10 pb-6" 
					name="delivery"
				>
					<AppSelect 
						v-model="order.post.name"
						class="col-span-full"
						label="Доставка"
						:options="delivery"
					/>

					<div 
						v-if="order.post.name === 'novaposhta' || order.post.name === 'ukrposhta'"
						class="grid grid-cols-2 gap-y-12 gap-x-8 w-full col-span-full"
					>
						<AppInput
							v-for="item in adressData.data.attributes.form"
							:key="item.label"
							v-model="order.post[item.value]"
							:class="[item.full ? 'col-span-full' : 'col-span-1']"
							:label="item.label"
							:type="item.type"
							:required="item.required"
							:pattern="item.pattern"
							:message="item.message"
							:placeholder="item.placeholder"
							@input="order.post[item.value] = $event"
						/>
					</div>
				</fieldset>

				<fieldset 
					class="grid grid-cols-2 gap-y-12 gap-x-8 border-t-2 border-gray-600 px-4 pt-10 pb-6" 
					name="payment"
				>
					<AppSelect 
						v-model="order.payment"
						class="col-span-full"
						label="Спосіб оплати"
						:options="paymentMethods"
					/>
				</fieldset>
			</form>
		</div>

		<section 
			v-if="full"
			class="border-t-2 border-gray-600"
		>
			<div class="flex flex-col space-y-6 px-4 py-6">
				<button
					class="w-full appearance-none border-2 border-gray-600 text-xl font-medium h-14 bg-green-200" 
					@click="validate()"
				>
					<template v-if="order.payment === 'online'">
						Оплатити
					</template>

					<template v-else>
						Оформити
					</template>
				</button>
			</div>
		</section>
	</div>
</template>