import { httpGet } from '../axios';

let publicKey: string | null = null;

async function loadPublicKeyFromBase64(base64String: string) {
  const binaryDer = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' },
    },
    false,
    ['encrypt'],
  );
}

const getPublicKey = async () => httpGet<string>('/common/public-key').then((res) => res.data);

export async function rsaEncrypt(dataToEncrypt: string): Promise<string> {
  if (publicKey === null) {
    publicKey = await getPublicKey();
    return rsaEncrypt(dataToEncrypt);
  }

  const importedPublicKey = await loadPublicKeyFromBase64(publicKey!);
  const dataUint8Array = new TextEncoder().encode(dataToEncrypt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    importedPublicKey,
    dataUint8Array,
  );

  return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}
