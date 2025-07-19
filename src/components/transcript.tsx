import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Download, Copy, AudioLines, Share2 } from "lucide-react";

import { toast } from "sonner";

import type { TranscriptItem } from "@/lib/ai/types";

import { useTranscript } from "@/components/transcript-context";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TranscriptProps {
	className?: string;
	userText: string;
	setUserText: (val: string) => void;
	onSendMessage: () => void;
	canSend: boolean;
	downloadRecording: () => void;
	showActions?: boolean;
	showBreadcrumbs?: boolean;
	onShareInterview?: () => void;
}

function Transcript({
	className = "",
	downloadRecording,
	showActions = true,
	showBreadcrumbs = true,
	onShareInterview,
}: TranscriptProps) {
	const { transcriptItems, toggleTranscriptItemExpand } = useTranscript();
	const transcriptRef = useRef<HTMLDivElement | null>(null);
	const [prevLogs, setPrevLogs] = useState<TranscriptItem[]>([]);

	useEffect(() => {
		function scrollToBottom() {
			if (transcriptRef.current) {
				transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
			}
		}

		const hasNewMessage = transcriptItems.length > prevLogs.length;
		const hasUpdatedMessage = transcriptItems.some((newItem, index) => {
			const oldItem = prevLogs[index];
			return (
				oldItem &&
				(newItem.title !== oldItem.title || newItem.data !== oldItem.data)
			);
		});

		if (hasNewMessage || hasUpdatedMessage) {
			scrollToBottom();
		}

		setPrevLogs(transcriptItems);
	}, [transcriptItems, prevLogs]);

	const handleCopyTranscript = async () => {
		if (!transcriptRef.current) return;
		try {
			await navigator.clipboard.writeText(transcriptRef.current.innerText);
			toast("Copied to clipboard");
		} catch (error) {
			console.error("Failed to copy transcript:", error);
			toast.error("Failed to copy");
		}
	};

	return (
		<div className={`flex flex-col flex-1 min-h-0 ${className}`}>
			<div className="relative flex flex-1 min-h-0 w-full">
				{/* Share Interview Icon - Always visible */}
				{onShareInterview && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={onShareInterview}
									className={`absolute top-3 right-2 mr-1 z-10`}
								>
									<Share2 className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Share interview link</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}

				{transcriptItems.length === 0 ? (
					<div className="flex flex-1 items-center justify-center">
						<div className="text-center space-y-4">
							<div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
								<AudioLines className="h-8 w-8 text-muted-foreground" />
							</div>
							<p className="text-sm text-muted-foreground">
								Conversation will appear here
							</p>
						</div>
					</div>
				) : (
					<>
						{showActions && (
							<>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={handleCopyTranscript}
												className={`absolute top-3 ${onShareInterview ? "right-10 mr-4" : "right-2 mr-1"} z-10`}
											>
												<Copy className="w-4 h-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Copy to clipboard</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={downloadRecording}
												className={`absolute top-3 ${onShareInterview ? "right-18 mr-7" : "right-10 mr-4"} z-10`}
											>
												<Download className="w-4 h-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Download audio</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</>
						)}
						<div
							ref={transcriptRef}
							className="overflow-auto p-4 flex flex-col gap-y-4 h-full w-full text-foreground"
						>
							{transcriptItems.map((item) => {
								const {
									itemId,
									type,
									role,
									data,
									expanded,
									timestamp,
									title = "",
									isHidden,
								} = item;

								if (isHidden) {
									return null;
								}

								if (type === "MESSAGE") {
									const isUser = role === "user";
									const baseContainer = "flex flex-col";
									const containerClasses = `${baseContainer} ${
										isUser ? "items-end" : "items-start"
									}`;
									const bubbleBase = `max-w-lg p-3 rounded-xl ${
										isUser
											? "bg-primary text-primary-foreground"
											: "bg-muted text-foreground"
									}`;
									const isBracketedMessage =
										title.startsWith("[") && title.endsWith("]");
									const messageStyle = isBracketedMessage
										? "italic text-muted-foreground"
										: "";
									const displayTitle = isBracketedMessage
										? title.slice(1, -1)
										: title;

									return (
										<div key={itemId} className={containerClasses}>
											<div className={bubbleBase}>
												<div
													className={`text-xs ${
														isUser
															? "text-primary-foreground/60"
															: "text-muted-foreground"
													} font-mono`}
												>
													{timestamp}
												</div>
												<div className={`whitespace-pre-wrap ${messageStyle}`}>
													<ReactMarkdown>{displayTitle}</ReactMarkdown>
												</div>
											</div>
										</div>
									);
								} else if (type === "BREADCRUMB") {
									if (!showBreadcrumbs) {
										return null;
									}
									return (
										<div
											key={itemId}
											className="flex flex-col justify-start items-start text-muted-foreground text-sm"
										>
											<span className="text-xs font-mono">{timestamp}</span>
											{data ? (
												<button
													type="button"
													className="whitespace-pre-wrap flex items-center font-mono text-sm text-muted-foreground cursor-pointer bg-transparent border-none p-0 text-left"
													onClick={() => toggleTranscriptItemExpand(itemId)}
												>
													<span
														className={`text-muted-foreground mr-1 transform transition-transform duration-200 select-none font-mono ${
															expanded ? "rotate-90" : "rotate-0"
														}`}
													>
														▶
													</span>
													{title}
												</button>
											) : (
												<div className="whitespace-pre-wrap flex items-center font-mono text-sm text-muted-foreground">
													{title}
												</div>
											)}
											{expanded && data && (
												<div className="text-foreground text-left">
													<pre className="border-l-2 ml-1 border-border whitespace-pre-wrap break-words font-mono text-xs text-muted-foreground mb-2 mt-2 pl-2">
														{JSON.stringify(data, null, 2)}
													</pre>
												</div>
											)}
										</div>
									);
								} else {
									return (
										<div
											key={itemId}
											className="flex justify-center text-muted-foreground text-sm italic font-mono"
										>
											Unknown item type: {type}{" "}
											<span className="ml-2 text-xs">{timestamp}</span>
										</div>
									);
								}
							})}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Transcript;
