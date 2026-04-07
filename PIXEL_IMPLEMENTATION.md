# Meta Pixel Implementation - DRW Skincare Reseller

## 📊 Informasi Pixel

- **Pixel ID**: `1077062414508009`
- **CAPI Access Token**: Sudah dikonfigurasi di server
- **Status**: ✅ Aktif (Client-side + Server-side tracking)

## 🎯 Fitur yang Sudah Diimplementasikan

### 1. Client-Side Tracking (Browser)
Meta Pixel dipasang di semua halaman melalui `layout.tsx` dan akan otomatis track:
- **PageView** - Setiap kali halaman dimuat
- **ViewContent** - Ketika user melihat konten
- **Lead** - Ketika user submit form reseller
- **Contact** - Ketika user klik tombol WhatsApp
- **InitiateCheckout** - Ketika user scroll ke form

### 2. Server-Side Tracking (CAPI)
Conversions API sudah dikonfigurasi untuk meningkatkan akurasi tracking:
- Mengatasi masalah ad blocker
- Meningkatkan match rate dengan Facebook
- Data lebih akurat dan reliable
- Otomatis mengirim IP address dan user agent

## 📁 File yang Sudah Dibuat/Dimodifikasi

### 1. `app/layout.tsx`
File ini sudah diupdate dengan Pixel ID yang benar:
```typescript
fbq('init', '1077062414508009');
fbq('track', 'PageView');
```

### 2. `app/api/meta-pixel/route.ts` (BARU)
API endpoint untuk server-side tracking. Menerima event dari client dan forward ke Meta Conversions API.

### 3. `lib/meta-pixel.ts` (BARU)
Utility functions untuk memudahkan tracking. Fungsi-fungsi yang tersedia:

```typescript
// Track PageView
trackPageView();

// Track ViewContent
trackViewContent({
  content_name: "Product Name",
  content_category: "Skincare",
  value: 100000,
  currency: "IDR"
});

// Track Lead (Form submission)
trackLead({
  content_name: "Reseller Form",
  content_category: "Lead Generation"
});

// Track Contact (WhatsApp, Phone, dll)
trackContact({
  content_name: "WhatsApp Button",
  content_category: "Customer Support"
});

// Track AddToCart
trackAddToCart({
  content_name: "Product Name",
  value: 250000,
  currency: "IDR"
});

// Track Purchase
trackPurchase({
  value: 500000,
  currency: "IDR",
  content_name: "Order#123",
  num_items: 2
});
```

### 4. `components/LandingResellerDRW.tsx` (DIUPDATE)
Component sudah diupdate untuk menggunakan tracking functions dengan CAPI:
- Form submission → `trackLead()`
- WhatsApp button → `trackContact()`
- Scroll to form → `trackInitiateCheckout()`

## 🚀 Cara Menggunakan di Component Lain

### Import tracking functions:
```typescript
import { 
  trackLead, 
  trackContact, 
  trackViewContent,
  trackAddToCart,
  trackPurchase 
} from "@/lib/meta-pixel";
```

### Contoh penggunaan:
```typescript
// Di button click handler
const handleButtonClick = () => {
  trackContact({
    content_name: "Customer Support Button",
    content_category: "Support"
  });
  // ... logic lainnya
};

// Di form submission
const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  await trackLead({
    content_name: "Contact Form",
    content_category: "Lead Generation",
    value: 0,
    currency: "IDR"
  });
  
  // ... submit logic
};

// Di product view
useEffect(() => {
  trackViewContent({
    content_name: productName,
    content_category: "Skincare Products",
    content_ids: [productId],
    value: productPrice,
    currency: "IDR"
  });
}, [productId]);
```

## 🔍 Testing & Verifikasi

### 1. Test di Browser (Development)
```bash
npm run dev
```

Buka browser console (F12) dan cek:
- Network tab → lihat request ke `/api/meta-pixel`
- Console → tidak ada error tracking
- Facebook Pixel Helper Extension (recommended)

### 2. Facebook Events Manager
1. Buka [Facebook Events Manager](https://business.facebook.com/events_manager2/)
2. Pilih Pixel ID: `1077062414508009`
3. Cek "Test Events" untuk melihat event yang masuk secara real-time
4. Verifikasi event ada duplicate detection (client + server)

### 3. Pixel Helper Chrome Extension
Install: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/)
- Icon akan berubah hijau jika pixel terdeteksi
- Klik icon untuk melihat event yang di-fire

## ⚙️ Environment Variables (Opsional)

Jika ingin memindahkan sensitive data ke environment variables:

```env
# .env.local
NEXT_PUBLIC_META_PIXEL_ID=1077062414508009
META_CAPI_ACCESS_TOKEN=EAAVtLxF7MxQBRFJEqZBsedMizYo63OCLqtk7TLIayATAZAtXj8PGApEclgq2uko3xx5p0LzF12hyBp0fmxCVNTB1SKrRwre4kBJEf5bLCrsZB5JhSHNAZBXL57uz9gwac7oN9lbT5eMZAKr6JO4st3H3HnbOUBfydQvLuav359akKUlfn9xmbf81eg6b01edCeAZDZD
```

Update file `app/api/meta-pixel/route.ts`:
```typescript
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN!;
```

## 📱 Event Standar Meta Pixel

Event yang umum digunakan:
- ✅ `PageView` - Sudah otomatis
- ✅ `Lead` - Submit form
- ✅ `Contact` - Klik WhatsApp/Call
- ✅ `InitiateCheckout` - Mulai checkout/form
- ✅ `ViewContent` - Lihat produk/konten
- ✅ `AddToCart` - Tambah ke keranjang
- ✅ `Purchase` - Transaksi selesai
- `CompleteRegistration` - Registrasi akun
- `Search` - Search produk

## 🎯 Best Practices

1. **Jangan over-track** - Track event yang meaningful saja
2. **Gunakan value parameter** - Untuk event yang ada nilai moneter
3. **Consistent naming** - Gunakan naming convention yang konsisten
4. **Test secara berkala** - Pastikan tracking berjalan normal
5. **Privacy compliance** - Jangan track data sensitif (password, dll)

## 🔒 Security Notes

- Access Token sudah di-embed di server-side code
- Token tidak exposed ke client/browser
- API route protect sensitive credentials
- User data (IP, UA) di-hash sebelum dikirim ke Meta (opsional, bisa ditambahkan)

## 📞 Support

Jika ada masalah dengan tracking:
1. Cek Facebook Events Manager untuk error messages
2. Cek browser console untuk JavaScript errors
3. Verifikasi Pixel ID dan Access Token masih valid
4. Test dengan Facebook Pixel Helper extension

---

**Status**: ✅ Production Ready  
**Last Updated**: April 7, 2026  
**Maintainer**: Development Team
