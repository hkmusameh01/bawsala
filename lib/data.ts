import type { Challenge, Firm, Offer } from "./types";

/* =========================================================
   كل بيانات الموقع هنا. عدّل الأرقام والروابط والأكواد من هذا الملف.
   - link: استبدله برابط الأفلييت الخاص بك
   - myCode: كودك الخاص بعد القبول في برنامج الأفلييت
   - OFFERS: العروض اللي بتظهر في الصفحة الرئيسية
   ========================================================= */

export const LAST_UPDATED = "28 أكتوبر 2026";

export const FIRMS: Firm[] = [
  {
    slug: "fundingpips",
    name: "FundingPips",
    tagline: "حسابات فوركس رخيصة، وحساب Zero بدون تحدي",
    facts: ["أسعار تبدأ من مبالغ صغيرة", "السحب عبر Rise", "حساب Zero بقواعد أشد من باقي الحسابات"],
    markets: ["cfd"],
    platforms: "MT5 / Match-Trader / TradeLocker",
    payout: "عبر Rise: تحويل بنكي أو كريبتو",
    rails: ["rise"],
    restricted: [],
    link: "https://fundingpips.com",
    myCode: "",
    sources: [
      { name: "TheGodFunded", url: "https://thegodfunded.com/en/firms/fundingpips/" },
      { name: "TradeTanto", url: "https://tradetanto.com/learn/fundingpips-rules" },
    ],
  },
  {
    slug: "ftmo",
    name: "FTMO",
    tagline: "الاسم الأشهر في التمويل، تحديات بمرحلة أو مرحلتين",
    facts: ["تأسست 2015 في براغ", "رسوم تحدي المرحلتين تُسترد مع أول سحب", "حساب Swing للصفقات الطويلة"],
    markets: ["cfd"],
    platforms: "MT4 / MT5 / cTrader / DXtrade",
    payout: "تحقق من الطرق المتاحة لبلدك في لوحة الحساب",
    rails: [],
    restricted: ["SY", "IR", "PK", "VN", "MM", "KP"],
    restrictedNote: "قائمة FTMO المنشورة تشمل سوريا وإيران وباكستان وفيتنام وميانمار وكوريا الشمالية، مع استثناءات أخرى في موقعهم",
    link: "https://ftmo.com",
    myCode: "",
    sources: [
      { name: "FTMO", url: "https://ftmo.oanda.com/affiliate-program/" },
      { name: "TheGodFunded", url: "https://thegodfunded.com/en/firms/ftmo/challenges" },
    ],
  },
  {
    slug: "fundednext",
    name: "FundedNext",
    tagline: "تحديات Stellar بمراحل مختلفة، ونسبة من أرباح مرحلة التقييم",
    facts: ["انطلقت 2022", "أول سحب بعد 21 يوم", "عندها قسم عقود آجلة منفصل"],
    markets: ["cfd", "futures"],
    platforms: "MT4 / MT5 / cTrader",
    payout: "معالجة السحب خلال 24 ساعة حسب الشركة",
    rails: [],
    restricted: [],
    link: "https://fundednext.com",
    myCode: "",
    sources: [
      { name: "DayTrading.com", url: "https://www.daytrading.com/fundednext" },
      { name: "FundedTrading", url: "https://fundedtrading.com/propfirm/fundednext/" },
    ],
  },
  {
    slug: "the5ers",
    name: "The5ers",
    tagline: "شركة لندنية منذ 2016، بخطط توسّع طويلة",
    facts: ["مقرها لندن منذ 2016", "High Stakes بحد تصفية ثابت من رأس المال", "تجميد التداول دقيقتين حول الأخبار القوية"],
    markets: ["cfd", "futures"],
    platforms: "MT5",
    payout: "عبر Rise وطرق أخرى، كل 14 يوم",
    rails: ["rise"],
    restricted: [],
    link: "https://the5ers.com",
    myCode: "",
    sources: [
      { name: "TradingFunder", url: "https://tradingfunder.com/firms/the5ers/" },
      { name: "ProptradingVibes", url: "https://proptradingvibes.com/blog/the5ers-rules-overview" },
    ],
  },
  {
    slug: "apex",
    name: "Apex Trader Funding",
    tagline: "أكبر شركة عقود آجلة، بخصومات شبه دائمة",
    facts: ["تأسست 2021 في تكساس", "نظام جديد كلياً منذ 1 مارس 2026", "رسوم لمرة واحدة بدل الاشتراك الشهري"],
    markets: ["futures"],
    platforms: "Rithmic / Tradovate / WealthCharts",
    payout: "تحقق من الطرق المتاحة (يذكر متداولون استلامها عبر Wise)",
    rails: [],
    restricted: [],
    link: "https://apextraderfunding.com",
    myCode: "",
    sources: [
      { name: "ProptradingVibes", url: "https://proptradingvibes.com/blog/apex-trader-funding-rules-overview" },
      { name: "Tradecopia", url: "https://tradecopia.com/propfirms/apex-trader-funding" },
    ],
  },
  {
    slug: "topstep",
    name: "Topstep",
    tagline: "أقدم شركة عقود آجلة، من شيكاغو منذ 2010",
    facts: ["مقرها شيكاغو منذ 2010", "التداول عبر منصتها TopstepX", "اشتراك شهري حتى تجتاز"],
    markets: ["futures"],
    platforms: "TopstepX",
    payout: "تحقق من الطرق المتاحة (يذكر متداولون استلامها عبر Wise)",
    rails: [],
    restricted: [],
    link: "https://www.topstep.com",
    myCode: "",
    sources: [
      { name: "TradingFunder", url: "https://tradingfunder.com/topstep-rules" },
      { name: "FuturesHive", url: "https://www.futureshive.com/blog/topstep-combine-complete-guide" },
    ],
  },
];

