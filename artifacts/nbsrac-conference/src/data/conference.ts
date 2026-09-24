export type NavItem = { id: string; label: string };

const tba = 'To be announced';

export const conferenceConfig = {
  societyName: 'NBSRAC Academic Society',
  societyShortName: 'NBSRAC',
  societyDescriptor: 'North Bengal Society',
  societyUrl: 'https://nbsrac-academic-society-website-nbs.vercel.app/',
  email: 'hello@nbsrac.org',
  location: 'Siliguri, West Bengal, India',
  nav: [
    { id: 'about', label: 'About' },
    { id: 'cfp', label: 'Call for papers' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'registration', label: 'Register' },
    { id: 'venue', label: 'Venue & travel' },
    { id: 'committee', label: 'Committee' },
    { id: 'sponsors', label: 'Sponsors' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ] satisfies NavItem[],
  event: {
    conferenceName: tba,
    edition: tba,
    tagline: tba,
    startDate: null as string | null,
    endDate: null as string | null,
    dateLabel: 'Dates to be announced',
    venue: tba,
    city: tba,
    mode: tba,
  },
  hero: {
    intro:
      'NBSRAC Academic Society is preparing a careful, welcoming space for colleagues, researchers and students. The formal conference record will be published here as each detail is confirmed.',
    hostLine: 'NBSRAC Academic Society · North Bengal Society',
  },
  about: {
    label: '01 / About the gathering',
    title: 'A regional learned society, making room for exchange.',
    theme: tba,
    objectives: [tba],
    audience: tba,
    hostingNote:
      'This gathering is being prepared by NBSRAC Academic Society. The society mission and full acronym expansion will be added once confirmed; conference roles and affiliations will be listed only after they are confirmed.',
    hostSociety: {
      fullNameAndExpansion: tba,
      mission: tba,
      focusAreas:
        'Cross-disciplinary research across Science, Technology, Humanities, Social Sciences and Management, including AI, Data Science, Environmental Studies and Health Sciences.',
    },
    firstEdition: true,
    pastEditionHighlights: [] as string[],
  },
  cfp: {
    label: '02 / Call for papers',
    title: 'The call will be published here.',
    intro:
      'Submission guidance will be added after the call is approved. Until then, no topic, format, deadline or review policy should be assumed.',
    tracks: ['Topics to be announced'],
    guidelines: [
      'Submission platform: To be announced',
      'Abstract format: To be announced',
      'Full-paper format and length: To be announced',
      'Formatting and reference style: To be announced',
    ],
    importantDates: [
      ['Abstract submission', tba],
      ['Notification', tba],
      ['Camera-ready submission', tba],
      ['Conference dates', tba],
    ],
    submitPaperEnabled: false,
    proceedings: tba,
  },
  speakers: {
    label: '03 / Speakers',
    title: 'People behind the programme.',
    intro:
      'Keynote and invited speaker details will be listed here after invitations and biographies are confirmed. Neutral initials are used in the meantime.',
    people: [
      { initials: 'K', role: 'Keynote speaker', name: tba, title: tba, affiliation: tba, bio: tba, talk: tba },
      { initials: 'I', role: 'Invited speaker', name: tba, title: tba, affiliation: tba, bio: tba, talk: tba },
      { initials: 'I', role: 'Invited speaker', name: tba, title: tba, affiliation: tba, bio: tba, talk: tba },
      { initials: 'K', role: 'Keynote speaker', name: tba, title: tba, affiliation: tba, bio: tba, talk: tba },
    ],
  },
  schedule: {
    label: '04 / Schedule',
    title: 'A programme shaped by the work.',
    intro:
      'The agenda is not yet confirmed. The filter below is ready for the published programme; every current row remains a clear placeholder.',
    tracks: ['Track to be announced'],
    days: [
      {
        label: tba,
        date: tba,
        sessions: [{ time: tba, session: tba, speaker: tba, track: tba }],
      },
    ],
  },
  registration: {
    label: '05 / Registration',
    title: 'Register your interest.',
    intro:
      'Registration is not open yet. The form below validates locally only; no information is sent, stored or connected to payment.',
    prices: [
      ['Student', tba],
      ['Academic', tba],
      ['Professional', tba],
      ['Early-bird', tba],
      ['On-site', tba],
    ],
  },
  venue: {
    label: '06 / Venue & travel',
    title: 'Practical details, when confirmed.',
    intro:
      'Venue, travel and access notes will be published with the formal event announcement. Nothing below should be used for travel planning yet.',
    venue: tba,
    address: tba,
    accommodation: tba,
    travel: tba,
    visa: tba,
    mapQuery: null as string | null,
  },
  committee: {
    label: '07 / Committee',
    title: 'A considered programme needs many hands.',
    intro:
      'Conference subcommittee appointments are to be announced. The host society leadership is listed separately and is not assigned conference roles here.',
    groups: [
      { name: 'Patrons & advisors', entries: [[tba, tba, tba]] },
      { name: 'Organizing committee', entries: [[tba, tba, tba]] },
      { name: 'Technical program committee', entries: [[tba, tba, tba]] },
    ],
    hostLeadership: [
      ['Dr. Saroj Kr. Biswas', 'President', 'NBSRAC Academic Society'],
      ['Dr. Rakesh Kumar Mandal', 'Secretary', 'NBSRAC Academic Society'],
    ],
  },
  sponsors: {
    label: '08 / Support',
    title: 'Support for the gathering.',
    intro:
      'Sponsor information will be added only when confirmed. No sponsor or partner is represented on this page at present.',
    tiers: ['Platinum', 'Gold', 'Silver'],
    prompt: 'For a sponsor enquiry, please contact the society at',
  },
  faq: {
    label: '09 / Questions',
    title: 'Frequently asked, not yet answered.',
    intro: 'These questions will receive confirmed answers as planning progresses.',
    items: [
      ['When and where will the conference take place?', tba],
      ['How can I submit a paper?', tba],
      ['What are the registration fees?', tba],
      ['Will proceedings be published?', tba],
      ['Is online participation available?', tba],
      ['Who should I contact with accessibility questions?', tba],
    ],
  },
  contact: {
    label: '10 / Contact',
    title: 'Questions are welcome.',
    intro:
      'For conference enquiries, use the society contact details below. Conference-specific addresses and practical information will be added when available.',
    socialLinks: [] as { label: string; url: string }[],
  },
  officeHolders: [
    ['Dr. Saroj Kr. Biswas', 'President, NBSRAC Academic Society'],
    ['Dr. Rakesh Kumar Mandal', 'Secretary, NBSRAC Academic Society'],
  ],
} as const;