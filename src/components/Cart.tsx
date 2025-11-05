"use client";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RazorpayCheckout from "@/components/RazorpayCheckout";

export default function Cart({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, updateQuantity, removeItem, clearCart, initializeCart, isLoading } = useCart();
  const [customer, setCustomer] = useState({ name: "", email: "", address: "" });
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    initializeCart();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const cartItems = cart?.lines || [];
  const total = cart?.cost.totalAmount.amount ? parseFloat(cart.cost.totalAmount.amount) : 0;

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

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
            {cartItems.length > 0 && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white backdrop-blur-sm">
                {cart?.totalQuantity || 0}
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
            {isLoading ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/70 py-8"
              >
                Loading...
              </motion.p>
            ) : cartItems.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-white/70 py-8"
              >
                Your cart is empty
              </motion.p>
            ) : ordered ? (
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-green-300 text-center py-8"
              >
                Redirecting to checkout...
              </motion.p>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {cartItems.map((item, index) => (
                  <div key={item.id} className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="h-20 w-20 bg-white/20 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-300">
                    <span className="text-xs text-white/70">3D Model</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">{item.merchandise.product.title}</h3>
                        <p className="text-sm text-white/70">{item.merchandise.title}</p>
                      </div>
                      <p className="font-bold text-white">{item.cost.totalAmount.currencyCode} {parseFloat(item.cost.totalAmount.amount).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-white/30 rounded-lg bg-white/10">
                        <button 
                          onClick={() => item.id && updateQuantity(item.id, item.merchandise.id, Math.max(1, item.quantity - 1))} 
                          className="p-2 hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white"
                          disabled={isLoading}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold text-white">{item.quantity}</span>
                        <button 
                          onClick={() => item.id && updateQuantity(item.id, item.merchandise.id, item.quantity + 1)} 
                          className="p-2 hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white"
                          disabled={isLoading}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => item.id && removeItem(item.id)} 
                        className="p-2 hover:bg-red-500/30 rounded-lg text-red-200 hover:text-white hover:scale-110 transition-all duration-300"
                        disabled={isLoading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {cartItems.length > 0 && !ordered && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 150, damping: 20 }}
              className="fixed bottom-0 w-full bg-white/10 backdrop-blur-md border-t border-white/20 p-6 space-y-4 md:right-0 md:max-w-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="font-bold text-lg text-white"
                  >
                    Total
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-white/70"
                  >
                    Taxes and shipping calculated at checkout.
                  </motion.p>
                </div>
                <motion.p 
                  key={total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-white"
                >
                  {cart?.cost.totalAmount.currencyCode} {parseFloat(cart?.cost.totalAmount.amount || '0').toFixed(2)}
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <RazorpayCheckout 
                  onSuccess={() => {
                    setOrdered(true);
                    setTimeout(() => { setOrdered(false); handleClose(); }, 2000);
                  }}
                  onError={(error) => {
                    console.error('Checkout error:', error);
                    alert('Payment failed. Please try again.');
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
