import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "./ProductCard"

const ProductGrid = ({ products, onQuickView }) => {
	return (
		<motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<AnimatePresence>
				{products.map((p) => (
					<ProductCard key={p.id} product={p} onQuickView={onQuickView} />
				))}
			</AnimatePresence>
		</motion.div>
	)
}

export default ProductGrid


