const textSrc = []
const audios = []
const playAyatButton = document.getElementById('playAyatButton')

async function main() {
    const res = await fetch('https://api.alquran.cloud/v1/surah/16/editions/ar.husary,quran-uthmani-quran-academy,en.sahih?offset=67&limit=2')
    const result = await res.json();
    const data = result.data

    // Audio generation and playing

    const audioSrc = data[0].ayahs
    audioSrc.forEach(ayah => {        
        const audioElement = new Audio(ayah.audio)
        audios.push(audioElement)
    })


    playAyatButton.addEventListener('click', playAyat)
    function playAyat() {
        playAyatButton.setAttribute('disabled', '')
        playSequentially()
    }

    function playSequentially(index = 0) {
        if (index == audios.length)
        {
            playAyatButton.removeAttribute('disabled')
            return
        }

        audios[index].play()
        audios[index].onended = () => playSequentially(index + 1)
    }

    data.slice(1).forEach(obj => {
        let ayat = []
        obj.ayahs.forEach(ayah => {
            ayat.push(ayah)
        });
        textSrc.push(ayat)
    });

    // Text Generation

    let br = document.createElement('br')
    document.body.appendChild(br)

    textSrc.forEach((text, index) => {
        text.forEach(ayah => {
            let ayahText = document.createElement('p')
            console.log(ayah)
            ayahText.innerText = `${ayah.text} (${ayah.numberInSurah})`
            if (index === 0) {
                ayahText.classList.add('arabic-text')
            }
            document.body.append(ayahText)
            br = document.createElement('br')
            document.body.append(br)
        });
    });
}

main()