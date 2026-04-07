import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload a file to Firebase Storage under products/
 * Returns the public download URL.
 * onProgress(0–100) is called during upload.
 */
export async function uploadProductImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Sanitise filename: timestamp + original name (spaces → underscores)
  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const storageRef = ref(storage, `products/${safeName}`)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    })

    task.on(
      'state_changed',
      snapshot => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress?.(pct)
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        } catch (e) {
          reject(e)
        }
      }
    )
  })
}

/**
 * Delete a file from Firebase Storage by its full download URL.
 * Fails silently if the file doesn't exist.
 */
export async function deleteProductImage(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch {
    // ignore – file may already be gone
  }
}
