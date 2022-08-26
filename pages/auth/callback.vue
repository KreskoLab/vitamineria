<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const client = useStrapiClient()

const loginToken = route.query['loginToken']

onMounted(async () => {
	try {
		const { jwt } = await client(`/passwordless/login?loginToken=${loginToken}`)
		const accessToken = useCookie('strapi_jwt', { maxAge: 60 * 60 * 24  * 30 })

		accessToken.value = jwt

		await new Promise((resolve) => setTimeout(() => resolve('ok'), 1000))
		await useFetchUser()
	} catch (error) {
		console.log(error);
	}

	router.push('/pastila')
})
</script>

<template>
	<div></div>
</template>
