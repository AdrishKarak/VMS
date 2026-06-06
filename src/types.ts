export interface Vendor {
  id: string;
  name: string;
  category: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  country: string;
  state?: string;
  city: string;
  address: string;
  website: string;
  phone: string;
  email: string;
  taxId: string;
  registeredDate: string;
  onboardedBy: string;
  status: 'Active' | 'Pending' | 'Inactive' | 'Blocked' | 'Under Review';
  riskScore: number;
  contractValue: number;
  performanceScore: number;
  lastReviewed: string;
  esgScore: number;
  esgTier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Needs Improvement';
  logoInitials: string;
  posCount?: number;
}

export interface PurchaseOrderLineItem {
  code: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  itemsCount: number;
  amount: number;
  createdDate: string;
  requiredBy: string;
  approvedBy: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent' | 'Received' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Paid' | 'Processing';
  title: string;
  paymentTerms: string;
  shipToAddress: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  notes: string;
  lineItems: PurchaseOrderLineItem[];
}

export interface ContractKPI {
  name: string;
  target: string;
  frequency: string;
  penalty: string;
}

export interface Contract {
  id: string;
  title: string;
  vendorId: string;
  vendorName: string;
  type: 'Procurement' | 'Service' | 'NDA' | 'MSA' | 'SLA' | 'Lease' | 'License' | 'Framework';
  value: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  status: 'Draft' | 'Active' | 'Expiring Soon' | 'Expired' | 'Terminated';
  owner: string;
  autoRenew: boolean;
  noticePeriod: string;
  governingLaw: string;
  kpis: ContractKPI[];
  specialTerms: string;
}

export interface Invoice {
  id: string;
  vendorId: string;
  vendorName: string;
  poReference: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  total: number;
  status: 'Received' | 'Under Review' | 'Approved' | 'Disputed' | 'Paid' | 'Overdue';
  paymentStatus: 'Unpaid' | 'Paid' | 'Processing';
  matchingStatus: {
    po: boolean;
    grn: boolean;
    invoice: boolean;
  };
  lineItems: {
    code: string;
    description: string;
    qty: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
}

export interface RiskAssessmentDetails {
  financial: {
    creditRating: string;
    stability: number; // 1-5
    years: number;
    public: boolean;
    litigation: boolean;
  };
  operational: {
    singleSource: boolean;
    geoConcentration: string;
    drPlan: boolean;
    keyDependency: string; // Low, Medium, High
    capacity: number; // percentage
  };
  compliance: {
    certs: string[];
    violations: boolean;
    antiBribery: boolean;
    sanctions: string;
    labor: number; // 1-5
  };
  cyber: {
    dataAccess: string; // None, Low, Medium, High, Critical
    penTestDate: string;
    encRest: boolean;
    encTransit: boolean;
    incidentPlan: boolean;
    mfa: boolean;
  };
  geopolitical: {
    countries: string;
    sanctionedExposure: boolean;
    politicalStability: number; // 1-5
    exportControls: boolean;
  };
}

export interface RiskAssessment {
  vendorId: string;
  vendorName: string;
  overallScore: number;
  financialScore: number;
  operationalScore: number;
  complianceScore: number;
  cyberScore: number;
  geopoliticalScore: number;
  lastAssessed: string;
  riskTrend: 'Improving' | 'Stable' | 'Deteriorating';
  details: RiskAssessmentDetails;
  recommendations: string;
}

export interface ComplianceDoc {
  id: string;
  name: string;
  vendorId: string;
  vendorName: string;
  category: string;
  uploadDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring' | 'Expired';
  verifiedBy: string;
  fileSize: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Procurement Manager' | 'Finance Analyst' | 'Compliance Officer' | 'Viewer' | 'Vendor Portal User';
  department: string;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Pending Invite';
  tfaEnabled: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  ipAddress: string;
  module: string;
  action: string;
  entityId: string;
  description: string;
  status: 'Success' | 'Failed';
  beforeAfter?: {
    before: any;
    after: any;
  };
}

export interface Payment {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceRef: string;
  amount: number;
  currency: string;
  method: 'Bank Transfer' | 'ACH' | 'Wire' | 'Check';
  scheduledDate: string;
  processedDate: string;
  status: 'Scheduled' | 'Processing' | 'Completed' | 'Failed' | 'On Hold';
  referenceNumber: string;
}

export interface SavingsInitiative {
  id: string;
  title: string;
  category: string;
  vendorId: string;
  vendorName: string;
  relatedContractId?: string;
  type: 'Negotiation' | 'Volume Discount' | 'Process' | 'Demand Reduction' | 'Specification Change' | 'Payment Terms';
  baselineCost: number;
  negotiatedCost: number;
  amount: number;
  percentage: number;
  recurring: 'One-Time' | 'Recurring';
  annualizedValue: number;
  notes: string;
  status: 'Realized' | 'Projected' | 'Pipeline' | 'On Hold';
  owner: string;
  targetDate: string;
  verified: boolean;
  verifiedBy?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Contract Renewal' | 'Payment Due' | 'Document Expiry' | 'Review Meeting' | 'Audit Date' | 'Onboarding Deadline' | 'PO Delivery' | 'Risk Assessment';
  vendorId: string;
  vendorName: string;
  entityId: string;
  date: string; // YYYY-MM-DD
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  remindMe: string;
  assignTo: string[];
  notes: string;
  colorOverride?: string;
}

export interface RFQ {
  id: string;
  title: string;
  category: string;
  vendorsInvitedCount: number;
  responsesReceivedCount: number;
  deadline: string;
  status: 'Draft' | 'Active' | 'Review Underway' | 'Awarded' | 'Closed';
  createdBy: string;
  description: string;
  deliveryDate: string;
  budgetEstimate?: number;
  evaluationCriteria: { criterion: string; weight: number }[];
  invitedVendors: string[]; // vendor ids
  lineItems: { code: string; description: string; qty: number; unit: string; specifications: string }[];
  terms: string;
  ndaRequired: boolean;
  confidentialityLevel: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  clarificationsAllowed: boolean;
  responses?: {
    vendorId: string;
    vendorName: string;
    scores: { criterion: string; score: number }[]; // 1-100
    weightedScore: number;
    totalBidAmount: number;
    onTimeDeliveryPromise: string;
    warrantyMonths: number;
    notes: string;
    isAwarded?: boolean;
  }[];
}
