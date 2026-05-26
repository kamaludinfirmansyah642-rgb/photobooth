export type AIOperation = 'cartoonize' | 'enhance' | 'style-transfer' | 'upscale'

interface AIApiConfig {
  endpoint: string
  apiKey?: string
  operation: AIOperation
}

interface AIApiResponse {
  success: boolean
  dataUrl?: string
  error?: string
}

const DEFAULT_API_CONFIG: Partial<AIApiConfig> = {
  endpoint: '/api/ai/process',
  operation: 'enhance',
}

export async function processImageWithAI(
  imageDataUrl: string,
  config: Partial<AIApiConfig> = {}
): Promise<AIApiResponse> {
  const finalConfig = { ...DEFAULT_API_CONFIG, ...config }
  
  try {
    const response = await fetch(finalConfig.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(finalConfig.apiKey && { 'Authorization': `Bearer ${finalConfig.apiKey}` }),
      },
      body: JSON.stringify({
        image: imageDataUrl,
        operation: finalConfig.operation,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    
    if (data.success && data.result) {
      return {
        success: true,
        dataUrl: data.result,
      }
    }

    return {
      success: false,
      error: data.error || 'Unknown error occurred',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

export async function cartoonizeImage(imageDataUrl: string): Promise<AIApiResponse> {
  return processImageWithAI(imageDataUrl, {
    operation: 'cartoonize',
  })
}

export async function enhanceImage(imageDataUrl: string): Promise<AIApiResponse> {
  return processImageWithAI(imageDataUrl, {
    operation: 'enhance',
  })
}

export async function applyStyleTransfer(
  imageDataUrl: string,
  style: string
): Promise<AIApiResponse> {
  return processImageWithAI(imageDataUrl, {
    operation: 'style-transfer',
    endpoint: `/api/ai/style-transfer?style=${style}`,
  })
}

export async function upscaleImage(imageDataUrl: string): Promise<AIApiResponse> {
  return processImageWithAI(imageDataUrl, {
    operation: 'upscale',
  })
}