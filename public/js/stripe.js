/* eslint-disable */
import axios from 'axios';

export const bookTour = async (tourId) => {
  // 1) Initialize Stripe inside the function
  // This ensures Stripe is only called when the script is fully loaded
  const stripe = Stripe('pk_test_51Sl51MJwua1pODJSEGBBzuL7ZOgAWtDAPV5sPdiXltRIBb1x64UXQiZ9OTbVUyQ4LTQFPB4x6AghReCMeQVSgC4J00uJU3Nefs');

  try {
    // 2) Get checkout session from backend (Use relative path)
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    
    // 3) Redirect to checkout
    window.location.replace(session.data.session.url);
  } catch (err) {
    alert('Something went wrong: ' + err.message);
  }
};