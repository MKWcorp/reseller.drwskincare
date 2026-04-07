"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ShieldCheckIcon,
  BeakerIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { trackLead, trackContact, trackInitiateCheckout } from "@/lib/meta-pixel";

// TikTok & Meta Pixel Analytics type declarations
declare global {
  interface Window {
    ttq: any;
    fbq: any;
  }
}

/**
 * reseller.drwskincare – Landing Page (Program Reseller)
 * Version: v1 (Template – siap dikustomisasi)
 * Tech: Next.js + React + TailwindCSS (single-file component)
 * Notes:
 * - Ganti semua PLACEHOLDER_... dengan aset/copy nyata.
 * - Sesuaikan paket, harga, dan benefit sesuai program reseller.
 * - Nomor WA diambil dari env NEXT_PUBLIC_WA_NUMBER.
 * - Form lead mengarahkan ke WhatsApp dengan pesan prefilled.
 * - UTM params ditangkap otomatis untuk tracking.
 */

export default function LandingResellerDRW() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [packageTier, setPackageTier] = useState("Mulai 1 Juta");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBenefitMuted, setIsBenefitMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const benefitVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleBenefitMute = () => {
    if (benefitVideoRef.current) {
      benefitVideoRef.current.muted = !benefitVideoRef.current.muted;
      setIsBenefitMuted(benefitVideoRef.current.muted);
    }
  };

  // Intersection Observer: auto-mute video yang tidak terlihat di layar
  // Ketika video 1 terlihat → mute video 2, dan sebaliknya
  useEffect(() => {
    const v1 = videoRef.current;
    const v2 = benefitVideoRef.current;
    if (!v1 || !v2) return;

    const observer1 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Video 1 masuk layar: mute video 2 jika video 1 tidak muted
          if (!v1.muted) {
            v2.muted = true;
            setIsBenefitMuted(true);
          }
        }
      },
      { threshold: 0.5 }
    );

    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Video 2 masuk layar: mute video 1 jika video 2 tidak muted
          if (!v2.muted) {
            v1.muted = true;
            setIsMuted(true);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer1.observe(v1);
    observer2.observe(v2);

    return () => {
      observer1.disconnect();
      observer2.disconnect();
    };
  }, []);

  // TikTok & Meta Pixel page tracking
  useEffect(() => {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("ViewContent", {
        content_name: "DRW Skincare Reseller Landing",
        content_category: "Landing Page",
        content_id: "reseller_landing_v1",
        description: "User viewed reseller program page",
      });
    }
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: "DRW Skincare Reseller Landing",
        content_category: "Landing Page",
      });
    }
  }, []);

  // Track package selection changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ttq && packageTier) {
      window.ttq.track("ViewContent", {
        content_name: packageTier + " Package",
        content_category: "Reseller Package",
        content_id: packageTier.toLowerCase(),
      });
    }
    if (typeof window !== "undefined" && window.fbq && packageTier) {
      window.fbq("track", "ViewContent", {
        content_name: packageTier + " Package Details",
        content_category: "Reseller Package",
      });
    }
  }, [packageTier]);

  // Grab UTM params for tracking
  const utm = useMemo(() => {
    if (typeof window === "undefined") return {} as Record<string, string>;
    const qp = new URLSearchParams(window.location.search);
    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "ttclid",
    ];
    const obj: Record<string, string> = {};
    keys.forEach((k) => {
      const v = qp.get(k);
      if (v) obj[k] = v;
    });
    return obj;
  }, []);

  // Basic phone normalizer (IDN WhatsApp)
  function normalizePhone(p: string) {
    const digits = p.replace(/\D/g, "");
    if (digits.startsWith("62")) return digits;
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;
    return `62${digits}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !city || !phone)
      return setError("Lengkapi Nama, Kota, dan WhatsApp.");
    if (!/^\+?\d[\d\s-]{7,}$/.test(phone))
      return setError("Nomor WhatsApp tidak valid.");
    if (!agree) return setError("Setujui kebijakan data terlebih dahulu.");

    // TikTok Event: Lead Generated
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("SubmitForm", {
        content_name: "Reseller Form",
        content_category: "Lead Generation",
        contents: [
          {
            content_id: packageTier,
            content_name: packageTier + " Package",
            content_category: "Reseller Package",
            quantity: 1,
          },
        ],
      });
    }

    // Meta Pixel Event: Lead Generated (dengan CAPI server-side tracking)
    trackLead({
      content_name: "Reseller Form Submission",
      content_category: "DRW Skincare Reseller",
    });

    const to = normalizePhone(
      process.env.NEXT_PUBLIC_WA_NUMBER || "62811944288"
    );

    const payload = {
      name,
      city,
      phone: normalizePhone(phone),
      packageTier,
      ...utm,
    };

    const lines = [
      `Halo DRW Skincare, saya tertarik menjadi Reseller.`,
      `Nama: ${payload.name}`,
      `Kota: ${payload.city}`,
      `WhatsApp: ${payload.phone}`,
      `Paket minat: ${payload.packageTier}`,
      utm.utm_source ? `UTM Source: ${utm.utm_source}` : null,
      utm.utm_campaign ? `UTM Campaign: ${utm.utm_campaign}` : null,
      utm.utm_medium ? `UTM Medium: ${utm.utm_medium}` : null,
      utm.fbclid ? `fbclid: ${utm.fbclid}` : null,
      utm.ttclid ? `ttclid: ${utm.ttclid}` : null,
      `Mohon jadwalkan konsultasi gratis.`,
    ]
      .filter(Boolean)
      .join("%0A");

    const wa = `https://wa.me/${normalizePhone(String(to))}?text=${lines}`;
    window.location.href = wa;
  }

  function scrollToForm() {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("ClickButton", {
        content_name: "Scroll to Form CTA",
        content_category: "User Engagement",
      });
    }
    // Meta Pixel tracking dengan CAPI
    trackInitiateCheckout({
      value: 0,
      currency: "IDR",
    });
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openWhatsAppDirect() {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("Contact", {
        content_name: "WhatsApp Chat",
        content_category: "Direct Contact",
      });
    }
    // Meta Pixel tracking dengan CAPI
    trackContact({
      content_name: "WhatsApp Direct Contact",
      content_category: "Customer Contact",
    });
    const waNumber = normalizePhone(
      process.env.NEXT_PUBLIC_WA_NUMBER || "62811944288"
    );
    const message = "Halo, saya tertarik dengan program Reseller DRW Skincare";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }

  function toggleChat() {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact", {
        content_name: "Chat Widget Toggle",
        content_category: "Customer Support",
      });
    }
    setIsChatOpen(!isChatOpen);
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.ico"
              alt="DRW Skincare Logo"
              className="h-9 w-9 rounded-xl"
            />
            {/* PLACEHOLDER: Ganti nama brand di bawah */}
            <span className="font-semibold">reseller.drwskincare</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#benefits" className="hover:text-rose-600">
              Benefit
            </a>
            <a href="#showcase" className="hover:text-rose-600">
              Portofolio
            </a>
            <a href="#packages" className="hover:text-rose-600">
              Paket
            </a>
            <a href="#faq" className="hover:text-rose-600">
              FAQ
            </a>
          </nav>
          <button
            onClick={scrollToForm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700"
          >
            Daftar Sekarang
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-50 to-white" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            {/* PLACEHOLDER: Ganti headline hero */}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Mulai Bisnis Reseller Skincare
              <span className="text-rose-600"> Bersama DRW Skincare</span>
            </h1>
            {/* PLACEHOLDER: Ganti sub-headline */}
            <p className="mt-4 text-slate-600 md:text-lg">
              Program reseller terpercaya dengan produk skincare berkualitas,
              margin kompetitif, dan dukungan penuh dari tim DRW Skincare.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={scrollToForm}
                className="rounded-2xl bg-rose-600 px-6 py-3 font-semibold text-white shadow-lg hover:-translate-y-0.5 transition"
              >
                {/* PLACEHOLDER: Ganti teks CTA */}
                Daftar Reseller Gratis
              </button>
              <a
                href="#showcase"
                className="rounded-2xl px-6 py-3 font-semibold border border-slate-200 hover:bg-slate-50"
              >
                Lihat Portofolio
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
              {/* PLACEHOLDER: Ganti trust badges */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Brand
                10+ tahun
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Produk
                BPOM
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Support
                penuh
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            {/* Video hero – autoplay muted, tombol unmute di pojok */}
            <video
              ref={videoRef}
              src="/hero-video.mp4"
              autoPlay
              loop
              playsInline
              muted
              className="h-[420px] md:h-[480px] w-auto rounded-3xl object-cover shadow-inner bg-black"
            />
            {/* Tombol unmute / mute */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all"
              aria-label={isMuted ? 'Aktifkan suara' : 'Matikan suara'}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-6.364-2.636a9 9 0 010-12.728" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="rounded-3xl border border-slate-100 p-8 shadow-sm">
            {/* PLACEHOLDER: Ganti judul dan poin masalah */}
            <h2 className="text-xl font-bold">
              Kendala Memulai Bisnis Reseller Skincare
            </h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Bingung memilih produk yang tepat dan terpercaya</li>
              <li>• Khawatir stok tidak laku dan modal terbuang</li>
              <li>• Tidak tahu cara promosi yang efektif</li>
              <li>• Tidak ada support dari supplier</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-rose-600 p-8 text-white shadow-lg">
            {/* PLACEHOLDER: Ganti judul dan poin solusi */}
            <h3 className="text-xl font-bold">Solusi Program Reseller DRW</h3>
            <p className="mt-3 opacity-95">
              Sistem reseller yang mudah, menguntungkan, dan didukung penuh oleh
              tim DRW Skincare.
            </p>
            <ul className="mt-5 space-y-3">
              <li>✓ Produk bestseller dengan repeat order tinggi</li>
              <li>✓ Harga reseller kompetitif & margin besar</li>
              <li>✓ Materi promosi siap pakai</li>
              <li>✓ Grup support & training reseller aktif</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="mx-auto max-w-6xl px-4 py-14">
        {/* PLACEHOLDER: Ganti judul section benefits */}
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Kenapa Harus Jadi Reseller DRW Skincare?
        </h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {/* PLACEHOLDER: Ganti benefit cards sesuai program reseller */}
          {[
            {
              title: "Brand terpercaya 10+ tahun",
              desc: "Reputasi kuat dan komunitas pelanggan loyal di seluruh Indonesia.",
              icon: ShieldCheckIcon,
            },
            {
              title: "Produk dermatology tested",
              desc: "Repeat order tinggi, formulasi aman & terdaftar BPOM.",
              icon: BeakerIcon,
            },
            {
              title: "Training & support aktif",
              desc: "Grup reseller, webinar rutin, dan pendampingan penjualan.",
              icon: AcademicCapIcon,
            },
            {
              title: "Materi promosi siap pakai",
              desc: "Konten sosmed, caption, dan desain promosi tersedia.",
              icon: PresentationChartLineIcon,
            },
            {
              title: "Margin & komisi menarik",
              desc: "Harga reseller kompetitif dengan potensi keuntungan besar.",
              icon: CurrencyDollarIcon,
            },
            {
              title: "Sistem & legalitas jelas",
              desc: "Kontrak transparan, produk legal, dan tata kelola resmi.",
              icon: DocumentTextIcon,
            },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="h-10 w-10 rounded-xl bg-rose-100 mb-4 flex items-center justify-center">
                <b.icon className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO PELUANG BISNIS */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="relative rounded-3xl overflow-hidden shadow-lg bg-black">
          <video
            ref={benefitVideoRef}
            src="/benefit-video.mp4"
            autoPlay
            loop
            playsInline
            muted
            className="w-full object-cover"
          />
          {/* Tombol unmute / mute benefit video */}
          <button
            onClick={toggleBenefitMute}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all"
            aria-label={isBenefitMuted ? 'Aktifkan suara' : 'Matikan suara'}
          >
            {isBenefitMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-6.364-2.636a9 9 0 010-12.728" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase" className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          {/* PLACEHOLDER: Ganti judul dan jumlah reseller */}
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Ribuan Reseller Sudah Bergabung
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* PLACEHOLDER: Ganti dengan gambar showcase reseller */}
          {[...Array(10)].map((_, i) => (
            <img
              key={i}
              src={`/showcase/${i + 1}.png`}
              alt={`Showcase ${i + 1}`}
              className="aspect-[4/3] rounded-2xl object-cover w-full"
            />
          ))}
        </div>
        {/* PLACEHOLDER: Ganti testimoni */}
        <blockquote className="mt-6 rounded-2xl border border-slate-100 p-6 text-slate-700 italic">
          "Bergabung sebagai reseller DRW Skincare adalah keputusan terbaik saya.
          Produknya laris, supportnya luar biasa, dan penghasilan saya terus
          bertumbuh setiap bulan."
        </blockquote>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="mx-auto max-w-6xl px-4 py-14">
        {/* PLACEHOLDER: Ganti judul section paket */}
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Pilih Paket Reseller Sesuai Targetmu
        </h2>
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* PLACEHOLDER: Ganti detail paket reseller (nama, harga, benefit) */}
          {[
            {
              tier: "STARTER",
              price: "PLACEHOLDER",
              description:
                "Paket awal untuk reseller baru yang ingin memulai bisnis skincare dengan modal terjangkau.",
              bullets: [
                "Produk Skincare:",
                "• PLACEHOLDER – daftar produk starter",
                "",
                "Fasilitas Reseller:",
                "• Akses grup reseller eksklusif",
                "• Materi promosi digital siap pakai",
                "• Training online onboarding",
                "",
                "TIDAK TERMASUK:",
                "• PLACEHOLDER – item tidak termasuk",
              ],
            },
            {
              tier: "PREMIUM",
              price: "PLACEHOLDER",
              description:
                "Paket lengkap untuk reseller serius yang ingin memaksimalkan omzet dan keuntungan.",
              bullets: [
                "Produk Skincare:",
                "• PLACEHOLDER – daftar produk premium",
                "",
                "Fasilitas Reseller:",
                "• Semua benefit paket Starter",
                "• Harga reseller lebih kompetitif",
                "• Prioritas stok & pengiriman",
                "• Mentoring 1-on-1 dengan tim DRW",
                "",
                "TIDAK TERMASUK:",
                "• PLACEHOLDER – item tidak termasuk",
              ],
            },
          ].map((p, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-100 p-6 shadow-sm bg-gradient-to-br from-rose-50 to-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-rose-700">{p.tier}</h3>
                <div className="bg-rose-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                  {p.price}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 italic">
                {p.description}
              </p>
              <div className="bg-white rounded-2xl p-4 shadow-inner">
                <h4 className="font-semibold text-rose-600 mb-3">
                  SUDAH TERMASUK:
                </h4>
                <div className="space-y-1 text-sm text-slate-700 max-h-96 overflow-y-auto">
                  {p.bullets.map((b, j) => (
                    <div
                      key={j}
                      className={
                        b === ""
                          ? "py-1"
                          : b.includes(":") && !b.startsWith("•")
                          ? "font-semibold text-rose-600 mt-3"
                          : b.startsWith("TIDAK TERMASUK")
                          ? "font-semibold text-red-600 mt-3"
                          : ""
                      }
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.fbq) {
                    window.fbq("track", "AddToCart", {
                      content_name: p.tier + " Package Selection",
                      content_category: "Reseller Package",
                    });
                  }
                  setPackageTier(p.tier);
                  scrollToForm();
                }}
                className="mt-6 w-full rounded-xl bg-rose-600 py-3 font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Daftar Paket Ini
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl bg-gradient-to-br from-rose-600 to-pink-700 p-8 text-white">
          {/* PLACEHOLDER: Ganti judul dan poin support */}
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Bukan Sekadar Reseller — Kami Dampingi Sampai Sukses
          </h2>
          <div className="mt-6 grid md:grid-cols-5 gap-4 text-sm">
            {[
              "Onboarding & training awal",
              "Grup reseller aktif",
              "Materi promosi siap pakai",
              "Update produk & promo rutin",
              "Dukungan customer service",
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-white/10 p-4">
                {s}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={scrollToForm}
              className="rounded-xl bg-white px-5 py-3 font-semibold text-rose-700 hover:bg-rose-50"
            >
              Isi Form & Daftar Gratis
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-14">
        {/* PLACEHOLDER: Ganti judul FAQ */}
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Pertanyaan yang Sering Ditanyakan
        </h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-100">
          {/* PLACEHOLDER: Ganti pertanyaan & jawaban FAQ */}
          {[
            {
              q: "Apakah saya harus punya pengalaman jualan skincare?",
              a: "Tidak. DRW menyediakan training lengkap, materi promosi, dan grup support untuk membantu reseller baru.",
            },
            {
              q: "Apakah produk DRW Skincare sudah terdaftar BPOM?",
              a: "Ya. Semua produk DRW Skincare telah terdaftar di BPOM dan aman digunakan.",
            },
            {
              q: "Bagaimana cara mendaftar sebagai reseller?",
              a: "Isi form di bawah. Tim kami akan menghubungi melalui WhatsApp untuk proses pendaftaran dan pengiriman katalog.",
            },
            {
              q: "Apakah ada minimum order?",
              a: "PLACEHOLDER – Jelaskan ketentuan minimum order sesuai paket yang dipilih.",
            },
          ].map((f, i) => (
            <details key={i} className="group open:shadow-sm">
              <summary className="cursor-pointer list-none px-6 py-5 font-semibold hover:bg-slate-50">
                <span className="mr-3 inline-block h-5 w-5 rounded-full bg-rose-100 text-rose-600 text-center">
                  {i + 1}
                </span>
                {f.q}
              </summary>
              <div className="px-6 pb-6 text-slate-600">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="lead-form" className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            {/* PLACEHOLDER: Ganti judul dan deskripsi form */}
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Daftar Sekarang & Mulai Bisnis Reseller
            </h2>
            <p className="mt-3 text-slate-600">
              Tim kami akan menghubungi melalui WhatsApp untuk mengirimkan
              katalog produk dan informasi lengkap program reseller.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>• Respon cepat di jam kerja</li>
              <li>• Data Anda aman dan tidak dibagikan</li>
              <li>• Pendaftaran 100% gratis</li>
            </ul>
          </div>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 p-6 shadow-sm"
          >
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Nama Lengkap</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Tulis nama Anda"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kota Domisili</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Contoh: Yogyakarta"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nomor WhatsApp</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Contoh: 0812xxxxxxx"
                />
              </div>
              <div>
                {/* PLACEHOLDER: Sesuaikan opsi paket */}
                <label className="text-sm font-medium">Paket Minat</label>
                <select
                  value={packageTier}
                  onChange={(e) => setPackageTier(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <option>Mulai 1 Juta</option>
                  <option>Mulai 2 Juta</option>
                  <option>Mulai 3 Juta</option>
                  <option>Mulai 5 Juta</option>
                  <option>Mulai 10 Juta</option>
                </select>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="agree" className="select-none">
                  Saya setuju data saya digunakan untuk keperluan pendaftaran
                  reseller sesuai{" "}
                  <a
                    className="underline"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Kebijakan Privasi
                  </a>
                  .
                </label>
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="rounded-2xl bg-rose-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-rose-700"
              >
                Kirim & WhatsApp Kami
              </button>
              <p className="text-xs text-slate-500">
                Dengan menekan tombol ini Anda akan diarahkan ke WhatsApp
                official DRW Skincare.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="DRW Skincare Logo"
                className="h-8 w-8 rounded-lg"
              />
              <div>
                {/* PLACEHOLDER: Ganti nama dan tagline footer */}
                <div className="font-semibold text-slate-800">DRW Skincare</div>
                <div className="text-xs">Official Reseller Program</div>
              </div>
            </div>
            <div className="flex gap-6">
              <a className="hover:text-rose-600" href="#">
                Kebijakan Privasi
              </a>
              <a className="hover:text-rose-600" href="#">
                Syarat & Ketentuan
              </a>
              <a className="hover:text-rose-600" href="#">
                Kontak
              </a>
            </div>
          </div>
          <div className="mt-6 text-xs">
            © {new Date().getFullYear()} DRW Skincare. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-80 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="w-6 h-6 text-white"
                  />
                </div>
                <div>
                  {/* PLACEHOLDER: Ganti nama chat popup */}
                  <h3 className="font-semibold text-slate-800">DRW Skincare</h3>
                  <p className="text-xs text-green-600">● Online</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-sm text-slate-700">Halo! 👋</p>
                {/* PLACEHOLDER: Ganti pesan popup WA */}
                <p className="text-sm text-slate-700 mt-1">
                  Tertarik jadi Reseller DRW Skincare? Yuk daftar gratis
                  sekarang!
                </p>
              </div>
              <button
                onClick={openWhatsAppDirect}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                Chat via WhatsApp
              </button>
            </div>
          </div>
        )}

        <button
          onClick={toggleChat}
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
        >
          {isChatOpen ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7" />
          )}
        </button>
      </div>
    </div>
  );
}
