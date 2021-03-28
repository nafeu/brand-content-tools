import React, { useState, useRef } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Image,
  Group
} from 'react-konva';
import useImage from 'use-image';

import { IMAGE_OPTIONS, IMAGE_OPTIONS_MAPPING } from '../../../constants.jsx'

const FIRST_ITEM = 0;
const DEFAULT_FONT_SIZE = 20;
const MAX_FONT_SIZE = 50;
const MIN_FONT_SIZE = 8;

const DEFAULT_STAGE_DIMENSIONS = IMAGE_OPTIONS[FIRST_ITEM]

const BackgroundImage = ({ variation = 1}) => {
  const [image] = useImage(`/assets/bg-${variation}.png`);
  return <Image image={image} />;
}

const LogoImage = ({ stageWidth }) => {
  const [image] = useImage('/assets/logo-2.png');

  const padding = 10;
  const scaleX = 0.25;
  const scaleY = 0.25;
  const x = image ? stageWidth - (image.width * scaleX) - padding : 0;
  const y = padding;

  return <Image
    scaleX={scaleX}
    scaleY={scaleY}
    x={x}
    y={y}
    image={image}
  />;
}

const ActionImage = ({ dataUrl }) => {
  if (dataUrl) {
    const [image] = useImage(dataUrl);

    return <Image image={image} />;
  }

  return <Text text={'Please paste action image'} />
}

const ImageBuilder = () => {
  const [imageText, setImageText] = useState('');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [stageDimensions, setStageDimensions] = useState(DEFAULT_STAGE_DIMENSIONS);
  const [actionImageDataUrl, setActionImageDataUrl] = useState(null);

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
    setFontSize(Number(event.target.value));
  }

  const handleClickDownloadImage = () => {
    const dataURL = stage.current.toDataURL({ pixelRatio: 1 });
    downloadURI(dataURL, `${stageDimensions.id} - ${new Date().toDateString()}`);
  }

  const handleChangeSelectStageDimensions = event => {
    setStageDimensions(IMAGE_OPTIONS_MAPPING[event.target.value]);
  }

  const handlePasteImage = pasteEvent => {
    const items = pasteEvent.clipboardData.items;

    const blob = items[0].getAsFile();
    const reader = new FileReader();

    reader.onload = loadEvent => {
      setActionImageDataUrl(loadEvent.target.result)
    };

    reader.readAsDataURL(blob);
  }

  return (
    <div className="page-image-builder">
      <textarea value={imageText} onChange={handleChangeImageText} placeholder="Enter text"/>
      <input
        type="range"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        value={fontSize}
        onChange={handleChangeFontSize}
      />
      <input
        placeholder="Paste image here"
        onPaste={handlePasteImage}
      />
      <select value={stageDimensions.id} onChange={handleChangeSelectStageDimensions}>
        {
          IMAGE_OPTIONS.map(
            ({ id }) => <option value={id}>{id}</option>
          )
        }
      </select>
      <button onClick={handleClickDownloadImage}>Download Image</button>
      <Stage width={stageDimensions.width} height={stageDimensions.height} ref={stage}>
        <Layer>
          <BackgroundImage />
          <LogoImage stageWidth={stageDimensions.width} />
          <ActionImage dataUrl={actionImageDataUrl} />
          <Text
            x={10}
            y={10}
            text={imageText}
            fontSize={fontSize}
            fontFamily={'Fira Code'}
            fill={'white'}
          />
        </Layer>
      </Stage>
    </div>
  )
};

export default ImageBuilder;