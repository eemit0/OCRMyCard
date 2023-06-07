const OcrScannerMyCard = async (frame) => {
  let rightBounds = 0;
  let leftBounds = 0;
  const processed = await TextRecognition.recognize(frame);

  if (processed.blocks.length > 0 && processed.text.toLowerCase().includes("mykad")) {
    processed.blocks.forEach((block) => {
      rightBounds = block[2] > rightBounds ? block[2] : rightBounds;
      const compareBounds = block[0] < leftBounds ? block[0] : leftBounds;
      leftBounds = leftBounds === 0 ? block[0] : compareBounds;
    });
    const cleanBlocks = processed.blocks.map((block) => {
      if (block[0] < leftBounds + 100) {
        return block;
      }
      if (block[2] < rightBounds / 2) {
        return block;
      }
      return undefined;
    });

    return { blocks: cleanBlocks.filter((block) => block !== undefined), text: processed.text };
  }
};

export default OcrScannerMyCard;
