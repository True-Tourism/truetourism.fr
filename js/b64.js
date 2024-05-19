// Function to convert a hex string to a byte array
function hexToBytes(hex) {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Function to convert a byte array to a hex string
function bytesToHex(bytes) {
  let hex = '';
  for (let i = 0; i < 16; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Function to encode a UUID to a Base64 URL-safe string
function uuidToBase64Url(uuid) {
  // Remove hyphens from the UUID and convert to a byte array
  const bytes = hexToBytes(uuid.replace(/-/g, ''));
  // Convert to a Base64 string
  let base64 = btoa(String.fromCharCode.apply(null, bytes));
  // Make the Base64 string URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Function to decode a Base64 URL-safe string back to a UUID
function base64UrlToUuid(base64Url) {
  // Add padding to the Base64 string and make it standard
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (3 * base64Url.length) % 4);
  // Convert to a byte array
  const bytes = new Uint8Array([...atob(base64)].map(c => c.charCodeAt(0)));
  // Convert to a UUID string
  let uuid = bytesToHex(bytes);
  // Insert hyphens to the UUID string
  uuid = uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);
  return uuid;
}