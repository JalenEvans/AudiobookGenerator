async function speakAndRecord(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    const synth = window.speechSynthesis;

    const audioContext = new AudioContext()
    const dest = audioContext.createMediaStreamDestination()
    const source = audioContext.createMediaStreamSource(dest.stream)

    const recorder = new MediaRecorder(dest.stream)
    let chunks = []

    recorder.ondataavailable = e => chunks.push(e.data)
    recorder.onstop = async () => {
        const webmBlob = new Blob(chunks, { type: "audio/webm" })
        const arrayBuffer = await webmBlob.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        // Convert raw PCM to MP3 using Lame.js
        const mp3Encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128)
        const samples = audioBuffer.getChannelData(0)
        const mp3Data = []
        const sampleBlockSize = 1152;

        for (let i = 0; i < samples.length; i += sampleBlockSize) {
            const sampleChunk = samples.subarray(i, i + sampleBlockSize)
            const intSamples = new Int16Array(sampleChunk.length)
            for (let j = 0; j < sampleChunk.length; j++) {
                intSamples[j] = sampleChunk[j] * 32767.5
            }

            const mp3buf = mp3Encoder.encodeBuffer(intSamples)
            if (mp3buf.length > 0) mp3Data.push(mp3buf)
        }
        const mp3buf = mp3Encoder.flush()
        if (mp3buf.length > 0) mp3Data.push(mp3buf)
        
        const mp3Blob = new Blob(mp3Data, { type: "audio/mp3" })
        const url = URL.createObjectURL(mp3Blob)

        const a = document.createElement("a")
        a.href = url;
        a.download = "audiobook.mp3"
        a.textContent = "Download MP3"
        document.body.appendChild(a)
        a.click()
    }

    recorder.start()
    synth.speak(utterance)

    utterance.onend = () => {
        recorder.stop()
    }
}