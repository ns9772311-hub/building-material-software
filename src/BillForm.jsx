import React, { useState, useEffect } from 'react';
const INITIAL_ITEMS = {
  cement: { qty: '', rate: '', unit: 'Bags', size: '-' },
  loha_6mm: { qty: '', rate: '', unit: 'KG', size: '6mm' },
  loha_8mm: { qty: '', rate: '', unit: 'KG', size: '8mm' },
  loha_10mm: { qty: '', rate: '', unit: 'KG', size: '10mm' },
  loha_12mm: { qty: '', rate: '', unit: 'KG', size: '12mm' },
  loha_16mm: { qty: '', rate: '', unit: 'KG', size: '16mm' },
  ret_trali: { qty: '', rate: '', unit: 'Trali', size: 'Standard Trali' },
  ret_6chaka: { qty: '', rate: '', unit: 'Trali', size: '6 Chaka Dumper' },
  ret_8chaka: { qty: '', rate: '', unit: 'Trali', size: '8 Chaka Dumper' },
  ret_10chaka: { qty: '', rate: '', unit: 'Trali', size: '10 Chaka Dumper' },
  ret_12chaka: { qty: '', rate: '', unit: 'Trali', size: '12 Chaka Dumper' },
  gitti_trali: { qty: '', rate: '', unit: 'Trali', size: 'Standard Trali' },
  gitti_6chaka: { qty: '', rate: '', unit: 'Trali', size: '6 Chaka Dumper' },
  gitti_8chaka: { qty: '', rate: '', unit: 'Trali', size: '8 Chaka Dumper' },
  gitti_10chaka: { qty: '', rate: '', unit: 'Trali', size: '10 Chaka Dumper' },
  gitti_12chaka: { qty: '', rate: '', unit: 'Trali', size: '12 Chaka Dumper' },
  taals: { qty: '', rate: '', unit: 'Pcs', size: '-' },
};
function BillForm({ onSaveBill, editData, onCancelEdit, onPrint }) {
  // 👤 CUSTOMER & DATE STATES
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  // 🚚 NAYE LOGIC STATES (Bhada, Purana Baki, Shartien)
const [freightCharges, setFreightCharges] = useState('');
const [previousBalance, setPreviousBalance] = useState('');
const [billTerms, setBillTerms] = useState('1. Bikā huā māāl wāpās nahī hogā.\n2. Udhārī kā bhugtāān 15 din ke āndār kareī.');
  const [customerVillage, setCustomerVillage] = useState('');
  const [customerArea, setCustomerArea] = useState('');
  const [billDate, setBillDate] = useState('');

  // 🧱 MATERIALS ITEMS STATE
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [extraItems, setExtraItems] = useState([]);

  // 💰 MULTIPLE PAYMENT HISTORY STATES (With Mode & Remarks)
  const [pastPayments, setPastPayments] = useState([]); 
  const [newPaidAmount, setNewPaidAmount] = useState(''); 
  const [newPaidDate, setNewPaidDate] = useState('');   
  const [newPaymentMode, setNewPaymentMode] = useState('Cash'); 
  const [newPaymentRemarks, setNewPaymentRemarks] = useState(''); 
  const [discountAmount, setDiscountAmount] = useState('');

  // 🔄 EDIT MODE LOGIC
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedToday = `${dd}/${mm}/${yyyy}`;

    if (editData) {
      setCustomerName(editData.customer?.name || '');
      setCustomerPhone(editData.customer?.phone || '');
      setCustomerVillage(editData.customer?.village || '');
      setCustomerArea(editData.customer?.area || '');
      setBillDate(editData.date || formattedToday);
      
      // 🟢 FIXED: Yahan pehle galti se date load ho rahi thi, ab sahi discount load hoga
      setDiscountAmount(editData.discount || '');
      setFreightCharges(editData.freight || '');
setPreviousBalance(editData.prevBalance || '');
setBillTerms(editData.terms || '1. Bika hua maal wapas nahi hoga.\n2. Udhari ka bhugtan 15 din ke andar karein.');
      
      setPastPayments(editData.payments || 
        (editData.paidAmount ? [{ date: editData.date || 
          formattedToday, amount: editData.paidAmount, mode: 'Cash', remarks: 'Purana Record' }] : []));
      
      setNewPaidAmount('');
      setNewPaidDate(formattedToday);
      setNewPaymentMode('Cash');
      setNewPaymentRemarks('');

      const savedItems = editData.items || {};
      const updatedItems = { ...INITIAL_ITEMS };
      Object.keys(INITIAL_ITEMS).forEach(key => {
        if (savedItems[key]) {
          updatedItems[key] = {
            qty: savedItems[key].qty || '',
            rate: savedItems[key].rate || '',
            unit: savedItems[key].unit || INITIAL_ITEMS[key].unit,
            size: savedItems[key].size || INITIAL_ITEMS[key].size
          };
        }
      });
      setItems(updatedItems);

      const dynamicExtraItems = [];
      Object.keys(savedItems).forEach(key => {
        if (key.startsWith('other_')) {
          const originalName = key.replace('other_', '');
          dynamicExtraItems.push({
            id: key,
            name: originalName,
            qty: savedItems[key].qty || '',
            rate: savedItems[key].rate || '',
            unit: savedItems[key].unit || 'Pcs',
            size: savedItems[key].size || '-'
          });
        }
      });
      setExtraItems(dynamicExtraItems);
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerVillage('');
    setCustomerArea('');
    setItems(INITIAL_ITEMS);
    setExtraItems([]);
    setPastPayments([]);
    setNewPaidAmount('');
    setDiscountAmount('');
    setNewPaymentMode('Cash');
    setNewPaymentRemarks('');
    
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedToday = `${dd}/${mm}/${yyyy}`;
    
    setBillDate(formattedToday);
    setNewPaidDate(formattedToday);
  };

  useEffect(() => {
    if (!editData) { resetForm(); }
  }, []);

  const handleItemChange = (itemKey, field, value) => {
    setItems(prev => ({ ...prev, [itemKey]: { ...prev[itemKey], [field]: value } }));
  };

  const addExtraItemRow = () => {
    setExtraItems(prev => [...prev, { id: 'other_' + Date.now() + Math.random(), name: '', qty: '', rate: '', unit: 'Pcs', size: '-' }]);
  };
  
  const handleExtraItemChange = (id, field, value) => {
    setExtraItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeExtraItemRow = (id) => {
    setExtraItems(prev => prev.filter(item => item.id !== id));
  };

  const removePastPayment = (index) => {
    if(window.confirm("Kya aap sach me yeh purani kist hatana chahte hain?")) {
      setPastPayments(prev => prev.filter((_, i) => i !== index));
    }
  };

  // 🧮 SUMMARY MATHS (UPDATED WITH BHADA & PURANA BAKI)
  let itemsTotal = 0; 
  Object.keys(items).forEach(key => {
    itemsTotal += (parseFloat(items[key].qty) || 0) * (parseFloat(items[key].rate) || 0);
  });
  extraItems.forEach(item => {
    itemsTotal += (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
  });

  const liveDiscount = parseFloat(discountAmount) || 0;
  const liveFreight = parseFloat(freightCharges) || 0;         // 🚚 Naya Bhada State
  const livePrevBalance = parseFloat(previousBalance) || 0;     // 👤 Naya Purana Baki State

  // 🔥 Final Bill Calculation: Maal ka Total - Discount + Bhada + Purana Baki
  const finalCalculatedTotal = itemsTotal - liveDiscount + liveFreight + livePrevBalance; 
  
  const totalPastPaid = pastPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const currentNewPaid = parseFloat(newPaidAmount) || 0;
  const totalFinalPaid = totalPastPaid + currentNewPaid;
  const totalRemaining = finalCalculatedTotal - totalFinalPaid;

  // 📉 STOCK AUTOMATIC MINUS KARNE WALA HELPER FUNCTION
  const updateStockAfterSale = (soldItems) => {
    const defaultInventory = [
      { id: '1', name: 'CEMENT', unit: 'Bags', stockQty: 100 },
      { id: '2', name: 'LOHA 6MM', unit: 'KG', stockQty: 500 },
      { id: '3', name: 'BALU (SAND)', unit: 'CFT', stockQty: 2000 }
    ];

    let currentStock = JSON.parse(localStorage.getItem('material_inventory')) || defaultInventory;

    Object.keys(soldItems).forEach((itemKey) => {
      const soldQty = parseFloat(soldItems[itemKey].qty) || 0;
      
      // Clean name for matching
      let cleanName = itemKey.replace('other_', '').replace(/_/g, ' ').toLowerCase().trim();

      const itemIndex = currentStock.findIndex(
        inv => inv.name.toLowerCase().trim() === cleanName
      );

      if (itemIndex !== -1 && soldQty > 0) {
        currentStock[itemIndex].stockQty = Math.max(0, currentStock[itemIndex].stockQty - soldQty);
      }
    });

    localStorage.setItem('material_inventory', JSON.stringify(currentStock));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Bhaiya, pehle Grahak ka Naam zaroor likhein!");
      return;
    }

    const finalItems = {};
    Object.keys(items).forEach(key => {
      const q = parseFloat(items[key].qty) || 0;
      if (q > 0) {
        finalItems[key] = { qty: q, rate: parseFloat(items[key].rate) || 0, unit: items[key].unit, size: items[key].size };
      }
    });

    extraItems.forEach(item => {
      const q = parseFloat(item.qty) || 0;
      if (q > 0 && item.name.trim()) {
        const itemKey = `other_${item.name.trim().toLowerCase()}`;
        finalItems[itemKey] = { qty: q, rate: parseFloat(item.rate) || 0, unit: item.unit, size: item.size };
      }
    });

    if (Object.keys(finalItems).length === 0) {
      alert("Bhaiya, kam se kam ek saman ki detail toh daliye!");
      return;
    }

    const finalPaymentsList = [...pastPayments];
    if (currentNewPaid > 0) {
      finalPaymentsList.push({
        date: newPaidDate || billDate,
        amount: currentNewPaid,
        mode: newPaymentMode,
        remarks: newPaymentRemarks.trim() || 'N/A'
      });
    }

    // 💾 TEENO CHEEZEIN RECORD ME SAVE HO RAHI HAIN
    const billObject = {
  id: editData ? editData.id : Date.now(),
  date: billDate,
  customer: { name: customerName, phone: customerPhone, village: customerVillage, area: customerArea },
  items: finalItems,
  payments: finalPaymentsList, 
  discount: liveDiscount, 
  freight: liveFreight,            // 🚚 Saved
  prevBalance: livePrevBalance,    // 👤 Saved
  terms: billTerms,                // 📝 Saved
  total: finalCalculatedTotal, 
  paidAmount: totalFinalPaid,  
  remaining: totalRemaining
};
updateStockAfterSale(finalItems);

    onSaveBill(billObject);
    resetForm();
    alert(editData ? "🎉 Sabhi badlavo ke sath Bill successfully update ho gaya!" : "🎉 Naya Bill surakshit save ho gaya!");
  };
return (
    <form onSubmit={handleSubmit} style={{ padding: '15px', fontFamily: 'sans-serif' }}>
      
      {/* 👤 CLIENT DETAILS SECTION */}
      <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', color: '#007bff' }}>👤 Grahak ki Jankari</h3>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Grahak ka Naam *</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jaise: Abhi" style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Gaon / Kasba</label>
          <input type="text" value={customerVillage} onChange={(e) => setCustomerVillage(e.target.value)} placeholder="Jaise: Sukkam" style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mohalla / Area</label>
          <input type="text" value={customerArea} onChange={(e) => setCustomerArea(e.target.value)} placeholder="Jaise: Ward No. 4" style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile Number</label>
          <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="7999962606" style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Bill Banane Ki Tareekh</label>
          <input type="text" value={billDate} onChange={(e) => setBillDate(e.target.value)} style={styles.input} />
        </div>
      </div>

      {/* 🧱 MATERIALS SECTION */}
      <h3 style={{ borderBottom: '2px solid #28a745', paddingBottom: '5px', color: '#28a745', marginTop: '25px' }}>🧱 Maal / Saaman ka Hisab</h3>
      <div style={styles.tableResponsive}>
        <table style={styles.itemTable}>
          <thead>
            <tr style={{ backgroundColor: '#f4f6f9' }}>
              <th style={styles.th}>Saman ka Naam</th>
              <th style={styles.th}>Size</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Rate (₹)</th>
              <th style={styles.th}>Total Value</th>
            </tr>
          </thead>
          <tbody>
  {Object.keys(items).map((key) => {
    const item = items[key];
    const itemTotal = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    return (
     <tr key={key}>
  {/* 1. Saaman ka Naam */}
  <td style={styles.tdKey}>
    {key === 'taals' ? "TAALS (Tiles)" : key.replace('_', ' ').toUpperCase()}
  </td>
  
  {/* 2. Fix Size Text */}
  <td style={styles.td}>
    <span style={{ fontWeight: '500', color: '#4A5568' }}>{item.size}</span>
  </td>

  {/* 3. Quantity/Bajan Input (KG, Bags, Traali apne hisab se likhein) */}
  <td style={styles.td}>
    <input 
      type="number" 
      step="any" 
      placeholder="0" 
      value={item.qty} 
      onChange={(e) => handleItemChange(key, 'qty', e.target.value)} 
      style={styles.tableInput} 
    />
  </td>

  {/* 4. Unit badge */}
  <td style={styles.td}>
    {key === 'taals' ? (
      <select value={item.unit} onChange={(e) => handleItemChange(key, 'unit', e.target.value)} style={styles.select}>
        <option value="Pcs">Pcs</option>
        <option value="Box">Box</option>
        <option value="Feet">Feet</option>
      </select>
    ) : (
      <span style={styles.unitBadge}>{item.unit}</span>
    )}
  </td>

  {/* 5. 💰 Rate Input: Isme default 0 hatane ke liye ya empty string handle karne ke liye value tarika safe kiya */}
  <td style={styles.td}>
    <input 
      type="number" 
      step="any" 
      placeholder="₹ 0.00" 
      value={item.rate === 0 ? '' : item.rate} 
      onChange={(e) => handleItemChange(key, 'rate', e.target.value)} 
      style={styles.tableInput} 
    />
  </td>

  {/* 6. Kul Value Multiplication board */}
  <td style={styles.tdTotal}>₹ {itemTotal.toFixed(2)}</td>
</tr>
    );
  })}

            {/* EXTRA DYNAMIC ITEMS */}
            {extraItems.map((item) => {
              const extraTotal = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
              return (
                <tr key={item.id} style={{ backgroundColor: '#fffdf0' }}>
                  <td style={styles.td}>
                    <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleExtraItemChange(item.id, 'name', e.target.value)} style={{ ...styles.tableInput, textTransform: 'capitalize', fontWeight: 'bold' }} />
                  </td>
                  <td style={styles.td}>
  {/* purani line hata kar, uski jagah ye pura block paste kar dein */}
  {item.name.toLowerCase().includes('loha') ? (
    <select value={item.size} onChange={(e) => handleExtraItemChange(item.id, 'size', e.target.value)} style={styles.select}>
      <option value="6mm">6mm</option>
      <option value="8mm">8mm</option>
      <option value="10mm">10mm</option>
      <option value="12mm">12mm</option>
      <option value="16mm">16mm</option>
    </select>
  ) : item.name.toLowerCase().includes('ret') || item.name.toLowerCase().includes('gitti') ? (
    <select value={item.size} onChange={(e) => handleExtraItemChange(item.id, 'size', e.target.value)} style={styles.select}>
      <option value="Trali">Standard Trali</option>
      <option value="6 Chaka Dumper">6 Chaka Dumper</option>
      <option value="8 Chaka Dumper">8 Chaka Dumper</option>
      <option value="10 Chaka Dumper">10 Chaka Dumper</option>
      <option value="12 Chaka Dumper">12 Chaka Dumper</option>
    </select>
  ) : (
    <input type="text" placeholder="Size" value={item.size} onChange={(e) => handleExtraItemChange(item.id, 'size', e.target.value)} style={styles.tableInput} />
  )}
</td>
                  <td style={styles.td}><input type="number" step="any" placeholder="0" value={item.qty} onChange={(e) => handleExtraItemChange(item.id, 'qty', e.target.value)} style={styles.tableInput} /></td>
                  <td style={styles.td}>
                    <select value={item.unit} onChange={(e) => handleExtraItemChange(item.id, 'unit', e.target.value)} style={styles.select}>
                      <option value="Pcs">Pcs</option><option value="Box">Box</option><option value="Bags">Bags</option><option value="KG">KG</option><option value="Trali">Trali</option><option value="Feet">Feet</option>
                    </select>
                  </td>
                  <td style={styles.td}><input type="number" step="any" placeholder="₹ 0.00" value={item.rate} onChange={(e) => handleExtraItemChange(item.id, 'rate', e.target.value)} style={styles.tableInput} /></td>
                  <td style={styles.tdTotal}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>₹ {extraTotal.toFixed(2)}</span>
                      <button type="button" onClick={() => removeExtraItemRow(item.id)} style={styles.removeBtn}>❌</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={addExtraItemRow} style={styles.addBtn}>➕ Koi Alag Saaman Jodein (Add Extra Item)</button>

     {/* 💰 PART-BY-PART PAYMENT LOGIC */}
      <h3 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '5px', color: '#e67e22', marginTop: '30px' }}>🧾 Kist/Jama Rupiye ka Tareekh-war Vivran</h3>
      
      {pastPayments.length > 0 && (
        <div style={styles.pastPaymentsContainer}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>📊 Jama Rashi Ka Poora Vivran (History Table):</p>
          
          {/* 🟢 NEW ADDED: Proper Clean History Table */}
          <div style={{ overflowX: 'auto', marginBottom: '15px', borderRadius: '6px', border: '1px solid #f5d6b7' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: '#fdf6ef', borderBottom: '2px solid #f5d6b7' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', color: '#e67e22' }}>Tareekh (Date)</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', color: '#e67e22' }}>Kaise Mile (Mode)</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', color: '#e67e22' }}>Tippani (Remarks)</th>
                  <th style={{ padding: '10px', textAlign: 'right', fontSize: '13px', color: '#e67e22' }}>Rashi (Amount)</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontSize: '13px', color: '#e67e22' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pastPayments.map((payment, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #fdecd8' }}>
                    <td style={{ padding: '10px', fontSize: '13px', fontWeight: 'bold' }}>📅 {payment.date}</td>
                    <td style={{ padding: '10px', fontSize: '13px' }}>💳 {payment.mode || 'Cash'}</td>
                    <td style={{ padding: '10px', fontSize: '13px', color: '#666' }}>{payment.remarks || 'N/A'}</td>
                    <td style={{ padding: '10px', fontSize: '13px', fontWeight: 'bold', color: 'green', textAlign: 'right' }}>₹{parseFloat(payment.amount).toFixed(2)}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span onClick={() => removePastPayment(index)} style={{ cursor: 'pointer', fontSize: '14px' }} title="Kist Delete Karein">❌</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Purane Badges visual flexibility ke liye retained rakhe hain */}
          <p style={{ margin: '15px 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#777' }}>Short Badges View:</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {pastPayments.map((payment, index) => (
              <div key={index} style={styles.paymentBadge}>
                📅 <strong>{payment.date}</strong> | 💳 {payment.mode || 'Cash'} | <span style={{ color: 'green', fontWeight: 'bold' }}>₹{payment.amount}</span> {payment.remarks && payment.remarks !== 'N/A' && `(${payment.remarks})`}
                <span onClick={() => removePastPayment(index)} style={styles.deleteKistBtn}> ❌</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW DETAILED PAYMENT INPUTS */}
      <div style={{ ...styles.formGroup, flex: '1', minWidth: '180px' }}>
  <label style={{ ...styles.label, color: '#dc3545' }}>👤 Grahak Ka Purana Bāki (₹):</label>
  <input type="number" step="any" placeholder="₹ 0.00" value={previousBalance} onChange={(e) => setPreviousBalance(e.target.value)} style={{ ...styles.input, border: '2px solid #dc3545', fontWeight: 'bold' }} />
</div>

<div style={{ ...styles.formGroup, flex: '1', minWidth: '180px' }}>
  <label style={{ ...styles.label, color: '#9b59b6' }}>🚚 Gādi Kā Bhādā / Freight (₹):</label>
  <input type="number" step="any" placeholder="₹ 0.00" value={freightCharges} onChange={(e) => setFreightCharges(e.target.value)} style={{ ...styles.input, border: '2px solid #9b59b6', fontWeight: 'bold' }} />
</div>
      <div style={styles.newPaymentBox}>
        <div style={{ ...styles.formGroup, flex: '1', minWidth: '180px' }}>
          <label style={{ ...styles.label, color: '#007bff' }}>🎁 Grahak ko DISCOUNT (Chhut) dein (₹):</label>
          <input type="number" step="any" placeholder="₹ 0.00" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} style={styles.discountInput} />
        </div>

        <div style={{ ...styles.formGroup, flex: '2', minWidth: '200px' }}>
          <label style={{ ...styles.label, color: '#e67e22' }}>👉 Aaj naye paise JAMA mile (New Amount Received):</label>
          <input type="number" step="any" placeholder="₹ 0.00" value={newPaidAmount} onChange={(e) => setNewPaidAmount(e.target.value)} style={styles.paidInput} />
        </div>
        <div style={{ ...styles.formGroup, flex: '1', minWidth: '120px' }}>
          <label style={styles.label}>Paisa Kaise Mila?</label>
          <select value={newPaymentMode} onChange={(e) => setNewPaymentMode(e.target.value)} style={styles.select}>
            <option value="Cash">💵 Cash (Nagar)</option>
            <option value="UPI">📱 UPI (PhonePe/GPay)</option>
            <option value="Bank">🏦 Bank Transfer</option>
            <option value="Cheque">✍️ Cheque</option>
          </select>
        </div>
        <div style={{ ...styles.formGroup, flex: '1', minWidth: '120px' }}>
          <label style={styles.label}>Milne ki tareekh:</label>
          <input type="text" value={newPaidDate} onChange={(e) => setNewPaidDate(e.target.value)} style={styles.input} />
        </div>
        <div style={{ ...styles.formGroup, flex: '2', minWidth: '200px' }}>
          <label style={styles.label}>Koi Tippani / Note (Remarks)</label>
          <input type="text" placeholder="Jaise: Bhai ne laya / ₹100 discount" value={newPaymentRemarks} onChange={(e) => setNewPaymentRemarks(e.target.value)} style={styles.input} />
        </div>
      </div>

     {/* 📊 SUMMARY CALCULATOR MATH BOARD */}
      <div style={styles.summarySection}>
        
        {/* 1. Maal ka total */}
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>📦 Maal Ka Total Value:</span>
          <span style={{ ...styles.summaryValue, color: '#555' }}>₹ {itemsTotal.toFixed(2)}</span>
        </div>
        
        {/* 2. Minus Discount */}
        {liveDiscount > 0 && (
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>🎁 Minus Discount:</span>
            <span style={{ ...styles.summaryValue, color: '#007bff' }}>- ₹ {liveDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* 3. Purana Udhaar (Plus) */}
        {livePrevBalance > 0 && (
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>👤+ Purana Udhaar (Prev Balance):</span>
            <span style={{ ...styles.summaryValue, color: '#dc3545' }}>₹ {livePrevBalance.toFixed(2)}</span>
          </div>
        )}

        {/* 4. Gadi ka Bhada (Plus) */}
        {liveFreight > 0 && (
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>🚚+ Gadi Ka Bhada (Freight):</span>
            <span style={{ ...styles.summaryValue, color: '#9b59b6' }}>₹ {liveFreight.toFixed(2)}</span>
          </div>
        )}

        {/* 5. Final Bill Amount */}
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>💵 Final Bill Amount:</span>
          <span style={{ ...styles.summaryValue, color: '#007bff' }}>₹ {finalCalculatedTotal.toFixed(2)}</span>
        </div>

        {/* 6. Kul Jama */}
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>🟢 Kul Kul JAMA (Total Paid Till Date):</span>
          <span style={{ ...styles.summaryValue, color: '#28a745' }}>₹ {totalFinalPaid.toFixed(2)}</span>
        </div>

        {/* 7. Baki Udhar */}
        <div style={{ ...styles.summaryCard, backgroundColor: totalRemaining > 0 ? '#fff5f5' : '#f0fdf4' }}>
          <span style={styles.summaryLabel}>🔴 Baki Kul UDHAR (Remaining Dues):</span>
          <span style={{ ...styles.summaryValue, color: totalRemaining > 0 ? '#dc3545' : '#28a745' }}>₹ {totalRemaining.toFixed(2)}</span>
        </div>

      </div>

      {/* BUTTONS ROW (JAMA PARCHI ADDED HERE) */}
      {/* 📝 TERMS & CONDITIONS BOX */}
<div style={{ ...styles.formGroup, marginTop: '20px', width: '100%' }}>
  <label style={styles.label}>📝 Bill Ki Shārtieñ (Terms & Conditions) - Parchi par chhapega:</label>
  <textarea rows="3" value={billTerms} onChange={(e) => setBillTerms(e.target.value)} style={{ ...styles.input, fontFamily: 'sans-serif', resize: 'vertical' }} placeholder="Dukaan ki shartien likhein..." />
</div>
      <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {editData && <button type="button" onClick={onCancelEdit} style={styles.cancelBtn}>❌ Cancel Edit</button>}
        
        {/* 🖨️ NEW DIRECT JAMA PARCHI BUTTON */}
        {editData && (
          <button 
            type="button" 
            onClick={() => {
              if (!newPaidAmount || parseFloat(newPaidAmount) <= 0) {
                alert("Bhaiya, pehle upar 'Aaj naye paise JAMA mile' me koi raqam (amount) daliye, tabhi parchi niklegi!");
                return;
              }
              onPrint({
                ...editData,
                currentNewPayment: {
                  amount: newPaidAmount,
                  date: newPaidDate,
                  mode: newPaymentMode,
                  remarks: newPaymentRemarks
                }
              }, 'Thermal');
            }} 
            style={styles.directParchiBtn}
          >
            🧾 Sirf Aaj Ki Jama Parchi Print Karein
          </button>
        )}

        <button type="submit" style={editData ? styles.updateSubmitBtn : styles.submitBtn}>
          {editData ? "💾 Update & Save Bill" : "💾 Save & Generate Bill"}
        </button>
      </div>

    </form>
  );
}

const styles = {
  formRow: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' },
  formGroup: { flex: '1', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#4A5568' },
  input: { padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  tableResponsive: { overflowX: 'auto', marginTop: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' },
  itemTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', fontSize: '13px', color: '#4A5568', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' },
  td: { padding: '10px', borderBottom: '1px solid #E2E8F0', verticalAlign: 'middle' },
  tdKey: { padding: '10px', borderBottom: '1px solid #E2E8F0', fontWeight: 'bold', color: '#2D3748', fontSize: '13px' },
  tdTotal: { padding: '10px', borderBottom: '1px solid #E2E8F0', fontWeight: 'bold', color: '#1A202C', textAlign: 'right' },
  tableInput: { width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '9px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: 'white' },
  unitBadge: { backgroundColor: '#EDF2F7', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#4A5568' },
  addBtn: { background: '#f8fafc', border: '2px dashed #007bff', color: '#007bff', padding: '12px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '15px' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginLeft: '5px' },
  pastPaymentsContainer: { backgroundColor: '#fdf6ef', padding: '12px', borderRadius: '6px', border: '1px solid #f5d6b7', marginBottom: '15px' },
  paymentBadge: { backgroundColor: 'white', border: '1px solid #e67e22', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', display: 'inline-flex', alignItems: 'center' },
  deleteKistBtn: { color: 'red', cursor: 'pointer', fontWeight: 'bold', marginLeft: '8px', fontSize: '11px' },
  newPaymentBox: { display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: '#fff9f3', padding: '15px', borderRadius: '6px', border: '1px solid #fdecd8', marginBottom: '20px' },
  paidInput: { padding: '10px', fontSize: '15px', fontWeight: 'bold', border: '2px solid #e67e22', borderRadius: '6px', color: '#e67e22', width: '100%', boxSizing: 'border-box' },
  discountInput: { padding: '10px', fontSize: '15px', fontWeight: 'bold', border: '2px solid #007bff', borderRadius: '6px', color: '#007bff' },
  summarySection: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '25px', backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0' },
  summaryCard: { flex: '1', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '5px' },
  summaryLabel: { fontSize: '14px', fontWeight: 'bold', color: '#4A5568' },
  summaryValue: { fontSize: '24px', fontWeight: 'bold' },
  submitBtn: { background: '#28a745', color: 'white', border: 'none', padding: '12px 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' },
  updateSubmitBtn: { background: '#ffc107', color: 'black', border: 'none', padding: '12px 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '12px 20px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' },
  directParchiBtn: { background: '#17a2b8', color: 'white', border: 'none', padding: '12px 20px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }
};

export default BillForm;