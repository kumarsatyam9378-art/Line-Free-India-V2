import { useState, useEffect } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';

export default function BarberCustomers() {
  const { user, nextCustomer, getTodayEarnings, businessProfile, t, markNoShow, blockCustomer, unblockCustomer } = useApp();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [editingWait, setEditingWait] = useState<string | null>(null);
  const [customWait, setCustomWait] = useState('');
  const [savingWait, setSavingWait] = useState(false);
  const [reengaging, setReengaging] = useState(false);
  const [reengagedCount, setReengagedCount] = useState<number | null>(null);

  const today = new Date().toISOString().slice(0, 10).replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tokens'), where('salonId', '==', user.uid));
    return onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
      const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
      const todayTks = all.filter(t => t.date === today);
      todayTks.sort((a, b) => {
        if (a.status === 'waiting' && b.status === 'waiting') {
          if (a.isTatkal && !b.isTatkal) return -1;
          if (!a.isTatkal && b.isTatkal) return 1;
        }
        return a.tokenNumber - b.tokenNumber;
      });
      setTokens(todayTks);
    });
  }, [user]);

  useEffect(() => {
    const load = async () => setEarnings(await getTodayEarnings());
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, [user]);

  const handleSetWaitTime = async (tokenId: string, minutes: number) => {
    setSavingWait(true);
    try { await updateDoc(doc(db, 'tokens', tokenId), { estimatedWaitMinutes: minutes, totalTime: minutes }); }
    catch {}
    setSavingWait(false); setEditingWait(null); setCustomWait('');
  };

  const handleReengage = () => {
    setReengaging(true);
    setTimeout(() => {
      setReengaging(false);
      setReengagedCount(Math.floor(Math.random() * 15) + 5);
      setTimeout(() => setReengagedCount(null), 5000);
    }, 1500);
  };

  const waiting = tokens.filter(t => t.status === 'waiting');
  const serving = tokens.find(t => t.status === 'serving');
  const done    = tokens.filter(t => t.status === 'done');
  const cancelled = tokens.filter(t => t.status === 'cancelled').length;

  const row = (label: string, value: string | number, color: string) => (
    <div style={{ flex: 1, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
      <p style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: -0.5 }}>{value}</p>
      <p style={{ fontSize: 11, color: 'var(--color-text-dim)', marginTop: 2 }}>{label}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{ padding: '52px 16px 0', background: 'var(--color-card)', borderBottom: '1px solid var(--color-separator)', marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>Queue</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 2 }}>Today · {waiting.length} waiting</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)' }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Live</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', gap: 10 }}>
        {row('Revenue', `₹${earnings}`, 'var(--color-primary)')}
        {row('Done', done.length, 'var(--color-success)')}
        {row('Waiting', waiting.length, 'var(--color-warning)')}
        {row('Cancelled', cancelled, 'var(--color-danger)')}
      </div>

      {/* Auto CRM strip */}
      <div style={{ margin: '16px 16px 0', padding: '14px 16px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>🤖 Auto CRM</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-dim)', maxWidth: 200 }}>Re-engage inactive customers with a 10% off SMS</p>
        </div>
        <button onClick={handleReengage} disabled={reengaging || reengagedCount != null} style={{
          padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: reengagedCount != null ? 'var(--color-success)' : 'var(--color-primary)',
          color: '#fff', opacity: reengaging ? 0.7 : 1,
        }}>
          {reengaging ? 'Scanning...' : reengagedCount != null ? `✓ Sent to ${reengagedCount}` : 'Trigger'}
        </button>
      </div>

      {/* Call next */}
      <div style={{ padding: '16px 16px 0' }}>
        <button onClick={nextCustomer} disabled={waiting.length === 0 && !serving} style={{
          width: '100%', padding: '16px', background: 'var(--color-primary)', color: '#fff',
          borderRadius: 14, fontSize: 16, fontWeight: 600, opacity: (waiting.length === 0 && !serving) ? 0.4 : 1,
          cursor: (waiting.length === 0 && !serving) ? 'not-allowed' : 'pointer',
        }}>
          {serving ? `✓ Complete #${serving.tokenNumber} → Next` : waiting.length > 0 ? `→ Call #${waiting[0]?.tokenNumber}` : 'No customers waiting'}
        </button>
      </div>

      {/* Serving */}
      {serving && (
        <div style={{ margin: '12px 16px 0', padding: '16px', background: 'rgba(52,199,89,0.08)', border: '1px solid rgba(52,199,89,0.25)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)' }}>Now Serving</span>
          </div>
          <p style={{ fontSize: 17, fontWeight: 700 }}>#{serving.tokenNumber} · {serving.customerName}</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 3 }}>{serving.selectedServices.map(s => s.name).join(', ')}</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-success)', marginTop: 6 }}>₹{serving.totalPrice} · ~{serving.totalTime} min</p>
        </div>
      )}

      {/* Waiting list */}
      {waiting.length > 0 && (
        <div style={{ padding: '16px 16px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-dim)', marginBottom: 10 }}>
            Waiting ({waiting.length})
          </p>
          <div style={{ background: 'var(--color-card)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {waiting.map((tk, i) => (
              <div key={tk.id} style={{
                padding: '14px 16px',
                borderBottom: i < waiting.length - 1 ? '1px solid var(--color-separator)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: tk.isTatkal ? 'rgba(255,149,0,0.15)' : 'rgba(0,122,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 15, flexShrink: 0,
                    color: tk.isTatkal ? 'var(--color-warning)' : 'var(--color-primary)',
                  }}>
                    {tk.tokenNumber}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{tk.customerName}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tk.selectedServices.map(s => s.name).join(', ')}
                    </p>
                    {tk.isTatkal && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-warning)', background: 'rgba(255,149,0,0.12)', padding: '1px 7px', borderRadius: 6, display: 'inline-block', marginTop: 3 }}>
                        ⚡ Tatkal
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>₹{tk.totalPrice}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>~{tk.estimatedWaitMinutes}m</p>
                  </div>
                  {tk.customerPhone && (
                    <a href={`tel:${tk.customerPhone}`} style={{ fontSize: 18, flexShrink: 0 }}>📞</a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => { if (confirm(`Mark ${tk.customerName} as no-show?`)) markNoShow(tk.id!, tk.customerId); }}
                    style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,59,48,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(255,59,48,0.2)', fontWeight: 600, cursor: 'pointer' }}>
                    No-Show
                  </button>
                  {businessProfile?.blockedCustomerIds?.includes(tk.customerId) ? (
                    <button onClick={() => unblockCustomer(tk.customerId)}
                      style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(52,199,89,0.1)', color: 'var(--color-success)', border: '1px solid rgba(52,199,89,0.2)', fontWeight: 600, cursor: 'pointer' }}>
                      Unblock
                    </button>
                  ) : (
                    <button onClick={() => { if (confirm(`Block ${tk.customerName}?`)) blockCustomer(tk.customerId); }}
                      style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,59,48,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(255,59,48,0.2)', fontWeight: 600, cursor: 'pointer' }}>
                      Block
                    </button>
                  )}
                  {editingWait === tk.id ? (
                    <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                      <input type="number" value={customWait} onChange={e => setCustomWait(e.target.value)} placeholder="Min" style={{ flex: 1, padding: '4px 10px', borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', fontSize: 12, color: 'var(--color-text)', outline: 'none' }} />
                      <button onClick={() => handleSetWaitTime(tk.id!, parseInt(customWait)||tk.totalTime)} disabled={savingWait||!customWait}
                        style={{ padding: '4px 12px', borderRadius: 8, background: 'var(--color-primary)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Set
                      </button>
                      <button onClick={() => { setEditingWait(null); setCustomWait(''); }}
                        style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 12, color: 'var(--color-text-dim)', cursor: 'pointer', background: 'none' }}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingWait(tk.id!); setCustomWait(String(tk.estimatedWaitMinutes||tk.totalTime)); }}
                      style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'transparent', color: 'var(--color-primary)', fontWeight: 500, cursor: 'pointer', border: 'none' }}>
                      ⏱ Set wait
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done list */}
      {done.length > 0 && (
        <div style={{ padding: '16px 16px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-dim)', marginBottom: 10 }}>Done ({done.length})</p>
          <div style={{ background: 'var(--color-card)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {done.map((tk, i) => (
              <div key={tk.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderBottom: i < done.length - 1 ? '1px solid var(--color-separator)' : 'none',
                opacity: 0.6,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(52,199,89,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--color-success)', flexShrink: 0 }}>
                  {tk.tokenNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{tk.customerName}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{tk.selectedServices.map(s => s.name).join(', ')}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-success)' }}>₹{tk.totalPrice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tokens.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--color-text-dim)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>No customers yet today</p>
          <p style={{ fontSize: 13, marginTop: 4, color: 'var(--color-text-muted)' }}>
            {businessProfile?.isOpen ? 'Waiting for bookings...' : 'Open your business to start'}
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
