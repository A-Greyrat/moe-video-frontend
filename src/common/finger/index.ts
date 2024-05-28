import { addFeedback } from '../video';

export function statistics() {
  if (localStorage.getItem('fp') === null) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then((FingerprintJS) => FingerprintJS.load());

    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const { visitorId } = result;

        localStorage.setItem('fp', visitorId);
        addFeedback(visitorId, 'fp@erisu.moe');
      });
  }
}