export const CHALLENGES: Challenge[] = [
  {
    slug: "zero-5k", firm: "fundingpips", name: "Zero (بدون تحدي)", size: 5000, market: "cfd", steps: 0,
    price: 60, currency: "USD", priceNote: "دفعة واحدة",
    targets: [], dailyPct: 3, dailyNote: "يُحسب من الأعلى بين رصيد وequity بداية اليوم",
    maxLossPct: 5, ddType: "trail_intraday", trailLockAt: 5000,
    ddNote: "يلحق أعلى equity، ويثبت عند رأس المال (5,000$) بعد ربح 5%",
    consistencyPct: 15, consistencyNote: "أكبر يوم رابح ≤ 15% من مجموع الربح وقت طلب السحب",
    profitDays: { count: 7, minAmount: 12.5, note: "7 أيام رابحة كل 30 يوم، كل يوم ربحه 0.25% (12.5$) أو أكثر" },
    floatingRiskPct: 1, lossNotAboveWin: true,
    splitPct: 95, splitText: "95% كل أسبوعين (صفحة الشراء تقول حتى 100%)",
    platform: "MT5",
    hidden: ["حد خسارة مفتوحة 1% (50$)", "أكبر خسارة ما تتجاوز أكبر ربح", "ممنوع إبقاء صفقات مفتوحة على الويكند"],
    checked: "28 أكتوبر 2026",
    sources: [
      { name: "Propvator", url: "https://propvator.com/funding-pips/rules/" },
      { name: "TradeTanto", url: "https://tradetanto.com/learn/fundingpips-rules" },
    ],
  },
  {
    slug: "2-step-50k", firm: "ftmo", name: "FTMO Challenge مرحلتين", size: 50000, market: "cfd", steps: 2,
    price: 345, currency: "EUR", priceNote: "تُسترد مع أول سحب",
    targets: [10, 5], dailyPct: 5, dailyNote: "5% من رأس المال الأصلي، وتشمل الصفقات المفتوحة",
    maxLossPct: 10, ddType: "static", ddNote: "ثابت عند 45,000$ ولا يتحرك",
    consistencyPct: null, minTradingDays: 4,
    splitPct: 80, splitText: "80% ترتفع لـ 90% بخطة التوسع",
    platform: "MT4 / MT5 / cTrader / DXtrade",
    hidden: ["4 أيام تداول على الأقل بكل مرحلة"],
    checked: "أغسطس 2026",
    sources: [
      { name: "TheGodFunded", url: "https://thegodfunded.com/en/firms/ftmo/challenges" },
      { name: "MyForexFirms", url: "https://www.myforexfirms.com/blogs/ftmo-review-2026-drawdown-rules-consistency-rule-honest-verdict" },
    ],
  },
  {
    slug: "1-step-50k", firm: "ftmo", name: "FTMO مرحلة واحدة", size: 50000, market: "cfd", steps: 1,
    price: 319, currency: "EUR", priceNote: "دفعة واحدة",
    targets: [10], dailyPct: 3, maxLossPct: 10, ddType: "trail_eod",
    ddNote: "متحرك حسب أعلى رصيد بنهاية اليوم",
    consistencyPct: null, consistencyNote: "قاعدة Best Day تمنع إن يوم واحد كبير يجتاز التحدي (النسبة الدقيقة: تحقق من الموقع)",
    splitPct: 90, splitText: "90% من البداية",
    platform: "MT4 / MT5 / cTrader / DXtrade",
    hidden: ["قاعدة Best Day"],
    checked: "أغسطس 2026",
    sources: [
      { name: "PropFirmMap", url: "https://www.propfirmmap.com/firms/ftmo" },
      { name: "ProptradingVibes", url: "https://proptradingvibes.com/blog/ftmo-accounts-overview" },
    ],
  },
  {
    slug: "stellar-1-step-50k", firm: "fundednext", name: "Stellar مرحلة واحدة", size: 50000, market: "cfd", steps: 1,
    price: 329.99, currency: "USD", priceNote: "دفعة واحدة",
    targets: [10], dailyPct: 3, maxLossPct: 6, ddType: "static", ddNote: "ثابت عند 47,000$",
    consistencyPct: null,
    splitPct: 95, splitText: "حتى 95%",
    platform: "MT4 / MT5 / cTrader",
    hidden: ["الخسارة اليومية تشمل الصفقات المفتوحة", "أول سحب بعد 21 يوم"],
    checked: "2026",
    sources: [
      { name: "TheTrustedProp", url: "https://thetrustedprop.com/blogs/fundednext-stellar-1-step-challenge-explained-2026-guide" },
      { name: "DayTrading.com", url: "https://www.daytrading.com/fundednext" },
    ],
  },
  {
    slug: "stellar-2-step-100k", firm: "fundednext", name: "Stellar مرحلتين", size: 100000, market: "cfd", steps: 2,
    price: 549, currency: "USD", priceNote: "تُسترد مع أول مكافأة",
    targets: [8, 5], dailyPct: 5, maxLossPct: 10, ddType: "static", ddNote: "ثابت عند 90,000$",
    consistencyPct: null, minTradingDays: 5,
    splitPct: 95, splitText: "حتى 95%",
    platform: "MT4 / MT5 / cTrader",
    hidden: ["5 أيام تداول على الأقل بكل مرحلة", "تأخذ 15% من أرباح المرحلة الأولى حسب الشركة"],
    checked: "2026",
    sources: [
      { name: "LuxAlgo", url: "https://www.luxalgo.com/mcp/prop-firm-sim/fundednext-100k-stellar-2step/" },
      { name: "FundedTrading", url: "https://fundedtrading.com/propfirm/fundednext/" },
    ],
  },
  {
    slug: "high-stakes-100k", firm: "the5ers", name: "High Stakes مرحلتين", size: 100000, market: "cfd", steps: 2,
    price: null, currency: "USD", priceNote: "السعر: تحقق من الموقع",
    targets: [8, 5], dailyPct: 5, maxLossPct: 10, ddType: "static", ddNote: "ثابت من رأس المال الأصلي (90,000$)",
    consistencyPct: null,
    profitDays: { count: 3, minAmount: 500, note: "أيام رابحة مطلوبة، كل يوم ربحه 0.5% (500$) أو أكثر (العدد: تحقق من الموقع)", stage: "eval" },
    splitPct: 80, splitText: "80% ترتفع حتى 100%",
    platform: "MT5",
    hidden: ["ممنوع فتح أو إغلاق صفقات قبل الأخبار القوية وبعدها بدقيقتين"],
    checked: "مايو 2026",
    sources: [
      { name: "TradingFunder", url: "https://tradingfunder.com/firms/the5ers/" },
      { name: "ProptradingVibes", url: "https://proptradingvibes.com/blog/the5ers-rules-overview" },
    ],
  },
  {
    slug: "eod-50k", firm: "apex", name: "EOD 50K", size: 50000, market: "futures", steps: 1,
    price: 167, currency: "USD", priceNote: "قبل الخصم، دفعة واحدة",
    targets: [6], dailyPct: null, dailyNote: "حسابات EOD فيها حد يومي حسب صفحة الشركة، غير مُدخل هنا",
    maxLossPct: 4, ddType: "trail_eod", trailLockAt: 50100,
    ddNote: "2,000$ متحرك بنهاية اليوم، يثبت عند 50,100$",
    consistencyPct: 50, consistencyStage: "funded", consistencyNote: "بالحساب الممول فقط: أكبر يوم أقل من 50% من الربح وقت السحب",
    profitDays: { count: 5, minAmount: 0, note: "5 أيام رابحة قبل أول سحب (الحد الأدنى لربح اليوم: تحقق من الموقع)", stage: "funded" },
    splitPct: 100, splitText: "100% لأول 25,000$ ثم 90%",
    platform: "Rithmic / Tradovate / WealthCharts",
    hidden: ["قواعد مارس 2026 تختلف كلياً عن الحسابات القديمة", "يجب تفعيل الحساب الممول خلال 7 أيام من الاجتياز"],
    checked: "يوليو 2026",
    sources: [
      { name: "ProptradingVibes", url: "https://proptradingvibes.com/blog/apex-trader-funding-rules-overview" },
      { name: "Tradecopia", url: "https://tradecopia.com/propfirms/apex-trader-funding" },
    ],
  },
  {
    slug: "combine-50k", firm: "topstep", name: "Trading Combine 50K", size: 50000, market: "futures", steps: 1,
    price: 49, currency: "USD", priceNote: "شهرياً + 149$ تفعيل، أو 95$ شهرياً بدون تفعيل", monthly: true,
    targets: [6], dailyPct: null, dailyNote: "الحد اليومي اختياري في Topstep",
    maxLossPct: 4, ddType: "trail_intraday", ddNote: "2,000$ متحرك لحظياً مع الصفقات المفتوحة",
    consistencyPct: 50, consistencyStage: "eval", consistencyNote: "أكبر يوم أقل من 50% من مجموع الربح عند الاجتياز",
    splitPct: 90, splitText: "90%",
    platform: "TopstepX",
    hidden: ["سقف لكل سحب: 2,000$ (المسار العادي)", "اشتراك شهري يستمر حتى تنجح أو تلغي", "حد أقصى 5 عقود ميني أو 50 مايكرو"],
    checked: "2026",
    sources: [
      { name: "TradingFunder", url: "https://tradingfunder.com/topstep-rules" },
      { name: "FuturesHive", url: "https://www.futureshive.com/blog/topstep-combine-complete-guide" },
    ],
  },
];

