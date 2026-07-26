import { ref, get, set, push } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export const SIGNUP_BONUS_POINTS = 50;
export const POINTS_PER_DOLLAR = 1;          
export const POINTS_TO_DOLLAR_RATE = 100;    

// ---- Internal helpers ----
async function logPointsTransaction({ customerId, type, amount, orderId = null }) {
  const newRef = push(ref(db, "pointsHistory"));
  await set(newRef, {
    customerId,
    type,        
    amount,      
    orderId,
    createdAt: Date.now(),
  });
}

async function addPoints(customerId, amount) {
  const customerRef = ref(db, `customers/${customerId}`);
  const snapshot = await get(customerRef);
  const current = snapshot.exists() ? snapshot.val().points || 0 : 0;
  const next = current + amount;
  await set(ref(db, `customers/${customerId}/points`), next);
  return next;
}

// ---- Public API ----
export async function awardSignupPoints(customerId) {
  await addPoints(customerId, SIGNUP_BONUS_POINTS);
  await logPointsTransaction({
    customerId,
    type: "signup",
    amount: SIGNUP_BONUS_POINTS,
  });
}

export async function awardOrderPoints(customerId, orderId, totalAmount) {
  const earned = Math.floor(totalAmount * POINTS_PER_DOLLAR);
  if (earned <= 0) return 0;

  await addPoints(customerId, earned);
  await logPointsTransaction({
    customerId,
    type: "order",
    amount: earned,
    orderId,
  });
  return earned;
}

export async function redeemPoints(customerId, pointsToRedeem) {
  const customerRef = ref(db, `customers/${customerId}`);
  const snapshot = await get(customerRef);
  const current = snapshot.exists() ? snapshot.val().points || 0 : 0;

  if (!pointsToRedeem || pointsToRedeem <= 0) {
    throw new Error("Points to redeem must be greater than zero.");
  }
  if (pointsToRedeem > current) {
    throw new Error("You don't have enough points for that.");
  }

  const next = current - pointsToRedeem;
  await set(ref(db, `customers/${customerId}/points`), next);
  await logPointsTransaction({
    customerId,
    type: "redeem",
    amount: -pointsToRedeem,
  });

  const discount = pointsToRedeem / POINTS_TO_DOLLAR_RATE;
  return { discount, remainingPoints: next };
}

export async function getPointsHistory(customerId) {
  const snapshot = await get(ref(db, "pointsHistory"));
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val())
    .map(([id, entry]) => ({ id, ...entry }))
    .filter((entry) => entry.customerId === customerId)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}