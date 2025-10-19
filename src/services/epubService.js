const axios = require('axios')
const EPub = require('epub')
const fs = require('fs')
const path = require('path')
const os = require('os')

// Tạo thư mục temp trong thư mục tạm của hệ thống
const tempDir = path.join(os.tmpdir(), 'reading-book-epub')

/**
 * Đảm bảo thư mục temp tồn tại
 */
const ensureTempDir = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
}

// Khởi tạo thư mục temp
ensureTempDir()

/**
 * Tạo tên file tạm unique
 */
const generateTempFileName = () => {
  return `epub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.epub`
}

/**
 * Xóa file tạm
 */
const cleanupTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Failed to cleanup temp file:', error.message)
  }
}

/**
 * Download và parse EPUB từ URL
 */
const parseEpubFromUrl = async (data) => {
  const { url } = data
  const tempPath = path.join(tempDir, generateTempFileName())

  try {
    // Download file EPUB
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000, // 30 seconds timeout
      maxRedirects: 5, // Allow redirects
      headers: {
        'User-Agent': 'Reading-Book-API/1.0'
      }
    })

    // Lưu file tạm
    fs.writeFileSync(tempPath, response.data)

    // Validate file size
    const stats = fs.statSync(tempPath)
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    // Parse EPUB
    const epubData = await parseEpubFile({ filePath: tempPath })

    return epubData

  } catch (error) {
    throw new Error(`Failed to process EPUB from URL: ${error.message}`)
  } finally {
    // Xóa file tạm
    cleanupTempFile(tempPath)
  }
}

/**
 * Parse file EPUB từ đường dẫn local
 */
const parseEpubFile = async (data) => {
  const { filePath } = data
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath)

    epub.on('end', () => {
      const result = {
        metadata: {
          title: epub.metadata.title || '',
          creator: epub.metadata.creator || '',
          publisher: epub.metadata.publisher || '',
          language: epub.metadata.language || 'en',
          description: epub.metadata.description || '',
          subject: epub.metadata.subject || '',
          date: epub.metadata.date || '',
          rights: epub.metadata.rights || ''
        },
        chapters: epub.flow.map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          href: chapter.href,
          level: chapter.level || 1
        })),
        toc: epub.toc.map(item => ({
          id: item.id,
          title: item.title,
          href: item.href,
          level: item.level || 1
        })),
        manifest: Object.keys(epub.manifest).map(key => ({
          id: key,
          href: epub.manifest[key].href,
          mediaType: epub.manifest[key].mediaType
        })),
        spine: epub.spine,
        totalChapters: epub.flow.length
      }

      resolve(result)
    })

    epub.on('error', (err) => {
      reject(new Error(`Failed to parse EPUB: ${err.message}. This might be due to corrupted file, invalid EPUB format, or empty archive.`))
    })

    epub.parse()
  })
}

/**
 * Lấy metadata của EPUB từ URL
 */
