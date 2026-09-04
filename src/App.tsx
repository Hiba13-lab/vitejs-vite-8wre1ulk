import { useState } from 'react'
import './App.css'

type Order = {
  id: string
  client: string
  date: string
  delivery: string
  status: string
  step: number
}

function App() {
  const [page, setPage] = useState('dashboard')

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'CMD001',
      client: 'Hiba',
      date: '04/09/2026',
      delivery: '06/09/2026',
      status: 'En livraison',
      step: 4,
    },
    {
      id: 'CMD002',
      client: 'Sara',
      date: '03/09/2026',
      delivery: '07/09/2026',
      status: 'En préparation',
      step: 2,
    },
    {
      id: 'CMD003',
      client: 'Ranya',
      date: '02/09/2026',
      delivery: '05/09/2026',
      status: 'Livrée',
      step: 5,
    },
  ])

  // Ajouter commande
  const [client, setClient] = useState('')
  const [delivery, setDelivery] = useState('')
  const [status, setStatus] = useState('Commande confirmée')

  // Suivi
  const [searchOrder, setSearchOrder] = useState('')
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)

  // Modifier
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const steps = [
    'Commande confirmée',
    'En préparation',
    'Expédiée',
    'En livraison',
    'Livrée',
  ]

  const getStep = (orderStatus: string) => {
    return steps.indexOf(orderStatus) + 1
  }

  const addOrder = () => {
    if (!client || !delivery) {
      alert('Veuillez remplir tous les champs.')
      return
    }

    const newOrder: Order = {
      id: `CMD${String(orders.length + 1).padStart(3, '0')}`,
      client,
      date: new Date().toLocaleDateString('fr-FR'),
      delivery,
      status,
      step: getStep(status),
    }

    setOrders([...orders, newOrder])
    setClient('')
    setDelivery('')
    setStatus('Commande confirmée')

    alert('Commande ajoutée avec succès !')
  }

  const handleSearch = () => {
    const found = orders.find(
      (order) =>
        order.id.toLowerCase() ===
        searchOrder.trim().replace('#', '').toLowerCase()
    )

    if (found) {
      setSearchedOrder(found)
      setNotFound(false)
    } else {
      setSearchedOrder(null)
      setNotFound(true)
    }
  }

  const deleteOrder = (id: string) => {
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    )

    if (searchedOrder?.id === id) {
      setSearchedOrder(null)
    }
  }

  const updateOrderStatus = () => {
    if (!editingOrder) return

    const updatedOrder = {
      ...editingOrder,
      step: getStep(editingOrder.status),
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === editingOrder.id ? updatedOrder : order
      )
    )

    if (searchedOrder?.id === editingOrder.id) {
      setSearchedOrder(updatedOrder)
    }

    setEditingOrder(null)
    alert('Commande modifiée avec succès !')
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>📦 Osrah cosmetiques</h2>

        <nav>
          <button onClick={() => setPage('dashboard')}>
            🏠 Dashboard
          </button>

          <button onClick={() => setPage('commandes')}>
            📦 Commandes
          </button>

          <button onClick={() => setPage('ajouter')}>
            ➕ Ajouter une commande
          </button>

          <button onClick={() => setPage('suivi')}>
            🚚 Suivi
          </button>

          <button onClick={() => setPage('clients')}>
            👤 Clients
          </button>

          <button onClick={() => setPage('statistiques')}>
            📊 Statistiques
          </button>
        </nav>
      </aside>

      {/* CONTENU */}
      <main className="content">

        {/* DASHBOARD */}
        {page === 'dashboard' && (
          <>
            <header>
              <h1>Dashboard</h1>
              <p>Bienvenue dans votre système de suivi des commandes d'osrah cometiques</p>
            </header>

            <section className="cards">
              <div className="card">
                <h3>📦 Total Commandes</h3>
                <h2>{orders.length}</h2>
              </div>

              <div className="card">
                <h3>⏳ En préparation</h3>
                <h2>
                  {orders.filter(
                    (order) => order.status === 'En préparation'
                  ).length}
                </h2>
              </div>

              <div className="card">
                <h3>🚚 En livraison</h3>
                <h2>
                  {orders.filter(
                    (order) => order.status === 'En livraison'
                  ).length}
                </h2>
              </div>

              <div className="card">
                <h3>✅ Livrées</h3>
                <h2>
                  {orders.filter(
                    (order) => order.status === 'Livrée'
                  ).length}
                </h2>
              </div>
            </section>

            <section className="orders">
              <h2>Commandes récentes</h2>

              <table>
                <thead>
                  <tr>
                    <th>Commande</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 3).map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.client}</td>
                      <td>{order.date}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* COMMANDES */}
        {page === 'commandes' && (
          <>
            <header>
              <h1>📦 Commandes</h1>
              <p>Liste de toutes les commandes</p>
            </header>

            <section className="orders">
              <table>
                <thead>
                  <tr>
                    <th>Commande</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Livraison</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.client}</td>
                      <td>{order.date}</td>
                      <td>{order.delivery}</td>
                      <td>{order.status}</td>

                      <td>
                        <button
                          className="edit-btn"
                          onClick={() =>
                            setEditingOrder({ ...order })
                          }
                        >
                          ✏️ Modifier
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteOrder(order.id)}
                        >
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {editingOrder && (
              <section className="edit-form">
                <h2>✏️ Modifier la commande</h2>

                <p>
                  <strong>Commande :</strong> #{editingOrder.id}
                </p>

                <p>
                  <strong>Client :</strong> {editingOrder.client}
                </p>

                <label>Statut</label>

                <select
                  value={editingOrder.status}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      status: e.target.value,
                    })
                  }
                >
                  {steps.map((step) => (
                    <option key={step}>{step}</option>
                  ))}
                </select>

                <button
                  className="save-btn"
                  onClick={updateOrderStatus}
                >
                  💾 Enregistrer
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setEditingOrder(null)}
                >
                  Annuler
                </button>
              </section>
            )}
          </>
        )}

        {/* AJOUTER */}
        {page === 'ajouter' && (
          <div>
            <header>
              <h1>➕ Ajouter une commande</h1>
              <p>Ajoutez une nouvelle commande.</p>
            </header>

            <section className="order-form">
              <label>Nom du client</label>

              <input
                type="text"
                placeholder="Exemple : Hiba"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />

              <label>Date estimée de livraison</label>

              <input
                type="text"
                placeholder="Exemple : 10/09/2026"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
              />

              <label>Statut</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {steps.map((step) => (
                  <option key={step}>{step}</option>
                ))}
              </select>

              <button onClick={addOrder}>
                ➕ Ajouter la commande
              </button>
            </section>
          </div>
        )}

        {/* SUIVI */}
        {page === 'suivi' && (
          <div>
            <header>
              <h1>🚚 Suivi des commandes</h1>
              <p>
                Entrez votre numéro de commande pour suivre son avancement.
              </p>
            </header>

            <section className="tracking-box">
              <input
                type="text"
                placeholder="Exemple : CMD001"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
              />

              <button onClick={handleSearch}>
                Rechercher
              </button>
            </section>

            {notFound && (
              <div className="not-found">
                ❌ Commande introuvable
              </div>
            )}

            {searchedOrder && (
              <section className="tracking-details">
                <h2>📦 Commande #{searchedOrder.id}</h2>

                <div className="order-info">
                  <p>
                    <strong>Client :</strong> {searchedOrder.client}
                  </p>

                  <p>
                    <strong>Date :</strong> {searchedOrder.date}
                  </p>

                  <p>
                    <strong>Livraison estimée :</strong>{' '}
                    {searchedOrder.delivery}
                  </p>

                  <p>
                    <strong>Statut :</strong>{' '}
                    {searchedOrder.status}
                  </p>
                </div>

                <div className="timeline">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className={
                        index + 1 <= searchedOrder.step
                          ? 'timeline-item active'
                          : 'timeline-item'
                      }
                    >
                      <div className="circle">
                        {index + 1 <= searchedOrder.step
                          ? '✓'
                          : index + 1}
                      </div>

                      <div>
                        <h3>{step}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* CLIENTS */}
        {page === 'clients' && (
          <div>
            <header>
              <h1>👤 Clients</h1>
              <p>Liste des clients.</p>
            </header>

            <section className="orders">
              {[...new Set(orders.map((order) => order.client))].map(
                (clientName) => (
                  <p key={clientName}>👤 {clientName}</p>
                )
              )}
            </section>
          </div>
        )}

        {/* STATISTIQUES */}
        {page === 'statistiques' && (
          <div>
            <header>
              <h1>📊 Statistiques</h1>
              <p>Statistiques des commandes.</p>
            </header>

            <section className="cards">
              <div className="card">
                <h3>📦 Total</h3>
                <h2>{orders.length}</h2>
              </div>

              <div className="card">
                <h3>⏳ En préparation</h3>
                <h2>
                  {orders.filter(
                    (order) => order.status === 'En préparation'
                  ).length}
                </h2>
              </div>

              <div className="card">
                <h3>🚚 En livraison</h3>
                <h2>
                  {orders.filter(
                    (order) => order.status === 'En livraison'
                  ).length}
                </h2>
              </div>

              <div className="card">
                <h3>✅ Livrées</h3>
                <h2>
                  {orders.filter(
                    (order) => order.status === 'Livrée'
                  ).length}
                </h2>
              </div>
            </section>
          </div>
        )}

      </main>
    </div>
  )
}

export default App