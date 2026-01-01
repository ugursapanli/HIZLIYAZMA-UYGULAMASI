/* =========================
   KELİMELER (TÜRKÇE)
========================= */
const WORDS = [
  "insan","zaman","hayat","dünya","klavye","bilgisayar","yazılım","internet","uygulama","odak",
  "hız","doğruluk","performans","gelişim","teknoloji","proje","tasarım","sistem","veri","algoritma",
  "mantık","çalışmak","öğrenmek","anlamak","başlamak","bitirmek","iletişim","yaratıcı","motivasyon",
  "strateji","inovasyon","analiz","deneyim","bakış","fikir","çözüm","uyum","denge","düşünce",

  "akıl","zeka","bilgi","beceri","emek","sabır","umut","hedef","başarı","risk",
  "plan","vizyon","karar","seçim","sonuç","neden","etki","süreç","yöntem","model",

  "kod","debug","test","sürüm","arayüz","backend","frontend","veritabanı","sunucu","istemci",
  "fonksiyon","değişken","nesne","sınıf","döngü","koşul","derleme","yorum","optimizasyon","bellek",

  "fark","değer","önem","anlam","amaç","niyet","duygu","his","sezgi","bilinç",
  "algı","tepki","davranış","alışkanlık","disiplin","irade","kararlılık","istikrar","özgüven","saygı",

  "hızlı","yavaş","net","basit","karmaşık","etkili","verimli","esnek","güçlü","zayıf",
  "aktif","pasif","dinamik","statik","yararlı","zararlı","doğal","yapay","özgür","bağımlı",

  "yazmak","okumak","dinlemek","konuşmak","düşünmek","üretmek","paylaşmak","geliştirmek","iyileştirmek","uygulamak",
  "denemek","araştırmak","tasarlamak","planlamak","ölçmek","hesaplamak","kontrol","yönetmek","öngörmek","çözmek",

  "ekran","fare","donanım","yazıcı","tablet","telefon","cihaz","batarya","enerji","bağlantı",
  "kablosuz","güncelleme","güvenlik","şifre","erişim","yetki","hesap","profil","oturum","kimlik",

  "akış","ritim","tempo","denge","uyum","odaklanma","verim","kalite","istikrar","sadelik",
  "derinlik","genişlik","esneklik","hassasiyet","netlik","tutarlılık","şeffaflık","erişilebilirlik","ölçek","kapasite"
];

/* ========================= DOM ========================= */
const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const errorsEl = document.getElementById("errors");
const resultScreen = document.getElementById("resultScreen");
const finalWpm = document.getElementById("finalWpm");
const finalErrors = document.getElementById("finalErrors");
const finalAccuracy = document.getElementById("finalAccuracy");

/* ========================= STATE ========================= */
let totalTime = 60;
let time = 60;
let timer = null;
let errors = 0;
let visibleWords = [];
let typedCharsCount = 0;

/* ========================= HELPERS ========================= */
const normalize = str => str.normalize("NFC").toLowerCase();

/* ========================= TEXT ========================= */
function generateWords(count = 10) {
  return Array.from({ length: count }, () =>
    WORDS[Math.floor(Math.random() * WORDS.length)]
  );
}

function renderText() {
  textEl.innerHTML = "";

  visibleWords.forEach(word => {
    for (let char of word) {
      const span = document.createElement("span");
      span.textContent = char;
      textEl.appendChild(span);
    }
    const spaceSpan = document.createElement("span");
    spaceSpan.textContent = " ";
    textEl.appendChild(spaceSpan);
  });
}

/* ========================= TIMER ========================= */
function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time <= 0) finishTest();
  }, 1000);
}

/* ========================= FINISH ========================= */
function finishTest() {
  clearInterval(timer);
  inputEl.disabled = true;

  const accuracy =
    typedCharsCount + errors === 0
      ? 0
      : Math.round((typedCharsCount / (typedCharsCount + errors)) * 100);

  finalWpm.textContent = wpmEl.textContent;
  finalErrors.textContent = errors;
  finalAccuracy.textContent = accuracy + "%";

  resultScreen.classList.remove("hidden");
}

/* ========================= RESET ========================= */
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

/* ========================= INPUT HANDLER ========================= */
inputEl.addEventListener("input", () => {
  if (!timer) startTimer();

  const typed = inputEl.value;
  const spans = textEl.querySelectorAll("span");

  errors = 0;
  let typedIndex = 0;

  // 🔹 Harf bazlı renklendirme
  spans.forEach(span => {
    span.classList.remove("correct", "incorrect");

    if (span.textContent === " ") return;

    const char = typed[typedIndex];
    if (!char) return;

    if (normalize(char) === normalize(span.textContent)) {
      span.classList.add("correct");
    } else {
      span.classList.add("incorrect");
      errors++;
    }
    typedIndex++;
  });

  errorsEl.textContent = errors;

  // 🔹 Space ile kelime geçme
  const words = typed.split(" ");
  if (words.length > 1) {
    const typedWord = words[0];
    const currentWord = visibleWords[0];

    if (normalize(typedWord) === normalize(currentWord)) {
      typedCharsCount += currentWord.length;
      visibleWords.shift();
      visibleWords.push(
        WORDS[Math.floor(Math.random() * WORDS.length)]
      );
    }

    inputEl.value = words.slice(1).join(" ");
    renderText();
  }

  // 🔹 WPM
  const minutes = (totalTime - time) / 60;
  wpmEl.textContent =
    minutes > 0 ? Math.round((typedCharsCount / 5) / minutes) : 0;
});

/* ========================= START ========================= */
restartGame();

function setTime(seconds) {
  totalTime = seconds;
  restartGame();
}
