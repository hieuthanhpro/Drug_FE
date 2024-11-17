import React, { useContext, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Icon from "components/icon";
import { IMenuItem } from "model/OtherModel";
import { ContextType, UserContext } from "contexts/userContext";
import _ from "lodash";
import "./navigation.scss";

interface NavigationProps {
  menuItemList: IMenuItem[];
}

export default function Navigation(props: NavigationProps) {
  const { permissions } = useContext(UserContext) as ContextType;
  const { menuItemList } = props;
  const location = useLocation();
  const [menuList, setMenuList] = useState<IMenuItem[]>(
    menuItemList.map((m) => {
      if(m.children && m.children.length>0){
        // handle 3 layer nav case
         const refactorMenuSublist= m.children.map(c=>{
          if(c.children && c.children.length>0){
            return {
              ...c,
              is_show_subChildren:c.path===location.pathname ||
              (c.children && c.children.filter((subChildren) => subChildren.path === location.pathname)?.length > 0) ||
              c.is_active,
            }
          }
            return c
          })
          const newM={...m,children:[...refactorMenuSublist]}
          const isSubNavActive=newM.children.some(el=>el.is_show_subChildren)
          return {
            ...newM,
            is_show_children:
              newM.path === location.pathname ||isSubNavActive||
              (newM.children && newM.children.filter((children) => children.path === location.pathname)?.length > 0) ||
              newM.is_active,
          };
      } 
      return {
        ...m,
        is_show_children:
          m.path === location.pathname ||
          (m.children && m.children.filter((children) => children.path === location.pathname)?.length > 0) ||
          m.is_active,
      };
    })
  );

  const setShowChildren = (idx: number) => {
    const menuListNew = _.cloneDeep(menuList);
    setMenuList(
      menuListNew.map((m, index) => {
        const isHaveSubChildren=m.children?.some(el=>el.children && el.children.length>0)
        if(isHaveSubChildren){
          const newChildren=m.children?.map((el)=>{
            return {...el,is_show_subChildren:false}
          })
          return { 
            ...m, 
            is_show_children: m.is_show_children === true ? false : index === idx,
            children: newChildren 
          };
        }

        return {
          ...m,
          is_show_children: m.is_show_children === true ? false : index === idx,
        };
      })
    );
  };

  const setShowSubChildren = (idxChild:number)=>{
    const newMenuList=_.cloneDeep(menuList)
    
    setMenuList(
      newMenuList.map((m)=>{
        const isHaveSubChildren=m.children?.some(el=>el.children && el.children.length>0)
        if(isHaveSubChildren){
          const newChildren=m.children?.map((el,idx)=>{
            return {
              ...el,
              is_show_subChildren: el.is_show_subChildren === true ? false : idxChild === idx,
            };
          })
          return {...m,children:newChildren}
        }  

        return m
      })
    )
  }

  const itemLength=menuList?.reduce((acc,curr)=>{
    if(curr?.is_show_children && curr?.children?.length>0){
      const itemHaveSubChildrenActive=curr.children.find((el)=>el.is_show_subChildren)
      if(itemHaveSubChildrenActive && itemHaveSubChildrenActive.children) {
        return acc = acc+ curr.children.length + itemHaveSubChildrenActive.children.length
      }
      
      return acc += curr.children.length
    }
    return acc 
  },0)

  return (
    <ul className="navigation">
      {menuList.map((item, idx) => {
        const isSubChildrenActive=item.children?.filter(el=>{
          const isActive=el.children?.filter(c=>c.path===location.pathname).length>0
          return isActive
        })
        
        const isActive =
          item.path === location.pathname || isSubChildrenActive && isSubChildrenActive.length>0||
          (item.children && item.children.filter((children) => children.path === location.pathname)?.length > 0) ||
          item.is_active;
        const disabledChildrenCount =
          item.children?.length > 0 &&
          item.children.filter((children) => children.permission && permissions.filter((per) => children.permission?.includes(per)).length === 0)
            .length;
        const shouldChangeTimeInTransition=isSubChildrenActive && isSubChildrenActive.length>0
       
        return (
          <li
            key={idx}
            className={`level-1${isActive ? " active" : ""}${item.is_show_children ? " show-children" : ""}${
              (item.permission && permissions.filter((per) => item.permission?.includes(per)).length === 0) ||
              (item.children?.length > 0 && disabledChildrenCount === item.children.length)
                ? " disabled"
                : ""
            }`}
          >
            {item.children && item.children.length > 0 ? (
              <a className="d-flex align-items-center" onClick={() => setShowChildren(idx)} title={item.title} target={item.target}>
                {item.icon}
                <span>{item.title}</span>
                {item.children &&
                  item.children.length > 0 &&
                  (item.is_show_children ? <Icon name="ChevronDown" className="arrow-menu" /> : <Icon name="ChevronRight" className="arrow-menu" />)}
              </a>
            ) : (
              <Link className="d-flex align-items-center" to={item.path} title={item.title} target={item.target}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}
        
            {item.children && item.children.length > 0 && (
              <ul
                style={{
                  maxHeight:
                    item.is_show_children || (isActive && menuList.find((m) => m.is_show_children) === item) ? itemLength * 48 : null,
                  transition: `max-height ${shouldChangeTimeInTransition? isSubChildrenActive[0].children?.length *0.1      :  item.children.length * 0.1}s ease-in-out`,
                }}
              >
                {item.children.map((childrenItem, idxChild) => {
                  //handle third layer
                  if(childrenItem.children && childrenItem.children.length>0) {
                    const isSubChildrenActive =
                      childrenItem.path === location.pathname ||
                      (childrenItem.children && childrenItem.children.filter((children) => children.path === location.pathname)?.length > 0)
                    const isAddActiveClass=location.pathname.includes(childrenItem.path)
                    return (
                      <li
                        key={idxChild}
                        className={`level-2${isAddActiveClass||  childrenItem.path === location.pathname ? " active" : ""}${
                          childrenItem.permission && permissions.filter((per) => childrenItem.permission?.includes(per)).length === 0
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <a
                          className="d-flex align-items-center"
                          onClick={() => setShowSubChildren(idxChild)}
                          title={childrenItem.title}
                          target={childrenItem.target}
                          style={{pointerEvents:"auto"}}
                        >
                          <span>{childrenItem.title}</span>
                          {childrenItem.is_show_subChildren ? (
                            <Icon name="ChevronDown" className="arrow-menu" />
                          ) : (
                            <Icon name="ChevronRight" className="arrow-menu" />
                          )}
                        </a>
                        <ul
                          style={{
                            maxHeight: childrenItem.is_show_subChildren || (isSubChildrenActive && item.children.find((m) => m.is_show_children) === childrenItem) ? childrenItem.children.length * 48 : null,
                            transition: `max-height ${childrenItem.children.length * 0.1}s ease-in-out`,
                          }}
                        >
                          {childrenItem?.children.length > 0 &&
                            childrenItem.children.map((subItem,index) => (
                              <li
                                key={index}
                                className={`level-3${subItem.path === location.pathname ? " active" : ""}
                                }`}
                              >
                                <Link
                                  className="d-flex align-items-center"
                                  to={subItem.path}
                                  title={subItem.title}
                                  target={subItem.target}
                                >
                                  {subItem.icon}
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </li>
                    );
                     
                  }

                  return (
                  <li
                    key={idxChild}
                    className={`level-2${childrenItem.path === location.pathname ? " active" : ""}${
                      childrenItem.permission && permissions.filter((per) => childrenItem.permission?.includes(per)).length === 0 ? " disabled" : ""
                    }`}
                  >
                    <Link className="d-flex align-items-center" to={childrenItem.path} title={childrenItem.title} target={childrenItem.target}>
                      {childrenItem.icon}
                      {childrenItem.title}
                    </Link>
                  </li>)
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
