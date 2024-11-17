import React from "react";
import QRCode from "assets/images/qr-code.png";
import GoogleStore from "assets/images/google-store.png";
import AppStore from "assets/images/app-store.png";
import { DasboardBlockProps } from "model/dashboard/PropsModel";

export default function InfoBox(props: DasboardBlockProps) {
  const { classNames } = props;

  return (
    <div className={`info-box d-flex${classNames ? ` ${classNames}` : ""}`}>
      <div className="card-box info-box__item">
        <div className="title d-flex align-items-start justify-content-between">
          <h2>Liên hệ với chúng tôi</h2>
        </div>
        <div className="info-box__content">
          <strong>Tổng đài tư vấn và hỗ trợ khách hàng:</strong> 1900575718 - 0917777711
          <br />
          <br />
          <strong>Email:</strong> info@sphacy.vn
          <br />
          <br />
          Từ 8h00 – 22h00 các ngày từ thứ 2 đến Chủ nhật
        </div>
      </div>
      <div className="card-box info-box__item">
        <div className="title d-flex align-items-start justify-content-between">
          <h2>Tải ứng dụng</h2>
        </div>
        <div className="info-box__content d-flex align-items-start flex-wrap">
          <div className="description">
            Ứng dụng <strong>SPHACY GPP</strong> đã có mặt trên App Store và Google Play
          </div>
          <div className="qr-appstore">
            <img src={QRCode} alt="Mã QR code" />
            <div className="appstore d-flex flex-column">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <img src={GoogleStore} alt="Google Store" />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <img src={AppStore} alt="App Store" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
