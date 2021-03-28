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
import {
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Form
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';

import { IMAGE_OPTIONS, IMAGE_OPTIONS_MAPPING } from '../../../constants.jsx'

const FIRST_ITEM = 0;
const DEFAULT_BACKGROUND_VARIATION = 1;
const DEFAULT_HEADSHOT_VARIATION = 1;
const DEFAULT_HEADSHOT_SCALE = 100;
const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 50;
const MIN_IMAGE_SCALE = 25;
const MAX_IMAGE_SCALE = 200;
const MIN_IMAGE_OFFSET = -100;
const MAX_IMAGE_OFFSET = 100;
const MIN_IMAGE_CLIP = 25;
const MAX_IMAGE_CLIP = 400;
const MIN_IMAGE_BORDER_RADIUS = 0;
const MAX_IMAGE_BORDER_RADIUS = 100;

const AVAILABLE_COLORS = [
  '#ffffff',
  '#000000',
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#ecf0f1',
  '#95a5a6',
  '#2c3e50'
];

const AVAILABLE_FONTS = [
  'Fira Code',
  'FiraCode-Light'
];

const AVAILABLE_FONT_STYLES = [
  'normal',
  'bold',
  'italic'
];

const AVAILABLE_FONT_DECORATIONS = [
  '',
  'line-through',
  'underline'
];

const DEFAULT_FONT = AVAILABLE_FONTS[FIRST_ITEM];
const DEFAULT_FONT_STYLE = AVAILABLE_FONT_STYLES[FIRST_ITEM];
const DEFAULT_FONT_DECORATION = AVAILABLE_FONT_DECORATIONS[FIRST_ITEM];
const DEFAULT_STAGE_DIMENSIONS = IMAGE_OPTIONS[FIRST_ITEM]

const INITIAL_TEXT_STATE = {
  verb: {
    value: '',
    x: 10,
    y: 10,
    size: 50,
    color: '#FFF',
    font: DEFAULT_FONT,
    fontStyle: DEFAULT_FONT_STYLE,
    fontDecoration: DEFAULT_FONT_DECORATION
  },
  subject: {
    value: '',
    x: 10,
    y: 10 + 50,
    size: 50,
    color: '#FFF',
    font: DEFAULT_FONT,
    fontStyle: DEFAULT_FONT_STYLE,
    fontDecoration: DEFAULT_FONT_DECORATION
  },
  preposition: {
    value: '',
    x: 10,
    y: 10 + 50 + 50,
    size: 50,
    color: '#FFF',
    font: DEFAULT_FONT,
    fontStyle: DEFAULT_FONT_STYLE,
    fontDecoration: DEFAULT_FONT_DECORATION
  },
  object: {
    value: '',
    x: 10,
    y: 10 + 50 + 50 + 50,
    size: 50,
    color: '#FFF',
    font: DEFAULT_FONT,
    fontStyle: DEFAULT_FONT_STYLE,
    fontDecoration: DEFAULT_FONT_DECORATION
  }
}

const INITIAL_IMAGE_STATE = {
  background: {
    variation: 1
  },
  headshot: {
    variation: 1,
    scale: 100,
    xOffset: 0,
    yOffset: 50,
    clip: 200
  },
  action: {
    scale: 100,
    borderRadius: 25,
    dataUrl: null
  }
}

const clipBox = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const TextStyler = ({ key, onClickColor, onClickFont, onClickFontStyle, onClickFontDecoration }) => {
  return (
    <InputGroup>
      <InputGroup>
        {
          AVAILABLE_COLORS.map(color => {
            return <div
              className="text-styler-color-item"
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onClickColor(color)}
            >
            </div>
          })
        }
      </InputGroup>
      <InputGroup>
        {
          AVAILABLE_FONTS.map(font => {
            return <div
              className="text-styler-font-item"
              key={font}
              onClick={() => onClickFont(font)}
            >
              {font}
            </div>
          })
        }
        {
          AVAILABLE_FONT_STYLES.map(fontStyle => {
            return <div
              className="text-styler-font-style-item"
              key={fontStyle}
              onClick={() => onClickFontStyle(fontStyle)}
            >
              {fontStyle}
            </div>
          })
        }
        {
          AVAILABLE_FONT_DECORATIONS.map(fontDecoration => {
            if (fontDecoration === '') {
              return <div
                className="text-styler-font-decoration-item"
                key={'none'}
                onClick={() => onClickFontDecoration(fontDecoration)}
              >
                none
              </div>
            }
            return <div
              className="text-styler-font-decoration-item"
              key={fontDecoration}
              onClick={() => onClickFontDecoration(fontDecoration)}
            >
              {fontDecoration}
            </div>
          })
        }
      </InputGroup>
    </InputGroup>
  );
}

