import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generatePDF = async (
  title: string,
  content: string,
  outputName: string
) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const outputDir = path.join(__dirname, '../../generated');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

      const filePath = path.join(outputDir, `${outputName}.pdf`);

      const doc = new PDFDocument();

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Document Title
      doc.fontSize(20).text(title, { align: 'center' });
      doc.moveDown();

      // Content
      doc.fontSize(12).text(content, { align: 'left' });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};
