// pdfService.js
const express = require('express');
const bodyParser = require('body-parser');
const htmlPdf = require('html-pdf-node');

const app = express();

// Allow large HTML payloads if needed
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: 'Missing html parameter in request body.' });
    }

    // PDF generation options (similar to your Puppeteer options)
    const options = {
      format: 'A4',
      printBackground: true,
    };

    // Wrap your HTML in an object as required by html-pdf-node
    const file = { content: html };

    // Generate the PDF buffer
    const pdfBuffer = await htmlPdf.generatePdf(file, options);

    // Send the generated PDF back with proper headers
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=generated.pdf',
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Error generating PDF' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PDF Generation Service is running on port ${PORT}`);
});
