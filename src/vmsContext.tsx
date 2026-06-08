import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Vendor,
  PurchaseOrder,
  Contract,
  Invoice,
  RiskAssessment,
  ComplianceDoc,
  User,
  ActivityLog,
  Payment,
  SavingsInitiative,
  CalendarEvent,
  RFQ,
  BatchPayment,
  RegistryItem
} from './types';
import {
  mockVendors as initialVendors,
  mockPurchaseOrders as initialPurchaseOrders,
  mockContracts as initialContracts,
  mockInvoices as initialInvoices,
  mockRiskAssessments as initialRiskAssessments,
  mockComplianceDocs as initialComplianceDocs,
  mockUsers as initialUsers,
  mockActivityLogs as initialActivityLogs,
  mockPayments as initialPayments,
  mockSavingsInitiatives as initialSavingsInitiatives,
  mockCalendarEvents as initialCalendarEvents,
  mockRFQs as initialRFQs,
  mockBatchPayments as initialBatchPayments,
  mockRegistryItems as initialRegistryItems
} from './mockData';

export type CurrentPage =
  | 'dashboard'
  | 'vendors'
  | 'vendor-detail'
  | 'onboarding'
  | 'batch-payments'

  | 'performance'
  | 'items-registry'
  | 'purchase-orders'
  | 'rfq'
  | 'contracts'
  | 'invoices'
  | 'risk'
  | 'compliance'
  | 'audit-logs'
  | 'payments'
  | 'spend-analytics'
  | 'users'
  | 'settings'
  | 'compare'
  | 'savings'
  | 'calendar'
  | 'esg';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
}

interface VMSContextType {
  // Page states
  currentPage: CurrentPage;
  setCurrentPage: (page: CurrentPage) => void;
  selectedVendorId: string | null;
  setSelectedVendorId: (id: string | null) => void;

  // Search results globally
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Data states
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  riskAssessments: RiskAssessment[];
  setRiskAssessments: React.Dispatch<React.SetStateAction<RiskAssessment[]>>;
  complianceDocs: ComplianceDoc[];
  setComplianceDocs: React.Dispatch<React.SetStateAction<ComplianceDoc[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  batchPayments: BatchPayment[];
  setBatchPayments: React.Dispatch<React.SetStateAction<BatchPayment[]>>;
  savingsInitiatives: SavingsInitiative[];
  setSavingsInitiatives: React.Dispatch<React.SetStateAction<SavingsInitiative[]>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  rfqs: RFQ[];
  setRfqs: React.Dispatch<React.SetStateAction<RFQ[]>>;
  itemsRegistry: RegistryItem[];
  setItemsRegistry: React.Dispatch<React.SetStateAction<RegistryItem[]>>;

  // Actions
  addVendor: (vendor: Omit<Vendor, 'id'>) => Vendor;
  updateVendor: (vendor: Vendor) => void;
  removeVendor: (id: string) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => PurchaseOrder;
  updatePurchaseOrder: (po: PurchaseOrder) => void;
  addContract: (contract: Omit<Contract, 'id'>) => Contract;
  updateContract: (contract: Contract) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Invoice;
  updateInvoice: (invoice: Invoice) => void;
  addRiskAssessment: (assessment: RiskAssessment) => void;
  addComplianceDoc: (doc: Omit<ComplianceDoc, 'id'>) => ComplianceDoc;
  updateComplianceDoc: (id: string, updates: Partial<ComplianceDoc>) => void;
  addUser: (user: Omit<User, 'id'>) => User;
  addActivityLog: (module: string, action: string, entityId: string, description: string, status?: 'Success' | 'Failed') => void;
  addPayment: (payment: Omit<Payment, 'id'>) => Payment;
  addBatchPayment: (batch: Omit<BatchPayment, 'id' | 'createdAt' | 'status'>) => BatchPayment;
  updateBatchStatus: (id: string, status: BatchPayment['status']) => void;
  addSavingsInitiative: (init: Omit<SavingsInitiative, 'id'>) => SavingsInitiative;
  addCalendarEvent: (evt: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  addRFQ: (rfq: Omit<RFQ, 'id'>) => RFQ;
  updateRFQ: (rfq: RFQ) => void;

  // Comparison State
  comparedVendors: string[]; // Vendor IDs
  toggleCompareVendor: (id: string) => void;
  clearComparedVendors: () => void;

  // Modals state
  cmdPaletteOpen: boolean;
  setCmdPaletteOpen: (open: boolean) => void;
  notificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;

  // Theme support
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, description: string) => void;
  removeToast: (id: string) => void;
}

const VMSContext = createContext<VMSContextType | undefined>(undefined);

export const VMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('dashboard');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Domain states
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(initialRiskAssessments);
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDoc[]>(initialComplianceDocs);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [batchPayments, setBatchPayments] = useState<BatchPayment[]>(initialBatchPayments);
  const [savingsInitiatives, setSavingsInitiatives] = useState<SavingsInitiative[]>(initialSavingsInitiatives);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [rfqs, setRfqs] = useState<RFQ[]>(initialRFQs);
  const [itemsRegistry, setItemsRegistry] = useState<RegistryItem[]>(initialRegistryItems);

