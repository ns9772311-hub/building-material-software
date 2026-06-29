// printReceipt.js
export const printThermalReceipt = (billData) => {
  if (!billData.currentNewPayment) return;

  const p = billData.currentNewPayment;
  const receiptWindow = window.open('', '_blank');
  
  // Math Calculations (With Discount Fix)
  const displayTotal = parseFloat(billData.total) || 0;
  const displayDiscount = parseFloat(billData.discount) || 0;
  const currentAmountPaid = parseFloat(p.amount) || 0;
  const displayPaid = (parseFloat(billData.paidAmount) || 0) + currentAmountPaid;
  const displayRemaining = displayTotal - displayPaid;

  // Saari purani kist aur aaj ki kist ko merge karke history list banana
  const allPaymentsHistory = [...(billData.pastPayments || [])];

  receiptWindow.document.write(`
    <html>
      <head>
        <title>Jama Parchi - Shree Shyam Hardware</title>
        <style>
          body { font-family: 'Arial', sans-serif; width: 72mm; margin: 0; padding: 8px; font-size: 11px; color: #000; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 6px; margin-bottom: 6px; }
          .title { font-size: 14px; font-weight: bold; margin: 2px 0; letter-spacing: 1px; }
          .subtitle { font-size: 10px; color: #444; }
          .info-sec { margin: 8px 0; font-size: 11px; line-height: 1.4; }
          .dashed-line { border-top: 1px dashed #000; margin: 6px 0; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
          .payment-row { display: flex; justify-content: space-between; margin: 6px 0; padding: 4px 0; background: #f0f0f0; font-weight: bold; font-size: 12px; border-top: 1px solid #000; border-bottom: 1px solid #000; }
          .summary-sec { font-size: 11px; }
          .footer { text-align: center; margin-top: 15px; font-size: 10px; }
          
          /* 📊 Tareekh-war table ki design parchi ke liye */
          .history-table { width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 10px; }
          .history-table th { border-bottom: 1px solid #000; text-align: left; padding: 3px 0; font-weight: bold; }
          .history-table td { padding: 4px 0; border-bottom: 1px dashed #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">SHREE SHYAM HARDWARE</div>
          <div class="subtitle">Building Material Supplier</div>
          <div class="subtitle">Main Road, Sukkam | Mob: 7999962606</div>
        </div>
        
        <div class="info-sec">
          <b>Grahak:</b> ${billData.customer?.name || 'N/A'}<br/>
          <b>Gaon:</b> ${billData.customer?.village || '-'}<br/>
          <b>Mobile:</b> ${billData.customer?.phone || '-'}<br/>
          <b>Parchi Tareekh:</b> ${p.date}
        </div>
        
        <div class="dashed-line"></div>
        
        <div class="payment-row">
          <span>👉 AAJ JAMA MILE:</span>
          <span>₹${currentAmountPaid.toFixed(2)}</span>
        </div>
        
        <div class="info-sec" style="padding-left: 5px;">
          • <b>Payment Mode:</b> ${p.mode || 'Cash'}<br/>
          • <b>Note/Tippani:</b> ${p.remarks || 'N/A'}
        </div>
        
        <div class="dashed-line"></div>
        <div style="font-weight: bold; margin-bottom: 3px; font-size: 11px;">📋 Kist/Jama Rupiye Ka Tareekh-war Vivran:</div>
        <table class="history-table">
          <thead>
            <tr>
              <th>Tareekh</th>
              <th>Mode</th>
              <th style="text-align: right;">Rupiye</th>
            </tr>
          </thead>
          <tbody>
            ${allPaymentsHistory.length > 0 ? 
              allPaymentsHistory.map(pay => `
                <tr>
                  <td>📅 ${pay.date}</td>
                  <td>💳 ${pay.mode || 'Cash'}</td>
                  <td style="text-align: right; font-weight: bold; color: green;">₹${parseFloat(pay.amount).toFixed(2)}</td>
                </tr>
              `).join('') 
              : '<tr><td colspan="3" style="text-align: center; color: #666;">Pehle koi rashi jama nahi ki gayi.</td></tr>'
            }
          </tbody>
        </table>

        <div class="dashed-line"></div>
        
        <div class="summary-sec">
          <div class="row">
            <span>Total Bill Amount:</span>
            <span>₹${(displayTotal + displayDiscount).toFixed(2)}</span>
          </div>
          ${displayDiscount > 0 ? `
          <div class="row" style="color: green;">
            <span>Mila Discount (-):</span>
            <span>₹${displayDiscount.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="row">
            <span>Nett Bill Amount:</span>
            <span>₹${displayTotal.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Kul Jama (Total Paid):</span>
            <span>₹${displayPaid.toFixed(2)}</span>
          </div>
          <div class="row" style="font-weight: bold;">
            <span>Baki Kul Udhar (Dues):</span>
            <span>₹${displayRemaining.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="dashed-line"></div>
        
        <div class="footer">
          <b>Hisaab dene ke liye Dhanyawad!</b><br/>
          <span>Software Banwane ke liye Sampark karein</span>
        </div>
        
        <script>
          window.onload = function() { 
            window.print(); 
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  receiptWindow.document.close();
};