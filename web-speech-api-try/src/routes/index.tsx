import {
	$,
	type NoSerialize,
	component$,
	noSerialize,
	useOnWindow,
	useSignal,
} from "@builder.io/qwik";

import {} from "@builder.io/qwik-city";

export default component$(function Index() {
	const listening = useSignal(false);
	const voices = useSignal<SpeechSynthesisVoice[]>();
	const voice = useSignal<NoSerialize<SpeechSynthesisVoice> | undefined>();
	const recognizer = useSignal<NoSerialize<ISpeechRecognition> | undefined>();
	const transcribe = useSignal("");

	console.log(recognizer.value);

	useOnWindow(
		"DOMContentLoaded",
		$(() => {
			voices.value = noSerialize(speechSynthesis.getVoices());
			const Recognition =
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(window as any).SpeechRecognition ||
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(window as any).webkitSpeechRecognition;
			console.log(Recognition);
			const recognizer_ = noSerialize(new Recognition());
			recognizer_.lang = "ja-JP";
			recognizer_.maxAlternatives = 3;
			recognizer_.continuous = true;
			console.log(recognizer_);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			recognizer_.onresult = $((event: any) => {
				console.log(event.results[0][0].transcript);
				transcribe.value = "";
				for (const result of event.results) {
					transcribe.value += result[0].transcript;
				}
			});
			recognizer_.onstart = $(() => {
				console.log("start");
			});
			recognizer.value = recognizer_;
		}),
	);

	return (
		<div style={{ height: "100%", padding: "1rem" }}>
			<h2>Transcribe</h2>
			<div
				style={{
					minHeight: "2rem",
					padding: "1rem",
					borderRadius: "1rem",
					backgroundColor: "#e3d7a3",
					color: "#000",
				}}
			>
				{transcribe}
			</div>
			<select
				onChange$={(event$, element) => {
					voice.value = noSerialize(
						voices.value?.find((voice) => {
							voice.name === element.value;
						}),
					);
				}}
			>
				{voices.value
					?.filter((voice) => voice.lang === "ja")
					.map((voice) => (
						<option key={voice.voiceURI} value={voice.name}>
							{voice.name}
						</option>
					))}
			</select>
			<button
				type="button"
				style={{
					display: "flex",
					alignContent: "center",
					alignItems: "center",
					position: "fixed",
					bottom: "2rem",
					right: "2rem",
					width: "4.4rem",
					borderRadius: "1.4rem",
					padding: "0.8rem",
				}}
				onClick$={() => {
					listening.value = !listening.value;
					if (listening.value) {
						recognizer.value?.start();
						return;
					}

					recognizer.value?.stop();
					return;
				}}
			>
				{listening.value ? "Stop" : "Listen"}
			</button>
		</div>
	);
});

interface ISpeechRecognition extends EventTarget {
	// properties
	grammars: string;
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	maxAlternatives: number;
	serviceURI: string;

	// event handlers
	onaudiostart: () => void;
	onaudioend: () => void;
	onend: () => void;
	onerror: () => void;
	onnomatch: () => void;
	onresult: (event: ISpeechRecognitionEvent) => void;
	onsoundstart: () => void;
	onsoundend: () => void;
	onspeechstart: () => void;
	onspeechend: () => void;
	onstart: () => void;

	// methods
	abort(): void;
	start(): void;
	stop(): void;
}

interface ISpeechRecognitionEvent {
	isTrusted?: boolean;
	results: {
		isFinal: boolean;
		[key: number]:
			| undefined
			| {
					transcript: string;
			  };
	}[];
}
