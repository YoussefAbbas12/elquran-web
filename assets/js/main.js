let fixedNav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    fixedNav.classList.add("active");
  } else {
    fixedNav.classList.remove("active");
  }
});

// =======================================
getSuar()
async function getSuar(){
  const request = await fetch("http://api.alquran.cloud/v1/meta");
  const data = await request.json();
  const soarContainer = document.querySelector('.soarContainer'); 
  const surahsName = data.data.surahs.references;
  soarContainer.innerHTML = "";

  surahsName.forEach(sur => {
    soarContainer.innerHTML += 
    `
    <div class="surah">
      <p>${sur.name}</p>
      <p>${sur.englishName}</p>
    </div>
  `
  })
  let surahTitle = document.querySelectorAll('.surah');
  let popup = document.querySelector('.popup')
  let Ayats = document.querySelector('.ayat')
  surahTitle.forEach((title,index) => {
    title.addEventListener('click', async () => {
      const request = await fetch(`http://api.alquran.cloud/v1/surah/${index + 1}/ar.alafasy`);
      const data = await request.json();
      Ayats.innerHTML = "";
      let ayat = data.data.ayahs;
      ayat.forEach(aya => {
        popup.classList.add('popupActive')
        Ayats.innerHTML += 
          `
            <p>(${aya.numberInSurah})${aya.text}</p>
          `
      })
    })
  })
  let close = document.querySelector('.popup .close');
  close.onclick = function(){
    popup.classList.remove('popupActive')
  }

}

// =======================================

getAyah()
async function getAyah(){
  const request = await fetch(`http://api.alquran.cloud/v1/search/Abraham/37/en.pickthall`);
  const data = await request.json();
  console.log(data.data.matches[0].surah.name)
}

// =======================================

const apiUrl = "https://mp3quran.net/api/v3";
const lang = "ar";

async function getReciters() {
  const chooseReciter = document.querySelector("#chooseReciter");
  const request = await fetch(`${apiUrl}/reciters?language=${lang}`);
  const data = await request.json();

  chooseReciter.innerHTML = `<option value="">اختر قارئ</option>`;
  data.reciters.forEach(
    (reciter) =>
      (chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`)
  );
  chooseReciter.addEventListener("change", (e) => getMoshaf(e.target.value));
}

getReciters();

async function getMoshaf(reciter) {
  const chooseMoshaf = document.querySelector("#chooseMoshaf");

  const request = await fetch(
    `${apiUrl}/reciters?language=${lang}&reciter=${reciter}`
  );
  const data = await request.json();
  const moshafs = data.reciters[0].moshaf;

  chooseMoshaf.innerHTML = `<option value="" data-server="" data-surahList = "">اختر مصحف</option>`;
  moshafs.forEach((moshaf) => {
    chooseMoshaf.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-surahList = "${moshaf.surah_list}">${moshaf.name}</option>`;
  });

  chooseMoshaf.addEventListener("change", (e) => {
    const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
    const surahServer = selectedMoshaf.dataset.server;
    const surahList = selectedMoshaf.dataset.surahlist;
    getSurah(surahServer, surahList);
  });
}

async function getSurah(surahServer, surahList) {
  const chooseSurah = document.querySelector("#chooseSurah");

  const request = await fetch(`https://mp3quran.net/api/v3/suwar`);
  const data = await request.json();
  const surahNames = data.suwar;

  surahList = surahList.split(",");

  chooseSurah.innerHTML = `<option value="">اختر سوره</option>`;
  surahList.forEach((surah) => {
    const padSurah = surah.padStart(3, "0");
    surahNames.forEach((surahName) => {
      if (surahName.id == surah) {
        chooseSurah.innerHTML += `<option value="${surahServer}${padSurah}.mp3">${surahName.name}</option>`;
      }
    });
  });

  chooseSurah.addEventListener("change", (e) => {
    const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
    playSurah(selectedSurah.value);
  });
}

function playSurah(surahMp3) {
  const audioPalyer = document.querySelector("#audioPalyer");
  audioPalyer.src = surahMp3;
  audioPalyer.play();
}

// ==================================================================

tafser();

async function tafser() {
  chooseSorahTafser.innerHTML = `<option value="">اختر سوره</option>`;

  const request1 = await fetch(`https://mp3quran.net/api/v3/suwar`);
  const data2 = await request1.json();
  const surahNames = data2.suwar;

  surahNames.forEach((surah) => {
    chooseSorahTafser.innerHTML += `<option value="${surah.id}">${surah.name}</option>`;
  });

  chooseSorahTafser.addEventListener("change", async () => {
    const chooseSorahTafser = document.querySelector("#chooseSorahTafser");

    const request = await fetch(
      `https://mp3quran.net/api/v3/tafsir?tafsir=5&sura=${chooseSorahTafser.value}&language=ar`
    );
    const data = await request.json();

    let Soar = data.tafasir.soar[chooseSorahTafser.value];
    getTafer(Soar);
  });
  function getTafer(Soar) {
    document.querySelector(".audioContainer").innerHTML = "";
    Soar.forEach((s) => {
      creatAudio(s.url, s.name);
    });
    function creatAudio(url, name) {
      document.querySelector(".audioContainer").innerHTML +=`
      <div>
        <p class="float-end">${name}</p>
        <audio style="width:100%;" muted controls>
          <source src="${url}">
        </audio>
      </div>
      `
    }
  }
}

// ==================================================================