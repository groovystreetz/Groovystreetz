import React from "react"
import { Button } from "../ui/button"
import RatingStars from "./RatingStars"
import { Heart } from "lucide-react"
import { useWishlist } from "../../hooks/useWishlist"

const ProductQuickView = ({ product }) => {
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
	
	if (!product) return null
	
	const handleWishlist = () => {
		if (isInWishlist(product.id)) {
			removeFromWishlist(product.id)
		} else {
			addToWishlist(product.id)
		}
	}
	
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
				<div className="pt-2 space-y-2">
					<Button className="w-full">Add to Cart</Button>
					<Button 
						variant="outline" 
						onClick={handleWishlist}
						className={`w-full ${
							isInWishlist(product.id) 
								? 'border-red-500 text-red-600 hover:bg-red-50' 
								: ''
						}`}
					>
						<Heart 
							className={`h-4 w-4 mr-2 ${
								isInWishlist(product.id) ? 'fill-red-500' : ''
							}`} 
						/>
						{isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ProductQuickView
