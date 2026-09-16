import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileClock,
  Filter,
  Globe2,
  Inbox,
  Layers3,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRound,
  X,
  Zap,
} from "lucide-react";

type QueueItem = {
  id: string;
  title: string;
  account: string;
  type: string;
  region: string;
  severity: "High" | "Medium" | "Low";
  age: string;
  amount: string;
  status: string;
};

const queueItems: QueueItem[] = [
  {
    id: "UW-48291",
    title: "Renewal pricing review",
    account: "Grafton Energy Holdings",
    type: "Property · Energy",
    region: "UK",
    severity: "High",
    age: "18m",
    amount: "£42.8m TIV",
    status: "Awaiting approval",
  },
  {
    id: "CL-11904",
    title: "FNOL coverage decision",
    account: "Morrow Logistics Inc.",
    type: "Marine cargo",
    region: "US",
    severity: "High",
    age: "34m",
    amount: "$680k reserve",
    status: "Evidence found",
  },
  {
    id: "DA-07712",
    title: "Bind authority exception",
    account: "Northbridge MGA",
    type: "Delegated authority",
    region: "EU",
    severity: "Medium",
    age: "1h",
    amount: "€12.4m GWP",
    status: "Needs human review",
  },
  {
    id: "UW-48177",
    title: "Sanctions screening match",
    account: "Alto Maritime GmbH",
    type: "Marine · Cargo",
    region: "EU",
    severity: "Medium",
    age: "2h",
    amount: "€8.1m limit",
    status: "Escalated",
  },
  {
    id: "PO-02014",
    title: "Accumulation threshold",
    account: "Midlands wind corridor",
    type: "Portfolio signal",
    region: "UK",
    severity: "Low",
    age: "3h",
    amount: "7.4% concentration",
    status: "Watching",
  },
];

const navItems = [
  { label: "Underwriting", icon: FileCheck2, count: "18" },
  { label: "Claims", icon: Inbox, count: "7" },
  { label: "Delegated Authority", icon: BriefcaseBusiness, count: "4" },
  { label: "Portfolio", icon: Layers3, count: "" },
  { label: "Regulatory & Controls", icon: ShieldCheck, count: "3" },
];

function RegionPill({ region }: { region: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#d6e0dc] bg-[#f7faf8] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#45605d]">
      <Globe2 size={11} strokeWidth={1.8} />
      {region}
    </span>
  );
}

