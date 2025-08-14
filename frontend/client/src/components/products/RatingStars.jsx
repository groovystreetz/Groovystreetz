import React from "react"
import { Star } from "lucide-react"

const RatingStars = ({ value, size = 16 }) => {
	const full = Math.floor(value)
	const half = value - full >= 0.5
	const dim = `${size}px`
	return (
		<div className="flex items-center gap-0.5 text-yellow-500">
			{Array.from({ length: 5 }).map((_, idx) => (
				<Star
					key={idx}
					style={{ width: dim, height: dim }}
					className={`${idx < full ? 'fill-current' : half && idx === full ? 'fill-current opacity-50' : 'opacity-30'}`}
				/>
			))}
		</div>
	)
}

export default RatingStars


