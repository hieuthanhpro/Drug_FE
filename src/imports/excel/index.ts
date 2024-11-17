
import ExcelJS from 'exceljs';
import _ from 'lodash';
import { showToast } from 'utils/common';

export const handleFileChange = (e,setShowModalImport,setTestData) => {
    const file = e.target.files[0];
    
    if (file) {
      readExcelFile(file,setTestData,setShowModalImport);
    }

  };

 export const readExcelFile = async (buffer,setTestData,setShowModalImport) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1); // Get the first worksheet

    const rows = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowData = [];
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData.push(cell.value);
      });
      rows.push(rowData);
    });
    const data= handleValidateData(rows)
    if(data){
      setShowModalImport(true)
      setTestData(data)
    } else {
      showToast("Vui lòng nhập đùng định dạng file excel","error")
    }
  };



const includesAll=(arr,value)=>value.every(v=>arr.includes(v))
const requiredTitle=["Tên thuốc","Mã thuốc","Giá bán","Tồn kho","Đơn vị tính","Trạng thái"]

const handleValidateData=(data)=>{
  let isValid=false
  const newData=[]
  data.forEach((el,id)=>{
    if(includesAll(el,requiredTitle)){
      isValid=true
    }
    if(isValid){
      newData.push(el)
    }

  })

  if(newData.length > 0){
    const headerData=newData[0]

    const newHeaderData=headerData?.reduce((acc, curr) => {
      let key
      switch (curr.toLowerCase()) {
        case "tên thuốc":
          key= 'name'
          break;
  
        case "mã thuốc":
          key= 'drug_code'
          break;
        
        case "mã vạch":
          key="barcode"
          break;
  
        case "giá bán":
          key="current_cost"
          break;
  
        case "tồn kho":
          key= "quantity"
          break;
  
        case "đơn vị tính":
          key="unit_name"
          break;
  
        case "trạng thái":
          key="active"
  
        default:
          break;
      }
      return [...acc,{title:key}]
  
    }, 
      []
    ) 
  
    const newtest=newData.slice(1)
  
    const finalData= newtest.map((item)=>{
  
      const objItem=item.reduce((acc,curr,idx)=>{
        const key=newHeaderData[idx].title
        if(key==="current_cost" && curr){
          const current_cost=curr.replace(/[^\d,]/g, '').replace(/,/g, '');
          return {...acc,[key]:current_cost}
  
        } else if (key==="active"){
          const isActive=curr.trim().toLowerCase()==="đang kinh doanh"?"yes":"no"
          return {...acc,[key]:isActive}
        }  else if (key==="name" && _.isEmpty(curr) || (key==='unit_name' && _.isEmpty(curr))){
            return 
        } else {
          return {...acc,[key]:curr}
        }
      },{})
  
      if(objItem  && !objItem.hasOwnProperty('name') ){
        return {}
      }
      return objItem
    }).filter(item=>Object.keys(item).length>0)
  
    return finalData
  }

  return false
}

// Tên thuốc
//  Mã thuốc
//  Mã vạch
//  Giá bán
//  Tồn kho
//  Đơn vị tính
//  Trạng thái