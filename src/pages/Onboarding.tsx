import React, { useState } from 'react';
import { useVMS } from '../vmsContext';
import { CATEGORY_COLORS } from '../mockData';
import { Vendor } from '../types';
import {
  UserPlus,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Building,
  Upload,
  Calendar,
  DollarSign,
  Globe,
  Tag,
  ArrowRight,
  X,
  CheckCircle2,
  FolderOpen,
  User,
  Plus
} from 'lucide-react';

interface KanbanCard {
  id: string;
  vendorName: string;
  category: string;
  submitted: string;
  days: number;
  reviewer: string;
  progress: number;
  stage: number;
}

export const Onboarding: React.FC = () => {
  const { vendors, addVendor } = useVMS();

  // Kanban items state
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([
    { id: 'ONB-01', vendorName: 'Apex Technologies Ltd', category: 'IT Services', submitted: '2026-06-03', days: 3, reviewer: 'Alex Mercer', progress: 55, stage: 1 },
    { id: 'ONB-02', vendorName: 'NovaStar Logistics', category: 'Logistics', submitted: '2026-06-04', days: 2, reviewer: 'Elena Rostova', progress: 40, stage: 2 },
    { id: 'ONB-03', vendorName: 'GlobalTrade GmbH', category: 'Logistics', submitted: '2026-06-01', days: 5, reviewer: 'Sarah Jenkins', progress: 90, stage: 3 },
    { id: 'ONB-04', vendorName: 'Synergy Facilities', category: 'Facilities', submitted: '2026-06-05', days: 1, reviewer: 'Deepak Nair', progress: 10, stage: 0 },
    { id: 'ONB-05', vendorName: 'ClearPath IT', category: 'IT Services', submitted: '2026-05-30', days: 7, reviewer: 'Alex Mercer', progress: 75, stage: 4 }
  ]);

  // Form Wizard states
  const [formOpen, setFormOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form fields state
  const [formData, setFormData] = useState({
    companyName: '',
    tradingName: '',
    category: 'IT Services',
    tier: 'Tier 3' as Vendor['tier'],
    businessType: 'Corporation',
    country: '🇺🇸 United States',
    state: '',
    address: '',
    city: '',
    zip: '',
    website: '',
    established: '',
    employees: '',
    revenue: '$1M - $10M',
    description: '',
    // Secondary step
    contactFirstName: '',
    contactLastName: '',
    contactJobTitle: '',
    contactEmail: '',
    contactPhone: '',
    contactDept: '',
    // Step 3
    taxId: '',
    payTerms: 'Net 30',
    payMethod: 'Bank Transfer',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    creditLimit: '',
    currency: 'USD'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepNext = () => {
    if (activeStep === 1 && !formData.companyName) {
      alert('Company Legal Name is required to proceed.');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleStepPrev = () => {
    setActiveStep((prev) => prev - 1);
  };

  const executePipelineProgress = (id: string) => {
    setKanbanCards(prev => prev.map(card => {
      if (card.id === id) {
        const nextStage = Math.min(5, card.stage + 1);
        if (nextStage === 5) {
          // If fully onboarding, let's also commit it as a real active Vendor!
          addVendor({
            name: card.vendorName,
            category: card.category,
            tier: 'Tier 2',
            country: '🇺🇸 United States',
            state: 'CA',
            city: 'San Francisco',
            address: 'Corporate headquarters site',
            website: 'https://www.onboarded-partner.com',
            phone: '+1 555-1049',
            email: 'info@onboarded-partner.com',
            taxId: 'US-98273614',
            registeredDate: new Date().toISOString().substring(0, 10),
            onboardedBy: 'Alex Mercer',
            status: 'Active',
            riskScore: 28,
            contractValue: 500000,
            performanceScore: 84,
            lastReviewed: new Date().toISOString().substring(0, 10),
            esgScore: 78,
            esgTier: 'Gold',
            logoInitials: card.vendorName.substring(0, 2).toUpperCase()
          });
          return { ...card, stage: nextStage };
        }
        return { ...card, stage: nextStage, progress: nextStage * 20 };
      }
      return card;
    }).filter(card => card.stage < 5)); // Clean cards from pipeline once onboarded
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Commit to the actual global list of vendors
    const added = addVendor({
      name: formData.companyName,
      category: formData.category,
      tier: formData.tier,
      country: formData.country,
      state: formData.state || 'TX',
      city: formData.city || 'Dallas',
      address: formData.address || 'Registered central square site',
      website: formData.website || 'https://www.domain.com',
      phone: formData.contactPhone || '+1 555-0100',
      email: formData.contactEmail || 'supplier@email.com',
      taxId: formData.taxId || 'TAX-92813',
      registeredDate: new Date().toISOString().substring(0, 10),
      onboardedBy: 'Alex Mercer',
      status: 'Pending',
      riskScore: 35,
      contractValue: 0,
      performanceScore: 0,
      lastReviewed: 'Unassessed',
      esgScore: 60,
      esgTier: 'Silver',
      logoInitials: formData.companyName.substring(0, 2).toUpperCase()
    });

    // Also push to pipeline:
    setKanbanCards(prev => [
      ...prev,
      {
        id: `ONB-0${kanbanCards.length + 1}`,
        vendorName: added.name,
        category: added.category,
        reviewer: 'Alex Mercer',
        submitted: added.registeredDate,
        days: 1,
        progress: 10,
        stage: 0
      }
    ]);

    setIsSubmitted(true);
  };

  const columns = [
    { title: 'New Request', stage: 0 },
    { title: 'Document Collection', stage: 1 },
    { title: 'Compliance Review', stage: 2 },
    { title: 'Risk Assessment', stage: 3 },
    { title: 'Approval Pending', stage: 4 }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header CTA Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-950 dark:text-white uppercase tracking-wide">Onboarding Pipeline Control</h2>
          <span className="text-xs text-gray-400">Streamline compliance, document vetting and scoring diagnostics.</span>
        </div>
        <button
          onClick={() => {
            setActiveStep(1);
            setIsSubmitted(false);
            setFormOpen(true);
          }}
          className="h-[38px] px-4 bg-blue-600 hover:bg-blue-700 font-semibold text-white text-xs rounded-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Onboard New Vendor
        </button>
      </div>

      {/* SECTION A: KANBAN BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const cards = kanbanCards.filter((card) => card.stage === col.stage);
          return (
            <div key={col.stage} className="bg-gray-100/55 dark:bg-[#1C2333]/40 p-4 rounded-md border dark:border-slate-800 flex flex-col min-w-[220px] max-h-[500px]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase truncate pr-1">{col.title}</span>
                <span className="bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cards.length}
                </span>
              </div>

              {/* Cards Container with scrollbar */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scroll-smooth min-h-[300px]" style={{ contentVisibility: 'auto' }}>
                {cards.map((card) => {
                  const tagStyles = CATEGORY_COLORS[card.category] || CATEGORY_COLORS['Other'];
                  return (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-[#161B27] p-3 rounded border border-gray-150 dark:border-gray-803 shadow-sm space-y-2 hover:shadow transition transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-1 overflow-hidden">
                        <span className="font-extrabold text-[12.5px] text-gray-900 dark:text-white leading-tight truncate block">
                          {card.vendorName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`inline-block text-[9px] font-bold px-1.5 rounded-sm ${tagStyles.bg} ${tagStyles.text}`}>
                          {card.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold font-mono">Day {card.days}</span>
                      </div>

                      {/* Small progress meter bar */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-gray-450 uppercase leading-none">
                          <span>Docs checklist</span>
                          <span>{card.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${card.progress}%` }} />
                        </div>
                      </div>

                      {/* Footer assign details */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-405 dark:text-slate-500 font-sans">
                        <span className="truncate max-w-[80px]">Rep: {card.reviewer}</span>
                        <button
                          onClick={() => executePipelineProgress(card.id)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5"
                        >
                          Advance &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION B: PIPELINE ROSTER STATUS TABLE (Bottom section) */}
      <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-200 uppercase tracking-wide mb-2 pl-1 border-b pb-2">Documents Checkpoints Pipeline Ledger</h3>
        <table className="w-full text-left font-sans text-xs collapse-border">
          <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-wider font-bold">
            <tr>
              <th className="p-3 pl-4">Onboarding Ref</th>
              <th className="p-3">Vendor Applicant Name</th>
              <th className="p-3">Target Industry Category</th>
              <th className="p-3">Assigned Auditor Rep</th>
              <th className="p-3">Submission date</th>
              <th className="p-3 text-center">Milestones Progress</th>
              <th className="p-3">Vetting Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {kanbanCards.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/20">
                <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{p.id}</td>
                <td className="p-3 font-semibold">{p.vendorName}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.reviewer}</td>
                <td className="p-3 text-gray-550">{p.submitted}</td>
                <td className="p-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono font-extrabold text-[11px] block">{p.progress}%</span>
                    <div className="w-16 h-1 bg-gray-100 dark:bg-slate-800 rounded">
                      <div className="h-full bg-blue-600" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="font-bold text-[10.5px] uppercase tracking-wide text-blue-600 dark:text-blue-450">
                    Stage {p.stage + 1} Vetting
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION B: MULTI-STEP NEW ONBOARDING MODAL FRAME */}
      {formOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm" onClick={() => setFormOpen(false)} />

          {/* Form Dialog Box */}
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[650px] max-h-[80vh] overflow-y-auto bg-white dark:bg-[#161B27] rounded-md shadow-[0_24px_80px_rgba(0,0,0,0.25)] border border-gray-250 dark:border-gray-803 z-50 flex flex-col font-sans py-6 px-8 animate-scale-up duration-200 scrollbar-thin">
            {/* Modal header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 mb-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-semibold text-gray-950 dark:text-white uppercase tracking-wide">Assemble Onboarding Dossier</h2>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-950 dark:hover:text-[#CBD5E1]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Header steps 1-5 */}
            {!isSubmitted && (
              <div className="flex justify-between items-center text-xs font-sans font-bold text-gray-450 border-b pb-4 mb-6 flex-shrink-0">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 leading-none text-[11px] ${
                        activeStep === step
                          ? 'bg-blue-600 border-blue-600 text-white font-extrabold shadow-sm'
                          : activeStep > step
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-200 dark:border-slate-800 text-gray-400 bg-transparent'
                      }`}
                    >
                      {activeStep > step ? '✓' : step}
                    </span>
                    <span className={activeStep === step ? 'text-blue-700 dark:text-blue-400 font-extrabold' : 'text-gray-400'}>
                      Step {step}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Form Steps Dispatcher */}
            {isSubmitted ? (
              /* Submission visual SUCCESS layout animation */
              <div className="py-12 text-center space-y-4 font-sans flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-905 dark:text-white">Dossier Application Submitted!</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Dossier check confirmation ID generated successfully: <span className="font-mono font-bold bg-gray-100 dark:bg-slate-800 dark:text-slate-300 px-1 py-0.5 rounded">ONB-2026-X91A</span>. Typical vetting periods span 3–5 business days. Outbox alerts dispatcher activated.
                  </p>
                </div>
                <button
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-705 text-white font-semibold text-xs rounded transition"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* STEP 1: Basic Corporate profile */}
                {activeStep === 1 && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="font-bold text-gray-450 uppercase text-[10.5px]">Company Legal Entity Name *</label>
                      <input
                        required
                        type="text"
                        name="companyName"
                        className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white focus:border-blue-500"
                        placeholder="e.g. Apex Strategic Technologies Ltd"
                        value={formData.companyName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Trading Name / DBA</label>
                        <input
                          type="text"
                          name="tradingName"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white focus:border-blue-500"
                          placeholder="e.g. Apex Tech"
                          value={formData.tradingName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Vendor Business Type</label>
                        <select
                          name="businessType"
                          className="h-[38px] border dark:border-[#1F2937] px-2 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.businessType}
                          onChange={handleInputChange}
                        >
                          <option value="Corporation">Corporation Public</option>
                          <option value="LLC">LLC private</option>
                          <option value="Partnership">Partnership JV</option>
                          <option value="Sole Proprietor">Sole Proprietorship</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Vendor Group Category</label>
                        <select
                          name="category"
                          className="h-[38px] border dark:border-[#1F2937] px-2 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          <option value="IT Services">IT Services</option>
                          <option value="Raw Materials">Raw Materials</option>
                          <option value="Logistics">Logistics</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Facilities">Facilities</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 flex flex-col pt-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px] pb-1">Target Vendor Tier</label>
                        <div className="flex gap-4">
                          {['Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
                            <label key={tier} className="flex gap-1.5 items-center cursor-pointer font-sans text-gray-700 dark:text-slate-350 select-none">
                              <input
                                type="radio"
                                name="tier"
                                checked={formData.tier === tier}
                                onChange={() => setFormData((prev) => ({ ...prev, tier: tier as Vendor['tier'] }))}
                              />
                              {tier}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5 flex flex-col py-1 mr-1 col-span-2">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Registered Country</label>
                        <select
                          name="country"
                          className="h-[38px] border dark:border-[#1F2937] px-2 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.country}
                          onChange={handleInputChange}
                        >
                          <option value="🇺🇸 United States">🇺🇸 United States</option>
                          <option value="🇩🇪 Germany">🇩🇪 Germany</option>
                          <option value="🇬🇧 United Kingdom">🇬🇧 United Kingdom</option>
                          <option value="🇮🇳 India">🇮🇳 India</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 flex flex-col py-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">State/Prov</label>
                        <input
                          type="text"
                          name="state"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white focus:border-blue-500"
                          placeholder="e.g. CA"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="font-bold text-gray-450 uppercase text-[10.5px]">Headquarters Registered Address</label>
                      <input
                        type="text"
                        name="address"
                        className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white focus:border-blue-500"
                        placeholder="HQ Street address, Suite indicators"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="font-bold text-gray-450 uppercase text-[10.5px]">Brief scope Description / Business notes</label>
                      <textarea
                        name="description"
                        rows={3}
                        className="border dark:border-[#1F2937] p-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white focus:border-blue-500 font-sans"
                        placeholder="Summarize general operational alignment targets..."
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4 border-gray-100 flex-shrink-0 mt-6">
                      <button
                        type="button"
                        onClick={() => setFormOpen(false)}
                        className="px-4 py-2 border rounded text-xs font-semibold hover:bg-gray-50 flex items-center gap-1 shadow-sm leading-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleStepNext}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition flex items-center gap-1 shadow-sm leading-none"
                      >
                        Next Step &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Contact Specifications */}
                {activeStep === 2 && (
                  <div className="space-y-4 text-xs font-sans">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1 border-b">Primary account Rep Specifications</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">First name *</label>
                        <input
                          required
                          type="text"
                          name="contactFirstName"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.contactFirstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Last Name *</label>
                        <input
                          required
                          type="text"
                          name="contactLastName"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.contactLastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Job Title</label>
                        <input
                          type="text"
                          name="contactJobTitle"
                          placeholder="e.g. Support Account Manager"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.contactJobTitle}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Department</label>
                        <input
                          type="text"
                          name="contactDept"
                          placeholder="e.g. Sales / Support Operations"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.contactDept}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Primary Corporate Email *</label>
                        <input
                          required
                          type="email"
                          name="contactEmail"
                          placeholder="rep@domain.com"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Phone Number *</label>
                        <input
                          required
                          type="text"
                          name="contactPhone"
                          placeholder="+1 555-0000"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4 border-gray-100 flex-shrink-0 mt-6 font-semibold">
                      <button
                        type="button"
                        onClick={handleStepPrev}
                        className="px-4 py-2 border rounded hover:bg-gray-50 text-xs flex items-center gap-1 shadow-sm leading-none"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={handleStepNext}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition flex items-center gap-1 shadow-sm leading-none"
                      >
                        Next Step &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Financial profiles */}
                {activeStep === 3 && (
                  <div className="space-y-4 text-xs font-sans">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1 border-b">Corporate banking & invoice options</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Tax Registration code Code (TIN/EIN)</label>
                        <input
                          type="text"
                          name="taxId"
                          placeholder="e.g. US-9831201"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white font-mono"
                          value={formData.taxId}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Standard Payment terms Covenants</label>
                        <select
                          name="payTerms"
                          className="h-[38px] border dark:border-[#1F2937] px-2 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.payTerms}
                          onChange={handleInputChange}
                        >
                          <option value="Net 15">Net 15 periods</option>
                          <option value="Net 30">Net 30 corporate standard</option>
                          <option value="Net 45">Net 45 framework agreements</option>
                          <option value="Net 60">Net 60 partners terms</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Preferred Payment Method</label>
                        <select
                          name="payMethod"
                          className="h-[38px] border dark:border-[#1F2937] px-2 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.payMethod}
                          onChange={handleInputChange}
                        >
                          <option value="Bank Transfer">Bank Transfer / wire</option>
                          <option value="ACH">ACH transfer credit</option>
                          <option value="Wire">International swift Wire</option>
                          <option value="Check">Voucher checklists draft</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Bank Registry Name</label>
                        <input
                          type="text"
                          name="bankName"
                          placeholder="e.g. JPMorgan Chase"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white"
                          value={formData.bankName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col mr-1">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Voucher Account number Mask</label>
                        <input
                          type="password"
                          name="accountNumber"
                          placeholder="*****************"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white font-mono"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-bold text-gray-450 uppercase text-[10.5px]">Direct Routing Routing Transit Code</label>
                        <input
                          type="text"
                          name="routingNumber"
                          placeholder="e.g. 021000021"
                          className="h-[38px] border dark:border-[#1F2937] px-3 bg-white dark:bg-[#161B27] rounded outline-none text-gray-950 dark:text-white font-mono"
                          value={formData.routingNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4 border-gray-100 flex-shrink-0 mt-6 font-semibold">
                      <button
                        type="button"
                        onClick={handleStepPrev}
                        className="px-4 py-2 border rounded hover:bg-gray-50 text-xs flex items-center gap-1 shadow-sm leading-none"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={handleStepNext}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition flex items-center gap-1 shadow-sm leading-none"
                      >
                        Next Step &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Compliance document Upload Checklist table */}
                {activeStep === 4 && (
                  <div className="space-y-4 text-xs font-sans">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1 border-b">Archived compliance vetting checkers</h3>

                    <div className="bg-blue-50/20 dark:bg-slate-850/10 p-3.5 border rounded space-y-1">
                      <div className="flex justify-between font-bold text-blue-700 dark:text-blue-300">
                        <span>Documents checklists cataloged</span>
                        <span>4 criteria remaining</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 roundedoverflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {[
                        { doc: 'Business Registration / Corporate certificate', required: true, desc: 'Filing verification' },
                        { doc: 'W9 Tax certification release Form', required: true, desc: 'Treasury tax files' },
                        { doc: 'Active Certificate of General Liability Insurance', required: true, desc: 'Risk controls limit' },
                        { doc: 'Corporate SOC2 Security Statement cert', required: false, desc: 'Cyber diagnostics' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 border rounded flex items-center justify-between hover:bg-gray-50/50">
                          <div>
                            <span className="font-bold text-gray-905 dark:text-white block">{item.doc}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{item.desc} · {item.required ? 'Mandatory' : 'Optional'}</span>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => alert(`Initiating file selection explorer for: ${item.doc}`)}
                              className="px-2.5 py-1.5 border hover:bg-gray-100 font-semibold text-xs rounded shadow-sm text-gray-700 dark:text-slate-200"
                            >
                              Upload File
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4 border-gray-100 flex-shrink-0 mt-6 font-semibold">
                      <button
                        type="button"
                        onClick={handleStepPrev}
                        className="px-4 py-2 border rounded hover:bg-gray-50 text-xs flex items-center gap-1 shadow-sm leading-none"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={handleStepNext}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition flex items-center gap-1 shadow-sm leading-none"
                      >
                        Next Step &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Accordion checklists review and submit declaration check */}
                {activeStep === 5 && (
                  <div className="space-y-4 text-xs font-sans">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1 border-b">Review compiled parameters draft</h3>

                    <div className="p-4 bg-gray-50/50 dark:bg-slate-850/10 rounded space-y-3.5 max-h-[220px] overflow-y-auto">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Basic Corporate Profile</span>
                        <p className="font-bold text-gray-800 dark:text-slate-200 text-sm mt-0.5">{formData.companyName || 'Not Entered'}</p>
                        <p className="text-xs text-gray-450 dark:text-slate-400 mt-1">{formData.category} · {formData.tier} · Registered {formData.country}</p>
                      </div>
                      <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-800" />
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Billing Covenants</span>
                        <p className="text-xs font-semibold text-gray-700 dark:text-slate-305 mt-1">Payment Method: {formData.payMethod} on {formData.payTerms} conditions limits</p>
                      </div>
                    </div>

                    <div className="p-3.5 border border-amber-100 bg-amber-50/10 rounded flex gap-2">
                      <input required type="checkbox" className="scale-110 mt-0.5 cursor-pointer" />
                      <p className="text-gray-550 dark:text-slate-350 leading-relaxed font-semibold">
                        I hereby declare and certify that all entered corporate registration variables and vetting document assets are complete and correct.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4 border-gray-100 flex-shrink-0 mt-6 font-semibold">
                      <button
                        type="button"
                        onClick={handleStepPrev}
                        className="px-4 py-2 border rounded hover:bg-gray-50 text-xs flex items-center gap-1 shadow-sm leading-none"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs rounded transition flex items-center gap-1 shadow-sm leading-none"
                      >
                        Submit For Vetting &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};
