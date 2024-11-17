import React from "react";
import IconBell from "assets/icons/icon-bell.svg";
import IconBook from "assets/icons/icon-book.svg";
import IconCalendar from "assets/icons/icon-calendar.svg";
import IconCaretDown from "assets/icons/icon-caret-down.svg";
import IconCaretLeft from "assets/icons/icon-caret-left.svg";
import IconCaretRight from "assets/icons/icon-caret-right.svg";
import IconCaretUp from "assets/icons/icon-caret-up.svg";
import IconChat from "assets/icons/icon-chat.svg";
import IconChevronDown from "assets/icons/icon-chevron-down.svg";
import IconChevronUp from "assets/icons/icon-chevron-up.svg";
import IconChevronLeft from "assets/icons/icon-chevron-left.svg";
import IconChevronRight from "assets/icons/icon-chevron-right.svg";
import IconChevronDoubleDown from "assets/icons/icon-chevron-double-down.svg";
import IconChevronDoubleUp from "assets/icons/icon-chevron-double-up.svg";
import IconChevronDoubleLeft from "assets/icons/icon-chevron-double-left.svg";
import IconChevronDoubleRight from "assets/icons/icon-chevron-double-right.svg";
import IconChecked from "assets/icons/icon-checked.svg";
import IconCheckedCircle from "assets/icons/icon-checked-circle.svg";
import IconMinus from "assets/icons/icon-minus.svg";
import IconClock from "assets/icons/icon-clock.svg";
import IconCopy from "assets/icons/icon-copy.svg";
import IconCreditCard from "assets/icons/icon-credit-card.svg";
import IconDownload from "assets/icons/icon-download.svg";
import IconDrug from "assets/icons/icon-drug.svg";
import IconFingerTouch from "assets/icons/icon-finger-touch.svg";
import IconFullscreen from "assets/icons/icon-fullscreen.svg";
import IconHome from "assets/icons/icon-home.svg";
import IconLock from "assets/icons/icon-lock.svg";
import IconLogin from "assets/icons/icon-login.svg";
import IconLogout from "assets/icons/icon-logout.svg";
import IconMail from "assets/icons/icon-mail.svg";
import IconMedicalBox from "assets/icons/icon-medical-box.svg";
import IconPaperClipboard from "assets/icons/icon-paper-clipboard.svg";
import IconPhone from "assets/icons/icon-phone.svg";
import IconPlay from "assets/icons/icon-play.svg";
import IconPlusCircle from "assets/icons/icon-plus-circle.svg";
import IconPlusCircleFill from "assets/icons/icon-plus-circle-fill.svg";
import IconReport from "assets/icons/icon-report.svg";
import IconReturns from "assets/icons/icon-returns.svg";
import IconSaleDrug from "assets/icons/icon-sale-drug.svg";
import IconSearch from "assets/icons/icon-search.svg";
import IconSettings from "assets/icons/icon-settings.svg";
import IconSortby from "assets/icons/icon-sortby.svg";
import IconTimes from "assets/icons/icon-times.svg";
import IconTimesCircle from "assets/icons/icon-times-circle.svg";
import IconUpload from "assets/icons/icon-upload.svg";
import IconUser from "assets/icons/icon-user.svg";
import IconUserAdd from "assets/icons/icon-user-add.svg";
import IconUserCircle from "assets/icons/icon-user-circle.svg";
import IconEye from "assets/icons/icon-eye.svg";
import IconEyeSlash from "assets/icons/icon-eye-slash.svg";
import IconLoading from "assets/icons/icon-loading.svg";
import IconIncrease from "assets/icons/icon-increase.svg";
import IconDecrease from "assets/icons/icon-decrease.svg";
import IconNews from "assets/icons/icon-news.svg";
import IconPromotion from "assets/icons/icon-promotion.svg";
import IconOrder from "assets/icons/icon-order.svg";
import IconBars from "assets/icons/icon-bars.svg";
import IconNoImage from "assets/icons/icon-noimage.svg";
import IconTrash from "assets/icons/icon-trash.svg";
import IconThreeDot from "assets/icons/icon-three-dot.svg";
import IconThreeDotVertical from "assets/icons/icon-three-dot-vertical.svg";
import IconPlus from "assets/icons/icon-plus.svg";
import IconPencil from "assets/icons/icon-pencil.svg";
import IconWarningCircle from "assets/icons/icon-warning-circle.svg";
import IconInfoCircle from "assets/icons/icon-info-circle.svg";
import IconStartBusiness from "assets/icons/icon-start-business.svg";
import IconStopBusiness from "assets/icons/icon-stop-business.svg";
import IconWarehouse from "assets/icons/icon-warehouse.svg";
import IconPrint from "assets/icons/icon-print.svg";
import IconLogoGDP from "assets/images/logo.svg";

const iconTypes = {
  Bell: IconBell,
  Book: IconBook,
  Calendar: IconCalendar,
  CaretDown: IconCaretDown,
  CaretLeft: IconCaretLeft,
  CaretRight: IconCaretRight,
  CaretUp: IconCaretUp,
  Chat: IconChat,
  ChevronDown: IconChevronDown,
  ChevronUp: IconChevronUp,
  ChevronLeft: IconChevronLeft,
  ChevronRight: IconChevronRight,
  ChevronDoubleDown: IconChevronDoubleDown,
  ChevronDoubleUp: IconChevronDoubleUp,
  ChevronDoubleLeft: IconChevronDoubleLeft,
  ChevronDoubleRight: IconChevronDoubleRight,
  Checked: IconChecked,
  CheckedCircle: IconCheckedCircle,
  Minus: IconMinus,
  Clock: IconClock,
  Copy: IconCopy,
  CreditCard: IconCreditCard,
  Download: IconDownload,
  Drug: IconDrug,
  FingerTouch: IconFingerTouch,
  Fullscreen: IconFullscreen,
  Home: IconHome,
  Lock: IconLock,
  Login: IconLogin,
  Logout: IconLogout,
  Mail: IconMail,
  MedicalBox: IconMedicalBox,
  PaperClipboard: IconPaperClipboard,
  Phone: IconPhone,
  Play: IconPlay,
  PlusCircle: IconPlusCircle,
  PlusCircleFill: IconPlusCircleFill,
  Report: IconReport,
  Returns: IconReturns,
  SaleDrug: IconSaleDrug,
  Search: IconSearch,
  Settings: IconSettings,
  Sortby: IconSortby,
  Times: IconTimes,
  TimesCircle: IconTimesCircle,
  Upload: IconUpload,
  User: IconUser,
  UserAdd: IconUserAdd,
  UserCircle: IconUserCircle,
  Eye: IconEye,
  EyeSlash: IconEyeSlash,
  Loading: IconLoading,
  Increase: IconIncrease,
  Decrease: IconDecrease,
  News: IconNews,
  Promtion: IconPromotion,
  Order: IconOrder,
  Bars: IconBars,
  NoImage: IconNoImage,
  Trash: IconTrash,
  ThreeDot: IconThreeDot,
  ThreeDotVertical: IconThreeDotVertical,
  Plus: IconPlus,
  Pencil: IconPencil,
  WarningCircle: IconWarningCircle,
  InfoCircle: IconInfoCircle,
  StartBusiness: IconStartBusiness,
  StopBusiness: IconStopBusiness,
  Warehouse: IconWarehouse,
  Print: IconPrint,
  LogoGDP: IconLogoGDP,
};

export default function Icon(props) {
  const Icon = iconTypes[props.name];
  if (Icon) {
    return <Icon {...props} />;
  } else {
    return null;
  }
}