function SignalBar({
  value,
  color = "#2e8378",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e4ece8]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function StatusDot({ status }: { status: QueueItem["severity"] }) {
  const colors = {
    High: "bg-[#d07657]",
    Medium: "bg-[#c38b45]",
    Low: "bg-[#5b9a8d]",
  };
  return <span className={`h-2 w-2 rounded-full ${colors[status]}`} aria-label={`${status} priority`} />;
}

function MetricCard({
  label,
  value,
  delta,
  direction,
  note,
  tint,
}: {
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  note: string;
  tint: string;
}) {
  const isDown = direction === "down";
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#dce5e0] bg-[#fffdf9] p-4 shadow-[0_2px_8px_rgba(25,54,52,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9dc0b5] hover:shadow-[0_8px_22px_rgba(25,54,52,0.08)]">
      <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-[2.5rem] opacity-70" style={{ backgroundColor: tint }} />
      <div className="relative">
        <div className="mb-3 flex items-start justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6f817b]">{label}</span>
          <Activity size={15} className="text-[#7b9790]" />
        </div>
        <div className="flex items-end gap-2">
          <p className="font-mono text-[25px] font-semibold leading-none tracking-[-0.05em] text-[#17353a]">{value}</p>
          <span className={`mb-0.5 inline-flex items-center gap-0.5 text-[11px] font-semibold ${isDown ? "text-[#aa5f49]" : "text-[#3d7d71]"}`}>
            {isDown ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
            {delta}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-[#81928c]">{note}</p>
      </div>
    </div>
  );
}

function InsuranceWorkbench() {
  const [activeNav, setActiveNav] = useState("Underwriting");
  const [activeFilter, setActiveFilter] = useState("My queue");
  const [selectedId, setSelectedId] = useState("UW-48291");
  const [isExplainerOpen, setIsExplainerOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showAllQueue, setShowAllQueue] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const selected = useMemo(
    () => queueItems.find((item) => item.id === selectedId) ?? queueItems[0],
    [selectedId],
  );
  const visibleQueue = showAllQueue ? queueItems : queueItems.slice(0, 4);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#edf2ee] font-sans text-[#17353a] selection:bg-[#bcd9ce] selection:text-[#17353a]">
      <div className="mx-auto min-h-[100dvh] max-w-[1500px] bg-[#f7f8f4] shadow-[0_0_50px_rgba(30,63,60,0.12)]">
        <header className="flex h-[68px] items-center justify-between border-b border-[#d8e1dc] bg-[#fbfcf8] px-5">
          <div className="flex min-w-0 items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#173b3d] shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)]">
                <span className="relative block h-4 w-4 rotate-45 rounded-[4px] border-2 border-[#d8ad68]">
                  <span className="absolute -bottom-1 left-1/2 h-2 w-[2px] -translate-x-1/2 bg-[#d8ad68]" />
                </span>
              </div>
              <div className="leading-none">
                <div className="text-[14px] font-bold tracking-[-0.02em] text-[#17353a]">Harborline</div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#7b918b]">Lumen workbench</div>
              </div>
            </div>
            <div className="hidden h-7 w-px bg-[#dce4df] lg:block" />
            <div className="hidden items-center gap-2 text-[12px] text-[#6f817b] lg:flex">
              <span className="font-semibold text-[#3d5755]">Operations</span>
              <ChevronRight size={13} />
              <span>Decision centre</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              aria-label="Search"
              onClick={() => notify("Search is ready for accounts, policies and controls")}
              className="hidden h-9 items-center gap-2 rounded-lg border border-[#d8e2dc] bg-[#f6f8f4] px-3 text-[11px] font-medium text-[#66807a] transition hover:border-[#98b8ad] hover:bg-[#eef5f0] focus:outline-none focus:ring-2 focus:ring-[#70a194]/40 sm:flex"
            >
              <Search size={14} />
              <span>Search workbench</span>
              <span className="ml-2 rounded border border-[#d6dfda] bg-white px-1.5 py-0.5 font-mono text-[9px] text-[#8ca09a]">⌘ K</span>
            </button>
            <button
              aria-label="Help"
              onClick={() => notify("Help centre opened")}
              className="grid h-9 w-9 place-items-center rounded-lg text-[#66807a] transition hover:bg-[#edf4ef] hover:text-[#244f4d] focus:outline-none focus:ring-2 focus:ring-[#70a194]/40"
            >
              <CircleHelp size={17} />
            </button>
            <button
              aria-label="Notifications"
              onClick={() => notify("You have 3 new control alerts")}
              className="relative grid h-9 w-9 place-items-center rounded-lg text-[#66807a] transition hover:bg-[#edf4ef] hover:text-[#244f4d] focus:outline-none focus:ring-2 focus:ring-[#70a194]/40"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c76c4d] ring-2 ring-[#fbfcf8]" />
            </button>
            <div className="ml-1 flex items-center gap-2 border-l border-[#dce4df] pl-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#dce9df] text-[11px] font-bold text-[#275852]">AM</div>
              <div className="hidden leading-tight sm:block">
                <div className="text-[11px] font-semibold text-[#284744]">Ava Mitchell</div>
                <div className="text-[10px] text-[#80918b]">Senior underwriter</div>
              </div>
              <ChevronDown size={14} className="text-[#8ca09a]" />
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100dvh-68px)]">
          <aside className="hidden w-[218px] shrink-0 flex-col border-r border-[#284f4d] bg-[#173b3d] text-[#dce9df] md:flex">
            <div className="border-b border-[#315c58] px-4 py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#86a9a0]">Your workspaces</span>
                <button onClick={() => notify("Workspace switcher opened")} aria-label="Switch workspace" className="text-[#86a9a0] hover:text-white">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <button onClick={() => notify("Northstar Insurance selected")} className="flex w-full items-center justify-between rounded-lg border border-[#47716a] bg-[#214947] px-3 py-2.5 text-left transition hover:bg-[#28544f]">
                <span>
                  <span className="block text-[12px] font-semibold text-[#f3f7ef]">Northstar Insurance</span>
                  <span className="mt-1 block text-[10px] text-[#a3bdb3]">Global underwriting</span>
                </span>
                <ChevronDown size={14} className="text-[#a3bdb3]" />
              </button>
            </div>
            <nav className="px-3 py-4" aria-label="Primary navigation">
              <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#769891]">Command centre</p>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.label === activeNav;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveNav(item.label);
                        notify(`${item.label} view selected`);
                      }}
                      className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 text-left text-[11px] transition focus:outline-none focus:ring-2 focus:ring-[#c3dfcf]/50 ${isActive ? "bg-[#d7e9dc] font-semibold text-[#173b3d]" : "text-[#b4cbc1] hover:bg-[#214947] hover:text-[#f0f6ef]"}`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon size={15} strokeWidth={isActive ? 2 : 1.7} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.count && <span className={`rounded-md px-1.5 py-0.5 font-mono text-[9px] ${isActive ? "bg-[#bed6c6] text-[#315c58]" : "bg-[#214947] text-[#8eaaa0]"}`}>{item.count}</span>}
                    </button>
                  );
                })}
              </div>
            </nav>
            <div className="mt-auto border-t border-[#315c58] p-3">
              <div className="mb-3 rounded-lg bg-[#214947] p-3">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-[#dce9df]">
                  <Bot size={14} className="text-[#d8ad68]" />
                  Lumen agent
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#82c0a4]" />
                </div>
                <p className="text-[10px] leading-relaxed text-[#9ebbb1]">Monitoring 42 open decisions across 3 regions.</p>
                <button onClick={() => notify("Agent activity log opened")} className="mt-2 text-[10px] font-semibold text-[#d8ad68] hover:text-[#f0cf96]">View activity log</button>
              </div>
              <button onClick={() => notify("Settings opened")} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] text-[#9fbab0] transition hover:bg-[#214947] hover:text-white">
                <SlidersHorizontal size={14} />
                Workspace settings
              </button>
            </div>
          </aside>

          <main className="min-w-0 flex-1 bg-[#f7f8f4]">
            <div className="border-b border-[#dce5e0] bg-[#fbfcf8] px-5 pt-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#7d928a]">
                    <span>Tuesday, 14 May 2024</span>
                    <span className="h-1 w-1 rounded-full bg-[#b3c2ba]" />
                    <span>09:42 BST</span>
                  </div>
                  <h1 className="font-serif text-[28px] font-semibold tracking-[-0.04em] text-[#17353a]">Good morning, Ava.</h1>
                  <p className="mt-1 text-[12px] text-[#738680]">Here&apos;s what needs your judgement today.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => notify("New decision workflow started")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#c68453] px-3.5 text-[11px] font-bold text-[#fffaf2] shadow-[0_3px_7px_rgba(161,93,55,.2)] transition hover:bg-[#b97345] focus:outline-none focus:ring-2 focus:ring-[#c68453]/40">
                    <Plus size={15} />
                    New decision
                  </button>
                  <button onClick={() => notify("Queue refreshed")} aria-label="Refresh queue" className="grid h-9 w-9 place-items-center rounded-lg border border-[#d7e2dc] bg-[#fffdf9] text-[#66807a] transition hover:border-[#9ebcb1] hover:text-[#244f4d] focus:outline-none focus:ring-2 focus:ring-[#70a194]/40">
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-5 flex gap-6 overflow-x-auto" role="tablist" aria-label="Workbench views">
                {["Overview", "Decision queue", "Signals", "Activity"].map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={tab === "Overview"}
                    onClick={() => notify(`${tab} view selected`)}
                    className={`relative whitespace-nowrap pb-3 text-[11px] font-semibold transition ${tab === "Overview" ? "text-[#244f4d]" : "text-[#82938d] hover:text-[#45605d]"}`}
                  >
                    {tab}
                    {tab === "Decision queue" && <span className="ml-1.5 rounded bg-[#f2e7d8] px-1.5 py-0.5 text-[9px] text-[#9a6839]">18</span>}
                    {tab === "Overview" && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#c68453]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 p-5">
              <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Operational summary">
                <MetricCard label="Open decisions" value="42" delta="8.4%" direction="down" note="vs. 45 last Tuesday" tint="#e4eee7" />
                <MetricCard label="Avg. time to bind" value="2h 18m" delta="16.2%" direction="up" note="faster than target" tint="#e8eee4" />
                <MetricCard label="AI recommendations" value="73.6%" delta="4.8%" direction="up" note="accepted without changes" tint="#f3eadb" />
                <MetricCard label="Control exceptions" value="06" delta="2" direction="down" note="2 need action today" tint="#f3e2db" />
              </section>

              <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,.75fr)]">
                <section className="overflow-hidden rounded-xl border border-[#dce5e0] bg-[#fffdf9] shadow-[0_2px_8px_rgba(25,54,52,0.04)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e9e4] px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e4f0e9] text-[#39756b]"><Target size={16} /></div>
                      <div>
                        <h2 className="text-[13px] font-bold text-[#244744]">Priority work queue</h2>
                        <p className="mt-0.5 text-[10px] text-[#84958f]">Decisions that benefit from your judgement</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => notify("Queue filters opened")} className="inline-flex items-center gap-1.5 rounded-md border border-[#dce5df] px-2.5 py-1.5 text-[10px] font-semibold text-[#627b74] transition hover:border-[#a5c0b5] hover:bg-[#f2f7f3]"><Filter size={12} /> Filter</button>
                      <button onClick={() => setShowAllQueue((value) => !value)} className="text-[10px] font-semibold text-[#3c756c] hover:text-[#265952]">{showAllQueue ? "Show less" : "View all 18"}</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 border-b border-[#e5ece7] px-4 py-2.5">
                    {["My queue", "Needs review", "All work"].map((filter) => (
                      <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition ${activeFilter === filter ? "bg-[#e5f0e9] text-[#326b62]" : "text-[#82938d] hover:bg-[#f3f7f3] hover:text-[#45605d]"}`}>{filter}{filter === "Needs review" && <span className="ml-1.5 font-mono text-[9px]">6</span>}</button>
                    ))}
                    <span className="ml-auto hidden items-center gap-1 text-[10px] text-[#97a59f] sm:flex"><Zap size={12} className="text-[#c68453]" /> Lumen ranked</span>
                  </div>
                  <div className="divide-y divide-[#e7ede8]">
                    {visibleQueue.map((item) => {
                      const isSelected = item.id === selectedId;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`group flex w-full items-center gap-3 px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#70a194]/40 ${isSelected ? "bg-[#f1f7f2]" : "hover:bg-[#fafbf8]"}`}
                        >
                          <div className="flex w-5 justify-center"><StatusDot status={item.severity} /></div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`truncate text-[11px] font-semibold ${isSelected ? "text-[#255b57]" : "text-[#38534f]"}`}>{item.title}</span>
                              <span className="font-mono text-[9px] text-[#9aa8a2]">{item.id}</span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-[#7d9089]">
                              <span className="truncate">{item.account}</span>
                              <span className="hidden h-1 w-1 rounded-full bg-[#c5d0c9] sm:block" />
                              <span>{item.type}</span>
                            </div>
                          </div>
                          <div className="hidden text-right sm:block">
                            <div className="font-mono text-[10px] font-semibold text-[#58716b]">{item.amount}</div>
                            <div className="mt-1 flex items-center justify-end gap-2"><RegionPill region={item.region} /><span className="font-mono text-[9px] text-[#9aa8a2]">{item.age}</span></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`hidden rounded-md px-2 py-1 text-[9px] font-semibold lg:block ${item.severity === "High" ? "bg-[#f5e5df] text-[#a7604d]" : item.severity === "Medium" ? "bg-[#f5eddc] text-[#9b733d]" : "bg-[#e5f0e9] text-[#4e8278]"}`}>{item.status}</span>
                            <ChevronRight size={15} className={`transition ${isSelected ? "text-[#3b8277]" : "text-[#c1cdc6] group-hover:text-[#6a8b82]"}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {showAllQueue && <div className="border-t border-[#e5ece7] bg-[#fbfcf8] px-4 py-2 text-center text-[10px] text-[#82938d]">14 more decisions are being ranked in the background</div>}
                </section>

                <section className="overflow-hidden rounded-xl border border-[#d5e2dc] bg-[#f0f6f1] shadow-[0_2px_8px_rgba(25,54,52,0.04)]">
                  <div className="border-b border-[#d7e5dc] bg-[#e8f2ea] px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#cde4d5] text-[#36756a]"><Sparkles size={16} /></div>
                        <div>
                          <div className="flex items-center gap-2"><h2 className="text-[13px] font-bold text-[#244744]">Lumen&apos;s recommendation</h2><span className="rounded bg-[#d5e8d9] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#4a8173]">87% confident</span></div>
                          <p className="mt-0.5 text-[10px] text-[#759087]">For {selected.id} · updated 2m ago</p>
                        </div>
                      </div>
                      <button onClick={() => setIsExplainerOpen((value) => !value)} aria-label={isExplainerOpen ? "Collapse recommendation" : "Expand recommendation"} className="rounded-md p-1 text-[#6f9086] hover:bg-[#dcebe0]"><ChevronDown size={16} className={isExplainerOpen ? "" : "-rotate-90"} /></button>
                    </div>
                  </div>
                  {isExplainerOpen && (
                    <div className="space-y-4 p-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#739087]">Recommended action</span>
                        <p className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-[#24544f]">Approve with a 7.5% rate increase</p>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-[#617971]">The account remains within appetite. Price movement protects the technical margin while preserving the relationship.</p>
                      </div>
                      <div className="rounded-lg border border-[#d5e4da] bg-[#f8fbf7] p-3">
                        <div className="mb-2.5 flex items-center justify-between"><span className="text-[10px] font-semibold text-[#52726a]">Why this recommendation</span><button onClick={() => notify("Full rationale opened")} className="text-[10px] font-semibold text-[#3a766b] hover:underline">View rationale</button></div>
                        <div className="space-y-2.5">
                          {[
                            ["Loss ratio trend", "Improved from 68% to 51% over 3 years", 82],
                            ["Exposure fit", "Within UK energy appetite and authority", 68],
                            ["Market signal", "Comparable renewals are up 6–9%", 74],
                          ].map(([label, text, value]) => (
                            <div key={label as string}>
                              <div className="mb-1 flex items-center justify-between gap-2 text-[10px]"><span className="font-semibold text-[#54716a]">{label}</span><span className="text-[#82958d]">{text}</span></div>
                              <SignalBar value={value as number} color="#5a9886" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg border border-[#eadfc8] bg-[#fbf6e9] p-2.5 text-[10px] leading-relaxed text-[#806845]">
                        <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#bd8745]" />
                        <span><strong className="font-semibold">Human checkpoint:</strong> confirm the flood sub-limit remains at £2m before binding.</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => notify(`${selected.id} approved and sent to bind queue`)} className="flex-1 rounded-lg bg-[#2f786d] px-3 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#27655d] focus:outline-none focus:ring-2 focus:ring-[#2f786d]/40"><Check size={14} className="mr-1.5 inline-block" />Approve recommendation</button>
                        <button onClick={() => notify("Recommendation sent back to Lumen")} className="rounded-lg border border-[#cbdcd2] bg-[#f8fbf7] px-3 py-2.5 text-[11px] font-semibold text-[#55726a] transition hover:border-[#9dbbae] hover:bg-[#eaf3ec] focus:outline-none focus:ring-2 focus:ring-[#70a194]/40">Adjust</button>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
                <section className="rounded-xl border border-[#dce5e0] bg-[#fffdf9] p-4 shadow-[0_2px_8px_rgba(25,54,52,0.04)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-[13px] font-bold text-[#244744]">Portfolio pulse</h2>
                      <p className="mt-0.5 text-[10px] text-[#84958f]">Signals Lumen is watching across your book</p>
                    </div>
                    <button onClick={() => notify("Portfolio analytics opened")} className="text-[10px] font-semibold text-[#3c756c] hover:text-[#265952]">Open portfolio <ChevronRight size={12} className="ml-0.5 inline" /></button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-[#e0e8e1] bg-[#f8faf7] p-3">
                      <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-semibold text-[#6d837b]">Gross written premium</span><ArrowUpRight size={14} className="text-[#4d8a7b]" /></div>
                      <div className="font-mono text-[19px] font-semibold text-[#2c5550]">$284.6m</div>
                      <div className="mt-1 text-[10px] text-[#6b8b7d]">+5.8% vs plan</div>
                      <div className="mt-3 flex h-7 items-end gap-1">{[35, 42, 39, 55, 48, 62, 68, 73, 70, 84, 80, 88].map((height, i) => <span key={i} className="flex-1 rounded-t-sm bg-[#8db8a4]" style={{ height: `${height}%`, opacity: i > 8 ? 1 : 0.55 }} />)}</div>
                    </div>
                    <div className="rounded-lg border border-[#e0e8e1] bg-[#f8faf7] p-3">
                      <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-semibold text-[#6d837b]">Cat exposure</span><AlertCircle size={14} className="text-[#c4824e]" /></div>
                      <div className="font-mono text-[19px] font-semibold text-[#2c5550]">£18.2m</div>
                      <div className="mt-1 text-[10px] text-[#a66f48]">2.4% above threshold</div>
                      <div className="mt-3"><div className="mb-1 flex justify-between text-[9px] text-[#8a9a92]"><span>Accumulation</span><span>102.4%</span></div><SignalBar value={96} color="#c68453" /></div>
                    </div>
                    <div className="rounded-lg border border-[#e0e8e1] bg-[#f8faf7] p-3">
                      <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-semibold text-[#6d837b]">Model health</span><ShieldCheck size={14} className="text-[#4d8a7b]" /></div>
                      <div className="font-mono text-[19px] font-semibold text-[#2c5550]">98.2%</div>
                      <div className="mt-1 text-[10px] text-[#6b8b7d]">within governance band</div>
                      <div className="mt-3 flex items-center gap-1.5"><div className="h-2 flex-1 rounded-full bg-[#dcece1]"><div className="h-2 w-[98%] rounded-full bg-[#559381]" /></div><span className="font-mono text-[9px] text-[#638077]">Live</span></div>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-[#dce5e0] bg-[#fffdf9] p-4 shadow-[0_2px_8px_rgba(25,54,52,0.04)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div><h2 className="text-[13px] font-bold text-[#244744]">Recent activity</h2><p className="mt-0.5 text-[10px] text-[#84958f]">Across your workspace</p></div>
                    <button onClick={() => notify("Activity feed opened")} aria-label="More activity options" className="text-[#80958e] hover:text-[#3f7169]"><MoreHorizontal size={16} /></button>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      { icon: Check, color: "bg-[#e3f0e7] text-[#438070]", title: "You approved", body: "Westfield Retail renewal", time: "12 min ago" },
                      { icon: Bot, color: "bg-[#e9eef6] text-[#5d7697]", title: "Lumen flagged", body: "GDPR consent gap in 3 FNOLs", time: "28 min ago" },
                      { icon: UserRound, color: "bg-[#f2eadc] text-[#a67542]", title: "N. Fraser commented", body: "Northbridge bind authority", time: "41 min ago" },
                      { icon: FileClock, color: "bg-[#f1e5df] text-[#a96651]", title: "Control due today", body: "Lloyd's DA bordereaux", time: "1h ago" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return <div key={item.title} className="flex items-start gap-2.5"><div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${item.color}`}><Icon size={12} /></div><div className="min-w-0 flex-1"><div className="text-[10px] font-semibold text-[#49645d]">{item.title}</div><div className="truncate text-[10px] text-[#7c8f88]">{item.body}</div></div><span className="whitespace-nowrap text-[9px] text-[#a0ada7]">{item.time}</span></div>;
                    })}
                  </div>
                </section>
              </div>

              <section className="rounded-xl border border-[#d8e4dc] bg-[#edf5ef] px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#d6e9db] text-[#3e7e72]"><LockKeyhole size={15} /></div>
                  <div className="min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h2 className="text-[11px] font-bold text-[#315b54]">Controls are in good shape</h2><span className="rounded-full bg-[#d7eadc] px-2 py-0.5 text-[9px] font-semibold text-[#4c8577]">94% on track</span></div>
                    <p className="mt-0.5 text-[10px] text-[#718a81]">US sanctions screening, UK GDPR and Solvency II checks are monitoring normally. Two exceptions need attention.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RegionPill region="US" /><RegionPill region="UK" /><RegionPill region="EU" />
                    <button onClick={() => notify("Control centre opened")} className="ml-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#3a766b] hover:text-[#265952]">Review controls <ChevronRight size={12} /></button>
                  </div>
                </div>
              </section>

              <footer className="flex flex-wrap items-center justify-between gap-3 pb-1 text-[10px] text-[#94a29c]">
                <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#6da18c]" />All systems operational</span><span className="text-[#c1cbc5]">·</span><span>Last synced 2 minutes ago</span></div>
                <div className="flex items-center gap-3"><button onClick={() => notify("Audit trail opened")} className="hover:text-[#52766d]">Audit trail</button><button onClick={() => setIsPaused((value) => !value)} className="inline-flex items-center gap-1 hover:text-[#52766d]">{isPaused ? <Zap size={11} /> : <Clock3 size={11} />}{isPaused ? "Resume live updates" : "Pause live updates"}</button></div>
              </footer>
            </div>
          </main>
        </div>
      </div>
      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-[#345b56] bg-[#173b3d] px-4 py-3 text-[11px] font-semibold text-[#ecf5ef] shadow-[0_10px_26px_rgba(24,56,56,.22)]"><Check size={14} className="text-[#9bd0b0]" />{toast}<button aria-label="Dismiss notification" onClick={() => setToast(null)} className="ml-2 text-[#a5c4b7] hover:text-white"><X size={14} /></button></div>}
    </div>
  );
}

export default InsuranceWorkbench;