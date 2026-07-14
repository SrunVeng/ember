import { jsPDF } from "jspdf";
import { roundMoney } from "../../pricing/utils/money";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";

function getInvoiceRows(quotation) {
  const productTotal = roundMoney(
    quotation.finalSellingPrice -
      quotation.shippingAmount -
      quotation.specialRequestFee -
      quotation.localDeliveryFee,
  );

  return [
    ["Product total", productTotal],
    ["Shipping", quotation.shippingAmount],
    ["Special service", quotation.specialRequestFee],
    ["Local delivery", quotation.localDeliveryFee],
  ].filter(([, value]) => Boolean(value));
}

function writeText(doc, text, x, y, options = {}) {
  doc.text(String(text ?? ""), x, y, options);
}

export function createInvoicePdf(quotation) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const invoiceNumber = `INV-${quotation.quotationNumber.replace("EMB-", "")}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 54;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  writeText(doc, "EMBER & CO.", margin, y);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  writeText(doc, "Customer Invoice", margin, y + 18);

  doc.setFont("helvetica", "bold");
  writeText(doc, invoiceNumber, pageWidth - margin, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  writeText(doc, `Quotation: ${quotation.quotationNumber}`, pageWidth - margin, y + 18, {
    align: "right",
  });
  writeText(doc, `Date: ${formatDate(new Date())}`, pageWidth - margin, y + 34, {
    align: "right",
  });

  y += 70;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageWidth - margin, y);

  y += 34;
  doc.setFont("helvetica", "bold");
  writeText(doc, "Bill To", margin, y);
  writeText(doc, "Product", pageWidth / 2 + 12, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  writeText(doc, quotation.customerName, margin, y + 18);
  writeText(doc, quotation.customerPhone || "No phone provided", margin, y + 34);
  doc.text(
    doc.splitTextToSize(quotation.customerAddress || "No address provided", 220),
    margin,
    y + 50,
  );
  writeText(doc, quotation.productName, pageWidth / 2 + 12, y + 18);
  writeText(doc, quotation.productCategory, pageWidth / 2 + 12, y + 34);
  writeText(doc, quotation.businessSection, pageWidth / 2 + 12, y + 50);

  y += 110;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  writeText(doc, "Charge", margin, y);
  writeText(doc, "Amount", pageWidth - margin, y, { align: "right" });
  y += 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);

  doc.setFont("helvetica", "normal");
  getInvoiceRows(quotation).forEach(([label, value]) => {
    y += 24;
    writeText(doc, label, margin, y);
    writeText(doc, formatCurrency(value), pageWidth - margin, y, { align: "right" });
  });

  y += 22;
  doc.setDrawColor(15, 23, 42);
  doc.line(margin, y, pageWidth - margin, y);
  y += 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  writeText(doc, "Total due", margin, y);
  writeText(doc, formatCurrency(quotation.finalSellingPrice), pageWidth - margin, y, {
    align: "right",
  });

  y += 48;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    doc.splitTextToSize(
      "Generated from the EMBER Pricing System. Please review payment and delivery details with the customer before fulfillment.",
      pageWidth - margin * 2,
    ),
    margin,
    y,
  );

  return doc;
}

export function downloadInvoice(quotation) {
  createInvoicePdf(quotation).save(`${quotation.quotationNumber}-invoice.pdf`);
}
