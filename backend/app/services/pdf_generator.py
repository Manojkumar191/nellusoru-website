"""
PDF Invoice Generator Service
"""

from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT

from app.core.config import settings

def generate_invoice_pdf(invoice, customer=None) -> BytesIO:
    """Generate PDF invoice"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        spaceAfter=6,
        textColor=colors.HexColor('#1e40af'),
        alignment=TA_CENTER
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.gray,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'Heading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=6
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=4
    )
    
    # Header - Company Name
    elements.append(Paragraph(settings.BUSINESS_NAME, title_style))
    elements.append(Paragraph("Quality Manufacturing & Reliable Services", subtitle_style))
    elements.append(Paragraph(settings.BUSINESS_ADDRESS, subtitle_style))
    elements.append(Paragraph(f"Phone: {settings.BUSINESS_PHONE} | Email: {settings.BUSINESS_EMAIL}", subtitle_style))
    elements.append(Spacer(1, 20))
    
    # Invoice Title
    elements.append(Paragraph(f"INVOICE", styles['Heading1']))
    elements.append(Spacer(1, 10))
    
    # Invoice details table
    invoice_info = [
        ['Invoice Number:', invoice.invoice_number, 'Date:', str(invoice.invoice_date)],
        ['Status:', invoice.status.upper(), 'Due Date:', str(invoice.due_date) if invoice.due_date else 'N/A'],
    ]
    
    invoice_table = Table(invoice_info, colWidths=[80, 140, 60, 100])
    invoice_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
        ('TEXTCOLOR', (2, 0), (2, -1), colors.HexColor('#374151')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(invoice_table)
    elements.append(Spacer(1, 20))
    
    # Customer Info
    elements.append(Paragraph("Bill To:", heading_style))
    if customer:
        customer_info = f"""
        <b>{customer.contact_person}</b><br/>
        {customer.company_name or ''}<br/>
        {customer.address or ''}<br/>
        {customer.city or ''}, {customer.state or ''} - {customer.pincode or ''}<br/>
        Phone: {customer.phone}<br/>
        {f'GST: {customer.gst_number}' if customer.gst_number else ''}
        """
        elements.append(Paragraph(customer_info, normal_style))
    else:
        elements.append(Paragraph("Walk-in Customer", normal_style))
    elements.append(Spacer(1, 20))
    
    # Items Table
    elements.append(Paragraph("Items:", heading_style))
    
    # Table header
    items_data = [['#', 'Description', 'Qty', 'Unit', 'Unit Price', 'Amount']]
    
    # Table rows
    for idx, item in enumerate(invoice.items, 1):
        items_data.append([
            str(idx),
            item.description,
            str(item.quantity),
            item.unit or '-',
            f"₹{float(item.unit_price):,.2f}",
            f"₹{float(item.amount):,.2f}"
        ])
    
    items_table = Table(items_data, colWidths=[30, 200, 50, 50, 80, 80])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('ALIGN', (2, 1), (2, -1), 'CENTER'),
        ('ALIGN', (3, 1), (3, -1), 'CENTER'),
        ('ALIGN', (4, 1), (5, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')]),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 20))
    
    # Totals
    totals_data = [
        ['Subtotal:', f"₹{float(invoice.subtotal):,.2f}"],
        [f'Tax ({float(invoice.tax_rate)}%):', f"₹{float(invoice.tax_amount):,.2f}"],
        ['Discount:', f"-₹{float(invoice.discount_amount):,.2f}"],
        ['TOTAL:', f"₹{float(invoice.total_amount):,.2f}"],
    ]
    
    totals_table = Table(totals_data, colWidths=[380, 100])
    totals_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#1e40af')),
        ('LINEABOVE', (0, -1), (-1, -1), 1, colors.HexColor('#1e40af')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(totals_table)
    elements.append(Spacer(1, 30))
    
    # Notes and Terms
    if invoice.notes:
        elements.append(Paragraph("Notes:", heading_style))
        elements.append(Paragraph(invoice.notes, normal_style))
        elements.append(Spacer(1, 10))
    
    if invoice.terms:
        elements.append(Paragraph("Terms & Conditions:", heading_style))
        elements.append(Paragraph(invoice.terms, normal_style))
        elements.append(Spacer(1, 20))
    
    # Footer
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.gray,
        alignment=TA_CENTER
    )
    elements.append(Spacer(1, 30))
    elements.append(Paragraph(
        f"Thank you for your business! | {settings.BUSINESS_NAME} | Est. 2023",
        footer_style
    ))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer
