<script setup lang="ts">
const cart = useCart()
const login = useLogin()

await fetchCartProducts()
</script>

<template>
	<div class="min-h-screen bg-stone-100 min-w-[360px]">
		<TheHeader />

		<TheCart 
			v-if="cart" 
			@close="cart = false" 
		/>

		<LoginModal
			v-if="login"
			@close="login = false"
		/>

		<NuxtLoadingIndicator />

		<main class="container mx-auto max-w-screen-2xl overflow-x-hidden pt-20 lg:pt-22">
			<NuxtPage />
		</main>
	</div>
</template>

<style>
.page-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
