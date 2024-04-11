"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [recognizer, set_recognizer] = useState<any>(null);
	const [transcript, set_transcript] = useState("");
	return (
		<main className={styles.main}>
			<div>{transcript}</div>
			<button
				type="button"
				onClick={(event) => {
					if (recognizer === null) {
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						const recognizer = new (window as any).webkitSpeechRecognition();
						recognizer.lang = "ja-JP";
						recognizer.maxAlternatives = 1;
						recognizer.continuous = true;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						recognizer.onresult = (event: any) => {
							const transcript = [...event.results]
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								.map((result: any) => result[0].transcript)
								.join("");
							set_transcript(transcript);
						};
						recognizer.start();
						set_recognizer(recognizer);
					} else {
						recognizer.stop();
					}
				}}
			>
				話す
			</button>
		</main>
	);
}
