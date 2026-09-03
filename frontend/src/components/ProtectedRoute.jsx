import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="cyber-auth-gate">
        <style>
          {`
            html, body, #root {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              min-height: 100% !important;
              background-color: #000000 !important;
              box-sizing: border-box;
            }

            *, *::before, *::after {
              box-sizing: inherit;
            }

            @keyframes spinDual {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            @keyframes pulseGlow {
              0%, 100% { opacity: 0.4; transform: scale(0.98); }
              50% { opacity: 0.8; transform: scale(1.02); }
            }

            .cyber-auth-gate {
              min-height: 100vh;
              width: 100vw;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #000000;
              background-image: 
                radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 60%),
                linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
              background-size: 100% 100%, 48px 48px, 48px 48px;
              font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', Roboto, sans-serif;
              position: fixed;
              inset: 0;
              z-index: 9999;
            }

            .loader-capsule {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
              background: #09090b;
              border: 1px solid #1e293b;
              border-radius: 24px;
              padding: 40px 48px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(56, 189, 248, 0.05);
              position: relative;
              overflow: hidden;
            }

            .spinner-ring {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              border: 3px solid transparent;
              border-top-color: #38bdf8;
              border-right-color: #10b981;
              border-bottom-color: #f59e0b;
              animation: spinDual 0.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
              filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.35));
            }
          `}
        </style>

        <div className="loader-capsule">
          {/* Top Multi-Color Neon Accent Trim */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #f43f5e 0%, #38bdf8 35%, #f59e0b 70%, #10b981 100%)',
            }}
          />

          {/* Dual-tone Multi-accent Ring */}
          <div style={{ position: 'relative', width: '48px', height: '48px' }}>
            <div className="spinner-ring" />
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #10b981)',
                opacity: 0.25,
                animation: 'pulseGlow 1.6s ease-in-out infinite',
              }}
            />
          </div>

          {/* Telemetry Status Message */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                color: '#38bdf8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              AUTHENTICATING SESSION
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              Verifying encrypted token...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;