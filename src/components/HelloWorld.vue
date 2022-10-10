<template>
  <h1>{{ props.msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <h2 class="left-align">Agora Voice Web SDK Quickstart</h2>
  <div class="row">
    <div>
      <button id="join" type="button" @click="joinChannel">JOIN</button>
      <button id="leave" type="button" @click="leaveChannel">LEAVE</button>
      <button id="leave" type="button" @click="unmuteLocalAudio">开麦</button>
      <button id="leave" type="button" @click="muteLocalAudio">闭麦</button>
    </div>
    <div>
      <button id="play" type="button" @click="playAudioFile">PLAY</button>
      <button id="stop" type="button" @click="stopAudioFile">STOP</button>
    </div>
    <div>
      <button id="upload">上传</button>
      <input id="inputFile" type="file" @change="dealFileChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import OSS from "ali-oss";
import AgoraRTC, {
  IAgoraRTCClient,
  IBufferSourceAudioTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

const props = defineProps({
  msg: {
    type: String,
    default: "",
  },
});
const rtc = {
  localAudioTrack: null as unknown as IMicrophoneAudioTrack,
  client: null as unknown as IAgoraRTCClient,
  audioFileTrack: null as unknown as IBufferSourceAudioTrack,
};

const options = {
  // Pass your App ID here.
  appId: "3cef07566b93496798f9de5da63bcc8d",
  // Set the channel name.
  channel: "test2022",
  // Pass your temp token here.
  token:
    "007eJxTYIj2SavxP1D8Mi9sUcTOgp2WTzzPccTrtya12Bvtfh8ara/AYJycmmZgbmpmlmRpbGJpZm5pkWaZkmqakmhmnJScbJEi3OecPPm+S7LPqw4mRgYIBPE5GEpSi0uMDIyMGBgAvRkh4A==",
  // Set the user ID.
  uid: 123456,
};
const count = ref(0);

const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
  region: "oss-cn-beijing",
  // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
  // accessKeyId: 'LTAI5tD3xc4mANmh9k3uHspM',
  // accessKeySecret: 'qiRda3BMsQeA0wlWCIEgRd2e2O16FM',
  accessKeyId: "LTAI7zF9r542KCuW",
  accessKeySecret: "KKNOLUkQaxWXZOCPx1nghq3Bh8TMOf",
  // 从STS服务获取的安全令牌（SecurityToken）。
  // stsToken: 'yourSecurityToken',
  // 填写Bucket名称。
  bucket: "kbtoken",
});

// const headers = {
//   // 指定Object的存储类型。
//   "x-oss-storage-class": "Standard",
//   // 指定Object的访问权限。
//   "x-oss-object-acl": "private",
//   // 设置Object的标签，可同时设置多个标签。
//   "x-oss-tagging": "Tag1=1&Tag2=2",
//   // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
//   "x-oss-forbid-overwrite": "true",
// };

const dealFileChange = (e: any) => {
  const file = e.target.files[0]; // 拿到上传的file
  putObject(file);
};

async function putObject(data: File) {
  try {
    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
    // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
    const result = await client.put(
      `test/${data.name}`,
      data
      // {headers}
    );
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

// upload!.addEventListener("click", () => {
//   data = document.getElementById("file")!.files[0];
//   putObject(data);
// });

async function startBasicCall() {
  // Create an AgoraRTCClient object.
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
  rtc.client.on("user-published", async (user: any, mediaType: any) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event
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
    rtc.client.on("user-unpublished", async (user) => {
      // Unsubscribe from the tracks of the remote user.
      await rtc.client.unsubscribe(user);
    });
  });
}

async function joinChannel() {
  await rtc.client.join(
    options.appId,
    options.channel,
    options.token,
    options.uid
  );
  // Create a local audio track from the audio sampled by a microphone.
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // 通过在线音乐创建音频轨道。
  // const audioFileTrack = await AgoraRTC.createBufferSourceAudioTrack({
  //   source: "https://kbtoken.oss-cn-beijing.aliyuncs.com/test/welcome.mp3",
  // });
  // // 开始处理来自音频文件的音频数据。
  // audioFileTrack.startProcessAudioBuffer();
  // Publish the local audio tracks to the RTC channel.
  await rtc.client.publish([rtc.localAudioTrack]);

  console.log("publish success!");
}

async function leaveChannel() {
  // Destroy the local audio track.
  rtc.localAudioTrack.close();

  // Leave the channel.
  await rtc.client.leave();
}

// 闭麦
function muteLocalAudio() {
  rtc.localAudioTrack.setMuted(true);
}

// 取消闭麦
function unmuteLocalAudio() {
  rtc.localAudioTrack.setMuted(false);
}

async function playAudioFile() {
  rtc.audioFileTrack = await AgoraRTC.createBufferSourceAudioTrack({
    source: "https://kbtoken.oss-cn-beijing.aliyuncs.com/test/welcome.mp3",
  });
  // 开始处理来自音频文件的音频数据。
  rtc.audioFileTrack.startProcessAudioBuffer();
  await rtc.client.publish([rtc.localAudioTrack, rtc.audioFileTrack]);
}

function stopAudioFile() {
  // 开始处理来自音频文件的音频数据。
  rtc.audioFileTrack.stopProcessAudioBuffer();
}

onMounted(() => {
  startBasicCall();
});
</script>

<script lang="ts">
export default {
  name: "HelloWorld",
};
</script>
