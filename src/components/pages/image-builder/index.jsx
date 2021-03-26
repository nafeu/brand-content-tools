import React, { useState, useRef } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Image
} from 'react-konva';
import useImage from 'use-image';

import { IMAGE_OPTIONS, IMAGE_OPTIONS_MAPPING } from '../../../constants.jsx'

const FIRST_ITEM = 0;
const DEFAULT_FONT_SIZE = 20;
const MAX_FONT_SIZE = 50;
const MIN_FONT_SIZE = 8;

const DEFAULT_BACKGROUND_POSITION = {
  isDragging: false,
  x: 0,
  y: 0
}

const DEFAULT_LOGO_POSITION = {
  isDragging: false,
  x: 0,
  y: 0
}

const DEFAULT_STAGE_DIMENSIONS = IMAGE_OPTIONS[FIRST_ITEM]

const BackgroundImage = imageProps => {
  const [image] = useImage('/assets/bg-1.jpg');
  return <Image image={image} {...imageProps} />;
}

const LogoImage = imageProps => {
  const [image] = useImage('/assets/logo-2.png');
  return <Image image={image} {...imageProps} />;
}

const ImageBuilder = () => {
  const [imageText, setImageText] = useState('');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [backgroundPosition, setBackgroundPosition] = useState(DEFAULT_BACKGROUND_POSITION);
  const [logoPosition, setLogoPosition] = useState(DEFAULT_LOGO_POSITION);
  const [stageDimensions, setStageDimensions] = useState(DEFAULT_STAGE_DIMENSIONS);

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

  const handleDragStartLogo = () => {
    setLogoPosition({
      ...logoPosition,
      isDragging: true
    })
  }

  const handleDragEndLogo = event => {
    setLogoPosition({
      isDragging: false,
      x: event.target.x(),
      y: event.target.y()
    })
  }

  const handleDragStartBackground = () => {
    setBackgroundPosition({
      ...logoPosition,
      isDragging: true
    })
  }

  const handleDragEndBackground = event => {
    setBackgroundPosition({
      isDragging: false,
      x: event.target.x(),
      y: event.target.y()
    })
  }

  const handleChangeSelectStageDimensions = event => {
    console.log({ IMAGE_OPTIONS_MAPPING });

    setStageDimensions(IMAGE_OPTIONS_MAPPING[event.target.value]);
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
          <BackgroundImage
            draggable
            x={backgroundPosition.x}
            y={backgroundPosition.y}
            onDragStart={handleDragStartBackground}
            onDragEnd={handleDragEndBackground}
          />
          <LogoImage
            draggable
            x={logoPosition.x}
            y={logoPosition.y}
            onDragStart={handleDragStartLogo}
            onDragEnd={handleDragEndLogo}
          />
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