const BackgroundImage = ({ variation = 1 }) => {
  const [image] = useImage(`/assets/bg-${variation}.png`);
  return <Image image={image} />;
}

const HeadshotImage = ({ variation = 1, x, y, scale, xOffset, yOffset, clip }) => {
  const [image] = useImage(`/assets/headshot-${variation}.png`);
  if (image) {
    return <Group
      clipFunc={ctx => {
        ctx.arc(
          (image.width / 2) - xOffset,
          (image.height / 2) - yOffset,
          clip,
          0,
          Math.PI * 2,
          false
        );
      }}
      x={x}
      y={y}
      scaleX={scale / 100}
      scaleY={scale / 100}
      draggable
    >
      <Image image={image} />
    </Group>
  }
  return <Text text={'loading headshot...'}/>
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

const ActionImage = ({ dataUrl, x, y, scale, borderRadius }) => {
  if (dataUrl) {
    const [image] = useImage(dataUrl);


    if (image) {
      return <Group
        clipFunc={ctx => {
          clipBox(ctx, 0, 0, image.width, image.height, borderRadius);
        }}
        x={x}
        y={y}
        scaleX={scale / 100}
        scaleY={scale / 100}
        draggable
      >
        <Image image={image} />
      </Group>
    }
  }

  return <Text text={'Please paste action image'} />
}

const ImageBuilder = () => {
  const [text, setText] = useState(INITIAL_TEXT_STATE);
  const [image, setImage] = useState(INITIAL_IMAGE_STATE);
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

  const handleChangeText = ({ key, property, value }) => {
    console.log({ key, property, value });

    setText({
      ...text,
      [key]: {
        ...text[key],
        [property]: value
      }
    });
  }

  const handleChangeImage = ({ key, property, value }) => {
    setImage({
      ...image,
      [key]: {
        ...image[key],
        [property]: value
      }
    });
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
      setImage({
        ...image,
        action: {
          ...image['action'],
          dataUrl: loadEvent.target.result
        }
      });
    };

    reader.readAsDataURL(blob);
  }

  return (
    <Row className="justify-content-center">
      <Col>
        <Row className="mt-2">
          <Col xs={12} sm={12} md={3} lg={3}>
            <Form>
              <Form.Group>
                <Form.Label>Select Image Template</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleChangeSelectStageDimensions}
                  value={stageDimensions.id}
                  custom
                >
                  {
                    IMAGE_OPTIONS.map(
                      ({ id }) => <option key={id} value={id}>{id}</option>
                    )
                  }
                </Form.Control>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Verb</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. How to make ... , Making ... , Creating ... , Playing ... , etc."
                      value={text.verb.value}
                      onChange={event => handleChangeText({ key: 'verb', property: 'value', value: event.target.value})}
                    />
                    <TextStyler
                      onClickColor={color => handleChangeText({
                        key: 'verb',
                        property: 'color',
                        value: color
                      })}
                      onClickFont={font => handleChangeText({
                        key: 'verb',
                        property: 'font',
                        value: font
                      })}
                      onClickFontStyle={fontStyle => handleChangeText({
                        key: 'verb',
                        property: 'fontStyle',
                        value: fontStyle
                      })}
                      onClickFontDecoration={fontDecoration => handleChangeText({
                        key: 'verb',
                        property: 'fontDecoration',
                        value: fontDecoration
                      })}
                    />
                    <RangeSlider
                      tooltip="off"
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.verb.size}
                      onChange={event => handleChangeText({ key: 'verb', property: 'size', value: Number(event.target.value)})}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Subject</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. Melodies ... , Drum Patterns ... , VR Games ... , etc."
                      value={text.subject.value}
                      onChange={event => handleChangeText({ key: 'subject', property: 'value', value: event.target.value})}
                    />
                    <TextStyler
                      onClickColor={color => handleChangeText({
                        key: 'subject',
                        property: 'color',
                        value: color
                      })}
                      onClickFont={font => handleChangeText({
                        key: 'subject',
                        property: 'font',
                        value: font
                      })}
                      onClickFontStyle={fontStyle => handleChangeText({
                        key: 'subject',
                        property: 'fontStyle',
                        value: fontStyle
                      })}
                      onClickFontDecoration={fontDecoration => handleChangeText({
                        key: 'subject',
                        property: 'fontDecoration',
                        value: fontDecoration
                      })}
                    />
                    <RangeSlider
                      tooltip="off"
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.subject.size}
                      onChange={event => handleChangeText({ key: 'subject', property: 'size', value: Number(event.target.value)})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Preposition</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. in ... , with ... , inside of ... , etc."
                      value={text.preposition.value}
                      onChange={event => handleChangeText({ key: 'preposition', property: 'value', value: event.target.value})}
                    />
                    <TextStyler
                      onClickColor={color => handleChangeText({
                        key: 'preposition',
                        property: 'color',
                        value: color
                      })}
                      onClickFont={font => handleChangeText({
                        key: 'preposition',
                        property: 'font',
                        value: font
                      })}
                      onClickFontStyle={fontStyle => handleChangeText({
                        key: 'preposition',
                        property: 'fontStyle',
                        value: fontStyle
                      })}
                      onClickFontDecoration={fontDecoration => handleChangeText({
                        key: 'preposition',
                        property: 'fontDecoration',
                        value: fontDecoration
                      })}
                    />
                    <RangeSlider
                      tooltip="off"
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.preposition.size}
                      onChange={event => handleChangeText({ key: 'preposition', property: 'size', value: Number(event.target.value)})}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Object</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. Cubase 11 ... , Oculus Quest 2 ... , Beat Making ... , etc."
                      value={text.object.value}
                      onChange={event => handleChangeText({ key: 'object', property: 'value', value: event.target.value})}
                    />
                    <TextStyler
                      onClickColor={color => handleChangeText({
                        key: 'object',
                        property: 'color',
                        value: color
                      })}
                      onClickFont={font => handleChangeText({
                        key: 'object',
                        property: 'font',
                        value: font
                      })}
                      onClickFontStyle={fontStyle => handleChangeText({
                        key: 'object',
                        property: 'fontStyle',
                        value: fontStyle
                      })}
                      onClickFontDecoration={fontDecoration => handleChangeText({
                        key: 'object',
                        property: 'fontDecoration',
                        value: fontDecoration
                      })}
                    />
                    <RangeSlider
                      tooltip="off"
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.object.size}
                      onChange={event => handleChangeText({ key: 'object', property: 'size', value: Number(event.target.value)})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>Adjust Headshot</Form.Label>
                <Form.Group as={Row}>
                  <Form.Label column sm="4" className="text-muted">
                    Scale
                  </Form.Label>
                  <Col sm="8">
                    <RangeSlider
                      tooltip="off"
                      min={MIN_IMAGE_SCALE}
                      max={MAX_IMAGE_SCALE}
                      value={image.headshot.scale}
                      onChange={event => handleChangeImage({ key: 'headshot', property: 'scale', value: Number(event.target.value)})}
                    />
                  </Col>
                  <Form.Label column sm="4" className="text-muted">
                    xOffset
                  </Form.Label>
                  <Col sm="8">
                    <RangeSlider
                      tooltip="off"
                      min={MIN_IMAGE_OFFSET}
                      max={MAX_IMAGE_OFFSET}
                      value={image.headshot.xOffset}
                      onChange={event => handleChangeImage({ key: 'headshot', property: 'xOffset', value: Number(event.target.value)})}
                    />
                  </Col>
                  <Form.Label column sm="4" className="text-muted">
                    yOffset
                  </Form.Label>
                  <Col sm="8">
                    <RangeSlider
                      tooltip="off"
                      min={MIN_IMAGE_OFFSET}
                      max={MAX_IMAGE_OFFSET}
                      value={image.headshot.yOffset}
                      onChange={event => handleChangeImage({ key: 'headshot', property: 'yOffset', value: Number(event.target.value)})}
                    />
                  </Col>
                  <Form.Label column sm="4" className="text-muted">
                    clip
                  </Form.Label>
                  <Col sm="8">
                    <RangeSlider
                      tooltip="off"
                      min={MIN_IMAGE_CLIP}
                      max={MAX_IMAGE_CLIP}
                      value={image.headshot.clip}
                      onChange={event => handleChangeImage({ key: 'headshot', property: 'clip', value: Number(event.target.value)})}
                    />
                  </Col>
                </Form.Group>
              </Form.Group>

              <Form.Group>
                <Form.Label>Adjust Action Image</Form.Label>
                <Form.Group as={Row}>
                  <Form.Label column sm="4" className="text-muted">
                    Scale
                  </Form.Label>
                  <Col sm="8">
                    <RangeSlider
                      tooltip="off"
                      min={MIN_IMAGE_SCALE}
                      max={MAX_IMAGE_SCALE}
                      value={image.action.scale}
                      onChange={event => handleChangeImage({ key: 'action', property: 'scale', value: Number(event.target.value)})}
                    />
                  </Col>
                  <Form.Label column sm="4" className="text-muted">
                    borderRadius
                  </Form.Label>
                  <Col sm="8">
                    <RangeSlider
                      tooltip="off"
                      min={MIN_IMAGE_BORDER_RADIUS}
                      max={MAX_IMAGE_BORDER_RADIUS}
                      value={image.action.borderRadius}
                      onChange={event => handleChangeImage({ key: 'action', property: 'borderRadius', value: Number(event.target.value)})}
                    />
                  </Col>
                </Form.Group>
              </Form.Group>

              <Form.Group>
                <Form.Label>Adjust Action Image</Form.Label>
                <Form.Control as="input" placeholder="Paste Action Image Here" onPaste={handlePasteImage}/>
              </Form.Group>
            </Form>

            <Button onClick={handleClickDownloadImage} variant="secondary" size="lg" block>
              Download Image
            </Button>
          </Col>
          <Col xs={12} sm={12} md={9} lg={9}>
            <Stage className="mt-4 mb-4 konva-container" width={stageDimensions.width} height={stageDimensions.height} ref={stage}>
              <Layer>
                <BackgroundImage variation={image.background.variation} />
                <LogoImage stageWidth={stageDimensions.width} />
                <ActionImage
                  scale={image.action.scale}
                  borderRadius={image.action.borderRadius}
                  dataUrl={image.action.dataUrl}
                />
                <HeadshotImage
                  variation={image.headshot.variation}
                  scale={image.headshot.scale}
                  xOffset={image.headshot.xOffset}
                  yOffset={image.headshot.yOffset}
                  clip={image.headshot.clip}
                />
                <Text
                  x={text.verb.x}
                  y={text.verb.y}
                  text={text.verb.value}
                  fontSize={text.verb.size}
                  fontFamily={text.verb.font}
                  fontStyle={text.verb.fontStyle}
                  textDecoration={text.verb.fontDecoration}
                  fill={text.verb.color}
                  draggable
                />
                <Text
                  x={text.subject.x}
                  y={text.subject.y}
                  text={text.subject.value}
                  fontSize={text.subject.size}
                  fontFamily={text.subject.font}
                  fontStyle={text.subject.fontStyle}
                  textDecoration={text.subject.fontDecoration}
                  fill={text.subject.color}
                  draggable
                />
                <Text
                  x={text.preposition.x}
                  y={text.preposition.y}
                  text={text.preposition.value}
                  fontSize={text.preposition.size}
                  fontFamily={text.preposition.font}
                  fontStyle={text.preposition.fontStyle}
                  textDecoration={text.preposition.fontDecoration}
                  fill={text.preposition.color}
                  draggable
                />
                <Text
                  x={text.object.x}
                  y={text.object.y}
                  text={text.object.value}
                  fontSize={text.object.size}
                  fontFamily={text.object.font}
                  fontStyle={text.object.fontStyle}
                  textDecoration={text.object.fontDecoration}
                  fill={text.object.color}
                  draggable
                />
              </Layer>
            </Stage>
          </Col>
        </Row>
      </Col>
    </Row>
  )
};

export default ImageBuilder;