export const OFFERS: Offer[] = [
  {
    id: "fundingpips-halloween-2026", firm: "fundingpips", discountPct: 20,
    title: "خصم الهالوين", appliesTo: "كل الحسابات، 20% للعملاء الجدد و15% للحاليين",
    code: "HALLOWEEN", endsAt: "2026-10-31T23:59:00+02:00", endsAtEstimated: true,
    exclusive: false,
    source: { name: "صفحة الشراء الرسمية", url: "https://fundingpips.com" },
    checked: "28 أكتوبر 2026",
  },
  {
    id: "fundednext-halloween-2026", firm: "fundednext", discountPct: 41, upTo: true,
    title: "عرض الهالوين على Stellar", appliesTo: "Stellar مرحلة، مرحلتين، Lite وInstant (النسبة تختلف حسب الحساب)",
    exclusive: false,
    source: { name: "Forex Prop Reviews", url: "https://forexpropreviews.com/fundednext-halloween-offer-cuts-stellar-prices-by-up-to-41/" },
    checked: "28 أكتوبر 2026",
  },
  {
    id: "ftmo-1step-100k", firm: "ftmo", discountPct: 20,
    title: "خصم على حساب 100K مرحلة واحدة", appliesTo: "يُطبَّق تلقائياً بدون كود",
    startsAt: "2026-08-17T00:00:00+02:00",
    exclusive: false,
    source: { name: "TheGodFunded", url: "https://thegodfunded.com/en/firms/ftmo/promotions/" },
    checked: "سبتمبر 2026",
  },
  {
    id: "apex-anniversary", firm: "apex", discountPct: 92, upTo: true,
    title: "خصم الذكرى الخامسة", appliesTo: "حسابات التقييم (الخصومات عند Apex تتغير أسبوعياً)",
    exclusive: false,
    source: { name: "BlockTelegraph", url: "https://blocktelegraph.io/apex-trader-funding-celebrates-five-year-anniversary-with-92-off-evaluation-accounts/" },
    checked: "أكتوبر 2026",
  },
];

export const COUNTRIES: [string, string][] = [
  ["PS", "فلسطين"], ["JO", "الأردن"], ["EG", "مصر"], ["SA", "السعودية"], ["AE", "الإمارات"],
  ["KW", "الكويت"], ["QA", "قطر"], ["BH", "البحرين"], ["OM", "عُمان"], ["IQ", "العراق"],
  ["SY", "سوريا"], ["LB", "لبنان"], ["YE", "اليمن"], ["MA", "المغرب"], ["DZ", "الجزائر"],
  ["TN", "تونس"], ["LY", "ليبيا"], ["SD", "السودان"], ["OTHER", "دولة أخرى"],
];

export const RISE_UNSUPPORTED = ["SY", "IQ", "IR", "CU", "RU", "UA", "VE", "HT", "MM"];

export const firmBySlug = (slug: string) => FIRMS.find((f) => f.slug === slug);
export const challengesOf = (firm: string) => CHALLENGES.filter((c) => c.firm === firm);
export const offersOf = (firm: string) => OFFERS.filter((o) => o.firm === firm);
