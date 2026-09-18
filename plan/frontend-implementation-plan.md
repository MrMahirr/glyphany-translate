# Glyphany-Translate Frontend — Kapsamlı Implementasyon Planı

Mevcut `glyphany-web` projesi (Next.js 16 + Tailwind CSS v4 + TypeScript + Zustand + TanStack Query) üzerinde, 7 tasarım mock-up'ına (HTML + PNG) sadık kalarak, SOLID prensiplerine uygun, global componentler ve custom hook'lar merkezli bir frontend oluşturmayı hedefler.

---

## Proje Mevcut Durum

| Özellik | Durum |
|---|---|
| Framework | Next.js 16.3.5 (App Router) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| State | Zustand v5 |
| Data Fetching | TanStack React Query v5 |
| HTTP | Axios |
| PDF Viewer | `pdfjs-dist` + `react-pdf` |
| Mimari | Feature-Sliced Design (`app/`, `entities/`, `features/`, `shared/`, `widgets/`) |

> [!IMPORTANT]
> Tailwind CSS v4 **son sürüm** zaten projede mevcut. `@theme inline` ile CSS-first config kullanılıyor. Design token'lar `globals.css` içinde `@theme inline` bloğunda tanımlanacak.

---

## Open Questions

> [!IMPORTANT]
> **1. Auth Provider:** Login sayfasında Google ve GitHub OAuth gösterilmiş. Hangi auth provider (NextAuth, Clerk, custom JWT) kullanılacak? Şimdilik JWT tabanlı custom auth ile ilerlenecek, token yönetimi `features/auth/` altında yapılacak.

> [!IMPORTANT]
> **2. Uygulama İsmi:** Tasarımlarda "TransDoc.ai" ismi var, proje adı "Glyphany-translate". Hangisi kullanılacak? Şimdilik "Glyphany" olarak ilerlenecek, logo ve brand name kolayca değiştirilebilir bir global config'den okunacak.

---

## Proposed Changes

### Design System & Global Altyapı (Faz 0 — Temel)

Bu faz, diğer tüm sayfaların bağımlı olduğu ortak design token'ları, global stilleri ve paylaşılan UI component kütüphanesini kurar. SOLID'in **Single Responsibility** ve **Open/Closed** prensipleri gereği her component tek bir sorumluluğa sahip ve extend edilebilir olacak.

---

#### [MODIFY] [globals.css](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/glyphany-web/src/app/globals.css)

Tailwind v4 `@theme inline` blokları ile tüm design token'ları tanımlanacak:
- **Renkler:** `Fonts.markdown`'taki tüm Material Design 3 renk token'ları (`surface`, `primary`, `on-surface`, `error`, vs.)
- **Tipografi:** Plus Jakarta Sans font ailesi, tüm font scale'ler (display, headline-xl/lg/md/sm, body-lg/md/sm, label-lg/md/caps)
- **Spacing:** `space-xs/sm/md/lg/xl`, `gutter`, `margin`
- **Border Radius:** `sm/DEFAULT/md/lg/xl/full`
- **Shadows (Elevation):** `elevation-0/1/2/3` custom shadow token'ları
- **Animasyonlar:** `shimmer`, `fade-in`, `slide-up` keyframe'leri

---

#### [MODIFY] [layout.tsx](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/glyphany-web/src/app/layout.tsx)

- Font: `Geist` → `Plus Jakarta Sans` (Google Fonts)
- Metadata: Proje adı ve açıklama güncellemesi
- Global provider'lar eklenmesi (QueryClientProvider, AuthProvider)

---

### API Katmanı Mimarisi (Backend Bağlantı Yapısı)

Frontend-backend API iletişimi aşağıdaki katmanlı yapı ile kurulacaktır. Bu pattern tüm feature'larda tutarlı olarak uygulanacaktır:

#### 1. `src/lib/http.ts` — Merkezi HTTP Client (`apiClient`)
Axios üzerine kurulu, interceptor'ları olan merkezi HTTP istemcisi. Tüm API çağrıları bu instance üzerinden yapılır.
- `get<T>(url)`, `post<T>(url, data)`, `patch<T>(url, data)`, `delete(url)`, `postFormData<T>(url, formData)` metodları
- Request interceptor: Auth token ekleme (Bearer JWT)
- Response interceptor: 401 handling, error normalization
- Base URL `.env` dosyasından `NEXT_PUBLIC_API_BASE_URL` ile okunur

