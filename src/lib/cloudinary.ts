// Cloudinary upload utility with multiple cloud fallback
const CLOUDINARY_CLOUDS = [
  {
    name: import.meta.env.VITE_CLOUDINARY_CLOUD_A || 'doatnw5dx',
    preset: import.meta.env.VITE_CLOUDINARY_PRESET_A || 'robot_receipts',
  },
  {
    name: import.meta.env.VITE_CLOUDINARY_CLOUD_B || 'dfvmd6drf',
    preset: import.meta.env.VITE_CLOUDINARY_PRESET_B || 'robot_receipts',
  },
  {
    name: import.meta.env.VITE_CLOUDINARY_CLOUD_C || 'dncci4ypg',
    preset: import.meta.env.VITE_CLOUDINARY_PRESET_C || 'robot_receipts',
  },
  {
    name: import.meta.env.VITE_CLOUDINARY_CLOUD_D || 'dyez98wtv',
    preset: import.meta.env.VITE_CLOUDINARY_PRESET_D || 'robot_receipts',
  },
]

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // Randomly select starting cloud to distribute load
  const startIndex = Math.floor(Math.random() * CLOUDINARY_CLOUDS.length)
  
  // Try each cloud in rotation until success
  for (let i = 0; i < CLOUDINARY_CLOUDS.length; i++) {
    const cloudIndex = (startIndex + i) % CLOUDINARY_CLOUDS.length
    const cloud = CLOUDINARY_CLOUDS[cloudIndex]
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', cloud.preset)
      
      console.log(`Attempting upload to cloud ${cloudIndex + 1}: ${cloud.name}`)
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud.name}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      
      if (!response.ok) {
        console.error(`Cloud ${cloudIndex + 1} failed:`, response.statusText)
        continue // Try next cloud
      }
      
      const data = await response.json()
      console.log(`✓ Successfully uploaded to cloud ${cloudIndex + 1}`)
      return data.secure_url
    } catch (error) {
      console.error(`Cloud ${cloudIndex + 1} error:`, error)
      // Continue to next cloud
    }
  }
  
  // All clouds failed
  throw new Error('Failed to upload image to any Cloudinary cloud')
}
