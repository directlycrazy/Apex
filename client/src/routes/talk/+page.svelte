<script>
	import { Icon } from "@steeze-ui/svelte-icon";
	import { ArrowLeft, Microphone } from "@steeze-ui/heroicons";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import anime from "animejs";
	let uploading = false;
	let stopped = true;
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((mediaStreamObj) => {
				let audio = document.querySelector("#recorder");

				audio.onloadedmetadata = (e) => {
					audio.play();
				};

				let mediaRecorder = new MediaRecorder(mediaStreamObj);
				let btn = document.querySelector(".microphone_icon");

				btn.addEventListener("click", (e) => {
					let timeline = anime.timeline({
						easing: "easeInOutCirc",
						duration: 500,
					});
					timeline.add({
						targets: [".leading", ".header"],
						translateY: 120,
						delay: anime.stagger(100),
					});
					timeline.add({
						targets: [".microphone_icon"],
						translateY: -70,
						width: "250px",
						backgroundColor: "#1e40af",
						height: "250px",
					});
					e.preventDefault();
					stopped = !stopped;
					if (stopped === false) {
						return mediaRecorder.start();
					}
					uploading = true;
					timeline.add({
						targets: [".microphone_icon"],
						easing: "easeInOutCirc",
						scale: ["100%", "70%"],
						backgroundColor: "transparent",
						complete: () => {
							mediaRecorder.stop();
						},
					});
				});

				let recData = [];

				mediaRecorder.ondataavailable = (e) => {
					recData.push(e.data);
				};

				mediaRecorder.onstop = (e) => {
					let data = new Blob(recData, { type: mediaRecorder.mimeType });
					recData = [];
					let formData = new FormData();
					formData.append("audio", data);
					let id = new Date().getTime();
					let chat = urlParams.get("chat");

					fetch(
						`${import.meta.env.VITE_API_URL}/upload/${id}${
							chat ? `?chat=${chat}` : ""
						}`,
						{
							method: "POST",
							body: formData,
						}
					)
						.then((r) => r.json())
						.then((res) => {
							console.log(res);
							goto(`/response?q=${id}&chat=${chat ? chat : res.id}`);
						});
				};
			});
	});
</script>

<a href="/">
	<Icon
		src={ArrowLeft}
		class="fixed right-0 top-0 m-16 h-8 w-8 text-white cursor-pointer"
	/>
</a>

<section
	style="position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);"
>
	<div class="text-center">
		<div style="clip-path: polygon(0 0, 100% 0%, 100% 100%, 0% 100%);">
			<h1 class="header text-white font-black text-7xl">I'm ApexAI!</h1>
			<h5 class="leading text-white font-thin text-2xl mt-2">
				Press the microphone to begin speaking
			</h5>
		</div>
		<div
			oncontextmenu="return false;"
			class={`flex items-center transition-colors microphone_icon m-auto mt-5 text-white bg-transparent p-5 rounded-xl backdrop-filter shadow-lg backdrop-brightness-75 backdrop-blur-lg cursor-pointer`}
		>
			<Icon
				src={Microphone}
				class="microphone_svg m-2 w-full text-white text-center"
				style="height: 3rem;"
			/>
		</div>
	</div>
</section>

<audio id="recorder" src="" />
