// UPLOAD MODAL CONTROLLER
const uploadModal = document.getElementById('uploadModal');
const openUploadBtn = document.getElementById('openUploadModal');
const closeUploadBtn = document.getElementById('closeUpload');
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('snapmaticFile');
const fileNameDisplay = document.getElementById('fileSelectedName');
const uploadError = document.getElementById('uploadError');
const submitUploadBtn = document.getElementById('submitUploadBtn');

openUploadBtn.addEventListener('click', () => {
    uploadForm.reset();
    fileNameDisplay.textContent = '';
    uploadError.style.display = 'none';
    submitUploadBtn.disabled = true;
    uploadModal.showModal();
});

closeUploadBtn.addEventListener('click', () => uploadModal.close());

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset UI states
    uploadError.style.display = 'none';
    fileNameDisplay.textContent = '';
    submitUploadBtn.disabled = true;

    if (files.length > 20) {
        uploadError.textContent = `Error: You can only upload a maximum of 20 files at once. You selected ${files.length}.`;
        uploadError.style.display = 'block';
        fileInput.value = ''; // Flush selection
        return;
    }

    const validFileNames = [];
    const invalidFileNames = [];
    const oversizedFileNames = [];

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Loop through every single selected file
    for (let i = 0; i < files.length; i++) {
        const filename = files[i].name;

        if (files[i].size > MAX_FILE_SIZE) {
            oversizedFileNames.push(`${filename} (${(files[i].size / (1024 * 1024)).toFixed(1)}MB)`);
            continue; // Skip further naming checks for this file since it already failed size restrictions
        }

        // Validation Rules
        const startsWithPGTA = filename.startsWith('PGTA');
        const hasNoExtension = !filename.includes('.');

        if (startsWithPGTA && hasNoExtension) {
            validFileNames.push(filename);
        } else {
            invalidFileNames.push(filename);
        }
    }

    // Handle Errors (If even ONE file is invalid, we flag it)
    if (invalidFileNames.length > 0) {
        const badFilesList = invalidFileNames.join(', ');
        uploadError.textContent = `Error: Incompatible file(s): ${badFilesList}. All files must start with 'PGTA' and have no file extension.`;
        uploadError.style.display = 'block';

        // Reset the file input completely so they can't submit a partial bad batch
        fileInput.value = '';
        return;
    }

    if (oversizedFileNames.length > 0) {
        const badSizesList = oversizedFileNames.join(', ');
        uploadError.textContent = `Error: File(s) exceed 5MB limit: ${badSizesList}.`;
        uploadError.style.display = 'block';
        fileInput.value = '';
        return;
    }

    if (invalidFileNames.length > 0) {
        const badFilesList = invalidFileNames.join(', ');
        uploadError.textContent = `Error: Incompatible file name(s): ${badFilesList}. All files must start with 'PGTA' and have no file extension.`;
        uploadError.style.display = 'block';
        fileInput.value = '';
        return;
    }

    if (validFileNames.length > 0) {
        fileNameDisplay.textContent = `Selected: ${validFileNames.join(', ')}`;
        submitUploadBtn.disabled = false;
    }
});