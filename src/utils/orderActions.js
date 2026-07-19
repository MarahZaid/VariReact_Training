import { ref, get, set, remove } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

async function getNextOrderId() {
  const snapshot = await get(ref(db, "orders"));

  if (!snapshot.exists()) {
    return "ord1";
  }

  const orders = snapshot.val();
  const numbers = Object.keys(orders)
    .map((key) => parseInt(key.replace("ord", ""), 10))
    .filter((n) => !isNaN(n));

  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `ord${maxNumber + 1}`;
}

export async function createOrderFromCart({ uid, customerName, customerEmail, cartEntries, products }) {
  const items = cartEntries
    .map(([, item]) => {
      const product = products[item.productId];
      if (!product) return null;
      return {
        productId: item.productId,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        color: item.color,
      };
    })
    .filter(Boolean);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderId = await getNextOrderId();

  await set(ref(db, `orders/${orderId}`), {
    customerName,
    customerEmail,
    items,
    totalAmount,
    status: "pending",
    createdAt: Date.now(),
  });

 
  await remove(ref(db, `carts/${uid}`));

  return orderId;
}