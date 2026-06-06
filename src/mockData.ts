import {
  Vendor,
  PurchaseOrder,
  PurchaseOrderLineItem,
  Contract,
  Invoice,
  RiskAssessment,
  ComplianceDoc,
  User,
  ActivityLog,
  Payment,
  SavingsInitiative,
  CalendarEvent,
  RFQ
} from './types';

// Categories color mappings
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'IT Services': { bg: 'bg-blue-50 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  'Raw Materials': { bg: 'bg-orange-50 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  'Logistics': { bg: 'bg-cyan-50 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', dot: 'bg-cyan-500' },
  'Consulting': { bg: 'bg-purple-50 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  'Marketing': { bg: 'bg-pink-50 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300', dot: 'bg-pink-500' },
  'Facilities': { bg: 'bg-emerald-50 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  'Legal': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', dot: 'bg-slate-500' },
  'HR Services': { bg: 'bg-rose-50 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
  'Manufacturing': { bg: 'bg-amber-50 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  'Other': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-400' },
};

// 1. Users
export const mockUsers: User[] = [
  { id: 'USR-01', name: 'Alex Mercer', email: 'alex.mercer@vendorflow.com', role: 'Procurement Manager', department: 'Procurement', lastLogin: '2026-06-06 08:32', status: 'Active', tfaEnabled: true },
  { id: 'USR-02', name: 'Elena Rostova', email: 'elena.rostova@vendorflow.com', role: 'Admin', department: 'IT', lastLogin: '2026-06-06 09:05', status: 'Active', tfaEnabled: true },
  { id: 'USR-03', name: 'Marcus Vance', email: 'marcus.vance@vendorflow.com', role: 'Finance Analyst', department: 'Finance', lastLogin: '2026-06-05 17:15', status: 'Active', tfaEnabled: true },
  { id: 'USR-04', name: 'Sarah Jenkins', email: 'sarah.jenkins@vendorflow.com', role: 'Compliance Officer', department: 'Compliance & Risk', lastLogin: '2026-06-06 07:44', status: 'Active', tfaEnabled: true },
  { id: 'USR-05', name: 'Deepak Nair', email: 'deepak.nair@vendorflow.com', role: 'Procurement Manager', department: 'Procurement', lastLogin: '2026-06-04 11:20', status: 'Active', tfaEnabled: false },
  { id: 'USR-06', name: 'Chloe Fontaine', email: 'chloe.fontaine@vendorflow.com', role: 'Finance Analyst', department: 'Finance', lastLogin: '2026-06-05 14:10', status: 'Active', tfaEnabled: true },
  { id: 'USR-07', name: 'Jonathan Ross', email: 'jonathan.ross@vendorflow.com', role: 'Compliance Officer', department: 'Legal', lastLogin: '2026-06-03 09:30', status: 'Active', tfaEnabled: true },
  { id: 'USR-08', name: 'Amara Okafor', email: 'amara.okafor@vendorflow.com', role: 'Viewer', department: 'Operations', lastLogin: '2026-06-01 16:45', status: 'Active', tfaEnabled: false },
  { id: 'USR-09', name: 'Yuki Tanaka', email: 'yuki.tanaka@vendorflow.com', role: 'Admin', department: 'IT', lastLogin: '2026-06-05 10:00', status: 'Active', tfaEnabled: true },
  { id: 'USR-10', name: 'David Smith', email: 'david.smith@vendorflow.com', role: 'Procurement Manager', department: 'Procurement', lastLogin: '2026-05-30 13:00', status: 'Inactive', tfaEnabled: true },
  { id: 'USR-11', name: 'Zoe Martinez', email: 'zoe.martinez@vendorflow.com', role: 'Vendor Portal User', department: 'External Partner', lastLogin: '2026-06-06 06:12', status: 'Active', tfaEnabled: true },
  { id: 'USR-12', name: 'Hans Gruber', email: 'hans.gruber@extern.com', role: 'Vendor Portal User', department: 'External Partner', lastLogin: '2026-06-05 12:44', status: 'Active', tfaEnabled: false },
  { id: 'USR-13', name: 'Emily Watson', email: 'emily.w@vendorflow.com', role: 'Viewer', department: 'Executive', lastLogin: '2026-05-28 15:00', status: 'Active', tfaEnabled: true },
  { id: 'USR-14', name: 'Rahul Sharma', email: 'rahul.s@vendorflow.com', role: 'Procurement Manager', department: 'Procurement', lastLogin: '2026-06-06 09:10', status: 'Pending Invite', tfaEnabled: false },
  { id: 'USR-15', name: 'Sophie Dubois', email: 'sophie.d@vendorflow.com', role: 'Compliance Officer', department: 'Compliance', lastLogin: '2026-06-05 16:30', status: 'Active', tfaEnabled: true }
];

// Helper variables for generation
const baseVendorsList = [
  { name: 'Apex Technologies Ltd', country: '🇺🇸 United States', city: 'San Francisco', category: 'IT Services', taxId: 'US982736182', email: 'info@apextech.com' },
  { name: 'GlobalTrade GmbH', country: '🇩🇪 Germany', city: 'Munich', category: 'Logistics', taxId: 'DE291837465', email: 'partner@globaltrade.de' },
  { name: 'Meridian Supplies Inc', country: '🇨🇦 Canada', city: 'Toronto', category: 'Raw Materials', taxId: 'CA765432109', email: 'sales@meridiansupply.ca' },
  { name: 'NovaStar Logistics', country: '🇬🇧 United Kingdom', city: 'London', category: 'Logistics', taxId: 'GB543210987', email: 'contact@novastar.co.uk' },
  { name: 'ClearPath IT Solutions', country: '🇮🇳 India', city: 'Bangalore', category: 'IT Services', taxId: 'IN122334455', email: 'support@clearpath.in' },
  { name: 'Summit Consulting Inc', country: '🇺🇸 United States', city: 'Boston', category: 'Consulting', taxId: 'US875641293', email: 'hello@summitconsulting.com' },
  { name: 'Vanguard Industrial', country: '🇫🇷 France', city: 'Lyon', category: 'Manufacturing', taxId: 'FR987654321', email: 'contact@vanguardind.fr' },
  { name: 'Phoenix Marketing Agency', country: '🇸🇬 Singapore', city: 'Singapore', category: 'Marketing', taxId: 'SG432109876', email: 'grow@phoenixmarketing.sg' },
  { name: 'Synergy Facilities Management', country: '🇳🇱 Netherlands', city: 'Amsterdam', category: 'Facilities', taxId: 'NL349823641', email: 'service@synergyfm.nl' },
  { name: 'Alpha Legal Group LLP', country: '🇺🇸 United States', city: 'New York', category: 'Legal', taxId: 'US543289123', email: 'info@alphalegal.com' },
  { name: 'Integrity HR Services', country: '🇦🇺 Australia', city: 'Sydney', category: 'HR Services', taxId: 'AU873210984', email: 'talent@integrityhr.com.au' },
  { name: 'Pinnacle Manufacturing Corp', country: '🇯🇵 Japan', city: 'Osaka', category: 'Manufacturing', taxId: 'JP342158907', email: 'supply@pinnacle-mfg.co.jp' },
  { name: 'Quantum Software Systems', country: '🇨🇦 Canada', city: 'Vancouver', category: 'IT Services', taxId: 'CA983271049', email: 'accounts@quantumsoft.ca' },
  { name: 'Aurora Energy & Grid', country: '🇩🇪 Germany', city: 'Frankfurt', category: 'Other', taxId: 'DE873210498', email: 'sustainability@auroraenergy.de' },
  { name: 'Dynamic Space Facilitators', country: '🇬🇧 United Kingdom', city: 'Manchester', category: 'Facilities', taxId: 'GB982736412', email: 'facilities@dynamicspace.co.uk' },
  { name: 'Elite Advisory & Co', country: '🇫🇷 France', city: 'Paris', category: 'Consulting', taxId: 'FR762394182', email: 'elite@advisory.fr' },
  { name: 'Matrix Materials & Iron', country: '🇮🇳 India', city: 'Mumbai', category: 'Raw Materials', taxId: 'IN459801234', email: 'orders@matrixmaterials.com' },
  { name: 'Swift Delivery Systems', country: '🇺🇸 United States', city: 'Chicago', category: 'Logistics', taxId: 'US342150964', email: 'ops@swiftdelivery.com' },
  { name: 'Zephyr Creative Labs', country: '🇳🇱 Netherlands', city: 'Rotterdam', category: 'Marketing', taxId: 'NL872349182', email: 'spark@zephyrlabs.nl' },
  { name: 'Vanguard Legal Partners', country: '🇬🇧 United Kingdom', city: 'Edinburgh', category: 'Legal', taxId: 'GB342109843', email: 'partner@vanguardlegal.com' },
  { name: 'TalentPool Recruitment', country: '🇸🇬 Singapore', city: 'Singapore', category: 'HR Services', taxId: 'SG892341029', email: 'match@talentpool.sg' },
  { name: 'IronClad Cyber Defense', country: '🇺🇸 United States', city: 'Austin', category: 'IT Services', taxId: 'US983210498', email: 'soc@ironcladcyber.com' },
  { name: 'EcoPack Packaging', country: '🇩🇪 Germany', city: 'Stuttgart', category: 'Raw Materials', taxId: 'DE983210431', email: 'green@ecopack.de' },
  { name: 'ProConsulting Partners', country: '🇨🇦 Canada', city: 'Ottawa', category: 'Consulting', taxId: 'CA321098471', email: 'strategies@proconsulting.ca' },
  { name: 'Pacific Supply Chains', country: '🇯🇵 Japan', city: 'Tokyo', category: 'Logistics', taxId: 'JP983210214', email: 'global@pacificsc.jp' }
];

// Helper to expand base list to exactly 50 vendors
export const mockVendors: Vendor[] = [];
for (let i = 0; i < 50; i++) {
  const base = baseVendorsList[i % baseVendorsList.length];
  const iteration = Math.floor(i / baseVendorsList.length);
  const suffix = iteration > 0 ? ` ${iteration + 1}` : '';
  const vendorName = base.name + suffix;
  const tempId = `VND-${(1000 + i + 1).toString().substring(1)}`;

  const tiers: ('Tier 1' | 'Tier 2' | 'Tier 3')[] = ['Tier 1', 'Tier 2', 'Tier 3'];
  const tier = i < 12 ? 'Tier 1' : i < 30 ? 'Tier 2' : 'Tier 3';

  const statuses: ('Active' | 'Pending' | 'Inactive' | 'Blocked' | 'Under Review')[] =
    ['Active', 'Active', 'Active', 'Pending', 'Under Review', 'Inactive', 'Blocked'];
  let status = statuses[i % statuses.length];
  if (i === 1) status = 'Active'; // Keep key ones active
  if (i === 3) status = 'Pending';
  if (i === 4) status = 'Blocked';

  const initials = vendorName.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();
  const performanceScore = Math.floor(72 + (i % 29) + (i % 3 === 0 ? -12 : 0) - (status === 'Blocked' ? 15 : 0));
  const riskScore = Math.floor(15 + (i * 73) % 75 + (status === 'Blocked' ? 10 : 0));

  const yearsRegistered = 1 + (i % 6);
  const registeredDate = `20${26 - yearsRegistered}-0${(i % 9) + 1}-14`;

  const spendBase = [1200000, 340000, 850000, 150000, 80000, 2400000, 48000, 95000];
  const contractValue = spendBase[i % spendBase.length] * (1 + (i % 3) * 0.4);

  const esgScore = Math.floor(40 + (i % 3 === 0 ? 55 : i % 5 === 0 ? 30 : 25) + (i % 4) * 8);
  const correctedEsgScore = Math.min(100, Math.max(25, esgScore));

  let esgTier: Vendor['esgTier'] = 'Silver';
  if (correctedEsgScore >= 90) esgTier = 'Platinum';
  else if (correctedEsgScore >= 75) esgTier = 'Gold';
  else if (correctedEsgScore >= 60) esgTier = 'Silver';
  else if (correctedEsgScore >= 45) esgTier = 'Bronze';
  else esgTier = 'Needs Improvement';

  mockVendors.push({
    id: tempId,
    name: vendorName,
    category: base.category,
    tier,
    country: base.country,
    state: i % 2 === 0 ? 'CA' : 'TX',
    city: base.city,
    address: `Street Address ${i + 4}, Industrial Zone, ${base.city}`,
    website: `https://www.${base.name.toLowerCase().replace(/[^a-z]/g, '')}${iteration > 0 ? iteration : ''}.com`,
    phone: `+1 (${300 + (i % 10) * 15}) 555-0${100 + i}`,
    email: `${initials.toLowerCase()}@${base.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    taxId: base.taxId.substring(0, 4) + Math.floor(1000 + i * 29).toString() + base.taxId.substring(8, 11),
    registeredDate,
    onboardedBy: ['Alex Mercer', 'Elena Rostova', 'Deepak Nair'][i % 3],
    status,
    riskScore: Math.min(98, Math.max(5, riskScore)),
    contractValue: Number((contractValue).toFixed(2)),
    performanceScore: Math.min(100, Math.max(35, performanceScore)),
    lastReviewed: `2026-0${1 + (i % 5)}-12`,
    esgScore: correctedEsgScore,
    esgTier,
    logoInitials: initials,
    posCount: 2 + (i % 12)
  });
}

// 2. Purchase Orders (80 POs)
export const mockPurchaseOrders: PurchaseOrder[] = [];
const poStatuses: PurchaseOrder['status'][] = ['Approved', 'Sent', 'Received', 'Received', 'Pending Approval', 'Draft', 'Cancelled'];
const poPayments: PurchaseOrder['paymentStatus'][] = ['Paid', 'Paid', 'Processing', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid'];

for (let i = 0; i < 80; i++) {
  const vendor = mockVendors[i % mockVendors.length];
  const itemsCount = 1 + (i % 5);
  const unitPrice = 120 + ((i * 35) % 1500);
  const amount = Number((itemsCount * unitPrice * (4 + (i % 10) * 1.5)).toFixed(2));
  const progressMonth = 1 + (i % 5);
  const createdDate = `2026-0${progressMonth}-0${(i % 20) + 1}`;
  const requiredBy = `2026-0${progressMonth + 1}-15`;

  const status = poStatuses[i % poStatuses.length];
  const paymentStatus = status === 'Received' ? (i % 2 === 0 ? 'Paid' : 'Processing') : status === 'Sent' ? 'Unpaid' : poPayments[i % poPayments.length];

  const lineItems: PurchaseOrderLineItem[] = [];
  for (let j = 0; j < itemsCount; j++) {
    const qty = 5 + (j * 2) + (i % 4) * 5;
    const price = unitPrice * (j === 0 ? 1 : 0.85);
    const code = `ITEM-ID-${1000 + i + j}`;
    const desc = `${vendor.category} Standard Procurement Item ${j + 1}`;
    const disc = (i % 5 === 0) ? 5 : 0;
    const tax = 8;
    const sub = qty * price;
    const total = Number((sub * (1 - disc / 100) * (1 + tax / 100)).toFixed(2));
    lineItems.push({
      code,
      description: desc,
      qty,
      unit: 'Units',
      unitPrice: price,
      discount: disc,
      taxRate: tax,
      total
    });
  }

  mockPurchaseOrders.push({
    id: `PO-2026-${(1001 + i).toString().substring(1)}`,
    vendorId: vendor.id,
    vendorName: vendor.name,
    category: vendor.category,
    itemsCount,
    amount,
    createdDate,
    requiredBy,
    approvedBy: i % 4 === 0 ? 'Elena Rostova' : 'Alex Mercer',
    status,
    paymentStatus,
    title: `Procurement for ${vendor.category} Q${1 + (i % 2)} Operations`,
    paymentTerms: vendor.tier === 'Tier 1' ? 'Net 30' : 'Net 15',
    shipToAddress: `Building 4A, Warehouse Site, General Logistics Depot, SF`,
    priority: i % 10 === 0 ? 'Urgent' : i % 5 === 0 ? 'High' : 'Normal',
    notes: `This purchase order constitutes a release against corporate discount rates. Quality assurance files are mandatory.`,
    lineItems
  });
}

// 3. Contracts (40 Contracts)
export const mockContracts: Contract[] = [];
const contractTypes: Contract['type'][] = ['Framework', 'Service', 'NDA', 'MSA', 'SLA', 'Procurement', 'License', 'Lease'];
const contractStatuses: Contract['status'][] = ['Active', 'Active', 'Active', 'Expiring Soon', 'Draft', 'Expired', 'Terminated'];

for (let i = 0; i < 40; i++) {
  const vendor = mockVendors[i % mockVendors.length];
  const value = vendor.contractValue * 0.95;
  const startYear = 2025 - (i % 3);
  const endYear = 2026 + (i % 3 === 0 ? 0 : 1);
  const startDate = `${startYear}-0${1 + (i % 8)}-15`;
  const endDate = `${endYear}-0${1 + (i % 8)}-15`;

  const rawStat = contractStatuses[i % contractStatuses.length];
  let status = rawStat;
  const daysRemaining = Math.floor((new Date(endDate).getTime() - new Date('2026-06-06').getTime()) / (1000 * 60 * 60 * 24));
  if (daysRemaining < 0) {
    status = 'Expired';
  } else if (daysRemaining > 0 && daysRemaining < 60) {
    status = 'Expiring Soon';
  } else if (status === 'Expired' && daysRemaining > 0) {
    status = 'Active';
  }

  mockContracts.push({
    id: `CTR-20${26 - (i % 2)}-${(1001 + i).toString().substring(1)}`,
    title: `Master ${contractTypes[i % contractTypes.length]} Agreement - ${vendor.name}`,
    vendorId: vendor.id,
    vendorName: vendor.name,
    type: contractTypes[i % contractTypes.length],
    value: Number(value.toFixed(2)),
    startDate,
    endDate,
    daysRemaining,
    status,
    owner: ['Alex Mercer', 'Deepak Nair', 'Marcus Vance'][i % 3],
    autoRenew: i % 2 === 0,
    noticePeriod: '60 Days',
    governingLaw: i % 3 === 0 ? 'Delaware' : i % 3 === 1 ? 'United Kingdom' : 'Germany',
    specialTerms: `All SLA breaches carry a tiered 2.5% penalty rate. Support turn-around must adhere strictly to Exhibit B parameter controls.`,
    kpis: [
      { name: 'SLA Response Time', target: '< 4 Hours', frequency: 'Monthly', penalty: '2% Credit per Hour' },
      { name: 'On-Time Delivery', target: '>= 95%', frequency: 'Quarterly', penalty: '5% of Invoice Value' },
      { name: 'Defect Rate Threshold', target: '< 1.5%', frequency: 'Monthly', penalty: 'Return and Re-ship free' }
    ]
  });
}

// 4. Invoices (60 Invoices)
export const mockInvoices: Invoice[] = [];
const invoiceStatuses: Invoice['status'][] = ['Paid', 'Paid', 'Received', 'Under Review', 'Approved', 'Disputed', 'Overdue'];
for (let i = 0; i < 60; i++) {
  const po = mockPurchaseOrders[i % mockPurchaseOrders.length];
  const dueDay = (i % 28) + 1;
  const status = invoiceStatuses[i % invoiceStatuses.length];

  mockInvoices.push({
    id: `INV-2026-${(2001 + i).toString().substring(1)}`,
    vendorId: po.vendorId,
    vendorName: po.vendorName,
    poReference: po.id,
    invoiceDate: `2026-05-10`,
    dueDate: `2026-06-${dueDay < 10 ? '0' + dueDay : dueDay}`,
    amount: po.amount * 0.9,
    taxAmount: po.amount * 0.08,
    total: po.amount,
    status,
    paymentStatus: status === 'Paid' ? 'Paid' : status === 'Received' ? 'Processing' : 'Unpaid',
    matchingStatus: {
      po: true,
      grn: i % 7 !== 0,
      invoice: true
    },
    lineItems: po.lineItems.map(item => ({
      code: item.code,
      description: item.description,
      qty: item.qty,
      unit: item.unit,
      unitPrice: item.unitPrice,
      total: item.total
    }))
  });
}

// 5. Risk Assessments (30 Risk Assessments)
export const mockRiskAssessments: RiskAssessment[] = [];
const riskStatusLevels = ['Low', 'Medium', 'High', 'Critical'];
for (let i = 0; i < 30; i++) {
  const vendor = mockVendors[Math.floor(Math.min(49, (i * 1.5) % 50))];
  const scoreBase = vendor.riskScore;

  mockRiskAssessments.push({
    vendorId: vendor.id,
    vendorName: vendor.name,
    overallScore: scoreBase,
    financialScore: Math.min(100, Math.max(5, scoreBase + (i % 2 === 0 ? 5 : -5))),
    operationalScore: Math.min(100, Math.max(5, scoreBase + (i % 3 === 0 ? 8 : -8))),
    complianceScore: Math.min(100, Math.max(5, scoreBase + (i % 4 === 0 ? -12 : 4))),
    cyberScore: Math.min(100, Math.max(5, scoreBase + (i % 5 === 0 ? 15 : -4))),
    geopoliticalScore: Math.min(100, Math.max(5, scoreBase + (i % 2 === 0 ? -3 : 9))),
    lastAssessed: `2026-0${1 + i % 5}-18`,
    riskTrend: i % 3 === 0 ? 'Improving' : i % 3 === 1 ? 'Stable' : 'Deteriorating',
    recommendations: `Conduct deep quarter audits on compliance records. Enable strict multi-factor authentication controls on integration portals.`,
    details: {
      financial: {
        creditRating: i % 3 === 0 ? 'AA+' : i % 3 === 1 ? 'A-' : 'BBB',
        stability: Math.min(5, Math.ceil(scoreBase / 20)),
        years: 5 + (i % 15),
        public: i % 2 === 0,
        litigation: i % 7 === 0
      },
      operational: {
        singleSource: i % 5 === 0,
        geoConcentration: vendor.country,
        drPlan: i % 4 !== 0,
        keyDependency: i % 3 === 0 ? 'Low' : i % 3 === 1 ? 'Medium' : 'High',
        capacity: 70 + (i % 25)
      },
      compliance: {
        certs: i % 3 === 0 ? ['ISO 9001', 'ISO 27001'] : ['SOC 2', 'GDPR'],
        violations: i % 8 === 0,
        antiBribery: i % 9 !== 0,
        sanctions: 'Pass',
        labor: Math.min(5, Math.max(1, Math.ceil((100 - scoreBase) / 20)))
      },
      cyber: {
        dataAccess: i % 4 === 0 ? 'Critical' : i % 4 === 1 ? 'High' : 'Low',
        penTestDate: `2025-11-20`,
        encRest: i % 10 !== 0,
        encTransit: i % 12 !== 0,
        incidentPlan: i % 5 !== 0,
        mfa: i % 8 !== 0
      },
      geopolitical: {
        countries: vendor.country,
        sanctionedExposure: i % 15 === 0,
        politicalStability: 4,
        exportControls: i % 6 === 0
      }
    }
  });
}

// 6. Compliance Documents (50+ docs)
export const mockComplianceDocs: ComplianceDoc[] = [];
const docCategories = [
  'Business Registration Certificate',
  'Certificate of Insurance',
  'W-9 / TAX Form',
  'Non-Disclosure Agreement (NDA)',
  'SOC 2 Report',
  'ISO 27001 Certificate',
  'GDPR Compliance Statement'
];

for (let i = 0; i < 55; i++) {
  const vendor = mockVendors[i % mockVendors.length];
  const cat = docCategories[i % docCategories.length];
  const expiryYear = i % 5 === 0 ? 2026 : 2027;
  const expiryMonth = `0${1 + (i % 11)}`;
  const status = expiryYear === 2026 && Number(expiryMonth) < 6 ? 'Expired' : Number(expiryMonth) < 8 ? 'Expiring' : 'Active';

  mockComplianceDocs.push({
    id: `DOC-2026-${(1001 + i).toString().substring(1)}`,
    name: `${vendor.logoInitials}_${cat.replace(/[^A-Z0-9]/gi, '_')}.pdf`,
    vendorId: vendor.id,
    vendorName: vendor.name,
    category: cat,
    uploadDate: `2025-06-12`,
    expiryDate: `${expiryYear}-${expiryMonth}-15`,
    status,
    verifiedBy: 'Sarah Jenkins',
    fileSize: `${1.2 + (i % 4) * 0.9} MB`
  });
}

// 7. Payments (30 payments)
export const mockPayments: Payment[] = [];
const payStatuses: Payment['status'][] = ['Completed', 'Completed', 'Scheduled', 'Processing', 'Failed', 'On Hold'];
for (let i = 0; i < 30; i++) {
  const inv = mockInvoices[i % mockInvoices.length];
  mockPayments.push({
    id: `PAY-2026-${(3001 + i).toString().substring(1)}`,
    vendorId: inv.vendorId,
    vendorName: inv.vendorName,
    invoiceRef: inv.id,
    amount: inv.total,
    currency: 'USD',
    method: ['Bank Transfer', 'ACH', 'Wire', 'Check'][i % 4] as Payment['method'],
    scheduledDate: `2026-06-15`,
    processedDate: i % 3 === 0 ? `2026-06-02` : '',
    status: payStatuses[i % payStatuses.length],
    referenceNumber: `TXN-${100000 + i * 2831}`
  });
}

// 8. Savings Initiatives YTD (18 initiatives)
export const mockSavingsInitiatives: SavingsInitiative[] = [
  {
    id: 'SAV-001',
    title: 'Consulting Rates Optimization',
    category: 'Consulting',
    vendorId: 'VND-006',
    vendorName: 'Summit Consulting Inc',
    type: 'Negotiation',
    baselineCost: 450000,
    negotiatedCost: 380000,
    amount: 70000,
    percentage: 15.56,
    recurring: 'Recurring',
    annualizedValue: 70000,
    notes: 'Volumetric discount rate on business strategy advisory modules negotiated at year end.',
    status: 'Realized',
    owner: 'Alex Mercer',
    targetDate: '2026-04-10',
    verified: true,
    verifiedBy: 'Marcus Vance'
  },
  {
    id: 'SAV-002',
    title: 'Server Hosting Volume Discount',
    category: 'IT Services',
    vendorId: 'VND-001',
    vendorName: 'Apex Technologies Ltd',
    type: 'Volume Discount',
    baselineCost: 1200000,
    negotiatedCost: 950000,
    amount: 250000,
    percentage: 20.83,
    recurring: 'Recurring',
    annualizedValue: 250000,
    notes: 'Bulk datacenter reserve instances combined with secondary cloud workspace agreements.',
    status: 'Realized',
    owner: 'Marcus Vance',
    targetDate: '2026-05-15',
    verified: true,
    verifiedBy: 'Elena Rostova'
  },
  {
    id: 'SAV-003',
    title: 'Warehouse Rent Reduction Plan',
    category: 'Logistics',
    vendorId: 'VND-002',
    vendorName: 'GlobalTrade GmbH',
    type: 'Demand Reduction',
    baselineCost: 850000,
    negotiatedCost: 730000,
    amount: 120000,
    percentage: 14.12,
    recurring: 'Recurring',
    annualizedValue: 120000,
    notes: 'Consolidated three regional transit lockers into a strategic Munich distribution grid.',
    status: 'Projected',
    owner: 'Alex Mercer',
    targetDate: '2026-09-30',
    verified: false
  }
];

// Fill up to 18 savings initiatives
for (let i = 3; i < 18; i++) {
  const vendor = mockVendors[i * 2 % mockVendors.length];
  const bas = 150000 + (i * 23512) % 300000;
  const saving = bas * (0.05 + (i % 10) * 0.02);
  const neg = bas - saving;
  const type = ['Negotiation', 'Volume Discount', 'Process', 'Demand Reduction'][i % 4] as SavingsInitiative['type'];
  const status = ['Realized', 'Projected', 'Pipeline', 'On Hold'][i % 4] as SavingsInitiative['status'];

  mockSavingsInitiatives.push({
    id: `SAV-${(100 + i + 1).toString().substring(1)}`,
    title: `${vendor.category} Core Efficiency Initiative ${i}`,
    category: vendor.category,
    vendorId: vendor.id,
    vendorName: vendor.name,
    type,
    baselineCost: Number(bas.toFixed(2)),
    negotiatedCost: Number(neg.toFixed(2)),
    amount: Number(saving.toFixed(2)),
    percentage: Number((saving / bas * 100).toFixed(2)),
    recurring: i % 2 === 0 ? 'Recurring' : 'One-Time',
    annualizedValue: Number((i % 2 === 0 ? saving : 0).toFixed(2)),
    notes: `Negotiated alternative supply options based on dynamic price schedules.`,
    status,
    owner: ['Alex Mercer', 'Marcus Vance', 'Deepak Nair'][i % 3],
    targetDate: `2026-08-${10 + i % 15}`,
    verified: status === 'Realized',
    verifiedBy: status === 'Realized' ? 'Marcus Vance' : undefined
  });
}

// 9. Calendar Events (20 Events)
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'EVT-001',
    title: 'Apex Technologies SLA Review',
    type: 'Review Meeting',
    vendorId: 'VND-001',
    vendorName: 'Apex Technologies Ltd',
    entityId: 'VND-001',
    date: '2026-06-10',
    allDay: false,
    startTime: '10:00',
    endTime: '11:30',
    remindMe: '1 day before',
    assignTo: ['Alex Mercer'],
    notes: 'Monthly compliance and active tickets sweep with vendor manager Hans Gruber.'
  },
  {
    id: 'EVT-002',
    title: 'GlobalTrade GmbH Lease Expiring',
    type: 'Contract Renewal',
    vendorId: 'VND-002',
    vendorName: 'GlobalTrade GmbH',
    entityId: 'CTR-2025-1002',
    date: '2026-06-14',
    allDay: true,
    remindMe: '1 month before',
    assignTo: ['Alex Mercer', 'Elena Rostova'],
    notes: 'Renewal action mandatory before automatic trigger lockout.'
  },
  {
    id: 'EVT-003',
    title: 'Quarterly Risk Review',
    type: 'Risk Assessment',
    vendorId: 'VND-004',
    vendorName: 'NovaStar Logistics',
    entityId: 'VND-004',
    date: '2026-06-15',
    allDay: false,
    startTime: '14:00',
    endTime: '15:30',
    remindMe: '3 days before',
    assignTo: ['Sarah Jenkins'],
    notes: 'Geopolitical and operational safety analysis.'
  },
  {
    id: 'EVT-004',
    title: 'W-9 Document Expiry VND-007',
    type: 'Document Expiry',
    vendorId: 'VND-007',
    vendorName: 'Vanguard Industrial',
    entityId: 'DOC-2026-1003',
    date: '2026-06-15',
    allDay: true,
    remindMe: '1 week before',
    assignTo: ['Sarah Jenkins'],
    notes: 'Vendor needs to upload standard signed replacement certificate.'
  },
  {
    id: 'EVT-005',
    title: 'Materials PO Delivery - Matrix',
    type: 'PO Delivery',
    vendorId: 'VND-017',
    vendorName: 'Matrix Materials & Iron',
    entityId: 'PO-2026-1033',
    date: '2026-06-18',
    allDay: true,
    remindMe: '1 day before',
    assignTo: ['Alex Mercer'],
    notes: 'Arrival scheduled at northern warehouse loading bay.'
  }
];

// Expand calendar events to 20
for (let i = 5; i < 22; i++) {
  const vendor = mockVendors[i * 3 % mockVendors.length];
  const types = [
    'Contract Renewal', 'Payment Due', 'Document Expiry', 'Review Meeting',
    'Audit Date', 'Onboarding Deadline', 'PO Delivery', 'Risk Assessment'
  ] as CalendarEvent['type'][];
  const type = types[i % types.length];

  mockCalendarEvents.push({
    id: `EVT-${(100 + i).toString().substring(1)}`,
    title: `${vendor.logoInitials} ${type} Task`,
    type,
    vendorId: vendor.id,
    vendorName: vendor.name,
    entityId: vendor.id,
    date: `2026-06-${(10 + i % 18).toString().padStart(2, '0')}`,
    allDay: i % 2 === 0,
    startTime: i % 2 === 1 ? '11:00' : undefined,
    endTime: i % 2 === 1 ? '12:00' : undefined,
    remindMe: '3 days before',
    assignTo: ['Alex Mercer'],
    notes: 'Follow-up actions on pending enterprise accounts.'
  });
}

// 10. RFQs (8 RFQs)
export const mockRFQs: RFQ[] = [
  {
    id: 'RFQ-2026-001',
    title: 'Cloud Datacenter Expansion 2026',
    category: 'IT Services',
    vendorsInvitedCount: 4,
    responsesReceivedCount: 3,
    deadline: '2026-06-30',
    status: 'Review Underway',
    createdBy: 'Alex Mercer',
    description: 'We are seeking proposals for server farm clusters with low operational carbon footprints.',
    deliveryDate: '2026-09-01',
    budgetEstimate: 1500000,
    ndaRequired: true,
    confidentialityLevel: 'Confidential',
    clarificationsAllowed: true,
    evaluationCriteria: [
      { criterion: 'Price', weight: 40 },
      { criterion: 'Technical Capability', weight: 30 },
      { criterion: 'Delivery Time', weight: 15 },
      { criterion: 'Quality', weight: 15 }
    ],
    invitedVendors: ['VND-001', 'VND-005', 'VND-013', 'VND-022'],
    lineItems: [
      { code: 'SV-CLUSTER-01', description: 'Enterprise Compute Instance with GPU capacity', qty: 120, unit: 'Nodes', specifications: 'Minimum 99.99% uptime SLA required' },
      { code: 'SV-STOR-99', description: 'SSD Backup Array Redundant Tier 1', qty: 45, unit: 'Units', specifications: 'Encrypted at rest AES-256' }
    ],
    terms: 'Payment terms net 30 upon successful acceptance testing.',
    responses: [
      {
        vendorId: 'VND-001',
        vendorName: 'Apex Technologies Ltd',
        scores: [
          { criterion: 'Price', score: 85 },
          { criterion: 'Technical Capability', score: 95 },
          { criterion: 'Delivery Time', score: 90 },
          { criterion: 'Quality', score: 92 }
        ],
        weightedScore: 89.8,
        totalBidAmount: 1420000,
        onTimeDeliveryPromise: 'Within 45 Days',
        warrantyMonths: 36,
        notes: 'Includes full active redundant setup on backup circuits gratis.'
      },
      {
        vendorId: 'VND-005',
        vendorName: 'ClearPath IT Solutions',
        scores: [
          { criterion: 'Price', score: 92 },
          { criterion: 'Technical Capability', score: 80 },
          { criterion: 'Delivery Time', score: 85 },
          { criterion: 'Quality', score: 84 }
        ],
        weightedScore: 86.1,
        totalBidAmount: 1280000,
        onTimeDeliveryPromise: 'Within 60 Days',
        warrantyMonths: 24,
        notes: 'Direct connection nodes available instantly upon execution.'
      }
    ]
  }
];

// Fill remaining RFQs up to 8
const rfqCategories = ['Logistics', 'Marketing', 'Consulting', 'Raw Materials', 'Facilities', 'Legal', 'HR Services'];
for (let i = 1; i < 8; i++) {
  const cat = rfqCategories[i % rfqCategories.length];
  mockRFQs.push({
    id: `RFQ-2026-00${i + 1}`,
    title: `Regional ${cat} RFP Request`,
    category: cat,
    vendorsInvitedCount: 3,
    responsesReceivedCount: i % 2 === 0 ? 0 : 2,
    deadline: `2026-07-20`,
    status: i % 3 === 0 ? 'Draft' : i % 3 === 1 ? 'Active' : 'Closed',
    createdBy: 'Alex Mercer',
    description: `Enterprise solicitation for regional services support and strategic alignments.`,
    deliveryDate: `2026-10-15`,
    evaluationCriteria: [
      { criterion: 'Price', weight: 50 },
      { criterion: 'Quality', weight: 30 },
      { criterion: 'Delivery Time', weight: 20 }
    ],
    invitedVendors: ['VND-002', 'VND-003', 'VND-004'],
    lineItems: [
      { code: `RFQ-ITEM-${i}`, description: `Standard general procurement deliverables.`, qty: 1000, unit: 'Units', specifications: 'Full standards compliance check required.' }
    ],
    terms: 'Full NDA check critical.',
    confidentialityLevel: 'Internal',
    ndaRequired: i % 2 === 0,
    clarificationsAllowed: true
  });
}

// 11. Activity Logs (105 entries)
export const mockActivityLogs: ActivityLog[] = [];
const logActions = [
  'Vendor Screen Checked', 'Purchase Order Approved', 'Contract Signed', 'Invoice Paid Status',
  'Compliance File Uploaded', 'Risk Rating Configured', 'Access Granted Audit', 'Workflow Modified'
];
const logModules = ['Vendors', 'PO', 'Contracts', 'Risk', 'Compliance', 'Finance', 'System'];

for (let i = 0; i < 110; i++) {
  const user = mockUsers[i % mockUsers.length];
  const mod = logModules[i % logModules.length];
  const act = logActions[i % logActions.length];
  const dateOffset = Math.floor(i / 10);
  const hourOffset = i % 24;

  mockActivityLogs.push({
    id: `LOG-2026-${(100001 + i).toString().substring(1)}`,
    timestamp: `2026-06-${(6 - dateOffset > 0 ? 6 - dateOffset : 1).toString().padStart(2, '0')} ${hourOffset.toString().padStart(2, '0')}:14`,
    user: user.name,
    role: user.role,
    ipAddress: `192.168.12.${34 + (i % 200)}`,
    module: mod,
    action: act,
    entityId: i % 2 === 0 ? `VND-00${1 + i % 49}` : `PO-2026-00${1 + i % 79}`,
    description: `${user.name} systematically performed standard '${act}' procedure inside panel: ${mod}.`,
    status: i % 15 === 0 ? 'Failed' : 'Success',
    beforeAfter: {
      before: { status: 'Draft', revised: false, checkedBy: user.name },
      after: { status: 'Approved', revised: true, codeCheck: 'Passed' }
    }
  });
}

// 12. Spend Monthly Trend Data (12 Months - Jan-Dec)
export const spendTrendData = [
  { month: 'Jan', Spend: 3200000, Budget: 3500000, IT: 1100000, Materials: 900000, Logistics: 400000, Consulting: 300000, Marketing: 200000, Facilities: 200000, Legal: 50000, HR: 50000 },
  { month: 'Feb', Spend: 3400000, Budget: 3500000, IT: 1200000, Materials: 900000, Logistics: 500000, Consulting: 350000, Marketing: 150000, Facilities: 200000, Legal: 54000, HR: 46000 },
  { month: 'Mar', Spend: 3700000, Budget: 3600000, IT: 1400000, Materials: 950000, Logistics: 520000, Consulting: 380000, Marketing: 180000, Facilities: 180000, Legal: 45000, HR: 45000 },
  { month: 'Apr', Spend: 4100000, Budget: 4000000, IT: 1600000, Materials: 1050000, Logistics: 600000, Consulting: 410000, Marketing: 160000, Facilities: 190000, Legal: 45000, HR: 45000 },
  { month: 'May', Spend: 4200000, Budget: 4000000, IT: 1650000, Materials: 1100000, Logistics: 620000, Consulting: 420000, Marketing: 150000, Facilities: 170000, Legal: 45000, HR: 45000 },
  { month: 'Jun', Spend: 4400000, Budget: 4200000, IT: 1800000, Materials: 1120000, Logistics: 650000, Consulting: 390000, Marketing: 170000, Facilities: 185000, Legal: 45000, HR: 40000 },
  { month: 'Jul', Spend: 3900000, Budget: 4200000, IT: 1500000, Materials: 1050000, Logistics: 580000, Consulting: 320000, Marketing: 160000, Facilities: 200000, Legal: 45500, HR: 44500 },
  { month: 'Aug', Spend: 3850000, Budget: 4200000, IT: 1450000, Materials: 1020000, Logistics: 570000, Consulting: 310000, Marketing: 210000, Facilities: 200000, Legal: 45000, HR: 45000 },
  { month: 'Sep', Spend: 4320000, Budget: 4400000, IT: 1700000, Materials: 1180000, Logistics: 640000, Consulting: 360000, Marketing: 160000, Facilities: 200000, Legal: 40000, HR: 40000 },
  { month: 'Oct', Spend: 4550000, Budget: 4500000, IT: 1850000, Materials: 1250000, Logistics: 660000, Consulting: 350000, Marketing: 180000, Facilities: 180000, Legal: 40000, HR: 40000 },
  { month: 'Nov', Spend: 4800000, Budget: 4600000, IT: 2000000, Materials: 1280000, Logistics: 700000, Consulting: 380000, Marketing: 170000, Facilities: 190000, Legal: 40000, HR: 40000 },
  { month: 'Dec', Spend: 5120000, Budget: 4800000, IT: 2100000, Materials: 1350000, Logistics: 780000, Consulting: 420000, Marketing: 180000, Facilities: 210000, Legal: 40000, HR: 40000 }
];

// Savings vs Target YTD
export const savingsTrendData = [
  { month: 'Jan', Actual: 110000, Target: 154000 },
  { month: 'Feb', Actual: 140000, Target: 154000 },
  { month: 'Mar', Actual: 165000, Target: 154000 },
  { month: 'Apr', Actual: 180000, Target: 154000 },
  { month: 'May', Actual: 210000, Target: 154000 },
  { month: 'Jun', Actual: 184000, Target: 154000 },
  { month: 'Jul', Actual: 195000, Target: 154000 },
  { month: 'Aug', Actual: 220000, Target: 154000 },
  { month: 'Sep', Actual: 170000, Target: 154000 },
  { month: 'Oct', Actual: 160000, Target: 154000 },
  { month: 'Nov', Actual: 205000, Target: 154000 },
  { month: 'Dec', Actual: 230000, Target: 154000 }
];

// Price variance trend
export const priceVarianceData = [
  { month: 'Jan', variance: -1.2 },
  { month: 'Feb', variance: -0.8 },
  { month: 'Mar', variance: 0.1 },
  { month: 'Apr', variance: -1.5 },
  { month: 'May', variance: -2.1 },
  { month: 'Jun', variance: -1.9 },
  { month: 'Jul', variance: -1.4 },
  { month: 'Aug', variance: -1.0 },
  { month: 'Sep', variance: -2.3 },
  { month: 'Oct', variance: -2.5 },
  { month: 'Nov', variance: -2.0 },
  { month: 'Dec', variance: -2.1 }
];
