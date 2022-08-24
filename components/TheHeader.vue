<template>
	<header class="fixed top-0 left-0 w-full h-20 lg:h-22 border-b-2 border-gray-600 bg-light-50 z-99">
		<section class="flex flex-wrap px-4 pt-1 md:(flex-row container mx-auto px-10 h-full) items-center max-w-screen-2xl">
			<NuxtLink class="md:(w-[30%] flex items-center space-x-1)" to="/" >
				<img
					class="hidden md:block"
					width="38"
					height="38"
					src="@/assets/icon.svg"
					alt="icon"
				/>

				<img
					width="152"
					height="152"
					class="w-42 md:w-64"
					src="@/assets/logo.svg"
					alt="logo"
				/>
			</NuxtLink>

			<nav class="mt-1.5 order-last w-full flex items-center md:(flex-shrink-0 space-x-8 w-[40%] h-full mt-0)">
				<CategoriesList />
			</nav>

			<div class="order-2 ml-auto md:(flex items-center justify-end space-x-12 w-[30%] order-last)">
				<CartIcon />
			</div>
		</section>
	</header>
</template>