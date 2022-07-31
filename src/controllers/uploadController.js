///////////// 반드시 .env로 /////////////////////
const AWS_ACCESS_KEY = 'AKIAZXJDEW4VR37YGKNF'
const AWS_SECRET_ACCESS_KEY = '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'
///////////// 반드시 .env로 /////////////////////

const uploadModel = require('../model/uploadModel');
const highlightModel = require('../model/highlightModel');
const pdfModel = require('../model/pdfModel');

const fs = require('fs');
const path = require('path');
const {PDFDocument}  = require('pdf-lib');
const pdftohtml = require('pdftohtmljs');
const pdfToPng = require('pdf-to-png-converter').pdfToPng;


//S3연결의 위해 사용
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  // accessKeyId: process.env.AWS_ACCESS_KEY, 
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: AWS_ACCESS_KEY, 
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

exports.postBook = async function (req, res) {
  console.log("req:", req);
  const {title, subTitle, author, maxPages} = req.body;
  console.log("info :", title, subTitle, author);
  const uploadingPdfPathRoot = "./media/pdf_files/"
  let uploadingPdfPath;
  if (req.files) {
    console.log(req.files.files)
    var file = req.files.files
    var filename = file.name
    console.log(filename);
    uploadingPdfPath = uploadingPdfPathRoot+filename;
    await file.mv(uploadingPdfPathRoot+ filename, function(err){
      if (err) {
        res.send(err)
      }})
    console.log("File uploaded");
  }
  
  try {
      // userIdx 동적으로 수정 예정
      const userIdx = 58;
      // const pdfIdx = 3;
      const htmlOutputDirectoryRoot = "./media/html_result"
      const imgOutputDirectoryRoot = "./media/img_result" 
      const pdfOutputDirectoryRoot = "./media/pdf_result" 
      console.log(uploadingPdfPath);
      // pdfs에 한권도 없으면 책이 안 생김
      const lastPdfIdx = await pdfModel.getLastPdfIdx() ;
      const pdfIdx = lastPdfIdx + 1
      console.log(pdfIdx)
      const data = await fs.promises.readFile(uploadingPdfPath);
      const readPdf = await PDFDocument.load(data);
      // const { length } = readPdf.getPages();
      // console.log(length);
      let pageCnt; 
      if (!maxPages) {
        const { length } = readPdf.getPages();
        pageCnt = length;
      } else {
        pageCnt = maxPages;
      }
      const pageLength = pageCnt

      // const length = 151;
      for (let pageNum = 0, n = pageLength; pageNum < n; pageNum += 1) {
        console.log("pageNum :", pageNum);
        const writePdf = await PDFDocument.create();
        const [page] = await writePdf.copyPages(readPdf, [pageNum]);
        writePdf.addPage(page);
        const bytes = await writePdf.save();
        const htmlFileName = `${pdfIdx}_${pageNum + 1}.html`;
        const pdfFileName = `${pdfIdx}_${pageNum + 1}.pdf`;
        const htmlOutputPath = path.join(htmlOutputDirectoryRoot, htmlFileName);
        const pdfOutputPath = path.join(pdfOutputDirectoryRoot, pdfFileName);
        await fs.promises.writeFile(pdfOutputPath, bytes);
        await convert(pdfOutputPath, htmlOutputPath);
        if (pageNum == 0) { 
          const coverFileName = `book${pdfIdx}_cover_page_1.png`
          const imgOutputPath = path.join(imgOutputDirectoryRoot, coverFileName);
          await convertPdf2Png(pdfIdx, pdfOutputPath, imgOutputDirectoryRoot);
          await postToS3(imgOutputPath, coverFileName);
          const postPdfsInfoRows  = await uploadModel.postPdfsInfo(pageLength, s3Link(coverFileName), title, subTitle, author);
          const postUploadUserBookInfoRows  = await uploadModel.postUploadUserBookInfo(userIdx, pdfIdx);
          await removeFile(imgOutputPath);
        }
        await postToS3(htmlOutputPath, htmlFileName);
        const postUploadPageInfoRows = await uploadModel.postUploadPageInfo(pdfIdx, pageNum+1, s3Link(htmlFileName));
        await removeFile(pdfOutputPath);
        await removeFile(htmlOutputPath);
        console.log(`Added ${pdfOutputPath}`);
      }
      await removeFile(uploadingPdfPath);
      return res.json({
          isSuccess: true,
          code: 1000,
          message: "해당 pdf 업로드 성공",
      })
      

  } catch (err) {
      console.log(`App - post pdf info Query error\n: ${JSON.stringify(err)}`);
      
      return res.json({
          isSuccess: false,
          code: 2000,
          message: "해당 pdf 업로드 실패",
      });
  }
};


const postToS3 = (uploadingFilePath, fileName) => {
  fs.readFile(uploadingFilePath, async (err, data) => {
    if (err) {
        console.error(err)
        return;
    }
    (async () => {
      await 
      s3.putObject({
        ContentType: 'mimetype',
        ACL: 'public-read',
        Body : data,  
        Bucket : 'label-book-storage', 
        Key: fileName,
        })
        .promise()
    })();
  });
}

const s3Link = (fileName) => {
  const s3LinkRoot = "https://label-book-storage.s3.ap-northeast-2.amazonaws.com/"
  const s3Link = s3LinkRoot + fileName;
  return s3Link;
}


const convert = async (file, output) => {
  const converter = new pdftohtml(file, output)
  converter.progress((ret) => {
    const progress = (ret.current * 100.0) / ret.total
    console.log(`${progress} %`)
  })

  try {
    await converter.add_options(['--fit-width 650'])
    await converter.convert()
  } catch (err) {
    console.error(`변경 중에 오류가 있었습니다.: ${err.msg}`)
  }
}

const removeFile = async (fileDirectory) => {
  fs.unlink(fileDirectory, (err) => err ?  
    console.log(err) : console.log(`${fileDirectory} 를 정상적으로 삭제했습니다`));
  }

const readHTMLFile = (fileDirectory, pdfIdx, pageNum) => { 
  fs.readFile(fileDirectory, 'utf8', async (err, data) => {
    if (err) {
        console.error(err)
        return;
    }
    const postUploadInfoRows = await uploadModel.postUploadInfo(pdfIdx, pageNum, data);
  });
}

const convertPdf2Png = async (bookIdx, pdfDirectory, imgOutputPath) => {
  const pdfIdx = 1;
  const pngPage = await pdfToPng(pdfDirectory, {
      disableFontFace: false,
      useSystemFonts: false,
      pagesToProcess: [1],
      viewportScale: 2.0,
      outputFolder : imgOutputPath, 
      outputFileMask: `book${bookIdx}_cover`
  });
  return pngPage[0].content;
}


const uploadFile = async (uploadingPdfPathRoot, filename) => {

}


