import React, { useState } from 'react';
import { useVMS } from '../../vmsContext';
import { UserPlus, ArrowLeft, ArrowRight, Save, Building2, User, CreditCard, ShieldCheck, ClipboardCheck } from 'lucide-react';

export const AddVendorOnboardingForm: React.FC = () => {
  const { addVendor, addToast, setCurrentPage } = useVMS();

  // Wizard Step: 1 = Company Details, 2 = Contact Person, 3 = Financials & Compliance
  const [step, setStep] = useState(1);

  // Form fields state
  const [formData, setFormData] = useState({
    companyName: '',
    tradingName: '',
    businessType: 'Corporation',
    category: 'IT Services',
    tier: 'Tier 1' as 'Tier 1' | 'Tier 2' | 'Tier 3',
    country: 'United States',
    state: '',
    city: '',
    address: '',
    description: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    contactJobTitle: '',
    contactDept: 'Procurement',
    taxId: '',
    payTerms: 'Net 30',
    payMethod: 'ACH',
    bankName: '',
    bankAccount: '',
    bankRouting: '',
    certStandard: 'ISO 9001',
    insuranceValue: '1,000,000',
    ndaAccepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.companyName) {
      addToast('error', 'Required Field', 'Please provide a company name.');
      return;
    }
    if (step === 2 && (!formData.contactFirstName || !formData.contactEmail)) {
      addToast('error', 'Required Fields', 'Please provide contact name and email.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ndaAccepted) {
      addToast('error', 'NDA Required', 'Supplier must accept NDA terms to proceed.');
      return;
    }

    addVendor({
      name: formData.companyName,
      category: formData.category,
      tier: formData.tier,
      status: 'Active',
      riskLevel: 'Low',
      performanceScore: 85,
      contact: {
        name: `${formData.contactFirstName} ${formData.contactLastName}`,
        email: formData.contactEmail,
        phone: formData.contactPhone
      },
      country: formData.country,
      onboardingProgress: 100,
      logoInitials: formData.companyName.substring(0, 2).toUpperCase()
    });

    addToast('success', 'Onboarding Complete', `Successfully completed onboarding pipeline for ${formData.companyName}`);
    setCurrentPage('onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-[#E2E8F0] p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111622] border border-gray-200 dark:border-[#1F2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div id="form-header-banner" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-650 p-8 text-white flex items-center justify-between form-header-gradient">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('onboarding')}
              type="button"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold font-roboto tracking-wide flex items-center gap-3 text-white">
                <UserPlus className="w-7 h-7 text-indigo-200" /> Vendor Onboarding Portal
              </h2>
              <p className="text-white text-white/80 text-xs mt-1">Vet and onboard a new vendor applicant through standard corporate compliance checks.</p>
            </div>
          </div>
          <span className="bg-white/10 border border-white/20 text-xs font-extrabold px-4 py-2 rounded-xl backdrop-blur-md text-white">
            Step {step} of 3
          </span>
        </div>

        {/* Step Progress Timeline */}
        <div className="flex border-b border-gray-100 dark:border-[#1F2937] bg-gray-50/50 dark:bg-slate-900/10 text-xs font-bold text-center">
          <div className={`flex-1 py-4 border-r border-gray-150 dark:border-[#1F2937] transition-all duration-200 ${step === 1 ? 'text-blue-600 dark:text-blue-400 bg-blue-50/10 dark:bg-blue-900/5' : 'text-gray-400'}`}>
            1. CORPORATE PROFILE
          </div>
          <div className={`flex-1 py-4 border-r border-gray-150 dark:border-[#1F2937] transition-all duration-200 ${step === 2 ? 'text-blue-600 dark:text-blue-400 bg-blue-50/10 dark:bg-blue-900/5' : 'text-gray-400'}`}>
            2. KEY CONTACT PARTY
          </div>
          <div className={`flex-1 py-4 transition-all duration-200 ${step === 3 ? 'text-blue-600 dark:text-blue-400 bg-blue-50/10 dark:bg-blue-900/5' : 'text-gray-400'}`}>
            3. FINANCIALS & COMPLIANCE
          </div>
        </div>

        {/* Form Body Grid */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 text-sm">
          
          {/* Inputs Panel (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* STEP 1: Company Profile */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-bold text-xs uppercase text-gray-400 dark:text-gray-500 tracking-wider flex items-center gap-2 border-b pb-2 dark:border-[#1F2937]">
                  <Building2 className="w-4.5 h-4.5 text-blue-500" /> Basic Corporate Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">Company Legal Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      placeholder="Legal Entity Name"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Trading Name / DBA</label>
                    <input
                      type="text"
                      name="tradingName"
                      value={formData.tradingName}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      placeholder="Brand Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Business Type</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-white dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 text-sm cursor-pointer"
                    >
                      <option value="Corporation">Corporation</option>
                      <option value="LLC">LLC</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietor">Sole Proprietor</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Industry Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-white dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 text-sm cursor-pointer"
                    >
                      <option value="IT Services">IT Services</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Facilities">Facilities</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Onboarding Tier</label>
                    <select
                      name="tier"
                      value={formData.tier}
                      onChange={handleChange}
                      className="h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-white dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 text-sm cursor-pointer"
                    >
                      <option value="Tier 1">Tier 1 (High Criticality)</option>
                      <option value="Tier 2">Tier 2 (Medium Value)</option>
                      <option value="Tier 3">Tier 3 (Tactical Supplier)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">State / Region</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      placeholder="e.g. CA"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      placeholder="e.g. San Francisco"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Registered Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    placeholder="Street Address, Suite etc."
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Business Scope Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="p-4 bg-gray-55/55 dark:bg-slate-900 border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 text-xs resize-none"
                    placeholder="Provide a summary of the materials or consulting services being supplied..."
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Contact Person */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-bold text-xs uppercase text-gray-400 dark:text-gray-500 tracking-wider flex items-center gap-2 border-b pb-2 dark:border-[#1F2937]">
                  <User className="w-4.5 h-4.5 text-blue-500" /> Key Contact Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">First Name *</label>
                    <input
                      type="text"
                      name="contactFirstName"
                      value={formData.contactFirstName}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Last Name</label>
                    <input
                      type="text"
                      name="contactLastName"
                      value={formData.contactLastName}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">Corporate Email Address *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Direct Phone Number</label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      placeholder="+1 555-0100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Job Title</label>
                    <input
                      type="text"
                      name="contactJobTitle"
                      value={formData.contactJobTitle}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      placeholder="e.g. Sourcing Manager"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Department</label>
                    <input
                      type="text"
                      name="contactDept"
                      value={formData.contactDept}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Financials & Compliance */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-bold text-xs uppercase text-gray-400 dark:text-gray-500 tracking-wider flex items-center gap-2 border-b pb-2 dark:border-[#1F2937]">
                  <CreditCard className="w-4.5 h-4.5 text-blue-500" /> Banking & Invoicing Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Corporate Tax ID / EIN</label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                      placeholder="XX-XXXXXXX"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Payment Terms</label>
                    <select
                      name="payTerms"
                      value={formData.payTerms}
                      onChange={handleChange}
                      className="h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-white dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 text-sm cursor-pointer"
                    >
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Preferred Pay Method</label>
                    <select
                      name="payMethod"
                      value={formData.payMethod}
                      onChange={handleChange}
                      className="h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-white dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 text-sm cursor-pointer"
                    >
                      <option value="ACH">ACH Transfer</option>
                      <option value="Wire">Swift Wire</option>
                      <option value="Check">Check Clearance</option>
                    </select>
                  </div>
                </div>

                <h3 className="font-bold text-xs uppercase text-gray-400 dark:text-gray-500 tracking-wider flex items-center gap-2 border-b pb-2 dark:border-[#1F2937] pt-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-blue-500" /> Compliance Checkpoints
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Quality Vetting Standard</label>
                    <select
                      name="certStandard"
                      value={formData.certStandard}
                      onChange={handleChange}
                      className="h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-white dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 text-sm cursor-pointer"
                    >
                      <option value="ISO 9001">ISO 9001 (Quality Management)</option>
                      <option value="ISO 27001">ISO 27001 (Information Security)</option>
                      <option value="ISO 14001">ISO 14001 (Environmental)</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Liability Insurance Value ($)</label>
                    <input
                      type="text"
                      name="insuranceValue"
                      value={formData.insuranceValue}
                      onChange={handleChange}
                      className="h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      placeholder="e.g. 1,000,000"
                    />
                  </div>
                </div>

                {/* NDA Covenants checkbox */}
                <label className="flex items-start gap-3 p-4 border dark:border-[#1F2937] rounded-xl bg-gray-50/20 dark:bg-slate-900/10 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="ndaAccepted"
                    checked={formData.ndaAccepted}
                    onChange={handleCheckboxChange}
                    className="mt-1 accent-blue-600 scale-105"
                    required
                  />
                  <div>
                    <strong className="font-bold text-gray-905 dark:text-slate-200 block text-xs leading-none">Accept Master NDA Agreement</strong>
                    <span className="text-[10.5px] text-gray-400 block mt-1">
                      By checking this, the supplier agrees to our standard mutual Non-Disclosure Agreement terms and framework policy regulations.
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Right Column: Audited Dossier Checklist (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Dossier Checklist Vetting
            </h3>

            <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50/20 dark:from-[#131727] dark:to-[#171D33] border border-indigo-100/30 dark:border-[#1F2937] rounded-2xl space-y-5 shadow-md font-mono text-xs">
              <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-[#1F2937]/50 pb-3 font-sans">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest font-mono">Onboarding Draft</span>
                <ClipboardCheck className="w-5 h-5 text-indigo-500" />
              </div>

              {/* Progress checklist dynamic updates */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${formData.companyName ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'}`}>✓</span>
                  <div>
                    <span className="font-bold block text-[11px] text-gray-900 dark:text-white">Corporate Identity Profile</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{formData.companyName || 'Awaiting entity name input...'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${formData.contactFirstName && formData.contactEmail ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'}`}>✓</span>
                  <div>
                    <span className="font-bold block text-[11px] text-gray-900 dark:text-white">Primary Representative Contact</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {formData.contactFirstName ? `${formData.contactFirstName} (${formData.contactEmail || 'Awaiting email...'})` : 'Awaiting rep specifications...'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${formData.ndaAccepted ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'}`}>✓</span>
                  <div>
                    <span className="font-bold block text-[11px] text-gray-900 dark:text-white">NDA Terms Acceptance</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{formData.ndaAccepted ? 'NDA terms accepted' : 'Awaiting digital signing...'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="lg:col-span-5 border-t border-gray-100 dark:border-[#1F2937] pt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-400 max-w-sm">
              All entries are validated against corporate security standards. NDA signups activate outbox notification triggers.
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => {
                  if (step > 1) {
                    handleBack();
                  } else {
                    setCurrentPage('onboarding');
                  }
                }}
                className="px-6 py-3 border border-gray-250 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#161B27] text-gray-700 dark:text-slate-300 rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                {step > 1 ? 'Back' : 'Cancel'}
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.ndaAccepted}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:scale-105 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Complete Onboarding
                </button>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
