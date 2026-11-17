/**
 * Il base path del sito quando non lo dice la CI.
 *
 * Su GitHub Pages un sito di progetto vive sotto `/<nome-repo>/`, e con un
 * dominio custom vive sulla radice. In CI i due valori arrivano da
 * `actions/configure-pages`; in locale vanno indovinati, e per anni sono stati
 * scritti a mano in tre posti diversi — astro.config.mjs, screens.mjs,
 * diff-concept.mjs — tutti con «ImprontaAccelerator» dentro.
 *
 * Il giorno in cui la repo cambia nome o proprietario, quelle tre stringhe non
 * danno errore: la build esce con un prefisso e gli script ne servono un
 * altro, e il sito sembra rotto senza che niente lo dica. Qui il nome si
 * deduce dal remote, che il trasloco aggiorna da solo.
 */
import { execSync } from 'node:child_process';

/** `owner/nome` dal remote git, o null se non si riesce a leggerlo. */
export function repoDalRemote() {
  try {
    const url = execSync('git config --get remote.origin.url', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
    const m = url.replace(/\.git$/, '').match(/[:/]([^/:]+)\/([^/]+)$/);
    return m ? { owner: m[1], nome: m[2] } : null;
  } catch {
    return null;
  }
}

/** Il base path di sviluppo: `/<nome-repo>/` senza la barra finale. */
export function basePathLocale() {
  const r = repoDalRemote();
  return r ? `/${r.nome}` : '';
}

/** L'origine di sviluppo: il project site di chi possiede la repo. */
export function siteUrlLocale() {
  const r = repoDalRemote();
  return r ? `https://${r.owner.toLowerCase()}.github.io` : 'http://localhost:4321';
}
