
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/magicalyoga/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/magicalyoga"
  },
  {
    "renderMode": 2,
    "route": "/magicalyoga/summer-camp"
  },
  {
    "renderMode": 2,
    "route": "/magicalyoga/video-contents"
  },
  {
    "renderMode": 2,
    "route": "/magicalyoga/contact-us"
  },
  {
    "renderMode": 2,
    "route": "/magicalyoga/about-us"
  },
  {
    "renderMode": 2,
    "redirectTo": "/magicalyoga",
    "route": "/magicalyoga/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6020, hash: '22eda92df83e3bc58db1143f3d03523c206eb263524664ba1c8dd6bbc3df1fa4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1073, hash: 'fbdc63c312766b349e25c31cb7a16f0a4fb9fe51582be0654c6eccb992f8ba07', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'contact-us/index.html': {size: 22962, hash: 'acade8a3a414c6ae150287c9622c203fe335eb5221c5e5e30564641b8c5ce950', text: () => import('./assets-chunks/contact-us_index_html.mjs').then(m => m.default)},
    'video-contents/index.html': {size: 22743, hash: 'd9d552b751da79cba1a410d9e19b33ee163f6bb820ac363a36796482f2890cfc', text: () => import('./assets-chunks/video-contents_index_html.mjs').then(m => m.default)},
    'summer-camp/index.html': {size: 40901, hash: '1ed6697854d9cd08a426aa8ea885445bec902d68c4f87c3573dff851c32dd71d', text: () => import('./assets-chunks/summer-camp_index_html.mjs').then(m => m.default)},
    'index.html': {size: 44823, hash: 'f7da0e5514a760bc57b43d0317c84b4475adee218540846822f29ea2b50a6301', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'about-us/index.html': {size: 21686, hash: '3717135d82bcdb5d0fd81ca9485f6a76eb0d73177aeb5c218c325a2692e5745d', text: () => import('./assets-chunks/about-us_index_html.mjs').then(m => m.default)},
    'styles-226GPMND.css': {size: 307837, hash: 'DmZdlAXlVv4', text: () => import('./assets-chunks/styles-226GPMND_css.mjs').then(m => m.default)}
  },
};
