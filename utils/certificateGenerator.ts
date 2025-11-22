import { jsPDF } from 'jspdf';

export interface CertificateData {
    eventName: string;
    date: string;
    role: string;
    hours: number;
    volunteerName: string;
    progress?: number; // Percentage of completion or impact
}

export const generateCertificate = (data: CertificateData) => {
    // Create PDF in landscape orientation, A4 size
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;
    const centerX = pageWidth / 2;

    // --- Design Elements ---

    // 1. Professional Border
    // Outer thin line
    doc.setDrawColor(60, 60, 60); // Dark gray
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner thick line
    doc.setDrawColor(40, 40, 40); // Darker gray
    doc.setLineWidth(2);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // 2. Header Section
    // Logo placeholder or Organization Name
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text('EVENTURE', centerX, 35, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('COMMUNITY VOLUNTEER PROGRAM', centerX, 42, { align: 'center' });

    // Certificate Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(33, 150, 243); // Professional Blue
    doc.text('CERTIFICATE', centerX, 65, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text('OF APPRECIATION', centerX, 75, { align: 'center' });

    // 3. Recipient Section
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text('This certificate is proudly presented to', centerX, 95, { align: 'center' });

    // Volunteer Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text(data.volunteerName, centerX, 110, { align: 'center' });

    // Underline name
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(centerX - 60, 115, centerX + 60, 115);

    // 4. Details Section
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);

    const eventDate = new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    doc.text('In recognition of their outstanding contribution and dedication', centerX, 130, { align: 'center' });
    doc.text(`as a ${data.role} at`, centerX, 138, { align: 'center' });

    // Event Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text(data.eventName, centerX, 148, { align: 'center' });

    // Stats (Hours & Progress)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);

    let statsText = `Date: ${eventDate}  |  Hours Contributed: ${data.hours}`;
    if (data.progress !== undefined) {
        statsText += `  |  Completion: ${data.progress}%`;
    }
    doc.text(statsText, centerX, 160, { align: 'center' });

    // 5. Footer & Signature
    const sigY = 180;

    // Left Signature
    doc.line(60, sigY, 110, sigY); // Line
    doc.setFontSize(10);
    doc.text('Program Director', 85, sigY + 5, { align: 'center' });

    // Right Signature
    doc.line(pageWidth - 110, sigY, pageWidth - 60, sigY); // Line
    doc.text('Event Coordinator', pageWidth - 85, sigY + 5, { align: 'center' });

    // Date Issued
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const issueDate = new Date().toLocaleDateString();
    doc.text(`Issued on: ${issueDate}`, centerX, 195, { align: 'center' });
    doc.text(`Certificate ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, centerX, 200, { align: 'center' });

    // Save PDF
    const safeName = data.volunteerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const safeEvent = data.eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`certificate_${safeName}_${safeEvent}.pdf`);
};

export const generateEmptyCertificate = () => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    // Border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Big Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(200, 50, 50); // Red color
    doc.text('NO CERTIFICATE GENERATED', centerX, centerY, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Please complete an event to earn a certificate.', centerX, centerY + 20, { align: 'center' });

    doc.save('no_certificate.pdf');
};
