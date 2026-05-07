import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export default function GetMyUID() {
  const { user } = useApp();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">⚠️ Not Logged In</h1>
          <p className="text-text-dim mb-6">Please login first to see your UID</p>
          <button 
            onClick={() => nav('/customer/auth')}
            className="px-6 py-3 bg-primary text-black font-bold rounded-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.uid);
    alert('✅ UID copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="elite-glass rounded-3xl p-8 spatial-card">
          <h1 className="text-3xl font-black gradient-text mb-6 text-center">🔑 Your Firebase UID</h1>
          
          <div className="bg-card-2 border border-border rounded-2xl p-6 mb-6">
            <p className="text-xs text-text-dim font-bold uppercase tracking-widest mb-2">User ID</p>
            <p className="text-lg font-mono break-all text-primary">{user.uid}</p>
          </div>

          <div className="bg-card-2 border border-border rounded-2xl p-6 mb-6">
            <p className="text-xs text-text-dim font-bold uppercase tracking-widest mb-2">Email</p>
            <p className="text-sm">{user.email || 'N/A'}</p>
          </div>

          <div className="bg-card-2 border border-border rounded-2xl p-6 mb-6">
            <p className="text-xs text-text-dim font-bold uppercase tracking-widest mb-2">Display Name</p>
            <p className="text-sm">{user.displayName || 'N/A'}</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-4 bg-primary text-black font-bold rounded-xl active:scale-95 transition-transform"
            >
              📋 Copy UID
            </button>
            <button 
              onClick={() => nav(-1)}
              className="px-6 py-4 bg-card border border-border font-bold rounded-xl active:scale-95 transition-transform"
            >
              ← Back
            </button>
          </div>

          <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
            <p className="text-xs text-warning font-bold mb-2">⚠️ IMPORTANT:</p>
            <ol className="text-xs text-text-dim space-y-1 list-decimal list-inside">
              <li>Copy your UID from above</li>
              <li>Open <code className="bg-card px-1 py-0.5 rounded">src/pages/SecretAdminPanel.tsx</code></li>
              <li>Replace <code className="bg-card px-1 py-0.5 rounded">'YOUR_FIREBASE_UID_HERE'</code> with your UID</li>
              <li>Save the file</li>
              <li>Visit <code className="bg-card px-1 py-0.5 rounded">/secret-admin-x9z2k</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
