import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs, Toast } from 'antd-mobile';
import { userApi } from '../../services/userApi';
import { useUserStore } from '../../stores/userStore';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setUserInfo } = useUserStore();
  const [activeTab, setActiveTab] = useState('login');
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    try {
      const res = await userApi.login(values.username, values.password);
      setToken(res.token);
      setUserInfo(res.user);
      Toast.show({ icon: 'success', content: '登录成功' });
      navigate('/');
    } catch (e) {
      // error handled by interceptor
    }
  };

  const handleRegister = async (values: any) => {
    try {
      const res = await userApi.register(
        values.username,
        values.password,
        values.nickname,
      );
      setToken(res.token);
      setUserInfo(res.user);
      Toast.show({ icon: 'success', content: '注册成功' });
      navigate('/');
    } catch (e) {
      // error handled by interceptor
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="card w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gold mb-2">⚔️ 三国策略OL</h1>
          <p className="text-gray text-sm">招兵买马，逐鹿天下</p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        >
          <Tabs.Tab title="登录" key="login" />
          <Tabs.Tab title="注册" key="register" />
        </Tabs>

        {activeTab === 'login' ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            footer={
              <Button block type="submit" color="warning" size="large">
                登录
              </Button>
            }
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input type="password" placeholder="请输入密码" />
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            footer={
              <Button block type="submit" color="warning" size="large">
                注册
              </Button>
            }
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3位' },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input type="password" placeholder="请输入密码" />
            </Form.Item>
            <Form.Item name="nickname" label="昵称">
              <Input placeholder="请输入昵称（选填）" />
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}
