"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState, useEffect } from "react";
import { Center, Environment, View } from "@react-three/drei";
import FloatingCan from "@/components/FloatingCan";
import { getShopifyProducts, FrontendProduct } from "@/lib/shopify-products";
import { SodaCanProps } from "@/components/SodaCan";
import Carousel from "@/slices/Carousel";

const CarouselComponent = ({ products }: { products: FrontendProduct[] }) => {
  return <Carousel heading=" " priceCopy="Starting at ₹99" />;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const shopifyProducts = await getShopifyProducts();
        setProducts(shopifyProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FEF3E2] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center text-5xl font-black uppercase md:text-6xl">YOUR PERFECT +1</h2>
        <p className="mb-16 text-center text-sm">in 4 perfect flavours</p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl">Loading products...</p>
          </div>
        ) : (
          <CarouselComponent products={products} />
        )}
      </div>

      <style jsx global>{`
        .product-carousel {
          overflow: visible !important;
          padding: 40px 0;
        }
        .product-carousel .swiper-wrapper {
          align-items: center;
        }
        .product-carousel .swiper-slide {
          transition: transform 0.3s ease;
          opacity: 1;
        }
        .product-carousel .swiper-slide:not(.swiper-slide-active) {
          transform: scale(0.75);
        }
        .product-carousel .swiper-button-next,
        .product-carousel .swiper-button-prev {
          color: #000;
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid #000;
          box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }
        .product-carousel .swiper-button-next:after,
        .product-carousel .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
}
