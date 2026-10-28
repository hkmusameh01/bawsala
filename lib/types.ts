export type Market = "cfd" | "futures";

/** static: الحد ثابت من رأس المال الأصلي
 *  trail_intraday: يلحق أعلى equity لحظياً
 *  trail_eod: يلحق أعلى رصيد بنهاية اليوم */
export type DDType = "static" | "trail_intraday" | "trail_eod";

export interface Source {
  name: string;
  url: string;
}

export interface Firm {
  slug: string;
  name: string;
  tagline: string;
  facts: string[];
  markets: Market[];
  platforms: string;
  payout: string;
  /** طرق سحب نعرف قيودها الجغرافية */
  rails: "rise"[];
  /** رموز ISO للدول المذكورة في قائمة المنع المنشورة */
  restricted: string[];
  restrictedNote?: string;
  /** ضع هنا رابط الأفلييت الخاص بك */
  link: string;
  /** كودك الخاص بعد القبول في برنامج الأفلييت */
  myCode: string;
  sources: Source[];
}

export interface Challenge {
  slug: string;
  firm: string;
  name: string;
  size: number;
  market: Market;
  /** 0 = حساب فوري */
  steps: 0 | 1 | 2;
  price: number | null;
  currency: "USD" | "EUR";
  priceNote: string;
  monthly?: boolean;
  /** هدف كل مرحلة بالنسبة المئوية، فارغ للحساب الفوري */
  targets: number[];
  /** الحد اليومي كنسبة من رأس المال الأصلي، يُقاس من رصيد بداية اليوم */
  dailyPct: number | null;
  dailyNote?: string;
  maxLossPct: number;
  ddType: DDType;
  /** المستوى اللي يتوقف عنده حد التصفية المتحرك (رصيد مطلق) */
  trailLockAt?: number;
  ddNote: string;
  consistencyPct: number | null;
  /** متى تنطبق القاعدة: بالتقييم أو بالحساب الممول (فارغ = الاثنين) */
  consistencyStage?: "eval" | "funded";
  consistencyNote?: string;
  profitDays?: { count: number; minAmount: number; note: string; stage?: "eval" | "funded" };
  minTradingDays?: number;
  /** أقصى خسارة مفتوحة كنسبة من رأس المال */
  floatingRiskPct?: number;
  /** قاعدة: أكبر خسارة يومية لا تتجاوز أكبر ربح يومي */
  lossNotAboveWin?: boolean;
  splitPct: number;
  splitText: string;
  platform: string;
  hidden: string[];
  checked: string;
  sources: Source[];
}

export interface Offer {
  id: string;
  firm: string;
  discountPct: number;
  upTo?: boolean;
  title: string;
  appliesTo: string;
  code?: string;
  /** ISO date-time */
  startsAt?: string;
  endsAt?: string;
  endsAtEstimated?: boolean;
  exclusive: boolean;
  source: Source;
  checked: string;
}
