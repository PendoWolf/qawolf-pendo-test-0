// Minimal type for the Pendo agent that Novus installs at runtime.
// The real implementation is loaded by the Pendo snippet; here we only
// declare the surface our app touches so trackEvent() is type-safe.
export {};

declare global {
  // eslint-disable-next-line no-var
  var pendo: any;
  interface Window {
    pendo?: any;
  }
}
