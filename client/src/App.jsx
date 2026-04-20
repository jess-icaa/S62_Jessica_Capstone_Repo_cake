import React, { useState, useEffect } from "react";
import "./styles.css";
import { Search, ShoppingCart, User } from "lucide-react";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import axios from "axios";
import CakeDesigner from "./pages/CakeDesigner";
import CakeCustomizer from "./pages/CakeCustomizer";
const API = import.meta.env.VITE_API_URL;

function CakeGallery({ cakes, onCakeClick, onBackToHome }) {
  return (
    <div className="gallery">
      <button className="back-button" onClick={onBackToHome}>← Back to Home</button>

      <h2>Choose Your Cake</h2>

      <div className="cake-grid">
        {cakes.map((cake) => (
          <div key={cake._id} className="cake-card" onClick={() => onCakeClick(cake)}>
            <img src={cake.image} alt={cake.name} className="cake-image" />
            <p>{cake.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CakeDetail({ cake, onBack, onAddToCart }) {

  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const res = await axios.get(
          `${API}/api/reviews/${cake._id}`
        );

        setReviews(res.data);

      } catch (error) {

        console.error("Error fetching reviews:", error);

      }

    };

    fetchReviews();

  }, [cake]);

  const submitReview = async () => {

    try {

      const res = await axios.post(
        `${API}/api/reviews`,
        {
          cakeId: cake._id,
          name,
          rating,
          comment
        }
      );

      setReviews([res.data, ...reviews]);

      setName("");
      setRating(5);
      setComment("");

    } catch (error) {

      console.error("Review submission failed:", error);

    }

  };

  return (

    <div className="cake-detail">

      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      {/* CAKE INFO */}

      <div className="detail-content">

        <img
          src={cake.image}
          alt={cake.name}
          className="detail-image"
        />

        <div className="detail-info">

          <h2>{cake.name}</h2>

          <p>{cake.description}</p>

          <p className="cake-price">
            ₹{cake.price.medium}
          </p>

          <button
            className="add-to-cart"
            onClick={() => onAddToCart(cake)}
          >
            Add to Cart
          </button>

        </div>

      </div>

      {/* REVIEW FORM */}

      <div className="review-form">

        <h3>Leave a Review for this Cake</h3>

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="star-rating">

          {[1,2,3,4,5].map(star => (

            <span
              key={star}
              className={star <= rating ? "star active" : "star"}
              onClick={() => setRating(star)}
            >
              ⭐
            </span>

          ))}

        </div>

        <textarea
          placeholder="Write your review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={submitReview}>
          Submit Review
        </button>

      </div>

      {/* REVIEWS LIST */}

      <div className="cake-reviews">

        <h3>Customer Reviews</h3>

        {reviews.length === 0
          ? <p>No reviews yet</p>
          : reviews.map(review => (

            <div key={review._id} className="review-card">

              <h4>{review.name}</h4>

              <p>{"⭐".repeat(review.rating)}</p>

              <p>{review.comment}</p>

            </div>

          ))
        }

      </div>

    </div>

  );

}
function UserProfile({ onBack, onDeleteAccount }) {
  return (
    <div className="user-profile">
      <button className="back-button" onClick={onBack}>← Back</button>

      <div className="profile-content">
        <h2>User Profile</h2>
        <p><strong>Name:</strong> Jesmer Customer</p>
        <p><strong>Email:</strong> jesmercakes@gmail.com</p>
        <p><strong>Orders:</strong> 3 previous cakes</p>
      </div>
      <button
  onClick={onDeleteAccount}
  style={{
    marginTop: "20px",
    backgroundColor: "#ff4d4d",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Delete Account
</button>
    </div>
  );
}

function CartView({ cartItems, onClose, onUpdateQuantity, onDeleteItem, clearCart }) {

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const placeOrder = async () => {

    try {

      await axios.post(`${API}/api/orders`, {
        items: cartItems.map(item => ({
          cakeId: item._id,
          quantity: item.quantity,
          size: "medium"
        })),
        totalPrice: getTotal(),
        deliveryAddress: "Bangalore"
      });

      alert("Order placed successfully!");

      clearCart();
      onClose();

    } catch (error) {

      console.error(error);
      alert("Order failed");

    }

  };

  return (
    <div className="cart-view">

      <button className="back-button" onClick={onClose}>
        ← Back
      </button>

      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">

          {cartItems.map(item => (
            <div key={item._id} className="cart-item">

              {/* ✅ FIXED IMAGE HANDLING */}
              {item.image ? (
                <img src={item.image} alt={item.name} className="cart-image" />
              ) : (
                <div className="cart-image">
                  🎂
                </div>
              )}

              <div className="item-details">

                <h3>{item.name}</h3>

                <p>₹{item.price} × {item.quantity}</p>

                <div className="quantity-controls">

                  <button
                    disabled={item.quantity === 1}
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>

                </div>

                <button onClick={() => onDeleteItem(item._id)}>
                  Delete
                </button>

              </div>

            </div>
          ))}

          <div className="cart-total">
            <strong>Total:</strong> ₹{getTotal()}
          </div>

          <button className="checkout-btn" onClick={placeOrder}>
            Checkout
          </button>

        </div>
      )}

    </div>
  );
}

function App() {

  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCake, setSelectedCake] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cakes, setCakes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const[showDesigner, setShowDesigner] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

const handleAddToCart = (cake) => {

  setCartItems(prev => {

    const existing = prev.find(item => item._id === cake._id);

    if (existing) {
      return prev.map(item =>
        item._id === cake._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...prev,
      {
        _id: cake._id,
        name: cake.name,
        image: cake.image,

        // ✅ FIX — supports BOTH normal + custom cakes
        price: typeof cake.price === "object"
          ? cake.price.medium
          : cake.price,

        quantity: 1
      }
    ];

  });

};

  const handleUpdateQuantity = (id, newQty) => {

    if (newQty <= 0) return;

    setCartItems(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: newQty }
          : item
      )
    );

  };

  const handleDeleteItem = (id) => {

    setCartItems(prev =>
      prev.filter(item => item._id !== id)
    );

  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }

  }, []);

  const submitReview = async () => {

    try {

      const res = await axios.post(`${API}/api/reviews`, {
        name,
        rating,
        comment
      });

      setReviews([res.data, ...reviews]);

      setName("");
      setRating(5);
      setComment("");

    } catch (error) {

      console.error("Review failed:", error);

    }

  };

  const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API}/api/auth/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // logout + reset state
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowDashboard(false);
    setShowProfile(false);

    alert("Account deleted successfully");

  } catch (error) {
    console.error(error);
    alert("Failed to delete account");
  }
};

  useEffect(() => {

    const fetchCakes = async () => {

      try {

        const res = await axios.get(`${API}/api/cakes`);
        setCakes(res.data);

      } catch (error) {

        console.error("Error fetching cakes:", error);

      }

    };

    fetchCakes();

  }, []);

  const filteredCakes = cakes.filter(cake =>
    cake.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {

    const fetchReviews = async () => {

      const res = await axios.get(`${API}/api/reviews`);
      setReviews(res.data);

    };

    fetchReviews();

  }, []);

  return (
    <div className="app-container">

      <header className="navbar">

        <div className="nav-left">
          <img src="/jesmer.png" className="logo-img" alt="Jesmer Cakes"/>
          <span className="logo-text">Jesmer Cakes</span>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Type in your cravings...."
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowGallery(true);
            }}
          />
          <Search size={18} />
        </div>

        <div className="navbar-right">

          <ShoppingCart size={24} onClick={() => setShowCart(true)} />

          {isLoggedIn && (
            <User size={24} onClick={() => setShowProfile(true)} />
          )}

          {!isLoggedIn ? (
            <button onClick={() => setShowLogin(true)}>Login</button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                setIsAdmin(false);
                setShowDashboard(false);
              }}
            >
              Logout
            </button>
          )}

        </div>

      </header>

      {showLogin ? (
        <Login
          setIsAdmin={setIsAdmin}
          setShowDashboard={setShowDashboard}
          setIsLoggedIn={setIsLoggedIn}
          setShowLogin={setShowLogin}
        />
      ) : showDashboard && isAdmin ? (
        <AdminDashboard />
      ) : showProfile ? (
        <UserProfile 
        onBack={() => setShowProfile(false)}
        onDeleteAccount={handleDeleteAccount}
         />
      ) : showCart ? (
        <CartView
          cartItems={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onDeleteItem={handleDeleteItem}
          clearCart={clearCart}
          />
        ) : showDesigner ? (
          <CakeDesigner 
          onBack={() => setShowDesigner(false)}
          onAddToCart={handleAddToCart} 
          />
        ) :showCustomizer ? (
          <CakeCustomizer
            onBack={() => setShowCustomizer(false)}
            onAddToCart={handleAddToCart}
          />
        ) : selectedCake ? (
        <CakeDetail
          cake={selectedCake}
          onBack={() => setSelectedCake(null)}
          onAddToCart={handleAddToCart}
        />
      ) : showGallery ? (
        <CakeGallery
          cakes={filteredCakes}
          onCakeClick={setSelectedCake}
          onBackToHome={() => setShowGallery(false)}
        />
      ) : (
        <>
          <div className="welcome-message">
            <p>Welcome to Jesmer!</p>
          </div>

          <section className="hero">

            <div className="hero-text">
              <h1>Delight in Every Bite!</h1>
              <p>Freshly baked cakes crafted with love.</p>

              <button
                className="cta-button"
                onClick={() => setShowGallery(true)}
              >
                Place Your Order
              </button>

              <button
                className="cta-button"
                onClick={() => setShowDesigner(true)}
              >
                ✨ Design Your Dream Cake
              </button>

              <button className="cta-button"
              onClick={() => setShowCustomizer(true)}
              >
                🎂 3D Cake Customizer
              </button>
            </div>

            <div className="hero-image">
              <img src="/cakeintro2.jpeg" alt="Hero Cake" />
            </div>

          </section>

          <section className="reviews">

            <h2>Customer Reviews</h2>

            <div className="reviews-grid">

              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="review-card">
                    <h3>{review.name}</h3>
                    <p>{"⭐".repeat(review.rating)}</p>
                    <p>{review.comment}</p>
                  </div>
                ))
              )}

            </div>

          </section>

          <div className="review-form">

            <h3>Leave a Review</h3>

            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="star-rating">
              {[1,2,3,4,5].map((star) => (
                <span
                key={star}
                className={star <= rating ? "star active" : "star"}
                onClick={() => setRating(star)}
                >
                ⭐
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button onClick={submitReview}>
              Submit Review
            </button>

          </div>

        </>
      )}

    </div>
  );
}

export default App;