/*
 * 2 & 3. Content to HTML Templates & Map Zones
 * Shared DRY templates for detail cards, the plain-text résumé view, and the 11 zones.
 */
(() => {
  'use strict';

  const BI = window.BI;
  const { CONTENT, COLORS, WORLD, ZONE_SPOTS, inkFor } = BI;

  const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  const tagRow = (items) => `<div class="tags">${items.map((item) => `<span>${item}</span>`).join('')}</div>`;
  const linkButton = (href, label, tone = '') =>
    `<a class="brick ${tone}" href="${href}" target="_blank" rel="noopener">${label}</a>`;
  const definitions = (pairs) =>
    pairs.map(([term, text]) => `<p><strong>${term}.</strong> ${text}</p>`).join('');
  const article = (title, meta, body) =>
    `<article><h3>${title}</h3><p class="meta">${meta}</p>${body}</article>`;
  const section = (title, body) => `<section><h2>${title}</h2><div>${body}</div></section>`;

  const contactHTML = () => {
    const { email, linkedin, github } = CONTENT.links;
    return `<p>Email is the fastest way to reach me.</p><p class="mono">${email}</p>
      <div class="links">
        ${linkButton(`mailto:${email}`, 'Write to me', 'red')}
        ${linkButton(linkedin, 'LinkedIn')}
        ${linkButton(github, 'GitHub', 'green')}
      </div>`;
  };
  const skillsHTML = () => definitions(CONTENT.skillGroups);
  const projectBody = (project) => `<p>${project.blurb}</p>${list(project.points)}`;

  const cardHTML = {
    about: () =>
      `<p>${CONTENT.summary}</p><p>${CONTENT.lookingFor}</p>
       <p><strong>Outside work</strong></p>${list(CONTENT.volunteer)}`,
    project: (project) =>
      `<p>${project.blurb}</p>${tagRow(project.tags)}${list(project.points)}
       ${project.link ? `<div class="links">${linkButton(project.link, 'Code on GitHub')}</div>` : ''}`,
    job: (job) =>
      `<p><strong>${job.role}</strong></p>${list(job.points)}
       <p>The stack behind this sign is one brick per year.</p>`,
    education: () =>
      CONTENT.education
        .map(({ school, when, detail }) => `<p><strong>${school}</strong>, ${when}. ${detail}</p>`)
        .join(''),
  };

  const resumeHTML = () => `
    <div class="top">
      <div><h1 id="resumeName">${CONTENT.name}</h1><p class="lede">${CONTENT.tagline}</p></div>
      <button class="brick" id="resumeClose" type="button">Back to the island</button>
    </div>
    <p class="lede">${CONTENT.summary}</p>
    ${section('Contact', `<article>${contactHTML()}</article>`)}
    ${section('Experience', CONTENT.jobs.map((job) =>
      article(job.name, `${job.role} · ${job.when}`, list(job.points))).join(''))}
    ${section('Projects', CONTENT.projects.map((project) =>
      article(project.name, project.tags.join(' · '), projectBody(project) +
        (project.link ? `<p><a href="${project.link}" target="_blank" rel="noopener">Code on GitHub</a></p>` : ''))).join(''))}
    ${section('Skills', `<article>${skillsHTML()}</article>`)}
    ${section('Education', CONTENT.education.map(({ school, when, detail }) =>
      article(school, when, `<p>${detail}</p>`)).join(''))}
    ${section('Volunteer work', `<article>${list(CONTENT.volunteer)}</article>`)}`;

  const makeZone = ({ id, kind, title, sub, color, html, years }) => {
    const [x, z] = ZONE_SPOTS[id];
    return {
      id, kind, title, sub, html, years,
      color: COLORS[color], ink: inkFor(color),
      at: [x, z], pad: [x, z + WORLD.padOffset],
    };
  };

  const ZONES = [
    { id: 'about', kind: 'About', title: "Hi, I'm Ben", sub: 'Start here', color: 'yellow', html: cardHTML.about() },
    ...CONTENT.projects.map((p) => ({
      id: p.id, kind: 'Project', title: p.name, sub: p.sub, color: p.color, html: cardHTML.project(p),
    })),
    ...CONTENT.jobs.map((j) => ({
      id: j.id, kind: `Experience · ${j.when}`, title: j.name, sub: j.sub, color: j.color, html: cardHTML.job(j), years: j.years,
    })),
    { id: 'skills', kind: 'Skills', title: 'The skills wall', sub: 'Go on, run through it', color: 'red', html: skillsHTML() },
    { id: 'education', kind: 'Education', title: 'School', sub: 'App Academy · UC Berkeley', color: 'blue', html: cardHTML.education() },
    { id: 'contact', kind: 'Contact', title: 'Say hello', sub: 'Email · LinkedIn · GitHub', color: 'green', html: contactHTML() },
  ].map(makeZone);

  const zoneById = (id) => ZONES.find((zone) => zone.id === id);

  Object.assign(BI, { resumeHTML, ZONES, zoneById });
})();
