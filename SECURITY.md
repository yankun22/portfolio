# 🔒 Security Policy

## Reporting Security Vulnerabilities

We take the security and integrity of this architecture seriously. If you identify a potential security vulnerability, credential exposure, or exploit in any of the applications in this repository, please report it responsibly.

### Responsible Disclosure Protocol

1. **Do not create public GitHub issues** for security vulnerabilities.
2. Email your findings directly to **[contact@alokvishwastudio.in](mailto:contact@alokvishwastudio.in)** with the subject line:  
   `[SECURITY VULNERABILITY] - <Component Name>`
3. Please include:
   - Detailed description of the vulnerability.
   - Steps to reproduce or proof-of-concept payload.
   - Affected file, component, or endpoint.
   - Any proposed remediation or mitigation.

### Scope

The following applications within this repository are covered under this policy:
- `00-master-hub` (Next.js 15 Master Hub)
- `01-wealthflow` (Fintech Monte Carlo & FIRE Engine)
- `02-soundpulse` (Web Audio DAW & DSP Studio)
- `03-spatialcore` (Three.js WebGL 3D Studio)
- `04-incidentpulse` (SRE Real-Time Telemetry Center)
- `05-nexuswiki` (D3.js Knowledge Graph System)
- `06-canvasflow` (Infinite Vector Canvas Studio)
- `07-voyageplanner` (Intelligent Travel Itinerary Planner)
- `08-vitalpulse` (Biometric Health Telemetry Center)
- `09-codeforge` (In-Browser SQLite & Sandboxed Developer Playground)
- `10-havenrealty` (Architectural 360° Studio & Yield Engine)

### Security Best Practices Implemented

- **No Hardcoded Credentials**: No API keys, secret tokens, or private environment variables are committed.
- **Client-Side WASM Isolation**: `09-codeforge` uses an isolated iframe execution boundary for running user code safely.
- **Local-First Storage**: User inputs are persisted securely in local storage without unauthenticated remote telemetry.
- **Sanitized Exports**: PDF and CSV exports validate data models against script injection before compilation.