#### 2. `src/constant/MethodNames.ts` — API Endpoint Sabitleri
Her domain için endpoint path'leri enum/object olarak tanımlanır:

```typescript
// Örnek yapı:
export const AuthApiMethod = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

export const TranslationApiMethod = {
  CREATE: '/translations',
  SEARCH: '/translations/search',
  DETAIL: '/translations',
  DELETE: '/translations',
  DOWNLOAD: '/translations/download',
} as const;

export const JobApiMethod = {
  STATUS: '/jobs',
  CANCEL: '/jobs/cancel',
} as const;

export const SettingsApiMethod = {
  GET: '/settings',
  UPDATE: '/settings',
  USAGE: '/settings/usage',
} as const;
```

#### 3. `src/domain/` — Domain Type Tanımları
Her domain'in request/response tipleri, payload interface'leri ve sabit değerleri bu klasörde tanımlanır:

```
src/domain/
├── auth/
│   └── authDomains.ts          # LoginPayload, RegisterPayload, AuthResponse, UserProfile
├── translation/
│   └── translationDomains.ts   # TranslationListParams, TranslationListResponse, TranslationResponse, CreateTranslationPayload
├── job/
│   └── jobDomains.ts           # JobStatusResponse, JobStep, JobProgress
└── settings/
    └── settingsDomains.ts      # UserSettings, UsageResponse, UpdateSettingsPayload
```

#### 4. `src/helpers/buildSearchPath.ts` — Query String Builder
Liste/arama endpoint'leri için query parametrelerini URL'e dönüştüren yardımcı fonksiyon:

```typescript
export function buildSearchPath(basePath: string, params?: Record<string, unknown>): string {
  if (!params) return basePath;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
```

#### 5. Feature API Dosyaları — Standalone Async Fonksiyonlar
Her feature kendi `api/` klasöründe, yukarıdaki altyapıyı kullanan saf async fonksiyonlar barındırır:

```typescript
// Örnek: src/features/translation-list/api/translationApi.ts
import { apiClient } from '../../../lib/http';
import { TranslationApiMethod } from '../../../constant/MethodNames';
import { buildSearchPath } from '../../../helpers/buildSearchPath';
import type {
  TranslationListParams,
  TranslationListResponse,
  TranslationResponse,
} from '../../../domain/translation/translationDomains';

export async function getTranslations(params?: TranslationListParams): Promise<TranslationListResponse> {
  const response = await apiClient.get<TranslationListResponse>(
    buildSearchPath(TranslationApiMethod.SEARCH, params)
  );
  return response.data;
}

export async function getTranslation(translationId: string): Promise<TranslationResponse> {
  const response = await apiClient.get<TranslationResponse>(
    `${TranslationApiMethod.DETAIL}/${translationId}`
  );
  return response.data;
}

export async function deleteTranslation(translationId: string): Promise<void> {
  await apiClient.delete(`${TranslationApiMethod.DELETE}/${translationId}`);
}
```

> [!NOTE]
> Bu pattern'de **class kullanılmaz**, her API fonksiyonu standalone `async function` olarak export edilir. TanStack React Query hook'ları bu fonksiyonları `queryFn` / `mutationFn` olarak doğrudan consume eder.

---

### Kütüphaneler (Yeni Eklenmesi Gerekenler)

| Kütüphane | Kullanım Amacı |
|---|---|
| `react-hot-toast` | Bildirim/toast sistemi |
| `framer-motion` | Sayfa geçişleri ve micro-animasyonlar |
| `react-dropzone` | Dosya yükleme dropzone |
| `clsx` | Conditional className birleştirme |

---

### Global Shared UI Components (`src/shared/ui/`)

Her bir component kendi dosyasında, tek sorumluluğa sahip, prop interface'leri ile tip güvenli olacak:

