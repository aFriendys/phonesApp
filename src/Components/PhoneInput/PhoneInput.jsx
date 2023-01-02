import { PhoneOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useState } from 'react';

import styles from './PhoneInput.module.scss';

export default function PhoneInput({ insertPhone, lastPhone, inputRef }) {
  const [inputValue, setInputValue] = useState('');

  const onInputExec = () => {
    insertPhone(inputValue);
    setInputValue('');
  };

  const onInputChange = (e) => {
    setInputValue(e.target.value.replace(/\D/g, ''));
  };

  return (
    <div>
      <Input
        ref={inputRef}
        maxLength="10"
        allowClear
        size="large"
        placeholder="phone number"
        prefix={<PhoneOutlined />}
        value={inputValue}
        onChange={onInputChange}
        onPressEnter={onInputExec}
      />
      {lastPhone && (
        <div className={styles.wrapper}>
          Last used phone: <span className={styles.lastPhone}>{lastPhone}</span>
        </div>
      )}
    </div>
  );
}
