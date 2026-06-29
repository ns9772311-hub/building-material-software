import React from 'react';

function BillHistory({ bills = [], currentSearchTerm = '', onDelete, onEdit, onPrint }) {
  
  const isSearching = currentSearchTerm.trim().length > 0;
  
  const isSingleCustomer = bills.length > 0 && bills.every(bill => {
    const currentName = (bill?.customer?.name || '').toLowerCase();
    const firstName = (bills[0]?.customer?.name || '').toLowerCase();
    const currentVillage = (bill?.customer?.village || '').toLowerCase();
    const firstVillage = (bills[0]?.customer?.village || '').toLowerCase();
    
    return currentName === firstName && currentVillage === firstVillage;
  });

  let totalBusiness = 0;
  let totalReceived = 0;
  let totalPendingUdhar = 0;
  let allPaymentsCombined = [];

  if (isSearching && isSingleCustomer) {
    bills.forEach(bill => {
      totalBusiness += bill.total || 0;
      totalReceived += bill.paidAmount || 0;
      totalPendingUdhar += bill.remaining || 0;

      if (bill.payments && Array.isArray(bill.payments)) {
        bill.payments.forEach(p => {
          allPaymentsCombined.push({
            billDate: bill.date,
            payDate: p.date,
            amount: p.amount,
            mode: p.mode || 'Cash',
            remarks: p.remarks || 'N/A'
          });
        });
      } else if (bill.paidAmount > 0) {
        allPaymentsCombined.push({
          billDate: bill.date,
          payDate: bill.date,
          amount: bill.paidAmount,
          mode: 'Cash',
          remarks: 'Purana'
        });
      }
    });
  }

  // 📲 1-CLICK WHATSAPP MESSAGE SHARING LOGIC
  const handleWhatsAppShare = (bill) => {
    const phone = bill?.customer?.phone || '';
    if (!phone || phone.trim().length < 10) {
      alert("Bhaiya, is grahak ka Mobile Number sahi nahi hai ya khali hai!");
      return;
    }

    const items = bill?.items || {};
    const samanSummary = Object.keys(items)
      .filter(key => items[key]?.qty > 0)
      .map(key => {
        const displayName = key.startsWith('other_') ? key.split('_')[1] : key;
        return `${displayName.toUpperCase()} (${items[key].qty} ${items[key].unit})`;
      })
      .join(', ');

    // Badhiya Hindi format me Message text build kiya
    const messageText = `*M/S DUKAAN KA NAAM*
---------------------------------------
*Grahak:* ${bill?.customer?.name}
*Gaon:* ${bill?.customer?.village || '-'}
*Tareekh:* ${bill.date}
---------------------------------------
*Saman Details:* ${samanSummary}

*Kul Bill Amount:* ₹${(bill.total || 0).toFixed(2)}
*Mila Discount:* ₹${(bill.discount || 0).toFixed(2)}
*Kul Jama (Paid):* ₹${(bill.paidAmount || 0).toFixed(2)}
---------------------------------------
*🔴 BAKI UDHAR (Dues): ₹${(bill.remaining || 0).toFixed(2)}*

Aapka din shubh ho! Shukriya 🙏`;

    // WhatsApp API URL generator
    const cleanPhone = phone.replace(/\D/g, ''); // Faltu spaces hatane ke liye
    const finalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(messageText)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ padding: '10px 0px' }}>
      
      {/* 📊 LEDGER SUMMARY BOARD */}
      {isSearching && isSingleCustomer && bills.length > 0 && (
        <div style={styles.ledgerBoard}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
            📊 {bills[0]?.customer?.name} (Gaon: {bills[0]?.customer?.village}) ka Kul Hisab (All Time Total)
          </h3>
          <div style={styles.ledgerGrid}>
            <div style={{ ...styles.gridItem, borderColor: '#007bff' }}>
              <span style={styles.gridLabel}>Kul Saman Liya (Total)</span>
              <span style={{ ...styles.gridValue, color: '#007bff' }}>₹{totalBusiness.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.gridItem, borderColor: '#28a745' }}>
              <span style={styles.gridLabel}>Kul Jama Kiye (Paid)</span>
              <span style={{ ...styles.gridValue, color: '#28a745' }}>₹{totalReceived.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.gridItem, borderColor: '#dc3545', backgroundColor: '#fff5f5' }}>
              <span style={styles.gridLabel}>🔴 Kul Baki Udhar (Dues)</span>
              <span style={{ ...styles.gridValue, color: '#dc3545' }}>₹{totalPendingUdhar.toFixed(2)}</span>
            </div>
          </div>

          {/* DATE-WISE PAYMENT HISTORY LIST */}
          {allPaymentsCombined.length > 0 && (
            <div style={styles.ledgerPaymentsList}>
              <strong style={{ fontSize: '13px', color: '#e67e22', display: 'block', marginBottom: '8px' }}>
                ⏳ Paisa Jama Hone Ka Tareekh-war Itihas (Payment History Summary):
              </strong>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {allPaymentsCombined.map((p, idx) => (
                  <div key={idx} style={styles.historyChip}>
                    📅 {p.payDate} | 💳 <b>{p.mode}</b> ➡️ <span style={{ color: 'green', fontWeight: 'bold' }}>₹{parseFloat(p.amount).toFixed(2)}</span> {p.remarks !== 'N/A' && `(${p.remarks})`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isSearching && !isSingleCustomer && bills.length > 0 && (
        <div style={styles.infoAlert}>
          💡 <strong>Tip:</strong> Ek hi naam ke multiple log hain. Unka alag-alag Khata dekhne ke liye naam ke aage unka gaon bhi likhein.
        </div>
      )}

      {/* 📋 Record Table */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: '12px' }}>Tareekh</th>
              <th style={{ padding: '12px' }}>Grahak ka Naam</th>
              <th style={{ padding: '12px' }}>Gaon / Mohalla</th>
              <th style={{ padding: '12px' }}>Mobile No</th>
              <th style={{ padding: '12px' }}>Saman ki Details</th>
              <th style={{ padding: '12px' }}>Total Bill</th>
              <th style={{ padding: '12px' }}>Jama Kiye</th>
              <th style={{ padding: '12px' }}>Baki (Udhar)</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#777', fontWeight: 'bold' }}>
                  Koi record nahi mila.
                </td>
              </tr>
            ) : (
              bills.map((bill) => {
                const items = bill?.items || {};
                const samanSummary = Object.keys(items)
                  .filter(key => items[key]?.qty > 0)
                  .map(key => {
                    const displayName = key.startsWith('other_') ? key.split('_')[1] : key;
                    const sizeInfo = items[key].size && items[key].size !== '-' ? ` [Size: ${items[key].size}]` : '';
                    return `${displayName}${sizeInfo} (${items[key].qty} ${items[key].unit})`;
                  })
                  .join(', ');

                const hasMultiplePayments = bill.payments && bill.payments.length > 0;
                
                // 📈 RED ALERT WARNING: Agar udhar ₹25,000 se upar hai toh row red background ki hogi
                const isHighRiskUdhar = (bill.remaining || 0) >= 25000;
                const rowBgColor = isHighRiskUdhar ? '#ffeded' : 'white';

                return (
                  <tr key={bill.id} style={{ borderBottom: '1px solid #ddd', backgroundColor: rowBgColor }}>
                    <td style={styles.td}>{bill.date}</td>
                    <td style={styles.td}>
                      <strong>{bill?.customer?.name}</strong>
                      {isHighRiskUdhar && <span style={styles.alertBadge} title="Bada Udhar Baki Hai!">⚠️ Bada Udhar</span>}
                    </td>
                    <td style={{ ...styles.td, color: '#555', fontSize: '13px' }}>
                      {bill?.customer?.village} {bill?.customer?.area ? `(${bill.customer.area})` : ''}
                    </td>
                    <td style={styles.td}>{bill?.customer?.phone}</td>
                    <td style={{ ...styles.td, fontSize: '12px', color: '#666', textAlign: 'left', textTransform: 'capitalize' }}>
                      {samanSummary}
                    </td>
                    <td style={styles.td}>₹{(bill.total || 0).toFixed(2)}</td>
                    
                    {/* JAMA KIYE & MINI LIST */}
                    <td style={{ ...styles.td, color: 'green', verticalAlign: 'middle' }}>
                      <strong>₹{(bill.paidAmount || 0).toFixed(2)}</strong>
                      {hasMultiplePayments && (
                        <div style={styles.miniPaymentList}>
                          {bill.payments.map((p, pIdx) => (
                            <div key={pIdx} style={{ fontSize: '10px', color: '#555', borderTop: '1px dashed #ddd', paddingTop: '2px', marginTop: '2px' }}>
                              🗓️ {p.date} | 💳 {p.mode} ➡️ ₹{p.amount}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td style={{ 
                      ...styles.td, 
                      color: (bill.remaining || 0) > 0 ? '#dc3545' : 'black', 
                      fontWeight: (bill.remaining || 0) > 0 ? 'bold' : 'normal' 
                    }}>
                      ₹{(bill.remaining || 0).toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => onPrint(bill, 'A4')} style={styles.printBtn}>📄 A4</button>
                        <button onClick={() => onPrint(bill, 'Thermal')} style={styles.thermalBtn}>🧾 Parchi</button>
                        <button onClick={() => handleWhatsAppShare(bill)} style={styles.whatsappBtn}>🟢 WhatsApp</button>
                        <button onClick={() => onEdit(bill)} style={styles.editBtn}>✏️ Edit</button>
                        <button onClick={() => onDelete(bill.id)} style={styles.deleteBtn}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  ledgerBoard: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', fontFamily: 'sans-serif' },
  infoAlert: { backgroundColor: '#e2f0fe', color: '#31708f', padding: '12px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', borderLeft: '5px solid #31708f', fontFamily: 'sans-serif' },
  ledgerGrid: { display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' },
  gridItem: { flex: '1', minWidth: '150px', backgroundColor: 'white', padding: '15px', borderRadius: '6px', borderTop: '4px solid', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  gridLabel: { fontSize: '13px', color: '#666', fontWeight: 'bold' },
  gridValue: { fontSize: '20px', fontWeight: 'bold', marginTop: '5px' },
  ledgerPaymentsList: { marginTop: '15px', paddingTop: '12px', borderTop: '1px dashed #ccc' },
  historyChip: { backgroundColor: '#fff9f3', border: '1px solid #fdecd8', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', color: '#444' },
  miniPaymentList: { marginTop: '4px', backgroundColor: '#f9fbf9', padding: '4px', borderRadius: '4px', border: '1px solid #e1ebe1', textAlign: 'left', display: 'block' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontFamily: 'sans-serif' },
  td: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px' },
  alertBadge: { display: 'block', backgroundColor: '#dc3545', color: 'white', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', marginTop: '4px', fontWeight: 'bold', width: 'fit-content', margin: '4px auto 0 auto' },
  printBtn: { background: '#007bff', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  thermalBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  whatsappBtn: { background: '#28a745', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  editBtn: { background: '#ffc107', color: 'black', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
};

export default BillHistory;