| Component | Dosya | Açıklama |
|---|---|---|
| `Button` | `shared/ui/Button.tsx` | Primary, Secondary, Ghost, Danger varyantları. `variant`, `size`, `loading`, `disabled`, `icon` prop'ları |
| `Input` | `shared/ui/Input.tsx` | Text, Email, Password, Number. Left icon, right action slot, error state |
| `Select` | `shared/ui/Select.tsx` | Custom styled dropdown, Material icon chevron |
| `Toggle` | `shared/ui/Toggle.tsx` | iOS tarzı switch toggle, label + description destekli |
| `Badge` | `shared/ui/Badge.tsx` | Pill badge, status dot, variant: `primary`, `success`, `error`, `neutral`, `caps` |
| `Card` | `shared/ui/Card.tsx` | Elevation level, padding, rounded boyutu ayarlanabilir container |
| `ProgressBar` | `shared/ui/ProgressBar.tsx` | Yüzdelik ilerleme çubuğu, shimmer efekti, gradient desteği |
| `Stepper` | `shared/ui/Stepper.tsx` | Vertical stepper, completed/active/pending durumları |
| `DataTable` | `shared/ui/DataTable.tsx` | Sortable, hoverable satırlar, generic tipli |
| `Pagination` | `shared/ui/Pagination.tsx` | Sayfa navigasyonu |
| `EmptyState` | `shared/ui/EmptyState.tsx` | İkon, başlık, açıklama, CTA butonlu boş durum |
| `Modal` | `shared/ui/Modal.tsx` | Dialog/Modal overlay |
| `Tooltip` | `shared/ui/Tooltip.tsx` | Hover tooltip |
| `Icon` | `shared/ui/Icon.tsx` | Material Symbols Outlined wrapper, size/fill/weight ayarlanabilir |
| `Divider` | `shared/ui/Divider.tsx` | Yatay ayırıcı, ortasında metin gösterebilen |

---

### Global Layout Components (`src/widgets/`)

| Component | Dosya | Açıklama |
|---|---|---|
| `LandingHeader` | `widgets/landing-header/` | Public sayfalar için header (Features, Formats, Enterprise, Pricing nav + Login/Signup) |
| `AppHeader` | `widgets/app-header/` | Authenticated sayfalar için header (Dosya adı, sayfa navigasyonu, dil seçici, zoom, download, profil) |
| `Footer` | `widgets/footer/` | Global footer (Logo, copyright, Privacy, ToS) |

---

### Custom Hooks (`src/shared/hooks/`)

| Hook | Açıklama |
|---|---|
| `useAuth` | Auth state, login/logout/register fonksiyonları, token yönetimi |
| `useFileUpload` | Drag & drop + file input yönetimi, dosya validasyonu, preview state |
| `useTranslationJob` | Çeviri iş durumu polling, SSE bağlantısı |
| `useLocalStorage` | Type-safe localStorage wrapper |
| `useDebounce` | Debounced value hook |
| `useMediaQuery` | Responsive breakpoint hook |

---

## Sayfa Bazlı İmplementasyon Sırası

Aşağıdaki sıralama, bağımlılık zinciri ve kullanıcı akışı önceliğine göre yapılmıştır:

---

### Faz 1 — Login / Register Sayfası
**Referans:** [login.html](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/login.html) + [login.png](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/login.png)

**Neden ilk?** Tüm authenticated sayfaların giriş noktası. Auth altyapısı kurulmadan diğer sayfalar çalışamaz.

#### [NEW] `src/app/(auth)/login/page.tsx`
#### [NEW] `src/features/auth/ui/LoginForm.tsx`
#### [NEW] `src/features/auth/ui/RegisterForm.tsx`
#### [NEW] `src/features/auth/ui/AuthTabs.tsx`
#### [NEW] `src/features/auth/ui/SocialAuthButtons.tsx`
#### [NEW] `src/features/auth/hooks/useAuth.ts`
#### [NEW] `src/features/auth/api/authApi.ts`
Pattern: `apiClient` + `AuthApiMethod` sabitleri + `authDomains` tipleri kullanır.
`login(payload)`, `register(payload)`, `refreshToken()`, `getMe()` fonksiyonları.
#### [NEW] `src/features/auth/store/authStore.ts`
#### [NEW] `src/domain/auth/authDomains.ts`

**Öne çıkan UI özellikleri:**
- Login/Signup arası tab geçişi (animasyonlu)
- Gradient arka plan glow efektleri
- Password visibility toggle
- Password strength indicator (register modunda)
- Google + GitHub OAuth butonları
- Enterprise SSO linki
- Trust badge'leri (SOC2, ISO-17100, Zero Training)
- Form validasyonu

---

### Faz 2 — Anasayfa (Landing / Upload)
**Referans:** [Anasayfa.html](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/Anasayfa.html) + [Anasayfa.png](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/Anasayfa.png)

**Neden ikinci?** Ana sayfa, kullanıcı giriş yaptıktan sonra PDF yükleme ve çeviri başlatma akışının başlangıcı.

#### [MODIFY] `src/app/page.tsx`
Mevcut boilerplate tamamen yeniden yazılacak.

#### [NEW] `src/app/(main)/layout.tsx`
Auth kontrolü + LandingHeader + Footer ile sarmalanmış layout.