const getEpubMetadata = async (data) => {
  const { url } = data
  try {
    const epubData = await parseEpubFromUrl({ url })
    return {
      success: true,
      data: {
        metadata: epubData.metadata,
        totalChapters: epubData.totalChapters,
        toc: epubData.toc
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy danh sách chương của EPUB từ URL
 */
const getEpubChapters = async (data) => {
  const { url } = data
  try {
    const epubData = await parseEpubFromUrl({ url })
    return {
      success: true,
      data: {
        chapters: epubData.chapters,
        totalChapters: epubData.totalChapters
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy nội dung một chương cụ thể từ EPUB URL
 */
const getEpubChapterContent = async (data) => {
  const { url, chapterId } = data
  const tempPath = path.join(tempDir, generateTempFileName())

  try {
    // Download file EPUB
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5
    })

    fs.writeFileSync(tempPath, response.data)

    // Validate file size
    const stats = fs.statSync(tempPath)
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    // Parse EPUB và lấy nội dung chương
    const epub = new EPub(tempPath)

    return new Promise((resolve, reject) => {
      epub.on('end', () => {
        epub.getChapter(chapterId, (error, text) => {
          if (error) {
            reject(new Error(`Failed to get chapter content: ${error.message}`))
          } else {
            // Tìm title từ flow trước
            let chapterTitle = epub.flow.find(ch => ch.id === chapterId)?.title
            console.log(`🔍 [getChapterContent] Finding title for chapterId: ${chapterId}`)
            console.log('📚 [getChapterContent] Flow chapters:', epub.flow.map(ch => ({ id: ch.id, title: ch.title, href: ch.href })))

            // Nếu không tìm thấy trong flow, thử tìm trong TOC
            if (!chapterTitle) {
              console.log('❌ [getChapterContent] Not found in flow, searching TOC...')
              chapterTitle = epub.toc.find(item => item.id === chapterId)?.title
              console.log('📖 [getChapterContent] TOC chapters:', epub.toc.map(item => ({ id: item.id, title: item.title, href: item.href })))
            }

            // Nếu vẫn không tìm thấy, thử tìm theo href
            if (!chapterTitle) {
              console.log('❌ [getChapterContent] Not found by ID, searching by href...')
              const flowChapter = epub.flow.find(ch => ch.href === chapterId)
              if (flowChapter) {
                chapterTitle = flowChapter.title
                console.log(`✅ [getChapterContent] Found in flow by href: ${chapterTitle}`)
              } else {
                const tocChapter = epub.toc.find(item => item.href === chapterId)
                if (tocChapter) {
                  chapterTitle = tocChapter.title
                  console.log(`✅ [getChapterContent] Found in TOC by href: ${chapterTitle}`)
                }
              }
            } else {
              console.log(`✅ [getChapterContent] Found title: ${chapterTitle}`)
            }

            // Fallback cuối cùng
            if (!chapterTitle) {
              chapterTitle = `Chapter ${chapterId}`
              console.log(`⚠️ [getChapterContent] Using fallback title: ${chapterTitle}`)
            }

            resolve({
              success: true,
              data: {
                chapterId,
                content: text,
                title: chapterTitle
              }
            })
          }
        })
      })

      epub.on('error', (err) => {
        reject(new Error(`Failed to parse EPUB: ${err.message}. This might be due to corrupted file, invalid EPUB format, or empty archive.`))
      })

      epub.parse()
    })

  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  } finally {
    cleanupTempFile(tempPath)
  }
}

/**
 * Validate EPUB URL
 */
const validateEpubUrl = async (data) => {
  const { url } = data
  try {
    // Kiểm tra URL format
    const urlPattern = /^https?:\/\/.+/
    if (!urlPattern.test(url)) {
      return {
        success: false,
        message: 'Invalid URL format'
      }
    }

    // Kiểm tra file extension
    if (!url.toLowerCase().includes('.epub')) {
      return {
        success: false,
        message: 'URL does not point to an EPUB file'
      }
    }

    // Thử download header để kiểm tra file có tồn tại không
    const response = await axios.head(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Reading-Book-API/1.0'
      }
    })

    const contentType = response.headers['content-type']
    if (contentType && !contentType.includes('epub') && !contentType.includes('application/zip')) {
      return {
        success: false,
        message: 'File is not a valid EPUB format'
      }
    }

    return {
      success: true,
      message: 'Valid EPUB URL'
    }

  } catch (error) {
    return {
      success: false,
      message: `URL validation failed: ${error.message}`
    }
  }
}

/**
 * Lấy nội dung chương dạng raw (không xử lý HTML)
 */
const getEpubChapterRaw = async (data) => {
  const { url, chapterId } = data
  const tempPath = path.join(tempDir, generateTempFileName())

  try {
    // Download file EPUB
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5
    })

    fs.writeFileSync(tempPath, response.data)

    // Validate file size
    const stats = fs.statSync(tempPath)
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    // Parse EPUB và lấy nội dung chương raw
    const epub = new EPub(tempPath)

    return new Promise((resolve, reject) => {
      epub.on('end', () => {
        epub.getChapterRaw(chapterId, (error, text) => {
          if (error) {
            reject(new Error(`Failed to get raw chapter content: ${error.message}`))
          } else {
            // Tìm title từ flow trước
            let chapterTitle = epub.flow.find(ch => ch.id === chapterId)?.title
            console.log(`🔍 [getChapterRaw] Finding title for chapterId: ${chapterId}`)
            console.log('📚 [getChapterRaw] Flow chapters:', epub.flow.map(ch => ({ id: ch.id, title: ch.title, href: ch.href })))
            // Nếu không tìm thấy trong flow, thử tìm trong TOC
            if (!chapterTitle) {
              console.log('❌ [getChapterRaw] Not found in flow, searching TOC...')
              chapterTitle = epub.toc.find(item => item.id === chapterId)?.title
              console.log('📖 [getChapterRaw] TOC chapters:', epub.toc.map(item => ({ id: item.id, title: item.title, href: item.href })))
            }
            // Nếu vẫn không tìm thấy, thử tìm theo href
            if (!chapterTitle) {
              console.log('❌ [getChapterRaw] Not found by ID, searching by href...')
              const flowChapter = epub.flow.find(ch => ch.href === chapterId)
              if (flowChapter) {
                chapterTitle = flowChapter.title
                console.log(`✅ [getChapterRaw] Found in flow by href: ${chapterTitle}`)
              } else {
                const tocChapter = epub.toc.find(item => item.href === chapterId)
                if (tocChapter) {
                  chapterTitle = tocChapter.title
                  console.log(`✅ [getChapterRaw] Found in TOC by href: ${chapterTitle}`)
                }
              }
            } else {
              console.log(`✅ [getChapterRaw] Found title: ${chapterTitle}`)
            }
            // Fallback cuối cùng
            if (!chapterTitle) {
              chapterTitle = `Chapter ${chapterId}`
              console.log(`⚠️ [getChapterRaw] Using fallback title: ${chapterTitle}`)
            }
            resolve({
              success: true,
              data: {
                chapterId,
                rawContent: text,
                title: chapterTitle
              }
            })
          }
        })
      })

      epub.on('error', (err) => {
        reject(new Error(`Failed to parse EPUB: ${err.message}. This might be due to corrupted file, invalid EPUB format, or empty archive.`))
      })

      epub.parse()
    })

  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  } finally {
    cleanupTempFile(tempPath)
  }
}

/**
 * Lấy ảnh từ EPUB
 */
const getEpubImage = async (data) => {
  const { url, imageId } = data
  const tempPath = path.join(tempDir, generateTempFileName())

  try {
    // Download file EPUB
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5
    })

    fs.writeFileSync(tempPath, response.data)

    // Validate file size
    const stats = fs.statSync(tempPath)
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    // Parse EPUB và lấy ảnh
    const epub = new EPub(tempPath)

    return new Promise((resolve, reject) => {
      epub.on('end', () => {
        epub.getImage(imageId, (error, img, mimeType) => {
          if (error) {
            reject(new Error(`Failed to get image: ${error.message}`))
          } else {
            resolve({
              success: true,
              data: {
                imageId,
                image: img,
                mimeType: mimeType,
                base64: `data:${mimeType};base64,${img.toString('base64')}`
              }
            })
          }
        })
      })

      epub.on('error', (err) => {
        reject(new Error(`Failed to parse EPUB: ${err.message}. This might be due to corrupted file, invalid EPUB format, or empty archive.`))
      })

      epub.parse()
    })

  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  } finally {
    cleanupTempFile(tempPath)
  }
}

