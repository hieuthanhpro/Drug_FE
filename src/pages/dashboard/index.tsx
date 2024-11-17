import React, { Fragment, useState } from "react";
import OverView from "./partials/overview";
import Shortcut from "./partials/shortcut";
import Warehouse from "./partials/warehouse";
import EventTransaction from "./partials/eventTransaction";
import VideoHelp from "./partials/videoHelp";
import moment from "moment";
import { typeCalendar } from "model/dashboard/response/DashboardModelResponse";
import ReportRevenue from "./partials/reportRevenue";
import ReportProduct from "./partials/reportProduct";
import Button from "components/button/button";
import Icon from "components/icon";
import "./index.scss";
import { useWindowDimensions } from "utils/hookCustom";
import { Portal } from "react-overlays";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import image from "assets/images/1.jpg";
import image2 from "assets/images/2.jpg";
import image3 from "assets/images/3.jpg";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useCookies } from "react-cookie";

export default function Dashboard() {
  document.title = "Trang chủ";
  const { width } = useWindowDimensions();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [showImages, setShowImage] = useState(!cookies?.checked);
  const handleFilterDate = (type_time: string, state: any) => {
    let fromDate = state.from_date;
    let toDate = state.to_date;
    switch (type_time) {
      case typeCalendar.today:
        fromDate = moment().format("DD/MM/yyyy");
        toDate = moment().format("DD/MM/yyyy");
        break;
      case typeCalendar.yesterday:
        fromDate = moment().subtract(1, "days").format("DD/MM/yyyy");
        toDate = moment().subtract(1, "days").format("DD/MM/yyyy");
        break;
      case typeCalendar.last7Days:
        fromDate = moment().format("DD/MM/yyyy");
        toDate = moment().subtract(6, "days").format("DD/MM/yyyy");
        break;
      case typeCalendar.last30Days:
        fromDate = moment().format("DD/MM/yyyy");
        toDate = moment().subtract(29, "days").format("DD/MM/yyyy");
        break;
      case typeCalendar.last90Days:
        fromDate = moment().format("DD/MM/yyyy");
        toDate = moment().subtract(89, "days").format("DD/MM/yyyy");
        break;
    }
    return {
      ...state,
      type_time: type_time,
      to_date: toDate,
      from_date: fromDate,
    };
  };

  const [reportRevenue, setReportRevenue] = useState<any[]>([1200000, 1500000, 1800000, 1400000, 1650000, 900000, 1300000]);
  const [reportProduct, setReportProduct] = useState<any[]>([
    {
      name: "Risperidon 2",
      value: 380,
    },
    {
      name: "Bequantene",
      value: 350,
    },
    {
      name: "KEM NGHỆ TD",
      value: 220,
    },
    {
      name: "BONI SLEEP",
      value: 190,
    },
    {
      name: "Gaviscon Dual",
      value: 165,
    },
    {
      name: "VG-5",
      value: 120,
    },
    {
      name: "Didicera",
      value: 85,
    },
    {
      name: "SOFFEL",
      value: 65,
    },
    {
      name: "PM NEXTG CAL",
      value: 50,
    },
    {
      name: "Tiêu khiết thanh",
      value: 50,
    },
  ]);
  const hiddenBanner = ()=>{
    setCookie("checked", true, { path: "/"});
  }
  const constentModal = (
    <div className="constentModal">
      
      <div className={"swiperComponent"}>
      <Button type="button" className="btn-close btn-banner" color="transparent" onlyIcon={true} onClick={()=>setShowImage(false)}>
        <Icon name="Times" />
      </Button>
      <SwiperComponent
        pagination={true}
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        
        simulateTouch={true}
      >
        <SwiperSlide>
          <div className={"swiperSlide"}>
            <img src={image} alt="Slide 1" className="swiperSlideImage" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={"swiperSlide"}>
            <img src={image2} alt="Slide 1" className="swiperSlideImage" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={"swiperSlide"}>
            <img src={image3} alt="Slide 1" className="swiperSlideImage" />
          </div>
        </SwiperSlide>
      </SwiperComponent>
      <div className="input-checkbox">
      <input id="10" type="checkbox" onChange={(e)=>e && hiddenBanner()
      }/>
      <label htmlFor="10" >Không hiển thị lại quảng cáo này</label>
      </div>
      </div>

    </div>
  );
  return (
    <>
      {showImages && <Portal children={constentModal} container={document.getElementsByTagName("body")[0]} />}

      <div className="page-content page-dashboard d-flex align-items-start justify-content-between">
        <div className="page-dashboard__left">
          {width > 991 && (
            <Fragment>
              <OverView />
              <ReportRevenue data={reportRevenue} handleFilterDate={(type, state) => handleFilterDate(type, state)} />
              <ReportProduct data={reportProduct} handleFilterDate={(type, state) => handleFilterDate(type, state)} />
            </Fragment>
          )}
          {/*<InfoBox />*/}
          <div className="d-flex align-items-center justify-content-center">
            <Button type="button" color="primary" className="btn-question">
              <Icon name="Chat" /> Những câu hỏi thường gặp
            </Button>
          </div>
        </div>
        <div className="page-dashboard__right">
          <Shortcut />
          {width < 991 && (
            <Fragment>
              <OverView />
              <ReportRevenue data={reportRevenue} handleFilterDate={(type, state) => handleFilterDate(type, state)} />
              <ReportProduct data={reportProduct} handleFilterDate={(type, state) => handleFilterDate(type, state)} />
            </Fragment>
          )}
          <div className="card-box banner"></div>
          <Warehouse />
          <EventTransaction />
          {width > 767 && <VideoHelp />}
        </div>
      </div>
    </>
  );
}
