import { EbmlDataTag, EbmlTag } from "ebml-stream";

export function isEbmlDataTag(value: EbmlTag): value is EbmlDataTag {
	return "data" in value;
}
