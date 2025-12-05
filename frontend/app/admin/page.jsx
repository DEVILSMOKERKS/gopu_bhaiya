export default function AdminHomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      textAlign: 'center',
      color: '#374151'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1f2937' }}>
        Welcome to Mateshwari Moorti Bhandar Admin
      </h1>
      <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#6b7280' }}>
        Manage your e-commerce store with ease
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Dashboard</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            View analytics and statistics
          </p>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Products</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Manage your product catalog
          </p>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Orders</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Track and manage orders
          </p>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Users</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Manage customer accounts
          </p>
        </div>
      </div>
    </div>
  );
}


