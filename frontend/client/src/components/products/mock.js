import { SIZES, FITS, BADGES, COLOR_PALETTES } from "./constants.js"

export const getMockProducts = (count = 24) => {
	return Array.from({ length: count }).map((_, i) => {
		const price = 549 + (i % 8) * 125
		const sizeIndex = i % SIZES.length
		const fit = FITS[i % FITS.length]
		return {
			id: i + 1,
			title: `Groovy Tee ${i + 1}`,
			price,
			rating: 3 + ((i * 7) % 20) / 10,
			sizes: SIZES.slice(0, sizeIndex + 1),
			fit,
			image: "/loginhero.png",
			badge: BADGES[i % BADGES.length],
			colors: COLOR_PALETTES[i % COLOR_PALETTES.length],
		}
	})
}

