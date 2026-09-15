import type { Cosmetics, ShopItem } from './types'

export const defaultCosmetics: Cosmetics = {
  skin: '#f0c7a0',
  hair: '#3a2a22',
  hairStyle: 'short',
  shirt: '#1f6f8b',
  shirtStyle: 'tee',
  pants: '#243447',
  shoes: '#1b1b1b',
  glasses: 'square',
  hat: 'none',
  backpack: 'none',
  scarf: false,
  watch: false,
}

export const starterOwned = [
  'skin-peach',
  'hair-brown',
  'style-short',
  'shirt-teal',
  'cut-tee',
  'pants-navy',
  'shoes-black',
  'glasses-square',
  'hat-none',
  'pack-none',
]

export const shopCatalog: ShopItem[] = [
  { id: 'skin-peach', name: 'Piel clara', category: 'skin', price: 0, patch: { skin: '#f0c7a0' } },
  { id: 'skin-warm', name: 'Piel morena', category: 'skin', price: 18, patch: { skin: '#c68642' } },
  { id: 'skin-deep', name: 'Piel oscura', category: 'skin', price: 18, patch: { skin: '#8d5524' } },
  { id: 'skin-rose', name: 'Piel rosada', category: 'skin', price: 22, patch: { skin: '#e8b4a0' } },

  { id: 'hair-brown', name: 'Cabello castaño', category: 'hair', price: 0, patch: { hair: '#3a2a22' } },
  { id: 'hair-black', name: 'Cabello negro', category: 'hair', price: 12, patch: { hair: '#1a1210' } },
  { id: 'hair-blond', name: 'Cabello rubio', category: 'hair', price: 16, patch: { hair: '#d4a017' } },
  { id: 'hair-red', name: 'Cabello rojo', category: 'hair', price: 20, patch: { hair: '#a33b20' } },
  { id: 'hair-mint', name: 'Cabello menta', category: 'hair', price: 36, patch: { hair: '#3ee0b3' } },
  { id: 'style-short', name: 'Corte corto', category: 'hair', price: 0, patch: { hairStyle: 'short' } },
  { id: 'style-spike', name: 'Picos', category: 'hair', price: 24, patch: { hairStyle: 'spike' } },
  { id: 'style-bun', name: 'Moño', category: 'hair', price: 28, patch: { hairStyle: 'bun' } },
  { id: 'style-long', name: 'Melena', category: 'hair', price: 32, patch: { hairStyle: 'long' } },

  { id: 'cut-tee', name: 'Camiseta', category: 'shirt', price: 0, patch: { shirtStyle: 'tee' } },
  { id: 'cut-hoodie', name: 'Sudadera', category: 'shirt', price: 40, patch: { shirtStyle: 'hoodie' } },
  { id: 'cut-blazer', name: 'Blazer', category: 'shirt', price: 55, patch: { shirtStyle: 'blazer' } },
  { id: 'shirt-teal', name: 'Teal', category: 'shirt', price: 0, patch: { shirt: '#1f6f8b' } },
  { id: 'shirt-mint', name: 'Menta', category: 'shirt', price: 14, patch: { shirt: '#2a9d8f' } },
  { id: 'shirt-red', name: 'Carmesí', category: 'shirt', price: 14, patch: { shirt: '#9b2226' } },
  { id: 'shirt-navy', name: 'Navy', category: 'shirt', price: 14, patch: { shirt: '#343a40' } },
  { id: 'shirt-blue', name: 'Azul aula', category: 'shirt', price: 18, patch: { shirt: '#4c6ef5' } },
  { id: 'shirt-gold', name: 'Dorado', category: 'shirt', price: 30, patch: { shirt: '#e9c46a' } },
  { id: 'shirt-pink', name: 'Rosa', category: 'shirt', price: 22, patch: { shirt: '#ff6b9d' } },

  { id: 'pants-navy', name: 'Pantalón navy', category: 'pants', price: 0, patch: { pants: '#243447' } },
  { id: 'pants-khaki', name: 'Khaki', category: 'pants', price: 16, patch: { pants: '#8d6e4c' } },
  { id: 'pants-black', name: 'Negro', category: 'pants', price: 16, patch: { pants: '#161616' } },
  { id: 'pants-denim', name: 'Mezclilla', category: 'pants', price: 20, patch: { pants: '#3d5a80' } },

  { id: 'shoes-black', name: 'Tenis negros', category: 'shoes', price: 0, patch: { shoes: '#1b1b1b' } },
  { id: 'shoes-white', name: 'Tenis blancos', category: 'shoes', price: 18, patch: { shoes: '#f4fbff' } },
  { id: 'shoes-red', name: 'Tenis rojos', category: 'shoes', price: 22, patch: { shoes: '#d64545' } },
  { id: 'shoes-gold', name: 'Tenis gold', category: 'shoes', price: 40, patch: { shoes: '#ffd166' } },

  { id: 'glasses-none', name: 'Sin lentes', category: 'glasses', price: 0, patch: { glasses: 'none' } },
  { id: 'glasses-square', name: 'Lentes cuadrados', category: 'glasses', price: 0, patch: { glasses: 'square' } },
  { id: 'glasses-round', name: 'Lentes redondos', category: 'glasses', price: 20, patch: { glasses: 'round' } },
  { id: 'glasses-sun', name: 'Lentes de sol', category: 'glasses', price: 26, patch: { glasses: 'sun' } },

  { id: 'hat-none', name: 'Sin gorro', category: 'hat', price: 0, patch: { hat: 'none' } },
  { id: 'hat-cap', name: 'Gorra', category: 'hat', price: 28, patch: { hat: 'cap' } },
  { id: 'hat-beanie', name: 'Gorro', category: 'hat', price: 28, patch: { hat: 'beanie' } },
  { id: 'hat-bow', name: 'Moño', category: 'hat', price: 34, patch: { hat: 'bow' } },

  { id: 'pack-none', name: 'Sin mochila', category: 'pack', price: 0, patch: { backpack: 'none' } },
  { id: 'pack-bag', name: 'Mochila', category: 'pack', price: 32, patch: { backpack: 'pack' } },
  { id: 'pack-satchel', name: 'Bolso', category: 'pack', price: 36, patch: { backpack: 'satchel' } },

  { id: 'scarf-on', name: 'Bufanda', category: 'extra', price: 24, patch: { scarf: true } },
  { id: 'scarf-off', name: 'Sin bufanda', category: 'extra', price: 0, patch: { scarf: false } },
  { id: 'watch-on', name: 'Reloj', category: 'extra', price: 30, patch: { watch: true } },
  { id: 'watch-off', name: 'Sin reloj', category: 'extra', price: 0, patch: { watch: false } },
]

export const shopCategories: { id: ShopItem['category']; label: string }[] = [
  { id: 'skin', label: 'Piel' },
  { id: 'hair', label: 'Cabello' },
  { id: 'shirt', label: 'Playera' },
  { id: 'pants', label: 'Pantalón' },
  { id: 'shoes', label: 'Zapatos' },
  { id: 'glasses', label: 'Lentes' },
  { id: 'hat', label: 'Sombrero' },
  { id: 'pack', label: 'Mochila' },
  { id: 'extra', label: 'Extras' },
]

export function itemById(id: string) {
  return shopCatalog.find((item) => item.id === id)
}

export function isEquipped(cosmetics: Cosmetics, item: ShopItem) {
  return Object.entries(item.patch).every(([key, value]) => cosmetics[key as keyof Cosmetics] === value)
}
