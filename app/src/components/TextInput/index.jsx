import React from 'react';
import style from './textinput.scss';

export default function TextInput(props) {
  const { label,customClass, accept, name, rows, type, value, placeholder, min, max, onChange, onClick, cmnt, defaultChecked, index, row_index, order, defaultValue, readOnly } = props;

  return (
    
    <div className={style.form_group}>
      {label && (
        <label htmlFor={name} className={style.form_label}>
          {label}
        </label>
      )}
      {type === 'number' && (
        <input
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          type={type} 
          row_index={row_index}
          order={order}
          value={value}
          min={min}
          max={max}
          index={index}
          cmnt={cmnt}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {type === 'time' && (
        <input
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          type={type} 
          row_index={row_index}
          order={order}
          value={value}
          index={index}
          cmnt={cmnt}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {type === 'textarea' && (
        <textarea
          className={
            customClass
              ? `${style[customClass]} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          value={value}
          index={index}
          row_index={row_index}
          order={order}
          rows={rows}
          cmnt={cmnt}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {type === 'email' && (
        <input
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          type={type}
          cmnt={cmnt}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {type === 'text' && (
        <input
          className={
            customClass
              ? `${style[customClass]} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          cmnt={cmnt}
          index={index}
          onClick={onClick}
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      )}
    {type==="checkbox" && (
      <input
      className={
        customClass
          ? `${customClass} ${style.form_control}`
          : style.form_control
      }
      id={name}
      name={name}
      cmnt={cmnt}
      // defaultChecked={defaultChecked}
      type={type}
      value={value}
      row_index={row_index}
      checked={defaultChecked}
      onChange={onChange}
      />
    )}
  {type==="file" && (
      <input
      className={
        customClass
          ? `${customClass} ${style.form_control}`
          : style.form_control
      }
      id={name}
      name={name}
      type={type}
      value={value}
      row_index={row_index}
      accept={accept}
      onChange={onChange}
      />
    )}

    </div>
  );
}