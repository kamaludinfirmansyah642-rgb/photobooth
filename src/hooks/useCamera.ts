import { useState, useEffect, useRef, useCallback } from 'react'

interface CameraState {
  stream: MediaStream | null
  error: string | null
  errorType: 'permission-denied' | 'not-found' | null
  isActive: boolean
}

export function useCamera() {
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    errorType: null,
    isActive: false,
  })
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isInitialized = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    if (isInitialized.current) return
    isInitialized.current = true

    const constraints: MediaStreamConstraints = {
      video: true,
      audio: false
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = mediaStream

      setState({
        stream: mediaStream,
        error: null,
        errorType: null,
        isActive: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      let errorMessage = 'Tidak dapat mengakses kamera.'
      let errorType: 'permission-denied' | 'not-found' | null = null

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorType = 'permission-denied'
          errorMessage = 'Izin kamera ditolak. Klik ikon kamera/lock di address bar untuk mengizinkan.'
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorType = 'not-found'
          errorMessage = 'Kamera tidak ditemukan. Pastikan kamera terpasang.'
        } else {
          errorMessage = `Error: ${err.message || err.name}`
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      console.error('Camera error:', err)

      setState({
        stream: null,
        error: errorMessage,
        errorType,
        isActive: false,
      })
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    isInitialized.current = false
    
    setState({
      stream: null,
      error: null,
      errorType: null,
      isActive: false,
    })
  }, [])

  const retryCamera = useCallback(() => {
    isInitialized.current = false
    setState(prev => ({ ...prev, error: null, errorType: null }))
    startCamera()
  }, [startCamera])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  return {
    ...state,
    videoRef,
    startCamera,
    stopCamera,
    retryCamera,
  }
}