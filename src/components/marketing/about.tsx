export const About = () => {
	return (
		<div className="w-full flex justify-center py-12 md:py-20">
			<div className="max-w-2xl mx-auto px-8 md:px-4">
				<h1 className="text-4xl font-bold text-center mb-4 md:text-5xl">
					About us
				</h1>
				<div className="space-y-6 text-base text-left text-muted-foreground md:space-y-8 md:text-lg">
					<p>
						Like many, we've been through the hiring grind. We've managed teams,
						built companies, and felt the acute pain of searching for the right
						talent. The process was always a compromise. We juggled
						spreadsheets, paid for expensive and opaque platforms, and still
						spent countless hours on manual tasks instead of what truly matters:
						connecting with people.
					</p>
					<p>
						We asked ourselves a simple question: What if a recruitment platform
						was built with intelligence and transparency at its core? That
						question led to Compass, an AI-powered operating system for talent.
						Our goal is to give you a unified platform that automates the noise
						and surfaces the signals, helping you find and engage the best
						candidates, wherever they are.
					</p>
					<p>
						To fix a system that feels like a black box, you cannot build
						another one. Trust is essential in what we do. That is why we are
						committed to being an{" "}
						<span className="underline text-primary">open-source</span> company.
						We invite you to scrutinize our code, contribute to our development,
						and join us in building the future of talent acquisition.
					</p>
				</div>
			</div>
		</div>
	);
};
