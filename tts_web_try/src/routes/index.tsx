import {
	component$,
	noSerialize,
	useSignal,
	type NoSerialize,
	useOnWindow,
	$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
	const voices = useSignal<NoSerialize<SpeechSynthesisVoice[]>>(
		noSerialize([]),
	);
	useOnWindow(
		"load",
		$(() => {
			voices.value = noSerialize(window.speechSynthesis.getVoices());
		}),
	);

	return (
		<>
			<select>
				{voices.value
					?.filter((voice) => voice.lang.toLowerCase().includes("ja"))
					.map((voice) => (
						<option key={voice.voiceURI}>
							{`${voice.name}(${voice.lang})`}
						</option>
					))}
			</select>
			<button
				type="button"
				onClick$={() => {
					const uttr = new SpeechSynthesisUtterance();
					uttr.text = "こんにちは、今日はいい天気です";
					speechSynthesis.speak(uttr);
				}}
			>
				Speek
			</button>
		</>
	);
});

export const head: DocumentHead = {
	title: "Welcome to Qwik",
	meta: [
		{
			name: "description",
			content: "Qwik site description",
		},
	],
};
