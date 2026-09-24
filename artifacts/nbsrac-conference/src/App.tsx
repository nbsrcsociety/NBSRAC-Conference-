import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Filter,
  Mail,
  MapPin,
  Menu,
  Send,
  Users,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { conferenceConfig } from '@/data/conference';

const queryClient = new QueryClient();
const tba = 'To be announced';

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatVenueCity() {
  const values = [conferenceConfig.event.venue, conferenceConfig.event.city].filter(
    (value) => value !== 'To be announced',
  );
  return values.length ? values.join(' · ') : 'To be announced';
}

function Monogram() {
  return (
    <span className="flex items-center gap-3" data-testid="brand-mark">
      <span className="flex h-9 w-9 items-center justify-center border border-[#D7AC5A] text-sm font-bold tracking-[-0.08em] text-[#112A46]">NB</span>
      <span className="hidden leading-tight sm:block">
        <span className="block text-[0.72rem] font-extrabold tracking-[0.12em] text-[#112A46]">NBSRAC</span>
        <span className="block text-[0.63rem] font-medium tracking-[0.04em] text-[#112A46]/60">North Bengal Society</span>
      </span>
    </span>
  );
}

function Header({ activeSection }: { activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9D0BF]/80 bg-[#F8F5EE]/95 backdrop-blur-sm" data-testid="site-header">
      <div className="site-container flex h-[4.7rem] items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <a href="#top" onClick={() => setMobileOpen(false)} aria-label="NBSRAC conference home" data-testid="link-home"><Monogram /></a>
          <a href={conferenceConfig.societyUrl} target="_blank" rel="noopener noreferrer" className="max-w-[9rem] text-[0.62rem] leading-4 text-[#52677F] hover:underline" data-testid="link-society-header">
            An initiative of<br /><span className="font-semibold text-[#112A46]">NBSRAC Academic Society</span>
          </a>
        </div>
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Main navigation" data-testid="desktop-navigation">
          {conferenceConfig.nav.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              className="nav-link whitespace-nowrap text-[0.61rem] font-semibold tracking-[0.07em] uppercase"
              aria-current={activeSection === item.id ? 'true' : undefined}
              onClick={() => setMobileOpen(false)}
              data-testid={`link-nav-${item.id}`}
            >
              {item.label}
            </a>
          ))}
          <a href="#registration" className="ml-1 inline-flex items-center gap-2 whitespace-nowrap border border-[#112A46] bg-[#112A46] px-3 py-2.5 text-[0.61rem] font-bold tracking-[0.07em] uppercase text-[#F8F5EE] transition-colors hover:border-[#3E9B9A] hover:bg-[#3E9B9A]" data-testid="link-register-header">
            Register <ArrowUpRight size={13} strokeWidth={1.8} />
          </a>
        </nav>
        <button type="button" className="flex h-10 w-10 items-center justify-center border border-[#D9D0BF] xl:hidden" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <nav id="mobile-navigation" className="border-t border-[#D9D0BF] bg-[#F8F5EE] px-4 py-4 xl:hidden" aria-label="Mobile navigation">
          <div className="site-container grid gap-1 sm:grid-cols-2">
            {conferenceConfig.nav.map((item) => (
              <a href={`#${item.id}`} key={item.id} className="flex items-center justify-between border-b border-[#D9D0BF]/70 py-3 text-sm font-semibold" aria-current={activeSection === item.id ? 'true' : undefined} onClick={() => go(item.id)} data-testid={`link-mobile-nav-${item.id}`}>
                {item.label}<ArrowDownRight size={15} className="text-[#3E9B9A]" />
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function SectionIntro({ id, label, title, intro, dark = false }: { id: string; label: string; title: string; intro?: string; dark?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`eyebrow mb-5 flex items-center gap-3 ${dark ? 'text-[#D7AC5A]' : ''}`} data-testid={`text-section-label-${id}`}><span className={`h-px w-8 ${dark ? 'bg-[#D7AC5A]' : 'bg-[#3E9B9A]'}`} />{label}</p>
      <h2 id={id} className={`serif-heading text-4xl leading-[0.98] sm:text-5xl md:text-[4.25rem] ${dark ? 'text-[#F8F5EE]' : 'text-[#112A46]'}`} data-testid={`text-section-title-${id}`}>{title}</h2>
      {intro && <p className={`mt-6 max-w-xl text-base leading-7 ${dark ? 'text-[#F8F5EE]/70' : 'text-[#112A46]/70'}`}>{intro}</p>}
    </div>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const startDate = conferenceConfig.event.startDate;

  useEffect(() => {
    if (!startDate) return undefined;
    const update = () => setRemaining(Math.max(0, new Date(startDate).getTime() - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [startDate]);

  if (!startDate || remaining === null) {
    return <div className="border-l-2 border-[#D7AC5A] pl-4" data-testid="countdown-placeholder"><p className="eyebrow text-[#112A46]/55">Countdown</p><p className="mt-2 font-mono text-sm">Dates to be announced</p></div>;
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  return <div className="border-l-2 border-[#D7AC5A] pl-4" data-testid="countdown-timer"><p className="eyebrow text-[#112A46]/55">Countdown to start</p><p className="mt-2 font-mono text-sm">{days}d {hours}h {minutes}m</p></div>;
}

function Home() {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedTrack, setSelectedTrack] = useState('All tracks');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', affiliation: '', ticketType: '' });
  const [registerNotice, setRegisterNotice] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactNotice, setContactNotice] = useState('');

  useEffect(() => {
    const sections = conferenceConfig.nav.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registerForm.name.trim() || !isValidEmail(registerForm.email) || !registerForm.affiliation.trim() || !registerForm.ticketType) {
      setRegisterNotice('Please add your name, a valid email, affiliation and ticket type to continue.');
      return;
    }
    setRegisterNotice('Validation complete. Nothing was sent or stored; this form has no backend or payment connection.');
  };

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactForm.name.trim() || !isValidEmail(contactForm.email) || contactForm.message.trim().length < 10) {
      setContactNotice('Please complete all fields and write a message of at least 10 characters.');
      return;
    }
    setContactNotice(`Your message has not been sent. Please email ${conferenceConfig.email} directly.`);
  };

  return (
    <div id="top" className="min-h-[100dvh] bg-[#F8F5EE] text-[#112A46]">
      <Header activeSection={activeSection} />
      <main>
        <section className="relative overflow-hidden border-b border-[#D9D0BF] py-16 md:py-24" aria-labelledby="hero-title">
          <div className="site-container grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div className="relative z-10">
              <p className="eyebrow fade-up mb-7 flex items-center gap-3"><span className="h-px w-8 bg-[#D7AC5A]" />Conference website · details forthcoming</p>
              <p className="fade-up font-mono text-[0.68rem] uppercase tracking-[0.13em] text-[#3E9B9A]" data-testid="text-conference-edition">{conferenceConfig.event.edition}</p>
              <h1 id="hero-title" className="serif-heading fade-up mt-4 max-w-3xl text-[3.7rem] leading-[0.88] text-[#112A46] sm:text-7xl md:text-[6.7rem]" data-testid="text-hero-title">{conferenceConfig.event.conferenceName}</h1>
              <p className="fade-up-delay mt-5 max-w-xl font-serif text-2xl italic leading-tight text-[#112A46]/72 sm:text-3xl" data-testid="text-hero-tagline">{conferenceConfig.event.tagline}</p>
              <p className="fade-up-delay mt-7 max-w-xl text-base leading-7 text-[#112A46]/72 sm:text-lg">{conferenceConfig.hero.intro}</p>
              <div className="fade-up-delay-2 mt-9 flex flex-wrap items-center gap-4">
                <button type="button" onClick={() => scrollToSection('registration')} className="inline-flex items-center gap-3 bg-[#112A46] px-5 py-3.5 text-sm font-bold text-[#F8F5EE] transition-colors hover:bg-[#3E9B9A]" data-testid="button-hero-register">Register now <ArrowUpRight size={16} /></button>
                <button type="button" onClick={() => scrollToSection('cfp')} className="inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold underline decoration-[#D7AC5A] underline-offset-8 hover:text-[#3E9B9A]" data-testid="button-hero-cfp">Call for papers <ArrowDownRight size={16} /></button>
              </div>
              <p className="mt-8 text-xs font-semibold text-[#112A46]/65" data-testid="text-host-line">Hosted by <a href={conferenceConfig.societyUrl} target="_blank" rel="noopener noreferrer" className="text-[#3E9B9A] underline underline-offset-4">{conferenceConfig.hero.hostLine}</a></p>
            </div>
            <div className="relative mx-auto w-full max-w-[31rem]">
              <div className="absolute -right-2 -top-3 h-20 w-20 border-r border-t border-[#D7AC5A] sm:-right-8 sm:-top-7" />
              <div className="paper-grid relative border border-[#D9D0BF] bg-[#EDE8DD] p-4 shadow-[14px_14px_0_#D7AC5A] sm:p-7">
                <div className="flex items-start justify-between border-b border-[#112A46]/20 pb-6">
                  <div><span className="font-mono text-[0.62rem] tracking-[0.18em] text-[#112A46]/60">NBSRAC / ACADEMIC SOCIETY</span><p className="serif-heading mt-3 text-3xl text-[#112A46]">Conference record</p></div>
                  <span className="flex h-9 w-9 items-center justify-center border border-[#112A46]/30 text-xs font-bold tracking-[-0.08em]">NB</span>
                </div>
                <div className="grid gap-6 py-7 sm:grid-cols-2">
                  <div className="flex gap-3"><CalendarDays size={18} className="mt-0.5 shrink-0 text-[#3E9B9A]" strokeWidth={1.6} /><div><p className="eyebrow text-[#112A46]/50">Dates</p><p className="mt-1 text-sm font-semibold" data-testid="text-hero-dates">{conferenceConfig.event.dateLabel}</p></div></div>
                  <div className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-[#3E9B9A]" strokeWidth={1.6} /><div><p className="eyebrow text-[#112A46]/50">Venue / city</p><p className="mt-1 text-sm font-semibold" data-testid="text-hero-venue">{formatVenueCity()}</p></div></div>
                  <div className="flex gap-3"><FileText size={18} className="mt-0.5 shrink-0 text-[#3E9B9A]" strokeWidth={1.6} /><div><p className="eyebrow text-[#112A46]/50">Mode</p><p className="mt-1 text-sm font-semibold" data-testid="text-hero-mode">{conferenceConfig.event.mode}</p></div></div>
                  <Countdown />
                </div>
                <div className="border-t border-[#112A46]/20 pt-5"><p className="font-mono text-[0.66rem] leading-5 text-[#112A46]/60">Formal event details will be published as they are confirmed.</p></div>
              </div>
              <p className="mt-9 text-right font-mono text-[0.62rem] tracking-[0.12em] text-[#112A46]/50">NBSRAC OFFICE · {conferenceConfig.location.toUpperCase()}</p>
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-20 border-b border-[#D9D0BF] py-20 md:py-28" aria-labelledby="about-title">
          <div className="site-container">
              <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]"><SectionIntro id="about-title" label={conferenceConfig.about.label} title={conferenceConfig.about.title} />
              <div className="grid gap-10 text-base leading-7 text-[#112A46]/72 sm:grid-cols-[1fr_0.9fr]">
                <div><div className="mb-8 border-l-2 border-[#D7AC5A] pl-5"><p className="eyebrow mb-2">Theme</p><p className="serif-heading text-3xl text-[#112A46]" data-testid="text-about-theme">{conferenceConfig.about.theme}</p></div><div><p className="eyebrow mb-3">Hosting society</p><p>{conferenceConfig.about.hostingNote}</p></div></div>
                <div className="space-y-8"><div><p className="eyebrow mb-3">Objectives</p><ul className="space-y-3">{conferenceConfig.about.objectives.map((objective, index) => <li key={index} className="flex gap-3 text-sm leading-6" data-testid={`text-objective-${index}`}><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3E9B9A]" />{objective}</li>)}</ul></div><div><p className="eyebrow mb-3">Who should attend</p><p className="text-sm" data-testid="text-about-audience">{conferenceConfig.about.audience}</p></div></div>
              </div>
              <div className="mt-12 grid gap-6 border-t border-[#D9D0BF] pt-7 md:grid-cols-3" role="group" aria-label="Host society profile">
                <div><p className="eyebrow mb-2">Society name & expansion</p><p className="text-sm leading-6 text-[#112A46]/70">{conferenceConfig.about.hostSociety.fullNameAndExpansion}</p></div>
                <div><p className="eyebrow mb-2">Society mission</p><p className="text-sm leading-6 text-[#112A46]/70">{conferenceConfig.about.hostSociety.mission}</p></div>
                <div><p className="eyebrow mb-2">Society focus areas</p><p className="text-sm leading-6 text-[#112A46]/70">{conferenceConfig.about.hostSociety.focusAreas}</p></div>
              </div>
            </div>
            {!conferenceConfig.about.firstEdition && conferenceConfig.about.pastEditionHighlights.length > 0 && <div className="mt-16 border-t border-[#D9D0BF] pt-8"><p className="eyebrow mb-5">Past-edition highlights</p><div className="grid gap-4 sm:grid-cols-3">{conferenceConfig.about.pastEditionHighlights.map((highlight) => <p key={highlight} className="text-sm">{highlight}</p>)}</div></div>}
          </div>
        </section>

        <section id="cfp" className="scroll-mt-20 bg-[#EDE8DD] py-20 md:py-28" aria-labelledby="cfp-title">
          <div className="site-container">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]"><SectionIntro id="cfp-title" label={conferenceConfig.cfp.label} title={conferenceConfig.cfp.title} intro={conferenceConfig.cfp.intro} />
              <div>
                <div className="mb-10"><p className="eyebrow mb-4">Topics / tracks</p><div className="grid gap-3 sm:grid-cols-3">{conferenceConfig.cfp.tracks.map((track, index) => <div key={index} className="border border-[#112A46]/20 p-4" data-testid={`card-cfp-track-${index}`}><span className="font-mono text-[0.65rem] text-[#3E9B9A]">0{index + 1}</span><p className="mt-5 text-sm font-semibold">{track}</p></div>)}</div></div>
                <div className="grid gap-10 md:grid-cols-2"><div><p className="eyebrow mb-4">Submission & formatting</p><ul className="space-y-3 text-sm leading-6">{conferenceConfig.cfp.guidelines.map((item, index) => <li key={index} className="flex gap-3 border-b border-[#112A46]/15 pb-3" data-testid={`text-cfp-guideline-${index}`}><span className="text-[#3E9B9A]">—</span>{item}</li>)}</ul></div><div><p className="eyebrow mb-4">Important dates</p><div className="border-t border-[#112A46]/20">{conferenceConfig.cfp.importantDates.map(([label, value], index) => <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#112A46]/20 py-3 text-sm" data-testid={`row-cfp-date-${index}`}><span>{label}</span><span className="font-mono text-[0.65rem] uppercase text-[#112A46]/55">{value}</span></div>)}</div></div></div>
                <div className="mt-10 flex flex-col gap-6 border-t border-[#112A46]/20 pt-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow mb-2">Proceedings / publication</p><p className="text-sm text-[#112A46]/65" data-testid="text-cfp-proceedings">{conferenceConfig.cfp.proceedings}</p></div><div className="text-left sm:text-right"><button type="button" disabled={!conferenceConfig.cfp.submitPaperEnabled} className="inline-flex cursor-not-allowed items-center gap-2 border border-[#112A46]/30 px-4 py-3 text-sm font-bold text-[#112A46]/45" aria-disabled="true" title="Submission destination to be announced" data-testid="button-submit-paper">Submit paper <ExternalLink size={14} /></button><p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.07em] text-[#112A46]/50">Destination to be announced</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="speakers" className="scroll-mt-20 border-b border-[#D9D0BF] py-20 md:py-28" aria-labelledby="speakers-title">
          <div className="site-container"><SectionIntro id="speakers-title" label={conferenceConfig.speakers.label} title={conferenceConfig.speakers.title} intro={conferenceConfig.speakers.intro} /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{conferenceConfig.speakers.people.map((person, index) => <article key={index} className="border border-[#D9D0BF] bg-[#EDE8DD]/50 p-5" data-testid={`card-speaker-${index}`}><div className="flex h-14 w-14 items-center justify-center border border-[#D7AC5A] font-serif text-2xl text-[#112A46]">{person.initials}</div><p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[#3E9B9A]">{person.role}</p><h3 className="serif-heading mt-2 text-2xl">{person.name}</h3><dl className="mt-5 space-y-3 border-t border-[#D9D0BF] pt-4 text-xs leading-5 text-[#112A46]/65"><div><dt className="font-semibold text-[#112A46]">Title</dt><dd>{person.title}</dd></div><div><dt className="font-semibold text-[#112A46]">Affiliation</dt><dd>{person.affiliation}</dd></div><div><dt className="font-semibold text-[#112A46]">Talk title</dt><dd>{person.talk}</dd></div><div><dt className="font-semibold text-[#112A46]">Bio</dt><dd>{person.bio}</dd></div></dl></article>)}</div></div>
        </section>

        <section id="schedule" className="scroll-mt-20 border-b border-[#D9D0BF] bg-[#EDE8DD] py-20 md:py-28" aria-labelledby="schedule-title">
          <div className="site-container"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><SectionIntro id="schedule-title" label={conferenceConfig.schedule.label} title={conferenceConfig.schedule.title} intro={conferenceConfig.schedule.intro} /><label className="flex items-center gap-3 text-sm font-semibold"><Filter size={16} className="text-[#3E9B9A]" />Filter by track<select value={selectedTrack} onChange={(event) => setSelectedTrack(event.target.value)} className="field min-w-44 py-2" data-testid="select-schedule-track"><option>All tracks</option>{conferenceConfig.schedule.tracks.map((track) => <option key={track}>{track}</option>)}</select></label></div><div className="mt-12 space-y-10">{conferenceConfig.schedule.days.map((day, dayIndex) => <div key={day.label} data-testid={`schedule-day-${dayIndex}`}><div className="mb-4 flex items-baseline gap-4"><h3 className="serif-heading text-3xl">{day.label}</h3><span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[#112A46]/55">{day.date}</span></div><div className="border-t border-[#112A46]/20">{day.sessions.filter((session) => selectedTrack === 'All tracks' || session.track === selectedTrack).map((session, index) => <div key={index} className="grid gap-3 border-b border-[#112A46]/20 py-5 md:grid-cols-[9rem_1.2fr_1fr_1fr] md:items-center" data-testid={`row-schedule-${dayIndex}-${index}`}><span className="font-mono text-[0.65rem] uppercase text-[#3E9B9A]">{session.time}</span><span className="font-semibold">{session.session}</span><span className="text-sm text-[#112A46]/65">{session.speaker}</span><span className="font-mono text-[0.62rem] uppercase tracking-[0.06em] text-[#112A46]/50">{session.track}</span></div>)}</div></div>)}</div></div>
        </section>

        <section id="registration" className="scroll-mt-20 border-b border-[#D9D0BF] py-20 md:py-28" aria-labelledby="registration-title">
          <div className="site-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><SectionIntro id="registration-title" label={conferenceConfig.registration.label} title={conferenceConfig.registration.title} intro={conferenceConfig.registration.intro} /><div><div className="mb-10 border-t border-[#D9D0BF]"><p className="eyebrow py-4">Registration pricing · INR</p>{conferenceConfig.registration.prices.map(([label, price], index) => <div key={label} className="grid grid-cols-[1fr_auto] border-b border-[#D9D0BF] py-3 text-sm" data-testid={`row-registration-price-${index}`}><span>{label}</span><span className="font-mono text-[0.68rem] uppercase text-[#112A46]/55">{price}</span></div>)}</div><form onSubmit={handleRegister} className="border border-[#D9D0BF] bg-[#EDE8DD] p-6 sm:p-8" noValidate data-testid="form-register"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Name<input className="field mt-2" value={registerForm.name} onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })} placeholder="Your name" required data-testid="input-register-name" /></label><label className="text-sm font-semibold">Email<input className="field mt-2" type="email" value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} placeholder="you@example.org" required data-testid="input-register-email" /></label><label className="text-sm font-semibold">Affiliation<input className="field mt-2" value={registerForm.affiliation} onChange={(event) => setRegisterForm({ ...registerForm, affiliation: event.target.value })} placeholder="Institution or independent" required data-testid="input-register-affiliation" /></label><label className="text-sm font-semibold">Ticket type<select className="field mt-2" value={registerForm.ticketType} onChange={(event) => setRegisterForm({ ...registerForm, ticketType: event.target.value })} required data-testid="select-register-ticket"><option value="">Select one</option>{conferenceConfig.registration.prices.map(([label]) => <option key={label}>{label}</option>)}</select></label></div><button type="submit" className="mt-7 inline-flex items-center gap-2 bg-[#3E9B9A] px-5 py-3.5 text-sm font-bold text-[#112A46] transition-colors hover:bg-[#D7AC5A]" data-testid="button-submit-register">Validate registration interest <Send size={15} /></button>{registerNotice && <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-[#112A46]/75" role="status" data-testid="status-register"><CheckCircle2 size={17} className="mt-1 shrink-0 text-[#3E9B9A]" />{registerNotice}</p>}</form></div></div>
        </section>

        <section id="venue" className="scroll-mt-20 bg-[#112A46] py-20 text-[#F8F5EE] md:py-28" aria-labelledby="venue-title">
          <div className="site-container grid gap-12 lg:grid-cols-[0.75fr_1.25fr]"><SectionIntro id="venue-title" label={conferenceConfig.venue.label} title={conferenceConfig.venue.title} intro={conferenceConfig.venue.intro} dark /><div className="grid gap-8 sm:grid-cols-2"><div className="space-y-5"><div><p className="eyebrow text-[#D7AC5A]">Venue / address</p><p className="mt-2 text-sm text-[#F8F5EE]/72" data-testid="text-venue-address">{conferenceConfig.venue.venue}<br />{conferenceConfig.venue.address}</p></div><div><p className="eyebrow text-[#D7AC5A]">Nearby accommodation</p><p className="mt-2 text-sm text-[#F8F5EE]/72">{conferenceConfig.venue.accommodation}</p></div><div><p className="eyebrow text-[#D7AC5A]">Travel & visa</p><p className="mt-2 text-sm text-[#F8F5EE]/72">{conferenceConfig.venue.travel}<br />{conferenceConfig.venue.visa}</p></div></div><div className="flex min-h-64 items-center justify-center border border-[#F8F5EE]/25 bg-[#173653] p-6 text-center" role="region" aria-label="Conference venue map or placeholder" data-testid="map-placeholder">{conferenceConfig.venue.mapQuery ? <iframe title="Conference venue map" src={`https://www.google.com/maps?q=${encodeURIComponent(conferenceConfig.venue.mapQuery)}&output=embed`} className="h-64 w-full border-0" loading="lazy" /> : <div><MapPin size={24} className="mx-auto mb-4 text-[#D7AC5A]" /><p className="font-serif text-2xl">Venue / city awaits confirmation</p><p className="mt-3 text-xs leading-5 text-[#F8F5EE]/55">A map will appear here only when a real map query is configured.</p></div>}</div></div></div>
        </section>

        <section id="committee" className="scroll-mt-20 border-b border-[#D9D0BF] py-20 md:py-28" aria-labelledby="committee-title">
          <div className="site-container"><SectionIntro id="committee-title" label={conferenceConfig.committee.label} title={conferenceConfig.committee.title} intro={conferenceConfig.committee.intro} /><div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"><div className="grid gap-5 md:grid-cols-3">{conferenceConfig.committee.groups.map((group, groupIndex) => <div key={group.name} className="border-t-2 border-[#3E9B9A] pt-4" data-testid={`committee-group-${groupIndex}`}><h3 className="serif-heading text-2xl">{group.name}</h3><div className="mt-6 space-y-5">{group.entries.map(([name, role, institution], index) => <div key={index} className="border-b border-[#D9D0BF] pb-4 text-sm"><p className="font-semibold">{name}</p><p className="mt-1 text-[#112A46]/60">{role} · {institution}</p></div>)}</div></div>)}</div><div className="border-l-2 border-[#D7AC5A] pl-6"><p className="eyebrow mb-5">Host Society Leadership</p>{conferenceConfig.committee.hostLeadership.map(([name, role, institution]) => <div key={name} className="mb-6"><p className="font-semibold" data-testid={`text-host-leader-${name}`}>{name}</p><p className="mt-1 text-sm text-[#112A46]/65">{role}</p><p className="font-mono text-[0.62rem] uppercase tracking-[0.06em] text-[#112A46]/50">{institution}</p></div>)}</div></div></div>
        </section>

        <section id="sponsors" className="scroll-mt-20 bg-[#EDE8DD] py-20 md:py-28" aria-labelledby="sponsors-title">
          <div className="site-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><SectionIntro id="sponsors-title" label={conferenceConfig.sponsors.label} title={conferenceConfig.sponsors.title} intro={conferenceConfig.sponsors.intro} /><div><div className="grid gap-4 sm:grid-cols-3">{conferenceConfig.sponsors.tiers.map((tier, index) => <div key={tier} className="border border-[#112A46]/20 p-5" data-testid={`card-sponsor-tier-${tier.toLowerCase()}`}><span className="font-mono text-[0.65rem] text-[#3E9B9A]">0{index + 1}</span><p className="serif-heading mt-12 text-3xl">{tier}</p><p className="mt-3 text-xs text-[#112A46]/55">Partner details to be announced</p></div>)}</div><p className="mt-8 text-sm text-[#112A46]/70">{conferenceConfig.sponsors.prompt} <a href={`mailto:${conferenceConfig.email}`} className="font-semibold text-[#3E9B9A] underline underline-offset-4" data-testid="link-sponsor-email">{conferenceConfig.email}</a>.</p></div></div>
        </section>

        <section id="faq" className="scroll-mt-20 border-b border-[#D9D0BF] py-20 md:py-28" aria-labelledby="faq-title">
          <div className="site-container grid gap-12 lg:grid-cols-[0.75fr_1.25fr]"><SectionIntro id="faq-title" label={conferenceConfig.faq.label} title={conferenceConfig.faq.title} intro={conferenceConfig.faq.intro} /><div className="border-t border-[#D9D0BF]">{conferenceConfig.faq.items.map(([question, answer], index) => <div key={question} className="border-b border-[#D9D0BF]"><button type="button" className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-semibold" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)} data-testid={`button-faq-${index}`}>{question}<ChevronDown size={18} className={`shrink-0 text-[#3E9B9A] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} /></button>{openFaq === index && <div id={`faq-answer-${index}`} className="pb-5 pr-10 text-sm leading-6 text-[#112A46]/65" data-testid={`text-faq-answer-${index}`}>{answer}.</div>}</div>)}</div></div>
        </section>

        <section id="contact" className="scroll-mt-20 py-20 md:py-28" aria-labelledby="contact-title">
          <div className="site-container grid gap-14 lg:grid-cols-[0.75fr_1.25fr]"><div><SectionIntro id="contact-title" label={conferenceConfig.contact.label} title={conferenceConfig.contact.title} intro={conferenceConfig.contact.intro} /><div className="mt-9 space-y-5 border-t border-[#D9D0BF] pt-6 text-sm"><a href={`mailto:${conferenceConfig.email}`} className="flex items-center gap-3 font-semibold hover:text-[#3E9B9A]" data-testid="link-contact-email"><Mail size={17} className="text-[#3E9B9A]" />{conferenceConfig.email}</a><p className="flex items-center gap-3 text-[#112A46]/70"><MapPin size={17} className="text-[#3E9B9A]" />{conferenceConfig.location}</p></div><div className="mt-8 border-t border-[#D9D0BF] pt-6"><p className="eyebrow">Confirmed society office-holders</p>{conferenceConfig.officeHolders.map(([name, role]) => <p key={name} className="mt-4 text-sm text-[#112A46]/72"><span className="font-semibold text-[#112A46]">{name}</span><br />{role}</p>)}</div></div><form onSubmit={handleContact} className="border-t-2 border-[#112A46] pt-7" noValidate data-testid="form-contact"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Name<input className="field mt-2" value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} placeholder="Your name" required data-testid="input-contact-name" /></label><label className="text-sm font-semibold">Email<input className="field mt-2" type="email" value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} placeholder="you@example.org" required data-testid="input-contact-email" /></label></div><label className="mt-5 block text-sm font-semibold">Message<textarea className="field mt-2 min-h-36 resize-y" value={contactForm.message} onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })} placeholder="How can we help?" required data-testid="textarea-contact-message" /></label><button type="submit" className="mt-6 inline-flex items-center gap-2 border border-[#112A46] px-5 py-3.5 text-sm font-bold transition-colors hover:bg-[#112A46] hover:text-[#F8F5EE]" data-testid="button-submit-contact">Validate message <Check size={15} /></button>{contactNotice && <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-[#112A46]/75" role="status" data-testid="status-contact"><CheckCircle2 size={17} className="mt-1 shrink-0 text-[#3E9B9A]" />{contactNotice}</p>}</form></div>
        </section>
      </main>

      <footer className="bg-[#EDE8DD] py-10">
        <div className="site-container flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><Monogram /><p className="mt-5 max-w-xs text-xs leading-5 text-[#112A46]/60">Part of NBSRAC Academic Society. Conference details will be added as they are confirmed.</p></div><div className="flex flex-col items-start gap-3 sm:items-end"><nav aria-label="Footer quick links" className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">{conferenceConfig.nav.map((item) => <a key={item.id} href={`#${item.id}`} className="text-xs font-semibold text-[#112A46]/70 hover:text-[#3E9B9A]" data-testid={`link-footer-${item.id}`}>{item.label}</a>)}</nav><a href={conferenceConfig.societyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-[#112A46] hover:text-[#3E9B9A]" data-testid="link-footer-society">NBSRAC society website <ExternalLink size={13} /></a><p className="font-mono text-[0.62rem] tracking-[0.08em] text-[#112A46]/50">© {new Date().getFullYear()} · INFORMATION TO BE ANNOUNCED</p></div></div>
      </footer>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;