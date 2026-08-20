import type { RegexPreset } from '../types/regex';

export const REGEX_PRESETS: RegexPreset[] = [
  {
    id: 'email-extractor',
    name: 'Email with User & Domain Groups',
    category: 'Web & Network',
    pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})',
    flags: 'g',
    description: 'Matches full email addresses and extracts the local username ($1), domain name ($2), and top-level domain ($3).',
    sampleText: `Contact team lead at alex.vance@quantum-core.io for architecture questions.
Secondary contacts: support@codeforge.dev and alerts-99@notify.subdomain.org.
Invalid examples: plainaddress, @missinguser.com, user@.com`
  },
  {
    id: 'url-parser',
    name: 'URL Protocol, Host & Path Parser',
    category: 'Web & Network',
    pattern: '(https?):\\/\\/([a-zA-Z0-9.-]+)(?::(\\d+))?(\\/[^?\\s]*)?(?:\\?([^#\\s]*))?',
    flags: 'g',
    description: 'Deconstructs web URLs into Protocol ($1), Hostname ($2), Optional Port ($3), Path ($4), and Query String ($5).',
    sampleText: `Production API: https://api.codeforge.dev:8443/v1/projects?sort=desc&limit=50
Local dev: http://localhost:3000/sandbox/preview?theme=dark#editor
Documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript`
  },
  {
    id: 'ipv4-extractor',
    name: 'IPv4 Address with Octets',
    category: 'Web & Network',
    pattern: '(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})',
    flags: 'g',
    description: 'Finds IPv4 network addresses and captures each of the four decimal octets ($1, $2, $3, $4).',
    sampleText: `DNS Servers: 8.8.8.8 and 1.1.1.1
Local gateway router at 192.168.1.1, loopback at 127.0.0.1. Server cluster: 10.0.4.250`
  },
  {
    id: 'hex-color',
    name: 'Hex Color Codes (3, 6, 8-digit)',
    category: 'Data Parsing',
    pattern: '#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?',
    flags: 'gi',
    description: 'Matches CSS hex colors and isolates Red ($1), Green ($2), Blue ($3), and optional Alpha ($4) hex channels.',
    sampleText: `Theme Palette:
Primary: #06b6d4, Secondary: #3b82f6, Accent: #10b981
Background: #090d16ff (with alpha), Warning: #f43f5e
Invalid: #12, #gggggg`
  },
  {
    id: 'iso-date',
    name: 'ISO-8601 Date Parser (YYYY-MM-DD)',
    category: 'Data Parsing',
    pattern: '(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])',
    flags: 'g',
    description: 'Captures calendar year ($1), month ($2), and day ($3) in standard ISO format.',
    sampleText: `Sprint timeline:
Project kickoff: 2026-03-15
Midterm review: 2026-06-30
Production deploy: 2026-09-01`
  },
  {
    id: 'semver',
    name: 'Semantic Versioning (SemVer)',
    category: 'Validation',
    pattern: 'v?(\\d+)\\.(\\d+)\\.(\\d+)(?:-([0-9A-Za-z.-]+))?',
    flags: 'g',
    description: 'Extracts Major ($1), Minor ($2), Patch ($3), and Pre-release tag ($4) from software version strings.',
    sampleText: `Release Manifest:
v1.0.0, v2.14.3-beta.1, 0.9.0-rc2, 3.0.1`
  },
  {
    id: 'html-tags',
    name: 'HTML Tag & Attribute Extractor',
    category: 'Data Parsing',
    pattern: '<([a-zA-Z0-9]+)([^>]*)>(.*?)<\\/\\1>',
    flags: 'gs',
    description: 'Matches paired HTML elements, extracting the tag name ($1), attribute string ($2), and inner HTML content ($3).',
    sampleText: `<div class="card" id="hero">
  <h1 style="color: cyan;">Welcome to CodeForge</h1>
  <p data-test="info">Real-time developer playground</p>
</div>`
  }
];
