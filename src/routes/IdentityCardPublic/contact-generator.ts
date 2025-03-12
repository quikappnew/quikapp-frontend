export default function downloadVCF(name: string, phoneNumber: string, email?: string): void {
  // Construct the VCF content
  let vcfContent = `BEGIN:VCARD\nVERSION:3.0\n`;
  vcfContent += `FN:${name}\n`;
  vcfContent += `TEL;TYPE=voice,cell:${phoneNumber}\n`;
  if (email) {
    vcfContent += `EMAIL:${email}\n`;
  }
  vcfContent += `END:VCARD`;

  // Create a Blob from the VCF content
  const blob = new Blob([vcfContent], { type: 'text/vcard' });

  // Create an anchor element and trigger the download
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${name}.vcf`;

  // Append the element to the body, click it, and then remove it
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
