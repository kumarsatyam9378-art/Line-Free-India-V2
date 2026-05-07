import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, TokenEntry } from '../store/AppContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { FaFire, FaStar, FaChartLine, FaClock, FaMoneyBillWave, FaCalendarAlt, FaTrophy, FaUserFriends } from 'react-icons/fa';

interface CustomerInsight {
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  avgSpending: number;
  favoriteService: string;
  visitFrequency: string;
}

export default function CustomerInsights() {
  const nav = useNavigate();
  const { user, businessProfile } = useApp();
  const [insights, setInsights] = useState<CustomerInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'repeat' | 'vip' | 'recent'>('all');

  useEffect(() => {
    if (!user) return;
    loadInsights();
  }, [user]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'tokens'), where('salonId', '==', user!.uid));
      const snap = await getDocs(q);
      
      const customerMap = new Map<string, CustomerInsight>();
      
      snap.docs.forEach(doc => {
        const token = doc.data() as TokenEntry;
        if (!token.customerId) return;
        
        const existing = customerMap.get(token.customerId);
        if (existing) {
          existing.totalVisits++;
          existing.totalSpent += token.totalPrice || 0;
          if (token.date > existing.lastVisit) {
            existing.lastVisit = token.date;
          }
        } else {
          customerMap.set(token.customerId, {
            customerId: token.customerId,
            customerName: token.customerName,
            customerPhone: token.customerPhone,
            totalVisits: 1,
            totalSpent: token.totalPrice || 0,
            lastVisit: token.date,
            avgSpending: token.totalPrice || 0,
            favoriteService: token.selectedServices[0]?.name || 'N/A',
            visitFrequency: 'New'
          });
        }
      });

      // Calculate averages and frequency
      const insightsList = Array.from(customerMap.values()).map(insight => {
        insight.avgSpending = insight.totalSpent / insight.totalVisits;
        
        if (insight.totalVisits >= 10) insight.visitFrequency = 'VIP';
        else if (insight.totalVisits >= 5) insight.visitFrequency = 'Regular';
        else if (insight.totalVisits >= 2) insight.visitFrequency = 'Repeat';
        else insight.visitFrequency = 'New';
        
        return insight;
      });

      // Sort by total visits
      insightsList.sort((a, b) => b.totalVisits - a.totalVisits);
      
      setInsights(insightsList);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = insights.filter(insight => {
    if (filter === 'repeat') return insight.totalVisits >= 2;
    if (filter === 'vip') return insight.totalVisits >= 10;
    if (filter === 'recent') {
      const lastVisitDate = new Date(insight.lastVisit);
      const daysSince = Math.floor((Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }
    return true;
  });

  const totalCustomers = insights.length;
  const repeatCustomers = insights.filter(i => i.totalVisits >= 2).length;
  const vipCustomers = insights.filter(i => i.totalVisits >= 10).length;
  const totalRevenue = insights.reduce((sum, i) => sum + i.totalSpent, 0);
  const avgCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white font-bold">Loading Insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pb-32">
      <div className="p-6 pt-14">
        <BackButton to="/barber/tools" />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-white mb-2">Customer Insights 🔍</h1>
          <p className="text-white/60 font-bold">Deep analytics about your customers</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30"
          >
            <FaUserFriends className="text-3xl text-blue-400 mb-2" />
            <div className="text-3xl font-black text-white">{totalCustomers}</div>
            <div className="text-xs font-bold text-white/70 uppercase tracking-wider">Total Customers</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30"
          >
            <FaFire className="text-3xl text-green-400 mb-2" />
            <div className="text-3xl font-black text-white">{repeatCustomers}</div>
            <div className="text-xs font-bold text-white/70 uppercase tracking-wider">Repeat Customers</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30"
          >
            <FaTrophy className="text-3xl text-yellow-400 mb-2" />
            <div className="text-3xl font-black text-white">{vipCustomers}</div>
            <div className="text-xs font-bold text-white/70 uppercase tracking-wider">VIP Customers</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30"
          >
            <FaMoneyBillWave className="text-3xl text-purple-400 mb-2" />
            <div className="text-2xl font-black text-white">₹{Math.round(avgCustomerValue)}</div>
            <div className="text-xs font-bold text-white/70 uppercase tracking-wider">Avg Customer Value</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All', icon: '👥' },
            { key: 'repeat', label: 'Repeat', icon: '🔄' },
            { key: 'vip', label: 'VIP', icon: '👑' },
            { key: 'recent', label: 'Recent', icon: '🕐' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === f.key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Customer List */}
        <div className="space-y-4">
          {filteredInsights.map((insight, index) => (
            <motion.div
              key={insight.customerId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">{insight.customerName}</h3>
                  <p className="text-sm text-white/60 font-bold">{insight.customerPhone}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider ${
                  insight.visitFrequency === 'VIP' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                  insight.visitFrequency === 'Regular' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                  insight.visitFrequency === 'Repeat' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                }`}>
                  {insight.visitFrequency}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{insight.totalVisits}</div>
                    <div className="text-xs text-white/60 font-bold uppercase">Visits</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <FaMoneyBillWave className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">₹{insight.totalSpent}</div>
                    <div className="text-xs text-white/60 font-bold uppercase">Total Spent</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <FaChartLine className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white">₹{Math.round(insight.avgSpending)}</div>
                    <div className="text-xs text-white/60 font-bold uppercase">Avg Spend</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <FaClock className="text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{insight.lastVisit}</div>
                    <div className="text-xs text-white/60 font-bold uppercase">Last Visit</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm font-bold text-white/80">Favorite: {insight.favoriteService}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredInsights.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-white/60 font-bold">No customers found in this category</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
