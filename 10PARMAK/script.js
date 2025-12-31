/* =========================
   KELİMELER (TÜRKÇE)
========================= */
const WORDS = [
  "insan","zaman","hayat","dünya","klavye","bilgisayar","yazılım","internet","uygulama","odak",
  "hız","doğruluk","performans","gelişim","teknoloji","proje","tasarım","sistem","veri","algoritma",
  "mantık","çalışmak","öğrenmek","anlamak","başlamak","bitirmek","iletişim","yaratıcı","motivasyon",
  "strateji","inovasyon","analiz","deneyim","bakış","fikir","çözüm","uyum","denge","düşünce",
  "hedef","araştırma","proaktif","disiplin","kararlılık","odaklanmak","sürdürülebilir","etkileşim",
  "bilgelik","girişim","kaynak","risk","fırsat","işbirliği","başarı","eğitim","çeşitlilik","yarış",
  "zeka","özgünlük","tutku","akış","enerji","refleks","stratejik","etkinlik","geliştirmek",
  "optimizasyon","uygulamak","projeleme","dijital","simülasyon","verimlilik","algı","dönüşüm",
  "yenilik","uyumlamak","kültür","topluluk","çaba","dengelemek","akıl","yaratıcılık","etkilemek",
  "akışkan","gözlem","uyaran","öncelik","etki","çaba","karşılaştırma","yararlanmak","dengelemek",
  "takip","yönetim","organizasyon","kontrol","değer","motivasyon","refleks","düşünmek","gözlemlemek",
  "ilişki","iletişim","etkileşim","katılım","akışkanlık","esneklik","farkındalık","karar","araç",
  "çözümleme","verim","uygulamalı","deneyimsel","analitik","tasarlamak","hazırlık","önlem",
  "gelişimsel","öğretmek","uyarlamak","stratejileştirmek","yönetmek","optimum","dengeli","yarar",
  "paylaşım","toparlanmak","güçlenmek","gözlemleme","planlama","analizci","akılcı","zeka","dikkat",
  "katkı","proaktiflik","dönüşümlü","yaratmak","önemli","farklılık","gözlemci","eğitmek","uyumlu",
  "işlev","deneyimli","bilinçli","akıllı","çözüm odaklı","işbirlikçi","toplumsal","bağlantı",
  "uygulamalılık","verimli düşünce","stratejik plan","liderlik","girişimcilik","fırsatçılık",
  "optimizasyon","yararlanmak","yönetimsel","başarı odaklı","dijitalleşme","yenilikçi","teknolojik",
  "çeviklik","gelişim odaklı","bilimsel","araştırmacı","analitik düşünce","problem çözme","odaklanma",
  "sistematik","verimli süreç","inovatif","performans odaklı","karar verme","çevre bilinci","özveri",
  "iş disiplini","zaman yönetimi","motivasyonel","iletişimsel","topluluk odaklı","stratejik yaklaşım",
  "teknoloji yönetimi","veri analizi","uygulamalı öğrenme","çevresel farkındalık","proje yönetimi",
  "tasarım odaklı","etkileşimli","sürdürülebilirlik","yaratıcı çözüm","takım çalışması",
  "problem analizi","gelişimsel süreç","inovasyon yönetimi","dijital dönüşüm","etkili iletişim",
  "akıl yürütme","özgün fikir","analitik yaklaşım","stratejik düşünce","teknolojik yenilik",
  "çevik yönetim","bilgi yönetimi","veri tabanı","uygulama geliştirme","tasarım düşüncesi",
  "dijitalleşme süreci","proje odaklı","performans değerlendirme","yaratıcı fikir","analitik zeka",
  "iş zekası","yazılım geliştirme","çevik metodoloji","liderlik becerisi","etkileşim yönetimi",
  "inovatif çözüm","topluluk yönetimi","çevre yönetimi","strateji geliştirme","dijital strateji",
  "iş analizi","veri analitiği","uygulamalı proje","problem çözme becerisi","takım yönetimi",
  "eğitim süreci","verimli tasarım","analiz yeteneği","teknoloji entegrasyonu","süreç yönetimi",
  "dijital uygulama","sistem geliştirme","optimizasyon stratejisi","çevik düşünce","performans ölçümü",
  "karar alma süreci","inovasyon süreci","bilgi analizi","veri yönetimi","uygulama tasarımı"
];

