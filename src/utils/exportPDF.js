import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPDF(elementId, fileName = "result") {
  const input = document.getElementById(elementId);

  if (!input) {
    alert("Nothing to export!");
    return;
  }

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight =
    (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);

  pdf.save(fileName + ".pdf");
}
