import AgoraRTC from "agora-rtc-sdk-ng"

const rtc = {
    localAudioTrack: null,
    client: null
};

let options = {
    // Pass your App ID here.
    appId: "3cef07566b93496798f9de5da63bcc8d",
    // Set the channel name.
    channel: "zee",
    // Pass your temp token here.
    token: "007eJxTYJg0f/OpiJ3lp/svKuu/fKO1ceGmdzZMCTw5IQutq+/8cMxWYDBOTk0zMDc1M0uyNDaxNDO3tEizTEk1TUk0M05KTrZIMfyplLzBSyV56VwOBkYoBPGZGapSUxkYALirIX0=",
    // Set the user ID.
    uid: 123456
};

async function startBasicCall() {
    // Create an AgoraRTCClient object.
    // @ts-ignore
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    // @ts-ignore
    rtc.client.on("user-published", async (user:any, mediaType:any) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        // @ts-ignore
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        // @ts-ignore
        rtc.client.on("user-unpublished", async (user) => {
            // Unsubscribe from the tracks of the remote user.
            // @ts-ignore
            await rtc.client.unsubscribe(user);
        });

    });

    window.onload = function () {

        // @ts-ignore
        document.getElementById("join").onclick = async function () {
            // Join an RTC channel.
            // @ts-ignore
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);
            // Create a local audio track from the audio sampled by a microphone.
            // @ts-ignore
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // Publish the local audio tracks to the RTC channel.
            // @ts-ignore
            await rtc.client.publish([rtc.localAudioTrack]);

            console.log("publish success!");
        }

        // @ts-ignore
        document.getElementById("leave").onclick = async function () {
            // Destroy the local audio track.
            // @ts-ignore
            rtc.localAudioTrack.close();

            // Leave the channel.
            // @ts-ignore
            await rtc.client.leave();
        }
    }
}

startBasicCall()
