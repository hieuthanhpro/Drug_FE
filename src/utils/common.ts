import { toast } from "react-toastify";
import { roleGDP, roleGPP } from "permissions/role";
import { IUserLogin } from "model/user/response/UserResponseModel";
import { isArray, isObject, transform } from "lodash";

/**
 * Loại bỏ html
 * @param {*} str
 * @returns string
 */
const stripHtml = (str: string) => {
  return str.replace(/(<([^>]+)>)/gi, "");
};

/**
 * Trim text theo só ký tự thêm dấu 3 chám
 * @param {string} str
 * @param {number} maxLength
 * @param {boolean} isHtml
 * @param {boolean} ellipsis
 * @returns {string}
 */
export const trimContent = (str, maxLength = 20, isHtml = false, ellipsis = false) => {
  if (isHtml) {
    str = stripHtml(str);
  }
  let ellipsisText = "";
  if (ellipsis) {
    ellipsisText = str.length > maxLength ? "..." : "";
  }
  return str.slice(0, maxLength) + ellipsisText;
};

/**
 * Trim text theo số từ thêm dấu 3 chám
 * @param {string} str
 * @param {number} maxLength
 * @param {boolean} isHtml
 * @param {boolean} ellipsis
 * @returns {string}
 */
export const trimContentByWord = (str, maxLength = 20, isHtml = false, ellipsis = false) => {
  if (isHtml) {
    str = str.replace(/(<([^>]+)>)/gi, "");
  }
  const array = str.trim().split(" ");
  let ellipsisText = "";
  if (ellipsis) {
    ellipsisText = array.length > maxLength ? "..." : "";
  }
  return array.slice(0, maxLength).join(" ") + ellipsisText;
};

/**
 * Xóa dấu
 * @param {string} str
 * @returns {string}
 */
export const removeAccents = (str: string) => {
  const AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (let i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    const char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
};

/**
 * Xóa các dấu space thừa
 * @param {*} str
 * @returns {string}
 */
export const ignoreSpaces = (str: string) => {
  return str.trim().replace(/\s+/g, " ");
};

/**
 * Format tiền tệ
 * @param {*} num
 * @param {*} separate
 * @param {*} suffixes
 * @returns {string|number}
 */
export const formatCurrency = (num, separate = ",", suffixes = "đ", positionSuffixes = "right") => {
  if (num) {
    const s = parseInt(num).toString();
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    return positionSuffixes === "right" ? s.replace(regex, separate) + suffixes : suffixes + s.replace(regex, separate);
  } else {
    return positionSuffixes === "right" ? 0 + suffixes : suffixes + 0;
  }
};

/**
 * Lấy về offsetHeight
 * @param {HTMLElement} item
 * @returns {number}
 */
export const getOffsetHeight = (item: HTMLElement) => {
  if (!item) {
    return 0;
  }

  return item.offsetHeight ? item.offsetHeight : 0;
};

/**
 * Lấy về offsetTop của một item
 * @param {HTMLElement} item
 * @returns {number}
 */
export const getOffsetTop = (item: HTMLElement) => {
  let offsetTop = 0;
  do {
    if (!isNaN(item.offsetTop)) {
      offsetTop += item.offsetTop;
    }
  } while ((item = item.offsetParent as HTMLElement));
  return offsetTop;
};

/**
 * Scroll to vị trí
 * @param {number} to
 * @param {number} duration
 * @param {Element} elem
 */
export const scrollTo = (to = 0, duration = 200, elem = null) => {
  const element = elem || document.scrollingElement || document.documentElement,
    start = element.scrollTop,
    change = to - start,
    startDate = +new Date(),
    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },
    animateScroll = function () {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    };
  animateScroll();
};

/**
 * Lấy cookie
 * @param {string|number} name
 * @return {string|null}
 */
export const getCookie = (name: string | number) => {
  for (let t, r = name + "=", u = document.cookie.split(";"), i = 0; i < u.length; i++) {
    for (t = u[i]; t.charAt(0) == " "; ) t = t.substring(1);
    if (t.indexOf(r) == 0) return t.substring(r.length, t.length);
  }
  return null;
};

