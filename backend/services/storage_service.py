from fastapi import UploadFile, HTTPException
from config.settings import settings
import uuid
from MEGA import Mega
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def upload_file(file: UploadFile, folder: str) -> str:
    temp_file_path = None
    try:
        # Initialize MEGA client
        mega = Mega()
        m = mega.login(settings.MEGA_EMAIL, settings.MEGA_PASSWORD)
       

        # Create a temporary file to store the uploaded content
        temp_file_path = f"temp_{uuid.uuid4()}_{file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
        
        # Upload file to MEGA root
        uploaded_file = m.upload(temp_file_path)
        
        # Extract file ID from upload response
        file_id = uploaded_file.get('f', [{}])[0].get('h')
        if not file_id:
            raise Exception("Failed to retrieve file ID from upload response")

        # Find or create the target folder
        folders = m.find(folder, exclude_deleted=True)
        if folders:
            folder_id = folders[0]  # Use the first matching folder
           
        else:
            create_result = m.create_folder(folder)
            if not isinstance(create_result, dict) or not create_result:
                raise Exception(f"Failed to create folder: {create_result}")
            folder_id = create_result.get(folder, None)
            if not folder_id:
                raise Exception(f"Folder ID not found in create_folder response: {create_result}")
           
        # Move the uploaded file to the target folder
        move_result = m.move(file_id, folder_id)
        if move_result != 0:
            raise Exception(f"Failed to move file: {move_result}")
       
        # Retrieve all files to get the updated file object
        all_files = m.get_files()
        file_object = all_files.get(file_id)
        if not file_object:
            raise Exception(f"File with ID {file_id} not found after move")

        # Get public URL using the updated file object
        public_url = m.get_link((file_id, file_object))
        if not public_url:
            raise Exception("Failed to get public URL")
        
        return public_url
    except Exception as e:
        logger.error(f"MEGA upload failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to upload to MEGA: {str(e)}")
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                logger.info(f"Deleted temporary file: {temp_file_path}")
            except Exception as e:
                logger.warning(f"Failed to delete temp file {temp_file_path}: {str(e)}")