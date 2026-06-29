import React from 'react';

function BillFilters({ 
  searchTerm, setSearchTerm, 
  filterType, setFilterType, 
  startDate, setStartDate, 
  endDate, setEndDate,
  totalCount, duesCount, paidCount
}) {

  // Calendar reset karne ke liye function
  const handleResetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div style={styles.container}>
      
      {/* 🔍 SECTION 1: SEARCH BAR */}
      <div style={styles.section}>
        <label style={styles.label}>🔍 Grahak ka Naam, Gaon ya Mobile No. likhein:</label>
        <input 
          type="text" 
          placeholder="Type karte hi live filter ho jayega... (Jaise: abhi sukkam)" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />
      </div>

      <div style={styles.rowGrid}>
        
        {/* 🎛️ SECTION 2: LIVE STATUS BUTTONS */}
        <div style={{ ...styles.section, flex: 1, minWidth: '280px' }}>
          <label style={styles.label}>🎛️ Paisa Status ke Hisab se Dekhein:</label>
          <div style={styles.btnGroup}>
            <button 
              type="button" 
              onClick={() => setFilterType('all')}
              style={{
                ...styles.filterBtn,
                border: filterType === 'all' ? '2px solid #333' : '2px solid transparent',
                backgroundColor: '#f1f5f9', color: '#333'
              }}
            >
              📋 Sabhi ({totalCount})
            </button>
            
            <button 
              type="button" 
              onClick={() => setFilterType('dues')}
              style={{
                ...styles.filterBtn,
                backgroundColor: filterType === 'dues' ? '#dc3545' : '#fff5f5',
                color: filterType === 'dues' ? '#ffffff' : '#dc3545',
              }}
            >
              🔴 Udhar ({duesCount})
            </button>
            
            <button 
              type="button" 
              onClick={() => setFilterType('paid')}
              style={{
                ...styles.filterBtn,
                backgroundColor: filterType === 'paid' ? '#28a745' : '#f0fdf4',
                color: filterType === 'paid' ? '#ffffff' : '#28a745',
              }}
            >
              🟢 Paid ({paidCount})
            </button>
          </div>
        </div>

        {/* 📅 SECTION 3: CALENDAR DATE RANGE FILTER */}
        <div style={{ ...styles.section, flex: 1, minWidth: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={styles.label}>📅 Tareekh Range Chunein (Mahnwada Hisab):</label>
            {(startDate || endDate) && (
              <button onClick={handleResetDates} style={styles.resetDateBtn}>Clear Date ❌</button>
            )}
          </div>
          <div style={styles.dateInputGroup}>
            <div style={{ flex: 1 }}>
              <span style={styles.dateSubLabel}>Kab Se:</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                style={styles.dateInput}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={styles.dateSubLabel}>Kab Tak:</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                style={styles.dateInput}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { background: '#ffffff', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e2e8f0' },
  section: { marginBottom: '15px' },
  rowGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '6px', fontFamily: 'sans-serif' },
  dateSubLabel: { display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginBottom: '2px' },
  searchBar: { width: '100%', padding: '11px 15px', border: '2px solid #007bff', borderRadius: '8px', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' },
  btnGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn: { padding: '9px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', border: 'none' },
  dateInputGroup: { display: 'flex', gap: '10px' },
  dateInput: { width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none' },
  resetDateBtn: { background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
};

export default BillFilters;