#### [NEW] `src/features/upload-pdf/ui/UploadDropzone.tsx`
#### [NEW] `src/features/upload-pdf/api/uploadApi.ts`
Pattern: `apiClient.postFormData` + `TranslationApiMethod.CREATE` kullanır.
`uploadAndTranslate(file, targetLang)` fonksiyonu FormData ile dosya gönderir.
#### [MODIFY] `src/features/upload-pdf/` (mevcut yapı genişletilecek)
#### [NEW] `src/features/select-language/ui/LanguageSelector.tsx`
#### [MODIFY] `src/features/select-language/` (mevcut yapı genişletilecek)
#### [NEW] `src/domain/translation/translationDomains.ts`
#### [NEW] `src/widgets/hero-section/HeroSection.tsx`
#### [NEW] `src/widgets/feature-highlights/FeatureHighlights.tsx`
#### [NEW] `src/widgets/social-proof/SocialProof.tsx`

**Öne çıkan UI özellikleri:**
- Hero section (AI badge, headline, subtext)
- 2-kolon layout (Sol: Upload card + dil seçici + CTA, Sağ: Demo preview + özellikler)
- Drag & drop dropzone, dosya preview feedback
- Trust indicator strip
- Social proof section (istatistik + kurum logoları)
- Gradient ambient glow background

---

### Faz 3 — Çeviri İlerleme Sayfası
**Referans:** [Anasayfa-ilerleme.html](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/Anasayfa-ilerleme.html) + [Anasayfa-ilerleme.png](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/Anasayfa-ilerleme.png)

**Neden üçüncü?** Upload sonrası kullanıcının yönlendirileceği sayfa. Job status polling mekanizması burada implemente edilir.

#### [NEW] `src/app/(main)/translate/[jobId]/progress/page.tsx`
#### [MODIFY] `src/features/job-status-polling/` (mevcut yapı genişletilecek)
#### [NEW] `src/features/job-status-polling/api/jobApi.ts`
Pattern: `apiClient` + `JobApiMethod` sabitleri + `jobDomains` tipleri kullanır.
`getJobStatus(jobId)`, `cancelJob(jobId)` fonksiyonları.
#### [NEW] `src/features/job-status-polling/ui/TranslationStepper.tsx`
#### [NEW] `src/features/job-status-polling/ui/ProgressControlBar.tsx`
#### [NEW] `src/features/job-status-polling/ui/DocumentMetadataCard.tsx`
#### [NEW] `src/features/job-status-polling/hooks/useJobStatusPolling.ts`
#### [NEW] `src/domain/job/jobDomains.ts`

**Öne çıkan UI özellikleri:**
- Top control bar (Job ID badge, cancel butonu)
- Döküman metadata kartı (dosya adı, boyut, sayfa, dil çifti, durum)
- 4 aşamalı vertical stepper (Completed ✓ / Active spinner / Pending)
- Overall progress bar (gradient shimmer efektli)
- "Safe to close" bilgi kartı
- Email notification toggle
- Realtime polling ile state güncellemesi

---

### Faz 4 — Çeviri Başarısız Sayfası
**Referans:** [çeviri-faild.html](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/çeviri-faild.html) + [çeviri-faild.png](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/çeviri-faild.png)

**Neden dördüncü?** İlerleme sayfasının error state'i. Aynı job route altında gösterilecek.

#### [NEW] `src/app/(main)/translate/[jobId]/failed/page.tsx`
#### [NEW] `src/features/job-status-polling/ui/TranslationFailedView.tsx`
#### [NEW] `src/features/job-status-polling/ui/TechnicalDetailsAccordion.tsx`
#### [NEW] `src/features/job-status-polling/ui/RecommendedFixes.tsx`

**Öne çıkan UI özellikleri:**
- Error illustration (custom SVG icon)
- Error kodu + meta bilgi badge'leri
- Retry / Contact Support / Upload New CTA butonları
- "Quota protected" bilgi kartı
- Genişletilebilir teknik detay accordion (terminal tarzı log, copy özelliği)
- Önerilen düzeltmeler grid'i

---

### Faz 5 — Tüm Çeviriler Listesi
**Referans:** [tüm-çeviriler.html](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/tüm-çeviriler.html) + [tüm-çeviriler.png](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/tüm-çeviriler.png)

**Neden beşinci?** Kullanıcının tüm geçmiş çevirileri göreceği dashboard. İlerleme ve hata sayfalarının listelendiği merkez.

