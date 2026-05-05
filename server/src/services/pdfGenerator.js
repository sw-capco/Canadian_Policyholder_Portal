function pdfEscape(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

// Minimal, deterministic PDF with embedded text. Enough for a "download proof" demo
// and for tests to verify we produce a valid PDF header and policy values.
export function generateProofPdf(policy) {
  const lines = [
    'PROOF OF INSURANCE / PREUVE D’ASSURANCE',
    `Policy / Police: ${policy.policyNumber}`,
    `Coverage / Couverture: ${policy.coverageType}`,
    `Limit / Limite: ${policy.coverageLimit} CAD`,
    `Deductible / Franchise: ${policy.deductible} CAD`,
    `Effective / Entrée en vigueur: ${policy.effectiveDate}`,
    `Expiry / Expiration: ${policy.expiryDate}`,
  ];

  const fontObjectId = 3;
  const pageObjectId = 4;
  const contentsObjectId = 5;

  const contentStream = [
    'BT',
    '/F1 12 Tf',
    '72 760 Td',
    ...lines.flatMap((l, idx) => [
      idx === 0 ? `(${pdfEscape(l)}) Tj` : `0 -18 Td (${pdfEscape(l)}) Tj`,
    ]),
    'ET',
  ].join('\n');

  const objects = [];
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${pageObjectId} 0 R] /Count 1 >>\nendobj\n`);
  objects.push(
    `${fontObjectId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
  );
  objects.push(
    `${pageObjectId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentsObjectId} 0 R >>\nendobj\n`,
  );

  const streamBytes = Buffer.from(contentStream, 'utf8');
  objects.push(
    `${contentsObjectId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  );

  let offset = 0;
  const chunks = ['%PDF-1.4\n'];
  offset += chunks[0].length;
  const xref = [0];

  for (const obj of objects) {
    xref.push(offset);
    chunks.push(obj);
    offset += Buffer.byteLength(obj, 'utf8');
  }

  const xrefStart = offset;
  const xrefLines = ['xref', `0 ${xref.length}`, '0000000000 65535 f '];
  for (let i = 1; i < xref.length; i += 1) {
    xrefLines.push(`${String(xref[i]).padStart(10, '0')} 00000 n `);
  }
  const xrefBody = `${xrefLines.join('\n')}\n`;
  chunks.push(xrefBody);

  const trailer = `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  chunks.push(trailer);

  return Buffer.from(chunks.join(''), 'utf8');
}

