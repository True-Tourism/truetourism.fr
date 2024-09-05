const stripe = Stripe("FIXME");

(async () => {
  await initialize();

  console.log('Stripe Initialized');
})()

async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("https://local.functions.nhost.run/v1/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);

    const { clientSecret, sessionId } = await response.json();

    console.log(clientSecret);
    console.log(sessionId);

    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}