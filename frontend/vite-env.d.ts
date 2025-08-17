/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // add more if needed
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
