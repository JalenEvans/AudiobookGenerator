from PyPDF2 import PdfReader
import pyttsx3

class pdf_to_audio:
    def generateAudiobook(filename, download_path):
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
    