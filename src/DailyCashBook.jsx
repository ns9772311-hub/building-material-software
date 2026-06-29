import React, { useState, useEffect } from 'react';

function DailyCashBook({ onClose }) {
  const [transactionType, setTransactionType] = useState('IN'); // IN = Paisa Aaya, OUT = Paisa Gaya
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [txDate, setTxDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [cashbookSearch, setCashbookSearch] = useState('');

  // 📝 TRANSACTIONS HISTORY STATE
  const [txList, setTxList] = useState([]);

  // Load History on Open
  useEffect(() => {
    const savedTx = localStorage.getItem('material_daily_cashbook');
    if (savedTx) {
      setTxList(JSON.parse(savedTx));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!personName.trim()) { alert("Bhaiya, Naam likhna zaroor hai!"); return; }
    if (!amount || parseFloat(amount) <= 0) { alert("Bhaiya, sahi raqam (Amount) daalo!"); return; }
    if (!reason.trim()) { alert("Bhaiya, Paisa dene ya lene ka Karan (Kyon Diye) likhna zaroor hai!"); return; }

    const txObject = {
      id: 'TX-' + Date.now(),
      date: txDate,
      type: transactionType, // IN / OUT
      name: personName,
      amount: parseFloat(amount) || 0,
      reason: reason,
      mode: paymentMode
    };

    const updatedList = [txObject, ...txList];
    setTxList(updatedList);
    localStorage.setItem('material_daily_cashbook', JSON.stringify(updatedList));

    alert("📊 Roznamcha (Cashbook) me entry surakshit save ho gayi hai!");
    setPersonName(''); setAmount(''); setReason('');
  };

  const handleDeleteTx = (id) => {
    if (window.confirm("Kya aap is entry ko daily history se delete karna chahte hain?")) {
      const updated = txList.filter(t => t.id !== id);
      setTxList(updated);
      localStorage.setItem('material_daily_cashbook', JSON.stringify(updated));
    }
  };

  // Aaj ka Total calculation (Income vs Expense)
  const totalIn = txList.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
  const totalOut = txList.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '8px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #3498db', paddingBottom: '10px' }}>
        <h2 style={{ color: '#3498db', margin: '0' }}>💸 Daily Kharch & Cash Hisab (Roznamcha)</h2>
        <button type="button" onClick={onClose} style={{ background: '#34495e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>← Wapas Bill Page Par Chalein</button>
      </div>

      {/* SUMMARY BADGES */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', border: '1px solid #c8e6c9', minWidth: '150px' }}>
          <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>KUL PAISA AAYA (INCOME)</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#2e7d32' }}>₹{totalIn.toFixed(2)}</h3>
        </div>
        <div style={{ flex: '1', backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', border: '1px solid #ffcdd2', minWidth: '150px' }}>
          <span style={{ fontSize: '12px', color: '#c62828', fontWeight: 'bold' }}>KUL PAISA GAYA (EXPENSE)</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#c62828' }}>₹{totalOut.toFixed(2)}</h3>
        </div>
        <div style={{ flex: '1', backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', border: '1px solid #bbdefb', minWidth: '150px' }}>
          <span style={{ fontSize: '12px', color: '#1565c0', fontWeight: 'bold' }}>NET CASH BALANCE</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#1565c0' }}>₹{(totalIn - totalOut).toFixed(2)}</h3>
        </div>
      </div>

      {/* 📥 ENTRY FORM */}
      <form onSubmit={handleSubmit} style={{ marginTop: '25px', backgroundColor: '#f2f9ff', padding: '20px', borderRadius: '8px', border: '1px solid #cfe7ff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '160px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Transaction Ka Prakar</label>
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: 'white', fontWeight: 'bold', color: transactionType === 'IN' ? 'green' : 'red' }}>
              <option value="IN">🟢 [+ IN] Paisa Aaya (Received)</option>
              <option value="OUT">🔴 [- OUT] Paisa Gaya (Paid)</option>
            </select>
          </div>

          <div style={{ flex: '2', display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>{transactionType === 'IN' ? "Kiske Se Mila (Naam) *" : "Kise Diya (Naam) *"}</label>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="Jaise: Driver Ramesh, Munna Shukla" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
          </div>

          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Kitne Paise? (₹) *</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹ 0.00" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 'bold' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: '2', display: 'flex', flexDirection: 'column', minWidth: '220px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Kyon Diye / Kisliye Aaye (Reason) *</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Jaise: Gadi ka bhada, Chai-pani kharch, Sand udhari payment..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
          </div>

          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '130px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Payment Mode</label>
            <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: 'white' }}>
              <option value="Cash">💵 Cash</option><option value="UPI">📱 UPI</option><option value="Bank">🏦 Bank</option>
            </select>
          </div>

          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '130px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Tareekh</label>
            <input type="text" value={txDate} onChange={(e) => setTxDate(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
          </div>

          <button type="submit" style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 25px', fontSize: '14px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', height: '40px' }}>💾 Entry Save Karein</button>
        </div>
      </form>
{/* 📊 DAILY HISTORY TABLE */}
      <h3 style={{ marginTop: '35px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>📋 Daily Transactions History (Roznamcha Register)</h3>
      
      {/* 🔍 NEW DEDICATED SEARCH BAR FOR CASHBOOK HISTORIES */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="🔍 Vyakti ka Naam ya Kyon Diye (Karan) type karke dhoondhein..." 
          value={cashbookSearch || ''} 
          onChange={(e) => setCashbookSearch(e.target.value)} 
          style={{
            width: '100%',
            padding: '12px 15px',
            fontSize: '14px',
            border: '2px solid #3498db', 
            borderRadius: '6px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        {cashbookSearch && (
          <button 
            type="button"
            onClick={() => setCashbookSearch('')} 
            style={{ padding: '0 15px', background: '#777', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear
          </button>
        )}
      </div>

      {txList.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic', marginTop: '10px' }}>Abhi tak roznamche me koi entry nahi hai.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f6f9' }}>
                <th style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>Tareekh</th>
                <th style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>Prakar (Type)</th>
                <th style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>Naam (Grahak/Vyakti)</th>
                <th style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>Kyon Diye / Liye (Karan)</th>
                <th style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>Mode</th>
                <th style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold', textAlign: 'right' }}>Rashi (Amount)</th>
                <th style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* 📊 LIVE TRANSACTIONS SEARCH FILTER */}
              {txList
                .filter(tx => {
                  if (!cashbookSearch || !cashbookSearch.trim()) return true;
                  const word = cashbookSearch.toLowerCase().trim();
                  const name = (tx?.name || '').toLowerCase();
                  const reasonText = (tx?.reason || '').toLowerCase();
                  const dateText = (tx?.date || '').toLowerCase();
                  return name.includes(word) || reasonText.includes(word) || dateText.includes(word);
                })
                .map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: tx.type === 'IN' ? '#fafffa' : '#fffafb' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>📅 {tx.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', color: 'white', backgroundColor: tx.type === 'IN' ? '#2ecc71' : '#e74c3c' }}>
                        {tx.type === 'IN' ? 'PAISA AAYA' : 'PAISA GAYA'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>👤 {tx.name}</td>
                    <td style={{ padding: '12px', color: '#555' }}>💡 {tx.reason}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>💳 {tx.mode}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: tx.type === 'IN' ? 'green' : 'red', fontSize: '15px' }}>
                      {tx.type === 'IN' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button type="button" onClick={() => handleDeleteTx(tx.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>❌ Delete</button>
                    </td>
                  </tr>
                ))}

              {/* ⚠️ IF NO SEARCH RECODS MATCHED WITH FILTER */}
              {txList.filter(tx => {
                if (!cashbookSearch || !cashbookSearch.trim()) return true;
                const word = cashbookSearch.toLowerCase().trim();
                return (tx?.name || '').toLowerCase().includes(word) || (tx?.reason || '').toLowerCase().includes(word) || (tx?.date || '').toLowerCase().includes(word);
              }).length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', fontStyle: 'italic', textAlign: 'center', color: '#999' }}>
                    Bhaiya, roznamche me is naam, tareekh ya karan se milti-julti koi entry nahi mili!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DailyCashBook;