// Feature flags for Practice Space
// Toggle features on/off without removing code

export const featureFlags = {
  // Helper System (Onboarding Flow)
  // Set to false to skip onboarding and go straight to main app
  // Set to true to enable the onboarding experience
  HELPER_SYSTEM_ENABLED: false,

  // Future feature flags can be added here
  // SOME_OTHER_FEATURE: true,
}

// Helper function to check flags
export function isFeatureEnabled(flagName) {
  return featureFlags[flagName] === true
}
