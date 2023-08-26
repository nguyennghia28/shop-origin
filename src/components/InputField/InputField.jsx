import classNames from 'classnames/bind';

import style from './InputField.module.scss';

const cx = classNames.bind(style);

function InputField({
    type,
    id,
    name,
    placeholder,
    value,
    label,
    require,
    touched,
    error,
    onChange,
    onBlur,
    readonly,
    customClass,
}) {
    const Tag = type === 'textarea' ? 'textarea' : 'input';

    return (
        <>
            <div className={cx('input-field', customClass?.['textfeild'])}>
                <Tag
                    className={cx(customClass?.['textfeild'])}
                    type={type}
                    readOnly={readonly}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="on"
                />
                <label htmlFor={id}>
                    {label}
                    {require && <span>*</span>}
                </label>
            </div>
            {touched && error && <span className={cx('form-error')}>{error}</span>}
        </>
    );
}

export default InputField;
