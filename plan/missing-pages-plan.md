# Eksik Sayfalar (Missing Pages) Frontend Implementasyon Planı

Bu belge, projede linkleri/butonları bulunan ancak henüz tasarlanmamış ve kodlanmamış eksik sayfaların `Glyphany-translate` (Next.js & Feature-Sliced Design) mimarisine uygun şekilde geliştirilmesi için hazırlanmış planı içerir.

Tasarım dosyası (UI mock) olmadığı için bu sayfalar, mevcut Glyphany tasarım diline (Material 3, Plus Jakarta Sans, Tailwind CSS) uygun olarak model tarafından tasarlanıp kodlanacaktır.

## Hedefler
1. Eksik rotaların Next.js App Router (app/ dizini) yapısında ayağa kaldırılması.
2. Projenin genel tasarım diline (renk paletleri, typografik hiyerarşi, `surface-container` ve bileşen yapıları) sadık kalınarak, "tasarımsız" dahi olsa çok şık UI/UX oluşturulması.

---

## Faz 1 — Şifremi Unuttum (Forgot Password) Akışı
**Rota:** `/forgot-password` ve `/reset-password`
**Bağlam:** `(auth)` route grubu altında.
**Açıklama:**
Kullanıcıların şifrelerini unuttuklarında email girip sıfırlama linki isteyecekleri basit ve şık form ekranı. Mevcut login/register ekranlarındaki `AuthLayout` yapısı tekrar kullanılacaktır.
**Yapılacaklar:**
- `app/(auth)/forgot-password/page.tsx`
- `features/auth/ui/ForgotPasswordForm.tsx`

## Faz 2 — Yasal Sayfalar (Legal: Privacy & Terms)
**Rota:** `/privacy` ve `/terms`
**Bağlam:** `(main)` route grubu altında (Header ve Footer barındıran).
**Açıklama:**
Kullanım Koşulları ve Gizlilik Politikası sayfaları. Genellikle bolca metin (typography) içerir. Okunabilirliği yüksek (prose, line-height, margin), kurumsal bir tasarıma sahip statik sayfalar.
**Yapılacaklar:**
- `app/(main)/privacy/page.tsx`
- `app/(main)/terms/page.tsx`
- `widgets/legal/LegalLayout.tsx` (İki sayfanın ortak kullanacağı, sağda sidebar menü solda metin olan şablon)

## Faz 3 — Çeviri Kullanım Geçmişi (Page History / Billing)
**Rota:** `/settings/history`
**Bağlam:** `(main)` route grubu altında.
**Açıklama:**
Ayarlar (Settings) sayfasındaki "View Page History" butonunun gideceği yer. Kullanıcının harcadığı kotanın (örneğin 12 sayfa gitti, hangi dokümana ne zaman gitti) listelendiği data tablosu. `TranslationTable` bileşenine benzer ama faturalandırma odaklı bir tablo.
**Yapılacaklar:**
- `app/(main)/settings/history/page.tsx`
- `features/billing/ui/UsageHistoryTable.tsx`
- `features/billing/ui/BillingMetrics.tsx`

## Faz 4 — Sistem Durumu (System Status)
**Rota:** `/status`
**Bağlam:** `(main)` route grubu.
**Açıklama:**
Çeviri motorlarının (DeepL, Claude, Vector OCR) durumlarını "Operational", "Degraded", "Downtime" olarak gösteren modern bir telemetri ekranı.
**Yapılacaklar:**
- `app/(main)/status/page.tsx`
- `features/system-status/ui/StatusTimeline.tsx`
- `features/system-status/ui/ServiceHealthCards.tsx`

## Faz 5 — Dokümantasyon ve Kurumsal İletişim
**Rota:** `/docs/formatting` ve `/enterprise`
**Bağlam:** `(main)` route grubu.
**Açıklama:**
- `/docs/formatting`: PDF veya OCR sorunlarında kullanıcıya nasıl daha iyi belge formatlayacağını gösteren kılavuz.
- `/enterprise`: Kurumsal API erişimi ve özel model talepleri için Contact (İletişim) formu.
**Yapılacaklar:**
- `app/(main)/docs/formatting/page.tsx`
- `app/(main)/enterprise/page.tsx`
- `features/enterprise/ui/ContactForm.tsx`

---

## Tüm Süreç Boyunca Uygulanacak Kurallar
1. **FSD ve Alias:** `@/` path alias yapısına ve `entities`, `features`, `widgets`, `shared` katmanlarına uygun hareket edilecek.
2. **SOLID:** Karmaşık yapılar hook'lara veya domain fonksiyonlarına ayrılacak.
3. **Component Reusability:** Mevcut `Button`, `Icon` veya Layout (Header/Footer) bileşenleri kullanılacak. Yeni özel bileşenler sadece gerekli `features` klasörlerine açılacak.
4. **Tasarım Kalitesi:** Düz yazı sayfalarında bile Typography, spacing (boşluk) ve border/shadow tasarımları yüksek kalite (premium) görünecek.

> Not: Bu belge projenin `plan` klasörüne gelecekteki referanslar için kaydedilmiştir.
