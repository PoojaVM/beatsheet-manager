import React from "react";

const CustomInput = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  onBlur,
  labelClass,
  inputType = "text",
  ...rest
}) => {
  return (
    <div className={labelClass || "my-4"}>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={label}
      >
        {label}
      </label>
      {inputType === "textarea" ? (
        <textarea
          className={
            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" +
            (error ? " border-red-500" : "")
          }
          id={label}
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
          {...rest}
        />
      ) : (
        <input
          className={
            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" +
            (error ? " border-red-500" : "")
          }
          id={label}
          type="text"
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
          {...rest}
        />
      )}
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
