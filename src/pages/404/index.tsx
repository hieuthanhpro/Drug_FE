import React from "react";
import Image404 from "assets/images/img-404.svg";
import "./index.scss";

export default function Index() {
  document.title = "404 - Chúng tôi không tìm thấy yêu cầu của bạn";
  return (
    <div className="page-content page-404 bg-white d-flex justify-content-center align-items-center">
      <div className="content d-flex flex-column align-items-center">
        <Image404 width="318px" />
        Xin lỗi, Chúng tôi không tìm thấy yêu cầu của bạn !
      </div>
    </div>
  );
}
