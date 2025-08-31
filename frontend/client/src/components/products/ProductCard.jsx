import React, { useState, useEffect } from "react"
import { motion as Motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { Badge } from "../ui/badge"
import RatingStars from "./RatingStars"
import { Heart, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useWishlist } from "../../hooks/useWishlist"

const ProductCard = ({ product, onQuickView }) => {
	const navigate = useNavigate()
	const [isInWishlist, setIsInWishlist] = useState(false)
	const { addToWishlist, removeFromWishlist, isInWishlist: checkWishlistStatus } = useWishlist()
	const originalPrice = product.price + 200
	const discount = Math.max(5, Math.min(60, Math.round(100 - (product.price / originalPrice) * 100)))

	// Check wishlist status on component mount
	useEffect(() => {
		const checkStatus = async () => {
			if (localStorage.getItem('token')) {
				const status = await checkWishlistStatus(product.id)
				setIsInWishlist(status)
			}
		}
		checkStatus()
	}, [product.id, checkWishlistStatus])

	const handleCardClick = (e) => {
		// Don't navigate if clicking on buttons
		if (e.target.closest('button')) {
			return
		}
		navigate(`/products/${product.id}`)
	}

	const handleWishlistClick = async (e) => {
		e.stopPropagation()
		
		if (!localStorage.getItem('token')) {
			alert('Please login to add products to wishlist')
			navigate('/login')
			return
		}

		try {
			if (isInWishlist) {
				await removeFromWishlist(product.id)
				setIsInWishlist(false)
			} else {
				await addToWishlist(product.id)
				setIsInWishlist(true)
			}
		} catch (err) {
			console.error('Wishlist operation failed:', err)
			alert(err.message || 'Failed to update wishlist')
		}
	}

	return (
		<Motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
		>
			<Card 
				className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
				onClick={handleCardClick}
			>
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
							className="aspect-square w-full object-cover transition-transform duration-300 group-hover:rotate-[0deg] group-hover:scale-105"
						/>

					{/* Bottom action bar (appears on hover) */}
					<div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm opacity-0 translate-y-2 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
							<button 
								aria-label="Wishlist" 
								className={`rounded-full p-1.5 transition-colors ${
									isInWishlist 
										? 'text-red-500 hover:bg-red-50' 
										: 'text-foreground/80 hover:bg-black/5'
								}`}
								onClick={handleWishlistClick}
							>
								<Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
							</button>
							<div className="text-right">
								<p className="text-[11px] text-muted-foreground line-through">₹{originalPrice}</p>
								<p className="text-base font-bold">₹{product.price}</p>
							</div>
							<button 
								aria-label="Quick view" 
								className="rounded-full p-1.5 text-foreground/80 hover:bg-black/5"
								onClick={(e) => {
									e.stopPropagation()
									onQuickView(product)
								}}
							>
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
	</Motion.div>
)
}
export default ProductCard


