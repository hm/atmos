<template>
  <div id="app">
		<navbar />
		<div class="router-view-container">
			<router-view />
		</div>
  </div>
</template>

<script>
import navbar from "@/components/section/Navbar"
export default {
	name: "App",
	components: {
		navbar
	}
};
</script>
