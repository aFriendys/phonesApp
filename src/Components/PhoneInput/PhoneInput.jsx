import { Component } from 'react';
import { PhoneOutlined } from '@ant-design/icons';
import { Input } from 'antd';

export default class PhoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
  }

  onInputExec = (e) => {
    const { insertPhone } = this.props;
    const { inputValue } = this.state;
    if (e.key === 'Enter') {
      insertPhone(inputValue);
      this.setState(() => ({ inputValue: '' }));
    }
  };

  onInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    this.setState(() => ({ inputValue: value }));
  };

  render() {
    const { inputValue } = this.state;

    return (
      <Input
        allowClear
        size="large"
        placeholder="phone number"
        prefix={<PhoneOutlined />}
        value={inputValue}
        onChange={this.onInputChange}
        onKeyDown={this.onInputExec}
      />
    );
  }
}
