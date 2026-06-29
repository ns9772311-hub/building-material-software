import React, { useState, useEffect } from 'react';

function AdvanceDepositForm({ onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerVillage, setCustomerVillage] = useState('');
  const [depositDate, setDepositDate] = useState(new Date().toLocaleDateString('en-GB'));
  
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [remarks, setRemarks] = useState('');

  // 📝 ALAG SE ADVANCE WALO KI LIST STATE
  const [depositList, setDepositList] = useState([]);

  // 🔍 NEW DETACHED SEARCH STATE FOR ADVANCE REPOSITORIES
  const [advanceSearch, setAdvanceSearch] = useState('');

  // App khulne par sirf advance walo ka data load hoga
  useEffect(() => {
    const savedDeposits = localStorage.getItem('material_advance_deposits');
    if (savedDeposits) {
      setDepositList(JSON.parse(savedDeposits));
    }
  }, []);

  // 🖨️ ADVANCE RECEIPT THERMAL PRINT
  const printAdvanceReceipt = (depositData) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Advance Receipt</title>
          <style>
            body { font-family: monospace; max-width: 300px; margin: 10px auto; padding: 10px; border: 1px solid #ccc; font-size: 13px; }
            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            .hr { border-top: 1px dashed black; margin: 8px 0; }
            .large { font-size: 16px; font-weight: bold; color: green; }
          </style>
        </head>
        <body>
          <h3 class="text-center" style="margin:0 0 5px 0;">🏗️ ADVANCE PAISE RASEED 🏗️</h3>
          <p class="text-center" style="margin:0; font-size:11px;">Tareekh: ${depositData.date}</p>
          <div class="hr"></div>
          <p style="margin: 3px 0;"><b>Grahak:</b> ${depositData.customer.name}</p>
          <p style="margin: 3px 0;"><b>Mobile:</b> ${depositData.customer.phone || 'N/A'}</p>
          <p style="margin: 3px 0;"><b>Gaon:</b> ${depositData.customer.village || 'N/A'}</p>
          <div class="hr"></div>
          <div class="text-center" style="margin: 10px 0;">
            <span style="font-size: 12px; color: #555;">ADVANCE JAMA RASHI:</span><br/>
            <span class="large">₹${depositData.advanceAmount.toFixed(2)}</span>
          </div>
          <div class="hr"></div>
          <p style="margin: 3px 0;"><b>Payment Mode:</b> ${depositData.mode}</p>
          ${depositData.remarks ? `<p style="margin: 3px 0;"><b>Note:</b> ${depositData.remarks}</p>` : ''}
          <div class="hr"></div>
          <p class="text-center" style="margin: 10px 0 0 0; font-style: italic;">Dhanyawad!</p>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) { alert("Bhaiya, Grahak ka Naam likhna zaroor hai!"); return; }
    if (!advanceAmount || parseFloat(advanceAmount) <= 0) { alert("Bhaiya, raqam (amount) daalo!"); return; }

    const depositObject = {
      id: 'ADV-' + Date.now(),
      date: depositDate,
      customer: { name: customerName, phone: customerPhone, village: customerVillage },
      advanceAmount: parseFloat(advanceAmount) || 0,
      mode: paymentMode,
      remarks: remarks
    };

    const updatedList = [depositObject, ...depositList];
    setDepositList(updatedList);
    localStorage.setItem('material_advance_deposits', JSON.stringify(updatedList));

    printAdvanceReceipt(depositObject);
    alert("🎉 Advance Paisa safe jama ho gaya aur Alag List me save ho chuka hai!");
    resetForm();
  };

  const handleDeleteDeposit = (id) => {
    if (window.confirm("Kya aap is advance raseed ko list se delete karna चाहते हैं?")) {
      const updated = depositList.filter(d => d.id !== id);
      setDepositList(updated);
      localStorage.setItem('material_advance_deposits', JSON.stringify(updated));
    }
  };

  const resetForm = () => {
    setCustomerName(''); setCustomerPhone(''); setCustomerVillage(''); setAdvanceAmount(''); setRemarks('');
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #9b59b6', paddingBottom: '10px' }}>
        <h2 style={{ color: '#9b59b6', margin: '0' }}>💰 Sirf Advance Paisa Jama (Alag Register)</h2>
        <button type="button" onClick={onClose} style={styles.backBtn}>← Wapas Bill Page Par Chalein</button>
      </div>

      {/* 📝 FORM BLOCK */}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px', backgroundColor: '#fcf8ff', padding: '15px', borderRadius: '8px', border: '1px solid #ebd2ff' }}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}><label style={styles.label}>Grahak ka Naam *</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jaise: Sunil Sahu" style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Mobile Number</label><input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="9988xxxxxx" style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Gaon / Kasba</label><input type="text" value={customerVillage} onChange={(e) => setCustomerVillage(e.target.value)} placeholder="Jaise: Sukkam" style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Jama Ki Tareekh</label><input type="text" value={depositDate} onChange={(e) => setDepositDate(e.target.value)} style={styles.input} /></div>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px', alignItems: 'flex-end' }}>
          <div style={{ ...styles.formGroup, flex: '2' }}>
            <label style={{ ...styles.label, color: '#9b59b6' }}>Kitna Advance Paisa Mila? (₹) *:</label>
            <input type="number" placeholder="₹ 0.00" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} style={{ ...styles.input, border: '2px solid #9b59b6', fontWeight: 'bold', fontSize: '18px' }} />
          </div>
          <div style={{ ...styles.formGroup, flex: '1' }}>
            <label style={styles.label}>Payment Mode</label>
            <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} style={styles.select}>
              <option value="Cash">💵 Cash</option><option value="UPI">📱 UPI</option><option value="Bank">🏦 Bank</option>
            </select>
          </div>
          <div style={{ ...styles.formGroup, flex: '2' }}>
            <label style={styles.label}>Tippani / Note</label>
            <input type="text" placeholder="Remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} style={styles.input} />
          </div>
          <button type="submit" style={styles.submitBtn}>💾 Save & Print</button>
        </div>
      </form>

      {/* 📊 ADVANCE GRAHAK LIST TITLE */}
      <h3 style={{ marginTop: '35px', color: '#2c3e50', borderBottom: '2px solid #9b59b6', paddingBottom: '5px', marginBottom: '15px' }}>📋 Advance Jama Karne Walon Ki Alag List</h3>
      
      {/* 🔍 NEW ADVANCE REGISTER SEARCH INPUT BAR */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="🔍 Advance dene wale grahak ka Naam, Mobile No. ya Gaon/Kasba daal kar dhoondhein..." 
          value={advanceSearch} 
          onChange={(e) => setAdvanceSearch(e.target.value)} 
          style={{
            width: '100%',
            padding: '12px 15px',
            fontSize: '14px',
            border: '2px solid #9b59b6', // Theme matched border color
            borderRadius: '6px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        {advanceSearch && (
          <button 
            type="button"
            onClick={() => setAdvanceSearch('')} 
            style={{ padding: '0 15px', background: '#777', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear
          </button>
        )}
      </div>

      {depositList.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic', marginTop: '10px' }}>Abhi tak is register me koi paisa jama nahi hua hai.</p>
      ) : (
        <div style={styles.tableResponsive}>
          <table style={styles.itemTable}>
            <thead>
              <tr style={{ backgroundColor: '#f4f6f9' }}>
                <th style={styles.th}>Grahak Details</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Jama Tareekh</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Mode</th>
                <th style={styles.th}>Tippani / Note</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Jama Rashi</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* 📊 FILTERED DEPOSITS MAP LOGIC */}
              {depositList
                .filter(deposit => {
                  if (!advanceSearch || !advanceSearch.trim()) return true;
                  const word = advanceSearch.toLowerCase().trim();
                  const name = (deposit?.customer?.name || '').toLowerCase();
                  const phone = (deposit?.customer?.phone || '').toLowerCase();
                  const village = (deposit?.customer?.village || '').toLowerCase();
                  return name.includes(word) || phone.includes(word) || village.includes(word);
                })
                .map((deposit) => (
                  <tr key={deposit.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={styles.td}>
                      <strong>👤 {deposit.customer.name}</strong><br/>
                      <span style={{ fontSize: '12px', color: '#555' }}>📞 {deposit.customer.phone || 'N/A'}</span><br/>
                      <span style={{ fontSize: '12px', color: '#777' }}>📍 {deposit.customer.village || 'N/A'}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>📅 {deposit.date}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>💳 {deposit.mode}</td>
                    <td style={{ ...styles.td, color: '#555', fontSize: '13px' }}>{deposit.remarks || 'N/A'}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold', color: 'green', fontSize: '15px' }}>₹{deposit.advanceAmount.toFixed(2)}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button type="button" onClick={() => printAdvanceReceipt(deposit)} style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' }}>🖨️ Print</button>
                      <button type="button" onClick={() => handleDeleteDeposit(deposit.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>❌ Delete</button>
                    </td>
                  </tr>
                ))}

              {/* ⚠️ IF NO SEARCH RECORD MATCHES */}
              {depositList.filter(deposit => {
                if (!advanceSearch || !advanceSearch.trim()) return true;
                const word = advanceSearch.toLowerCase().trim();
                return (deposit?.customer?.name || '').toLowerCase().includes(word) || (deposit?.customer?.phone || '').toLowerCase().includes(word) || (deposit?.customer?.village || '').toLowerCase().includes(word);
              }).length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', fontStyle: 'italic', textAlign: 'center', color: '#999' }}>
                    Bhaiya, is naam, mobile number ya gaon se koi bhi advance payment entry nahi mili!
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

const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '8px' },
  formRow: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' },
  formGroup: { flex: '1', display: 'flex', flexDirection: 'column', minWidth: '180px' },
  label: { fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#4A5568' },
  input: { padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  select: { padding: '10px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: 'white' },
  tableResponsive: { overflowX: 'auto', marginTop: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' },
  itemTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', fontSize: '13px', color: '#4A5568', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' },
  td: { padding: '12px', borderBottom: '1px solid #E2E8F0', verticalAlign: 'middle' },
  submitBtn: { background: '#9b59b6', color: 'white', border: 'none', padding: '10px 25px', fontSize: '14px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', height: '40px' },
  backBtn: { background: '#34495e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AdvanceDepositForm;