import { useState, useRef, useEffect } from 'react';
import { Tabs, Table, Typography, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import './App.scss';
import { formatDistanceToNow } from 'date-fns';
import { DeleteOutlined } from '@ant-design/icons';

import useLocalStorage from '../Hooks/useLocalStorage';

import PhoneInput from './PhoneInput';
import styles from './App.module.scss';
import Info from './Info';

const { Text } = Typography;

export default function App() {
  const [phones, setPhones] = useLocalStorage('phones', '');
  const [lastPhone, setLastPhone] = useState('');
  const [info, setInfo] = useState({ show: false, text: '' });
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  const insertPhone = (number) => {
    setPhones((currentPhones) => {
      const newPhones = { ...currentPhones };
      let tmpPhone = {};
      if (currentPhones[number] !== undefined) {
        tmpPhone = newPhones[number];
        tmpPhone.lastUse = Number(new Date());
        setInfo((state) => ({ ...state, text: 'Phone updated' }));
      } else {
        tmpPhone = { number, lastUse: Number(new Date()), favorited: false };
        setInfo((state) => ({ ...state, text: 'Phone added' }));
      }
      return { ...currentPhones, ...{ [number]: tmpPhone } };
    });
    setLastPhone(number);
    setInfo((state) => ({ ...state, show: true }));
  };

  const favoritePhone = ({ number, value }) => {
    setPhones((currentPhones) => {
      const newPhones = { ...currentPhones };
      newPhones[number].favorited = value;
      return newPhones;
    });
    setInfo(() => ({ show: true, text: `Phone ${value ? 'added to' : 'removed from'} favorites` }));
  };

  const deletePhone = ({ number }) => {
    setPhones((currentPhones) => {
      const newPhones = { ...currentPhones };
      delete newPhones[number];
      return newPhones;
    });
    setInfo(() => ({ show: true, text: 'Phone deleted' }));
  };

  const columns = [
    {
      title: 'Favorited',
      key: 'favorited',
      dataIndex: 'favorited',
      render: (fav, elem) => (
        <Checkbox
          defaultChecked={fav}
          onChange={(e) => {
            favoritePhone({ number: elem.number, value: e.target.checked });
          }}
        />
      ),
      sorter: (a, b) => Number(b.favorited) - Number(a.favorited),
    },
    {
      title: 'Phone number',
      key: 'number',
      dataIndex: 'number',
      render: (text, elem) => (
        <Text
          copyable={{
            onCopy: () => {
              insertPhone(elem.number);
            },
          }}
          className={elem.favorited ? styles.favorited : undefined}
        >
          {text}
        </Text>
      ),
      sorter: (a, b) => b.number - a.number,
    },
    {
      title: 'Last use',
      key: 'date',
      dataIndex: 'lastUse',
      render: (text, elem) => (
        <td className={elem.favorited ? styles.favorited : undefined}>
          {formatDistanceToNow(text, { addSuffix: true })}
        </td>
      ),
      defaultSortOrder: 'descend',
      sorter: (a, b) => b.lastUse - a.lastUse,
    },
    {
      key: 'delete',
      render: (_, elem) => (
        <DeleteOutlined
          onClick={() => {
            deletePhone({ number: elem.number });
          }}
        />
      ),
    },
  ];
  return (
    <div className="App">
      {info.show && <Info setInfo={setInfo}>{info.text}</Info>}
      <Tabs
        onChange={(value) => {
          if (value === 'insert') {
            setTimeout(() => {
              inputRef.current.focus();
            }, 150);
          }
        }}
        items={[
          {
            label: 'Insert phone number',
            key: 'insert',
            children: <PhoneInput insertPhone={insertPhone} lastPhone={lastPhone} inputRef={inputRef} />,
          },
          {
            label: 'Phone numbers',
            key: 'explore',
            children: <Table pagination={false} columns={columns} dataSource={Object.values(phones)} />,
          },
        ]}
      />
    </div>
  );
}
