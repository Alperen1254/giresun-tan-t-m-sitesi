/* ================================================
   GIRESUN TANITIM SİTESİ — main.js
   ================================================ */

/* ── PRELOADER ── */
window.addEventListener('load', () => {
  const p = document.getElementById('preloader');
  if (!p) return;
  p.classList.add('hidden');
  setTimeout(() => { p.style.display = 'none'; }, 450);
});

/* ── AOS BAŞLAT ── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 680, once: true, offset: 70, easing: 'ease-out-cubic' });
  }

  navbarScroll();
  setActiveNav();
  scrollTopInit();
  counterInit();
  typewriterInit();
  filterInit();
  searchInit();
  pageTransition();
  window.addEventListener('scroll', navbarScroll);
  window.addEventListener('scroll', scrollTopVisibility);
});

/* ── NAVBAR SCROLL ── */
function navbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}

/* ── AKTİF NAVİGASYON ── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('#mainNav .nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── SAYFA GEÇİŞ EFEKTİ ── */
function pageTransition() {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || href.startsWith('http') ||
        a.getAttribute('target') === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity .28s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 290);
    });
  });
}

/* ── SCROLL TOP ── */
function scrollTopInit() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
function scrollTopVisibility() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  if (window.scrollY > 380) btn.classList.add('show');
  else btn.classList.remove('show');
}

/* ── SAYAÇ ANİMASYONU ── */
function counterInit() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = '1';
      animateCount(entry.target);
    });
  }, { threshold: .5 });
  counters.forEach(c => obs.observe(c));
}
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals || 0;
  const dur = 1800;
  const step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) {
      cur = target;
      clearInterval(t);
    }
    el.textContent = parseFloat(cur).toFixed(decimals).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + suffix;
  }, 16);
}

/* ── TİPWRİTER EFEKTİ ── */
function typewriterInit() {
  const el = document.getElementById('tw-text');
  if (!el) return;
  const phrases = [
    'Fındığın Başkenti',
    'Denizin Kalbi',
    'Amazon Efsanesi',
    'Karadeniz\'in İncisi'
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 95);
  }
  tick();
}

/* ── FİLTRE SİSTEMİ ── */
function filterInit() {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      const items = document.querySelectorAll('[data-cat]');
      let visible = 0;
      items.forEach(item => {
        const cats = item.dataset.cat.split(',').map(s => s.trim());
        const show = cat === 'all' || cats.includes(cat);
        item.style.display = show ? '' : 'none';
        if (show) { visible++; item.style.animation = 'fadeInUp .4s ease both'; }
      });
      const noRes = document.getElementById('no-results');
      if (noRes) noRes.classList.toggle('show', visible === 0);
    });
  });
}

/* ── YEMEK ARAMA ── */
function searchInit() {
  const input = document.getElementById('foodSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const items = document.querySelectorAll('[data-food-name]');
    let vis = 0;
    items.forEach(item => {
      const name = (item.dataset.foodName || '').toLowerCase();
      const tags = (item.dataset.tags || '').toLowerCase();
      const show = !q || name.includes(q) || tags.includes(q);
      item.style.display = show ? '' : 'none';
      if (show) vis++;
    });
    const noRes = document.getElementById('no-results');
    if (noRes) noRes.classList.toggle('show', vis === 0);
  });
}

/* ── FORM GÖNDERİM ── */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Gönderiliyor...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check me-2"></i>Gönderildi!';
    btn.style.background = '#2e7d32';
    showToast('Mesajınız başarıyla iletildi. Teşekkürler!', 'success');
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 3500);
  }, 1400);
}

/* ── TOAST ── */
function showToast(msg, type = 'success') {
  const el = document.getElementById('mainToast');
  const msgEl = document.getElementById('toastMsg');
  if (!el || !msgEl) return;
  msgEl.textContent = msg;
  el.className = `toast align-items-center border-0 text-bg-${type}`;
  const toast = new bootstrap.Toast(el, { delay: 4000 });
  toast.show();
}

