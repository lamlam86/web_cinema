"use client";
import { useCart } from "@/contexts/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer__header">
          <h3>Giỏ hàng</h3>
          <button className="cart-drawer__close" onClick={closeCart}>✕</button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-drawer__item">
                {item.image && (
                  <img src={item.image} alt={item.name} className="cart-drawer__item-img" />
                )}
                <div className="cart-drawer__item-info">
                  <h4>{item.name}</h4>
                  <p>{formatCurrency(item.price)}</p>
                </div>
                <div className="cart-drawer__item-qty">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="cart-drawer__item-remove" onClick={() => removeItem(item.id)}>
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Tổng cộng:</span>
              <strong>{formatCurrency(totalPrice)}</strong>
            </div>
            <button className="btn-login" style={{ marginTop: 12 }}>
              Thanh toán
            </button>
            <button
              className="btn-viewmore"
              style={{ marginTop: 8, width: "100%" }}
              onClick={clearCart}
            >
              Xóa giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
