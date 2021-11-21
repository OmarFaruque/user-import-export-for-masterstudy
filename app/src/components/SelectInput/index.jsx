import React from 'react';
import style from './select.scss';


export default function SelectInput(props) {
  const { label,customClass, name, type, value, placeholder, refresh, options, onChange, cmnt, index, row_index, order, onClick } = props;
  const items = [];

  Object.keys(options).forEach(function(k, v){
    items.push(<option key={v} value={k}>{options[k]}</option>);  
  });
  

  return (
    <div className={style.form_group}>
      {label && (
        <label htmlFor={name} className={style.form_label}>
          {label}
        </label>
      )}

    {
      name === 'selected_zone' && (
        <>
          <span onClick={onClick} className={refresh ? `${style.refreshAuto} ${style.refresh}` : `${style.refreshAuto}`}></span>
        </>
      )
    }
    {type==="select" && (
      <select
      className={
        customClass
          ? `${customClass} ${style.form_control}`
          : style.form_control
      }
      id={name}
      name={name}
      row_index={row_index}
      order={order}
      index={index}
      cmnt={cmnt}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      >
        {items.map(function(object, key){
          return(
            object
          )
        })}
      </select>
    )}
    </div>
  );
}