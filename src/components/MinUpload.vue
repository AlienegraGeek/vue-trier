<template>
  <h2 class="left-align">MinIO上传文件</h2>
  <div class="row">
    <div>
      <input id="inputFile" type="file" @change="handleFileChange" />
      <button @click="uploadFile">上传</button>
    </div>
    <div>
      <input type="text" v-model="fileName" placeholder="输入文件名" />
      <button @click="downloadFile">下载</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import axios from 'axios'

const selectedFile = ref<File | null>(null)
const fileName = ref<string>('')

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert('Please select a file first.')
    return
  }
  
  const file = selectedFile.value
  const objectName = file.name
  
  try {
    // 获取预签名 URL
    const response = await axios.get('http://127.0.0.1:2040/api/uploadPre', {
      params: {
        bucket: "my-bucket",
        object_name: objectName
      }
    })
    
    const preSignedUrl = response.data.url
    
    // 使用预签名 URL 上传文件
    const uploadResponse = await axios.put(preSignedUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    })
    
    if (uploadResponse.status === 200) {
      alert('File uploaded successfully')
    } else {
      alert('File upload failed')
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Error uploading file')
  }
}

const downloadFile = async () => {
  if (!fileName.value) {
    alert('Please enter a file name first.')
    return
  }
  
  const objectName = fileName.value
  
  try {
    // 获取预签名 URL
    const response = await axios.get('http://localhost:2040/api/downloadPre', {
      params: {
        bucket: "my-bucket",
        object_name: objectName
      }
    })
    
    const preSignedUrl = response.data.url
    
    // 使用预签名 URL 下载文件
    const downloadResponse = await axios.get(preSignedUrl, {
      responseType: 'blob'
    })
    
    // 创建一个链接来下载文件
    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', objectName) // 文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Error downloading file')
  }
}
</script>
