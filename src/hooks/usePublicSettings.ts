import { useEffect, useState } from 'react'
import { PublicSettings, settingsApi } from '@/lib/api/settings'

const defaultSettings: PublicSettings = {
  bankName: import.meta.env.VITE_BANK_NAME || 'Bank Name',
  bankAccountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'Account Name',
  bankAccountNumber: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '',
  loginLogoUrl: '/icons/12.jpg',
  availableCategories: [],
}

export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    settingsApi
      .getPublic()
      .then((data) => {
        if (mounted) {
          setSettings(data)
        }
      })
      .catch(() => {
        // Keep env fallback if API fails
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { settings, loading }
}
