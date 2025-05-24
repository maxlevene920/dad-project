import React, { useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { extractBrandCode } from './utils';

const GL_ACCOUNT = 'E087000C';
const DC_INDIC = 'Debit';
const COST_CTR_PREFIX = '71PL03';
const COST_CTR_SUFFIX = '30';

function App() {
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [memoRows, setMemoRows] = useState([]);
  const [totalCost, setTotalCost] = useState('');
  const [outputRows, setOutputRows] = useState([]);
  const [invoiceHeaders, setInvoiceHeaders] = useState([]);
  const [memoHeaders, setMemoHeaders] = useState([]);

  const handleInvoiceUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setInvoiceRows(results.data);
        setInvoiceHeaders(results.meta.fields || []);
      },
    });
  };

  const handleMemoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setMemoRows(results.data);
        setMemoHeaders(results.meta.fields || []);
      },
    });
  };

  const process = () => {
    const brandQuantities = {};
    let totalQuantity = 0;

    invoiceRows.forEach(row => {
      const description = row['PRODUCT DESCRIPTION']?.trim() || '';
      const quantity = parseInt(row['QUANTITY'] || '0', 10);
      const brandCode = extractBrandCode(description);
      if (!brandQuantities[brandCode]) brandQuantities[brandCode] = 0;
      brandQuantities[brandCode] += quantity;
      totalQuantity += quantity;
    });

    const cost = parseFloat(totalCost);
    if (!cost || totalQuantity === 0) return;

    const rows = Object.entries(brandQuantities).map(([brandCode, qty]) => {
      const percent = qty / totalQuantity;
      const netAmount = +(percent * cost).toFixed(2);
      const costCtr = `${COST_CTR_PREFIX}${brandCode}${COST_CTR_SUFFIX}`;
      return {
        'G/L Account': GL_ACCOUNT,
        'Net Amount': netAmount,
        'D/C Indic': DC_INDIC,
        'Cost Ctr': costCtr,
      };
    });
    setOutputRows(rows);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(outputRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'output.csv');
  };

  const renderPreviewTable = (headers, rows, label) => (
    <div style={{ margin: '16px 0' }}>
      <b>{label} Preview:</b>
      {rows.length === 0 ? (
        <div style={{ fontStyle: 'italic', color: '#888' }}>No data loaded.</div>
      ) : (
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table border={1} cellPadding={4} style={{ marginTop: 8, minWidth: 400 }}>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {headers.map((h) => (
                    <td key={h}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 5 && <div style={{ fontSize: 12, color: '#888' }}>Showing first 5 rows of {rows.length}</div>}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 16, fontSize: 18, color: '#1976d2', fontWeight: 'bold' }}>
        dear dad i hope this helps you work faster love max
      </div>
      <h2>Invoice Brand Splitter</h2>
      <div>
        <label><b>Upload Invoice CSV:</b></label>
        <input type="file" accept=".csv" onChange={handleInvoiceUpload} />
        {renderPreviewTable(invoiceHeaders, invoiceRows, 'Invoice')}
      </div>
      <div style={{ marginTop: 24 }}>
        <label><b>Upload Memo CSV:</b></label>
        <input type="file" accept=".csv" onChange={handleMemoUpload} />
        {renderPreviewTable(memoHeaders, memoRows, 'Memo')}
      </div>
      <br />
      <input
        type="number"
        placeholder="Enter total invoice cost"
        value={totalCost}
        onChange={e => setTotalCost(e.target.value)}
      />
      <br /><br />
      <button onClick={process} disabled={!invoiceRows.length || !totalCost}>Process</button>
      <br /><br />
      {outputRows.length > 0 && (
        <>
          <button onClick={downloadCSV}>Download Output CSV</button>
          <table border={1} cellPadding={4} style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>G/L Account</th>
                <th>Net Amount</th>
                <th>D/C Indic</th>
                <th>Cost Ctr</th>
              </tr>
            </thead>
            <tbody>
              {outputRows.map((row, i) => (
                <tr key={i}>
                  <td>{row['G/L Account']}</td>
                  <td>{row['Net Amount']}</td>
                  <td>{row['D/C Indic']}</td>
                  <td>{row['Cost Ctr']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
