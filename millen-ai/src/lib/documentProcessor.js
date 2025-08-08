// /millen-ai/src/lib/documentProcessor.js

import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Set up the worker path for PDF.js to load it from a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map(item => item.str).join(' ') + '\n\n';
  }
  return fullText.trim();
}

async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromExcel(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  let allText = '';
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const csvData = XLSX.utils.sheet_to_csv(sheet);
    allText += `--- SHEET: ${sheetName} ---\n${csvData}\n\n`;
  });
  return allText.trim();
}

async function extractTextFromCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const csvText = results.data
          .map(row => Object.entries(row)
            .filter(([key, value]) => key && value)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', '))
          .join('\n');
        resolve(csvText);
      },
      error: (err) => reject(err),
    });
  });
}

class DocumentProcessor {
  constructor() {
    this.tesseractWorker = null;
  }

  async initTesseract() {
    if (!this.tesseractWorker) {
      // Initialize with a logger to see progress in the console
      this.tesseractWorker = await createWorker('eng', 1, {
        logger: m => console.log(m)
      });
    }
  }

  async processFile(file) {
    const fileType = this.getFileType(file);
    try {
      let content = '';
      switch (fileType) {
        case 'image':
          await this.initTesseract();
          const { data } = await this.tesseractWorker.recognize(file);
          content = data.text;
          break;
        case 'pdf':
          content = await extractTextFromPDF(file);
          break;
        case 'docx':
          content = await extractTextFromDocx(file);
          break;
        case 'excel':
          content = await extractTextFromExcel(file);
          break;
        case 'csv':
          content = await extractTextFromCSV(file);
          break;
        case 'text':
          content = await file.text();
          break;
        case 'unsupported':
          content = `The file format for "${file.name}" is not supported for text extraction.`;
          break;
        default:
          throw new Error(`Unsupported file type: ${file.type}`);
      }
      return { name: file.name, type: fileType, content: content.trim() };

    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      throw new Error(`Could not process "${file.name}".`);
    }
  }

  getFileType(file) {
    const mimeType = file.type ? file.type.toLowerCase() : '';
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') return 'docx';
    if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(mimeType) || ['xlsx', 'xls'].includes(extension)) return 'excel';
    if (['text/csv', 'application/csv'].includes(mimeType) || extension === 'csv') return 'csv';
    if (mimeType.startsWith('text/') || ['md', 'json', 'js', 'py', 'html', 'css', 'txt'].includes(extension)) return 'text';
    if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || extension === 'pptx') return 'unsupported';
    
    return 'unsupported';
  }

  async cleanup() {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
    }
  }
}

export const docProcessor = new DocumentProcessor();