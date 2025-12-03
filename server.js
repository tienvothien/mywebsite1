// server.js - Backend Server (Cần triển khai trên Render/Heroku/VPS)

const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit'); // Thư viện tạo PDF

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// --- Cấu Hình Xác Thực GOOGLE DRIVE ---
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN; 

// !!! ID THƯ MỤC GOOGLE DRIVE CỦA BẠN !!!
// ID: 1ZL2tNkImIy7qHAeKS7UEcSYfVDLTEBGG
// Ta sẽ dùng ID này làm mặc định (hoặc đọc từ biến môi trường nếu có)
const YOUR_DRIVE_FOLDER_ID = '1ZL2tNkImIy7qHAeKS7UEcSYfVDLTEBGG';
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || YOUR_DRIVE_FOLDER_ID;


if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error("LỖI CẤU HÌNH: Thiếu biến môi trường quan trọng.");
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });


/**
 * Endpoint xử lý TẠO FILE PDF VÀ TẢI LÊN GOOGLE DRIVE
 */
app.post('/upload-pdf', async (req, res) => {
    const { pages, sessionName } = req.body; 

    if (!pages || pages.length === 0) {
        return res.status(400).json({ error: 'Không tìm thấy dữ liệu trang nào để tạo PDF.' });
    }
    
    // --- BƯỚC 1: TẠO FILE PDF TỪ CÁC TRANG ẢNH ---
    const pdfDoc = new PDFDocument({ autoFirstPage: false }); 
    const pdfBuffers = [];

    pdfDoc.on('data', chunk => pdfBuffers.push(chunk));
    
    // Xử lý hoàn tất việc tạo PDF và tải lên Drive
    pdfDoc.on('end', async () => {
        try {
            const pdfFileBuffer = Buffer.concat(pdfBuffers);
            
            // --- BƯỚC 2: TẢI FILE PDF LÊN GOOGLE DRIVE ---
            
            // Đặt tên file theo định dạng: ScanPDF_YYYYMMDD_HHMMSS.pdf
            const fileName = `${sessionName}.pdf`; 

            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: 'application/pdf',
                    parents: [DRIVE_FOLDER_ID] // Sử dụng ID thư mục của bạn
                },
                media: {
                    mimeType: 'application/pdf',
                    body: pdfFileBuffer 
                }
            });

            res.status(200).json({ 
                message: `Tạo và tải lên 1 file PDF (${pages.length} trang) thành công.`, 
                fileId: response.data.id,
                fileName: fileName // Gửi tên file về Frontend để xác nhận
            });

        } catch (error) {
            console.error('Lỗi khi tải lên Google Drive:', error.message);
            res.status(500).json({ error: 'Lỗi máy chủ khi tải lên Drive.', details: error.message });
        }
    });

    // Thêm từng trang ảnh vào PDF
    pages.forEach((base64Data, index) => {
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        pdfDoc.addPage({ 
            size: 'A4', 
            margin: 0 
        });
        
        pdfDoc.image(imageBuffer, 0, 0, { 
            fit: [pdfDoc.page.width, pdfDoc.page.height],
            align: 'center', 
            valign: 'center' 
        });
    });

    // Kết thúc việc tạo file PDF
    pdfDoc.end();
});

app.get('/', (req, res) => {
    res.send('Máy chủ Scan Upload đang hoạt động.');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
