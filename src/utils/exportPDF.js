async function exportPDF() {

  const element = resultRef.current;

  // HIGH QUALITY CANVAS
  const canvas = await html2canvas(element, {
    scale: 3, // higher scale = sharper colors
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // CENTER CONTENT
  let y = (pageHeight - imgHeight) / 2;

  // IF CONTENT TOO LARGE → SCALE TO FIT ONE PAGE
  if (imgHeight > pageHeight - 20) {

    const scale = (pageHeight - 20) / imgHeight;

    const newWidth = imgWidth * scale;
    const newHeight = imgHeight * scale;

    const centerX = (pageWidth - newWidth) / 2;
    const centerY = (pageHeight - newHeight) / 2;

    pdf.addImage(imgData, "PNG", centerX, centerY, newWidth, newHeight);

  } else {

    pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);

  }

  pdf.save("CPU_Scheduling_Result.pdf");
}
