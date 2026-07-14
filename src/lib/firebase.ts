/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3pJI1L_7XLI77b6edThB3GFyxwe6QkZY",
  authDomain: "gen-lang-client-0678605503.firebaseapp.com",
  projectId: "gen-lang-client-0678605503",
  storageBucket: "gen-lang-client-0678605503.firebasestorage.app",
  messagingSenderId: "85983721898",
  appId: "1:85983721898:web:640ba53d805793bce313d3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-ahumarestaurante-2eec89ea-5df1-45c2-af1f-beb4139b2099");
export const auth = getAuth(app);
