import ltk
from PyPDF2 import PdfReader
import io
from js import speakAndRecord

def generateAudiobook(pdf_data, filename):
        pdf_stream = io.BytesIO(pdf_data)
        pdf_reader = PdfReader(pdf_stream)
        text = ""

        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                 text += page_text + "\n"

        speakAndRecord(text)

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