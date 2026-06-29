import React, { useState } from 'react';

const INITIAL_ORDER_ITEMS = {
  cement: { qty: '', rate: '', size: '-', unit: 'Bags' },
  loha_6mm: { qty: '', rate: '', size: '6mm', unit: 'KG' },
  loha_8mm: { qty: '', rate: '', size: '8mm', unit: 'KG' },
  loha_10mm: { qty: '', rate: '', size: '10mm', unit: 'KG' },
  loha_12mm: { qty: '', rate: '', size: '12mm', unit: 'KG' },
  loha_16mm: { qty: '', rate: '', size: '16mm', unit: 'KG' },
  ret_trali: { qty: '', rate: '', size: 'Standard Trali', unit: 'Trali' },
  ret_6chaka: { qty: '', rate: '', size: '6 Chaka Dumper', unit: 'Trali' },
  ret_8chaka: { qty: '', rate: '', size: '8 Chaka Dumper', unit: 'Trali' },
  ret_10chaka: { qty: '', rate: '', size: '10 Chaka Dumper', unit: 'Trali' },
  ret_12chaka: { qty: '', rate: '', size: '12 Chaka Dumper', unit: 'Trali' },
  gitti_trali: { qty: '', rate: '', size: 'Standard Trali', unit: 'Trali' },
  gitti_6chaka: { qty: '', rate: '', size: '6 Chaka Dumper', unit: 'Trali' },
  gitti_8chaka: { qty: '', rate: '', size: '8 Chaka Dumper', unit: 'Trali' },
  gitti_10chaka: { qty: '', rate: '', size: '10 Chaka Dumper', unit: 'Trali' },
  gitti_12chaka: { qty: '', rate: '', unit: '12 Chaka Dumper', unit: 'Trali' },
  taals: { qty: '', rate: '', size: '-', unit: 'Pcs' },
};

