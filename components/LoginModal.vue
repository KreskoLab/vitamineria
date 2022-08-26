<script setup lang="ts">
defineEmits<{
	(event: 'close'): void
}>()

const loginModal = reactive({
	show: false,
	send: false,
	email: '',
})

const client = useStrapiClient()

async function logIn() {
	try {
		await client('/passwordless/send-link', { 
			body: { 
				email: loginModal.email
			},
			method: 'POST'
		})

		loginModal.send = true

	} catch (error) {
		loginModal.show = false
	}
}

onMounted(() => (loginModal.show = true))
</script>

<template>
	<Teleport to="body">
		<div
			class="flex justify-center items-center fixed top-0 left-0 h-full w-full bg-dark-600/60 transition-all duration-150 ease-in-out z-99"
		>
			<Transition
				enter-active-class="animate-animated animate-faster animate-fadeInUp"
				leave-active-class="animate-animated animate-faster animate-fadeOutDown"
				@after-leave="$emit('close')"
			>
				<dialog
					v-if="loginModal.show"
					class="w-[90%] h-[320px] md:w-[60%] lg:(w-[420px] h-[320px]) bg-gradient-19 p-4"
					open
				>
					<div
						class="relative flex flex-col justify-center w-full h-full border-2 border-gray-600 bg-light-50"
					>
						<header class="flex flex-col items-center justify-center">
							<img
								width="248"
								height="248"
								src="@/assets/logo.svg"
								alt="logo"
							/>
						</header>

						<form 
							class="mt-8"
							@submit.prevent="logIn()"
						>
							<div class="flex flex-col items-center space-y-6">
								<template v-if="!loginModal.send">
									<AppInput 
										class="px-8"
										placeholder="Ваш email" 
										required
										message="Введіть email адресу"
										@input="loginModal.email = $event"
									/>
							
									<button
										class="hover:bg-green-200 auth-button"
									>
										<span class="text-lg font-medium mx-auto">Увійти</span>
									</button>
								</template>

								<template v-else>
									<p class="text-lg">На вашу пошту відправлено лист</p>
								</template>
							</div>
						</form>

						<button
							class="flex items-center justify-center absolute top-5 right-5 outline-transparent"
							@click="loginModal.show = false"
						>
							<IconTablerX
								class="w-5 h-5 text-gray-400 hover:text-red-600 transition duration-150"
							/>
						</button>
					</div>
				</dialog>
			</Transition>
		</div>
	</Teleport>
</template>

<style scoped>
.fancy-border {
	border: 5px solid;
	border-image: linear-gradient(to left, #10b981, #ec4899) 1;
}

.auth-button {
	@apply flex items-center border-2 border-dark-50 py-2 px-3 w-10/12
  transition duration-200 ease-in-out
  hover:ring-transparent
  ring-[1px] ring-dark-200 ring-offset-2;
}
</style>
