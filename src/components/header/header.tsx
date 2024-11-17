import React, { useEffect, useRef, useState, useContext } from "react";
import Button from "components/button/button";
import Icon from "components/icon";
import Popover from "components/popover/popover";
import { UserContext, ContextType } from "contexts/userContext";
import { useCookies } from "react-cookie";
import UserService from "services/UserService";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import DataSystemNotification from "assets/json/systemNotification.json";
import { Link } from "react-router-dom";
import { INotification, INotificationItem } from "model/OtherModel";
import _ from "lodash";
import { fadeIn, fadeOut } from "utils/common";
import { useOnClickOutside } from "utils/hookCustom";
import "./header.scss";
import moment from "moment";
SwiperCore.use([Autoplay]);

export default function Header() {
  const { isCollapsedSidebar, setIsCollapsedSidebar } = useContext(UserContext) as ContextType;
  const [cookies, setCookie, removeCookie] = useCookies();
  const { name, drug_store } = useContext(UserContext) as ContextType;

  const refUser = useRef();
  const refUserContainer = useRef();
  const [showPopoverUser, setShowPopoverUser] = useState<boolean>(false);
  useOnClickOutside(refUser, () => setShowPopoverUser(false), ["user-dropdown"]);

  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);

  const handleLogout = () => {
    setIsLogoutLoading(true);
    UserService.logout().then(() => {
      removeCookie("drugStore", { path: "/" });
      removeCookie("user", { path: "/" });
      removeCookie("token", { path: "/" });
      removeCookie("checked", { path: "/" });
      setIsLogoutLoading(false);
    });
  };

  const refNotification = useRef();
  const refNotificationContainer = useRef();
  const [showPopoverNotification, setShowPopoverNotification] = useState<boolean>(false);
  useOnClickOutside(refNotification, () => setShowPopoverNotification(false), ["notification-dropdown"]);

  const [listNotification, setListNotification] = useState<INotification>({
    total: 0,
    unread: 0,
    list_noti: [],
  });

  const [detailNotification, setDetailNotification] = useState<INotificationItem>(null);
  const [showModalDetailNotification, setShowModalDetailNotification] = useState<boolean>(false);
  const [isLoadingNotification, setIsLoadingNotification] = useState<boolean>(false);
  const [paramsNotification, setParamsNotification] = useState({
    per_page: 5,
  });

  const getNotification = () => {
    setIsLoadingNotification(true);
    UserService.getNotification(paramsNotification)
      .then((res) => {
        if (res.result) {
          setIsLoadingNotification(false);
          setListNotification({ ...res.result, list_noti: [...listNotification.list_noti, ...res.result.list_noti] });
        }
      })
      .catch(() => {
        setIsLoadingNotification(false);
      });
  };

  useEffect(() => {
    getNotification();
    return () => {
      setIsLoadingNotification(false);
      setListNotification({
        total: 0,
        unread: 0,
        list_noti: [],
      });
    };
  }, [paramsNotification]);

  const readNotification = (e, item: INotificationItem) => {
    e.preventDefault();
    if (item.url) {
      const win = window.open(item.url, "_blank");
      win.focus();
    } else if (item.content) {
      setDetailNotification(item);
      setShowModalDetailNotification(true);
    }
    if (!item.is_read) {
      UserService.readNotification(item.id).then((res) => {
        if (res.RESULT === 1) {
          const listNotificationNew = _.cloneDeep(listNotification);
          listNotificationNew.unread = listNotificationNew.unread - 1;
          const indexItem = listNotificationNew.list_noti.findIndex((n) => n.id === item.id);
          if (indexItem !== -1) {
            listNotificationNew.list_noti[indexItem].is_read = true;
            setListNotification(listNotificationNew);
          }
        }
      });
    }
  };

  const showMenuMobile = () => {
    const overlay = document.querySelector(".overlay-sidebar__mobile");
    if (overlay) {
      const body = document.getElementsByTagName("body")[0];
      if (isCollapsedSidebar) {
        fadeOut(overlay);
        body.style.overflow = "";
      } else {
        fadeIn(overlay);
        body.style.overflow = "hidden";
      }
    }
    setIsCollapsedSidebar(!isCollapsedSidebar);
  };

  return (
    <div className="header d-flex justify-content-between">
      <Button type="button" color="transparent" className="d-block d-xl-none btn-menu-mobile" onClick={() => showMenuMobile()}>
        <Icon name="Bars" />
      </Button>
      <div className="notification-hot">
        <Swiper
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          direction="vertical"
          simulateTouch={false}
        >
          {DataSystemNotification.map((n, index) => (
            <SwiperSlide key={index}>
              <Link to={n.url} target={n.target}>
                {n.title}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="header-actions d-flex align-items-center">
        <div className="notification-dropdown" ref={refNotificationContainer}>
          <Button type="button" color="transparent" onClick={() => setShowPopoverNotification(!showPopoverNotification)}>
            <Icon name="Bell" />
            {listNotification.unread > 0 && <span className="count">{listNotification.unread > 99 ? "99" : listNotification.unread}</span>}
          </Button>
          {showPopoverNotification && listNotification.list_noti.length > 0 && (
            <Popover
              alignment="right"
              isTriangle={true}
              className="popover-notification-header"
              refContainer={refNotificationContainer}
              refPopover={refNotification}
            >
              <div className="notification__wrapper">
                <ul>
                  {listNotification.list_noti.map((n, index) => (
                    <li key={index} onClick={(e) => readNotification(e, n)} className={`notification-item${!n.is_read ? " unread" : ""}`}>
                      {n.type === "order" ? (
                        <div className="notification-item__icon order">
                          <Icon name="Order" />
                        </div>
                      ) : n.type === "news" ? (
                        <div className="notification-item__icon news">
                          <Icon name="News" />
                        </div>
                      ) : n.type === "promotion" ? (
                        <div className="notification-item__icon promotion">
                          <Icon name="Promotion" />
                        </div>
                      ) : (
                        <div className="notification-item__icon system">
                          <Icon name="Settings" />
                        </div>
                      )}
                      <div className="notification-item__body">
                        <h3>{n.title}</h3>
                        <time className="text-muted">{moment(n.created_at).format("H:mm | DD-MM-yyyy")}</time>
                      </div>
                    </li>
                  ))}
                </ul>
                {listNotification.list_noti.length < listNotification.total && (
                  <Button
                    type="button"
                    color="link"
                    className="btn-viewmore-noti"
                    disabled={isLoadingNotification}
                    onClick={() => setParamsNotification({ ...paramsNotification, per_page: paramsNotification.per_page + 5 })}
                  >
                    Xem thêm thông báo
                    {isLoadingNotification && <Icon name="Loading" />}
                  </Button>
                )}
              </div>
            </Popover>
          )}
        </div>
        <div className="user-dropdown" ref={refUserContainer}>
          <Button type="button" color="transparent" onClick={() => setShowPopoverUser(!showPopoverUser)}>
            <Icon name="UserCircle" /> <span className="d-none d-md-block">{name}</span>
          </Button>
          {showPopoverUser && (
            <Popover alignment="right" isTriangle={true} className="popover-user-header" refContainer={refUserContainer} refPopover={refUser}>
              <ul>
                <li>
                  <Icon name="User" />
                  <span>
                    {name} - {drug_store.name}
                  </span>
                </li>
                <li>
                  <Icon name="Phone" />
                  <span>1900.57.57.18 - 0917.777.711</span>
                </li>
                <li onClick={() => setShowPopoverUser(false)}>
                  <Icon name="Lock" />
                  <span>Đổi mật khẩu</span>
                </li>
                <li onClick={() => (!isLogoutLoading ? handleLogout() : undefined)}>
                  <Icon name="Logout" />
                  <span>Đăng xuất</span>
                  {isLogoutLoading && <Icon className="logout-loading" name="Loading" />}
                </li>
              </ul>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}