/* ── HARİTA SEKME GEÇİŞİ ── */
function switchMap(type, key) {
  const d = modalData.historical[key];
  if (!d) return;
  const iframe = document.getElementById('mapIframe');
  const tabs = document.querySelectorAll('.map-tab');
  if (type === 'regular') {
    iframe.src = d.mapUrl;
    tabs[0].classList.add('active');  tabs[1].classList.remove('active');
  } else {
    iframe.src = d.svUrl;
    tabs[0].classList.remove('active'); tabs[1].classList.add('active');
  }
}

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* =============================================
   MODAL VERİLERİ
   ============================================= */
const modalData = {
  historical: {
    'giresun-kalesi': {
      name: 'Giresun Kalesi',
      desc: 'M.Ö. 4. yüzyılda inşa edilen bu tarihi kale, Giresun şehrine hâkim bir tepe üzerindedir. Bizans ve Osmanlı dönemlerine ait katmanlar barındıran kale, bugün park ve seyir terası olarak kullanılmakta; Karadeniz\'in nefes kesen panoramasını sunmaktadır.',
      coords: '40°54\'43"K, 38°23\'15"D',
      type: 'Tarihi Kale',
      mapUrl: 'https://maps.google.com/maps?q=Giresun+Kalesi,Giresun&z=16&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Giresun+Kalesi,Giresun&t=k&z=16&output=embed'
    },
    'giresun-adasi': {
      name: 'Giresun Adası',
      desc: 'Karadeniz kıyılarındaki tek Türk adasıdır. Antik çağda Amazon efsaneleriyle anılan ve içinde Ares Tapınağı kalıntıları barındıran bu mistik ada, her yıl Mayıs ayında Aksu Festivali\'ne ev sahipliği yapar.',
      coords: '40°54\'58"K, 38°22\'19"D',
      type: 'Doğal & Tarihi Ada',
      mapUrl: 'https://maps.google.com/maps?q=Giresun+Island,Turkey&z=15&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Giresun+Island,Turkey&t=k&z=15&output=embed'
    },
    'zeytinlik-camii': {
      name: 'Zeytinlik Camii',
      desc: '18. yüzyılda inşa edilen Zeytinlik Camii, Osmanlı dönemine ait özgün ahşap işçiliğiyle dikkat çeker. Giresun\'un tarihi kent dokusunun en değerli yapılarından biri olup şehrin kalbinde yer almaktadır.',
      coords: '40°54\'46"K, 38°23\'21"D',
      type: 'Tarihi Cami',
      mapUrl: 'https://maps.google.com/maps?q=Zeytinlik+Camii,Giresun&z=17&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Zeytinlik+Camii,Giresun&t=k&z=17&output=embed'
    },
    'tirebolu-kalesi': {
      name: 'Tirebolu Kalesi',
      desc: 'İlçe merkezinin hemen deniz kıyısındaki kayalıklara kurulmuş bu kale, Bizans döneminde inşa edilmiş olup Orta Çağ\'daki deniz ticaretinin önemli bir merkezi olan Tripolis limanını korumuştur.',
      coords: '41°00\'28"K, 38°48\'55"D',
      type: 'Tarihi Kale',
      mapUrl: 'https://maps.google.com/maps?q=Tirebolu+Kalesi,Giresun&z=16&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Tirebolu+Kalesi,Giresun&t=k&z=16&output=embed'
    },
    'sebinkarahisar-kalesi': {
      name: 'Şebinkarahisar Kalesi',
      desc: 'Colandos dağının zirvesinde yer alan bu görkemli kale, yaklaşık 1600 metre rakımda bulunmaktadır. Hitit, Roma, Bizans ve Osmanlı medeniyetlerinin izlerini taşıyan kale, Anadolu\'nun önemli tarihi mekânlarından biridir.',
      coords: '40°18\'N, 38°25\'E',
      type: 'Tarihi Kale',
      mapUrl: 'https://maps.google.com/maps?q=Sebinkarahisar+Kalesi+Giresun&z=15&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Sebinkarahisar+Kalesi+Giresun&t=k&z=15&output=embed'
    },
    'giresun-muzesi': {
      name: 'Giresun Müzesi',
      desc: 'Eski bir Rum kilisesinin içinde hizmet veren Giresun Müzesi, yörenin arkeolojik buluntularını, etnografik eserlerini ve tarihine ışık tutan pek çok önemli koleksiyonu ziyaretçilerle buluşturmaktadır.',
      coords: '40°54\'45"K, 38°23\'17"D',
      type: 'Müze',
      mapUrl: 'https://maps.google.com/maps?q=Giresun+Muzesi&z=17&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Giresun+Muzesi&t=k&z=17&output=embed'
    },
    'kumbet-yaylasi': {
      name: 'Kümbet Yaylası',
      desc: '1600 metre rakımında yer alan Kümbet Yaylası, yemyeşil çayırları ve serin iklimiyle Giresun\'un en popüler tatil destinasyonlarından biridir. Her yaz düzenlenen yayla festivalleri ile doğa yürüyüşleri için mükemmel bir noktadır.',
      coords: '40°48\'N, 38°22\'E',
      type: 'Yayla',
      mapUrl: 'https://maps.google.com/maps?q=Kumbet+Yaylasi,Giresun&z=14&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Kumbet+Yaylasi,Giresun&t=k&z=14&output=embed'
    },
    'kulakkaya-yaylasi': {
      name: 'Kulakkaya Yaylası',
      desc: '2200 metre rakımıyla Giresun\'un en yüksek yaylalarından biri olan Kulakkaya; fırtına bulutlarıyla çevrili zirveleri, dağ koruları ve kamp alanlarıyla macera tutkunlarının gözdesidir.',
      coords: '40°32\'N, 38°18\'E',
      type: 'Yayla',
      mapUrl: 'https://maps.google.com/maps?q=Kulakkaya+Yaylasi+Giresun&z=13&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Kulakkaya+Yaylasi+Giresun&t=k&z=13&output=embed'
    },
    'karagol': {
      name: 'Karagöl',
      desc: 'Karagöl-Sahara Milli Parkı içindeki bu büyüleyici göl, 1985 metre yüksekliğinde yer almaktadır. Sabah sislerinin gölü sardığı sahneler son derece etkileyicidir; göl çevresi yürüyüş parkurlarıyla donatılmıştır.',
      coords: '40°38\'N, 38°19\'E',
      type: 'Doğal Göl',
      mapUrl: 'https://maps.google.com/maps?q=Karagol+Giresun&z=14&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Karagol+Giresun&t=k&z=14&output=embed'
    },
    'batlama-selalesi': {
      name: 'Batlama Şelalesi',
      desc: '23 metre yüksekliğiyle Giresun\'un en görkemli şelalesi olan Batlama, şehir merkezine 18 km uzaklıktadır. Çevresi piknik alanları ve patikalarla donatılmış olan şelale, ilkbaharda en görkemli halini alır.',
      coords: '40°51\'N, 38°16\'E',
      type: 'Şelale',
      mapUrl: 'https://maps.google.com/maps?q=Batlama+Selalesi,Giresun&z=15&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Batlama+Selalesi+Giresun&t=k&z=15&output=embed'
    },
    'bulancak-sahili': {
      name: 'Bulancak Sahili',
      desc: 'Giresun\'un merkez ilçelerinden Bulancak, Karadeniz\'e uzun ve temiz bir sahil hattıyla açılmaktadır. Hem yaz tatili hem de deniz kenarı yürüyüşleri için tercih edilen bu sahil, şehrin vazgeçilmez dinlenme noktalarından biridir.',
      coords: '40°56\'N, 38°14\'E',
      type: 'Plaj & Sahil',
      mapUrl: 'https://maps.google.com/maps?q=Bulancak+Sahili,Giresun&z=14&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Bulancak+Sahili,Giresun&t=k&z=14&output=embed'
    },
    'eynesil-sahili': {
      name: 'Eynesil Sahili',
      desc: 'Küçük ve şirin kıyı kasabası Eynesil, temiz denizi ve sakin atmosferiyle kalabalıktan uzak bir tatil deneyimi sunar. Rıhtım boyunca sıralanan restoranlar ve kafeler, Karadeniz manzarası eşliğinde huzurlu saatler geçirmenizi sağlar.',
      coords: '41°03\'N, 38°47\'E',
      type: 'Plaj & Sahil',
      mapUrl: 'https://maps.google.com/maps?q=Eynesil+Giresun&z=15&output=embed',
      svUrl: 'https://maps.google.com/maps?q=Eynesil+Giresun&t=k&z=15&output=embed'
    }
  },

  food: {
    'kuymak': {
      name: 'Kuymak', origin: 'Giresun / Karadeniz Mutfağı',
      time: '20 dk', serving: '4 kişi', diff: 'Kolay',
      desc: 'Mısır unu, peynir ve tereyağının buluşmasıyla oluşan Karadeniz\'in en ikonik kahvaltılığı. Özellikle soğuk kış sabahlarında vazgeçilmezdir.',
      ingredients: ['2 su bardağı ince mısır unu','500 gr rendelenmiş kaşar peyniri','100 gr tereyağı','2 su bardağı su veya süt','Tuz (isteğe göre)'],
      steps: ['Su veya sütü geniş bir tencerede orta ateşte kaynatın.','Mısır ununu yavaş yavaş ekleyin; sürekli karıştırarak topaklanmayı önleyin.','Kısık ateşte 10–15 dakika tahta kaşıkla durmaksızın karıştırın.','Rendelenmiş peyniri ilave edin ve eriyene dek karıştırmaya devam edin.','Ayrı bir tavada tereyağını eritip hafifçe kızartın.','Sıcak tereyağını kuymağın üzerine gezdirin ve hemen sıcak servis yapın.']
    },
    'mihlama': {
      name: 'Mıhlama', origin: 'Giresun / Karadeniz Mutfağı',
      time: '25 dk', serving: '4 kişi', diff: 'Kolay',
      desc: 'Karadeniz\'in kış sofralarının vazgeçilmezi. Tereyağında kavrulan mısır ununun peynirle buluşmasından doğan bu yemek son derece besleyici ve doyurucudur.',
      ingredients: ['3 su bardağı iri mısır unu','400 gr tel peynir veya kaşar','150 gr tereyağı','2,5 su bardağı su','1 tatlı kaşığı tuz'],
      steps: ['Kalın tabanlı tencerede tereyağını eritin.','Mısır ununu ekleyip 3–4 dakika, koku çıkana dek kavurun.','Suyu yavaş yavaş ilave edip devamlı karıştırın.','Tuzu ekleyin; orta ateşte 10 dakika karıştırmayı sürdürün.','Rendelenmiş peyniri ilave edin ve peynir eriyene dek karıştırın.','Ocağı kapatın ve hemen servis yapın.']
    },
    'laz-boregi': {
      name: 'Laz Böreği', origin: 'Karadeniz Mutfağı',
      time: '60 dk', serving: '8 kişi', diff: 'Orta',
      desc: 'Çıtır yufkalar arasına muhallebi doldurulan Karadeniz\'in tatlı şaheseri. Hem mis gibi kokusu hem de eşsiz lezzetiyle sofraların yıldızı olan özel bir tatlı böreğidir.',
      ingredients: ['500 gr ince yufka','200 gr eritilmiş tereyağı','— İç Harcı —','1 lt süt','4 yemek kaşığı un','4 yemek kaşığı şeker','3 yumurta sarısı','1 paket vanilya','— Üzeri İçin —','2 yumurta sarısı'],
      steps: ['Muhallebi için süt, un, şeker ve yumurta sarısını tencerede orta ateşte koyulaşana dek pişirin; vanilyayı ekleyip soğutun.','Fırın tepsisini tereyağıyla yağlayın; yufkaları tepsi boyutuna ikiye bölün.','4–5 yufkayı tepsiye tereyağı sürerek üst üste serin.','Soğumuş muhallebiyi üzerine eşit biçimde yayın.','Kalan yufkaları da tereyağıyla yağlayarak muhallebinin üzerine katlar hâlinde serin.','En üst kata yumurta sarısı sürün.','180°C fırında 35–40 dakika altın rengi olana dek pişirin.','Ilıyınca kesin ve servis yapın.']
    },
    'findik-ezmesi': {
      name: 'Fındık Ezmesi', origin: 'Giresun — Coğrafi İşaretli',
      time: '20 dk', serving: '1 kavanos', diff: 'Kolay',
      desc: 'Dünyanın en kaliteli fındıklarının yetiştiği Giresun\'a özgü bu eşsiz ezme, doğal hâliyle de pasta ve çikolata tariflerinde de kullanılan bir başyapıttır.',
      ingredients: ['500 gr çiğ Giresun fındığı','2 yemek kaşığı bal veya pudra şekeri (isteğe bağlı)','1 tutam tuz'],
      steps: ['Fındıkları 180°C fırında 10–12 dakika kavurun.','Sıcakken bez üzerinde ovuşturarak kabukları soyun.','Mutfak robotuna alın; önce kaba, sonra yağı çıkana dek kremamsı olana kadar 5–8 dakika çekin.','Bal/şeker ve tuzu ekleyip birkaç tur daha çalıştırın.','Kavanoza alın; buzdolabında 2–3 hafta saklanır.']
    },
    'hamsi-tava': {
      name: 'Hamsi Tava', origin: 'Karadeniz Mutfağı',
      time: '20 dk', serving: '4 kişi', diff: 'Kolay',
      desc: 'Karadeniz mutfağının simgesi olan hamsi, mısır unuyla kaplanıp kızartıldığında lezzet şöleni sunar. Taze limon ve soğan halkalarıyla servis edilir.',
      ingredients: ['1 kg taze hamsi','2 su bardağı ince mısır unu','Tuz, karabiber','Kızartma yağı (ayçiçek)','Servis için: limon, soğan halkası, maydanoz'],
      steps: ['Hamsileşri temizleyip yıkayın ve kağıt havluyla kurulayın.','Mısır ununa tuz ve karabiber karıştırın.','Hamsiler unlu karışıma bulayın; fazla unu silkeleyin.','Geniş tavada yağı kızdırın; hamsiler seri biçimde her iki yüzü 2–3 dakika kızartın.','Kızaran hamsiler kağıt havluya alın.','Sıcak servis yapın; limon sıkarak yiyin.']
    },
    'karalahana-corbasi': {
      name: 'Karalahana Çorbası', origin: 'Giresun / Karadeniz Mutfağı',
      time: '45 dk', serving: '6 kişi', diff: 'Kolay',
      desc: 'Karadeniz\'in soğuk kış günlerinde ısıtan bu geleneksel çorba, karalahana, mısır unu ve baharatlı yağ sosuyla hazırlanır. Besleyici ve şifalı olduğu bilinmektedir.',
      ingredients: ['1 kg karalahana (kara lahana)','3–4 yemek kaşığı mısır unu','3–4 diş sarımsak','2–3 yemek kaşığı tereyağı','Kırmızı pul biber','Tuz, karabiber','1,5 lt su veya et suyu'],
      steps: ['Karalahanaları yıkayıp iri parçalara ayırın.','Tencerede eti suyu ile birlikte kaynatın; karalahanaları ekleyin.','20 dakika pişirin. Mısır ununu soğuk suda eritip çorbaya ekleyin.','5–10 dakika daha kaynatın; tuz/karabiber ayarlayın.','Ayrı tavada tereyağını eritin; pul biber ve sarımsak ekleyip sizzle yapın.','Sizzle sosu çorbanın üzerine gezdirip servis yapın.']
    },
    'hamsi-pilavi': {
      name: 'Hamsi Pilavı', origin: 'Karadeniz Mutfağı',
      time: '50 dk', serving: '4 kişi', diff: 'Orta',
      desc: 'İçe ve dışına hamsi dizilmiş, iç dolgusunda pirinç, fındık, kuş üzümü ve baharatların bulunduğu bu görkemli pirinç yemeği, Karadeniz mutfağının en özgün tarifleri arasındadır.',
      ingredients: ['600 gr taze hamsi (temizlenmiş)','2 su bardağı pirinç','1 soğan (ince kıyılmış)','50 gr iç fındık','2 yemek kaşığı kuş üzümü','Tuz, karabiber, yenibahar','Tereyağı, zeytinyağı'],
      steps: ['Pirinci yıkayıp suda bırakın. Soğanı tereyağında kavurun.','Pirinci, fındığı, kuş üzümünü ve baharatları ekleyip birkaç dakika kavurun.','1,5 su bardağı sıcak su ekleyin; yarı pişene dek kapatın.','Tabanı yağlanmış tencereye hamsiler sıra sıra dizin.','İç pilav dolgu olarak dökün; üstünü tekrar hamsiyle kapatın.','Kısık ateşte 25–30 dakika pişirin. Servis tabağına ters çevirin.']
    },
    'findikli-baklava': {
      name: 'Fındıklı Baklava', origin: 'Giresun Özel Tarifi',
      time: '90 dk', serving: '20 parça', diff: 'Zor',
      desc: 'Ceviz yerine Giresun fındığının kullanıldığı bu baklava, Karadeniz\'e özgü bir lezzettir. İnce yufka katları, bol fındık ve aromatik şerbeti ile bambaşka bir baklava deneyimi sunar.',
      ingredients: ['500 gr ince baklava yufkası','300 gr çekilmiş Giresun fındığı','200 gr eritilmiş tereyağı','Şerbet: 3 su bardağı şeker, 2 su bardağı su, 1 yemek kaşığı limon suyu'],
      steps: ['Şerbeti hazırlayın: şeker ve suyu kaynatıp 15 dakika pişirin; limon suyunu ekleyip soğutun.','Yufkaları tepsiye ikişer ikişer yağlayarak serin.','Her 4–5 katın üzerine fındık dolgusu serpin.','Bu işlemi yufkalar bitene kadar tekrarlayın.','Üstüne kalan tereyağını gezdirin; fırın tepsisine dökün.','175°C fırında 35–40 dakika altın rengi olana dek pişirin.','Sıcak baklavaya soğuk şerbet dökün; 2–3 saat dinlendirin.']
    },
    'findikli-lokum': {
      name: 'Fındıklı Lokum', origin: 'Giresun — Coğrafi İşaretli',
      time: '60 dk', serving: '30 parça', diff: 'Orta',
      desc: 'Taze Giresun fındıklarının en kaliteli şeker karışımıyla işlendiği bu lokum, Türkiye genelinde ve dünyada tanınan özel bir tatlıdır. Nişasta, gülsuyu ve fındık üçlüsü mükemmel uyum oluşturur.',
      ingredients: ['3 su bardağı şeker','1 su bardağı mısır nişastası + 2 su bardağı soğuk su','2 su bardağı su (şerbet için)','200 gr Giresun fındığı (kabuklu veya yarım)','1 tatlı kaşığı gülsuyu','1 tutam tartarik asit veya limon tuzu'],
      steps: ['Şeker ve 2 su bardağı suyu karıştırın; tartarik asit ekleyip kaynatın.','Nişastayı soğuk suda eritip şeker şerbetine yavaşça katın.','Devamlı karıştırarak orta ateşte lokum kıvamı koyulaşana dek pişirin (20–25 dk).','Gülsuyunu ve fındıkları ekleyin; kısa süre daha karıştırın.','Nişasta serpilmiş geniş bir tepsiye aktarın; düzleyin.','Oda sıcaklığında 8–12 saat dinlendirin.','Dilimleyin; pudra şekerli nişasta karışımına bulayın.']
    },
    'misir-unu-corbasi': {
      name: 'Mısır Unu Çorbası', origin: 'Giresun / Karadeniz Mutfağı',
      time: '25 dk', serving: '4 kişi', diff: 'Kolay',
      desc: 'Karadeniz\'in mısır unu kullanımının bir yansıması olan bu sade ve besleyici çorba, gün boyu enerji verir. Üzerine eklenen tereyağı ve biber sizzle ile lezzeti bir üst seviyeye taşınır.',
      ingredients: ['4 yemek kaşığı ince mısır unu','1,2 lt süt veya su','1 yemek kaşığı tereyağı','Tuz','İsteğe bağlı: pul biber, kekik'],
      steps: ['Süt ya da suyu orta ateşte ısıtın.','Mısır ununu soğuk sütle açıp sıcak sıvıya karıştırarak ekleyin.','Sürekli karıştırarak koyulaşana dek 8–10 dakika pişirin.','Tuzu ayarlayın.','Ayrı tavada tereyağını eritin, pul biber ve kekik ekleyin.','Çorbayı kâselere alın; sizzle sosu üzerine gezdirin.']
    },
    'kaymak': {
      name: 'Giresun Kaymağı', origin: 'Giresun Yöresi',
      time: '12 saat', serving: '6 kişi', diff: 'Kolay',
      desc: 'Yöreye özgü kaliteli tam yağlı sütten yapılan Giresun kaymağı, yöresel ballar ve fındık ezmesiyle birlikte sunulduğunda tam bir Karadeniz sabahını simgeler.',
      ingredients: ['2 lt tam yağlı çiğ süt (tercihen yayladan)','Geniş ve yayvan tencere'],
      steps: ['Sütü geniş yayvan tencereye dökün.','Çok kısık ateşte, kaynamadan 10–12 saat ısıtın (≈85–90°C).','Bu sürede yüzey kremalaşır ve köpüklü beyaz tabaka oluşur.','Ocağı kapatın; oda sıcaklığına soğutun.','Buzdolabında 6–8 saat dinlendirin.','Yüzeydeki kaymak tabakasını geniş spatulayla kaldırın ve servis yapın.']
    },
    'giresun-boregi': {
      name: 'Giresun Böreği', origin: 'Giresun Yöresel Tarifi',
      time: '40 dk', serving: '6 kişi', diff: 'Kolay',
      desc: 'İnce yufka veya hazır milföy hamuruna sarılmış, içinde ıspanak-peynir veya yumurtalı-kaşarlı iç harçla hazırlanan bu hafif börek, Giresun\'un kahvaltı masalarının baş tacıdır.',
      ingredients: ['4–5 kat yufka ya da milföy hamuru','300 gr beyaz peynir','2 yumurta','1 demet ıspanak (isteğe bağlı)','2–3 yemek kaşığı süt','Üzeri için: yumurta sarısı + susamlı'],
      steps: ['Peyniri ezip yumurta ve ıspanakla karıştırın; harcı hazırlayın.','Yufkaları ikişer kat sererek üzerine süt sürün.','Harcı serin; sıkıca sararak rulo yapın.','Yağlı tepsiye dizin; üstüne yumurta sarısı ve susam sürün.','175°C fırında 30–35 dakika altın rengi olana dek pişirin.']
    }
  }
};

