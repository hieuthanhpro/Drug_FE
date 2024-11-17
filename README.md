# Hướng dẫn sử dụng

1. Cài đặt các gói thư viện

   `npm install`

2. Chạy project

   `npm start`

# Các thành phần trong project

- [CSS Variable](#1-css-variable)
- [Utils](#2-utils)
- [Sapo Components](#3-sapo-components)

## 1. _CSS Variable_

- Sửa các màu mặc định tại: shared/assets/styles/\_variable.scss
- List các màu mặc định:

```scss
$background: #f4f6f8;
$white-color: #ffffff;
$white-color-extra: #f9fafb;
$silver-color: #ccc;
$green-color: #0fd186;
$red-color: #e4193e;
$orange-color: #ee7e16;
$yellow-color: #ffd00f;
$blue-color: #0088ff;
$text-color-primary: #182537;
$text-color-secondary: #7a8086;
$line-color: #d3d5d7;
$line-color-extra: #ebeef0;
```

- Các biến màu có thể gọi từ :root:

```scss
--background
--white-color
--white-color-extra
--silver-color
--green-color
--red-color
--red-color-opacity-#{opacity}
--orange-color
--orange-color-opacity-#{opacity}
--yellow-color
--yellow-color-opacity-#{opacity}
--blue-color
--blue-color-opacity-#{opacity}
--text-color-primary
--text-color-primary-60
--text-color-secondary
--line-color
--line-color-extra

#{opacity} là các giá trị trong dải sau: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90
```

- Cách sử dụng các biến màu từ :root

```scss
background: var(--background);
border-color: var(--line-color);
...
```

## 2. _Utils_

- [commons.ts](#commonsts)
- [validate.ts](#validatets)
- [function.ts](#functionts)
- [dateFormat.ts](#dateFormatts)

### commons.ts

Thêm **common** vào component:

```jsx
import Common from "utils/common";
```

- **Common.stripHtml** - Loại bỏ HTML

  Cú pháp: `Common.stripHtml(str)`

  | Param | Type   | Summary                       |
  | ----- | ------ | ----------------------------- |
  | str   | string | Chuỗi string cần loại bỏ html |

  Ví dụ: `Common.stripHtml("<h1>Chuỗi string cần loại bỏ html</h1>")`

  Kết quả: `Chuỗi string cần loại bỏ html`

- **Common.trimContent** - Cắt chuỗi

  Cú pháp: `Common.trimContent(str, maxLength, isHtml, ellipsis)`

  | Param     | Type    | Default | Summary                                            |
  | --------- | ------- | ------- | -------------------------------------------------- |
  | str       | string  |         | Chuỗi string cần trim                              |
  | maxLength | number  | 20      | Số lượng ký tự trim                                |
  | isHtml    | boolean | false   | Strip html trước khi trim                          |
  | ellipsis  | boolean | false   | Thêm dấu 3 chấm nếu số ký tự str lớn hơn maxLength |

  Ví dụ: `Common.trimContent("<h1>Chuỗi string cần trim</h1>", 12, true, ellipsis)`

  Kết quả: `Chuỗi string...`

- **Common.trimContentByWord** - Tương tự **trimContent**

  Cú pháp: `Common.trimContentByWord(str, maxLength, isHtml, ellipsis)`

  | Param     | Type    | Default | Summary                                            |
  | --------- | ------- | ------- | -------------------------------------------------- |
  | str       | string  |         | Chuỗi string cần trim                              |
  | maxLength | number  | 20      | Số lượng từ cần trim                               |
  | isHtml    | boolean | false   | Strip html trước khi trim                          |
  | ellipsis  | boolean | false   | Thêm dấu 3 chấm nếu số ký tự str lớn hơn maxLength |

  Ví dụ: `Common.trimContentByWord("<h1>Chuỗi string cần trim</h1>", 2, true, ellipsis)`

  Kết quả: `Chuỗi string...`

- **Common.removeAccents** - Xóa dấu

  Cú pháp: `Common.removeAccents(str)`

  | Param | Type   | Summary                  |
  | ----- | ------ | ------------------------ |
  | str   | string | Chuỗi string loại bỏ dấu |

  Ví dụ: `Common.removeAccents("Đây là base app react cho ai làm app của Sapo Web")`

  Kết quả: `Day la base app react cho ai lam app cua Sapo Web`

- **Common.ignoreSpaces** - Xóa khoảng trắng thừa

  Cú pháp: `Common.ignoreSpaces(str)`

  | Param | Type   | Summary                               |
  | ----- | ------ | ------------------------------------- |
  | str   | string | Chuỗi string cần loại bỏ khoảng trắng |

  Ví dụ: `Common.removeAccents(" Rất nhiều khoảng trắng nè ")`

  Kết quả: `Rất nhiều khoảng trắng nè`

- **Common.formatCurrency** - Format tiền tệ

  Cú pháp: `Common.formatCurrency(num, suffixes, positionSuffixes, separate)`

  | Param            | Type   | Default | Summary                                         |
  | ---------------- | ------ | ------- | ----------------------------------------------- |
  | num              | number |         | Số cần format                                   |
  | suffixes         | string | đ       | Suffixes các loại tiền<br />_VD: đ, VNĐ, $...._ |
  | positionSuffixes | string | right   | Vị trí suffixes                                 |
  | separate         | string | ,       | Ngăn cách giữa 3 số                             |

  Ví dụ: `Common.formatCurrency(50000, 'đ', 'right', '.')`

  Kết quả: `50.000đ`

- **Common.getOffsetHeight** - Lấy về offsetHeight của element

  Cú pháp: `Common.getOffsetHeight(item)`

  | Param | Type        | Summary                      |
  | ----- | ----------- | ---------------------------- |
  | item  | HTMLElement | Element cần lấy offsetHeight |

- **Common.getOffsetTop** - Lấy về offsetTop của element

  Cú pháp: `Common.getOffsetTop(item)`

  | Param | Type        | Summary                   |
  | ----- | ----------- | ------------------------- |
  | item  | HTMLElement | Element cần lấy offsetTop |

- **Common.scrollTo(to, duration)** - Scroll tới 1 điểm xác định
  Cú pháp: `Common.scrollTo(to, duration)`
  | Param    | Type   | Default | Summary                                                                         |
  | -------- | ------ | ------- | ------------------------------------------------------------------------------- |
  | to       | number | 0       | Khoảng cách muốn scroll tới tính từ item thực hiện event                        |
  | duration | number | 200     | Thời gian từ item thực hiện event tới khoảng cách mong muốn. ?<br/>_Đơn vị: ms_ |

### validate.ts

Thêm **validate** vào component:

```jsx
import Validate from "utils/validate";
```

- **Validate.validateIsEmpty** - Check string rỗng hay không

  Cú pháp: `Validate.validateIsEmpty(str)`

  | Param | Type   | Summary                   |
  | ----- | ------ | ------------------------- |
  | str   | string | Chuỗi string cần kiểm tra |

  Ví dụ 1: `Validate.validateIsEmpty(" ")`

  Kết quả 1: `true`

  Ví dụ 1: `Validate.validateIsEmpty(" a ")`

  Kết quả 2: `false`

- **Validate.validateMinLength** - Check string có số ký tự tối thiểu

  Cú pháp: `Validate.validateMinLength(str, min)`

  | Param | Type   | Summary                   |
  | ----- | ------ | ------------------------- |
  | str   | string | Chuỗi string cần kiểm tra |
  | min   | number | Số ký tự tối thiểu        |

  Ví dụ 1: `Validate.validateMinLength(" ", 5)`

  Kết quả 1: `false`

  Ví dụ 1: `Validate.validateIsEmpty(" abcdef ", 5)`

  Kết quả 2: `true`

- **Validate.validateMaxLength** - Check string có số ký tự tối đa

  Cú pháp: `Validate.validateMaxLength(str, max)`

  | Param | Type   | Summary                   |
  | ----- | ------ | ------------------------- |
  | str   | string | Chuỗi string cần kiểm tra |
  | max   | number | Số ký tự tối đa           |

  Ví dụ 1: `Validate.validateMaxLength("123456", 5)`

  Kết quả 1: `false`

  Ví dụ 1: `Validate.validateMaxLength("12345", 5)`

  Kết quả 2: `true`

- **Validate.validatePhoneVN** - Check số điện thoại có phải VN hay ko

  Cú pháp: `Validate.validatePhoneVN(phone)`

  | Param | Type   | Summary                    |
  | ----- | ------ | -------------------------- |
  | phone | string | Số điện thoại cần kiểm tra |

  Ví dụ 1: `Validate.validatePhoneVN("+84983442452")` hoặc `Validate.validatePhoneVN("84983442452")` hoặc `Validate.validatePhoneVN("0983442452")`

  Kết quả 1: `true`

  Ví dụ 2: `Validate.validatePhoneVN("+849834424529")` hoặc `Validate.validatePhoneVN("849834424529")` hoặc `Validate.validatePhoneVN("09834424529")`

  Kết quả 2: `false`

- **Validate.validateEmail** - Check email có đúng định dạng

  Cú pháp: `Validate.validateEmail(email)`

  | Param | Type   | Summary            |
  | ----- | ------ | ------------------ |
  | email | string | Email cần kiểm tra |

  Ví dụ 1: `Validate.validateEmail("truongdx@sapo.vn")`

  Kết quả 1: `true`

  Ví dụ 2: `Validate.validateEmail("truongdxsapo.vn")`

  Kết quả 2: `false`

- **Validate.validatePassword** - Password bao gồm: Có chứa ít nhất một kí tự số, ít nhất một kí tự hoa, ít nhất một kí tự thường và một kí tự đặc biệt

  Cú pháp: `Validate.validatePassword(password, minLength, maxLength)`

  | Param     | Type   | Default | Summary               |
  | --------- | ------ | ------- | --------------------- |
  | password  | string |         | Mật khẩu cần kiểm tra |
  | minLength | number | 6       | Số kí tự tối thiểu    |
  | maxLength | number | 9       | Số kí tự tối đa       |

  Ví dụ 1: `Validate.validatePassword("123456789", 6, 9)`

  Kết quả 1: `false` - Thiếu kí tự viết hoa, viết thường, kí tự đặc biệt

  Ví dụ 2: `Validate.validatePassword("T123456dx@", 6, 9)`

  Kết quả 2: `true`

- **Validate.validateURL** - Kiểm tra có đúng url hay ko?

  Cú pháp: `Validate.validateURL(link)`

  | Param | Type   | Summary             |
  | ----- | ------ | ------------------- |
  | link  | string | String cần kiểm tra |

  Ví dụ 1: `Validate.validateURL("http...abc.com.vn")`

  Kết quả 1: `false`

  Ví dụ 2: `Validate.validateURL("http://abc.com.vn")`

  Kết quả 2: `true`

- **Validate.validateDateFormatVn** - Kiểm tra đầu vào có đúng định dạng ngày của người Việt dd/mm/yyyy hoặc dd-mm-yyyy hoặc dd.mm.yyyy

  Cú pháp: `Validate.validateDateFormatVn(date)`

  | Param | Type   | Summary                  |
  | ----- | ------ | ------------------------ |
  | date  | string | String date cần kiểm tra |

  Ví dụ 1: `Validate.validateDateFormatVn("07/20/2021")`

  Kết quả 1: `false`

  Ví dụ 2: `Validate.validateDateFormatVn("20/07/2021")`

  Kết quả 2: `true`

- **Validate.validateTime** - Kiểm tra định dạng giờ phút

  Cú pháp: `Validate.validateTime(date)`

  | Param | Type   | Summary                  |
  | ----- | ------ | ------------------------ |
  | date  | string | String date cần kiểm tra |

  Ví dụ 1: `Validate.validateTime("25:59")`

  Kết quả 1: `false`

  Ví dụ 2: `Validate.validateTime("23:59")`

  Kết quả 2: `true`

### function.ts

- **Function.useOnClickOutside** - Kiểm tra click ra khỏi vùng ref

  Cú pháp: `Function.useOnClickOutside(ref, handle, clas);`

  | Param  | Type                   | Summary                   |
  | ------ | ---------------------- | ------------------------- |
  | ref    | React.MutableRefObject | Ref của element mong muốn |
  | handle | function               | function callback         |
  | clas   | string                 | class tác động            |

## 3. _Sapo Components_

- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Các thành phần trong project](#các-thành-phần-trong-project)
  - [1. _CSS Variable_](#1-css-variable)
  - [2. _Utils_](#2-utils)
    - [commons.ts](#commonsts)
    - [validate.ts](#validatets)
    - [function.ts](#functionts)
  - [3. _Sapo Components_](#3-sapo-components)
    - [bulkAction.tsx](#bulkactiontsx)
    - [button.tsx](#buttontsx)
    - [checkbox.tsx](#checkboxtsx)
    - [emptyState.tsx](#emptystatetsx)
    - [filterDate.tsx](#filterdatetsx)
    - [footerHelp.tsx](#footerhelptsx)
    - [input.tsx](#inputtsx)
    - [loading.tsx](#loadingtsx)
    - [notification.tsx](#notificationtsx)
    - [numericInput.tsx](#numericinputtsx)
    - [pagination.tsx](#paginationtsx)
    - [popover.tsx](#popovertsx)
    - [radio.tsx](#radiotsx)
    - [ribbon.tsx](#ribbontsx)
    - [sapoBadge.tsx](#sapobadgetsx)
    - [sapoTabs.tsx](#sapotabstsx)
    - [sapoTabs.tsx](#sapotabstsx-1)
    - [switch.tsx](#switchtsx)
    - [tagsInput.tsx](#tagsinputtsx)
    - [textarea.tsx](#textareatsx)

### bulkAction.tsx

| Attribute       | Type                  | Summary                                    |
| --------------- | --------------------- | ------------------------------------------ |
| bulkActionItems | BulkActionItemModel[] | Danh sách button trên bulkAction           |
| refContainer    | Refs                  | Refs popover                               |
| onClick         | function              | Function click các button trong bulkAction |

Sử dụng **bulkAction**

```jsx
import React, { useState, useRef } from "react";
import BulkAction, { BulkActionItemModel } from "shared/sapo-components/bulkAction";
import { useOnClickOutside } from "util/function";

export default function MyComponent() {
  const refBulkAction = useRef();
  const [showBulkAction, setShowBulkAction] = useState < boolean > false;
  useOnClickOutside(refBulkAction, () => setShowBulkAction(false), "my-class");
  const bulkActionItems: BulkActionItemModel[] = [
    {
      key: "string",
      value: "string",
    },
    {
      key: "string",
      value: "string",
    },
  ];

  return (
    <li className="my-class">
      <button onClick={() => setShowBulkAction(!showBulkAction)}>Chọn thao tác</button>
      {showBulkAction ? <BulkAction bulkActionItems={bulkActionItems} refContainer={refBulkAction} onClick={(item) => handleBulkAction(item)} /> : ""}
    </li>
  );
}
```

### button.tsx

| Attribute | Type     | Summary                                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------------------- |
| color     | string   | Màu sắc của button<br/>_Giá trị: primary, destroy, transparent, link_                    |
| children  | any      | Phần tử con có thể là component hoặc html                                                |
| disabled  | boolean  | Trạng thái disabled của button                                                           |
| onClick   | function | Function click các button                                                                |
| type      | string   | Type của button<br/>_Giá trị: submit, button_                                            |
| className | string   | Class cho button                                                                         |
| onlyIcon  | boolean  | Nút button có children chỉ là icon hay ko?                                               |
| size      | string   | Kích thước của button. Nếu bỏ trống sẽ là kích thước mặc định<br/>_Giá trị: slim, large_ |

Sử dụng **button**

```jsx
import React from "react";
import Button from "shared/sapo-components/button";
import IconArrowLeft from "shared/assets/image/icon-arrow-left.svg";

export default function MyComponent() {
  const myButton = () => {};
  return (
    <Button
      type="button"
      color="primary"
      className="my-class"
      onlyIcon={true}
      size="slim"
      onClick={() => myButton()}
      children={<IconArrowLeft />}
      disabled={true}
    >
      Button
      <IconArrowLeft />
    </Button>
  );
}
```

### checkbox.tsx

| Attribute     | Type     | Summary                                               |
| ------------- | -------- | ----------------------------------------------------- |
| label         | string   | Text label                                            |
| labelHtml     | boolean  | Label chỉ bao gồm text hay là cả html?                |
| checked       | boolean  | Trạng thái checked                                    |
| indeterminate | boolean  | Trạng thái indeterminate                              |
| bulkAction    | string   | Có phải checkbox ở bulkAction trang danh sách hay ko? |
| onChange      | function | Function onchange                                     |
| onClick       | function | Function onclick                                      |
| className     | string   | Class cho checkbox                                    |

Sử dụng **checkbox**

```jsx
import React from "react";
import Checkbox from "shared/sapo-components/checkbox";

export default function MyComponent() {
  const myChange = () => {};
  const myClick = () => {};
  return (
    <Checkbox
      bulkAction={true}
      className="my-class"
      checked={true}
      indeterminate={false}
      onChange={(e) => myChange()}
      onClick={(e) => myClick()}
      labelHtml={true}
      label={<span>abc</span>}
    />
  );
}
```

### emptyState.tsx

| Attribute   | Type         | Summary     |
| ----------- | ------------ | ----------- |
| title       | string       | Tiêu đề     |
| description | string       | Mô tả       |
| children    | ReactElement | Phần tử con |
| image       | string       | Url ảnh     |

Sử dụng **emptyState**

```jsx
import React from "react";
import Button from "shared/sapo-components/button";
import { EmptyState } from "shared/sapo-components/emptyState";

export default function MyComponent() {
  const myClick = () => {};
  return (
    <EmptyState
      title="Tạo mới danh sách khuyến mãi"
      description="Tạo hàng loạt các mã khuyến mãi giúp tiết kiệm thời gian và nguồn lực cho bạn"
      image="//bizweb.dktcdn.net/100/319/535/files/img-empty-state-bulk-discount.svg?v=1628220399550"
    >
      <Button type="button" color="primary" className="my-class" onClick={() => myClick()}>
        Tạo danh sách khuyến mãi
      </Button>
    </EmptyState>
  );
}
```

**emptySearch**

| Attribute   | Type         | Summary     |
| ----------- | ------------ | ----------- |
| icon        | any          | Icon        |
| title       | string       | Tiêu đề     |
| description | string       | Mô tả       |
| children    | ReactElement | Phần tử con |

Sử dụng **emptySearch**

```jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { EmptySearch } from "hared/sapo-components/emptyState";

export default function MyComponent() {
  return (
    <EmptySearch
      title="Không tìm thấy khuyến mãi phù hợp với điều kiện tìm kiếm"
      description="Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm"
      icon={<FontAwesomeIcon icon={faSearch} size="4x" />}
    />
  );
}
```

### filterDate.tsx

| Attribute                  | Type     | Summary                          |
| -------------------------- | -------- | -------------------------------- |
| currentDateFilter.fromDate | string   | Bắt đầu từ ngày                  |
| currentDateFilter.toDate   | string   | Tới ngày                         |
| setCurrentDateFilter       | function | Function event sau khi chọn ngày |

Sử dụng **filterDate**

```jsx
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import FilterDate from 'shared/sapo-components/filterDate';

export default function MyComponent() {
    const [currentDateFilter, setCurrentDateFilter] = useState<any>();
    useEffect(() => {
        setCurrentDateFilter({ fromDate: moment().subtract(6, 'days').format("YYYY-MM-DD"), toDate: moment().format("YYYY-MM-DD") });
    });
    return (
        <FilterDate currentDateFilter={currentDateFilter} setCurrentDateFilter={(e) => setCurrentDateFilter(e)} />
    )
}
```

### footerHelp.tsx

| Attribute | Type   | Summary           |
| --------- | ------ | ----------------- |
| title     | string | Tiêu đề           |
| link      | string | Link              |
| textLink  | string | Nội dung của link |

Sử dụng **footerHelp**

```jsx
import React, { useState, useEffect } from "react";
import FooterHelp from "shared/sapo-components/footerHelp";

export default function MyComponent() {
  return (
    <FooterHelp
      title="Bạn có thể xem thêm hướng dẫn về quản lý mã khuyến mãi"
      link="https://support.sapo.vn/tim-hieu-ve-khuyen-mai"
      textLink="tại đây"
    />
  );
}
```

### input.tsx

| Attribute        | Type     | Summary                                                    |
| ---------------- | -------- | ---------------------------------------------------------- |
| id               | string   | Định danh id của input                                     |
| value            | string   | Giá trị của input                                          |
| type             | string   | Kiểu của input<br/>_Giá trị: text, number_                 |
| name             | string   | Định danh name của input                                   |
| className        | string   | Class của input                                            |
| placeholder      | string   | Nội dung placeholder                                       |
| onChange         | function | Function khi thay đổi value trong input                    |
| autoFocus        | boolean  | Có tự động focus vào input?                                |
| onFocus          | function | Function khi focus vào input                               |
| onBlur           | function | Function khi blur khỏi input                               |
| error            | boolean  | Nếu có lỗi thì error = true và message khác null           |
| message          | string   | Nội dung lỗi. Chỉ hiển thị khi error = true                |
| onKeyDown        | function | Function khi nhân nút trên bàn phím                        |
| onKeyUp          | function | Function khi nhả nút trên bàn phím                         |
| onClick          | function | Function khi click chuột vào input                         |
| label            | string   | Label của input                                            |
| labelDescription | string   | Nội dung mô tả nhỏ dưới label                              |
| disable          | boolean  | Có disable input hay ko?                                   |
| onKeyPress       | function | Function khi nhấn nút trên bàn phím                        |
| readOnly         | boolean  | Input chỉ cho phép đọc không cho phép gõ thay đổi giá trị? |
| defaultValue     | string   | Giá trị mặc định của input                                 |
| maxLength        | number   | Số kí tự tối đa của input                                  |
| icon             | any      | Chèn component icon hoặc text                              |
| quote            | string   | Nội dung quote nếu dùng                                    |

Sử dụng **input**

```jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Input from "../../shared/sapo-components/input";

export default function MyComponent() {
  const myChange = () => {};
  return (
    <Input
      className="my-class"
      icon={<FontAwesomeIcon icon={faSearch} size="1x" />}
      onChange={(e) => myChange(e.target.value)}
      placeholder="Tìm kiếm khuyến mãi"
    />
  );
}
```

### loading.tsx

| Attribute | Type   | Summary                          |
| --------- | ------ | -------------------------------- |
| className | string | Class riêng cho loading          |
| text      | string | Nội dung mô tả dưới icon loading |

Sử dụng **loading**

```jsx
import React from "react";
import Loading from "shared/sapo-components/loading";

export default function MyComponent() {
  return <Loading className="loading" text="Đang tải..." />;
}
```

### notification.tsx

| Attribute   | Type     | Summary                                                      |
| ----------- | -------- | ------------------------------------------------------------ |
| type        | string   | Gồm 1 trong các giá trị sau: \*error, info, warning, success |
| title       | string   | Tiêu đề                                                      |
| content     | string   | Nội dung mô tả                                               |
| listContent | string[] | List content sẽ chuyển sang dạng ul li                       |
| action      | any      | Component button hoặc thẻ các thẻ action khác                |
| className   | string   | Class riêng cho notification                                 |

Sử dụng **notification**

```jsx
import React, { useState } from 'react';
import Button from 'shared/sapo-components/button';
import Notification from 'shared/sapo-components/notification';

export default function MyComponent() {
    const [listError, setListError] = useState<string[]>([]);
    return (
        {listError && listError.length > 0 ? (
            <Notification type="error" title={`Có ${listError.length} lỗi với khuyến mãi:`} listContent={listError} />
        ) : ''}
        <Notification type="info" title="Thêm sản phẩm thành công" className="my-class"
            content="Thêm sản phẩm abcxyz thành công" action={<Button type="button">Thêm sản phẩm khác</Button>} />
    )
}
```

### numericInput.tsx

| Attribute         | Type     | Summary                                                    |
| ----------------- | -------- | ---------------------------------------------------------- |
| id                | string   | Định danh id của input                                     |
| value             | string   | Giá trị của input                                          |
| name              | string   | Định danh name của input                                   |
| className         | string   | Class của input                                            |
| placeholder       | string   | Nội dung placeholder                                       |
| onChange          | function | Function khi thay đổi value trong input                    |
| onValueChange     | function | Function khi value trong input thay đổi                    |
| autoFocus         | boolean  | Có tự động focus vào input?                                |
| onFocus           | function | Function khi focus vào input                               |
| onBlur            | function | Function khi blur khỏi input                               |
| error             | boolean  | Nếu có lỗi thì error = true và message khác null           |
| message           | string   | Nội dung lỗi. Chỉ hiển thị khi error = true                |
| onKeyDown         | function | Function khi nhân nút trên bàn phím                        |
| onKeyUp           | function | Function khi nhả nút trên bàn phím                         |
| onClick           | function | Function khi click chuột vào input                         |
| label             | string   | Label của input                                            |
| labelDescription  | string   | Nội dung mô tả nhỏ dưới label                              |
| disable           | boolean  | Có disable input hay ko?                                   |
| onKeyPress        | function | Function khi ấn nút trên bàn phím                          |
| readOnly          | boolean  | Input chỉ cho phép đọc không cho phép gõ thay đổi giá trị? |
| defaultValue      | string   | Giá trị mặc định của input                                 |
| maxLength         | number   | Số kí tự tối đa của input                                  |
| icon              | any      | Chèn component icon hoặc text                              |
| suffixes          | string   | Symbol cho input                                           |
| currency          | string   | Loại tiền tệ<br/>_VD: VND, THB, SEK....._                  |
| thousandSeparator | boolean  | Có dùng các dấu ngăn cách tiền tệ hay ko?                  |
| maxValue          | number   | Giá trị tối đa                                             |
| minValue          | number   | Giá trị tối thiểu                                          |
| regex             | RegExp   | Regex validate                                             |
| allowNegative     | boolean  | Cho phép số âm?<br/>_Default: false_                       |
| allowLeadingZeros | boolean  | Cho phép có số 0 ở đầu?<br/>_Default: false_               |

Sử dụng **numericInput**

```jsx
import React, { useState } from "react";
import NummericInput from "shared/sapo-components/nummericInput";

export default function MyComponent() {
  const myValueChange = () => {};
  return (
    <NummericInput
      label="Số lượng mã muốn tạo"
      minValue={0}
      maxValue={1000}
      allowNegative={false}
      onValueChange={(values) => myValueChange(values)}
      regex={/^\d+$/}
    />
  );
}
```

### pagination.tsx

| Attribute     | Type     | Summary                           |
| ------------- | -------- | --------------------------------- |
| displayNumber | number   | Số lượng item pagination hiển thị |
| page          | number   | Page hiện tại                     |
| sizeLimit     | number   | Số lượng hiển thị trên 1 page     |
| totalPage     | number   | Tổng số trang                     |
| totalItem     | number   | Tổng số item                      |
| setPage       | function | Function thay đổi page            |

Sử dụng **pagination**

```jsx
import React, { useState } from "react";
import Pagination from "shared/sapo-components/pagination";

export default function MyComponent() {
  const json = {
    totalPage: 5,
    totalItem: 100,
    page: 1,
    limit: 20,
  };
  const setPage = (value) => {};
  return (
    <Pagination
      displayNumber={5}
      totalPage={json.totalPage}
      totalItem={json.totalItem}
      page={json.page}
      sizeLimit={json.limit}
      setPage={(e) => setPage(e)}
    />
  );
}
```

### popover.tsx

| Attribute    | Type         | Summary                                           |
| ------------ | ------------ | ------------------------------------------------- |
| className    | string       | Class riêng của popover                           |
| position     | string       | Là 1 trong các giá trị sau: _left, right, center_ |
| refContainer | Refs         | Refs của popover                                  |
| children     | ReactElement | Phần tử con                                       |

Sử dụng **popover**

```jsx
import React, { useState, useRef } from "react";
import Popover from "shared/sapo-components/popover";

export default function MyComponent() {
  const refContainer = useRef();
  return (
    <Popover position="left" className="my-class" refContainer={refContainer}>
      <ul>
        <li>123</li>
        <li>456</li>
      </ul>
    </Popover>
  );
}
```

### radio.tsx

| Attribute      | Type     | Summary                                       |
| -------------- | -------- | --------------------------------------------- |
| label          | string   | Nội dung label                                |
| note           | string   | Mô tả nhỏ dưới label                          |
| onChange       | Refs     | Function khi trạng thái checked thay đổi      |
| name           | string   | Định danh tên của radio                       |
| value          | string   | Giá trị của radio                             |
| checked        | boolean  | Trạng thái checked                            |
| defaultChecked | boolean  | Mặc định trạng thái checked là true hay false |
| id             | string   | Định danh id của radio                        |
| disabled       | boolean  | Có ở trạng thái disabled hay ko?              |
| onClick        | function | Function khi click vào radio                  |
| className      | string   | Class riêng của radio                         |

Sử dụng **radio**

```jsx
import React from "react";
import Radio from "shared/sapo-components/radio";

export default function MyComponent() {
  const myOnchange = () => {};
  return <Radio label="Tất cả sản phẩm" name="target_selection" checked={false} defaultChecked={false} value="all" onChange={(e) => myOnchange()} />;
}
```

### ribbon.tsx

| Attribute | Type   | Summary                                                       |
| --------- | ------ | ------------------------------------------------------------- |
| type      | string | Là 1 trong những giá trị sau: _error, info, warning, success_ |
| content   | string | Nội dung                                                      |
| action    | any    | Component button hoặc thẻ các thẻ action khác                 |
| className | string | Class riêng cho ribbon                                        |

Sử dụng **ribbon**

```jsx
import React from "react";
import Button from "shared/sapo-components/button";
import Ribbon from "shared/sapo-components/ribbon";

export default function MyComponent() {
  const myOnclick = () => {};
  return (
    <Ribbon
      type="error"
      className="my-class"
      content="Tài khoản của bạn không hiển thị quảng cáo. Để bắt đầu hiển thị quảng cáo , hãy nhập thông tin thanh toán của bạn"
      action={
        <Button type="button" className="text-upper" color="link" onClick={() => myOnclick()}>
          <strong>Khắc phục</strong>
        </Button>
      }
    />
  );
}
```

### sapoBadge.tsx

| Attribute | Type   | Summary                                      |
| --------- | ------ | -------------------------------------------- |
| status    | string | Là 1 trong những giá trị sau ở list bên dưới |
| className | string | Class riêng cho Badge                        |

```js
[
  {
    status: "running",
    text: "Đã hoạt động",
  },
  {
    status: "processing",
    text: "Đang chờ xử lý",
  },
  {
    status: "stopping",
    text: "Đã tạm dừng  ",
  },
  {
    status: "rejected",
    text: "Đã từ chối",
  },
  {
    status: "deleted",
    text: "Đã xóa",
  },
  {
    status: "eligible",
    text: "Đủ điều kiện",
  },
  {
    status: "unqualified",
    text: "Chưa đủ điều kiện",
  },
];
```

Sử dụng **sapoBadge**

```jsx
import React from "react";
import SapoBadge from "shared/sapo-components/sapoBadge";

export default function MyComponent() {
  return <SapoBadge status="success" />;
}
```

### sapoTabs.tsx

| Attribute  | Type       | Summary                    |
| ---------- | ---------- | -------------------------- |
| tabs       | TabModel[] | Danh sách các tab          |
| typeActive | string     | Tab đang được chọn         |
| onClick    | function   | Function khi click vào tab |

Sử dụng **sapoTabs**

```jsx
import React from "react";
import SapoTabs, { TabModel } from "shared/sapo-components/sapoTabs";

export default function MyComponent() {
  const listTab: TabModel[] = [
    {
      title: "Tất cả chiến dịch",
      type: "all",
    },
    {
      title: "Chiến dịch A",
      type: "A",
    },
  ];
  const myOnclick = () => {};
  return <SapoTabs tabs={listTab} typeActive="all" onClick={(e) => myOnclick(e)} />;
}
```

### sapoTabs.tsx

| Attribute  | Type       | Summary                    |
| ---------- | ---------- | -------------------------- |
| tabs       | TabModel[] | Danh sách các tab          |
| typeActive | string     | Tab đang được chọn         |
| onClick    | function   | Function khi click vào tab |

Sử dụng **sapoTabs**

```jsx
import React from "react";
import SapoTabs, { TabModel } from "shared/sapo-components/sapoTabs";

export default function MyComponent() {
  const listTab: TabModel[] = [
    {
      title: "Tất cả chiến dịch",
      type: "all",
    },
    {
      title: "Chiến dịch A",
      type: "A",
    },
  ];
  const myOnclick = () => {};
  return <SapoTabs tabs={listTab} typeActive="all" onClick={(e) => myOnclick()} />;
}
```

### switch.tsx

| Attribute | Type     | Summary                            |
| --------- | -------- | ---------------------------------- |
| id        | string   | Định danh id cho switch            |
| name      | string   | Định danh name cho switch          |
| className | string   | Class riêng cho switch             |
| onChange  | function | Function khi switch change checked |
| checked   | boolean  | Trạng thái checked                 |
| label     | string   | Nội dung label                     |
| onClick   | function | Function khi click vào switch      |

Sử dụng **switch**

```jsx
import React from "react";
import Switch from "shared/sapo-components/switch";

export default function MyComponent() {
  const myOnclick = () => {};
  const myOnchange = () => {};
  return (
    <Switch
      id="switch"
      name="switch"
      className="my-class"
      label="Label là đây"
      checked={true}
      onChange={(e) => myOnchange()}
      onClick={(e) => myOnclick()}
    />
  );
}
```

### tagsInput.tsx

| Attribute   | Type     | Summary                                     |
| ----------- | -------- | ------------------------------------------- |
| tagsData    | string[] | List các tag                                |
| addTag      | function | Function thêm mới tag                       |
| removeTag   | function | Function xóa tag                            |
| placeholder | string   | Placeholder cho input                       |
| acceptPaste | boolean  | Có chấp nhận paste tag vào input hay không? |
| maxLength   | number   | Giới hạn số lượng tag                       |
| label       | string   | Label của tagsInput                         |

Sử dụng **tagsInput**

```jsx
import React from "react";
import TagsInput from "shared/sapo-components/tagsInput";

export default function MyComponent() {
  const listTag = ["Tag1", "Tag2", "Tag3"];
  const myAddTag = () => {};
  const myRemoveTag = () => {};
  return (
    <TagsInput label="Nhập mã" tagsData={listTag} addTag={(e) => myAddTag(e)} removeTag={(e) => myRemoveTag(e)} acceptPaste={true} maxLength={1000} />
  );
}
```

### textarea.tsx

| Attribute   | Type     | Summary                                                 |
| ----------- | -------- | ------------------------------------------------------- |
| id          | string   | Định danh id cho textarea                               |
| value       | string   | Giá trị của textarea                                    |
| name        | string   | Định danh name cho textarea                             |
| className   | string   | Class riêng cho textarea                                |
| placeholder | string   | Placeholder cho textarea                                |
| onChange    | function | Function khi thay đổi giá trị của textarea              |
| autoFocus   | boolean  | Có tự động focus vào textarea hay ko?                   |
| onFocus     | function | Function khi focus vào textarea                         |
| onBlur      | function | Function khi blur khỏi textarea                         |
| error       | boolean  | Textarea có đang trạng thái error hay ko?               |
| message     | string   | Message lỗi của textarea. Chỉ hiển thị khi error = true |
| onKeyDown   | string   | Function khi nhấn bàn phím                              |
| onKeyUp     | string   | Function khi nhả bàn phím                               |
| onClick     | string   | Function khi click chuột vào textarea                   |
| label       | string   | Label của textarea                                      |
| disable     | string   | Textarea có disable hay ko?                             |
| onKeyPress  | string   | Function khi nhấn nút trên bàn phím                     |
| readOnly    | string   | Textarea có đang chỉ cho đọc hay ko?                    |
| maxLength   | string   | Số lượng ký tự giới hạn trong textarea                  |

Sử dụng **textarea**

```jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Textarea from "shared/sapo-components/textarea";

export default function MyComponent() {
  const myOnchange = () => {};
  return (
    <Textarea
      className="my-class"
      icon={<FontAwesomeIcon icon={faSearch} size="1x" />}
      onChange={(e) => myOnchange(e.target.value)}
      placeholder="Nội dung mô tả"
    />
  );
}
```
