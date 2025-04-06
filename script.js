const textSrc = []
const audios = []
let totalTime = 0
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playSequentially(index = 0) {
    if (index >= audios.length) return;
  
    const currentAudio = audios[index];
    currentAudio.play();
  
    currentAudio.onended = () => {
      playSequentially(index + 1);
    };
}

async function main() 
{
    const res = await fetch('https://api.alquran.cloud/v1/surah/14/editions/ar.minshawi,quran-unicode,en.sahih?offset=39&limit=2')
    const result = await res.json();
    const data = result.data

    
    data.slice(1).forEach(obj => 
    {
        let ayat = []
        obj.ayahs.forEach(ayah => 
        {
            ayat.push(ayah)
        });
        textSrc.push(ayat)
    });

    let totalTime = 0
    const audioSrc = data[0].ayahs
    audioSrc.forEach(async (ayah, index) => 
    {
        const audioElement = new Audio(ayah.audio)

        audioElement.preload = "metadata" 
        audioElement.onloadedmetadata = () =>  
        {
            audios[index] = audioElement
            totalTime += audioElement.duration
            console.log(totalTime)
        }
    })   

    console.log(audios)
    audios.forEach(audio => 
    {
        totalTime += audio.duration 
    });
    
    const playAyatButton = document.getElementById('playAyatButton')
    
    playAyatButton.setAttribute('disabled', '')
    sleep(1000).then(() => playAyatButton.removeAttribute('disabled'))
    
    playAyatButton.addEventListener('click', playAyat)
    function playAyat() 
    {
        playAyatButton.setAttribute('disabled', '')
        console.log(totalTime * 1000)
        sleep(totalTime * 1000).then(() => playAyatButton.removeAttribute('disabled'))
        let prevTime = 0
        playSequentially()
    }


    let br = document.createElement('br')
    document.body.appendChild(br)

    textSrc.forEach((text, index) => 
    {
        text.forEach(ayah => 
        {
            let ayahText = document.createElement('p')
            console.log(ayah)
            ayahText.innerText = `${ayah.text} (${ayah.numberInSurah})`
            if (index === 0)
            {
                ayahText.classList.add('arabic-text')
            }
            document.body.append(ayahText)
            br = document.createElement('br')
            document.body.append(br)
        });   
    });
}

main()