function OrderForm({ onSaveOrder, onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [deliveryDate, setDeliveryDate] = useState('');
  
  const [items, setItems] = useState(INITIAL_ORDER_ITEMS);
  const [extraItems, setExtraItems] = useState([]); // 👈 Orders me bhi extra saaman ke liye state

  const [advancePaid, setAdvancePaid] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [orderRemarks, setOrderRemarks] = useState('');

  const handleItemChange = (key, field, value) => {
    setItems(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) { alert("Bhaiya, Grahak ka Naam zaroor likhein!"); return; }
    if (!deliveryDate) { alert("Bhaiya, Delivery ki Tareekh zaroor chunein!"); return; }

    const bookedItems = {};
    Object.keys(items).forEach(key => {
      const q = parseFloat(items[key].qty) || 0;
      if (q > 0) { 
        bookedItems[key] = { 
          qty: q, 
          rate: parseFloat(items[key].rate) || 0, 
          size: items[key].size, 
          unit: items[key].unit 
        }; 
      }
    });

    extraItems.forEach(item => {
      const q = parseFloat(item.qty) || 0;
      if (q > 0 && item.name.trim()) {
        const itemKey = `other_${item.name.trim().toLowerCase()}`;
        bookedItems[itemKey] = { 
          qty: q, 
          rate: parseFloat(item.rate) || 0, 
          size: item.size, 
          unit: item.unit 
        };
      }
    });

    if (Object.keys(bookedItems).length === 0) { alert("Bhaiya, kam se kam ek saaman ki quantity daliye!"); return; }

    const orderObject = {
      id: 'ORD-' + Date.now(),
      date: bookingDate,
      deliveryDate,
      status: 'Pending',
      customer: { name: customerName, phone: customerPhone, village: customerAddress, area: '' },
      items: bookedItems,
      advancePaid: parseFloat(advancePaid) || 0,
      paymentMode,
      remarks: orderRemarks
    };

    if (onSaveOrder) onSaveOrder(orderObject);
    alert("🎉 Order successfully Book ho gaya!");
    resetForm();
    if (onClose) onClose();
  };

  const resetForm = () => {
    setCustomerName(''); setCustomerPhone(''); setCustomerAddress(''); setDeliveryDate(''); setAdvancePaid(''); setOrderRemarks(''); setItems(INITIAL_ORDER_ITEMS); setExtraItems([]);
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #2c3e50', paddingBottom: '10px' }}>
        <h2 style={{ color: '#2c3e50', margin: '0' }}>📝 Naya Order Note & Advance Book Karein</h2>
        <button type="button" onClick={onClose} style={styles.backBtn}>← Wapas Bill Page Par Chalein</button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <h3 style={styles.sectionTitle}>👤 Grahak Aur Delivery Ki Jankari</h3>
        <div style={styles.formRow}>
          <div style={styles.formGroup}><label style={styles.label}>Grahak ka Naam *</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jaise: Raju Bhai" style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Mobile Number</label><input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="9988xxxxxx" style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Pata (Delivery Address)</label><input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Maal kahan bhejna hai..." style={styles.input} /></div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}><label style={styles.label}>Order Date</label><input type="text" value={bookingDate} readOnly style={styles.input} /></div>
          <div style={{ ...styles.formGroup, border: '2px solid #e74c3c', borderRadius: '6px', padding: '5px' }}>
            <label style={{ ...styles.label, color: '#e74c3c' }}>📅 Delivery Kab Karni Hai? *</label>
            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} style={{ ...styles.input, border: 'none' }} />
          </div>
        </div>

        <h3 style={{ ...styles.sectionTitle, color: '#27ae60', borderBottomColor: '#27ae60' }}>🧱 Order Me Kya-Kya Likhwaya? (Rate Ke Sath)</h3>
        <div style={styles.tableResponsive}>
          <table style={styles.itemTable}>
            <thead>
              <tr style={{ backgroundColor: '#f4f6f9' }}>
                <th style={styles.th}>Saaman Ka Naam</th>
                <th style={styles.th}>Size</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Tay Rate (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(items).map((key) => {
                const item = items[key];
                return (
                  <tr key={key}>
                    <td style={styles.tdKey}>{key.replace('_', ' ').toUpperCase()}</td>
                    <td style={styles.td}><strong>{item.size}</strong></td>
                    <td style={styles.td}><input type="number" placeholder="0" value={item.qty} onChange={(e) => handleItemChange(key, 'qty', e.target.value)} style={styles.tableInput} /></td>
                    <td style={styles.td}><span style={styles.unitBadge}>{item.unit}</span></td>
                    <td style={styles.td}><input type="number" placeholder="₹ Rate" value={item.rate} onChange={(e) => handleItemChange(key, 'rate', e.target.value)} style={styles.tableInput} /></td>
                  </tr>
                );
              })}

              {/* EXTRA ITEMS IN ORDERS */}
              {extraItems.map((item) => (
                <tr key={item.id} style={{ backgroundColor: '#fffdf0' }}>
                  <td style={styles.td}><input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleExtraItemChange(item.id, 'name', e.target.value)} style={{ ...styles.tableInput, fontWeight: 'bold' }} /></td>
                  <td style={styles.td}>
                    {item.name.toLowerCase().includes('loha') ? (
                      <select value={item.size} onChange={(e) => handleExtraItemChange(item.id, 'size', e.target.value)} style={styles.select}>
                        <option value="6mm">6mm</option><option value="8mm">8mm</option><option value="10mm">10mm</option><option value="12mm">12mm</option><option value="16mm">16mm</option>
                      </select>
                    ) : item.name.toLowerCase().includes('ret') || item.name.toLowerCase().includes('gitti') ? (
                      <select value={item.size} onChange={(e) => handleExtraItemChange(item.id, 'size', e.target.value)} style={styles.select}>
                        <option value="Trali">Standard Trali</option><option value="6 Chaka Dumper">6 Chaka Dumper</option><option value="8 Chaka Dumper">8 Chaka Dumper</option><option value="10 Chaka Dumper">10 Chaka Dumper</option><option value="12 Chaka Dumper">12 Chaka Dumper</option>
                      </select>
                    ) : <input type="text" placeholder="Size" value={item.size} onChange={(e) => handleExtraItemChange(item.id, 'size', e.target.value)} style={styles.tableInput} />}
                  </td>
                  <td style={styles.td}><input type="number" placeholder="0" value={item.qty} onChange={(e) => handleExtraItemChange(item.id, 'qty', e.target.value)} style={styles.tableInput} /></td>
                  <td style={styles.td}>
                    <select value={item.unit} onChange={(e) => handleExtraItemChange(item.id, 'unit', e.target.value)} style={styles.select}>
                      <option value="Pcs">Pcs</option><option value="Box">Box</option><option value="Bags">Bags</option><option value="KG">KG</option><option value="Trali">Trali</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="number" placeholder="₹ Rate" value={item.rate} onChange={(e) => handleExtraItemChange(item.id, 'rate', e.target.value)} style={styles.tableInput} />
                      <button type="button" onClick={() => removeExtraItemRow(item.id)} style={styles.removeBtn}>❌</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addExtraItemRow} style={styles.addBtn}>➕ Order Me Koi Alag Saaman Jodein (Add Extra Item)</button>

        <h3 style={{ ...styles.sectionTitle, color: '#e67e22', borderBottomColor: '#e67e22' }}>💰 Advance Paisa Aur Note</h3>
        <div style={styles.formRow}>
          <div style={{ ...styles.formGroup, flex: '2' }}>
            <label style={{ ...styles.label, color: '#e67e22' }}>💵 Kitna ADVANCE Paisa Mila? (₹):</label>
            <input type="number" placeholder="₹ 0.00" value={advancePaid} onChange={(e) => setAdvancePaid(e.target.value)} style={{ ...styles.input, fontSize: '18px', fontWeight: 'bold', border: '2px solid #e67e22' }} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Mode</label>
            <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} style={styles.select}>
              <option value="Cash">💵 Cash</option><option value="UPI">📱 UPI</option><option value="Bank">🏦 Bank</option>
            </select>
          </div>
          <div style={{ ...styles.formGroup, flex: '2' }}>
            <label style={styles.label}>Tippani (Remarks)</label>
            <input type="text" placeholder="Koi khas note..." value={orderRemarks} onChange={(e) => setOrderRemarks(e.target.value)} style={styles.input} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button type="submit" style={styles.submitBtn}>💾 Save Order Note</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '8px' },
  sectionTitle: { borderBottom: '2px solid #2980b9', paddingBottom: '5px', color: '#2980b9', marginTop: '25px' },
  formRow: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' },
  formGroup: { flex: '1', display: 'flex', flexDirection: 'column', minWidth: '200px' },
  label: { fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#4A5568' },
  input: { padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  select: { padding: '10px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: 'white' },
  tableResponsive: { overflowX: 'auto', marginTop: '15px', borderRadius: '8px', border: '1px solid #E2E8F0', maxHeight: '350px' },
  itemTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', fontSize: '13px', color: '#4A5568', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0', position: 'sticky', top: '0', backgroundColor: '#f4f6f9' },
  td: { padding: '8px', borderBottom: '1px solid #E2E8F0' },
  tdKey: { padding: '8px', borderBottom: '1px solid #E2E8F0', fontWeight: 'bold', color: '#2D3748', fontSize: '13px' },
  tableInput: { width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' },
  unitBadge: { backgroundColor: '#EDF2F7', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#4A5568' },
  addBtn: { background: '#f8fafc', border: '2px dashed #27ae60', color: '#27ae60', padding: '10px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginLeft: '5px' },
  submitBtn: { background: '#27ae60', color: 'white', border: 'none', padding: '15px 35px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' },
  backBtn: { background: '#34495e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default OrderForm;