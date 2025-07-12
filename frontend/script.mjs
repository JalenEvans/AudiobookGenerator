async function uploadPDF() {
    const fileInput = document.getElementById('pdf-upload');
    const file = fileInput.files[0];
    if (!file) return alert('Please select a PDF.');

    const formData = new FormData();
    formData.append('pdf', file);

    const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    });
    
    if (!res.ok) {
        alert('Failed to convert to PDF.');
        return;
    }

    const data = await res.json();
    document.getElementById('result').innerHTML = `
        <p>Download your MP3:</p>
        <a href="${data.audioUrl}" download="audiobook.mp3">Download</a>
    `;
}