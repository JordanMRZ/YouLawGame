import { useState } from 'react'
import { isEquipped, itemSwatch, shopCatalog, shopCategories } from '../data/shop'
import type { ShopItem } from '../data/types'
import { useGameStore } from '../store/gameStore'

export function ShopPanel() {
  const save = useGameStore((s) => s.save)
  const preview = useGameStore((s) => s.shopPreview)
  const [category, setCategory] = useState<(typeof shopCategories)[number]['id']>('shirt')
  const [pending, setPending] = useState<ShopItem | null>(null)
  const items = shopCatalog.filter((item) => item.category === category)
  const look = preview ?? save.cosmetics
  const cat = shopCategories.find((entry) => entry.id === category)

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
          <p className="kicker">Boutique</p>
          <h2>Probador</h2>
        </div>
        <span className="xp-chip shop-wallet">{save.wallet} 🪙</span>
      </div>
      <p className="muted shop-hint">Gira el maniquí y prueba cada prenda. La compra se confirma aparte.</p>
      <div className="shop-cats">
        {shopCategories.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={category === entry.id ? 'primary cat-on' : ''}
            onClick={() => setCategory(entry.id)}
          >
            {entry.icon} {entry.label}
          </button>
        ))}
      </div>
      <p className="shop-section">{cat?.icon} {cat?.label}</p>
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
              <span className="shop-swatch" style={{ background: itemSwatch(item) }} />
              <strong>{item.name}</strong>
              <span>
                {equipped ? 'En uso' : previewing ? 'Probando' : owned ? 'Poner' : `${item.price} 🪙`}
              </span>
            </button>
          )
        })}
      </div>
      <button type="button" className="shop-close" onClick={() => useGameStore.getState().setShopOpen(false)}>
        Cerrar boutique
      </button>
      {pending && (
        <div className="shop-confirm">
          <span className="shop-swatch big" style={{ background: itemSwatch(pending) }} />
          <p className="kicker">Confirmar compra</p>
          <h3>{pending.name}</h3>
          <p>
            ¿Comprar por <strong>{pending.price} monedas</strong>?
          </p>
          <p className="muted">Saldo: {save.wallet} 🪙. Se verá en el personaje al instante.</p>
          {save.wallet < pending.price && <p className="muted">Te faltan {pending.price - save.wallet} monedas.</p>}
          <div className="row">
            <button type="button" className="primary" disabled={save.wallet < pending.price} onClick={confirmBuy}>
              Sí, comprar
            </button>
            <button type="button" onClick={cancelBuy}>
              Seguir viendo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
