<template>
  <div id="app">
		<navbar />
		<div class="router-view-container">
			<router-view />
			<footer class="disclaimer">
				<div> This is an experimental anime-streaming/mirror service built on EOS by (<a href="https://github.com/kodoburu" target="_blank">CodeBlue </a> / Tzu Yuan Kao) using eos-forum. </div>
				<div> Special thanks to the Novusphere community. </div>
				<div> This site is hosted entirely from <a href="https://github.com/kodoburu/atmos" target="_blank"> GitHub Pages and is fully open source. </a></div>
				<div> The developers of this software take no responsibility for the content displayed. </div>
				<div> No images, files or media are hosted by this site, please contact the respective site owners hosting content in breach of DMCA. </div>
			</footer>
		</div>
  </div>
</template>

<script>
import navbar from "@/components/modules/Navbar"
export default {
	name: "App",
	metaInfo: {
		title: 'Ani',
	},
	components: {
		navbar
	}
};
</script>