  const [comparedVendors, setComparedVendors] = useState<string[]>([]);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // Theme support: Read from localStorage or default to true for High Density look
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('vms-dark-mode');
    if (saved === null) return true;
    return saved === 'true';
  });

  const toggleDarkMode = (dark: boolean) => {
    setDarkMode(dark);
    localStorage.setItem('vms-dark-mode', String(dark));
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toast systems
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error' | 'info', title: string, description: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivityLogInternal = (module: string, action: string, entityId: string, description: string, status: 'Success' | 'Failed' = 'Success') => {
    const newLog: ActivityLog = {
      id: `LOG-2026-${(100111 + activityLogs.length).toString()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: 'Alex Mercer',
      role: 'Procurement Manager',
      ipAddress: '192.168.12.105',
      module,
      action,
      entityId,
      description,
      status
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const toggleCompareVendor = (id: string) => {
    setComparedVendors((prev) => {
      if (prev.includes(id)) {
        return prev.filter((vId) => vId !== id);
      }
      if (prev.length >= 4) {
        addToast('error', 'Limit Reached', 'You can compare up to 4 vendors side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearComparedVendors = () => setComparedVendors([]);

  // Business Action Creators
  const addVendor = (vendorData: Omit<Vendor, 'id'>): Vendor => {
    const newId = `VND-${(1001 + vendors.length).toString()}`;
    const newVendor: Vendor = { ...vendorData, id: newId };
    setVendors((prev) => [newVendor, ...prev]);
    addActivityLogInternal('Vendors', 'Vendor Registered', newId, `Registered new vendor: ${newVendor.name}`);
    addToast('success', 'Vendor Onboarded', `${newVendor.name} successfully submitted for integration approval.`);
    return newVendor;
  };

  const updateVendor = (updated: Vendor) => {
    setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    addActivityLogInternal('Vendors', 'Vendor Updated', updated.id, `Modified specifications for: ${updated.name}`);
    addToast('success', 'Vendor Profile Saved', `Completed updates for ${updated.name}`);
  };

  const removeVendor = (id: string) => {
    const target = vendors.find(v => v.id === id);
    setVendors((prev) => prev.filter((v) => v.id !== id));
    addActivityLogInternal('Vendors', 'Vendor Deactivated', id, `Removed/Deactivated vendor node: ${target?.name || id}`);
    addToast('info', 'Vendor Removed', 'The target vendor node has been deactivated.');
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>): PurchaseOrder => {
    const newId = `PO-2026-${(1001 + purchaseOrders.length).toString()}`;
    const newPO: PurchaseOrder = { ...poData, id: newId };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    addActivityLogInternal('PO', 'Purchase Order Created', newId, `Authorized PO draft: ${newPO.title}`);
    addToast('success', 'PO Draft Created', `Successfully generated item sheets for invoice matching.`);
    return newPO;
  };

  const updatePurchaseOrder = (updated: PurchaseOrder) => {
    setPurchaseOrders((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addActivityLogInternal('PO', 'Purchase Order Modified', updated.id, `Status update on purchase ledger to: ${updated.status}`);
    addToast('success', 'Purchase Order Updated', `${updated.id} status modified successfully to ${updated.status}.`);
  };

  const addContract = (contractData: Omit<Contract, 'id'>): Contract => {
    const newId = `CTR-2026-${(1001 + contracts.length).toString()}`;
    const newContract: Contract = { ...contractData, id: newId };
    setContracts((prev) => [newContract, ...prev]);
    addActivityLogInternal('Contracts', 'Contract Drafted', newId, `Set MSA agreement draft: ${newContract.title}`);
    addToast('success', 'Contract Agreement Sent', `The SLA covenants are updated and dispatched for signatures.`);
    return newContract;
  };

  const updateContract = (updated: Contract) => {
    setContracts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    addActivityLogInternal('Contracts', 'Contract Modified', updated.id, `Revised legal terms parameters on index`);
    addToast('success', 'Contract Updated', `${updated.id} details locked on index.`);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id'>): Invoice => {
    const newId = `INV-2026-${(2001 + invoices.length).toString()}`;
    const newInvoice: Invoice = { ...invoiceData, id: newId };
    setInvoices((prev) => [newInvoice, ...prev]);
    addActivityLogInternal('Finance', 'Invoice Filed', newId, `Received billing slip matching PO ref: ${newInvoice.poReference}`);
    addToast('success', 'Billing Document Indexed', `Received $${newInvoice.total.toLocaleString()} invoice.`);
    return newInvoice;
  };

  const updateInvoice = (updated: Invoice) => {
    setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    addActivityLogInternal('Finance', 'Invoice Updated', updated.id, `Adjusted payment status of invoice ledger.`);
    addToast('success', 'Invoice Updated', `${updated.id} ledger balance synchronized.`);
  };

  const addRiskAssessment = (assessment: RiskAssessment) => {
    setRiskAssessments((prev) => [assessment, ...prev.filter(a => a.vendorId !== assessment.vendorId)]);
    
    // Also trigger update riskScore on that vendor!
    setVendors(vPrev => vPrev.map(v => v.id === assessment.vendorId ? { ...v, riskScore: assessment.overallScore } : v));

    addActivityLogInternal('Risk', 'Risk Assessment Filed', assessment.vendorId, `Completed full scoring audit matrices.`);
    addToast('success', 'Security Assessment Compiled', `Security scorecard locked for ${assessment.vendorName}.`);
  };

  const addComplianceDoc = (docData: Omit<ComplianceDoc, 'id'>): ComplianceDoc => {
    const newId = `DOC-2026-${(1001 + complianceDocs.length).toString()}`;
    const newDoc: ComplianceDoc = { ...docData, id: newId };
    setComplianceDocs((prev) => [newDoc, ...prev]);
    addActivityLogInternal('Compliance', 'Compliance Upload', newId, `Cataloged external cert document: ${newDoc.name}`);
    addToast('success', 'Certificate Cataloged', `Successfully archived file in general index.`);
    return newDoc;
  };

  const updateComplianceDoc = (id: string, updates: Partial<ComplianceDoc>) => {
    setComplianceDocs((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    addActivityLogInternal('Compliance', 'Compliance Updated', id, `Updated audit checkpoint`);
    addToast('success', 'Document Checkpoint Complete', `Approved status locked.`);
  };

  const addUser = (userData: Omit<User, 'id'>): User => {
    const newId = `USR-${(101 + users.length).toString()}`;
    const newUser: User = { ...userData, id: newId };
    setUsers((prev) => [...prev, newUser]);
    addActivityLogInternal('System', 'User Authorized', newId, `Granted explicit access privileges: ${newUser.name}`);
    addToast('success', 'Account Authorized', `Invitations to join dispatch grid sent to ${newUser.email}`);
    return newUser;
  };

  const addPayment = (paymentData: Omit<Payment, 'id'>): Payment => {
    const newId = `PAY-2026-${(3001 + payments.length).toString()}`;
    const newPayment: Payment = { ...paymentData, id: newId };
    setPayments((prev) => [newPayment, ...prev]);

    // Also update invoice pay status
    setInvoices(iPrev => iPrev.map(inv => inv.id === newPayment.invoiceRef ? { ...inv, status: 'Paid', paymentStatus: 'Paid' } : inv));

    addActivityLogInternal('Finance', 'Payment Dispatched', newId, `Forwarded balance clearance voucher.`);
    addToast('success', 'ACH Voucher Locked', `Payment for invoice references approved.`);
    return newPayment;
  };

  const addBatchPayment = (batchData: Omit<BatchPayment, 'id' | 'createdAt' | 'status'>): BatchPayment => {
    const newId = `BAT-2026-${(1001 + batchPayments.length).toString().substring(1)}`;
    const newBatch: BatchPayment = {
      ...batchData,
      id: newId,
      status: 'Pending Approval',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBatchPayments((prev) => [newBatch, ...prev]);

    // Update selected invoices status to Paid
    setInvoices(iPrev => iPrev.map(inv => newBatch.invoiceRefs.includes(inv.id) ? { ...inv, status: 'Paid', paymentStatus: 'Paid' } : inv));

    addActivityLogInternal('Finance', 'Batch Payment Scheduled', newId, `Scheduled batch clearance voucher for ${newBatch.invoiceRefs.length} invoices.`);
    addToast('success', 'Batch Payment Created', `Batch payment ${newId} with amount $${newBatch.totalAmount.toLocaleString()} has been scheduled.`);
    return newBatch;
  };

  const updateBatchStatus = (id: string, status: BatchPayment['status']) => {
    setBatchPayments(prev => prev.map(batch => batch.id === id ? { ...batch, status } : batch));
    
    // If completed or processing, we make sure the related invoices are marked accordingly
    if (status === 'Completed') {
      const batch = batchPayments.find(b => b.id === id);
      if (batch) {
        setInvoices(iPrev => iPrev.map(inv => batch.invoiceRefs.includes(inv.id) ? { ...inv, status: 'Paid', paymentStatus: 'Paid' } : inv));
      }
    }

    addActivityLogInternal('Finance', 'Batch Status Updated', id, `Updated batch status to ${status}.`);
    addToast('info', 'Batch Status Updated', `Batch payment ${id} updated to ${status}.`);
  };

  const addSavingsInitiative = (initData: Omit<SavingsInitiative, 'id'>): SavingsInitiative => {
    const newId = `SAV-${(101 + savingsInitiatives.length).toString().substring(1)}`;
    const newInit: SavingsInitiative = { ...initData, id: newId };
    setSavingsInitiatives((prev) => [newInit, ...prev]);
    addActivityLogInternal('Finance', 'Savings Logged', newId, `Approved strategic margin enhancement index.`);
    addToast('success', 'Savings Point Created', `Archived negotiated gains index.`);
    return newInit;
  };

  const addCalendarEvent = (evtData: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newId = `EVT-${(101 + calendarEvents.length).toString().substring(1)}`;
    const newEvt: CalendarEvent = { ...evtData, id: newId };
    setCalendarEvents((prev) => [...prev, newEvt]);
    addActivityLogInternal('System', 'Calendar Alert Locked', newId, `Set automated notifications trigger`);
    addToast('success', 'Event Trigger Scheduled', `Event: ${newEvt.title} logged beautifully on calendars.`);
    return newEvt;
  };

  const addRFQ = (rfqData: Omit<RFQ, 'id'>): RFQ => {
    const newId = `RFQ-2026-00${rfqs.length + 1}`;
    const newRfq: RFQ = { ...rfqData, id: newId };
    setRfqs((prev) => [newRfq, ...prev]);
    addActivityLogInternal('Contracts', 'RFQ Dispatched', newId, `Dispatched sourcing RFP requirements to ${newRfq.vendorsInvitedCount} vendors.`);
    addToast('success', 'RFP Dossier Dispatched', `Sourcing tenders published officially.`);
    return newRfq;
  };

  const updateRFQ = (updated: RFQ) => {
    setRfqs((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    addActivityLogInternal('Contracts', 'RFQ Modified', updated.id, `Status update on RFQ matching`);
  };

  const contextValue = useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      selectedVendorId,
      setSelectedVendorId,
      globalSearchQuery,
      setGlobalSearchQuery,
      vendors,
      setVendors,
      purchaseOrders,
      setPurchaseOrders,
      contracts,
      setContracts,
      invoices,
      setInvoices,
      riskAssessments,
      setRiskAssessments,
      complianceDocs,
      setComplianceDocs,
      users,
      setUsers,
      activityLogs,
      setActivityLogs,
      payments,
      setPayments,
      batchPayments,
      setBatchPayments,
      savingsInitiatives,
      setSavingsInitiatives,
      calendarEvents,
      setCalendarEvents,
      rfqs,
      setRfqs,
      itemsRegistry,
      setItemsRegistry,
      addVendor,
      updateVendor,
      removeVendor,
      addPurchaseOrder,
      updatePurchaseOrder,
      addContract,
      updateContract,
      addInvoice,
      updateInvoice,
      addRiskAssessment,
      addComplianceDoc,
      updateComplianceDoc,
      addUser,
      addActivityLog: addActivityLogInternal,
      addPayment,
      addBatchPayment,
      updateBatchStatus,
      addSavingsInitiative,
      addCalendarEvent,
      addRFQ,
      updateRFQ,
      comparedVendors,
      toggleCompareVendor,
      clearComparedVendors,
      cmdPaletteOpen,
      setCmdPaletteOpen,
      darkMode,
      setDarkMode: toggleDarkMode,
      toasts,
      addToast,
      removeToast,
      notificationPanelOpen,
      setNotificationPanelOpen
    }),
    [
      currentPage,
      selectedVendorId,
      globalSearchQuery,
      vendors,
      purchaseOrders,
      contracts,
      invoices,
      riskAssessments,
      complianceDocs,
      users,
      activityLogs,
      payments,
      batchPayments,
      savingsInitiatives,
      calendarEvents,
      rfqs,
      itemsRegistry,
      comparedVendors,
      cmdPaletteOpen,
      darkMode,
      toasts,
      notificationPanelOpen
    ]
  );

  return <VMSContext.Provider value={contextValue}>{children}</VMSContext.Provider>;
};

export const useVMS = () => {
  const context = useContext(VMSContext);
  if (!context) {
    throw new Error('useVMS must be used within a VMSProvider');
  }
  return context;
};
