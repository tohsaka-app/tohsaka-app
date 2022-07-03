export enum SubtitlePosition {
	BOTTOM_LEFT = 1,
	BOTTOM_CENTER,
	BOTTOM_RIGHT,
	TOP_LEFT = 5,
	TOP_CENTER,
	TOP_RIGHT,
	MIDDLE_LEFT = 9,
	MIDDLE_CENTER,
	MIDDLE_RIGHT
}

export interface Subtitle {
	ts: [start: number, end: number];
	position: SubtitlePosition;
	text: string;
}
