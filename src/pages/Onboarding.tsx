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
  const { addVendor, setCurrentPage } = useVMS();

  // Kanban items state
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([
    { id: 'ONB-01', vendorName: 'Apex Technologies Ltd', category: 'IT Services', submitted: '2026-06-03', days: 3, reviewer: 'Alex Mercer', progress: 55, stage: 1 },
    { id: 'ONB-02', vendorName: 'NovaStar Logistics', category: 'Logistics', submitted: '2026-06-04', days: 2, reviewer: 'Elena Rostova', progress: 40, stage: 2 },
    { id: 'ONB-03', vendorName: 'GlobalTrade GmbH', category: 'Logistics', submitted: '2026-06-01', days: 5, reviewer: 'Sarah Jenkins', progress: 90, stage: 3 },
    { id: 'ONB-04', vendorName: 'Synergy Facilities', category: 'Facilities', submitted: '2026-06-05', days: 1, reviewer: 'Deepak Nair', progress: 10, stage: 0 },
    { id: 'ONB-05', vendorName: 'ClearPath IT', category: 'IT Services', submitted: '2026-05-30', days: 7, reviewer: 'Alex Mercer', progress: 75, stage: 4 }
  ]);

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


  const columns = [
    { title: 'New Request', stage: 0 },
    { title: 'Document Collection', stage: 1 },
    { title: 'Compliance Review', stage: 2 },
    { title: 'Risk Assessment', stage: 3 },
    { title: 'Approval Pending', stage: 4 }
  ];

  return (
    <div className="pt-14 space-y-8 font-sans">
      {/* Top Header CTA Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-950 dark:text-white uppercase tracking-wide">Onboarding Pipeline Control</h2>
          <span className="text-xs text-gray-400">Streamline compliance, document vetting and scoring diagnostics.</span>
        </div>
        <button
          onClick={() => {
            setCurrentPage('add-vendor-onboarding');
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
    </div>
  );
};
