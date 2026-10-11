// FR/EN toggle for the presentation site. French is the markup's own text (read once at load); English
// lives here, keyed by id, and is swapped in. The choice is kept in this browser.

const KEY = 'comptaia-site-lang'

const EN = {
  'nav-fn': 'How it works',
  'nav-data': 'Your data',
  'nav-guide': 'Install guide',
  'nav-pricing': 'Pricing',
  'nav-access': 'Request access',

  'hero-h1': 'Your invoices, in your workbooks.',
  'hero-lead': 'ComptaIA reads the invoices, statements and documents of a folder, finds the account in your chart of accounts, and fills your workbook. You approve every change before it is saved.',
  'hero-btn1': 'Request beta access',
  'hero-btn2': 'Read the install guide',

  'inv-date': 'Invoice 2026-09-7781, 12 Sep 2026',
  'inv-l1': 'Subscription, September',
  'inv-l2': 'Consumption, 1,842 kWh',
  'inv-tot1': 'Total excl. tax',
  'inv-vat1': 'VAT 5.5%',
  'inv-vat2': 'VAT 20%',
  'inv-tot2': 'Total incl. tax',
  'th-date': 'Date', 'th-invoice': 'Invoice no.', 'th-supplier': 'Supplier', 'th-desc': 'Description',
  'th-net': 'Net', 'th-vatpct': 'VAT %', 'th-vat': 'VAT', 'th-gross': 'Gross', 'th-account': 'Account',
  'row1-desc': 'Subscription, September', 'row2-desc': 'Consumption, 1,842 kWh',

  'fn-h2': 'Four steps, from the folder to the filled journal',
  'fn-1-t': 'Open the workbook to fill.', 'fn-1': ' Its folder is where ComptaIA works. Your documents (Word, PowerPoint, PDF, images, text) are ticked there in advance.',
  'fn-2-t': 'Tick the documents and the sheets to fill.', 'fn-2': ' Add an instruction if needed, for example "one line per invoice and per VAT rate."',
  'fn-3-t': 'Click "Fill the workbook."', 'fn-3': ' ComptaIA reads each document, looks up account numbers in your chart of accounts, and prepares the changes.',
  'fn-4-t': 'Approve, then ask for more.', 'fn-4': ' Once the workbook is filled, the Workbook tab shows it as it is. Ask for totals, a summary sheet or a chart, or correct a cell yourself.',

  'own-h2': 'The workbook stays yours',
  'own-1': 'ComptaIA works on a <strong>copy</strong> by default: the original is not changed.',
  'own-2': 'Every batch of changes is shown to you, cell by cell, before it is written.',
  'own-3': 'The previous version of the workbook is <strong>backed up</strong> before every change.',
  'own-4': 'A cell that holds a formula is never overwritten.',
  'own-5': "Amounts are copied as printed; your template's control columns show the differences.",
  'own-6': 'Auto mode lets ComptaIA work on its own: it gives you a report at the end, pointing out where your judgment is needed. When in doubt, it leaves a cell empty rather than filling it in.',

  'data-h2': 'What stays on your PC, and what leaves it',
  'data-p1': "ComptaIA is a program installed on your PC. It has no server of its own: your workbooks, your backups and your knowledge base stay on your computer.",
  'data-p2': "To read a document, ComptaIA sends its content (text or images of the pages that matter) to an AI service, with <strong>your own access key</strong>. That service bills you directly for what you use. The key is kept in your system's secure storage, never in a file.",

  'not-h2': "What ComptaIA does not do",
  'not-1': "It does not replace an accountant: it prepares, you check.",
  'not-2': "It files no return and makes no payment.",
  'not-4': "It knows your chart of accounts only if you give it one: add it to the knowledge base.",

  'g-nav-home': 'Overview',
  'g-h1': 'Install ComptaIA',
  'g-lead': 'You need an Internet connection.',
  'g-s1-h2': '1. Download and open',
  'g-s1-1-h': 'Download the file',
  'g-s1-1-p': 'You get a link to a <code>ComptaIA-windows.zip</code> file. Save it and extract it.',
  'g-s1-2-h': 'Launch ComptaIA',
  'g-s1-2-p': 'Click <code>ComptaIA.exe</code> and follow the instructions.',
  'g-s2-h2': '2. A first filling job',
  'g-s2-fig': 'The ComptaIA window with a folder open.',
  'g-s2-1-h': 'Open a workbook',
  'g-s2-1-p': 'Click <b>Open workbook…</b> and choose your Excel template. Its folder is where ComptaIA works.',
  'g-s2-1-fig': 'Example columns of a purchase journal.',
  'g-s2-2-h': 'Add your chart of accounts',
  'g-s2-2-p': 'In <b>Knowledge base</b>, add the <a href="https://www.anc.gouv.fr/files/anc/files/1_Normes_fran%C3%A7aises/Reglements/Recueils/PCG_janvier2026/PCG--1er-janvier-2026.pdf">Plan Comptable Général — ANC Regulation 2014-03 (2026 version)</a> and any texts the agent needs, to give it context. It stays in place for every session after this one, unless you delete or replace it.',
  'g-s2-3-h': 'Tick the documents and run it',
  'g-s2-3-p': 'Keep <b>Work on a copy</b> ticked the first time, then click <b>Fill the workbook</b>. You approve the changes before they are written.',
  'g-back': 'Back to the overview',

  'config-h2': 'Requirements',
  'config-1': 'Windows, macOS or Linux.',
  'config-2': 'An Internet connection.',
  'config-3': 'An access key for the AI service.',
  'config-p': 'The interface is in French and in English.',

  'price-h2': 'Pricing',
  'price-trial': 'The first 7 days are free, no commitment.',
  'plan-student-e': 'Student', 'plan-student-n': 'Student', 'plan-student-period': '/month',
  'plan-student-l1': 'On proof of student status', 'plan-student-l2': 'Every feature',
  'plan-pro-e': 'Independent & small business', 'plan-pro-n': 'Professional', 'plan-pro-period': '/month',
  'plan-pro-l1': 'One person', 'plan-pro-l2': 'Every feature',
  'plan-biz-e': 'Teams & firms', 'plan-biz-n': 'Business', 'plan-biz-price': 'Ask for a quote',
  'plan-biz-l1': 'Several people, several workbooks', 'plan-biz-l2': 'Talk to us about your needs',
  'plan-biz-btn': 'Ask for a quote',
  'price-note': "Each person uses their own AI service key: its usage is billed by that service directly, separately from the subscription.",

  'access-h2': 'Invitation-only beta',
  'access-p': "ComptaIA is in closed beta. Write to us describing your activity and the kind of workbook you fill: we will send you the program and the install guide.",
  'access-btn1': 'Request access',
  'access-btn2': 'See the install guide',

  'footer-1': 'ComptaIA is not affiliated with any AI model provider or with Microsoft.',
}

function apply(lang) {
  document.documentElement.lang = lang
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const id = el.getAttribute('data-i18n')
    if (lang === 'en' && EN[id] !== undefined) {
      if (el.dataset.fr === undefined) el.dataset.fr = el.innerHTML
      el.innerHTML = EN[id]
    } else if (el.dataset.fr !== undefined) {
      el.innerHTML = el.dataset.fr
    }
  })
  document.querySelectorAll('.lang-toggle button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang))
  try { localStorage.setItem(KEY, lang) } catch { /* not remembered */ }
}

function initial() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'fr') return saved
  } catch { /* storage blocked: French stays the default */ }
  return 'fr'
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-toggle').forEach((toggle) => {
    toggle.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => apply(b.dataset.lang)))
  })
  apply(initial())
})