#### [NEW] `src/app/(main)/translations/page.tsx`
#### [NEW] `src/features/translation-list/api/translationApi.ts`
Pattern: `apiClient` + `TranslationApiMethod` + `buildSearchPath` + `translationDomains` kullanır.
`getTranslations(params)`, `getAllTranslations(params)` (pagination loop dahil), `getTranslation(id)`, `deleteTranslation(id)` fonksiyonları.
#### [NEW] `src/features/translation-list/ui/TranslationTable.tsx`
#### [NEW] `src/features/translation-list/ui/TranslationTableRow.tsx`
#### [NEW] `src/features/translation-list/ui/TranslationFilters.tsx`
#### [NEW] `src/features/translation-list/ui/StorageMetrics.tsx`
#### [NEW] `src/features/translation-list/ui/TranslationEmptyState.tsx`
#### [NEW] `src/features/translation-list/hooks/useTranslationList.ts`
#### [NEW] `src/entities/translation-page/` (model/type tanımları genişletilecek)

**Öne çıkan UI özellikleri:**
- Sub-header bar (workspace switcher, engine telemetry)
- Arama + dil filtresi + durum filtresi + view switcher (table/grid)
- 4'lü metrik kartları (Cloud Storage progress, Layout Precision, Locales, Security)
- Tam özellikli data table (mini PDF preview, dil badge, durum badge, aksiyonlar)
- Pagination
- Empty state view (Upload CTA, desteklenen format pilleri)
- "New Translation" CTA butonu

---

### Faz 6 — Çeviri Detay / Split-Pane Reader
**Referans:** [çeviri.html](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/çeviri.html) + [çeviri.png](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/çeviri.png)

**Neden altıncı?** En karmaşık sayfa. PDF render, split pane, synced scroll ve interactive highlighting gerektirir. `react-pdf` ve `pdfjs-dist` entegrasyonu burada yapılır.

#### [NEW] `src/app/(main)/translate/[jobId]/view/page.tsx`
#### [MODIFY] `src/widgets/dual-pane-reader/` (mevcut yapı tamamen genişletilecek)
#### [NEW] `src/widgets/dual-pane-reader/ui/DualPaneReader.tsx`
#### [NEW] `src/widgets/dual-pane-reader/ui/DocumentPane.tsx`
#### [NEW] `src/widgets/dual-pane-reader/ui/PaneHeader.tsx`
#### [NEW] `src/widgets/dual-pane-reader/ui/PageFilmstrip.tsx`
#### [NEW] `src/widgets/dual-pane-reader/ui/ViewModeToggle.tsx`
#### [NEW] `src/widgets/dual-pane-reader/ui/SyncedScrollController.tsx`
#### [NEW] `src/widgets/dual-pane-reader/hooks/useSyncedScroll.ts`
#### [NEW] `src/widgets/dual-pane-reader/hooks/useViewMode.ts`

**Öne çıkan UI özellikleri:**
- Sticky sub-header (back, status badge, view mode toggle, sync scroll, glossary, fullscreen, download CTA)
- Dual-pane layout (Sol: Source EN, Sağ: Target ES)
- Her pane'de: ribbon header, scholarly PDF render, mathematical formulas, SVG circuit diagrams
- Hover'da paragraf çiftleri senkronize highlight
- View mode: Split / Original Only / Translated Only
- Docked bottom filmstrip (thumbnail carousel, page jump input, navigation)
- Neural glossary tag'leri (inline terminology mapping)

---