/**
 * Tạo string từ param
 * @param {object} params
 * @return {string}
 */
export const convertParamsToString = (params) => {
  if (params && Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    return `?${query}`;
  }
  return "";
};

/**
 * Tạo thông báo
 * @param {string} mgs
 * @param {string} type
 */
export const showToast = (mgs: string, type: "error" | "success" | "warning") => {
  toast[type](mgs, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * Tạo hiệu ứng FadeIn element
 * @param {HTMLElement} element
 */
export const fadeIn = (element) => {
  element.style.display = "block";
  element.style.opacity = 0;
  (function fade() {
    let val = parseFloat(element.style.opacity);
    const proceed = (val += 0.07678) > 1 ? false : true;
    if (val + 0.07678 > 1) {
      element.style.opacity = 1;
    }
    if (proceed) {
      element.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};

/**
 * Tạo hiệu ứng FadeOut element
 * @param {HTMLElement} element
 */
export const fadeOut = (element) => {
  element.style.opacity = 1;
  (function fade() {
    let val = parseFloat(element.style.opacity);
    const proceed = (val -= 0.07678) < 0 ? false : true;
    if (val - 0.07678 <= 0) {
      element.style.display = "none";
      element.style.opacity = 0;
    }
    if (proceed) {
      element.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};

/**
 * Handleize chuỗi string
 * @param {string} str
 * @returns {string}
 */
export const handleize = (str: string) => {
  str = str.toLowerCase();
  const toReplace = ['"', "'", "\\", "(", ")", "[", "]"];
  for (let i = 0; i < toReplace.length; ++i) {
    str = str.replace(toReplace[i], "");
  }
  str = str.replace(/\W+/g, "-");
  if (str.charAt(str.length - 1) === "-") {
    str = str.replace(/-+\z/, "");
  }
  if (str.charAt(0) === "-") {
    str = str.replace(/\A-+/, "");
  }
  return str;
};

/**
 * Lấy element parent bởi class
 * @param {any} elem
 * @param {string} cls
 * @returns {HTMLElement}
 */
export const getParentByClassName = (elem: any, cls: string) => {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.classList.contains(cls)) {
      return elem;
    }
  }
};

/**
 * Xử lý get params
 * @param {string} prmstr
 * @return {object} params
 */
const transformToAssocArray = (prmstr: string) => {
  const params = {};
  const prmarr = prmstr.split("&");
  for (let i = 0; i < prmarr.length; i++) {
    const tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
  }
  return params;
};

/**
 * Lấy search parameter
 * @return {object} params
 */
export const getSearchParameters = () => {
  const prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
};

/**
 * Lấy permission theo role
 * @param {IUserLogin} user
 * @returns {array} resources
 */
export const getPermissions = (user: IUserLogin) => {
  const roles = process.env.APP_TYPE === "GDP" ? roleGDP : roleGPP;
  const resources = (roles[user.role]?.resources || []).filter((re) => !roles[user.role].excludes?.includes(re));
  return resources;
};

/**
 * Kiểm tra 2 object có khác nhau hay ko?
 * @param {*} orgObj
 * @param {*} newObj
 * @returns {}
 */
export const differenceObj = (orgObj, newObj) => {
  function changes(newObj, orgObj): Record<string, any> {
    let arrayIndexCounter = 0;
    return transform(newObj, function (result, value, key: string) {
      if (value != orgObj[key]) {
        const resultKey = isArray(orgObj) ? arrayIndexCounter++ : key;
        result[resultKey] = isObject(value) && isObject(orgObj[key]) ? changes(value, orgObj[key]) : value;
      }
    });
  }
  function changesReverse(orgObj, newObj): Record<string, any> {
    let arrayIndexCounter = 0;
    return transform(orgObj, function (result, value, key: string) {
      if (value != newObj[key]) {
        const resultKey = isArray(newObj) ? arrayIndexCounter++ : key;
        result[resultKey] = isObject(value) && isObject(newObj[key]) ? changesReverse(value, newObj[key]) : value;
      }
    });
  }
  if (!newObj && !orgObj) {
    return {};
  }
  if (!newObj) {
    return orgObj;
  }
  if (!orgObj) {
    return newObj;
  }
  return { ...changes(newObj, orgObj), ...changesReverse(orgObj, newObj) };
};

/**
 * Kiểm tra 2 object có khác biệt nhau ko?
 * @param {*} orgObj
 * @param {*} newObj
 * @returns {boolean}
 */
export const isDifferenceObj = (orgObj, newObj) => {
  return Object.keys(differenceObj(orgObj, newObj)).length > 0;
};

/**
 * Filter object
 * @param {*} orgObj
 * @param {*} keyFilter
 * @param {*} includes
 * @returns {boolean}
 */
export const filterObj = (orgObj, keyFilter: string, includes?: "yes" | "no") => {
  return Object.keys(orgObj)
    .filter((key) => (includes && includes === "no" ? !key.includes(keyFilter) : key.includes(keyFilter)))
    .reduce((obj, key) => {
      obj[key] = orgObj[key];
      return obj;
    }, {});
};

/**
 * Đổi string sang kiểu tên file
 * @param {string} str
 * @returns {string}
 */
export const convertToFileName = (str: string) => {
  return removeAccents(str?.replace(/ [a-z]/g, (a) => a.toUpperCase()).replace(/[ \r\t\n]/g, ""));
};

/**
 * Đổi string sang kiểu Id html
 * @param {string} str
 * @returns {string}
 */
export const convertToId = (str: string) => {
  return removeAccents(
    str
      ?.replace(/[-_()[\]{}]/g, " ")
      .replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())
      .replace(/[ \r\t\n]/g, "")
  );
};

/**
 * Lấy ký tự theo bảng chữ cái bởi kí tự đầu tiên trong chuỗi string
 * @param {string} str
 * @param {number} position
 * @returns {string}
 */
export const getCharByCode = (str: string, position: number) => {
  return String.fromCharCode(str.charCodeAt(0) + position);
};

/**
 * Lấy text trong ReactElement
 * @param {React.ReactElement | string} elem
 * @returns {string}
 */
export const getTextFromReactElement = (elem: React.ReactElement | string) => {
  if (["string"].includes(typeof elem)) return elem;
  if (elem instanceof Array) return elem.map(getTextFromReactElement).join("");
  if (typeof elem === "object" && elem) return getTextFromReactElement(elem.props.children);
};
/**
 * Convert number tiền thành text
 * @param {number} num
 * @returns {string}
 */
export const numberToVietnameseText = (num: number) => {
  const ones = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
  const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
  const thousands = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  if (num === 0) return "không đồng";

  const numStr = num.toString();
  let numLength = numStr.length;
  let result = "";
  let groupIndex = 0;

  while (numLength > 0) {
    let group = parseInt(numStr.substring(numLength - 3, numLength), 10);
    numLength -= 3;

    if (group > 0 || groupIndex === 0) {
      let groupText = "";

      let hundreds = Math.floor(group / 100);
      let remainder = group % 100;
      let tensDigit = Math.floor(remainder / 10);
      let onesDigit = remainder % 10;

      if (hundreds > 0) {
        groupText += ones[hundreds] + " trăm ";
      }

      if (remainder < 10 && remainder > 0) {
        groupText += ones[onesDigit];
      } else if (remainder < 20 && remainder >= 10) {
        groupText += teens[onesDigit];
      } else {
        if (tensDigit > 0) {
          groupText += tens[tensDigit];
          if (onesDigit > 0) {
            groupText += " " + ones[onesDigit];
          }
        }
      }

      if (groupIndex > 0) {
        groupText += " " + thousands[groupIndex] + " ";
      }

      result = groupText + result;
    }

    groupIndex++;
  }

  return result.trim() + " đồng";
};
