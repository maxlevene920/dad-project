# Invoice Brand Splitter (React)

This project is a React web app that processes invoice and memo CSV files, splits invoice costs by brand code, and allows you to download the results as a new CSV file. It is a port of a Python script to a modern, user-friendly web interface.

## Features
- Upload an **Invoice CSV** and a **Memo CSV** (each with its own uploader)
- Preview the first 5 rows of each file after upload
- Enter the total invoice cost
- Process the invoice to split costs by brand code
- Download the output as a CSV file

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)

### Installation
1. Clone this repository or copy the project files to your machine.
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App
Start the development server:
```sh
npm run dev
```
Then open the local address shown in your terminal (usually http://localhost:5173) in your browser.

## Usage
1. **Upload Invoice CSV**: Click the first file input and select your invoice CSV file. A preview of the first 5 rows will appear.
2. **Upload Memo CSV**: Click the second file input and select your memo CSV file. A preview of the first 5 rows will appear.
3. **Enter Total Invoice Cost**: Input the total cost for the invoice.
4. **Process**: Click the "Process" button to calculate the brand splits.
5. **Download Output**: If processing is successful, click "Download Output CSV" to save the results.

## File Format
- The **Invoice CSV** should have at least the columns: `PRODUCT DESCRIPTION` and `QUANTITY`.
- The **Memo CSV** is currently only previewed, not used in calculations (future logic can be added).

## Customization
- To change the brand code extraction or output logic, edit `src/utils.js` and `src/App.jsx`.

## License
MIT
