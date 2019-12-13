const SERVER_STORAGE_KEY = 'server';
const ROOM_NAME_STORAGE_KEY = 'room_name';


$(document).ready(function() {
    const serverInput = document.getElementById("server_input");
    const roomNameInput = document.getElementById("room_name_input");
    const applyButton = document.getElementById("apply_button");

    browser.storage.local.get().then((res) => {
        // console.log(res);
        if (serverInput && res[SERVER_STORAGE_KEY]) {
            serverInput.value = res[SERVER_STORAGE_KEY];
        }
        if (roomNameInput && res[ROOM_NAME_STORAGE_KEY]) {
            roomNameInput.value = res[ROOM_NAME_STORAGE_KEY];
        }
        M.updateTextFields();
    });

    applyButton.onclick = () => {
        // console.log('apply');
        if (serverInput && roomNameInput) {
            browser.storage.local.set({
                [SERVER_STORAGE_KEY]: serverInput.value,
                [ROOM_NAME_STORAGE_KEY]: roomNameInput.value
            });
        }
    };
});