/* =============================================
   MODAL FONKSİYONLARI
   ============================================= */
function openModal(el) {
  const type = el.dataset.modalType;
  const modal = document.getElementById('fsModal');
  const content = document.getElementById('fsContent');
  if (!modal || !content) return;

  if (type === 'image') {
    const src = el.dataset.imgSrc || el.src;
    const title = el.dataset.imgTitle || el.alt || '';
    content.innerHTML = `
      <div class="fs-img-only">
        <div class="text-center">
          <img src="${src}" alt="${title}">
          ${title ? `<p class="fs-caption">${title}</p>` : ''}
        </div>
      </div>`;

  } else if (type === 'historical') {
    const key = el.dataset.modalKey;
    const d = modalData.historical[key];
    if (!d) return;
    content.innerHTML = `
      <div class="fs-historical">
        <div class="container">
          <div class="row g-5 align-items-start">
            <div class="col-lg-5">
              <img src="${el.src}" alt="${d.name}" class="place-photo">
              <h2 class="fs-place-name">${d.name}</h2>
              <p class="fs-place-desc">${d.desc}</p>
              <div class="fs-place-info">
                <span class="fs-info-chip"><i class="fas fa-map-pin"></i>${d.coords}</span>
                <span class="fs-info-chip"><i class="fas fa-tag"></i>${d.type}</span>
              </div>
              <a href="https://maps.google.com/?q=${encodeURIComponent(d.name + ' Giresun')}" target="_blank"
                 class="btn-outline-g mt-4" style="display:inline-flex;">
                <i class="fas fa-directions me-2"></i>Yol Tarifi Al
              </a>
            </div>
            <div class="col-lg-7">
              <div class="map-tabs">
                <button class="map-tab active" onclick="switchMap('regular','${key}')"><i class="fas fa-map me-1"></i>Konum</button>
                <button class="map-tab" onclick="switchMap('streetview','${key}')"><i class="fas fa-street-view me-1"></i>3D Görünüm</button>
              </div>
              <div class="map-frame-box">
                <iframe id="mapIframe" src="${d.mapUrl}" allowfullscreen loading="lazy" title="${d.name}"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>`;

  } else if (type === 'food') {
    const key = el.dataset.modalKey;
    const d = modalData.food[key];
    if (!d) return;
    const ing = d.ingredients.map(i => `<li>${i}</li>`).join('');
    const steps = d.steps.map(s => `<li>${s}</li>`).join('');
    content.innerHTML = `
      <div class="fs-food">
        <div class="container">
          <div class="row g-5 align-items-start">
            <div class="col-lg-5">
              <img src="${el.src}" alt="${d.name}" class="food-photo">
              <div class="mt-4 p-3 rounded-3" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);">
                <p style="color:rgba(255,255,255,.72);font-size:.9rem;line-height:1.75;margin:0">${d.desc}</p>
              </div>
            </div>
            <div class="col-lg-7">
              <div class="recipe-wrap">
                <h2 class="recipe-name">${d.name}</h2>
                <div style="font-size:.78rem;color:rgba(255,255,255,.45);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">${d.origin}</div>
                <div class="recipe-meta">
                  <span><i class="fas fa-clock"></i>${d.time}</span>
                  <span><i class="fas fa-users"></i>${d.serving}</span>
                  <span><i class="fas fa-chart-bar"></i>${d.diff}</span>
                </div>
                <div class="recipe-sec"><i class="fas fa-list-ul me-2"></i>Malzemeler</div>
                <ul>${ing}</ul>
                <div class="recipe-sec"><i class="fas fa-tasks me-2"></i>Yapılışı</div>
                <ol>${steps}</ol>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('fsModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('fsContent').innerHTML = ''; }, 200);
}

/* ── MODAL DIŞINA TIKLANINCA KAPAT ── */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('fsModal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }
});
