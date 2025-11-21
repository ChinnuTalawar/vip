import { jsPDF } from 'jspdf';

export interface CertificateDetails {
  volunteerName: string;
  eventName: string;
  date: string;
  role?: string;
  hours?: number;
}

function drawCertificateCanvas(details: CertificateDetails) {
  const width = 1600;
  const height = 1150;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Border
  const pad = 40;
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#E5E7EB';
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  // Inner accent line
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#6366F1';
  ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2);

  // Title
  ctx.fillStyle = '#111827';
  ctx.font = '48px serif';
  ctx.textAlign = 'center';
  ctx.fillText('Certificate of Participation', width / 2, 200);

  // Subtitle
  ctx.fillStyle = '#374151';
  ctx.font = '20px serif';
  ctx.fillText('This certificate is proudly presented to', width / 2, 270);

  // Volunteer name
  ctx.fillStyle = '#111827';
  ctx.font = '56px serif';
  ctx.fillText(details.volunteerName, width / 2, 360);

  // Event and hours
  ctx.fillStyle = '#374151';
  ctx.font = '22px serif';
  const hoursText = details.hours !== undefined ? `${details.hours} hours` : '';
  const roleText = details.role ? ` as ${details.role}` : '';
  const mainLine = `${hoursText ? hoursText + ' of service' : 'In recognition of participation'}${roleText} at ${details.eventName}`;
  wrapText(ctx, mainLine, width / 2, 440, 900, 26);

  // Date
  ctx.font = '18px serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(`Date: ${new Date(details.date).toLocaleDateString()}`, width / 2, 520);

  // Signature area (draw a simple handwritten-like SVG rendered as image)
  const sigSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='120'>
    <rect width='100%' height='100%' fill='transparent' />
    <text x='10' y='80' font-family='Brush Script MT, Brush Script, cursive' font-size='72' fill='#111827'>Director</text>
  </svg>`;

  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sigSvg);

  return new Promise<HTMLCanvasElement>((resolve) => {
    img.onload = () => {
      // Draw signature
      const sigW = 360;
      const sigH = 110;
      ctx.drawImage(img, width - sigW - 120, height - sigH - 130, sigW, sigH);

      // Signature line text
      ctx.font = '16px serif';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'right';
      ctx.fillText('Authorized Signature', width - 120, height - 30);

      resolve(canvas);
    };
    img.onerror = () => {
      // If signature image fails, still resolve
      resolve(canvas);
    };
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let testLine = '';
  let testWidth = 0;
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line.trim(), x, curY);
  }
}

export async function generateCertificate(details: CertificateDetails) {
  if (typeof window === 'undefined') return;
  const canvas = await drawCertificateCanvas(details);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Draw the generated image to fill the page while preserving aspect
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  const fileName = `${details.volunteerName.replace(/\s+/g, '_')}-${details.eventName.replace(/\s+/g, '_')}-certificate.pdf`;
  pdf.save(fileName);
}

export default generateCertificate;
import { jsPDF } from 'jspdf';

export interface CertificateData {
    eventName: string;
    date: string;
    role: string;
    hours: number;
    volunteerName: string;
}

export const generateCertificate = (data: CertificateData) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Background
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(0, 0, 297, 210, 'F');

    // Border
    doc.setLineWidth(2);
    doc.setDrawColor(79, 70, 229); // indigo-600
    doc.rect(10, 10, 277, 190);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(79, 70, 229);
    doc.text('Certificate of Appreciation', 148.5, 50, { align: 'center' });

    // Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text('This certificate is proudly presented to', 148.5, 80, { align: 'center' });

    // Volunteer Name
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(30);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(data.volunteerName, 148.5, 100, { align: 'center' });

    // Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(51, 65, 85);
    doc.text('For their outstanding contribution and dedication as a', 148.5, 120, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text(data.role, 148.5, 130, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.text(`at the ${data.eventName} event on ${new Date(data.date).toLocaleDateString()}.`, 148.5, 140, { align: 'center' });

    doc.text(`Total Hours Volunteered: ${data.hours}`, 148.5, 155, { align: 'center' });

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Thank you for making a difference!', 148.5, 180, { align: 'center' });

    doc.text('Eventure Management Team', 148.5, 190, { align: 'center' });

    doc.save(`${data.eventName.replace(/\s+/g, '_')}_Certificate.pdf`);
};
