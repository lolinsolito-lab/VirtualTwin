/**
 * Feature Flags
 * Control visibility of features and plans
 */

export const FEATURE_FLAGS = {
    /**
     * Aspirante Plan Launch Date
     * Planned: March 15, 2026
     * Current: VISIBLE for testing
     */
    ASPIRANTE_LAUNCH_DATE: new Date('2026-03-15T00:00:00+01:00'),

    /**
     * Show Aspirante Plan
     * true = visible (testing phase)
     * false = hidden (pre-launch)
     * auto = visible after launch date
     */
    showAspirante: true, // ← VISIBLE for testing NOW

    /**
     * Auto-show Aspirante after launch date
     * Use this for production after testing
     */
    showAspiranteAuto: () => {
        return new Date() >= FEATURE_FLAGS.ASPIRANTE_LAUNCH_DATE;
    }
};

/**
 * Check if Aspirante should be visible
 * During testing: always true
 * After testing: based on date
 */
export function isAspiranteVisible(): boolean {
    return FEATURE_FLAGS.showAspirante;
}
