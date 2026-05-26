import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface CapturedPhoto {
  id: string
  filename: string
  dataUrl: string
  blob: Blob | null
  capturedAt: Date
}

export function usePhotoCapture() {
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const capturePhoto = useCallback((
    videoElement: HTMLVideoElement
  ): CapturedPhoto | null => {
    if (!videoElement) {
      console.error('Video element tidak ditemukan')
      return null
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      console.error('Video belum siap, dimensi:', videoElement.videoWidth, videoElement.videoHeight)
      return null
    }

    try {
      setIsCapturing(true)

      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Tidak dapat membuat konteks canvas')
        return null
      }

      ctx.drawImage(videoElement, 0, 0)
      
      const dataUrl = canvas.toDataURL('image/png')
      const id = uuidv4()
      const filename = `photobooth_${Date.now()}.png`

      const photo: CapturedPhoto = {
        id,
        filename,
        dataUrl,
        blob: null,
        capturedAt: new Date(),
      }

      setCapturedPhoto(photo)
      console.log('Foto berhasil dicapture:', photo.filename)
      return photo
    } catch (err) {
      console.error('Gagal capture foto:', err)
      return null
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const download = useCallback((customFilename?: string) => {
    if (capturedPhoto) {
      const link = document.createElement('a')
      link.download = customFilename || capturedPhoto.filename
      link.href = capturedPhoto.dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [capturedPhoto])

  const clearPhoto = useCallback(() => {
    setCapturedPhoto(null)
  }, [])

  return {
    capturedPhoto,
    isCapturing,
    setIsCapturing,
    capturePhoto,
    download,
    clearPhoto,
  }
}