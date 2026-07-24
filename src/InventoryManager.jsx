import React, { useState, useEffect } from 'react';

function InventoryManager() {
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('Bags');
  const [newItemQty, setNewItemQty] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('material_inventory');
    if (saved) {
      setInventory(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', name: 'CEMENT', unit: 'Bags', stockQty: 100 },
        { id: '2', name: 'LOHA 6MM', unit: 'KG', stockQty: 500 },
        { id: '3', name: 'BALU (SAND)', unit: 'CFT', stockQty: 2000 }
      ];
      setInventory(initial);
      localStorage.setItem('material_inventory', JSON.stringify(initial));
    }
  }, []);

  // Naya Stock (+) Plus karne ka function
  const handleAddStock = (id, extraQty) => {
    const qtyToAdd = parseFloat(extraQty);
    if (!qtyToAdd || qtyToAdd <= 0) return;

    const updated = inventory.map(item => {
      if (item.id === id) {
        return { ...item, stockQty: item.stockQty + qtyToAdd };
      }
      return item;
    });

    setInventory(updated);
    localStorage.setItem('material_inventory', JSON.stringify(updated));
    alert("🎉 Stock Safely Update Ho Gaya!");
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '3px solid #27ae60' }}>🏬 Godown Stock Management Register</h2>
      <p style={{ color: '#666', fontSize: '13px' }}>
        * Bill banate hi yahan se stock apne aap kam ho jata hai. Maal gadi aane par aap niche se stock +Plus kar sakte hain.
      </p>

      {/* STOCK TABLE */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f4f4' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Saman Ka Naam</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Bacha Hua Stock (Available)</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Unit</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Naya Stock Aaya? (Add)</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>📦 {item.name}</td>
              <td style={{ padding: '12px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: item.stockQty < 20 ? 'red' : 'green' }}>
                {item.stockQty} {item.unit}
                {item.stockQty < 20 && <span style={{ fontSize: '11px', display: 'block', color: 'red' }}>⚠️ Stock Kam Hai!</span>}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{item.unit}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <input 
                  type="number" 
                  placeholder="+ Kitna Aaya?" 
                  id={`add_input_${item.id}`}
                  style={{ width: '100px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <button 
                  onClick={() => {
                    const val = document.getElementById(`add_input_${item.id}`).value;
                    handleAddStock(item.id, val);
                    document.getElementById(`add_input_${item.id}`).value = '';
                  }}
                  style={{ marginLeft: '8px', padding: '6px 12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  + Stock Jodein
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryManager;