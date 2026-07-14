import {
  APPROVAL_STATUSES,
  CURRENT_USER,
  QUOTATION_STATUSES,
} from "../constants/quotationConstants";
import { roundMoney } from "../../pricing/utils/money";

export const QUOTATION_FORM_DEFAULTS = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  businessSection: "",
  productName: "",
  productUrl: "",
  productCategory: "",
  websitePrice: "",
  estimatedWeight: "",
  shippingMethodId: "",
  specialRequest: false,
  specialRequestReason: "",
  localDelivery: false,
  status: QUOTATION_STATUSES.DRAFT,
};

export function quotationToFormValues(quotation) {
  if (!quotation) {
    return QUOTATION_FORM_DEFAULTS;
  }

  return {
    customerName: quotation.customerName,
    customerPhone: quotation.customerPhone,
    customerAddress: quotation.customerAddress,
    businessSection: quotation.businessSection,
    productName: quotation.productName,
    productUrl: quotation.productUrl ?? "",
    productCategory: quotation.productCategory,
    websitePrice: quotation.websitePrice,
    estimatedWeight: quotation.estimatedWeight,
    shippingMethodId: quotation.shippingMethodId,
    specialRequest: Boolean(quotation.specialRequest),
    specialRequestReason: quotation.specialRequestReason ?? "",
    localDelivery: Boolean(quotation.localDelivery),
    status: quotation.status,
  };
}

export function mapFormToQuotation({
  values,
  breakdown,
  shippingMethod,
  existingQuotation,
  quotationNumber,
}) {
  const now = new Date().toISOString();
  const specialRequestApprovalStatus = values.specialRequest
    ? (existingQuotation?.specialRequestApprovalStatus === APPROVAL_STATUSES.APPROVED
        ? APPROVAL_STATUSES.APPROVED
        : APPROVAL_STATUSES.PENDING)
    : APPROVAL_STATUSES.NOT_REQUIRED;

  return {
    id: existingQuotation?.id ?? `quote-${Date.now()}`,
    quotationNumber: existingQuotation?.quotationNumber ?? quotationNumber,
    customerName: values.customerName.trim(),
    customerPhone: values.customerPhone.trim(),
    customerAddress: values.customerAddress.trim(),
    businessSection: values.businessSection,
    productName: values.productName.trim(),
    productUrl: values.productUrl?.trim() ?? "",
    productCategory: values.productCategory,
    websitePrice: roundMoney(values.websitePrice),
    estimatedWeight: Number(values.estimatedWeight),
    shippingMethodId: values.shippingMethodId,
    shippingMethodName: shippingMethod?.name ?? "Unknown method",
    shippingRate: Number(shippingMethod?.ratePerLb ?? 0),
    taxAmount: breakdown.taxAmount,
    profitAmount: breakdown.profitAmount,
    shippingCompanyFee: breakdown.shippingCompanyFee,
    shippingAmount: breakdown.shippingAmount,
    specialRequest: Boolean(values.specialRequest),
    specialRequestFee: breakdown.specialRequestFee,
    specialRequestReason: values.specialRequest ? values.specialRequestReason.trim() : "",
    specialRequestApprovalStatus,
    specialRequestRejectionReason:
      specialRequestApprovalStatus === APPROVAL_STATUSES.PENDING
        ? ""
        : existingQuotation?.specialRequestRejectionReason ?? "",
    localDelivery: Boolean(values.localDelivery),
    localDeliveryFee: breakdown.localDeliveryFee,
    finalSellingPrice: breakdown.finalSellingPrice,
    status: values.status ?? existingQuotation?.status ?? QUOTATION_STATUSES.DRAFT,
    createdBy: existingQuotation?.createdBy ?? CURRENT_USER.name,
    createdAt: existingQuotation?.createdAt ?? now,
    updatedAt: now,
  };
}
