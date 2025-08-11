export const orders = [
  {
    id: "GS001234",
    date: "Dec 15, 2024",
    status: "Delivered",
    total: 154,
    items: 3,
    statusColor: "bg-green-500",
    products: [
      {
        name: "Groovy T-shirt",
        qty: 1,
        price: 50,
        image: "https://via.placeholder.com/48x48?text=Tee"
      },
      {
        name: "Streetz Cap",
        qty: 1,
        price: 24,
        image: "https://via.placeholder.com/48x48?text=Cap"
      },
      {
        name: "Sneakers",
        qty: 1,
        price: 80,
        image: "https://via.placeholder.com/48x48?text=Shoes"
      },
    ],
  },
  {
    id: "GS001235",
    date: "Dec 20, 2024",
    status: "In Transit",
    total: 89,
    items: 1,
    statusColor: "bg-blue-500",
    products: [
      {
        name: "Groovy Hoodie",
        qty: 1,
        price: 89,
        image: "https://via.placeholder.com/48x48?text=Hoodie"
      },
    ],
  },
  {
    id: "GS001236",
    date: "Dec 22, 2024",
    status: "Processing",
    total: 210,
    items: 2,
    statusColor: "bg-orange-500",
    products: [
      {
        name: "Groovy Jacket",
        qty: 1,
        price: 120,
        image: "https://via.placeholder.com/48x48?text=Jacket"
      },
      {
        name: "Streetz Jeans",
        qty: 1,
        price: 90,
        image: "https://via.placeholder.com/48x48?text=Jeans"
      },
    ],
  },
]