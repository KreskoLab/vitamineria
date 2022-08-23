<script setup lang="ts">
definePageMeta({
	pageTransition: false,
}) 

onBeforeMount(() => navigateTo('/pastila'))
</script>

<template>
	<div class="flex flex-nowrap w-full h-[calc(100vh-5rem)] lg:(h-[calc(100vh-5.5rem)]) bg-[#F7E4DF]" />
</template>
