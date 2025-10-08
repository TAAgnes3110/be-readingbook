const { 
  getEpubMetadata, 
  getEpubChapters, 
  getEpubChapterContent, 
  validateEpubUrl, 
  getEpubChapterRaw, 
  getEpubImage, 
  getEpubFile, 
  getEpubImages 
} = require('../services/epubService')

const epubController = {
  /**
   * Lấy metadata EPUB từ URL
   */
  getMetadata: async (req, res) => {
    try {
      const { epub_url } = req.body

      if (!epub_url) {
        return res.status(400).json({
          success: false,
          message: 'epub_url is required'
        })
      }

      const result = await getEpubMetadata(epub_url)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy danh sách chương EPUB từ URL
   */
  getChapters: async (req, res) => {
    try {
      const { epub_url } = req.body

      if (!epub_url) {
        return res.status(400).json({
          success: false,
          message: 'epub_url is required'
        })
      }

      const result = await getEpubChapters(epub_url)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy nội dung chương EPUB từ URL
   */
  getChapterContent: async (req, res) => {
    try {
      const { epub_url, chapter_id } = req.body

      if (!epub_url || !chapter_id) {
        return res.status(400).json({
          success: false,
          message: 'epub_url and chapter_id are required'
        })
      }

      const result = await getEpubChapterContent(epub_url, chapter_id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Validate EPUB URL
   */
  validateUrl: async (req, res) => {
    try {
      const { epub_url } = req.body

      if (!epub_url) {
        return res.status(400).json({
          success: false,
          message: 'epub_url is required'
        })
      }

      const result = await validateEpubUrl(epub_url)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy nội dung chương dạng raw
   */
  getChapterRaw: async (req, res) => {
    try {
      const { epub_url, chapter_id } = req.body

      if (!epub_url || !chapter_id) {
        return res.status(400).json({
          success: false,
          message: 'epub_url and chapter_id are required'
        })
      }

      const result = await getEpubChapterRaw(epub_url, chapter_id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy ảnh từ EPUB
   */
  getImage: async (req, res) => {
    try {
      const { epub_url, image_id } = req.body

      if (!epub_url || !image_id) {
        return res.status(400).json({
          success: false,
          message: 'epub_url and image_id are required'
        })
      }

      const result = await getEpubImage(epub_url, image_id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy file từ EPUB
   */
  getFile: async (req, res) => {
    try {
      const { epub_url, file_id } = req.body

      if (!epub_url || !file_id) {
        return res.status(400).json({
          success: false,
          message: 'epub_url and file_id are required'
        })
      }

      const result = await getEpubFile(epub_url, file_id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy danh sách ảnh trong EPUB
   */
  getImages: async (req, res) => {
    try {
      const { epub_url } = req.body

      if (!epub_url) {
        return res.status(400).json({
          success: false,
          message: 'epub_url is required'
        })
      }

      const result = await getEpubImages(epub_url)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  }
}

module.exports = epubController
