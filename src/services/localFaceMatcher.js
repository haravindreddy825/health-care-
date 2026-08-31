/**
 * Anonymous Device Profile Manager (100% Privacy-Preserving)
 * 
 * STRICT PRIVACY GUARANTEES:
 * 1. NO facial biometric identification or facial templates connected to health records.
 * 2. NO face embeddings or camera images stored or uploaded to any database.
 * 3. Camera is used SOLELY for live presence detection, posture estimation, and fatigue detection.
 * 4. Returning-session continuity is linked via an anonymous local device profile ID
 *    stored locally on this device (e.g. 'smart_mirror_profile_id').
 */

const STORAGE_KEY = 'smart_mirror_profile_id'

export class LocalDeviceProfileManager {
  /**
   * Retrieves or creates an anonymous device profile identifier
   */
  getProfileId() {
    try {
      if (typeof localStorage === 'undefined') return 'mirror_person_01'
      let pid = localStorage.getItem(STORAGE_KEY)
      if (!pid) {
        // Generate random anonymous UUID for new device
        const randomToken = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID().slice(0, 8)
          : Math.random().toString(36).substring(2, 10)
        pid = `mirror_person_${randomToken}`
        localStorage.setItem(STORAGE_KEY, pid)
      }
      return pid
    } catch (e) {
      return 'mirror_person_01'
    }
  }

  /**
   * Checks if this device has recorded sessions previously
   */
  isReturningDevice() {
    try {
      if (typeof localStorage === 'undefined') return false
      return Boolean(localStorage.getItem(STORAGE_KEY))
    } catch (e) {
      return false
    }
  }

  /**
   * Clears anonymous local profile token
   */
  clearProfile() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {}
  }

  /**
   * Presence identifier (Non-biometric, returns anonymous local device ID)
   */
  identifyOrRegisterPerson() {
    const profileId = this.getProfileId()
    return {
      profileId,
      isReturning: true
    }
  }
}

export const localFaceMatcher = new LocalDeviceProfileManager()