### Faz 7 — Kullanım / Ayarlar Sayfası
**Referans:** [kullanım.html](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/kullanım.html) + [kullanım.png](file:///c:/Users/MrMahirr/Desktop/Projeler/Glyphany-translate/plan/frontend-desing/kullanım.png)

**Neden son?** Ayarlar sayfası core akıştan bağımsız. Diğer tüm sayfalar tamamlandıktan sonra yapılabilir.

#### [NEW] `src/app/(main)/settings/page.tsx`
#### [NEW] `src/features/settings/api/settingsApi.ts`
Pattern: `apiClient` + `SettingsApiMethod` + `settingsDomains` kullanır.
`getSettings()`, `updateSettings(payload)`, `getUsage()` fonksiyonları.
#### [NEW] `src/features/settings/ui/SettingsSidebar.tsx`
#### [NEW] `src/features/settings/ui/UsageBanner.tsx`
#### [NEW] `src/features/settings/ui/SubscriptionCard.tsx`
#### [NEW] `src/features/settings/ui/PreferencesForm.tsx`
#### [NEW] `src/features/settings/ui/EngineSelector.tsx`
#### [NEW] `src/features/settings/ui/LayoutToggles.tsx`
#### [NEW] `src/features/settings/ui/StickyActionBar.tsx`
#### [NEW] `src/features/settings/hooks/useSettings.ts`
#### [NEW] `src/domain/settings/settingsDomains.ts`

**Öne çıkan UI özellikleri:**
- 2-kolon layout (Sol sidebar: nav menu + subscription card + org card, Sağ: form alanları)
- Usage banner (sayfa kullanım progress bar, metrik breakdown)
- Varsayılan dil seçici + formality selector
- Auto-detect toggle
- Translation engine seçimi (radio card: Auto/DeepL/Claude)
- Layout & Diagram handling toggle'ları (bilingual diagrams, LaTeX, glossary extraction)
- Sticky bottom save/discard action bar

---

## Dosya Yapısı Özeti

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── translations/page.tsx
│   │   ├── translate/[jobId]/
│   │   │   ├── progress/page.tsx
│   │   │   ├── failed/page.tsx
│   │   │   └── view/page.tsx
│   │   └── settings/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (redirect → login veya translations)
│
├── lib/
│   └── http.ts                          # Merkezi apiClient (axios instance + interceptors)
│
├── constant/
│   └── MethodNames.ts                   # AuthApiMethod, TranslationApiMethod, JobApiMethod, SettingsApiMethod
│
├── domain/
│   ├── auth/
│   │   └── authDomains.ts               # LoginPayload, RegisterPayload, AuthResponse, UserProfile
│   ├── translation/
│   │   └── translationDomains.ts        # TranslationListParams, TranslationListResponse, TranslationResponse
│   ├── job/
│   │   └── jobDomains.ts                # JobStatusResponse, JobStep, JobProgress
│   └── settings/
│       └── settingsDomains.ts           # UserSettings, UsageResponse, UpdateSettingsPayload
│
├── helpers/
│   └── buildSearchPath.ts               # Query string builder utility
│
├── entities/
│   ├── job/
│   └── translation-page/
│
├── features/
│   ├── auth/
│   │   ├── api/authApi.ts               # login(), register(), refreshToken(), getMe()
│   │   ├── hooks/useAuth.ts
│   │   ├── store/authStore.ts
│   │   └── ui/
│   ├── upload-pdf/
│   │   ├── api/uploadApi.ts             # uploadAndTranslate(file, targetLang)
│   │   ├── hooks/
│   │   └── ui/
│   ├── select-language/
│   │   └── ui/
│   ├── job-status-polling/
│   │   ├── api/jobApi.ts                # getJobStatus(jobId), cancelJob(jobId)
│   │   ├── hooks/useJobStatusPolling.ts
│   │   └── ui/
│   ├── translation-list/
│   │   ├── api/translationApi.ts        # getTranslations(params), getAllTranslations(), deleteTranslation(id)
│   │   ├── hooks/useTranslationList.ts
│   │   └── ui/
│   └── settings/
│       ├── api/settingsApi.ts           # getSettings(), updateSettings(payload), getUsage()
│       ├── hooks/useSettings.ts
│       └── ui/
│
├── shared/
│   ├── api/
│   │   └── queryClient.ts              # TanStack Query client config
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Toggle.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Stepper.tsx
│   │   ├── DataTable.tsx
│   │   ├── Pagination.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Icon.tsx
│   │   ├── Divider.tsx
│   │   └── index.ts
│   ├── config/
│   │   └── brand.ts
│   ├── types/
│   │   └── index.ts
│   └── lib/
│       └── cn.ts (clsx + twMerge utility)
│
└── widgets/
    ├── landing-header/
    ├── app-header/
    ├── footer/
    ├── hero-section/
    ├── feature-highlights/
    ├── social-proof/
    └── dual-pane-reader/
```

---

## Verification Plan

### Automated Tests
- `npm run build` — TypeScript compilation ve Next.js build başarılı olmalı
- `npm run lint` — ESLint hata vermemeli

### Manual Verification
1. Her sayfa tarayıcıda açılarak tasarım mock-up'ları ile karşılaştırılacak
2. Responsive davranış kontrol edilecek (mobile / tablet / desktop)
3. Tüm button, input, toggle gibi interactive componentlerin hover/focus/active state'leri test edilecek
4. Login → Upload → Progress → View akışı uçtan uca test edilecek
5. Light mode doğrulanacak (tasarımlar light mode üzerine kurulu)
