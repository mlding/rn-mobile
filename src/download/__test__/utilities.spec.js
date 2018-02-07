import { readDir, unlink, mkdir } from 'react-native-fs'
import {
  clearTempFiles,
  clearUselessFiles,
  filterFiles,
  getFileId,
  getFilesFolder,
  getLocalFiles,
  getOriginalFileName,
  getTempFolder,
} from '../utilities'
import {
  downloadedAllFiles,
  downloadedFiles,
  filteredFiles,
  filterLocalFilesWithUseless,
  localFilesWithUseless,
  workPackageFiles,
} from '../fixture'

describe('download utilities test', () => {
  const fileNameWithId = '12_DPR Sample.pdf'
  const fileNameWithIdSpecial = '13_DPR_Sample.pdf'
  const fileNameWithIdNull = null
  const fileNameWithIdEmpty = ''
  const fileNameWithIdUndefined = undefined

  describe('#getFileId', () => {
    it('should return file id 12', () => {
      expect(getFileId(fileNameWithId)).toEqual(12)
    })
    it('should return file id 13', () => {
      expect(getFileId(fileNameWithIdSpecial)).toEqual(13)
    })
    it('should return file id empty', () => {
      expect(getFileId(fileNameWithIdNull)).toEqual('')
      expect(getFileId(fileNameWithIdEmpty)).toEqual('')
      expect(getFileId(fileNameWithIdUndefined)).toEqual('')
    })
  })

  describe('#getOriginalFileName', () => {
    it('should return file name DPR Sample.pdf', () => {
      expect(getOriginalFileName(fileNameWithId)).toEqual('DPR Sample.pdf')
    })
    it('should return file name DPR_Sample.pdf', () => {
      expect(getOriginalFileName(fileNameWithIdSpecial)).toEqual('DPR_Sample.pdf')
    })
    it('should return file name empty', () => {
      expect(getOriginalFileName(fileNameWithIdNull)).toEqual('')
      expect(getOriginalFileName(fileNameWithIdEmpty)).toEqual('')
      expect(getOriginalFileName(fileNameWithIdUndefined)).toEqual('')
    })
  })

  describe('#filterFiles', () => {
    it('should filter downloaded files', () => {
      const result = filterFiles(workPackageFiles, downloadedFiles)
      expect(result).toEqual(filteredFiles)
    })
    it('should filter all when all files have been downloaded', () => {
      const result = filterFiles(workPackageFiles, downloadedAllFiles)
      expect(result).toEqual([])
    })
    it('should not filter when downloaded files is null', () => {
      const result = filterFiles(workPackageFiles, [])
      expect(result).toEqual(workPackageFiles)
    })
    it('should filter useless files', () => {
      const result = filterFiles(localFilesWithUseless, workPackageFiles)
      expect(result).toEqual(filterLocalFilesWithUseless)
    })
  })

  describe('#clearUselessFiles', () => {
    it('clear useless files successfully', () => {
      unlink.mockImplementation(() => Promise.resolve([]))
      clearUselessFiles(workPackageFiles, localFilesWithUseless)
      expect(unlink).toBeCalledWith(filterLocalFilesWithUseless[0].path)
    })
    it('clear useless files failed', () => {
      unlink.mockImplementation(() => Promise.reject([]))
      clearUselessFiles(workPackageFiles, localFilesWithUseless)
      expect(unlink).toBeCalledWith(filterLocalFilesWithUseless[0].path)
    })
  })

  describe('#clearTempFiles', () => {
    it('clear local files successfully', () => {
      unlink.mockImplementation(() => Promise.resolve([]))
      return clearTempFiles('test.pdf').then(result => {
        expect(result).toEqual(undefined)
      })
    })
    it('clear local files failed', () => {
      unlink.mockImplementation(() => Promise.reject('clear downloading files failed.'))
      return clearTempFiles('test.pdf').catch(result => {
        expect(result).toEqual('clear downloading files failed.')
      })
    })
  })

  describe('#getLocalFiles', () => {
    it('get local files successfully, no file', () => {
      readDir.mockImplementation(() => Promise.resolve([]))
      return getLocalFiles().then(files => {
        expect(files).toEqual([])
      })
    })
    it('get local files successfully, have files', () => {
      readDir.mockImplementation(() => Promise.resolve([
        {
          name: '12_DPR Sample.pdf',
          path: '/39D8FE96-496B-4C4A-89F7-69071F675D09/Documents/files/12_DPR Sample.pdf',
          size: 114308,
          isFile: () => true,
        },
      ]))
      return getLocalFiles().then(files => {
        expect(files).toEqual([
          {
            id: 12,
            name: 'DPR Sample.pdf',
            path: '/39D8FE96-496B-4C4A-89F7-69071F675D09/Documents/files/12_DPR Sample.pdf',
          },
        ])
      })
    })

    it('get local files successfully, have files but not size == 0', () => {
      readDir.mockImplementation(() => Promise.resolve([
        {
          name: '12_DPR Sample.pdf',
          path: '/39D8FE96-496B-4C4A-89F7-69071F675D09/Documents/files/12_DPR Sample.pdf',
          size: 0,
          isFile: () => true,
        },
      ]))
      return getLocalFiles().then(files => {
        expect(files).toEqual([])
      })
    })
    it('get local files failed', () => {
      readDir.mockImplementation(() => Promise.reject('get local files failed.'))
      return getLocalFiles().catch(err => {
        expect(err).toEqual('get local files failed.')
      })
    })
  })

  describe('#getFilesFolder', () => {
    it('get local files folder', () => {
      mkdir.mockImplementation(() => Promise.resolve([]))
      return getFilesFolder().then(files => {
        expect(files).toEqual([])
      })
    })
  })

  describe('#getTempFolder', () => {
    it('get local temp folder', () => {
      mkdir.mockImplementation(() => Promise.resolve([]))
      return getTempFolder().then(files => {
        expect(files).toEqual([])
      })
    })
  })
})

