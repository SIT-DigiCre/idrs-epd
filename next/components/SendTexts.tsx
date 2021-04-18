import React, { useState, useEffect } from "react";
import { Form, Button, Col, Card } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../common";

const SendTexts = () => {
  const [receivedImage, setReceivedImage] = useState("");
  const [images, setImages] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [texts, setTexts] = useState([]);
  const send = () => {
    const data = {};
    data["image"] = selectedImage;
    if (0 < texts.length) {
      data["texts"] = texts;
    }
    axios
      .post(API_BASE_URL + "/update", data)
      .then((response) => {
        console.log(response);
        setReceivedImage(response.data.image);
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          alert(error.response.data.message);
        }
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };
  const onImageSelectChange = (e) => {
    setSelectedImage(e.target.value);
  };

  const addText = () => {
    const t = texts.concat();
    t.push({ x: 0, y: 0, size: 18, font: fonts[0], text: "" });
    setTexts(t);
  };
  const deleteText = (index) => {
    const t = texts.concat();
    setTexts(texts.filter((text, i) => index !== i));
  };
  const onXChange = (e, index) => {
    const t = texts.concat();
    t[index].x = e.target.value;
    setTexts(t);
  };
  const onYChange = (e, index) => {
    const t = texts.concat();
    t[index].y = e.target.value;
    setTexts(t);
  };
  const onSizeChange = (e, index) => {
    const t = texts.concat();
    t[index].size = e.target.value;
    setTexts(t);
  };
  const onFontChange = (e, index) => {
    const t = texts.concat();
    t[index].font = e.target.value;
    setTexts(t);
  };
  const onTextChange = (e, index) => {
    const t = texts.concat();
    t[index].text = e.target.value;
    setTexts(t);
  };

  useEffect(() => {
    axios
      .get(API_BASE_URL + "/image")
      .then((response) => {
        setImages(response.data.data);
        setSelectedImage(response.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          alert(error.response.data.message);
        }
      });
    axios
      .get(API_BASE_URL + "/font")
      .then((response) => {
        setFonts(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          alert(error.response.data.message);
        }
      });
    axios
      .get(API_BASE_URL + "/state")
      .then((response) => {
        setSelectedImage(response.data.data.image);
        setTexts(response.data.data.texts);
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          alert(error.response.data.message);
        }
      });
  }, []);
  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Image</Form.Label>
          <Form.Control
            as="select"
            value={selectedImage}
            onChange={onImageSelectChange}
          >
            {images.map((image) => (
              <option key={image}>{image}</option>
            ))}
          </Form.Control>
        </Form.Group>
        {texts.map((text, index) => (
          <Card key={index}>
            <Card.Header>Text {index}</Card.Header>
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>x</Form.Label>
                  <Form.Control
                    type="number"
                    value={text.x}
                    onChange={(e) => onXChange(e, index)}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>y</Form.Label>
                  <Form.Control
                    type="number"
                    value={text.y}
                    onChange={(e) => onYChange(e, index)}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>size</Form.Label>
                  <Form.Control
                    type="number"
                    value={text.size}
                    onChange={(e) => onSizeChange(e, index)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Form.Label>Font</Form.Label>
                <Form.Control
                  as="select"
                  value={text.font}
                  onChange={(e) => onFontChange(e, index)}
                >
                  {fonts.map((font) => (
                    <option key={font}>{font}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control
                  value={text.text}
                  onChange={(e) => onTextChange(e, index)}
                />
              </Form.Group>
              <Form.Group>
                <Button
                  variant="danger"
                  onClick={() => {
                    deleteText(index);
                  }}
                >
                  Delete
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}
        <Form.Group>
          <Button variant="primary" onClick={addText}>
            Add Text
          </Button>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <div>
        <h2>Result</h2>
        <img src={"data:image/png;base64," + receivedImage} />
      </div>
    </>
  );
};

export default SendTexts;