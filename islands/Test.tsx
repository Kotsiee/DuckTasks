import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useEffect, useState } from "preact/hooks";

export default function Test () {
  const test = useSignal('brooo')

  localStorage.setItem('test', 'tested')

  useEffect(() => {
    test.value = localStorage.getItem('user') || 'oh no'
  })


  return(
    <div>
      <h3>{test}</h3>
    </div>
  )
}


let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export enum Stores {
  Users = 'currentUser',
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    const request = indexedDB.open('myDB');

    request.onupgradeneeded = () => {
      db = request.result;

      if (!db.objectStoreNames.contains(Stores.Users)) {
        console.log('Creating users store');
        db.createObjectStore(Stores.Users, { keyPath: 'userId' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log('request.onsuccess - initDB', version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};