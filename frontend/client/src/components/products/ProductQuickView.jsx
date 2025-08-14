import React from "react"
import { Button } from "../ui/button"
import RatingStars from "./RatingStars"

const ProductQuickView = ({ product }) => {
	if (!product) return null
	return (
		<div className="grid gap-6 sm:grid-cols-2">
			<img src={product.image} alt={product.title} className="w-full rounded-lg object-cover" />
			<div className="space-y-3">
				<h3 className="text-xl font-semibold">{product.title}</h3>
				<div className="flex items-center gap-3">
					<span className="text-2xl font-bold">₹{product.price}</span>
					<RatingStars value={product.rating} />
				</div>
				<div>
					<div className="mb-2 text-sm text-muted-foreground">Available Sizes</div>
					<div className="flex flex-wrap gap-2">
						{product.sizes.map((s) => (
							<button key={s} className="rounded border px-3 py-1 text-sm hover:bg-accent">
								{s}
							</button>
						))}
					</div>
				</div>
				<div className="pt-2">
					<Button className="w-full">Add to Cart</Button>
				</div>
			</div>
		</div>
	)
}

export default ProductQuickView


