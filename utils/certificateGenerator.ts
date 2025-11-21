import { jsPDF } from 'jspdf';

export interface CertificateData {
    eventName: string;
    date: string;
    role: string;
    hours: number;
    volunteerName: string;
    progress?: number; // Optional progress percentage (0-100)
}

export const generateCertificate = (data: CertificateData) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;
    const centerX = pageWidth / 2;

    // Background - Elegant gradient effect using rectangles
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative corner elements
    const drawCornerDecoration = (x: number, y: number, flipX: boolean, flipY: boolean) => {
        doc.setDrawColor(79, 70, 229); // indigo-600
        doc.setLineWidth(0.5);

        const xMult = flipX ? -1 : 1;
        const yMult = flipY ? -1 : 1;

        // Corner lines
        doc.line(x, y, x + (20 * xMult), y);
        doc.line(x, y, x, y + (20 * yMult));
        doc.line(x + (15 * xMult), y, x + (15 * xMult), y + (5 * yMult));
        doc.line(x, y + (15 * yMult), x + (5 * xMult), y + (15 * yMult));
    };

    // Draw corner decorations
    drawCornerDecoration(15, 15, false, false);
    drawCornerDecoration(pageWidth - 15, 15, true, false);
    drawCornerDecoration(15, pageHeight - 15, false, true);
    drawCornerDecoration(pageWidth - 15, pageHeight - 15, true, true);

    // Main border - double line effect
    doc.setLineWidth(1.5);
    doc.setDrawColor(79, 70, 229); // indigo-600
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    doc.setLineWidth(0.3);
    doc.setDrawColor(165, 180, 252); // indigo-300
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Top decorative line
    doc.setLineWidth(0.5);
    doc.setDrawColor(79, 70, 229);
    doc.line(50, 35, pageWidth - 50, 35);

    // Header - Certificate Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text('CERTIFICATE', centerX, 30, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(99, 102, 241); // indigo-500
    doc.text('OF APPRECIATION', centerX, 38, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('This is to certify that', centerX, 55, { align: 'center' });

    // Volunteer Name - Emphasized
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(32);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(data.volunteerName, centerX, 70, { align: 'center' });

    // Underline for name
    doc.setLineWidth(0.3);
    doc.setDrawColor(79, 70, 229);
    const nameWidth = doc.getTextWidth(data.volunteerName);
    doc.line(centerX - nameWidth / 2 - 5, 72, centerX + nameWidth / 2 + 5, 72);

    // Main content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text('has successfully completed volunteer service as a', centerX, 85, { align: 'center' });

    // Role - Highlighted
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229);
    doc.text(data.role, centerX, 95, { align: 'center' });

    // Event details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(51, 65, 85);
    const eventDate = new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`at the ${data.eventName}`, centerX, 105, { align: 'center' });
    doc.text(`on ${eventDate}`, centerX, 113, { align: 'center' });

    // Hours and Progress section - Box design
    const boxY = 125;
    const boxHeight = 25;

    // Hours box
    doc.setFillColor(249, 250, 251); // gray-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.roundedRect(60, boxY, 70, boxHeight, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('HOURS CONTRIBUTED', 95, boxY + 8, { align: 'center' });

    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text(`${data.hours}`, 95, boxY + 20, { align: 'center' });

    // Progress box (if provided)
    if (data.progress !== undefined) {
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(pageWidth - 130, boxY, 70, boxHeight, 3, 3, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.text('COMPLETION', pageWidth - 95, boxY + 8, { align: 'center' });

        doc.setFontSize(20);
        doc.setTextColor(34, 197, 94); // green-500
        doc.text(`${data.progress}%`, pageWidth - 95, boxY + 20, { align: 'center' });
    }

    // Bottom decorative line
    doc.setLineWidth(0.5);
    doc.setDrawColor(79, 70, 229);
    doc.line(50, 160, pageWidth - 50, 160);

    // Signature section
    const sigY = 175;

    // Left signature - Organization
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    // Signature line
    doc.setLineWidth(0.3);
    doc.setDrawColor(148, 163, 184);
    doc.line(50, sigY, 110, sigY);

    // Signature placeholder (you can add an actual signature image here)
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Eventure Team', 80, sigY - 3, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Authorized Signature', 80, sigY + 5, { align: 'center' });
    doc.text('Volunteer Coordinator', 80, sigY + 10, { align: 'center' });

    // Right signature - Date
    doc.setLineWidth(0.3);
    doc.line(pageWidth - 110, sigY, pageWidth - 50, sigY);

    const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(issueDate, pageWidth - 80, sigY - 3, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Date of Issue', pageWidth - 80, sigY + 5, { align: 'center' });

    // Footer message
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for your dedication and commitment to making a positive impact in our community.', centerX, pageHeight - 10, { align: 'center' });

    // Certificate ID (bottom right corner)
    const certId = `CERT-${Date.now().toString(36).toUpperCase()}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Certificate ID: ${certId}`, pageWidth - 20, pageHeight - 5, { align: 'right' });

    // Save the PDF
    const fileName = `${data.volunteerName.replace(/\s+/g, '_')}_${data.eventName.replace(/\s+/g, '_')}_Certificate.pdf`;
    doc.save(fileName);
};
