"use client";

import { useState } from 'react';
import { Center, Environment, View } from "@react-three/drei";
import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { useCart } from "@/hooks/useCart";
import { FrontendProduct } from '@/lib/shopify-products';
import { Bubbles } from '@/slices/Hero/Bubbles';

const FLAVOR_MAP: Record<string, SodaCanProps["flavor"]> = {
  'blackCherry': 'blackCherry',
  'grape': 'grape',
  'lemonLime': 'lemonLime', 
  'strawberryLemonade': 'strawberryLemonade',
  'watermelon': 'watermelon'
};

interface ProductViewProps {
  product: FrontendProduct;
}

export default function ProductView({ product }: ProductViewProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const flavorKey = FLAVOR_MAP[product.flavor] || 'blackCherry';

  const handleAddToCart = async () => {
    await addItem(selectedVariant.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream relative">
      {/* Full page bubbles background */}
      <View className="fixed inset-0 pointer-events-none z-0">
        <Bubbles count={200} speed={2} bubbleSize={0.02} opacity={0.2} />
      </View>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 3D Model */}
          <div className="aspect-square">
            <View className="h-full w-full">
              <Center position={[0, 0, 1]} scale={0.8}>
                <group
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => {
                    if (e.buttons === 1) {
                      e.object.rotation.y += e.movementX * 0.01;
                      e.object.rotation.x += e.movementY * 0.01;
                    }
                  }}
                >
                  <FloatingCan
                    floatIntensity={0.3}
                    rotationIntensity={0.8}
                    flavor={flavorKey}
                  />
                </group>
              </Center>
              <Bubbles count={150} speed={3} bubbleSize={0.03} opacity={0.3} />
              <Environment
                files="/hdr/lobby.hdr"
                environmentIntensity={0.6}
                environmentRotation={[0, 3, 0]}
              />
              <directionalLight intensity={6} position={[0, 1, 1]} />
            </View>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Options:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                        selectedVariant.id === variant.id
                          ? 'border-[#C41E3A] bg-[#C41E3A] text-white'
                          : 'border-gray-300 hover:border-[#C41E3A]'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="text-3xl font-bold">
              ₹{selectedVariant.price}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant.availableForSale}
              className="w-full bg-[#C41E3A] text-white py-4 px-8 rounded-lg font-bold text-lg uppercase hover:bg-[#A3182F] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? "Added!" : selectedVariant.availableForSale ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center p-4 bg-cream/50 rounded-lg shadow-sm">
                <div className="font-bold text-[#C41E3A]">Zero Sugar</div>
                <div className="text-sm text-gray-600">Guilt-free enjoyment</div>
              </div>
              <div className="text-center p-4 bg-cream/50 rounded-lg shadow-sm">
                <div className="font-bold text-[#C41E3A]">Plant-Based</div>
                <div className="text-sm text-gray-600">Natural ingredients</div>
              </div>
              <div className="text-center p-4 bg-cream/50 rounded-lg shadow-sm">
                <div className="font-bold text-[#C41E3A]">Prebiotics</div>
                <div className="text-sm text-gray-600">Good for gut health</div>
              </div>
              <div className="text-center p-4 bg-cream/50 rounded-lg shadow-sm">
                <div className="font-bold text-[#C41E3A]">Low Cal</div>
                <div className="text-sm text-gray-600">Health conscious</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}