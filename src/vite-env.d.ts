/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ADMIN_USERNAME: string
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_CLOUDINARY_CLOUD_A: string
  readonly VITE_CLOUDINARY_PRESET_A: string
  readonly VITE_CLOUDINARY_CLOUD_B: string
  readonly VITE_CLOUDINARY_PRESET_B: string
  readonly VITE_CLOUDINARY_CLOUD_C: string
  readonly VITE_CLOUDINARY_PRESET_C: string
  readonly VITE_CLOUDINARY_CLOUD_D: string
  readonly VITE_CLOUDINARY_PRESET_D: string
  readonly VITE_BANK_NAME: string
  readonly VITE_BANK_ACCOUNT_NAME: string
  readonly VITE_BANK_ACCOUNT_NUMBER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
