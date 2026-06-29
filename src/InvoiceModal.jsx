import React from 'react';
import './InvoiceModal.css'; // CSS file ko import kiya

function InvoiceModal({ bill, onClose }) {
  if (!bill) return null;

  // 🛠️ SABHI DATA VARIATIONS KO EK SATH EK LIST ME LAYE (HAR EK DATE KO DIKHANE KE LIYE)
  let allPayments = [];

  // 1. Agar bill ke andar direct 'payments' ya 'pastPayments' ya 'transactions' naam ka array hai, toh use lein
  const rawPayments = bill.payments || bill.pastPayments || bill.transactions || [];

  if (Array.isArray(rawPayments) && rawPayments.length > 0) {
    allPayments = [...rawPayments];
  } 
  // 2. Agar upar ke arrays khali hain par paidAmount me rashi hai, toh backup ke liye ise dikhayein
  else if (bill.paidAmount > 0) {
    allPayments.push({
      date: bill.date,
      mode: 'Cash (Advance)',
      remarks: 'Bill banate samay jama kiya',
      amount: bill.paidAmount
    });
  }

  return (
    <div className="invoice-overlay">
      <div className="invoice-modal">
        
        {/* Header Section */}
        <div className="invoice-header">
          <h2 className="shop-title">Maa Durga Building Materials</h2>
          <p className="invoice-subtitle">Loha, Gitti, Cement, Ret ke Thok Vikreta</p>
          <p className="shop-address">📍 Main Road, Sukkam (Near Bus Stand), District- Balaghat (M.P.)</p>
          <p className="shop-contact">📞 Mob: 7999962606, 8989646906</p>
          
          <div className="invoice-meta-box">
            <p><strong>Bill No:</strong> #{bill.id}</p>
            <p><strong>Date:</strong> {bill.date}</p>
          </div>
        </div>

        {/* Customer Details Section */}
        <div className="invoice-customer-info">
          <h3>Grahak ka Vivaran (Customer Details)</h3>
          <div className="info-grid">
            <p><strong>Naam:</strong> {bill.customer?.name}</p>
            <p><strong>Mobile:</strong> {bill.customer?.phone}</p>
            <p><strong>Gaon/Shehar:</strong> {bill.customer?.village}</p>
            {bill.customer?.area && <p><strong>Mohalla/Area:</strong> {bill.customer.area}</p>}
          </div>
        </div>

        {/* Items Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Saman ka Naam</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(bill.items || {}).map((key) => {
              const item = bill.items[key];
              if (!item || item.qty === 0) return null;
              return (
                <tr key={key}>
                  <td className="item-name">{key}</td>
                  <td>{item.qty} {item.unit || (key === 'loha' ? 'KG' : 'Trali/Bags')}</td>
                  <td>₹{item.rate}</td>
                  <td>₹{(item.qty * item.rate).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 📊 FIXED: HAR EK TAREEKH KO ALAG ALAG ROW ME DIKHANE KE LIYE TABLE */}
        <div className="invoice-payment-history-section" style={{ marginTop: '20px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', color: '#333', borderBottom: '2px solid #333', paddingBottom: '4px', margin: '0 0 8px 0' }}>
            📋 Jama Rashi Ka Tareekh-war Vivran (Payment History)
          </h3>
          <table className="invoice-table" style={{ margin: '0 0 15px 0', fontSize: '13px' }}>
            <thead style={{ backgroundColor: '#f1f5f9' }}>
              <tr>
                <th style={{ padding: '6px' }}>S.No.</th>
                <th style={{ padding: '6px' }}>Jama Karne Ki Tareekh</th>
                <th style={{ padding: '6px' }}>Payment Mode</th>
                <th style={{ padding: '6px' }}>Tippani (Remarks)</th>
                <th style={{ padding: '6px', textAlign: 'right' }}>Jama Rashi (Amount)</th>
              </tr>
            </thead>
            <tbody>
              {allPayments.length > 0 ? (
                allPayments.map((pay, index) => (
                  <tr key={index}>
                    <td style={{ padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                    {/* 📅 Har entry ki apni khud ki date yahan load hogi */}
                    <td style={{ padding: '6px', fontWeight: '500' }}>📅 {pay.date || bill.date}</td>
                    <td style={{ padding: '6px' }}>💳 {pay.mode || 'Cash'}</td>
                    <td style={{ padding: '6px', fontStyle: 'italic', color: '#555' }}>{pay.remarks || (index === 0 ? 'Advance' : 'Kist')}</td>
                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                      ₹{parseFloat(pay.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '10px', textAlign: 'center', color: '#777' }}>
                    Abhi tak koi kist/paisa jama nahi kiya gaya hai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Final Calculation Summary */}
        <div className="invoice-summary-section">
          <div className="invoice-terms">
            <h4>शर्तें / Rules:</h4>
            <p>1. Bikaoo maal wapas nahi hoga.</p>
            <p>2. Gaadi bhada grahak ko alag se dena hoga.</p>
            <p>3. Kisi bhi vivad ka nyayalay kshetr sthaniy hoga.</p>
          </div>

          <div className="invoice-totals">
            <p><span>Total Amount:</span> <strong>₹{(bill.total || 0).toFixed(2)}</strong></p>
            <p className="text-success"><span>Paid Amount (Kul Jama):</span> <strong>₹{(bill.paidAmount || 0).toFixed(2)}</strong></p>
            <p className={(bill.remaining || 0) > 0 ? "text-danger" : ""}>
              <span>Balance (Baki Kul Udhar):</span> <strong>₹{(bill.remaining || 0).toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="invoice-signatures">
          <div className="sig-box">
            <div className="sig-line"></div>
            <p>Grahak ke Signature</p>
          </div>
          <div className="sig-box status-right">
            <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '40px' }}>For Maa Durga Building Materials</p>
            <div className="sig-line"></div>
            <p>Authorised Signatory / Owner</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="invoice-actions no-print">
          <button className="btn-print" onClick={() => window.print()}>🖨️ Print Karein</button>
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}

export default InvoiceModal;