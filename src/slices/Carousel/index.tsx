"use client";

import { Center, Environment, View } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import clsx from "clsx";
import { Group } from "three";
import gsap from "gsap";

import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { ArrowIcon } from "./ArrowIcon";
import { WavyCircles } from "./WavyCircles";
import { CarouselSlice } from "@/data/content";
import { getShopifyProducts, FrontendProduct } from "@/lib/shopify-products";

const SPINS_ON_CHANGE = 8;
const FLAVOR_COLORS: Record<string, string> = {
  blackCherry: "#710523",
  grape: "#572981", 
  lemonLime: "#164405",
  strawberryLemonade: "#690B3D",
  watermelon: "#4B7002"
};

/**
 * Props for `Carousel`.
 */
export type CarouselProps = {
  slice: CarouselSlice;
};

/**
 * Component for "Carousel" Slices.
 */
const Carousel = ({ slice }: CarouselProps): JSX.Element => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sodaCanRef = useRef<Group>(null);
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  useEffect(() => {
    async function fetchProducts() {
      const shopifyProducts = await getShopifyProducts();
      setProducts(shopifyProducts);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const currentProduct = products[currentProductIndex];
  const currentColor = currentProduct ? FLAVOR_COLORS[currentProduct.flavor] || "#710523" : "#710523";

  function changeProduct(index: number) {
    if (!sodaCanRef.current || products.length === 0) return;

    const nextIndex = (index + products.length) % products.length;
    const nextColor = FLAVOR_COLORS[products[nextIndex].flavor] || "#710523";

    const tl = gsap.timeline();

    tl.to(
      sodaCanRef.current.rotation,
      {
        y:
          index > currentProductIndex
            ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
            : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: "power2.inOut",
        duration: 1,
      },
      0,
    )
      .to(
        ".background, .wavy-circles-outer, .wavy-circles-inner",
        {
          backgroundColor: nextColor,
          fill: nextColor,
          ease: "power2.inOut",
          duration: 1,
        },
        0,
      )
      .to(".text-wrapper", { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to({}, { onStart: () => setCurrentProductIndex(nextIndex) }, 0.5)
      .to(".text-wrapper", { duration: 0.2, y: 0, opacity: 1 }, 0.7);
  }

  function handleProductClick() {
    if (currentProduct) {
      router.push(`/products/${currentProduct.handle}`);
    }
  }

  return (
    <section
      data-slice-type={slice.type}
      data-slice-variation="default"
      className="carousel relative grid h-screen grid-rows-[auto,4fr,auto] justify-center overflow-hidden bg-white py-12 text-white"
    >

      <div className="background pointer-events-none absolute inset-0 opacity-50" style={{ backgroundColor: currentColor }} />

      <WavyCircles className="absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2" style={{ color: currentColor }} />

      <h2 className="relative text-center text-5xl font-bold">
        {slice.heading}
      </h2>

      <div className="flex justify-center items-center">
        <div className="aspect-square h-[70vmin] min-h-40 md:h-[60vmin] lg:h-[70vmin] relative">
          {!loading && products.length > 0 && (
            <View className="w-full h-full">
              <Center position={[0, 0, 1]} scale={isDesktop ? 0.8 : 1.0}>
                {products.map((product, index) => {
                  const offset = (index - currentProductIndex) * 2;
                  const isActive = index === currentProductIndex;
                  return (
                    <group key={`${product.id}-${index}`} position={[offset, 0, isActive ? 0 : -1]} scale={isActive ? 1 : 0.7}>
                      <FloatingCan
                        ref={isActive ? sodaCanRef : null}
                        floatIntensity={isActive ? 0.3 : 0.1}
                        rotationIntensity={isActive ? 1 : 0.3}
                        flavor={product.flavor as SodaCanProps["flavor"]}
                      />
                    </group>
                  );
                })}
              </Center>

              <Environment
                files="/hdr/lobby.hdr"
                environmentIntensity={0.6}
                environmentRotation={[0, 3, 0]}
              />
              <directionalLight intensity={6} position={[0, 1, 1]} />
            </View>
          )}
          {!loading && currentProduct && (
            <button 
              className="absolute inset-0 w-full h-full cursor-pointer bg-transparent border-none"
              onClick={handleProductClick}
              aria-label="View product details"
            />
          )}
        </div>
      </div>

      <div className="text-area relative mx-auto text-center">
        <div className="text-wrapper text-4xl font-medium">
          <p>{loading ? "Loading..." : currentProduct?.name || "No products available"}</p>
        </div>
        <div className="mt-2 text-2xl font-normal opacity-90">
          <p>{loading ? "" : currentProduct ? `₹${currentProduct.price}` : slice.price_copy}</p>
        </div>
      </div>
    </section>
  );
};

export default Carousel;

type ArrowButtonProps = {
  direction?: "right" | "left";
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function ArrowButton({
  label,
  onClick,
  direction = "right",
  disabled = false,
}: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "size-12 rounded-full border-2 border-white bg-white/10 p-3 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20",
        disabled ? "opacity-30 cursor-not-allowed" : "opacity-85 hover:opacity-100"
      )}
    >
      <ArrowIcon className={clsx(direction === "right" && "-scale-x-100")} />
      <span className="sr-only">{label}</span>
    </button>
  );
}