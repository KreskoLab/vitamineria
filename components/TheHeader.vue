<template>
	<header class="fixed top-10 left-0 w-full h-20 lg:h-22 min-w-[350px] border-b-2 border-gray-600 bg-light-50 z-99">
		<div class="flex flex-row flex-wrap px-4 pt-1 mx-auto lg:(justify-between w-full h-full px-12) items-center max-w-screen-2xl">
			<div class="flex lg:flex-1 justify-start">
				<nuxt-link class="flex items-center lg:space-x-1" to="/" >
					<img
						class="hidden lg:block"
						width="38"
						height="38"
						src="@/assets/icon.svg"
						alt="icon"
					/>

					<img
						width="152"
						height="152"
						class="w-42 lg:w-64"
						src="@/assets/logo.svg"
						alt="logo"
					/>
				</nuxt-link>
			</div>

			<nav class="flex flex-wrap w-full mt-1.5 order-last lg:(h-full items-center w-max mt-0)">
				<categories-list />
			</nav>

			<div class="flex items-center justify-end space-x-6 order-2 ml-auto lg:(flex-1 order-last)">
				<user-nav /> 
				<cart-icon />
			</div>
		</div>
	</header>
</template>