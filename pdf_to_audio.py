from PyPDF2 import PdfReader
import pyttsx3
from pyscript import document

def pdf_to_audio(filename, download_path):
    with open(filename, 'rb') as pdf_file:
        pdf_reader = PdfReader(pdf_file)
        text = ""

        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()

    speaker = pyttsx3.init()
    speaker.setProperty('rate', 150)
    speaker.setProperty('volume', 0.8)

    speaker.save_to_file(text, download_path)
    speaker.runAndWait()
    speaker.stop()

    return "Audio file created successfully."

filename = document.getElementById('pdfFile')
status = document.getElementById('statusMessage')
status.textContent = filename
print(filename)
download_path = document.getElementById('download_path')

if filename and download_path:
    status.textContent = pdf_to_audio(filename, download_path)
else:
    status.textContent = "Please provide both filename and download path."
    