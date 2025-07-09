async function createAudio(text) {
    const response = await fetch('http://localhost:3000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    const data = await response.json();
    if (!data.audioContent) { return alert("TTS Service Failed." )};

    const binary = atob(data.audioContent);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([array], { type: "audio/mp3" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "audiobook.mp3";
    link.click();
}