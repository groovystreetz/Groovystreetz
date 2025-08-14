import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { Badge } from "../ui/badge"
import RatingStars from "./RatingStars"
import { Heart, ShoppingCart } from "lucide-react"

const ProductCard = ({ product, onQuickView }) => {
	const originalPrice = product.price + 200
	const discount = Math.max(5, Math.min(60, Math.round(100 - (product.price / originalPrice) * 100)))

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
		>
				<Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					{/* Media block with vertical ribbon */}
					<div className="relative grid grid-cols-[28px_1fr] items-stretch">
						{/* Vertical label */}
						<div className="bg-foreground text-background flex items-center justify-center px-1">
							<p style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }} className="uppercase font-semibold text-[10px] tracking-widest select-none">
								{(product.badge || 'Featured').toString()}
							</p>
						</div>

						{/* Image container */}
						<div className="relative bg-primary/10">
							<img
								src={product.image}
								alt={product.title}
								loading="lazy"
								onClick={() => onQuickView(product)}
								className="aspect-square w-full cursor-pointer object-cover transition-transform duration-300 group-hover:rotate-[0deg] group-hover:scale-105"
							/>

						{/* Bottom action bar (appears on hover) */}
						<div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm opacity-0 translate-y-2 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
								<button aria-label="Wishlist" className="rounded-full p-1.5 text-foreground/80 hover:bg-black/5">
									<Heart className="h-4 w-4" />
								</button>
								<div className="text-right">
									<p className="text-[11px] text-muted-foreground line-through">₹{originalPrice}</p>
									<p className="text-base font-bold">₹{product.price}</p>
								</div>
								<button aria-label="Add to cart" className="rounded-full p-1.5 text-foreground/80 hover:bg-black/5">
									<ShoppingCart className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>

				{/* Product Details Section */}
				<CardHeader className="p-3 pb-1">
					<CardTitle className="text-sm font-semibold line-clamp-1">{product.title}</CardTitle>
				</CardHeader>

				<CardContent className="px-3 pt-0 pb-2">
					<div className="mb-1 flex items-center justify-between">
						<div className="flex flex-col gap-0.5">
							<div className="flex items-baseline gap-1">
								<span className="text-base font-semibold leading-none">₹{product.price}</span>
								<span className="text-[11px] text-muted-foreground line-through leading-none">₹{originalPrice}</span>
								<span className="text-[11px] font-medium text-green-600 leading-none">{discount}% OFF</span>
							</div>
						</div>
						<div className="flex flex-col items-end gap-0.5">
							<div className="flex items-center gap-1">
								<RatingStars value={product.rating} size={14} />
								<span className="text-[11px] text-muted-foreground font-medium">{product.rating.toFixed(1)}</span>
							</div>
						</div>
					</div>

					{/* Color swatches */}
					{product.colors && product.colors.length > 0 && (
						<div className="flex items-center gap-1.5 mt-1">
							{product.colors.map((c, idx) => (
								<span
									key={idx}
									className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 border border-white"
									style={{ backgroundColor: c }}
								/>
							))}
						</div>
					)}
				</CardContent>

				<CardFooter className="px-3 pb-3 pt-0">
					<div className="flex flex-wrap gap-1">
						{product.sizes.slice(0, 5).map((s) => (
							<span
								key={s}
								className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-foreground/80 border border-accent-foreground/10"
							>
								{s}
							</span>
						))}
						{product.sizes.length > 5 && (
							<span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-foreground/80 border border-accent-foreground/10">
								+{product.sizes.length - 5}
							</span>
						)}
					</div>
				</CardFooter>
			</Card>
		</motion.div>
	)
}
export default ProductCard


