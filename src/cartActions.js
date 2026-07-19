import { ref, set, remove } from "firebase/database";
import { db } from "./firebase/firebaseConfig";

// ينظف اسم اللون عشان يصير صالح كجزء من Firebase key
function sanitizeForKey(str) {
  return str.replace(/[.#$/[\]]/g, "-");
}

function buildCartItemId(productId, color) {
  return `${productId}_${sanitizeForKey(color)}`;
}

export async function addToCart(uid, productId, color, currentQty = 0, amount = 1) {
  const itemId = buildCartItemId(productId, color);
  await set(ref(db, `carts/${uid}/${itemId}`), {
    productId,
    color,
    quantity: currentQty + amount,
  });
}

export async function setCartItemQuantity(uid, itemId, productId, color, quantity) {
  if (quantity <= 0) {
    await remove(ref(db, `carts/${uid}/${itemId}`));
  } else {
    await set(ref(db, `carts/${uid}/${itemId}`), { productId, color, quantity });
  }
}

export async function removeFromCart(uid, itemId) {
  await remove(ref(db, `carts/${uid}/${itemId}`));
}