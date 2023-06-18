import React, { useState } from "react";
import styled from "styled-components";

//component
import { InputBox } from "../../components/common/Input";
import Textarea from "./Textarea";
import Button from "./Button";

// 이미지
import PlusIcon from "../../assets/icon_plus_gray.svg";
import AddIcon from "../../assets/add_button_gray.svg";

// API
import UploadImage from "../../api/UploadImage";

export default function PostUI({
  src,
  subtext,
  buttonText,
  showInput,
  textareaHeight,
  getPostProductData,
}) {
  const [description, setDescription] = useState("");
  const [imageWrap, setImageWrap] = useState([]);
  const [productData, setProductData] = useState({
    product: {
      itemName: "",
      price: "", //1원 이상
      link: "",
      itemImage: "",
    },
  });
  const BASE_URL = "https://api.mandarin.weniv.co.kr/";

  // 상품설명 글자수 제한
  const handleTextCount = (e) => {
    const textSlice = e.target.value;
    setDescription(textSlice.slice(0, 100));
  };

  //! 해결해야하는 오류(이미지 교체하면 해당 인덱스로 교체, 해당 타겟 이미지 교체)
  //* 각 input에 name 값을 줘서 해당 인덱스 값이 넘어오게 하려고 하는데 잘 안됨
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (e.target.type === "file") {
      const file = e.target.files[0];
      const imgSrc = await UploadImage(file);

      const newImage = [...imageWrap, imgSrc];
      setImageWrap(newImage);

      setProductData((prevState) => ({
        ...prevState,
        product: {
          ...prevState.product,
          itemImage:
            prevState.product.itemImage +
            (prevState.product.itemImage ? "," : "") +
            imgSrc,
        },
      }));
    } else {
      setProductData((prevState) => ({
        ...prevState,
        product: {
          ...prevState.product,
          [name]: name === "price" ? parseInt(value) : value,
        },
      }));
    }

    if (name === "link") {
      handleTextCount(e);
    }
  };

  const joinData = (e) => {
    e.preventDefault();
    getPostProductData(productData);
  };

  return (
    <PostUiWrap>
      <h2 className="a11y-hidden">상품 업로드 페이지</h2>
      <img src={src} alt="product Upload" />
      <p>{subtext}</p>

      <UploadWrap>
        <ImagUploadWrap>
          <ThumbnailWrap>
            <input
              id="thumbnail"
              type="file"
              name="0"
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
            <Thumbnail htmlFor="thumbnail">
              <ThumbnailLabel>
                <p>대표 이미지</p>
              </ThumbnailLabel>
              <img
                src={imageWrap[0] ? BASE_URL + imageWrap[0] : PlusIcon}
                style={imageWrap[0] ? null : { width: "90px" }}
              />
            </Thumbnail>
          </ThumbnailWrap>

          <ProductImages>
            <input
              id="productImageOne"
              type="file"
              name="1"
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
            <ProductImage htmlFor="productImageOne">
              <img
                src={imageWrap[1] ? BASE_URL + imageWrap[1] : AddIcon}
                style={imageWrap[1] ? null : { width: "32px" }}
              />
            </ProductImage>
            <ProductImage htmlFor="productImageTwo">
              <img
                src={imageWrap[2] ? BASE_URL + imageWrap[2] : AddIcon}
                style={imageWrap[2] ? null : { width: "32px" }}
              />
            </ProductImage>

            <input
              id="productImageTwo"
              type="file"
              name="2"
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
          </ProductImages>
        </ImagUploadWrap>

        <Line />

        <ContentUploadWrap>
          {showInput && (
            <>
              <InputDiv>
                <Label>상품명</Label>
                <InputBox
                  width="100%"
                  height="48px"
                  name="itemName"
                  placeholder="상품명을 입력해주세요"
                  type="text"
                  onChange={handleInputChange}
                  value={productData.product.itemName}
                />
              </InputDiv>

              {/* 숫자만 입력, 1 원 이상 100만원 이하 , 숫자 세개마다 콤마 */}
              <InputDiv>
                <Label>상품가격</Label>
                <InputBox
                  width="100%"
                  height="48px"
                  type="number"
                  placeholder="상품가격을 입력해주세요"
                  name="price"
                  value={productData.product.price}
                  onChange={handleInputChange}
                />
              </InputDiv>
            </>
          )}

          <InputDiv>
            <Label>상품설명</Label>
            <Textarea
              width="100%"
              height={textareaHeight}
              placeholder="상품에 대한 설명을 입력해주세요"
              textCount={description}
              value={description}
              onChange={handleInputChange}
              name="link"
            />
          </InputDiv>

          <Button
            type="submit"
            height="56px"
            text={buttonText}
            br="4px"
            onClick={joinData}
          />
        </ContentUploadWrap>
      </UploadWrap>
    </PostUiWrap>
  );
}

const PostUiWrap = styled.article`
  width: 80%;
  padding: 40px 60px 60px 60px;
  box-sizing: border-box;
  margin: 0 auto;
  border-radius: 8px;
  border: 1px solid var(--gray200-color);
  background-color: #ffffff;

  & > img {
    width: 400px;
  }
  & > p {
    color: var(--gray400-color);
    font-size: 16px;
    margin-top: 4px;
  }
`;

const UploadWrap = styled.form`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;

const ImagUploadWrap = styled.div`
  flex-grow: 1;
  flex-basis: 400px;
  display: flex;
  gap: 5%;
`;

const ContentUploadWrap = styled.div`
  flex-grow: 1;
  button {
    margin-top: 48px;
  }
`;

const Line = styled.span`
  width: 1px;
  display: inline-block;
  background-color: var(--gray200-color);
  margin: 0 40px;
`;

const ThumbnailWrap = styled.div`
  width: 70%;
`;

const ProductImages = styled.div`
  width: 25%;
`;

const Thumbnail = styled.label`
  cursor: pointer;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 1px solid var(--gray200-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: var(--gray100-color);
    transition: all 0.3s;
  }

  img {
    width: 100%;
    aspect-ratio: 1/ 1;
    object-fit: cover;
  }
`;

const ThumbnailLabel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 12px;
  background-color: var(--black-color);
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 30px;
    background-color: var(--main-color);
  }

  p {
    color: white;
    font-size: 14px;
    margin: 0;
  }
`;

const ProductImage = styled.label`
  cursor: pointer;
  display: block;
  width: 100%;
  aspect-ratio: 1 /1;
  background-color: var(--gray100-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    background-color: var(--gray200-color);
    transition: all 0.3s;
  }

  & + & {
    margin-top: 20px;
  }

  img {
    width: 100%;
    aspect-ratio: 1 /1;
    object-fit: cover;
  }
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;

  & + & {
    margin-top: 24px;
  }
`;

const Label = styled.label`
  font-family: var(--font--Bold);
  margin-bottom: 8px;
`;