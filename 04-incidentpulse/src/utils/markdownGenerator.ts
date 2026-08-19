import type { Incident, PostMortem } from '../types/incident';

export function generatePostMortemMarkdown(pm: PostMortem, incident?: Incident): string {
  const dateStr = new Date(pm.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const timelineRows = pm.timeline
    .map(
      (t) =>
        `| \`${new Date(t.timestamp).toLocaleTimeString('en-US', { hour12: false })}\` | **${t.type.toUpperCase()}** | ${t.author} | ${t.message} |`
    )
    .join('\n');

  const whysList = pm.rootCause5Whys
    .filter((w) => w.trim().length > 0)
    .map((w, idx) => `${idx + 1}. **Why?** ${w}`)
    .join('\n');

  const actionItemRows = pm.actionItems
    .map(
      (item) =>
        `| [${item.status === 'completed' ? 'x' : ' '}] | **${item.priority}** | ${item.description} | \`@${item.owner}\` | ${item.dueDate} | \`${item.status}\` |`
    )
    .join('\n');

  const wentWellList = pm.lessonsLearned.wentWell
    .filter((s) => s.trim().length > 0)
    .map((s) => `- ✅ ${s}`)
    .join('\n') || '- None documented';

  const wentPoorlyList = pm.lessonsLearned.wentPoorly
    .filter((s) => s.trim().length > 0)
    .map((s) => `- ❌ ${s}`)
    .join('\n') || '- None documented';

  const luckyList = pm.lessonsLearned.whereWeGotLucky
    .filter((s) => s.trim().length > 0)
    .map((s) => `- 🍀 ${s}`)
    .join('\n') || '- None documented';

  return `# 🚨 Post-Mortem Incident Report: ${pm.title}
**Incident ID:** \`${pm.incidentId}\`  
**Severity:** \`${incident?.severity || 'SEV-1'}\`  
**Status:** \`RESOLVED\`  
**Date Published:** ${dateStr}  
**Lead Investigator:** **${pm.leadInvestigator}**  
**Impact Duration:** \`${pm.impactDurationMinutes} minutes\`  
**Estimated Financial Impact:** \`${pm.revenueImpactEstimate}\`  

---

## 1. Executive Summary
${pm.summary || 'No executive summary provided.'}

### 👤 User Impact
${pm.userImpactSummary || 'No user impact summary provided.'}

### 🔍 Detection & Alerting
${pm.detectionMechanism || 'Detected by automated telemetry alarms.'}

---

## 2. Incident Timeline
| Time (UTC) | Phase | Responder | Event Description |
| :--- | :--- | :--- | :--- |
${timelineRows || '| - | - | - | No timeline events recorded |'}

---

## 3. Root Cause Analysis (5-Whys Methodology)
${whysList || '1. Root cause analysis pending full forensic evaluation.'}

---

## 4. Remediation & Action Items
| Done | Pri | Action Item | Owner | Target Date | Status |
| :---: | :---: | :--- | :---: | :---: | :---: |
${actionItemRows || '| [ ] | P1 | Conduct architecture review | @sre-team | TBD | todo |'}

---

## 5. Lessons Learned

### What Went Well
${wentWellList}

### What Went Poorly
${wentPoorlyList}

### Where We Got Lucky
${luckyList}

---
*Generated with [IncidentPulse Command Center](https://github.com/yankun22/portfolio/tree/main/04-incidentpulse)*
`;
}
