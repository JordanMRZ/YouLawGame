import { useState } from 'react'
import { isEquipped, shopCatalog, shopCategories } from '../data/shop'
import type { ShopItem } from '../data/types'
import { useGameStore } from '../store/gameStore'

export function ShopPanel() {
  const save = useGameStore((s) => s.save)
  const preview = useGameStore((s) => s.shopPreview)
  const [category, setCategory] = useState<(typeof shopCategories)[number]['id']>('shirt')
  const [pending, setPending] = useState<ShopItem | null>(null)
  const items = shopCatalog.filter((item) => item.category === category)
  const look = preview ?? save.cosmetics

  const tryItem = (item: ShopItem) => {
    const owned = save.owned.includes(item.id)
    useGameStore.getState().setShopPreview({ ...save.cosmetics, ...item.patch })
    if (owned) {
      useGameStore.getState().buyItem(item.id)
      setPending(null)
      return
    }
    setPending(item)
  }

  const confirmBuy = () => {
    if (!pending) return
    const ok = useGameStore.getState().buyItem(pending.id)
    if (ok) setPending(null)
  }

  const cancelBuy = () => {
    setPending(null)
    useGameStore.getState().setShopPreview(null)
  }

  return (
    <div className="shop-panel">
      <div className="shop-head">
        <div>
          <p className="kicker">Tienda</p>
          <h2>Vestimenta</h2>
        </div>
        <span className="xp-chip">{save.wallet} monedas</span>
      </div>
      <p className="muted shop-hint">Toca un artículo para verlo en el personaje. Arrástralo para girarlo. La compra pide confirmación.</p>
      <div className="shop-cats">
        {shopCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={category === cat.id ? 'primary cat-on' : ''}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="shop-grid">
        {items.map((item) => {
          const owned = save.owned.includes(item.id)
          const equipped = isEquipped(save.cosmetics, item)
          const previewing = isEquipped(look, item) && !equipped
          return (
            <button
              key={item.id}
              type="button"
              className={`shop-item ${equipped ? 'on' : ''} ${previewing ? 'preview' : ''}`}
              onClick={() => tryItem(item)}
            >
              <strong>{item.name}</strong>
              <span>
                {equipped ? 'Puesto' : previewing ? 'Viendo' : owned ? 'Equipar' : `Ver · ${item.price} 🪙`}
              </span>
            </button>
          )
        })}
      </div>
      <button type="button" onClick={() => useGameStore.getState().setShopOpen(false)}>
        Cerrar
      </button>
      {pending && (
        <div className="shop-confirm">
          <p className="kicker">Confirmar compra</p>
          <h3>{pending.name}</h3>
          <p>
            Cuesta <strong>{pending.price} monedas</strong>. Tienes {save.wallet}.
          </p>
          {save.wallet < pending.price && <p className="muted">No te alcanza todavía. Recoge más monedas en los niveles.</p>}
          <div className="row">
            <button
              type="button"
              className="primary"
              disabled={save.wallet < pending.price}
              onClick={confirmBuy}
            >
              Comprar
            </button>
            <button type="button" onClick={cancelBuy}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
