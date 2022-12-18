/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Tabs, Table, Typography, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import './App.scss';
import { formatDistanceToNow } from 'date-fns';

import PhoneInput from './PhoneInput';
import styles from './App.module.scss';
import Info from './Info';

const { Text } = Typography;

export default function App() {
  const [phones, setPhones] = useState([]);
  const [lastPhone, setLastPhone] = useState('');
  const [info, setInfo] = useState({ show: false, text: '1234' });
  const phonesToShow = phones
    .map((phone) => {
      const tmpPhone = phone;
      tmpPhone.date = formatDistanceToNow(tmpPhone.lastUse, { addSuffix: true });
      tmpPhone.key = `${tmpPhone.number}${tmpPhone.lastUse}`;
      return tmpPhone;
    })
    .sort((a, b) => a.lastUse - b.lastUse);
  const getPhones = () => {
    setPhones(localStorage.phones === null ? [] : Object.values(JSON.parse(localStorage.phones)));
  };

  const insertPhone = (number) => {
    const storedPhones = JSON.parse(localStorage.getItem('phones'));
    let tmpPhone = {};
    if (storedPhones[number] !== undefined) {
      tmpPhone = storedPhones[number];
      tmpPhone.lastUse = Number(new Date());
      setInfo((state) => ({ ...state, text: 'Phone updated' }));
    } else {
      tmpPhone = { number, lastUse: Number(new Date()), favorited: false };
      setInfo((state) => ({ ...state, text: 'Phone added' }));
    }
    localStorage.setItem('phones', JSON.stringify({ ...storedPhones, ...{ [number]: tmpPhone } }));
    setLastPhone(number);
    setInfo((state) => ({ ...state, show: true }));
  };

  const favoritePhone = ({ number, value }) => {
    const storedPhones = JSON.parse(localStorage.phones);
    storedPhones[number].favorited = value;
    localStorage.setItem('phones', JSON.stringify(storedPhones));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getPhones();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (localStorage.phones === undefined) {
      localStorage.setItem('phones', JSON.stringify({}));
    }
    getPhones();
  }, []);

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
            getPhones();
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
              getPhones();
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
      dataIndex: 'date',
      render: (text, elem) => <td className={elem.favorited ? styles.favorited : undefined}>{text}</td>,
      sorter: (a, b) => Number(b.date.replace(/[^0-9]/gi, '')) - Number(a.date.replace(/[^0-9]/gi, '')),
    },
  ];
  return (
    <div className="App">
      {info.show && <Info setInfo={setInfo}>{info.text}</Info>}
      <Tabs
        onChange={() => {
          getPhones();
        }}
        items={[
          {
            label: 'Insert phone number',
            key: 'item-1',
            children: <PhoneInput insertPhone={insertPhone} lastPhone={lastPhone} />,
          },
          {
            label: 'Phone numbers',
            key: 'item-2',
            children: <Table pagination={false} columns={columns} dataSource={phonesToShow} />,
          },
        ]}
      />
    </div>
  );
}
