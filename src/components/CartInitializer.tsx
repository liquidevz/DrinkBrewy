"use client";

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export default function CartInitializer() {
  const { initializeCart } = useCart();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  return null;
}