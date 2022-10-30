import { Component } from 'react';
import { Tabs, Input, Table, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './App.css';
import { formatDistanceToNow } from 'date-fns';

const { Text } = Typography;
export default class App extends Component {
  static insertPhone = (insertedPhone) => {
    let phones = JSON.parse(localStorage.getItem('phones'));
    const tmpPhone = { [insertedPhone]: { number: insertedPhone, lastUse: Number(new Date()) } };
    phones = phones === 'null' ? tmpPhone : { ...phones, ...tmpPhone };
    localStorage.setItem('phones', JSON.stringify(phones));
  };

  constructor() {
    super();
    this.state = { numbers: [] };
  }

  getPhones = () => {
    let phones = JSON.parse(localStorage.getItem('phones'));
    phones = phones === null ? [] : Object.values(phones);
    this.setState(() => ({ numbers: phones }));
  };

  render() {
    setInterval(() => {
      this.getPhones();
    }, 30000);
    const { numbers } = this.state;

    const phonesToShow = numbers
      .map((phone) => {
        const tmpPhone = phone;
        tmpPhone.date = formatDistanceToNow(tmpPhone.lastUse, { addSuffix: true });
        tmpPhone.key = `${tmpPhone.number}${tmpPhone.lastUse}}`;
        return tmpPhone;
      })
      .sort((a, b) => a.lastUse - b.lastUse);
    const columns = [
      {
        title: 'phone number',
        key: 'number',
        dataIndex: 'number',
        render: (text) => <Text copyable>{text}</Text>,
      },
      { title: 'last use', key: 'date', dataIndex: 'date' },
    ];
    return (
      <div className="App">
        <Tabs
          onChange={() => {
            this.getPhones();
          }}
          items={[
            {
              label: 'Insert phone number',
              key: 'item-1',
              children: (
                <Input
                  allowClear
                  size="large"
                  placeholder="phone number"
                  prefix={<PhoneOutlined />}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      App.insertPhone(e.target.value);
                    }
                  }}
                />
              ),
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
}
