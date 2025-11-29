"use client";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShiprocketCheckout from "@/components/ShiprocketCheckout";

export default function Cart({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCart();
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const total = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-50 bg-black/50 transition-all duration-700 ease-out ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'}`}
      />
      <div
        className={`fixed z-50 bg-gradient-to-br from-[#C41E3A]/95 to-red-500/95 backdrop-blur-md shadow-2xl overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          md:right-0 md:top-0 md:h-full md:w-full md:max-w-md ${isOpen ? 'md:translate-x-0 md:scale-100' : 'md:translate-x-full md:scale-95'}
          max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[85vh] max-md:rounded-t-3xl ${isOpen ? 'max-md:translate-y-0 max-md:scale-100' : 'max-md:translate-y-full max-md:scale-95'}`}>
        <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black uppercase text-white">CART</h2>
            {items.length > 0 && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white backdrop-blur-sm">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 pb-64">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-white/70 py-8"
              >
                Your cart is empty
              </motion.p>
            ) : ordered ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">Order Placed!</h3>
                <p className="text-white/80">Thank you for your order</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-white/80 text-sm">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-white/20 rounded transition-all duration-200 text-white"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-white/20 rounded transition-all duration-200 text-white"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-2 hover:bg-red-500/30 rounded-lg transition-all duration-200 text-white"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && !ordered && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 p-6">
            <div className="flex justify-between items-center mb-4 text-white">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black">₹{total.toFixed(2)}</span>
            </div>
            <ShiprocketCheckout
              amount={total}
              items={items}
              onSuccess={() => {
                setOrdered(true);
                setTimeout(() => {
                  clearCart();
                  handleClose();
                }, 2000);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
