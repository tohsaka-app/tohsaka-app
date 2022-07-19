import { SiGithub, SiDiscord } from "react-icons/si";

import { DISCORD_URL, GITHUB_ORGANIZATION_URL } from "../lib/config";

import { FooterList } from "./FooterList";
import { FooterSection } from "./FooterSection";
import { Link } from "./Link";

export const Footer: React.FC = () => {
	return (
		<footer className="flex items-center justify-center">
			<div className="container flex flex-col gap-16 p-8 md:flex-row">
				<FooterSection name="Tohsaka">
					<div className="flex flex-col gap-6">
						<span className="max-w-sm text-zinc-300">
							No claim is made to the imagery or information shown on this site; all content and
							imagery are the property of their respective copyright holders.
						</span>
						<div className="flex gap-4">
							<Link href={GITHUB_ORGANIZATION_URL}>
								<SiGithub className="h-6 w-6" />
							</Link>
							<Link href={DISCORD_URL}>
								<SiDiscord className="h-6 w-6" />
							</Link>
						</div>
					</div>
				</FooterSection>
				<FooterSection name="Community">
					<FooterList>{[["Discord Server", DISCORD_URL]]}</FooterList>
				</FooterSection>
				<FooterSection name="Resources">
					<FooterList>
						{[
							["GitHub Organization", GITHUB_ORGANIZATION_URL],
							["Download", "/download"]
						]}
					</FooterList>
				</FooterSection>
				<FooterSection name="Legal resources">
					<FooterList>
						{[
							["Copyright takedowns", "/legal/copyright"],
							["Terms of Service", "/legal/terms-of-service"],
							["Privacy Policy", "/legal/privacy-policy"]
						]}
					</FooterList>
				</FooterSection>
			</div>
		</footer>
	);
};
