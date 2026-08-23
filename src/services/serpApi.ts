export interface ShoppingProduct {
  title: string;
  price: string;
  source: string;
  link: string;
  thumbnail: string;
  rating: number;
  reviews: number;
}

export async function fetchLiveShoppingProducts(query?: string): Promise<ShoppingProduct[]> {
  const searchQuery = query || "Hyaluronic Acid Hydration Serum Skincare";
  try {
    const res = await fetch(`/api/serp/shopping?q=${encodeURIComponent(searchQuery)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.shopping_results && data.shopping_results.length > 0) {
        return data.shopping_results;
      }
    }
  } catch (err) {
    console.warn("SerpApi proxy fetch note:", err);
  }

  // Graceful fallback products
  return [
    { title: "Hyaluronic Acid 3D Hydration Serum", price: "$46.00", source: "Sephora Beauty", link: "#", thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80", rating: 4.9, reviews: 312 },
    { title: "Niacinamide Spot Correcting Serum", price: "$52.00", source: "Ulta Beauty", link: "#", thumbnail: "https://images.unsplash.com/photo-1608248597263-0057e57b4524?w=200&auto=format&fit=crop&q=80", rating: 4.8, reviews: 245 },
    { title: "Ceramide Barrier Defense Cream", price: "$58.00", source: "Dermstore", link: "#", thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80", rating: 4.7, reviews: 189 }
  ];
}
