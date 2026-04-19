from pydantic import BaseModel

class TextReq(BaseModel):
    text: str
    source: str = ""
    msgId: str = ""

class URLReq(BaseModel):
    url: str
    title: str = ""
    source: str = ""

class AudioReq(BaseModel):
    b64: str
    source: str = ""
    msgId: str = ""
