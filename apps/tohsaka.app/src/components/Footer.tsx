import Link from "next/link";
import { SiGithub, SiDiscord } from "react-icons/si";

import { FooterSection } from "./FooterSection";

export const Footer: React.FC = () => {
	return (
		<footer className="flex items-center justify-center">
			<div className="container flex flex-col gap-16 p-8 md:flex-row">
				<FooterSection name="Tohsaka">
					<div className="flex flex-col gap-4">
						<span className="max-w-sm text-zinc-300">
							Nunc ut nulla viverra, consectetur justo id, accumsan velit. Nullam id pellentesque
							odio. Aliquam iaculis erat nec nisi semper tempor. Integer quis felis justo. Nam
							venenatis, felis vitae iaculis mattis.
						</span>
						<div className="flex gap-4">
							<Link href="https://github.com/tohsaka-app/">
								<a>
									<SiGithub className="h-6 w-6" />
								</a>
							</Link>
							<Link href="https://github.com/tohsaka-app/">
								<a>
									<SiDiscord className="h-6 w-6" />
								</a>
							</Link>
							<Link href="https://github.com/tohsaka-app/">
								<a>
									<SiDiscord className="h-6 w-6" />
								</a>
							</Link>
							<Link href="https://github.com/tohsaka-app/">
								<a>
									<SiDiscord className="h-6 w-6" />
								</a>
							</Link>
						</div>
					</div>
				</FooterSection>
				<FooterSection name="Legal">
					<div className="flex flex-col">
						<Link href="">
							<a>Copyright requests</a>
						</Link>
					</div>
				</FooterSection>
				<FooterSection name="Legal" />
				<FooterSection name="Legal" />
			</div>
		</footer>
	);
};
