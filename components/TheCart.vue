<script setup lang="ts">
import AppSidebar from '~/components/App/AppSidebar.vue';
import { Form } from '~~/types';
import type { Strapi4Response } from '@nuxtjs/strapi/dist/runtime/types/v4'

defineEmits<{
	(event: 'close'): void
}>()

const { find } = useStrapi4()

interface FormReponse {
	form: Form[]
}

type Tabs = 'cart' | 'adress'

const show = ref<boolean>(false)
const sidebar = ref<InstanceType<typeof AppSidebar> | null>(null)

const tab = ref<Tabs>('cart')

const client = useStrapiClient()
const products = useCartProducts()

const addressForm = ref<HTMLFormElement | null>(null)
const userForm = ref<HTMLFormElement | null>(null)

const productsPrice = computed<number>(() => {
	return products.value.reduce((acc, cv) => acc + cv.prices[0].variants[0].price * cv.count, 0)
}) 

const cartFull = computed<boolean>(() => products.value.length ? true : false)

const [formData, adressData] = await Promise.all([
	find<Strapi4Response<FormReponse>>('user-settings-form'), 
	find<Strapi4Response<FormReponse>>('user-adress-form')
])

const userSettings: { [key: string]: string } = reactive({})

onMounted(() => (show.value = true))

watch(products.value, (val, oldVal) => {
	if (val.length === oldVal.length) {
		saveCart()
	}
}, { deep: true })

async function removeProduct(id: number, weight: string) {
	await removeFromCart({ id, weight })
}

async function pay() {
	const cart = cartCookie().value

	try {
		const paymentLink = await client<string>('/me/order', { method: 'PUT', body: { userSettings, cart } })
		window.open(paymentLink, '_self')
	} catch (error) {
		
	}
}

async function validate() {
	const userFormValid = userForm.value.checkValidity()
	const addressFormValid = addressForm.value.checkValidity()

	if (!addressFormValid) addressForm.value.reportValidity()
	if (!userFormValid) userForm.value.reportValidity()

	if (addressFormValid && userFormValid) {
		await pay()
	}
}
</script>

<template>
	<AppSidebar 
		ref="sidebar"
		@close="$emit('close')"
	>
		<div class="flex flex-col h-full">
			<section class="flex items-center space-x-4 border-b-2 border-gray-600 px-4 h-[10%] w-full">
				<button 
					class="appearance-none w-6 h-6" 
					@click="sidebar.close()"
				>
					<IconTablerX class="w-6 h-6" />
				</button>

				<ul class="flex items-center space-x-12 text-lg">
					<li :class="{ 'font-medium': tab === 'cart' }" @click="tab = 'cart'">Кошик</li>
					<li :class="{ 'font-medium': tab === 'adress' }" @click="tab = 'adress'">Адреса</li>
				</ul>
			</section>

			<section 
				class="px-4 py-8 h-[60%] overflow-y-auto"
				:class="{ '!h-[65%]': tab === 'adress' }"
			>
				<div v-if="tab === 'cart'">
					<ul 
						v-if="cartFull" 
						class="space-y-8"
					>
						<li 
							v-for="product in products" 
							:key="product.slug" 
							class="flex space-x-4"
						>
							<div class="flex items-center justify-center min-h-24 min-w-24 bg-stone-100 p-2">
								<img class="w-22 h-28" :src="product.images.data[0].attributes.formats.small.url">
							</div>

							<div class="flex flex-col justify-between">
								<span class="font-semibold max-w-38 lg:max-w-64">
									{{ product.name }}
								</span>

								<AppNumberInput v-model="product.count" />
							</div>

							<div class="flex flex-col justify-between items-end !ml-auto">
								<span class="font-medium">
									{{ product.prices[0].variants[0].price }} ₴
								</span>

								<button @click="removeProduct(product.id, product.prices[0].variants[0].weight)">
									<IconTablerTrash class="!font-thin w-6 h-6 !text-gray-600" />
								</button>
							</div>
						</li>
					</ul>

					<p v-else class="flex justify-center items-center text-2xl font-medium h-full">
						Кошик порожній
					</p>
				</div>

				<div v-else class="flex flex-col space-y-16">
					<form
						ref="userForm"
						class="grid grid-cols-2 gap-y-12 gap-x-8 mt-4"
						@submit.prevent
					>
						<AppInput
							v-for="item in formData.data.attributes.form"
							:key="item.label"
							v-model="userSettings[item.value]"
							:label="item.label"
							:class="[item.full ? 'col-span-full' : 'col-span-1']"
							:type="item.type"
							:required="item.required"
							:pattern="item.pattern"
							:message="item.message"
							:placeholder="item.placeholder"
							@input="userSettings[item.value] = $event"
						/>
					</form>

					<form
						ref="addressForm"
						class="grid grid-cols-2 gap-y-12 gap-x-8"
						@submit.prevent
					>
						<AppInput
							v-for="item in adressData.data.attributes.form"
							:key="item.label"
							v-model="userSettings[item.value]"
							:label="item.label"
							:class="[item.full ? 'col-span-full' : 'col-span-1']"
							:type="item.type"
							:required="item.required"
							:pattern="item.pattern"
							:message="item.message"
							:placeholder="item.placeholder"
							@input="userSettings[item.value] = $event"
						/>
					</form>
				</div>
			</section>

			<div class="border-t-2 border-gray-600 h-[15%]">
				<section 
					v-if="cartFull && tab === 'cart'"
					class="flex flex-col justify-between px-4 pt-3 h-full"
				>
					<div class="flex justify-between items-center text-xl font-semibold uppercase">
						<span>Всього</span>
						<span>{{ productsPrice.toFixed(2) }} грн</span>
					</div>

					<button
						class="w-full appearance-none border-2 border-gray-600 h-14 text-xl font-medium bg-green-200" 
						@click="tab = 'adress'"
					>
						Оформити
					</button>
				</section>

				<section 
					v-else
					class="flex flex-col justify-between px-4 pt-3 h-full"
				>
					<button
						class="w-full appearance-none border-2 border-gray-600 h-14 text-xl font-medium bg-green-200" 
						@click="validate()"
					>
						Оплатити
					</button>
				</section>
			</div>
		</div>
	</AppSidebar>
</template>