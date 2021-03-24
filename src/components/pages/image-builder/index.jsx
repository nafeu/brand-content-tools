import React, { useState, useRef } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text
} from 'react-konva';

const DEFAULT_FONT_SIZE = 20;
const MAX_FONT_SIZE = 50;
const MIN_FONT_SIZE = 8;

const ImageBuilder = () => {
  const [imageText, setImageText] = useState('');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const stage = useRef();

  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangeImageText = event => {
    setImageText(event.target.value);
  }

  const handleChangeFontSize = event => {
    setFontSize(event.target.value);
  }

  const handleClickDownloadImage = () => {
    const dataURL = stage.current.toDataURL({ pixelRatio: 3 });
    downloadURI(dataURL, 'stage.png');
  }

  return (
    <div className="page-image-builder">
      <input value={imageText} onChange={handleChangeImageText} placeholder="Enter text"/>
      <input
        type="range"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        value={fontSize}
        onChange={handleChangeFontSize}
      />
      <button onClick={handleClickDownloadImage}>Download Image</button>
      <Stage width={500} height={500} ref={stage}>
        <Layer>
          <Rect width={50} height={50} fill="red" />
          <Text
            x={10}
            y={10}
            text={imageText}
            fontSize={fontSize}
            fontFamily={'Calibri'}
            fill={'green'}
          />
          <Circle x={200} y={200} stroke="black" radius={50} />
        </Layer>
      </Stage>
    </div>
  )
};

export default ImageBuilder;
