import type { Font } from 'satori'
import notoSansJpJapanese400Normal from '@/assets/fonts/noto-sans-jp-japanese-400-normal.woff'
import notoSansJpLatin400Normal from '@/assets/fonts/noto-sans-jp-latin-400-normal.woff'

export const DEFAULT_FONTS: Font[] = [
  {
    name: 'Noto Sans JP',
    data: notoSansJpJapanese400Normal,
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Noto Sans JP',
    data: notoSansJpLatin400Normal,
    weight: 400,
    style: 'normal',
  },
]
