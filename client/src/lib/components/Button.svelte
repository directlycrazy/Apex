<script>
	export let href;
	export let name;
</script>

<a href={href}>
	<div
		class="text-white bg-transparent p-5 rounded-xl backdrop-filter shadow-lg backdrop-brightness-75 backdrop-blur-lg"
	>
		{name}
	</div>
</a>