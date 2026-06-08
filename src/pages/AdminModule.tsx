import React, { useState, useEffect, useMemo } from 'react';
import { useVMS } from '../vmsContext';
import {
  Users,
  Calendar,
  Settings,
  Mail,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Lock,
  ChevronDown,
  Sparkles,
  Award,
  ArrowRight,
  Database,
  Briefcase,
  HelpCircle,
  X,
  Search
} from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export const AdminModule: React.FC = () => {
  const { addToast, currentPage } = useVMS();

  // Tab switcher: 'users' | 'calendar' | 'settings'
  const [tab, setTab] = useState<'users' | 'calendar' | 'settings'>('users');

  // Align with outer route click
  useEffect(() => {
    if (currentPage === 'users') {
      setTab('users');
    } else if (currentPage === 'calendar') {
      setTab('calendar');
    } else if (currentPage === 'settings') {
      setTab('settings');
    }
  }, [currentPage]);

  // Personnel User invite modal trigger
  const [inviteOpen, setInviteOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Procurement Analyst');

  // Mock users list state
  const [users, setUsers] = useState([
    { id: 'USR-01', name: 'Sarah Jenkins', email: 's.jenkins@vflow.com', role: 'Super Admin', dept: 'Legal & Compliance', status: 'Active' },
    { id: 'USR-02', name: 'Alex Mercer', email: 'a.mercer@vflow.com', role: 'Procurement Specialist', dept: 'Supply Chain Operations', status: 'Active' },
    { id: 'USR-03', name: 'Deepak Nair', email: 'd.nair@vflow.com', role: 'Risk Assessor', dept: 'Finance Vetting', status: 'Active' },
    { id: 'USR-04', name: 'Elena Rostova', email: 'e.rostova@vflow.com', role: 'Compliance Analyst', dept: 'Quality Deliveries', status: 'Active' }
  ]);

  // User list searches and selections states
  const [userSearchText, setUserSearchText] = useState('');
  const [userDeptFilter, setUserDeptFilter] = useState('All');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(userSearchText.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchText.toLowerCase()) ||
        u.id.toLowerCase().includes(userSearchText.toLowerCase());
      const matchesDept = userDeptFilter === 'All' || u.dept === userDeptFilter;
      const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
      return matchesSearch && matchesDept && matchesRole;
    });
  }, [users, userSearchText, userDeptFilter, userRoleFilter]);

  // Calendar View State: 'month' | 'week' | 'agenda'
  const [calMode, setCalMode] = useState<'month' | 'week' | 'agenda'>('month');

  // New states for real calendar month and year (Defaulting to June 2026 as standard simulation)
  const [currYear, setCurrYear] = useState(2026);
  const [currMonth, setCurrMonth] = useState(5); // 0-indexed, so 5 is June
  const [agendaSearch, setAgendaSearch] = useState('');

  // Milestone events dynamic registry
  type CalendarEvent = { id: string; title: string; type: 'compliance' | 'risk' | 'financial' | 'procure' };
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({
    '2026-06-01': [{ id: 'ev-1', title: 'NDA VND-0002 Renewal Vet', type: 'compliance' }],
    '2026-06-04': [{ id: 'ev-2', title: 'Vendor Q3 Sourcing Bid Open', type: 'procure' }],
    '2026-06-10': [{ id: 'ev-3', title: 'Audit SLA Apex Strategic', type: 'risk' }],
    '2026-06-16': [{ id: 'ev-4', title: 'BofA Disbursement wire clearance', type: 'financial' }],
    '2026-06-26': [{ id: 'ev-5', title: 'Contract Milestone Review', type: 'compliance' }]
  });

  // Modal event creator input values
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventDate, setEventDate] = useState('2026-06-01');
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'compliance' | 'risk' | 'financial' | 'procure'>('compliance');

  // Settings states
  const [alertInvoices, setAlertInvoices] = useState(true);
  const [alertContracts, setAlertContracts] = useState(true);
  const [alertRisks, setAlertRisks] = useState(false);

  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    setUsers((prev) => [
      ...prev,
      {
        id: `USR-0${prev.length + 1}`,
        name: userName,
        email: userEmail,
        role: userRole,
        dept: 'Global Operations',
        status: 'Active'
      }
    ]);

    addToast('success', 'Operator Invited', `Chronological registration link compiled and dispatched to ${userEmail}.`);
    setInviteOpen(false);
    setUserName('');
    setUserEmail('');
  };

  const handleRemoveUser = (id: string, name: string) => {
    const confirm = window.confirm(`Revoke credentials and de authorize ${name}?`);
    if (confirm) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addToast('info', 'Operator De-authorized', 'Operator database credentials deactivated.');
    }
  };

  const handleAddNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newMilestone: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: eventTitle.trim(),
      type: eventType
    };

    setEvents((prev) => {
      const updated = { ...prev };
      if (!updated[eventDate]) {
        updated[eventDate] = [];
      }
      updated[eventDate] = [...updated[eventDate], newMilestone];
      return updated;
    });

    addToast('success', 'Milestone Scheduled', `Successfully registered "${eventTitle}" for ${eventDate}.`);
    setShowAddEvent(false);
    setEventTitle('');
  };

  return (
    <div className="pt-14 space-y-6 font-sans">
      {/* Dynamic Navigation Sub tabs */}
      <div className="bg-white dark:bg-[#161B27] p-1 border rounded shadow-sm flex font-sans overflow-x-auto gap-1">
        {(
            [
              { id: 'calendar', label: 'Milestones Calendar', icon: Calendar }
            ] as const
          ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 min-w-[130px] whitespace-nowrap py-2 text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 ${
                tab === t.id
                  ? 'bg-[#0F1729] text-white shadow'
                  : 'text-gray-550 hover:text-gray-901 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
            );
              })}
          </div>

      {/* MODULE TAB 1: PERSONNEL USER CREDENTIALS */}
      {tab === 'users' ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/45 text-xs">
            <div>
              <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[11px]">Authorized Operators Portal</h3>
              <span className="text-gray-400">Review access, permissions, and audit credentials of procurement officers.</span>
            </div>
            <button
              onClick={() => setInviteOpen(true)}
              className="px-3.5 h-[34px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded flex items-center gap-1.5 shadow-sm leading-none mr-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Invite Operator Rep
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-[#161B27] p-3.5 rounded-md border flex flex-wrap md:flex-nowrap gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                className="w-full h-[36px] pl-9 pr-4 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm text-gray-950 dark:text-white outline-none"
              />
            </div>

            {/* Department Select */}
            <select
              value={userDeptFilter}
              onChange={(e) => setUserDeptFilter(e.target.value)}
              className="h-[36px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Divisions</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
              <option value="Supply Chain Operations">Supply Chain Operations</option>
              <option value="Finance Vetting">Finance Vetting</option>
              <option value="Quality Deliveries">Quality Deliveries</option>
              <option value="Global Operations">Global Operations</option>
            </select>

            {/* Role Select */}
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="h-[36px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Procurement Specialist">Procurement Specialist</option>
              <option value="Risk Assessor">Risk Assessor</option>
              <option value="Compliance Analyst">Compliance Analyst</option>
            </select>

            {/* Reset check */}
            {(userSearchText || userDeptFilter !== 'All' || userRoleFilter !== 'All') && (
              <button
                onClick={() => {
                  setUserSearchText('');
                  setUserDeptFilter('All');
                  setUserRoleFilter('All');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 cursor-pointer font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-hidden text-xs font-sans">
            <table className="w-full text-left">
              <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest font-sans">
                <tr>
                  <th className="p-3 pl-4">Staff ID</th>
                  <th className="p-3">Staff Legal Name</th>
                  <th className="p-3">E-mail index</th>
                  <th className="p-3">Designation Role</th>
                  <th className="p-3">Department Division</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-[#1F2937] text-slate-700 dark:text-slate-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">No operators matching the search filters.</td>
                  </tr>
                ) : (
                  filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-gray-50/10">
                      <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{usr.id}</td>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{usr.name}</td>
                      <td className="p-3 font-mono text-gray-500 dark:text-slate-400">{usr.email}</td>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{usr.role}</td>
                      <td className="p-3 text-gray-500 dark:text-slate-400">{usr.dept}</td>
                      <td className="p-3">
                        <span className="inline-block border text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border-emerald-111 leading-none dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                          {usr.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {usr.id !== 'USR-01' ? (
                          <button
                            onClick={() => handleRemoveUser(usr.id, usr.name)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer"
                            title="Revoke Permission Keys"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] uppercase font-black text-slate-400 px-2 leading-none">ROOT LOCK</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'calendar' ? (
        <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border shadow-sm text-xs font-sans space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 dark:border-gray-800">
            <div>
              <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[11px]">Milestones Calendar</h3>
              <span className="text-gray-400">{MONTHS[currMonth]} {currYear}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={currMonth}
                onChange={(e) => setCurrMonth(Number(e.target.value))}
                className="h-[30px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
              <select
                value={currYear}
                onChange={(e) => setCurrYear(Number(e.target.value))}
                className="h-[30px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  setEventDate(`${currYear}-${String(currMonth + 1).padStart(2, '0')}-01`);
                  setEventTitle('');
                  setEventType('compliance');
                  setShowAddEvent(true);
                }}
                className="h-[30px] px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Target
              </button>
              <div className="flex border rounded p-0.5 bg-gray-50 dark:bg-slate-800 dark:border-gray-700">
                {(['month', 'week', 'agenda'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCalMode(mode)}
                    className={`px-3 py-1 font-bold text-[10px] uppercase rounded cursor-pointer ${
                      calMode === mode ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-955 dark:text-slate-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Month grid view */}
          {calMode === 'month' && (
            <div className="space-y-1 select-none">
              {/* Date headers */}
              <div className="grid grid-cols-7 text-center font-bold text-[10.5px] uppercase tracking-wider text-gray-400 py-1.5 border-b dark:border-gray-800">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Grid 35/42 cells */}
              <div className="grid grid-cols-7 gap-1 pt-1">
                {(() => {
                  // Generate dynamically
                  const firstDay = new Date(currYear, currMonth, 1).getDay();
                  const daysInCurrentMonth = new Date(currYear, currMonth + 1, 0).getDate();
                  
                  const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
                  const prevYear = currMonth === 0 ? currYear - 1 : currYear;
                  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
                  
                  const cells = [];
                  
                  // May/Prev month prefix days
                  for (let i = firstDay - 1; i >= 0; i--) {
                    const dayNum = daysInPrevMonth - i;
                    const dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    cells.push({ day: dayNum, month: prevMonth, year: prevYear, isCurrent: false, dateString });
                  }
                  
                  // June/Current month days
                  for (let i = 1; i <= daysInCurrentMonth; i++) {
                    const dateString = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                    cells.push({ day: i, month: currMonth, year: currYear, isCurrent: true, dateString });
                  }
                  
                  // July/Next month suffix days
                  const totalCellsUsed = cells.length <= 35 ? 35 : 42;
                  const nextMonth = currMonth === 11 ? 0 : currMonth + 1;
                  const nextYear = currMonth === 11 ? currYear + 1 : currYear;
                  let nextMonthDay = 1;
                  while (cells.length < totalCellsUsed) {
                    const dateString = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextMonthDay).padStart(2, '0')}`;
                    cells.push({ day: nextMonthDay, month: nextMonth, year: nextYear, isCurrent: false, dateString });
                    nextMonthDay++;
                  }
                  
                  return cells.map((c, idx) => {
                    const cellEvents = events[c.dateString] || [];
                    return (
                      <div
                        key={idx}
                        className={`border border-gray-150 dark:border-gray-800/80 p-1.5 h-[96px] rounded flex flex-col justify-between hover:bg-gray-50/50 bg-white dark:bg-[#161B27] group relative overflow-y-auto scrollbar-thin ${
                          !c.isCurrent ? 'opacity-40 bg-gray-50 dark:bg-slate-850/10 text-gray-400' : 'text-gray-901 dark:text-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-extrabold font-mono text-[10px] px-1 rounded ${
                            c.dateString === '2026-06-06'
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-901 dark:text-[#CBD5E1]'
                          }`} title={c.dateString === '2026-06-06' ? 'Simulation Operational Date' : ''}>
                            {c.day}
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventDate(c.dateString);
                              setEventTitle('');
                              setEventType('compliance');
                              setShowAddEvent(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-indigo-500 hover:text-indigo-700 bg-indigo-50 dark:bg-slate-800 rounded transition cursor-pointer"
                            title="Add Milestones"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="space-y-1 mt-1">
                          {cellEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className={`p-1 py-0.5 text-[8.5px] uppercase font-bold rounded flex items-center justify-between gap-1 group/item leading-tight border ${
                                ev.type === 'compliance'
                                  ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50'
                                  : ev.type === 'risk'
                                  ? 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-red-200/50 dark:border-red-900/50'
                                  : ev.type === 'financial'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50 font-extrabold'
                                  : 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50 font-bold'
                              }`}
                            >
                              <span className="truncate flex-1">{ev.title}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEvents(prev => {
                                    const u = { ...prev };
                                    if (u[c.dateString]) {
                                      u[c.dateString] = u[c.dateString].filter(x => x.id !== ev.id);
                                    }
                                    return u;
                                  });
                                  addToast('info', 'Milestone Deleted', `Event deleted: ${ev.title}`);
                                }}
                                className="opacity-0 group-hover/item:opacity-100 text-[10px] text-red-500 hover:text-red-750 font-sans cursor-pointer pl-0.5"
                                title="Delete milestone"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Week grid view */}
          {calMode === 'week' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-gray-800">
                <span className="text-gray-450 uppercase font-bold text-[10px] tracking-wider block">
                  Detailed Weekly Schedule Column Matrix ({MONTHS[currMonth]} {currYear} - First Week)
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {(() => {
                  const firstDay = new Date(currYear, currMonth, 1).getDay();
                  const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
                  const prevYear = currMonth === 0 ? currYear - 1 : currYear;
                  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
                  
                  const weekCells = [];
                  for (let i = firstDay - 1; i >= 0; i--) {
                    const dayNum = daysInPrevMonth - i;
                    const dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    weekCells.push({ day: dayNum, month: prevMonth, year: prevYear, isCurrent: false, dateString });
                  }
                  
                  const daysInCurrentMonth = new Date(currYear, currMonth + 1, 0).getDate();
                  for (let i = 1; i <= daysInCurrentMonth; i++) {
                    const dateString = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                    weekCells.push({ day: i, month: currMonth, year: currYear, isCurrent: true, dateString });
                  }

                  const targetWeek = weekCells.slice(0, 7);
                  return targetWeek.map((c, idx) => {
                    const cellEvents = events[c.dateString] || [];
                    const weekDayLabel = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][idx];
                    return (
                      <div
                        key={idx}
                        className="border dark:border-gray-800 rounded-lg p-3 bg-gray-50/20 dark:bg-[#14181F]/40 flex flex-col justify-between h-[280px]"
                      >
                        <div>
                          <div className="pb-1 border-b dark:border-gray-800 flex justify-between items-center mb-2">
                            <strong className="text-xs font-black dark:text-[#CBD5E1]">{weekDayLabel}</strong>
                            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">{c.day}</span>
                          </div>
                          
                          <div className="space-y-1.5 overflow-y-auto max-h-[170px] pr-0.5 scrollbar-thin">
                            {cellEvents.length === 0 ? (
                              <p className="text-gray-400 dark:text-gray-500 italic text-[9.5px] py-2">No milestone targets</p>
                            ) : (
                              cellEvents.map((ev) => (
                                <div
                                  key={ev.id}
                                  className={`p-1.5 rounded text-[9px] uppercase font-bold relative group/item leading-tight flex flex-col border ${
                                    ev.type === 'compliance'
                                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200'
                                      : ev.type === 'risk'
                                      ? 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-red-200'
                                      : ev.type === 'financial'
                                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200'
                                      : 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 border-blue-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <span className="break-words">{ev.title}</span>
                                    <button
                                      onClick={() => {
                                        setEvents(prev => {
                                          const u = { ...prev };
                                          if (u[c.dateString]) {
                                            u[c.dateString] = u[c.dateString].filter(x => x.id !== ev.id);
                                          }
                                          return u;
                                        });
                                      }}
                                      className="hover:text-red-655 text-red-550 font-bold px-0.5 cursor-pointer text-[12px] leading-none"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setEventDate(c.dateString);
                            setEventTitle('');
                            setEventType('compliance');
                            setShowAddEvent(true);
                          }}
                          className="w-full mt-2 py-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-705 border dark:border-gray-700 text-[9.5px] rounded font-bold uppercase cursor-pointer transition text-gray-750 dark:text-gray-300"
                        >
                          + Add Target
                        </button>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Agenda view */}
          {calMode === 'agenda' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-2 dark:border-gray-800">
                <span className="text-gray-450 uppercase font-black text-[10px] tracking-wide block">
                  Interactive Future Milestones List
                </span>
                
                <input
                  type="text"
                  placeholder="Filter key milestones..."
                  value={agendaSearch}
                  onChange={(e) => setAgendaSearch(e.target.value)}
                  className="p-1 px-2.5 text-xs border dark:border-gray-700 rounded-md w-full max-w-[260px] bg-white dark:bg-slate-900 outline-none focus:border-blue-500 text-gray-805 dark:text-white"
                />
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                {(() => {
                  const allEvents = Object.entries(events).flatMap(([date, evList]) =>
                    (evList as CalendarEvent[]).map((ev) => ({ date, ...ev }))
                  );
                  
                  const filtered = allEvents
                    .filter((ev) => ev.title.toLowerCase().includes(agendaSearch.toLowerCase()))
                    .sort((a, b) => a.date.localeCompare(b.date));
                    
                  if (filtered.length === 0) {
                    return (
                      <p className="p-8 text-center text-gray-400 dark:text-gray-500 italic pb-12">
                        No active milestones match your search filters.
                      </p>
                    );
                  }
                  
                  return filtered.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border dark:border-gray-800 rounded bg-gray-50/50 dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-800/10 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border dark:border-gray-700 font-mono text-center min-w-[85px] shadow-sm">
                          <span className="block text-[8px] text-gray-400 font-extrabold uppercase leading-none">TARGET DATE</span>
                          <strong className="block text-[10.5px] text-blue-600 dark:text-blue-400 mt-1 leading-none">{ev.date}</strong>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-901 dark:text-white text-xs">{ev.title}</h4>
                          <span className={`inline-block text-[8.5px] uppercase font-bold tracking-widest mt-1 px-1.5 py-0.5 rounded ${
                            ev.type === 'compliance'
                              ? 'bg-amber-100 text-amber-800'
                              : ev.type === 'risk'
                              ? 'bg-red-100 text-red-800'
                              : ev.type === 'financial'
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'bg-blue-100 text-blue-800 font-bold'
                          }`}>
                            {ev.type}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setEvents((prev) => {
                            const u = { ...prev };
                            if (u[ev.date]) {
                              u[ev.date] = u[ev.date].filter((x) => x.id !== ev.id);
                            }
                            return u;
                          });
                          addToast('info', 'Milestone Deleted', `Deleted item "${ev.title}"`);
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 rounded transition cursor-pointer"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* DYNAMIC MILESTONE CREATION MODAL DRAWER */}
      {showAddEvent && (
        <>
          <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm" onClick={() => setShowAddEvent(false)} />
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-[425px] bg-white dark:bg-[#161B27] border border-gray-250 dark:border-gray-800 rounded-md p-6 shadow-2xl z-50 flex flex-col font-sans">
            <div className="flex justify-between items-center pb-3 border-b mb-4 flex-shrink-0 dark:border-gray-800">
              <h2 className="text-sm font-black text-gray-955 dark:text-white uppercase">Add Milestone Event Target</h2>
              <button onClick={() => setShowAddEvent(false)} className="text-gray-450 hover:text-gray-901 dark:text-gray-400 font-serif text-lg leading-none cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleAddNewEvent} className="space-y-4 text-xs font-sans">
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-455 uppercase text-[10.5px]">Target Milestone Date *</label>
                <input
                  required
                  type="date"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded focus:border-blue-500 text-gray-805 dark:text-white"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-455 uppercase text-[10.5px]">Milestone Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Audit ESG certification VND-26"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded focus:border-blue-500 text-gray-805 dark:text-white"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-455 uppercase text-[10.5px]">Operational Segment Category</label>
                <select
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] px-2 rounded font-semibold text-gray-805 dark:text-white dark:bg-[#161B27]"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                >
                  <option value="compliance">Compliance & Legal Checkup</option>
                  <option value="risk">Risk Escalation Check</option>
                  <option value="financial">Financial Disbursement Action</option>
                  <option value="procure">Sourcing / Bid / RFP Openings</option>
                </select>
              </div>

              <div className="border-t pt-4 flex justify-end gap-2 pr-1 font-semibold dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded cursor-pointer hover:bg-blue-700"
                >
                  Schedule Target
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* MODULE TAB 3: SYSTEM SETTINGS AND PREFERENCES */}
      {tab === 'settings' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start text-xs font-sans">
          {/* Notification Alert switches configurations (34%) */}
          <div className="xl:col-span-1 bg-white dark:bg-[#161B27] p-5 border rounded space-y-6 shadow-sm">
            <div className="border-b pb-2">
              <h3 className="font-bold text-gray-909 uppercase tracking-wider text-[11px]">Systems Alert Notification</h3>
              <p className="text-gray-400 mt-1">Check alerts triggers channels.</p>
            </div>

            <div className="space-y-4 font-semibold text-gray-650">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alertInvoices}
                  onChange={(e) => setAlertInvoices(e.target.checked)}
                  className="scale-110 mt-0.5"
                />
                <div>
                  <span className="font-bold text-gray-905 dark:text-slate-205 block leading-tight">1. Instant invoice clearance alerts</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Spawns header banner warning details when 3-way matches succeed.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alertContracts}
                  onChange={(e) => setAlertContracts(e.target.checked)}
                  className="scale-110 mt-0.5"
                />
                <div>
                  <span className="font-bold text-gray-905 dark:text-slate-205 block leading-tight">2. Contract renewal notifications</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Dispatches emails 45 days prior to SLA expiry checklists triggers.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alertRisks}
                  onChange={(e) => setAlertRisks(e.target.checked)}
                  className="scale-110 mt-0.5"
                />
                <div>
                  <span className="font-bold text-gray-905 dark:text-slate-205 block leading-tight">3. Heavy compliance risk escalation warnings</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Auto registers audit reminders whenever risk indexes exceed 70%.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Connected enterprise databases integrations card rosters (66%) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border text-xs">
              <h3 className="font-black text-sm text-gray-[#475569] uppercase border-b pb-2 mb-3">Enterprise Systems Integrations</h3>
              <p className="text-gray-400 font-semibold">
                Authorize direct cloud accounts linkages to automate operations and financial record synchronizations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Oracle ERP cloud link', desc: 'Enterprise resources, items ledgers, and PO records registers sync.', connected: true },
                { name: 'QuickBooks Treasury direct', desc: 'Direct paid clearances, cash disbursals rosters, and VAT code audits.', connected: true },
                { name: 'DocuSign legal agreement keys', desc: 'Auto creates digital signed covenants, NDAs and terms agreements.', connected: false },
                { name: 'Slack alerts gateway dispatch', desc: 'Relays pipeline warning tags instantly to designated personnel channels.', connected: false }
              ].map((link, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#161B27] p-4 rounded border shadow-sm flex flex-col justify-between space-y-4 hover:shadow transition"
                >
                  <div className="space-y-1.5">
                    <strong className="text-sm font-black text-gray-905 dark:text-white block">{link.name}</strong>
                    <p className="text-gray-500 leading-relaxed font-semibold">{link.desc}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      link.connected ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-450'
                    }`}>
                      {link.connected ? 'Active Synchronized' : 'Inactive Gate'}
                    </span>
                    <button
                      onClick={() => {
                        addToast('success', 'Systems state updated', `Direct connections request sent for database mapping: ${link.name}.`);
                      }}
                      className="text-xs text-blue-600 hover:underline font-bold"
                    >
                      {link.connected ? 'Tune' : 'Connect Account &rarr;'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REVOLUTIONARY OPERATOR REGISTER DRAWER/DIALOUGE */}
      {inviteOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm" onClick={() => setInviteOpen(false)} />
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white dark:bg-[#161B27] border border-gray-250 dark:border-gray-803 rounded-md p-6 shadow-2xl z-50 flex flex-col font-sans">
            <div className="flex justify-between items-center pb-3 border-b mb-4 flex-shrink-0">
              <h2 className="text-sm font-black text-gray-955 dark:text-white uppercase">Invite Operating Procurement Staff</h2>
              <button onClick={() => setInviteOpen(false)} className="text-gray-450 hover:text-gray-901 font-serif text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleAddNewUser} className="space-y-4 text-xs font-sans">
              <div className="flex flex-col space-y-1 mr-1">
                <label className="font-bold text-gray-450 uppercase text-[10.5px]">Staff Legal Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Liam Fitzpatrick"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded focus:border-blue-500 text-gray-805 dark:text-white"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-450 uppercase text-[10.5px]">Corporate E-mail index *</label>
                <input
                  required
                  type="email"
                  placeholder="name@domain.com"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded focus:border-blue-405 text-gray-805 dark:text-white"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-450 uppercase text-[10.5px]">Access Level Role Allocation</label>
                <select
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] px-2 rounded font-semibold text-gray-805 dark:text-white"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="Procurement Analyst">Procurement Specialist Analyst</option>
                  <option value="Risk Inspector Auditor">Risk Assessor Inspector</option>
                  <option value="Compliance Advisor Officer">Compliance Advisor Officer</option>
                </select>
              </div>

              <div className="border-t pt-4 flex justify-end gap-2 pr-1 font-semibold">
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded"
                >
                  Invite Operator
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
