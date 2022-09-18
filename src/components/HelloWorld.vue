<template>
  <h1>{{ props.msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
  <h2 class="left-align">Agora Voice Web SDK Quickstart</h2>
  <div class="row">
    <div>
      <button type="button" id="join">JOIN</button>
      <button type="button" id="leave">LEAVE</button>
    </div>
    <div>
      <button id="upload" @click="">上传</button>
      <input id="inputFile" type="file" @change="dealFileChange">
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import OSS from "ali-oss";

const props = defineProps({
  msg: {
    type: String,
    default: '',
  },
});
const count = ref(0);
const dealFileChange = (e: any) => {
  let file = e.target.files[0];//拿到上传的file
  putObject(file);
}
const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
  region: 'oss-cn-beijing',
  // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
  accessKeyId: 'LTAI5tD3xc4mANmh9k3uHspM',
  accessKeySecret: 'qiRda3BMsQeA0wlWCIEgRd2e2O16FM',
  // 从STS服务获取的安全令牌（SecurityToken）。
  // stsToken: 'yourSecurityToken',
  // 填写Bucket名称。
  bucket: 'kbtoken'
});
let data;
// 创建并填写Blob数据。
//const data = new Blob(['Hello OSS']);
// 创建并填写OSS Buffer内容。
//const data = new OSS.Buffer(['Hello OSS']);

const upload = document.getElementById("upload");
const inputData = ref(document.getElementById("inputFile"));
const headers = {
  // 指定该Object被下载时网页的缓存行为。
  // 'Cache-Control': 'no-cache',
  // 指定该Object被下载时的名称。
  // 'Content-Disposition': 'oss_download.txt',
  // 指定该Object被下载时的内容编码格式。
  // 'Content-Encoding': 'UTF-8',
  // 指定过期时间。
  // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard',
  // 指定Object的访问权限。
  'x-oss-object-acl': 'private',
  // 设置Object的标签，可同时设置多个标签。
  'x-oss-tagging': 'Tag1=1&Tag2=2',
  // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': 'true',
};

async function putObject(data: File) {
  try {
    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
    // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
    const result = await client.put(
        "test/" + data.name,
        data
        //{headers}
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
</script>

<script lang="ts">
export default {
  name: 'HelloWorld',
}
</script>
