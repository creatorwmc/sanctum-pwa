// Feature flags for Practice Space
// Toggle features on/off without removing code

export const featureFlags = {
  // Helper System (Onboarding Flow)
  // Now account-based - triggers after sign-up for new users
  // This flag controls whether the "Redo Onboarding" option appears in Settings
  HELPER_SYSTEM_ENABLED: true,

  // Future feature flags can be added here
  // SOME_OTHER_FEATURE: true,
}

// Helper function to check flags
export function isFeatureEnabled(flagName) {
  return featureFlags[flagName] === true
}
