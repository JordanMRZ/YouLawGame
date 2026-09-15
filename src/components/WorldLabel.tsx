import { useLayoutEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

export function WorldLabel({
  text,
  width = 4,
  color = '#ffffff',
  position = [0, 0, 0],
  outline = '#102030',
}: {
  text: string
  width?: number
  color?: string
  position?: [number, number, number]
  outline?: string
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return new CanvasTexture(canvas)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let size = text.length > 12 ? 64 : 92
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'
    do {
      ctx.font = `700 ${size}px Outfit, Segoe UI, sans-serif`
      size -= 4
    } while (ctx.measureText(text).width > 960 && size > 28)
    ctx.lineWidth = 16
    ctx.strokeStyle = outline
    ctx.strokeText(text, 512, 128)
    ctx.fillStyle = color
    ctx.fillText(text, 512, 128)
    const tex = new CanvasTexture(canvas)
    tex.colorSpace = SRGBColorSpace
    tex.needsUpdate = true
    return tex
  }, [text, color, outline])

  useLayoutEffect(() => () => texture.dispose(), [texture])

  return (
    <sprite position={position} scale={[width, width * 0.25, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  )
}
