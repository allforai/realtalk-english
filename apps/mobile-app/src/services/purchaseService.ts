// Source: design.md TS003 -- react-native-purchases stub
// # DEFERRED -- Subscription management via RevenueCat
//
// This service wraps react-native-purchases for IAP/subscription management.
// Subscription truth lives on the backend (synced via RevenueCat webhook).
// Client status is display cache only.

// import Purchases from 'react-native-purchases';

/**
 * Initialize RevenueCat SDK.
 * Call once during app startup after authentication.
 */
export async function initializePurchases(_userId: string): Promise<void> {
  // TODO: Implement when subscription flow is active
  // await Purchases.configure({
  //   apiKey: Platform.OS === 'ios' ? 'appl_xxx' : 'goog_xxx',
  //   appUserID: userId,
  // });
}

/**
 * Get current subscription status (cached locally).
 */
export async function getSubscriptionStatus(): Promise<{
  isActive: boolean;
  plan: string | null;
  expiresAt: string | null;
}> {
  // TODO: Implement when subscription flow is active
  return { isActive: false, plan: null, expiresAt: null };
}

/**
 * Present paywall for subscription purchase.
 */
export async function presentPaywall(): Promise<boolean> {
  // TODO: Implement when subscription flow is active
  return false;
}

/**
 * Restore previous purchases.
 */
export async function restorePurchases(): Promise<boolean> {
  // TODO: Implement when subscription flow is active
  return false;
}
