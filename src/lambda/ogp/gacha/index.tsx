import { APIGatewayProxyEvent } from 'aws-lambda'
import satori from 'satori'
import sharp from 'sharp'
import { OgpGacha, type GachaResult } from './components/OgpGacha'
import { DEFAULT_FONTS } from '@/config/font'

export const index = async (event: APIGatewayProxyEvent) => {
  const resultsParam = event.queryStringParameters?.results || ''
  const results: GachaResult[] = resultsParam
    .split('')
    .map((result) => Number(result))
    .filter((result) => result === 0 || result === 1 || result === 2)
    .sort((a, b) => b - a)

  try {
    const svg = await satori(<OgpGacha results={results} />, {
      width: 1200,
      height: 630,
      fonts: DEFAULT_FONTS,
    })

    const pngBuffer = await sharp(Buffer.from(svg)).resize(1200, 630).png().toBuffer()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
      body: pngBuffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    console.error('Error generating image:', error)
    const details = error instanceof Error ? error.message : 'Unknown error'
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate image',
        details,
      }),
    }
  }
}
