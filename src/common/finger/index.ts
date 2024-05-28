import { addFeedback } from '../video';
import finger from '@fingerprintjs/fingerprintjs';

export function statistics() {
  if (localStorage.getItem('fp') === null) {
    const fpPromise = finger.load();
    localStorage.setItem('fp', 'true');
    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const { visitorId } = result;
        addFeedback(visitorId, 'fp@erisu.moe');
      });
  }
}
