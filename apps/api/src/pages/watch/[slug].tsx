import { ParsedUrlQuery } from "querystring";

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import { getSchedule, Show } from "../../utils/subsplease";
import { getShow } from "../api/show/[slug]";
import { Video } from "../../components/Video";

export const getStaticPaths: GetStaticPaths = async () => {
	const schedule = await getSchedule();
	const paths: Array<{ params: ParsedUrlQuery }> = [];

	Object.entries(schedule).forEach(([, shows]) => {
		shows.forEach(({ show: { slug } }) => {
			paths.push({ params: { slug } });
		});
	});

	return {
		paths,
		fallback: "blocking"
	};
};

export const getStaticProps: GetStaticProps<{ slug: string; show: Show }> = async (ctx) => {
	const slug = ctx.params?.slug as string;
	const show = await getShow(slug);

	return {
		props: {
			slug,
			show
		}
	};
};

const Watch: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ slug, show }) => {
	return (
		<div>
			<Video hash={show.episodes[0].content["480"]} />
		</div>
	);
};

export default Watch;
