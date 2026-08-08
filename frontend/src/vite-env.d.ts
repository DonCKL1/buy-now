/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module 'aos';

interface Window {
  PaystackPop?: {
    setup: (options: {
      key: string;
      email: string;
      amount: number;
      ref: string;
      currency?: string;
      onClose: () => void;
      callback: (response: { reference: string; status: string }) => void;
      metadata?: Record<string, unknown>;
    }) => { openIframe: () => void };
  };
}
