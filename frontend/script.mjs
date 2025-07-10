async function uploadPDF() {
    const fileInput = document.getElementById('pdf-upload');
    const file = fileInput.files[0];
    if (!file) return alert('Please select a PDF.');

    const formData = new FormData();
    formData.append('pdf', file);
}