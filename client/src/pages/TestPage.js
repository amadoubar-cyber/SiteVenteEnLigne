import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          color: '#2563eb', 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          ✅ PAGE DE TEST FONCTIONNE !
        </h1>
        
        <div style={{ 
          backgroundColor: '#dcfce7', 
          border: '1px solid #16a34a', 
          padding: '1rem', 
          borderRadius: '6px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#166534', marginBottom: '0.5rem' }}>
            🎉 Succès !
          </h2>
          <p style={{ color: '#166534', margin: 0 }}>
            Cette page confirme que React fonctionne correctement.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '1rem', 
            borderRadius: '6px',
            border: '1px solid #f59e0b'
          }}>
            <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
              📊 Chiffre d'Affaires
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              15,750,000 FCFA
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#dbeafe', 
            padding: '1rem', 
            borderRadius: '6px',
            border: '1px solid #3b82f6'
          }}>
            <h3 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
              💰 Bénéfice
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              3,150,000 FCFA
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#f3e8ff', 
            padding: '1rem', 
            borderRadius: '6px',
            border: '1px solid #8b5cf6'
          }}>
            <h3 style={{ color: '#6b21a8', marginBottom: '0.5rem' }}>
              📦 Produits Vendus
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              1,247
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#fef2f2', 
            padding: '1rem', 
            borderRadius: '6px',
            border: '1px solid #ef4444'
          }}>
            <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>
              📈 Stock Restant
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              2,156
            </p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '1rem', 
          borderRadius: '6px',
          border: '1px solid #d1d5db'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
            🔗 URLs de Test Disponibles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Page actuelle:</span>
              <code style={{ 
                backgroundColor: '#e5e7eb', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                /test-page
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Contrôle de stock:</span>
              <code style={{ 
                backgroundColor: '#e5e7eb', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                /stock-control
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Test direct:</span>
              <code style={{ 
                backgroundColor: '#e5e7eb', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                /test-direct
              </code>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p>
            Si vous voyez cette page, le système fonctionne ! 
            Vous pouvez maintenant accéder aux autres pages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
