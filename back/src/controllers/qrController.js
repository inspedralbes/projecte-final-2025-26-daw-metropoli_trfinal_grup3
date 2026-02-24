import QRCode from 'qrcode';
import nodoModel from '../models/nodoModel.js';
import qrModel from '../models/qrModel.js';
import fs from 'fs';
import path from 'path';

export const generateQrCode = async (req, res) => {
  try {
    const { id_nodo } = req.params;
    const { zona } = req.query; // Permite personalización mediante parámetros

    // Validate the node ID exists in DB so we don't generate junk QRs
    const node = await nodoModel.getById(id_nodo);
    
    if (!node) {
      return res.status(404).json({
        success: false,
        message: `Node with ID ${id_nodo} not found.`
      });
    }

    // Assemble Data based on zone inputs
    const slugIndicador = zona || `zona-sin-definir`;
    const fileName = `${slugIndicador}.png`;

    // Define public directory path
    const publicDir = path.join(process.cwd(), 'public', 'qrs');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, fileName);
    const dbUrlPath = `/public/qrs/${fileName}`; // Absolute path relative to server root

    // Generate and save to filesystem as a physical PNG file
    await QRCode.toFile(filePath, qrData, {
       errorCorrectionLevel: 'H',
       type: 'png',
       margin: 2,
       color: {
         dark: '#0f172a', 
         light: '#ffffff'
       }
    });
    
    // Save to Database Model
    await qrModel.create({
        slug: slugIndicador,
        id_nodo_inicio: parseInt(id_nodo, 10),
        ruta_archivo_qr: dbUrlPath
    });

    res.status(200).json({
      success: true,
      message: 'QR Code generated, saved to server, and recorded in DB successfully',
      data: {
        id_nodo: parseInt(id_nodo, 10),
        qr_url: dbUrlPath, // Relative path, e.g. "/public/qrs/zona-norte.png"
        slug_zona: slugIndicador
      }
    });

  } catch (error) {
    console.error(`Error generating QR code for node ${req.params.id_nodo}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error generating QR code',
      error: error.message
    });
  }
};
