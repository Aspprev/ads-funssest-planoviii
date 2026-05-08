interface ImageData {
  name: string
  data: Uint8Array
}

export function convertImageToBits(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer
      const bytes = new Uint8Array(buffer)
      resolve({ name: file.name, data: bytes })
    }

    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo de imagem'))
    }

    reader.readAsArrayBuffer(file)
  })
}
