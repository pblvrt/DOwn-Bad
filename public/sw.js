const CACHE_NAME = 'spinmoji-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/sso-image.png',
  '/sounds/spin.mp3',
  '/sounds/coin.mp3',
  '/sounds/purchase.mp3',
  '/sounds/rent.mp3',
  '/spin.wav',
  '/coin.wav',
  '/specialEffect.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

if(!self.define){let e,a={};const s=(s,n)=>(s=new URL(s+".js",n).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn't register its module`);return e})));self.define=(n,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(a[c])return;let t={};const r=e=>s(e,c),o={module:{uri:c},exports:t,require:r};a[c]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"a3b0f32a5bd6918ab5e2f6ab6e63625c"},{url:"/_next/static/L7U-Da4FIQwr5kUyYFCSp/_buildManifest.js",revision:"56313a2fa41efe17a9286c47ac6aacba"},{url:"/_next/static/L7U-Da4FIQwr5kUyYFCSp/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/282.da60606ca2876b43.js",revision:"da60606ca2876b43"},{url:"/_next/static/chunks/4bd1b696-88e1811dc88a5449.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/684-d609352085aeac8d.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/app/_not-found/page-e26809c29c7fea5b.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/app/layout-65c5f3b51c66e353.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/app/page-e0e573f3fbd395cf.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/framework-859199dea06580b0.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/main-61358682726adcf6.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/main-app-da548fc9bbd7aa6e.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/pages/_app-da15c11dea942c36.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-a026329b081969f4.js",revision:"L7U-Da4FIQwr5kUyYFCSp"},{url:"/_next/static/css/44651216f0d9b9ae.css",revision:"44651216f0d9b9ae"},{url:"/_next/static/css/51dae64237b9d65e.css",revision:"51dae64237b9d65e"},{url:"/_next/static/css/6220f944f95dff25.css",revision:"6220f944f95dff25"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/background.wav",revision:"00e62c4448c055ab1d654a2f60afc6fc"},{url:"/coin.wav",revision:"37873e72e331d4890d14a9ca7ce17b8f"},{url:"/coins.wav",revision:"4a54ee3c3164ba14c51999b0e718dd27"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/images/machine-background.svg",revision:"472bb1aea8cf6f5aa12e36cfc8de05d7"},{url:"/inventory-texture-1.svg",revision:"770c0eae5161c3712a03e3da04986778"},{url:"/machine-background.svg",revision:"4351d3c0de9030ad3aaa0787e0afa4e3"},{url:"/manifest.json",revision:"2683f3177b5e8ab30e311157972b1c05"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/specialEffect.wav",revision:"a158deeebac2c9c62b2c6fababaf512f"},{url:"/spin.wav",revision:"bcf7ac5fdf09ceae1de0134224f1225b"},{url:"/test.svg",revision:"b3a89c613f7e478df49a2bb65ec4aa3c"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:s,state:n})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
