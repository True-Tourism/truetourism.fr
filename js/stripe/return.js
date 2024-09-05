initialize();

async function initialize() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get('session_id');
  const response = await fetch(`https://local.functions.nhost.run/v1/stripe/session-status?session_id=${sessionId}`);
  const session = await response.json();

  if (session.status == 'open') {
    window.replace('http://127.0.0.1:4000/stripe/checkout')
  } else if (session.status == 'complete') {
    document.getElementById('success').classList.remove('hidden');
    document.getElementById('customer-email').textContent = session.customer_email
  }
}