@import "tailwindcss";

:root {
  --bridgeway-green-dark: #245b2e;
  --bridgeway-green: #2f7d3b;
  --bridgeway-green-light: #8cc63f;
  --bridgeway-gold: #f4c542;
  --bridgeway-bg: #f6f8f5;
  --bridgeway-card: #ffffff;
  --bridgeway-text: #1f2933;
  --bridgeway-muted: #6b7280;
  --bridgeway-border: #dfe7dc;
  --bridgeway-line: #e8eee5;
  --bridgeway-green-50: #edf7ef;
  --bridgeway-green-100: #d9ecd8;
  --bridgeway-gold-50: #fff8df;
  --bridgeway-gold-100: #f8e7a7;
  --bridgeway-danger: #b42318;
  --bridgeway-danger-50: #fff1ef;
  --bridgeway-shadow: 0 1px 2px rgb(31 41 51 / 0.05), 0 14px 36px rgb(36 91 46 / 0.08);

  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color: var(--bridgeway-text);
  background: var(--bridgeway-bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--bridgeway-green);
  outline-offset: 2px;
}

::selection {
  color: #ffffff;
  background: var(--bridgeway-green-dark);
}

.bridgeway-shell {
  color: var(--bridgeway-text);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.56), rgb(246 248 245 / 0) 18rem),
    var(--bridgeway-bg);
}

.bridgeway-card {
  border: 1px solid var(--bridgeway-border);
  background: var(--bridgeway-card);
  border-radius: 10px;
  box-shadow: var(--bridgeway-shadow);
}

.bridgeway-card-header {
  border-bottom: 1px solid var(--bridgeway-line);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdf9 100%);
}

.bridgeway-button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  border-radius: 0.5rem;
  background: var(--bridgeway-green-dark);
  color: #ffffff;
  border: 1px solid rgb(36 91 46 / 0.3);
  box-shadow: 0 8px 18px rgb(36 91 46 / 0.18);
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.bridgeway-button-primary:hover {
  background: var(--bridgeway-green);
  box-shadow: 0 10px 22px rgb(36 91 46 / 0.22);
}

.bridgeway-button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  border-radius: 0.5rem;
  color: var(--bridgeway-green-dark);
  background: #ffffff;
  border: 1px solid var(--bridgeway-border);
  box-shadow: 0 1px 2px rgb(31 41 51 / 0.06);
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.bridgeway-button-secondary:hover {
  color: var(--bridgeway-green);
  background: var(--bridgeway-green-50);
  border-color: var(--bridgeway-green-100);
}

.bridgeway-form-control {
  border: 1px solid #cfd8cc;
  background: #ffffff;
  color: var(--bridgeway-text);
  border-radius: 0.5rem;
  box-shadow: inset 0 1px 1px rgb(31 41 51 / 0.03);
}

.bridgeway-form-control::placeholder {
  color: #8a9588;
}

.bridgeway-form-control:focus {
  border-color: var(--bridgeway-green);
  box-shadow: 0 0 0 3px rgb(47 125 59 / 0.12);
  outline: none;
}

.bridgeway-table-head {
  border-bottom: 1px solid var(--bridgeway-line);
  background: #f9fbf7;
  color: #5f6d5c;
}

.bridgeway-row-hover:hover {
  background: #fbfdf9;
}

.bridgeway-link {
  color: var(--bridgeway-text);
}

.bridgeway-link:hover {
  color: var(--bridgeway-green-dark);
}

.bridgeway-progress-track {
  background: #edf1eb;
}

.bridgeway-progress-bar {
  background: linear-gradient(90deg, var(--bridgeway-green-dark), var(--bridgeway-green));
}

.bridgeway-tag {
  border: 1px solid var(--bridgeway-border);
  background: #fbfdf9;
  color: #566151;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 0.45rem;
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1rem;
}

.badge-status-planning {
  border-color: #cbd5c8;
  background: #f8faf7;
  color: #536053;
}

.badge-status-not-started {
  border-color: #cbd5c8;
  background: #f8faf7;
  color: #536053;
}

.badge-status-in-progress,
.badge-priority-medium {
  border-color: #b8dfb9;
  background: var(--bridgeway-green-50);
  color: var(--bridgeway-green-dark);
}

.badge-status-waiting {
  border-color: var(--bridgeway-gold-100);
  background: var(--bridgeway-gold-50);
  color: #74530b;
}

.badge-status-needs-review,
.badge-priority-high {
  border-color: var(--bridgeway-gold-100);
  background: #fff5cc;
  color: #6f4b00;
}

.badge-status-on-hold {
  border-color: #e7d7ad;
  background: #fffaf0;
  color: #7b5c15;
}

.badge-status-completed {
  border-color: #cde8b4;
  background: #f1fae8;
  color: var(--bridgeway-green-dark);
}

.badge-status-complete {
  border-color: #cde8b4;
  background: #f1fae8;
  color: var(--bridgeway-green-dark);
}

.badge-priority-low {
  border-color: var(--bridgeway-border);
  background: #ffffff;
  color: var(--bridgeway-muted);
}

.badge-priority-critical {
  border-color: #ffc9c2;
  background: var(--bridgeway-danger-50);
  color: var(--bridgeway-danger);
}
