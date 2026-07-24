import React, { useState, useEffect } from 'react';
import './App.css'; // Premium CSS file yahan apply ho rhi hai
import AdvanceDepositForm from './AdvanceDepositForm';
import DailyCashBook from './DailyCashBook';
import BillForm from './BillForm';
import BillHistory from './BillHistory';
import InvoiceModal from './InvoiceModal';
import BillFilters from './BillFilters';
import OrderForm from './OrderForm';
import { printThermalReceipt } from './printReceipt';
import InventoryManager from './InventoryManager'; // 👈 Agar Godown folder me ho toh './Godown/InventoryManager' kar lena

function App() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [printFormat, setPrintFormat] = useState('A4');

  // 🔄 NAVIGATION STATE
  const [currentView, setCurrentView] = useState('bill'); 
  const [orders, setOrders] = useState([]);

  // ✏️ EDITING STATE
  const [editingBill, setEditingBill] = useState(null);

  // ⚙️ FILTERS STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 💾 1. LOCALSTORAGE SE DATA LOAD
  useEffect(() => {
    const savedBills = localStorage.getItem('material_bills');
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
    
    const savedOrders = localStorage.getItem('material_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // 📉 1B. AUTOMATIC STOCK MINUS LOGIC
  const updateStockAfterSale = (itemsSold) => {
    if (!itemsSold) return;
    const defaultInventory = [
      { id: '1', name: 'CEMENT', unit: 'Bags', stockQty: 100 },
      { id: '2', name: 'LOHA 6MM', unit: 'KG', stockQty: 500 },
      { id: '3', name: 'BALU (SAND)', unit: 'CFT', stockQty: 2000 }
    ];

    let currentStock = JSON.parse(localStorage.getItem('material_inventory')) || defaultInventory;

    Object.keys(itemsSold).forEach((itemKey) => {
      const soldQty = parseFloat(itemsSold[itemKey].qty) || 0;
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

  // 💾 2. LOCALSTORAGE ME DATA SAVE & UPDATE LOGIC
  const handleSaveBill = (newBill) => {
    let updatedBills;
    const isExisting = bills.some(b => b.id === newBill.id);
    
    if (isExisting) {
      updatedBills = bills.map(b => b.id === newBill.id ? newBill : b);
      setEditingBill(null); 
    } else {
      updatedBills = [newBill, ...bills];
    }
    
    setBills(updatedBills);
    localStorage.setItem('material_bills', JSON.stringify(updatedBills));

    // 🎯 🔥 STOCK AUTOMATIC MINUS TRIGGER
    if (newBill && newBill.items) {
      updateStockAfterSale(newBill.items);
    }
  };

  // 💾 2B. ORDER SAVE LOGIC
  const handleSaveOrder = (newOrder) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('material_orders', JSON.stringify(updatedOrders));
  };

  // 🔥 2C. AUTOMATIC DELIVERY TO BILL SYSTEM
  const handleDeliverOrder = (orderId) => {
    let deliveredOrderData = null;
    
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        deliveredOrderData = { ...order, status: 'Delivered' };
        return deliveredOrderData;
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('material_orders', JSON.stringify(updatedOrders));

    if (deliveredOrderData) {
      let calculatedTotal = 0;
      Object.keys(deliveredOrderData.items).forEach(k => {
        const item = deliveredOrderData.items[k];
        calculatedTotal += (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
      });

      const automaticBillFromOrder = {
        id: 'BILL-FROM-' + orderId,
        date: new Date().toLocaleDateString('en-GB'), 
        customer: deliveredOrderData.customer, 
        items: deliveredOrderData.items,       
        payments: [{ 
          date: deliveredOrderData.date, 
          amount: deliveredOrderData.advancePaid, 
          mode: deliveredOrderData.paymentMode, 
          remarks: 'Advance Order Se Automatic Transfer' 
        }], 
        discount: 0, 
        freight: 0,            
        prevBalance: 0,    
        total: calculatedTotal, 
        paidAmount: deliveredOrderData.advancePaid,  
        remaining: calculatedTotal - deliveredOrderData.advancePaid
      };

      const updatedBills = [automaticBillFromOrder, ...bills];
      setBills(updatedBills);
      localStorage.setItem('material_bills', JSON.stringify(updatedBills));

      // 🎯 Delivery hote hi Stock minus karein
      updateStockAfterSale(deliveredOrderData.items);
      
      alert("🟢 Saaman Deliver ho gaya! Aur Tay Rate ke hisab se Bill automatic save ho chuka hai.");
    }
  };

  // ↩️ 2D. GREEN TO RED ROLLBACK LOGIC
  const handleUnDeliverOrder = (orderId) => {
    if (window.confirm("Kya aap sach me is Delivered saaman ko wapas Pending (Red) karna chahte hain? (Iska automatic bana bill khata se delete ho jayega)")) {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: 'Pending' };
        }
        return order;
      });
      setOrders(updatedOrders);
      localStorage.setItem('material_orders', JSON.stringify(updatedOrders));

      const updatedBills = bills.filter(b => b.id !== 'BILL-FROM-' + orderId);
      setBills(updatedBills);
      localStorage.setItem('material_bills', JSON.stringify(updatedBills));
      alert("↩️ Order wapas Pending ho gaya aur automatic bill surakshit hata diya gaya!");
    }
  };

  // 🗑️ 3. DELETE BILL LOGIC
  const handleDeleteBill = (id) => {
    if (window.confirm("Kya aap sach me yeh bill hamesha ke liye delete करना चाहते हैं?")) {
      const updated = bills.filter(b => b.id !== id);
      setBills(updated);
      localStorage.setItem('material_bills', JSON.stringify(updated));
      
      if (editingBill && editingBill.id === id) {
        setEditingBill(null);
      }
    }
  };

  // ✏️ 4. SET BILL FOR EDITING
  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setCurrentView('bill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ❌ 5. CANCEL EDIT LOGIC
  const handleCancelEdit = () => {
    setEditingBill(null);
  };

  // 🖨️ 6. PRINT HANDLING LOGIC
  const handlePrint = (billData, format) => {
    if (format === 'Thermal' && billData.currentNewPayment) {
      printThermalReceipt(billData); 
    } else {
      setSelectedBill(billData);
      setPrintFormat(format); 
    }
  };

  // 🔍 7. ADVANCED FILTER LOGIC
  const finalFilteredBills = bills.filter(bill => {
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const words = searchTerm.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      const name = (bill?.customer?.name || '').toLowerCase();
      const phone = (bill?.customer?.phone || '').toLowerCase();
      const village = (bill?.customer?.village || '').toLowerCase();
      const area = (bill?.customer?.area || '').toLowerCase();

      matchesSearch = words.every(word => 
        name.includes(word) || phone.includes(word) || village.includes(word) || area.includes(word)
      );
    }

    let matchesDate = true;
    if (bill.date) {
      const parts = bill.date.split('/');
      const billDateObj = new Date(parts[2], parts[1] - 1, parts[0]); 

      if (startDate) {
        const startObj = new Date(startDate);
        startObj.setHours(0,0,0,0);
        if (billDateObj < startObj) matchesDate = false;
      }
      if (endDate) {
        const endObj = new Date(endDate);
        endObj.setHours(23,59,59,999);
        if (billDateObj > endObj) matchesDate = false;
      }
    }

    let matchesStatus = true;
    if (filterType === 'dues') {
      matchesStatus = (bill.remaining || 0) > 0;
    } else if (filterType === 'paid') {
      matchesStatus = (bill.remaining || 0) <= 0;
    }

    return matchesSearch && matchesDate && matchesStatus;
  });

  const totalCount = bills.length;
  const duesCount = bills.filter(b => (b.remaining || 0) > 0).length;
  const paidCount = bills.filter(b => (b.remaining || 0) <= 0).length;

  return (
    <div className="main-app-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Premium Top Title */}
      <div className="software-header" style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ color: '#2c3e50', margin: '0' }}>Building Material Billing Software</h1>
        <div className="header-divider" style={{ height: '3px', width: '80px', backgroundColor: '#007bff', margin: '10px auto' }}></div>
      </div>

      {/* 🔝 6 PREMIUM TABS CONTROL (Stock / Godown Button Included) */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
        
        <button onClick={() => setCurrentView('bill')} style={{ padding: '12px 25px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', background: currentView === 'bill' ? '#007bff' : '#fff', color: currentView === 'bill' ? '#fff' : '#007bff', border: '2px solid #007bff' }}>
          📄 Normal Bill Banayein
        </button>

        <button onClick={() => setCurrentView('advanceDepositView')} style={{ padding: '12px 25px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', background: currentView === 'advanceDepositView' ? '#9b59b6' : '#fff', color: currentView === 'advanceDepositView' ? '#fff' : '#9b59b6', border: '2px solid #9b59b6' }}>
          💰 Sirf Advance Paisa Jama
        </button>

        <button onClick={() => setCurrentView('dailyCashbookView')} style={{ padding: '12px 25px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', background: currentView === 'dailyCashbookView' ? '#3498db' : '#fff', color: currentView === 'dailyCashbookView' ? '#fff' : '#3498db', border: '2px solid #3498db' }}>
          💸 Daily Kharch & Cash Hisab
        </button>

        <button onClick={() => setCurrentView('order')} style={{ padding: '12px 25px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', background: currentView === 'order' ? '#27ae60' : '#fff', color: currentView === 'order' ? '#fff' : '#27ae60', border: '2px solid #27ae60' }}>
          📝 Advance Order Note
        </button>

        <button onClick={() => setCurrentView('ordersList')} style={{ padding: '12px 25px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', background: currentView === 'ordersList' ? '#e67e22' : '#fff', color: currentView === 'ordersList' ? '#fff' : '#e67e22', border: '2px solid #e67e22' }}>
          📋 Saari Order List (Track Delivery)
        </button>

        {/* 🏬 🔥 YAHAN ADD HUA STOCK / GODOWN KA CLICK BUTTON 👇 */}
        <button onClick={() => setCurrentView('inventory')} style={{ padding: '12px 25px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', background: currentView === 'inventory' ? '#16a085' : '#fff', color: currentView === 'inventory' ? '#fff' : '#16a085', border: '2px solid #16a085' }}>
          🏬 Stock / Godown
        </button>

      </div>

      {/* 🔄 CONDITIONAL ROUTING CONDITIONS BASED ON NAVIGATION TABS */}
      {currentView === 'bill' && (
        <>
          {/* 📝 Card 1: Bill Form */}
          <div className="billing-card" style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
            <div className="card-title-container blue-badge" style={{ marginBottom: '15px' }}>
              <h2 style={{ margin: '0' }}>{editingBill ? "✏️ Bill Me Galti Sudharein (Edit Mode)" : "📝 New Bill Banayein"}</h2>
            </div>
            <BillForm 
              onSaveBill={handleSaveBill} 
              editData={editingBill} 
              onCancelEdit={handleCancelEdit} 
              onPrint={handlePrint} 
            />
          </div>

          {/* 📊 Card 2: History aur Ledger Table */}
          <div className="billing-card" style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div className="card-title-container green-badge" style={{ marginBottom: '15px' }}>
              <h2 style={{ margin: '0' }}>📊 Grahak Records & Khata (Ledger)</h2>
            </div>

            <BillFilters 
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              filterType={filterType} setFilterType={setFilterType}
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              totalCount={totalCount} duesCount={duesCount} paidCount={paidCount}
            />

            <BillHistory 
              bills={finalFilteredBills} 
              currentSearchTerm={searchTerm} 
              onDelete={handleDeleteBill}
              onEdit={handleEditBill} 
              onPrint={handlePrint} 
            />
          </div>
        </>
      )}

      {currentView === 'order' && (
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <OrderForm onSaveOrder={handleSaveOrder} onClose={() => setCurrentView('ordersList')} />
        </div>
      )}

      {currentView === 'advanceDepositView' && (
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <AdvanceDepositForm onClose={() => setCurrentView('bill')} />
        </div>
      )}

      {currentView === 'dailyCashbookView' && (
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <DailyCashBook onClose={() => setCurrentView('bill')} />
        </div>
      )}

      {/* 📋 SAARI ORDER LIST (TRACK DELIVERY) WITH NEW SEARCH BAR */}
      {currentView === 'ordersList' && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px', color: '#e67e22', marginTop: '0' }}>🚚 Order Delivery Tracking Board</h3>
          
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="🔍 Advance Order Grahak ka Naam, Mobile Number, ya Gaon se dhoondhein..." 
              value={searchTerm || ''} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '14px',
                border: '2px solid #e67e22', 
                borderRadius: '6px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')} 
                style={{ padding: '0 15px', background: '#777', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Clear
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <p style={{ color: '#777', fontStyle: 'italic' }}>Abhi tak koi order book nahi hua hai.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f4f6f9', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px' }}>Grahak Details</th>
                    <th style={{ padding: '12px' }}>Delivery Date</th>
                    <th style={{ padding: '12px' }}>Saaman & Tay Rate Details</th>
                    <th style={{ padding: '12px' }}>Advance Money</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Action Button</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter(order => {
                      if (!searchTerm || !searchTerm.trim()) return true;
                      const word = searchTerm.toLowerCase().trim();
                      const name = (order?.customer?.name || '').toLowerCase();
                      const phone = (order?.customer?.phone || '').toLowerCase();
                      const village = (order?.customer?.village || '').toLowerCase();
                      return name.includes(word) || phone.includes(word) || village.includes(word);
                    })
                    .map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>
                          <strong>👤 {order.customer.name}</strong><br />
                          <span style={{ fontSize: '12px', color: '#555' }}>📞 {order.customer.phone || 'N/A'}</span><br />
                          <span style={{ fontSize: '12px', color: '#777' }}>📍 {order.customer.village || 'N/A'}</span>
                        </td>
                        <td style={{ padding: '12px', color: '#e74c3c', fontWeight: 'bold' }}>
                          📅 {order.deliveryDate.split('-').reverse().join('/')}
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>
                          {Object.keys(order.items).map(itemKey => (
                            <div key={itemKey}>• {itemKey.replace('_', ' ').toUpperCase()}: {order.items[itemKey].qty} {order.items[itemKey].unit} @ ₹{order.items[itemKey].rate}</div>
                          ))}
                        </td>
                        <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>
                          ₹{order.advancePaid.toFixed(2)} ({order.paymentMode})
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {order.status === 'Pending' ? (
                            <button 
                              onClick={() => handleDeliverOrder(order.id)}
                              style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(231,76,60,0.2)' }}
                            >
                              🔴 Pending (Deliver Karein)
                            </button>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                              <button 
                                disabled 
                                style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', cursor: 'not-allowed', opacity: '0.9' }}
                              >
                                🟢 Delivered & Billed
                              </button>
                              <span 
                                onClick={() => handleUnDeliverOrder(order.id)} 
                                style={{ color: '#007bff', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline', fontWeight: 'bold' }}
                              >
                                ↩️ Galti Se Hua? Un-deliver Karein
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                  {orders.filter(order => {
                    if (!searchTerm || !searchTerm.trim()) return true;
                    const word = searchTerm.toLowerCase().trim();
                    return (order?.customer?.name || '').toLowerCase().includes(word) || (order?.customer?.phone || '').toLowerCase().includes(word) || (order?.customer?.village || '').toLowerCase().includes(word);
                  }).length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '20px', fontStyle: 'italic', textAlign: 'center', color: '#999' }}>
                        Bhaiya, is naam, mobile number ya gaon se koi advance order nahi mila!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 🏬 🔥 NAYA STOCK / GODOWN VIEW BLOCK 👇 */}
      {currentView === 'inventory' && (
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <InventoryManager />
        </div>
      )}

      {/* Bill Invoice Parchi Pop-up */}
      <InvoiceModal bill={selectedBill} format={printFormat} onClose={() => setSelectedBill(null)} />
      
    </div>
  );
}

export default App;