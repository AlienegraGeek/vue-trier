<script setup lang="ts">
import {ref, defineProps} from 'vue'
import axios from 'axios'

interface Props {
  bucket: string
  objectName: string
  mode: 'upload' | 'download'
}

const props = defineProps<Props>()

const selectedFile = ref<File | null>(null)

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
  const objectName = replaceFileName(selectedFile.value.name)
  try {
    // 获取预签名 URL
    const response = await axios.get('http://localhost:2040/api/uploadPre', {
      params: {
        bucket: props.bucket,
        object_name: objectName
      }
    })
    
    const preSignedUrl = response.data.url
    
    // 使用预签名 URL 上传文件
    const uploadResponse = await axios.put(preSignedUrl, selectedFile.value, {
      headers: {
        'Content-Type': selectedFile.value.type
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
  try {
    // 获取预签名 URL
    const response = await axios.get('http://localhost:2040/api/downloadPre', {
      params: {
        bucket: props.bucket,
        object_name: props.objectName
      }
    })
    
    const preSignedUrl = response.data.url
    
    // 使用预签名 URL 下载文件
    const downloadResponse = await axios.get(preSignedUrl, {
      responseType: 'blob'
    })
    
    // 创建一个 Blob URL
    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = props.objectName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    alert('File downloaded successfully')
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Error downloading file')
  }
}

const transferFile = () => {
  if (props.mode === 'upload') {
    uploadFile()
  } else {
    downloadFile()
  }
}

const replaceFileName = (fileName: string) => {
  const extension = fileName.split('.').pop();
  return `${props.objectName}.${extension}`;
}
</script>

<template>
  <div>
    <input v-if="mode === 'upload'" type="file" @change="handleFileChange" />
    <button @click="transferFile">{{ mode === 'upload' ? 'Upload' : 'Download' }}</button>
  </div>
</template>

<style scoped>
input {
  margin-right: 10px;
}

button {
  margin-right: 10px;
}
</style>