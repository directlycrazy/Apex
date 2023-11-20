<script>
	import { Icon } from "@steeze-ui/svelte-icon";
	import { Microphone } from "@steeze-ui/heroicons";
	import { onMount } from "svelte";
	import anime from "animejs";

	let weather = {};
	let time = { time: "0:00AM", date: "" };

	onMount(() => {
		const fetchWeather = () => {
			fetch(`https://weather.inspare.cc/json`)
				.then((r) => r.json())
				.then((res) => {
					weather = res;
				});
		};
		const setTime = () => {
			let d = new Date();
			time.time = d.toLocaleString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});
			time.date = d.toLocaleDateString("en-US", {
				weekday: "short",
				month: "long",
				day: "numeric",
			});
		};

		window.onload = () => {
			let timeline = anime({
				easing: "easeInOutCirc",
				duration: 500,
			});
			timeline.add({
				targets: [".time"],
				translateY: ["100px", "0px"],
			});
			timeline.add({
				targets: [".date"],
				translateY: ["-100px", "0px"],
			});
			timeline.play();
		};

		fetchWeather();
		setTime();
		setInterval(setTime, 30 * 1000);
		setInterval(fetchWeather, 5 * 60 * 1000);
	});
</script>

{#if weather?.weather}
	<h5 class="weather text-white font-thin text-3xl fixed">
		<span class="font-black"
			>{weather?.weather?.air_temperature}°{weather?.weather?.unit}</span
		>
		in {weather?.location?.city}, {weather?.location?.region ||
			weather?.location?.country}
	</h5>
{/if}

<a href="/talk">
	<Icon
		src={Microphone}
		class="fixed right-0 top-0 m-16 h-8 w-8 text-white cursor-pointer"
	/>
</a>

<section
	style="position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);"
>
	<div class="text-center">
		<h1 class="time_text clipping text-white font-black text-9xl uppercase">
			{time?.time}
		</h1>
		<h5 class="date clipping text-white font-bold text-2xl uppercase">
			{time?.date}
		</h5>
	</div>
</section>
