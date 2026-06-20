const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const findEndOfCentralDirectory = (buffer) => {
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }
  return -1;
};

const readZipEntries = (buffer) => {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  if (eocdOffset === -1) return [];

  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
  const entries = [];
  let cursor = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) break;

    const compression = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const fileNameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localHeaderOffset = buffer.readUInt32LE(cursor + 42);
    const fileName = buffer
      .slice(cursor + 46, cursor + 46 + fileNameLength)
      .toString("utf8");

    entries.push({
      fileName,
      compression,
      compressedSize,
      localHeaderOffset,
    });

    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
};

const getZipEntryText = (buffer, targetName) => {
  const entry = readZipEntries(buffer).find((item) => item.fileName === targetName);
  if (!entry) return "";
  if (buffer.readUInt32LE(entry.localHeaderOffset) !== 0x04034b50) return "";

  const fileNameLength = buffer.readUInt16LE(entry.localHeaderOffset + 26);
  const extraLength = buffer.readUInt16LE(entry.localHeaderOffset + 28);
  const dataStart = entry.localHeaderOffset + 30 + fileNameLength + extraLength;
  const compressed = buffer.slice(dataStart, dataStart + entry.compressedSize);

  if (entry.compression === 0) {
    return compressed.toString("utf8");
  }

  if (entry.compression === 8) {
    return zlib.inflateRawSync(compressed).toString("utf8");
  }

  return "";
};

const decodeXmlText = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const extractDocxText = (dataBuffer) => {
  const documentXml = getZipEntryText(dataBuffer, "word/document.xml");
  if (!documentXml) return "";

  return [...documentXml.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)]
    .map((match) => decodeXmlText(match[1]))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};

const extractResumeText = async (
  filePath
) => {
  const dataBuffer =
    fs.readFileSync(filePath);

  if (path.extname(filePath).toLowerCase() === ".docx") {
    return extractDocxText(dataBuffer);
  }

  const data =
    await pdfParse(dataBuffer);

  return data.text;
};

module.exports =
  extractResumeText;
