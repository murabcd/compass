import { useRef } from "react";
import { useTranscript } from "@/components/transcript-context";

export function useHandleSessionHistory() {
	const {
		addTranscriptBreadcrumb,
		addTranscriptMessage,
		updateTranscriptMessage,
		updateTranscriptItem,
	} = useTranscript();

	const extractMessageText = (content: any[] = []): string => {
		if (!Array.isArray(content)) return "";

		return content
			.map((c) => {
				if (!c || typeof c !== "object") return "";
				if (c.type === "input_text") return c.text ?? "";
				if (c.type === "audio") return c.transcript ?? "";
				return "";
			})
			.filter(Boolean)
			.join("\n");
	};

	const extractFunctionCallByName = (
		name: string,
		content: any[] = [],
	): any => {
		if (!Array.isArray(content)) return undefined;
		return content.find(
			(c: any) => c.type === "function_call" && c.name === name,
		);
	};

	const maybeParseJson = (val: any) => {
		if (typeof val === "string") {
			try {
				return JSON.parse(val);
			} catch {
				console.warn("Failed to parse JSON:", val);
				return val;
			}
		}
		return val;
	};

	function handleAgentToolStart(details: any, _agent: any, functionCall: any) {
		const lastFunctionCall = extractFunctionCallByName(
			functionCall.name,
			details?.context?.history,
		);
		const function_name = lastFunctionCall?.name;
		const function_args = lastFunctionCall?.arguments;

		addTranscriptBreadcrumb(`function call: ${function_name}`, function_args);
	}

	function handleAgentToolEnd(
		details: any,
		_agent: any,
		_functionCall: any,
		result: any,
	) {
		const lastFunctionCall = extractFunctionCallByName(
			_functionCall.name,
			details?.context?.history,
		);
		addTranscriptBreadcrumb(
			`function call result: ${lastFunctionCall?.name}`,
			maybeParseJson(result),
		);
	}

	function handleHistoryAdded(item: any) {
		console.log("[handleHistoryAdded] ", item);
		if (!item || item.type !== "message") return;

		const { itemId, role, content = [] } = item;
		if (itemId && role) {
			const isUser = role === "user";
			let text = extractMessageText(content);

			if (isUser && !text) {
				text = "[Transcribing...]";
			}

			addTranscriptMessage(itemId, role, text);
		}
	}

	function handleHistoryUpdated(items: any[]) {
		console.log("[handleHistoryUpdated] ", items);
		items.forEach((item: any) => {
			if (!item || item.type !== "message") return;

			const { itemId, content = [] } = item;

			const text = extractMessageText(content);

			if (text) {
				updateTranscriptMessage(itemId, text, false);
			}
		});
	}

	function handleTranscriptionDelta(item: any) {
		const itemId = item.item_id;
		const deltaText = item.delta || "";
		if (itemId) {
			updateTranscriptMessage(itemId, deltaText, true);
		}
	}

	function handleTranscriptionCompleted(item: any) {
		// History updates don't reliably end in a completed item,
		// so we need to handle finishing up when the transcription is completed.
		const itemId = item.item_id;
		const finalTranscript =
			!item.transcript || item.transcript === "\n"
				? "[inaudible]"
				: item.transcript;
		if (itemId) {
			updateTranscriptMessage(itemId, finalTranscript, false);
			updateTranscriptItem(itemId, { status: "DONE" });
		}
	}

	const handlersRef = useRef({
		handleAgentToolStart,
		handleAgentToolEnd,
		handleHistoryUpdated,
		handleHistoryAdded,
		handleTranscriptionDelta,
		handleTranscriptionCompleted,
	});

	return handlersRef;
}