/**
 * Lấy file từ EPUB (CSS, JS, etc.)
 */
const getEpubFile = async (data) => {
  const { url, fileId } = data
  const tempPath = path.join(tempDir, generateTempFileName())

  try {
    // Download file EPUB
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5
    })

    fs.writeFileSync(tempPath, response.data)

    // Validate file size
    const stats = fs.statSync(tempPath)
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    // Parse EPUB và lấy file
    const epub = new EPub(tempPath)

    return new Promise((resolve, reject) => {
      epub.on('end', () => {
        epub.getFile(fileId, (error, data, mimeType) => {
          if (error) {
            reject(new Error(`Failed to get file: ${error.message}`))
          } else {
            resolve({
              success: true,
              data: {
                fileId,
                content: data,
                mimeType: mimeType,
                size: data.length
              }
            })
          }
        })
      })

      epub.on('error', (err) => {
        reject(new Error(`Failed to parse EPUB: ${err.message}. This might be due to corrupted file, invalid EPUB format, or empty archive.`))
      })

      epub.parse()
    })

  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  } finally {
    cleanupTempFile(tempPath)
  }
}

/**
 * Lấy danh sách tất cả ảnh trong EPUB
 */
const getEpubImages = async (data) => {
  const { url } = data
  try {
    const epubData = await parseEpubFromUrl({ url })
    const images = epubData.manifest.filter(item =>
      item.mediaType && item.mediaType.startsWith('image/')
    )

    return {
      success: true,
      data: {
        images: images,
        totalImages: images.length
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Dọn dẹp tất cả file tạm cũ (older than 1 hour)
 */
const cleanupOldTempFiles = (data) => {
  try {
    const files = fs.readdirSync(tempDir)
    const oneHourAgo = Date.now() - (60 * 60 * 1000)

    files.forEach(file => {
      const filePath = path.join(tempDir, file)
      const stats = fs.statSync(filePath)

      if (stats.mtime.getTime() < oneHourAgo) {
        fs.unlinkSync(filePath)
      }
    })
  } catch (error) {
    console.error('Failed to cleanup old temp files:', error.message)
  }
}


module.exports = {
  parseEpubFromUrl,
  parseEpubFile,
  getEpubMetadata,
  getEpubChapters,
  getEpubChapterContent,
  validateEpubUrl,
  getEpubChapterRaw,
  getEpubImage,
  getEpubFile,
  getEpubImages,
  cleanupOldTempFiles
}
