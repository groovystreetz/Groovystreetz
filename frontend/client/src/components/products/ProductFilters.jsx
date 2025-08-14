import React, { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Slider } from "../ui/slider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { FITS, SIZES } from "./constants.js"

const ProductFilters = ({ priceRange, setPriceRange, sizes, setSizes, fits, setFits, sort, setSort }) => {
	const [internal, setInternal] = useState(priceRange)

	return (
		<aside className="w-72 shrink-0 space-y-6">
			<div>
				<h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Price</h3>
				<div className="px-1.5">
					<Slider
						value={internal}
						min={349}
						max={1999}
						step={50}
						onValueChange={setInternal}
						onValueCommit={setPriceRange}
					/>
					<div className="mt-2 flex items-center justify-between text-sm">
						<span>₹{internal[0]}</span>
						<span>₹{internal[1]}</span>
					</div>
				</div>
			</div>

			<div>
				<h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Size</h3>
				<div className="flex flex-wrap gap-2">
					{SIZES.map((s) => (
						<label
							key={s}
							className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${sizes.includes(s) ? 'bg-primary text-primary-foreground' : ''}`}
							onClick={() =>
								setSizes((prev) =>
									prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
								)
							}
						>
							{s}
						</label>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Fit / Type</h3>
				<div className="flex flex-wrap gap-2">
					{FITS.map((f) => (
						<label
							key={f}
							className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${fits.includes(f) ? 'bg-primary text-primary-foreground' : ''}`}
							onClick={() =>
								setFits((prev) =>
									prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
								)
							}
						>
							{f}
						</label>
					))}
				</div>
			</div>

			<div className="pt-2">
				<h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Sort</h3>
				<Select value={sort} onValueChange={setSort}>
					<SelectTrigger>
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="popularity">Popularity</SelectItem>
						<SelectItem value="price_asc">Price: Low to High</SelectItem>
						<SelectItem value="price_desc">Price: High to Low</SelectItem>
						<SelectItem value="new">New Arrivals</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</aside>
	)
}

export default ProductFilters


