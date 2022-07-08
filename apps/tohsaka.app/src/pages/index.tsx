import Link from "next/link";
import { HiOutlineDownload, HiArrowNarrowRight } from "react-icons/hi";
import { MdPlayArrow } from "react-icons/md";

import { Video } from "../components/Video";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

import type { NextPage } from "next";
import { PosterGallery } from "../components/PosterGallery";

const RootIndexPage: NextPage = () => {
	return (
		<>
			<Header />
			<div className="flex flex-col items-center justify-center">
			<PosterGallery/>
				<div className="container flex flex-col items-center justify-center gap-16 p-8 md:min-h-screen md:flex-row">
					<div className="flex max-w-2xl flex-col gap-8">
						<span className="text-4xl font-bold md:text-5xl">
							Watch your favorite anime{" "}
							<span className="text-yellow-300">without arbitrary and unfair boundaries</span>.
						</span>
						<span className="max-w-lg">
							Nunc ut nulla viverra, consectetur justo id, accumsan velit. Nullam id pellentesque
							odio. Aliquam iaculis erat nec nisi semper tempor. Integer quis felis justo. Nam
							venenatis, felis vitae iaculis mattis.
						</span>
						<div className="flex gap-8">
							<button
								className="flex items-center gap-4 rounded bg-yellow-300 px-5 py-3 text-black"
								type="button"
							>
								<span>Download</span>
								<HiOutlineDownload className="h-5 w-5" />
							</button>
							<Link href="">
								<a className="flex items-center gap-2">
									<span>Learn more</span>
									<HiArrowNarrowRight />
								</a>
							</Link>
						</div>
					</div>
					<div className="grow"/>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default RootIndexPage;
