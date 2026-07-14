import {
  BarChart3,
  Boxes,
  ClipboardList,
  Home,
  Settings,
  ShieldCheck,
  Truck,
  Calculator,
} from "lucide-react";
import { OWNER_ONLY_ROLES, STAFF_WORKFLOW_ROLES } from "./roles";
import { PriceCalculatorPage } from "../features/calculator/pages/PriceCalculatorPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { QuotationListPage } from "../features/quotations/pages/QuotationListPage";
import { CreateQuotationPage } from "../features/quotations/pages/CreateQuotationPage";
import { EditQuotationPage } from "../features/quotations/pages/EditQuotationPage";
import { QuotationDetailsPage } from "../features/quotations/pages/QuotationDetailsPage";
import { PricingRulesPage } from "../features/pricing/pages/PricingRulesPage";
import { CategoriesPage } from "../features/categories/pages/CategoriesPage";
import { ShippingMethodsPage } from "../features/shipping/pages/ShippingMethodsPage";
import { SpecialRequestApprovalsPage } from "../features/approvals/pages/SpecialRequestApprovalsPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";

export const routeConfig = [
  {
    path: "/",
    label: "Dashboard",
    icon: Home,
    Component: DashboardPage,
    nav: true,
    allowedRoles: OWNER_ONLY_ROLES,
  },
  {
    path: "/calculator",
    label: "Price Calculator",
    icon: Calculator,
    Component: PriceCalculatorPage,
    nav: true,
    allowedRoles: STAFF_WORKFLOW_ROLES,
  },
  {
    path: "/quotations",
    label: "Quotations",
    icon: ClipboardList,
    Component: QuotationListPage,
    nav: true,
    allowedRoles: STAFF_WORKFLOW_ROLES,
  },
  {
    path: "/quotations/create",
    label: "Create Quotation",
    Component: CreateQuotationPage,
    allowedRoles: STAFF_WORKFLOW_ROLES,
  },
  {
    path: "/quotations/:quotationId",
    label: "Quotation Details",
    Component: QuotationDetailsPage,
    allowedRoles: STAFF_WORKFLOW_ROLES,
  },
  {
    path: "/quotations/:quotationId/edit",
    label: "Edit Quotation",
    Component: EditQuotationPage,
    allowedRoles: STAFF_WORKFLOW_ROLES,
  },
  {
    path: "/pricing-rules",
    label: "Pricing Rules",
    icon: BarChart3,
    Component: PricingRulesPage,
    nav: true,
    allowedRoles: OWNER_ONLY_ROLES,
  },
  {
    path: "/categories",
    label: "Product Categories",
    icon: Boxes,
    Component: CategoriesPage,
    nav: true,
    allowedRoles: OWNER_ONLY_ROLES,
  },
  {
    path: "/shipping-methods",
    label: "Shipping Methods",
    icon: Truck,
    Component: ShippingMethodsPage,
    nav: true,
    allowedRoles: OWNER_ONLY_ROLES,
  },
  {
    path: "/approvals",
    label: "Approvals",
    icon: ShieldCheck,
    Component: SpecialRequestApprovalsPage,
    nav: true,
    allowedRoles: OWNER_ONLY_ROLES,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
    Component: SettingsPage,
    nav: true,
    allowedRoles: OWNER_ONLY_ROLES,
  },
];

export const navigationRoutes = routeConfig.filter((route) => route.nav);
