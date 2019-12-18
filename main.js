const SERVER_STORAGE_KEY = 'server';
const ROOM_NAME_STORAGE_KEY = 'room_name';
console.log('called');

const video = $("#video").get(0);

video.autoplay = false;

let seekedState = 'init';

// seeked
const seekedCall = () => {
    if (seekedState === 'init') {
        console.log('ready');
        seekedState = 'seekwait';
    } else if (seekedState === 'seekwait') {
        video.autoplay = false;
        video.pause();
        if (socket.connected) {
            socket.emit('seek_request', video.currentTime);
        }
        seekedState = 'seeked';
    } else if (seekedState === 'seeking') {
        seekedState = 'seeked';
        setTimeout(function() {
            socket.emit('im_ready');
        }, 1000);
    }
};

const sendPlay = () => {
    video.pause();
    video.removeEventListener('play', sendPlay);
    if (socket.connected) {
        socket.emit('play_request');
    }
};

video.addEventListener('loadeddata', () => {
    console.log('loadeddata');
    video.currentTime = 0;

    video.addEventListener('seeked', seekedCall);
    video.addEventListener('play', sendPlay);
    video.addEventListener('pause', () => {
        console.log(video.currentTime);
    });
});


let socket;
browser.storage.local.get().then((res) => {
    const server = res[SERVER_STORAGE_KEY];
    const roomName = res[ROOM_NAME_STORAGE_KEY];
    console.log(server);
    console.log(roomName);

    if (server && roomName) {
        socket = io.connect(server);
        socket.on('connect', () => {
            console.log(socket.connected);
            socket.emit('room_name', roomName);
        });
        socket.on('room_info', (info) => {
            console.log('count : ' + info.nop);
        });
        socket.on('play', () => {
            console.log('got play');
            video.play();
        });
        socket.on('resume', () => {
            console.log('got resume');
            video.play();
            seekedState = 'seekwait';
        });
        socket.on('seek', (time) => {
            if (seekedState === 'seekwait') {
                console.log('got seek' + time);
                if (video.currentTime !== time) {
                    video.autoplay = false;
                    video.pause();
                    video.currentTime = time;
                }
                seekedState = 'seeking';
            }
        });
    }
});