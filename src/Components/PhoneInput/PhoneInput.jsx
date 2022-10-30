import { Component } from 'react';
import { PhoneOutlined } from '@ant-design/icons';
import { Input } from 'antd';

export default class PhoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
  }

  render() {
    const { insertPhone } = this.props;
    const { inputValue } = this.state;
    return (
      <Input
        allowClear
        size="large"
        placeholder="phone number"
        prefix={<PhoneOutlined />}
        value={inputValue}
        onChange={(e) => {
          this.setState(() => ({ inputValue: e.target.value }));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            insertPhone(inputValue);
            this.setState(() => ({ inputValue: '' }));
          }
        }}
      />
    );
  }
}
