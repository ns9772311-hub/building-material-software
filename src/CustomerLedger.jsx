import React, { useState } from 'react';

function CustomerLedger({ bills = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  // Filter types: 'all' (sabhi), 'dues' (sirf udhar), 'paid' (poora paid)
  const [filterType, setFilterType] = useState('all');

  // 🔍 1. Search Logic
  const filteredBySearch = bills.filter(bill => {
    const searchString = searchTerm.toLowerCase();
    return (
      bill.customer?.name?.toLowerCase().includes(searchString) ||
      bill.customer?.village?.toLowerCase().includes(searchString) ||
      bill.customer?.phone?.includes(searchString)
    );
  });

  // 🎛️ 2. Live Button Filter Logic (Udhar vs Paid)
  const finalFilteredBills = filteredBySearch.filter(bill => {
    if (filterType === 'dues') {
      return bill.remaining > 0; // Jiska paisa baki hai
    }
    if (filterType === 'paid') {
      return bill.remaining <= 0; // Jiska hisab clear hai
    }
    return true; // Sabhi records
  });

  // Ginti (Counts) nikalne ke liye
  const totalCount = filteredBySearch.length;
  const duesCount = filteredBySearch.filter(b => b.remaining > 0).length;
  const paidCount = filteredBySearch.filter(b => b.remaining <= 0).length;

  return (
    <div className="ledger-container" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginTop: '30px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Heading */}
      <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        📊 Grahak Records & Khata (Ledger)
      </h2>

      {/* Search Input Box */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          🔍 Yahan Grahak ka Naam, Gaon ya Mobile No. likhein:
        </label>
        <input
          type="text"
          placeholder="Type karte hi automatic filter ho jayega..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 15px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
        />
      </div>

      {/* LIVE FILTER BUTTONS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          type="button" 
          onClick={() => setFilterType('all')}
          style={{
            padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            border: filterType === 'all' ? '2px solid #475569' : '2px solid transparent',
            backgroundColor: '#f1f5f9', color: '#475569', transition: 'all 0.2s'
          }}
        >
          📋 Sabhi Records ({totalCount})
        </button>
        
        <button 
          type="button" 
          onClick={() => setFilterType('dues')}
          style={{
            padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            border: '2px solid transparent',
            backgroundColor: filterType === 'dues' ? '#dc2626' : '#fef2f2',
            color: filterType === 'dues' ? '#ffffff' : '#dc2626',
            boxShadow: filterType === 'dues' ? '0 4px 6px -1px rgba(220, 38, 38, 0.2)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          🔴 Sabhi Udhar (Dues) ({duesCount})
        </button>
        
        <button 
          type="button" 
          onClick={() => setFilterType('paid')}
          style={{
            padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            border: '2px solid transparent',
            backgroundColor: filterType === 'paid' ? '#16a34a' : '#f0fdf4',
            color: filterType === 'paid' ? '#ffffff' : '#16a34a',
            boxShadow: filterType === 'paid' ? '0 4px 6px -1px rgba(22, 163, 74, 0.2)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          🟢 Poora Paid ({paidCount})
        </button>
      </div>

      {/* Table Section */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
              <th style={{ padding: '12px' }}>Tareekh</th>
              <th style={{ padding: '12px' }}>Grahak ka Naam</th>
              <th style={{ padding: '12px' }}>Gaon / Mohalla</th>
              <th style={{ padding: '12px' }}>Mobile No</th>
              <th style={{ padding: '12px' }}>Saman ki Details</th>
              <th style={{ padding: '12px' }}>Total Bill</th>
              <th style={{ padding: '12px', color: '#38bdf8' }}>Discount Given</th>
              <th style={{ padding: '12px' }}>Jama Kiye (History)</th>
              <th style={{ padding: '12px' }}>Baki (Udhar)</th>
            </tr>
          </thead>
          <tbody>
            {finalFilteredBills.length > 0 ? (
              finalFilteredBills.map((bill) => {
                const totalDiscount = parseFloat(bill.discount) || 0;
                return (
                  <tr key={bill.id} style={{ borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                    <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{bill.date}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>{bill.customer?.name}</td>
                    <td style={{ padding: '12px' }}>
                      {bill.customer?.village}
                      {bill.customer?.area && <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>({bill.customer.area})</span>}
                    </td>
                    <td style={{ padding: '12px', color: '#334155' }}>{bill.customer?.phone}</td>
                    <td style={{ padding: '12px' }}>
                      {Object.entries(bill.items || {}).map(([key, item]) => {
                        if (item.qty > 0) {
                          const displayName = key.startsWith('other_') ? key.split('_')[1] : key;
                          const sizeInfo = item.size ? ` [Size: ${item.size}]` : '';
                          return (
                            <div key={key} style={{ fontSize: '12px', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', marginBottom: '4px', textTransform: 'capitalize', display: 'inline-block', marginRight: '5px' }}>
                              {displayName}{sizeInfo} ({item.qty} {item.unit})
                            </div>
                          );
                        }
                        return null;
                      })}
                    </td>
                    
                    {/* Bill Total Value */}
                    <td style={{ padding: '12px', fontWeight: '600' }}>
                      ₹{(parseFloat(bill.total) + totalDiscount).toFixed(2)}
                    </td>
                    
                    {/* 🎁 NEW: Discount Column */}
                    <td style={{ padding: '12px', fontWeight: '700', color: totalDiscount > 0 ? '#0284c7' : '#94a3b8' }}>
                      {totalDiscount > 0 ? `₹${totalDiscount.toFixed(2)}` : '₹0.00'}
                    </td>
                    
                    {/* 💵 NEW & IMPROVED: Payments With Date-wise History */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
                        ₹{bill.paidAmount?.toFixed(2)}
                      </div>
                      {/* Puraane jama kiye paiso ka breakdown (Tareekh ke sath) */}
                      {bill.payments && bill.payments.length > 0 && (
                        <div style={{ fontSize: '11px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '4px 8px', color: '#166534' }}>
                          {bill.payments.map((p, idx) => (
                            <div key={idx} style={{ borderBottom: idx !== bill.payments.length - 1 ? '1px dashed #bbf7d0' : 'none', padding: '2px 0' }}>
                              📅 {p.date}: <strong>₹{p.amount}</strong> ({p.mode || 'Cash'}) {p.remarks && p.remarks !== 'N/A' ? ` - ${p.remarks}` : ''}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Baki Udhar Status */}
                    <td style={{ 
                      padding: '12px', 
                      fontWeight: '700', 
                      color: bill.remaining > 0 ? '#dc2626' : '#64748b' 
                    }}>
                      ₹{bill.remaining?.toFixed(2)}
                      {bill.remaining > 0 && <span style={{ display: 'block', fontSize: '10px', color: '#dc2626', fontWeight: 'normal' }}>🔴 Udhar Baki</span>}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontWeight: '600' }}>
                  Koi record nahi mila!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerLedger;