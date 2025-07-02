import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function excelToJson(fileBuffer) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);

      const worksheet = workbook.worksheets[0];
      const headers = [];
      const data = [];

      worksheet.eachRow((row, rowIndex) => {
            const values = row.values.slice(1);
            if (rowIndex === 1) {
                  headers.push(...values);
            } else {
                  const rowData = {};
                  values.forEach((cell, i) => {
                        rowData[headers[i]] = cell;
                  });
                  data.push(rowData);
            }
      });

      return data;
}

export async function generateAdminImportTemplate() {
      return await generateImportTemplate('import-admin-template.xlsx');
}

export async function generateNurseImportTemplate() {
      return await generateImportTemplate('import-nurse-template.xlsx');
}

export async function generateParentImportTemplate() {
      return await generateImportTemplate('import-parent-template.xlsx');
}

export async function generateStudentTemplate() {
      return await generateImportTemplate('import-student-template.xlsx');
}


export async function generateImportTemplate(fileName) {
      const workbook = new ExcelJS.Workbook();

      // Resolve thư mục nếu dùng ES module
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      const templatePath = path.resolve(__dirname, 'templates', fileName);
      console.log(templatePath);
      await workbook.xlsx.readFile(templatePath);

      // 🔁 Lặp qua tất cả các sheet
      for (const sheet of workbook.worksheets) {
            // Tự động set width cho mỗi cột
            sheet.columns?.forEach(column => {
                  const headerLength = (column.header || '').toString().length;
                  column.width = Math.max(headerLength + 5, 20);
            });

            // Tô đậm dòng tiêu đề (row 1)
            const headerRow = sheet.getRow(1);
            headerRow.eachCell(cell => {
                  cell.font = { bold: true };
            });
      }

      // Trả về buffer
      return await workbook.xlsx.writeBuffer();
}
