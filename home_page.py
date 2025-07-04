import ltk
from PyPDF2 import PdfReader
import pyttsx3
import io

def generateAudiobook(pdf_data, filename):
        pdf_stream = io.BytesIO(pdf_data)
        pdf_reader = PdfReader(pdf_stream)
        text = ""

        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                 text += page_text

        speaker = pyttsx3.init()
        speaker.setProperty('rate', 150)
        speaker.setProperty('volume', 0.8)

        audio_filename = filename.rsplit('.', 1)[0] + '.mp3'
        speaker.save_to_file(text, audio_filename)
        speaker.runAndWait()
        speaker.stop()

        return "Audio file created successfully: "

def create():

    global pdf_bytes, pdf_name

    @ltk.callback
    def makeAudioBookOnAction(event):
        global pdf_bytes, pdf_name
        if not pdf_bytes:
            print("No file loaded.")
            return
        print(f"Creating audiobook for {pdf_name}...")
        result = generateAudiobook(pdf_bytes, pdf_name)

    @ltk.callback
    def loaded_file(file, content):
        global pdf_bytes, pdf_name
        pdf_bytes = content.to_py()
        pdf_name = file.name
        print(f"Loaded file: {pdf_name}")

    return (
        ltk.VBox(
            ltk.File(loaded_file),
            ltk.Text("An unstyled button"),
            ltk.Button("Make Audiobook", makeAudioBookOnAction),
        ).appendTo(ltk.window.document.body)
    )

create()