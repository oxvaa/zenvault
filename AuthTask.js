// A cancelled/timed-out attempt must never create an account later.
export function createAuthTask(onProgress = () => {}, duration = 120000) {
  let error = null;
  const expires = Date.now() + duration;
  const listeners = new Set();
  const cancel = (message = 'Pokus byl zrušen. Zadané údaje zůstaly ve formuláři.') => {
    if (error) return;
    error = new Error(message);
    for (const reject of listeners) reject(error);
    listeners.clear();
  };
  const check = () => {
    if (!error && Date.now() >= expires) cancel('Příprava účtu trvala příliš dlouho. Údaje zůstaly vyplněné, zkus to znovu.');
    if (error) throw error;
  };
  const wait = (promise, durationMs = Math.max(1, expires - Date.now()), message) => {
    check();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => cancel(message || 'Příprava účtu trvala příliš dlouho. Zkus to znovu.'), durationMs);
      const failed = e => { clearTimeout(timer); listeners.delete(failed); reject(e); };
      listeners.add(failed);
      Promise.resolve(promise).then(value => {
        try { check(); clearTimeout(timer); listeners.delete(failed); resolve(value); }
        catch (e) { failed(e); }
      }, failed);
    });
  };
  return {check, wait, cancel, onProgress: fraction => { check(); onProgress(fraction); }};
}
