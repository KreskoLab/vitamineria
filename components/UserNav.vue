<script setup lang="ts">
const user = useUser()
const login = useLogin()


const displayName = computed(() => {
	if (user.value.filled) return `${user.value.name} ${user.value.surname}`
	else return user.value.email
})
</script>

<template>
	<div class="flex items-center justify-center h-full">
		<div v-if="user.email">
			<AppDropdown class="hidden md:block" menu="top-14">
				<span class="text-lg h-full px-4">
					{{ displayName }}
				</span>

				<template #menu>
					<AppDropdownItem>
						<NuxtLink class="inline-block w-full h-full" to="/account">
							Аккаунт
						</NuxtLink>
					</AppDropdownItem>

					<AppDropdownItem 
						@click="useLogOut()"
					>
						Вийти
					</AppDropdownItem>
				</template>
			</AppDropdown>

			<NuxtLink class="block md:hidden overflow-x-hidden max-w-24" to="/account">
				<span class="w-full text-sm truncate">
					{{ displayName }}
				</span>
			</NuxtLink>
		</div>

		<IconTablerUser
			v-else
			class="w-6 h-6 text-dark-100 cursor-pointer"
			@click="login = true"
		/>
	</div>
</template>