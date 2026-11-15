"""Validate uploads by their actual bytes, not the client-declared MIME type.

The Content-Type of a multipart part is chosen by the client, so on its own it
proves nothing. Each allowed type is identified by its file signature ("magic
bytes"), and the stored extension comes from what the file really is.
"""

from fastapi import HTTPException, UploadFile, status

PDF = "application/pdf"
DOC = "application/msword"
DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
JPEG = "image/jpeg"
PNG = "image/png"
WEBP = "image/webp"

EXTENSIONS = {PDF: ".pdf", DOC: ".doc", DOCX: ".docx", JPEG: ".jpg", PNG: ".png", WEBP: ".webp"}

CV_TYPES = frozenset({PDF, DOC, DOCX})
IMAGE_TYPES = frozenset({JPEG, PNG, WEBP})


def sniff(data: bytes) -> str | None:
    """Return the MIME type identified by the file's signature, or None."""
    if data.startswith(b"%PDF-"):
        return PDF
    if data.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"):  # OLE2 (legacy .doc)
        return DOC
    if data.startswith(b"PK\x03\x04") and b"word/" in data[:65536]:  # OOXML Word
        return DOCX
    if data.startswith(b"\xff\xd8\xff"):
        return JPEG
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return PNG
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return WEBP
    return None


async def read_validated_upload(
    upload: UploadFile, allowed: frozenset[str], max_bytes: int, kind: str, allowed_label: str
) -> tuple[bytes, str]:
    """Read an upload, enforce size and real file type. Returns (bytes, mime)."""
    data = await upload.read(max_bytes + 1)
    if not data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{kind} file is empty")
    if len(data) > max_bytes:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, f"{kind} must be under {max_bytes // (1024 * 1024)} MB"
        )
    mime = sniff(data)
    if mime not in allowed:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{kind} must be {allowed_label}")
    return data, mime
