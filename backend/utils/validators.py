from fastapi import HTTPException

def validate_file_size(file_size: int, max_size_mb: int = 100):
    if file_size > max_size_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File size exceeds {max_size_mb}MB")