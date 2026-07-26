import { ref, get, set, remove } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { redeemPoints } from "./loyaltyActions";

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

export async function createOrderFromCart({
  uid,
  customerId = null,
  customerName,
  customerEmail,
  phone = "",
  shippingAddress = "",
  paymentMethod = "cash",
  cartEntries,
  products,
  pointsToRedeem = 0,
}) {
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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 && subtotal < 200 ? 15 : 0;
  const totalBeforeDiscount = subtotal + shippingFee;


  let pointsDiscount = 0;
  let redeemedPoints = 0;
  if (pointsToRedeem > 0 && customerId) {
    const { discount } = await redeemPoints(customerId, pointsToRedeem);
    pointsDiscount = Math.min(discount, totalBeforeDiscount);
    redeemedPoints = pointsToRedeem;
  }

  const totalAmount = Math.max(totalBeforeDiscount - pointsDiscount, 0);

  const orderId = await getNextOrderId();

  await set(ref(db, `orders/${orderId}`), {
    customerName,
    customerEmail,
    phone,
    shippingAddress,
    paymentMethod,
    items,
    subtotal,
    shippingFee,
    pointsRedeemed: redeemedPoints,
    pointsDiscount,
    totalAmount,
    status: "pending",
    createdAt: Date.now(),
  });

  await remove(ref(db, `carts/${uid}`));

  return orderId;
}