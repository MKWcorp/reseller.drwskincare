import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

// PLACEHOLDER: Ganti GTM_ID dengan ID GTM reseller Anda
const GTM_ID = 'GTM-XXXXXXX';

const GTM_CODE = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM_ID}');
`;

const GTM_NOSCRIPT = `
  <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
`;

const META_PIXEL_CODE = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
// PLACEHOLDER: Ganti dengan Meta Pixel ID reseller Anda
fbq('init', 'XXXXXXXXXXXXXXXXX');
fbq('track', 'PageView');
`;

const META_PIXEL_NOSCRIPT = `
  <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=XXXXXXXXXXXXXXXXX&ev=PageView&noscript=1" />
`;

const TIKTOK_PIXEL_CODE = `
  !function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = [
      "page",
      "track",
      "identify",
      "instances",
      "debug",
      "on",
      "off",
      "once",
      "ready",
      "alias",
      "group",
      "enableCookie",
      "disableCookie",
      "holdConsent",
      "revokeConsent",
      "grantConsent"
    ];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }
    ttq.instance = function (t) {
      for (
        var e = ttq._i[t] || [],
          n = 0;
        n < ttq.methods.length;
        n++
      ) {
        ttq.setAndDefer(e, ttq.methods[n]);
      }
      return e;
    };
    ttq.load = function (e, n) {
      var r = "https://analytics.tiktok.com/i18n/pixel/events.js",
        o = n && n.partner;
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = r;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      n = document.createElement("script");
      n.type = "text/javascript";
      n.async = !0;
      n.src = r + "?sdkid=" + e + "&lib=" + t;
      e = document.getElementsByTagName("script")[0];
      e.parentNode.insertBefore(n, e);
    };
    // PLACEHOLDER: Ganti dengan TikTok Pixel ID reseller Anda
    ttq.load("XXXXXXXXXXXXXXXXX");
    ttq.page();
  }(window, document, "ttq");
`;

export const metadata: Metadata = {
  // PLACEHOLDER: Ganti title dan description sesuai program reseller
  title: "Program Reseller DRW Skincare",
  description: "Bergabunglah sebagai reseller resmi DRW Skincare. Produk berkualitas, margin kompetitif, dan dukungan penuh dari tim DRW."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {GTM_CODE}
        </Script>
        {/* End Google Tag Manager */}
        {/* Meta Pixel Code Start */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {META_PIXEL_CODE}
        </Script>
        {/* Meta Pixel Code End */}
        {/* TikTok Pixel Code Start */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {TIKTOK_PIXEL_CODE}
        </Script>
        {/* TikTok Pixel Code End */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript dangerouslySetInnerHTML={{ __html: GTM_NOSCRIPT }} />
        {/* End Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{ __html: META_PIXEL_NOSCRIPT }}
        />
        {children}
      </body>
    </html>
  );
}