/* =========================
   DOM
========================= */
const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const errorsEl = document.getElementById("errors");

const resultScreen = document.getElementById("resultScreen");
const finalWpm = document.getElementById("finalWpm");
const finalErrors = document.getElementById("finalErrors");
const finalAccuracy = document.getElementById("finalAccuracy");

/* =========================
   DURUM
========================= */
let totalTime = 60;
let time = 60;
let timer = null;
let errors = 0;
let visibleWords = [];
let typedCharsCount = 0;

/* =========================
   YARDIMCI
========================= */
const normalize = str => str.normalize("NFC").toLowerCase();

/* =========================
   METİN
========================= */
function generateWords(count = 10) {
  return Array.from({ length: count }, () =>
    WORDS[Math.floor(Math.random() * WORDS.length)]
  );
}

function renderText() {
  textEl.innerHTML = "";
  visibleWords.forEach(word => {
    // Her harfi span ile ayır
    for (let char of word) {
      const span = document.createElement("span");
      span.textContent = char;
      textEl.appendChild(span);
    }
    // Kelime boşluğu için bir span ekle
    const spaceSpan = document.createElement("span");
    spaceSpan.textContent = " ";
    textEl.appendChild(spaceSpan);
  });
}

/* =========================
   TIMER
========================= */
function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time <= 0) finishTest();
  }, 1000);
}

function setTime(seconds) {
  totalTime = seconds;
  restartGame();
}

/* =========================
   TEST BİTİŞ
========================= */
function finishTest() {
  clearInterval(timer);
  inputEl.disabled = true;

  const accuracy = typedCharsCount + errors === 0 ? 0 : Math.round((typedCharsCount / (typedCharsCount + errors)) * 100);

  finalWpm.textContent = wpmEl.textContent;
  finalErrors.textContent = errors;
  finalAccuracy.textContent = accuracy + "%";

  resultScreen.classList.remove("hidden");
}

/* =========================
   RESET
========================= */
function restartGame() {
  clearInterval(timer);
  timer = null;

  time = totalTime;
  errors = 0;
  typedCharsCount = 0;
  visibleWords = generateWords();

  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();

  timeEl.textContent = time;
  wpmEl.textContent = "0";
  errorsEl.textContent = "0";

  resultScreen.classList.add("hidden");
  renderText();
}

/* =========================
   SPACE İLE KELİME GEÇME & ANLIK RENK
========================= */
inputEl.addEventListener("input", () => {
  const typed = inputEl.value;
  const spans = textEl.querySelectorAll("span");
  errors = 0;

  // Harf bazlı kontrol ve renk
  spans.forEach((span, i) => {
    span.classList.remove("correct", "incorrect");

    if (typed[i] == null) return;

    if (normalize(typed[i]) === normalize(span.textContent)) {
      span.classList.add("correct");
    } else {
      span.classList.add("incorrect");
      errors++;
    }
  });

  errorsEl.textContent = errors;

  // WPM hesaplama
  const minutes = (totalTime - time) / 60;
  const correctChars = Array.from(typed).filter((char, i) => normalize(char) === normalize(spans[i]?.textContent)).length;
  wpmEl.textContent = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
});

// SPACE ile kelimeyi geçme
inputEl.addEventListener("keydown", (e) => {
  if (!timer) startTimer();

  if (e.key === " ") {
    e.preventDefault();
    const typedWords = inputEl.value.trim().split(" ");
    if (typedWords.length === 0) return;

    const firstWord = typedWords[0];

    if (normalize(firstWord) === normalize(visibleWords[0])) {
      typedCharsCount += firstWord.length;
      // Kelimeyi kaydır
      visibleWords.shift();
      visibleWords.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
      inputEl.value = typedWords.slice(1).join(" ");
      renderText();
    } else {
      errors++;
      errorsEl.textContent = errors;
    }

    // WPM hesaplama
    const minutes = (totalTime - time) / 60;
    wpmEl.textContent = minutes > 0 ? Math.round((typedCharsCount / 5) / minutes) : 0;
  }
});

/* =========================
   BAŞLAT
========================= */
restartGame();
