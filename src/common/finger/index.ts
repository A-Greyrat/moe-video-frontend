import { addFeedback } from '../video';

export function statistics() {
  if (localStorage.getItem('fp') === null) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then((FingerprintJS) => FingerprintJS.load());
    localStorage.setItem('fp', 'true');
    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const { visitorId } = result;
        addFeedback(visitorId, 'fp@erisu.moe');
      });
  }
}
