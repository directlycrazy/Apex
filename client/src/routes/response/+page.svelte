<script>
	import anime from "animejs";
	import { onMount } from "svelte";
	import LoadingBar from "$lib/components/LoadingBar.svelte";
	import Button from "$lib/components/Button.svelte";

	let type = "text";
	let question = "Processing...";
	let song = {};
	let weather = {};
	let response = "";
	let chat = "";

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);

		chat = urlParams.get("chat");

		fetch(`${import.meta.env.VITE_API_URL}/transcribe/${urlParams.get("q")}`)
			.then((r) => r.json())
			.then((res) => {
				let a = document.querySelector("#player");
				question = res.response;
				let parsed = res.response.toLowerCase().trim();

				if (parsed.startsWith("play")) {
					type = "music";
					let regex = /play(?: the song)?,? ([\w\s,'.]+)(?:,? ([\w\s,'.]+))?/i;
					let match = regex.exec(parsed);

					fetch(`https://api-music.inspare.cc/search?q=${encodeURI(match[1])}`)
						.then((r) => r.json())
						.then((res) => {
							let m = document.querySelector("#music");
							song = res.data[0];
							a.src = `${import.meta.env.VITE_API_URL}/stream/song`;
							a.load();
							a.play();
							a.addEventListener("ended", () => {
								response = "Sure Thing! I'll play that song for you.";
								fetch(
									`https://api-music.inspare.cc/request_streamkey/${import.meta.env.VITE_INSPARE_MUSIC}`
								).then(() => {
									m.src = `https://api-music.inspare.cc/lossless/${import.meta.env.VITE_INSPARE_MUSIC}/${res.data[0].id}.mp3`;
									m.load();
									m.play();
									setTimeout(() => {
										anime({
											targets: ".animate",
											translateY: [50, 0],
											opacity: [0, 1],
											delay: anime.stagger(400),
											duration: 500,
											easing: "easeInOutCirc",
										});
									}, 0);
								});
							});
						});
				} else if (parsed.includes("weather")) {
					fetch(`https://weather.inspare.cc/json`)
						.then((res) => res.json())
						.then((res) => {
							weather = res;
							type = "weather";
							response = "Here's the current weather in your location.";

							a.src = `${import.meta.env.VITE_API_URL}/stream/weather`;
							a.load();
							a.play();

							setTimeout(() => {
								anime({
									targets: ".animate",
									translateY: [50, 0],
									opacity: [0, 1],
									delay: anime.stagger(400),
									duration: 500,
									easing: "easeInOutCirc",
								});
							}, 0);
						});
				} else {
					fetch(
						`${import.meta.env.VITE_API_URL}/audio?q=${encodeURI(
							question
						)}&chat=${urlParams.get("chat")}`
					)
						.then((r) => r.json())
						.then((res) => {
							response = res.text;

							a.src = `${import.meta.env.VITE_API_URL}/stream/${res.id}`;
							a.load();
							a.play();

							setTimeout(() => {
								anime({
									targets: ".animate",
									translateY: [50, 0],
									opacity: [0, 1],
									delay: anime.stagger(400),
									duration: 500,
									easing: "easeInOutCirc",
								});
							}, 0);
						});
				}
			});
	});
</script>

<section
	style="position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);"
>
	<div class="text-left text-white">
		<h5 class="clipping font-black text-3xl">
			{question}
		</h5>
		{#if !response.length}
			<LoadingBar />
		{/if}
		{#if response.length}
			<div>
				<h5 class="clipping animate font-thin text-3xl">
					{response}
				</h5>
				{#if type === "weather"}
					<div
						class="animate flex text-white mt-3 bg-transparent p-5 rounded-xl backdrop-filter shadow-lg backdrop-brightness-75 backdrop-blur-lg"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-16 w-16 text-white cursor-pointer"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
							/>
						</svg>
						<div class="ml-5">
							<h1 class="text-white font-black text-5xl">
								{weather?.weather?.air_temperature}°{weather?.weather?.unit}
							</h1>
							<h1 class="text-white font-thin text-xl">
								{weather?.weather?.conditions} in {weather?.location?.city}, {weather
									?.location?.region || weather?.location?.country}
							</h1>
						</div>
					</div>
				{/if}
				{#if type === "music"}
					<div
						class="animate flex text-white mt-5 bg-transparent p-5 rounded-xl backdrop-filter shadow-lg backdrop-brightness-75 backdrop-blur-lg"
					>
						<img src={song?.album?.cover} class="h-24 w-24 rounded-xl" alt="" />
						<div class="ml-5">
							<h1 class="text-white font-black text-5xl">{song?.title}</h1>
							<h1 class="text-white font-thin text-xl mt-2">
								by {song?.artist?.name}
							</h1>
						</div>
					</div>
				{/if}
			</div>
			<div class="clipping grid grid-cols-2 mt-3 space-x-3">
				<div
					class="animate text-center backdrop-filter shadow-lg rounded-lg backdrop-brightness-75 backdrop-blur-lg"
				>
					<Button href={`/talk?chat=${chat}`} name="↑ Continue Chat" />
				</div>
				<div
					class="animate text-center backdrop-filter shadow-lg rounded-lg backdrop-brightness-75 backdrop-blur-lg"
				>
					<Button href="/" name="← Start Over" />
				</div>
			</div>
		{/if}
	</div>
</section>

<audio id="player" />
<audio volume="0.5" id="music" />
