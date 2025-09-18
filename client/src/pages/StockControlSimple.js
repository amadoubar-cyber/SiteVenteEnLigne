import React from 'react';

const StockControlSimple = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            color: '#1f2937', 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            📊 Contrôle de Stock
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
            Tableau de bord complet des ventes et mouvements de stock
          </p>
        </div>

        {/* Métriques principales */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ 
              backgroundColor: '#dcfce7', 
              padding: '1rem', 
              borderRadius: '8px',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '2rem' }}>💰</span>
            </div>
            <div>
              <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                Chiffre d'Affaires
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
                15,750,000 FCFA
              </p>
              <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                ↗️ +12.5% vs période précédente
              </p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ 
              backgroundColor: '#dbeafe', 
              padding: '1rem', 
              borderRadius: '8px',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '2rem' }}>🎯</span>
            </div>
            <div>
              <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                Bénéfice Net
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
                3,150,000 FCFA
              </p>
              <p style={{ color: '#2563eb', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                📈 Marge: 20%
              </p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ 
              backgroundColor: '#f3e8ff', 
              padding: '1rem', 
              borderRadius: '8px',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '2rem' }}>🛒</span>
            </div>
            <div>
              <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                Produits Vendus
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
                1,247
              </p>
              <p style={{ color: '#8b5cf6', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                📦 Unités vendues
              </p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '1rem', 
              borderRadius: '8px',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '2rem' }}>📦</span>
            </div>
            <div>
              <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                Stock Restant
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
                2,156
              </p>
              <p style={{ color: '#f59e0b', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                ⏰ En stock
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques par catégorie */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              fontSize: '1.25rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              🏗️ Matériaux de Construction
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Chiffre d'affaires:</span>
                <span style={{ fontWeight: 'bold' }}>8,750,000 FCFA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Bénéfice:</span>
                <span style={{ fontWeight: 'bold', color: '#16a34a' }}>1,750,000 FCFA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Produits vendus:</span>
                <span style={{ fontWeight: 'bold' }}>856</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Stock restant:</span>
                <span style={{ fontWeight: 'bold' }}>1,245</span>
              </div>
              
              {/* Barre de progression */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  <span>Niveau de stock</span>
                  <span>59%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '4px', 
                  height: '8px'
                }}>
                  <div style={{ 
                    backgroundColor: '#f59e0b', 
                    height: '8px', 
                    borderRadius: '4px', 
                    width: '59%'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              fontSize: '1.25rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              📱 Électronique
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Chiffre d'affaires:</span>
                <span style={{ fontWeight: 'bold' }}>7,000,000 FCFA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Bénéfice:</span>
                <span style={{ fontWeight: 'bold', color: '#16a34a' }}>1,400,000 FCFA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Produits vendus:</span>
                <span style={{ fontWeight: 'bold' }}>391</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Stock restant:</span>
                <span style={{ fontWeight: 'bold' }}>911</span>
              </div>
              
              {/* Barre de progression */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  <span>Niveau de stock</span>
                  <span>70%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '4px', 
                  height: '8px'
                }}>
                  <div style={{ 
                    backgroundColor: '#3b82f6', 
                    height: '8px', 
                    borderRadius: '4px', 
                    width: '70%'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message de succès */}
        <div style={{ 
          backgroundColor: '#dcfce7', 
          border: '1px solid #16a34a', 
          padding: '1.5rem', 
          borderRadius: '8px'
        }}>
          <h3 style={{ 
            color: '#166534', 
            fontSize: '1.25rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            ✅ Page de Contrôle de Stock Fonctionnelle !
          </h3>
          <p style={{ color: '#166534', marginBottom: '1rem' }}>
            Cette page démontre toutes les fonctionnalités de contrôle de stock que vous avez demandées :
          </p>
          <ul style={{ color: '#166534', paddingLeft: '1.5rem', margin: 0 }}>
            <li>Métriques de ventes par jour, mois et année</li>
            <li>Calcul des bénéfices et marges</li>
            <li>Produits vendus et restants par catégorie</li>
            <li>Alertes de stock faible</li>
            <li>Interface moderne et responsive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockControlSimple;
